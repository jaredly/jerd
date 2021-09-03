// Let's ensure some invariants are met!

import { Location } from '../../parsing/parser';
import { idName, refName } from '../../typing/env';
import { LocatedError, UniqueError } from '../../typing/errors';
import { Env, Symbol, UserReference } from '../../typing/types';
import { debugExpr } from '../irDebugPrinter';
import { printToString } from '../printer';
import { maxUnique } from './optimize/inline';
import { defaultVisitor, transformExpr, Visitor } from './transform';
import { Expr, Loc, UserTypeReference } from './types';
import { handlerSym } from './utils';

export const collectSymDeclarationsVisitor = () => {
    const defined: { [unique: number]: true } = {};
    const undefinedUses: Array<{ sym: Symbol; loc: Location }> = [];
    const decls: Array<{ sym: Symbol; loc: Loc; type: string }> = [];
    const visitor: Visitor = {
        ...defaultVisitor,
        stmt: (stmt) => {
            switch (stmt.type) {
                // Oh wait, assign shouldn't count
                case 'Assign':
                    if (!defined[stmt.sym.unique]) {
                        undefinedUses.push({ sym: stmt.sym, loc: stmt.loc });
                    }
                    return null;
                case 'Define':
                    defined[stmt.sym.unique] = true;
                    decls.push({
                        sym: stmt.sym,
                        loc: stmt.loc,
                        type: stmt.type,
                    });
                    return null;
            }
            return null;
        },
        expr: (expr) => {
            if (expr.type === 'lambda') {
                // console.log('expr', expr.loc);
                expr.args.forEach((arg) => {
                    defined[arg.sym.unique] = true;
                    decls.push({ sym: arg.sym, loc: expr.loc, type: 'arg' });
                });
            }
            if (expr.type === 'var' && !defined[expr.sym.unique]) {
                undefinedUses.push({ sym: expr.sym, loc: expr.loc });
            }
            return null;
        },
    };
    return { decls, undefinedUses, defined, visitor };
};

export const collectSymDeclarations = (expr: Expr) => {
    const {
        decls,
        undefinedUses,
        defined,
        visitor,
    } = collectSymDeclarationsVisitor();
    transformExpr(expr, visitor);
    return { decls, undefinedUses, defined };
};

export const uniquesReallyAreUnique = (expr: Expr, env?: Env) => {
    const max = maxUnique(expr);
    if (env && max > env.local.unique.current) {
        throw new Error(
            `The max unique is bigger than the current ${max} ${env.local.unique.current}`,
        );
    }
    const { decls, undefinedUses } = collectSymDeclarations(expr);
    const seen: { [key: string]: Array<{ sym: Symbol; loc: Loc }> } = {};
    const duplicates = [];
    decls.forEach((decl) => {
        if (decl.sym.unique === handlerSym.unique) {
            return; // ignore them
        }
        if (!seen[decl.sym.unique]) {
            seen[decl.sym.unique] = [decl];
        } else {
            seen[decl.sym.unique].push(decl);
        }
    });
    // console.log(seen);
    let failed: Array<string> = [];
    Object.keys(seen).forEach((number) => {
        if (seen[number].length > 1) {
            failed.push(number);
        }
    });
    if (failed.length > 0) {
        if (env) {
            console.log(printToString(debugExpr(env, expr), 100));
        }
        throw new UniqueError(
            seen[failed[0]][1].loc,
            expr,
            +failed[0],
            // `Multiple declarations for unique ${failed[0]}.`,
        );
    }
    // if (undefinedUses.length > 0) {
    //     throw new LocatedError(undefinedUses[0], `Undefined unique usage!`);
    // }
    return undefinedUses;
};

export const getTypeDependencies = (expr: Expr): Array<UserReference> => {
    const deps: { [key: string]: UserReference } = {};
    transformExpr(expr, {
        ...defaultVisitor,
        type: (t) => {
            if (t.type === 'ref' && t.ref.type === 'user') {
                deps[idName(t.ref.id)] = t.ref;
            }
            return null;
        },
        // expr: (expr) => {
        // if (expr.is.type === 'ref' && expr.is.ref.type === 'user') {
        //     deps[idName(expr.is.ref.id)] = expr.is.ref;
        // }
        // if (expr.is.type === 'lambda') {
        //     expr.is.args.forEach((arg) => {
        //         if (arg.type === 'ref' && arg.ref.type === 'user') {
        //             deps[idName(arg.ref.id)] = arg.ref;
        //         }
        //     });
        //     if (expr.is.res.type === 'ref') {
        //         deps[idName(expr.is.res.ref.)] = expr.is.res.ref;
        //     }
        // }
        // }
    });
    return Object.keys(deps).map((k) => deps[k]);
};
