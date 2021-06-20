import { newSym } from '../../../typing/env';
import { LocatedError } from '../../../typing/errors';
import { Env, nullLocation, Symbol, symbolsEqual } from '../../../typing/types';
import { reUnique } from '../../typeScriptPrinterSimple';
import {
    defaultVisitor,
    ExprVisitor,
    transformExpr,
    transformStmt,
    Visitor,
} from '../transform';
import {
    Apply,
    Block,
    Define,
    Expr,
    LambdaExpr,
    Loc,
    Stmt,
    typesEqual,
} from '../types';
import {
    assign,
    block,
    bool,
    boolLiteral,
    builtin,
    callExpression,
    define,
    handlerSym,
    iffe,
    ifStatement,
    pureFunction,
    var_,
    void_,
} from '../utils';
import { Context, isConstant } from './optimize';

// When we see an immediate call,
// we need to boost up some statements to the closest relevant place
// I guess the closest block.

// Now, ... when ... we ... hmm ....
// Ok, so it would be good to
/* have a very concrete understanding of
"possible execution blocks"

'is this statement the start of an execution block'
if so, we need to check the 'continue' flag at the start of it.

like, if we have

if true {
	return 20
} else {
	x = 20
}

hmmmm

so, I *think* we have the assurance that we won't have things like this.

If we come across an "if", it will /either be terminal/, or it /wont have any returns/.
Returns are terminal.

Ok yeah, so we should verify that as we go, but I'm feeling good about it.

OHHHwerwer
nope
because of the way we compile switches.
which idk maybe we could revisit
but not right now.

ok, so it's definitely possible to have

if x {
	return y
}

if z {
	return 10
}

return 20

*/

export const pushMulti = (v: Array<Stmt>, s: Stmt | Array<Stmt>) => {
    if (Array.isArray(s)) {
        v.push(...s);
    } else {
        v.push(s);
    }
};

export const returnsToAssignsInner = (
    env: Env,
    stmts: Array<Stmt>,
    sym: Symbol,
    continueSym: Symbol,
): Array<Stmt> => {
    const sections: Array<Array<Stmt>> = [[]];
    stmts.forEach((stmt, i) => {
        if (stmt.type === 'Loop') {
            pushMulti(
                sections[sections.length - 1],
                transformStmt(stmt, {
                    ...defaultVisitor,
                    expr: (expr) => false, // no recursing into expressions
                    stmt: (inner) => {
                        if (inner.type === 'Return') {
                            return [
                                assign(sym, inner.value),
                                assign(
                                    continueSym,
                                    boolLiteral(false, inner.loc),
                                ),
                                { type: 'Break', loc: inner.loc },
                            ];
                        }
                        if (inner.type === 'Loop' && inner !== stmt) {
                            throw new LocatedError(
                                inner.loc,
                                `Not handling nested loops atm`,
                            );
                        }
                        return null;
                    },
                }),
            );
            // Got to start a new section
            sections.push([]);
        } else if (stmt.type === 'if') {
            sections[sections.length - 1].push({
                ...stmt,
                yes: {
                    ...stmt.yes,
                    items: returnsToAssignsInner(
                        env,
                        stmt.yes.items,
                        sym,
                        continueSym,
                    ),
                },
                no: stmt.no
                    ? {
                          ...stmt.no,
                          items: returnsToAssignsInner(
                              env,
                              stmt.no.items,
                              sym,
                              continueSym,
                          ),
                      }
                    : stmt.no,
            });
            sections.push([]);
        } else if (stmt.type === 'Return') {
            sections[sections.length - 1].push(
                assign(sym, stmt.value),
                assign(continueSym, boolLiteral(false, stmt.loc)),
            );
        } else {
            sections[sections.length - 1].push(stmt);
        }
    });

    let last: Stmt | null = null;
    for (let i = sections.length - 1; i > 0; i--) {
        if (sections[i].length === 0) {
            continue;
        }
        last = ifStatement(
            var_(continueSym, nullLocation, bool),
            block([...sections[i], ...(last ? [last] : [])], nullLocation),
            null,
            nullLocation,
        );
    }

    return sections[0].concat(last ? [last] : []);
};

