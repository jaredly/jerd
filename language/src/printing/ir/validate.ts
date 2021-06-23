// Validate that types are correct

import { Location } from '../../parsing/parser';
import { LocatedError, TypeMismatch } from '../../typing/errors';
import { showLocation } from '../../typing/typeExpr';
import { Env } from '../../typing/types';
import { debugExpr } from '../irDebugPrinter';
import { printToString } from '../printer';
import { defaultVisitor, transformExpr } from './transform';
import { Expr, Stmt, Type, typesEqual } from './types';
import { showType } from './utils';

export type Violation = {
    message: string;
    expected?: Type;
    found: Expr;
    loc: Location;
};

// TODO validate type arguments and such

export const showViolation = (env: Env, v: Violation, fileName: string) => {
    let text = `${fileName}:${showLocation(v.loc)} ${v.message}`;
    text += `\n- Found: ${printToString(debugExpr(env, v.found), 100)}`;
    text += `\n- Found(type): ${showType(env, v.found.is)}`;
    if (v.expected) {
        text += `\n- Expected: ${showType(env, v.expected)}`;
    }
    return text;
};

export const validate = (expr: Expr) => {
    const violations: Array<Violation> = [];
    transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            validateExpr(expr, violations);
            return null;
        },
        stmt: (stmt) => {
            validateStmt(stmt, violations);
            return null;
        },
    });
    return violations;
};

// NEXT STEP:
// make a function to "get argument types for a cps-lambda"

export const validateExpr = (expr: Expr, violations: Array<Violation>) => {
    switch (expr.type) {
        case 'apply': {
            if (
                expr.target.is.type !== 'lambda' &&
                expr.target.is.type !== 'cps-lambda'
            ) {
                violations.push({
                    loc: expr.loc,
                    message: `Apply target isn't a lambda`,
                    found: expr.target,
                });
                return;
            }
            if (expr.target.is.args.length !== expr.args.length) {
                violations.push({
                    loc: expr.loc,
                    message: `Wrong number of arguments ${expr.args.length}, expected ${expr.target.is.args.length}`,
                    found: expr,
                    expected: expr.target.is,
                });
                return;
            }
            expr.target.is.args.forEach((t, i) => {
                if (!typesEqual(t, expr.args[i].is)) {
                    violations.push({
                        loc: expr.loc,
                        message: `Argument ${i} type mismatch`,
                        found: expr.args[i],
                        expected: t,
                    });
                }
            });
        }
    }
};

export const validateStmt = (stmt: Stmt, violations: Array<Violation>) => {
    // typesEqual
};