export const returnsToAssigns = (
    env: Env,
    stmts: Array<Stmt>,
    sym: Symbol,
): Array<Stmt> => {
    // So the way this can happen is:
    // ok also loops can have returns?

    const continueSym = newSym(env, 'continueBlock');

    const newStmts = returnsToAssignsInner(env, stmts, sym, continueSym);

    // return stmts.map((stmt, i) => {
    // 	if (i < stmts.length - 1) {
    // 		// TODO: assert it doesn't contain returns
    // 		return stmt
    // 	} else {
    // 		// It's the terminal one!
    // 		if (stmt.type === 'Return') {
    // 			return assign(sym, stmt.value)
    // 		} else if (stmt.type === 'if') {
    // 			// here's the divergent path folks!
    // 		}
    // 	}
    //     if (stmt.type === 'Return') {
    //         return assign(sym, stmt.value);
    //     }
    //     return stmt;
    // });
    return [define(continueSym, boolLiteral(true, nullLocation)), ...newStmts];
};

// const getIFFE = (expr: Expr) => {
//     if (
//         expr.type === 'apply' &&
//         expr.target.type === 'lambda' &&
//         expr.args.length === 0 &&
//         expr.target.body.items.length === 1 &&
//         expr.target.body.items[0].type === 'Return'
//     ) {
//         return expr.target.body.items[0].value;
//     }
// 	if (expr.type === 'apply' && expr.target.type === 'lambda')
//     return null;
// };

export const flattenLambda = (
    env: Env,
    expr: Apply,
    target: LambdaExpr,
    resultSym?: Symbol,
) => {
    const extras: Array<Stmt> = [];
    const ta = target.args;
    expr.args.forEach((arg, i) => {
        extras.push(define(ta[i].sym, arg, arg.loc));
    });

    // Shortcut, if the function body is just a single return
    if (
        target.body.items.length === 1 &&
        target.body.items[0].type === 'Return'
    ) {
        return { stmts: extras, expr: target.body.items[0].value };
    }

    const result = resultSym ? resultSym : newSym(env, 'result');
    if (resultSym == null) {
        extras.push(define(result, undefined, expr.loc, expr.is));
    }
    extras.push(...returnsToAssigns(env, target.body.items, result));
    return { stmts: extras, expr: var_(result, expr.loc, expr.is) };
};

export const flattenImmediateCalls2 = (ctx: Context, expr: Expr) => {
    return transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            if (expr.type === 'apply' && expr.target.type === 'lambda') {
                // If there are no args, we just check for a single-return body
                if (expr.target.args.length === 0) {
                    if (
                        expr.target.body.items.length === 1 &&
                        expr.target.body.items[0].type === 'Return'
                    ) {
                        return expr.target.body.items[0].value;
                    } else {
                        return null;
                    }
                }
                const ta = expr.target.args;
                // If there are args, then we convert this to an iffe, and inline the args.
                // Perhaps we can get one step closer.
                return iffe(
                    ctx.env,
                    block(
                        [
                            ...expr.args.map((arg, i) => {
                                return define(ta[i].sym, arg, arg.loc);
                            }),
                            ...expr.target.body.items,
                        ],
                        expr.loc,
                    ),
                );
            }
            return null;
            // return getIFFE(expr);
        },
        stmt: (stmt) => {
            // Special case for returning an applied call; we can shortcut some things
            if (
                stmt.type === 'Return' &&
                stmt.value.type === 'apply' &&
                stmt.value.target.type === 'lambda'
            ) {
                const extras: Array<Stmt> = [];
                const ta = stmt.value.target.args;
                stmt.value.args.forEach((arg, i) => {
                    extras.push(define(ta[i].sym, arg, arg.loc));
                });
                return [...extras, ...stmt.value.target.body.items];
            }

            // Special case for when we're defining a variable;
            // we don't need to create an extra "result" variable
            // to store things in.
            if (
                stmt.type === 'Define' &&
                stmt.value != null &&
                stmt.value.type === 'apply' &&
                stmt.value.target.type === 'lambda'
            ) {
                const result = flattenLambda(
                    ctx.env,
                    stmt.value,
                    stmt.value.target,
                    stmt.sym,
                );
                return [{ ...stmt, value: null }, ...result.stmts];
            }

            const extras: Array<Stmt> = [];
            const result = transformStmt(stmt, {
                ...defaultVisitor,
                stmt: (inner) => {
                    // Don't traverse nested statements; we want to
                    // be the closest statement to the expression
                    if (inner !== stmt) {
                        return false;
                    }
                    return null;
                },
                expr: (expr) => {
                    if (
                        expr.type === 'apply' &&
                        expr.target.type === 'lambda'
                    ) {
                        const result = flattenLambda(
                            ctx.env,
                            expr,
                            expr.target,
                        );
                        extras.push(...result.stmts);
                        return result.expr;
                    }
                    return null;
                },
            });
            if (extras.length === 0) {
                return result === stmt ? null : result;
            }
            return extras.concat(Array.isArray(result) ? result : [result]);
        },
    });
};
