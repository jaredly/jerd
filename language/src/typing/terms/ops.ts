// Binary operations

import { nullLocation, Ops } from '../../parsing/parser';
import { Env, Term, LambdaType, typesEqual } from '../types';
import { Expression, Location } from '../../parsing/parser';
import { showType } from '../unify';
import typeExpr, { applyTypeVariables, showLocation } from '../typeExpr';
import { getTypeError } from '../getTypeError';

const typeOp = (
    env: Env,
    left: Term,
    op: string,
    right: Expression,
    location: Location,
): Term => {
    let is = env.global.builtins[op];
    if (!is) {
        throw new Error(`Unexpected binary op ${op}`);
    }
    if (is.type !== 'lambda') {
        throw new Error(`${op} is not a function`);
    }
    if (is.args.length !== 2) {
        throw new Error(`${op} is not a binary function`);
    }
    // Shortcut
    const rarg =
        right.type === 'ops' ? _typeOps(env, right) : typeExpr(env, right);

    if (is.typeVbls.length === 1) {
        if (!typesEqual(left.is, rarg.is)) {
            throw new Error(
                `Binops must have same-typed arguments: ${showType(
                    env,
                    left.is,
                )} vs ${showType(env, rarg.is)} at ${showLocation(
                    left.location,
                )}`,
            );
        }
        is = applyTypeVariables(env, is, [left.is]) as LambdaType;
    }

    const firstErr = getTypeError(
        env,
        left.is,
        is.args[0],
        left.location || nullLocation,
    );
    if (firstErr != null) {
        throw firstErr;
        // throw new Error(
        //     `first arg to ${op} wrong type. ${showType(
        //         env,
        //         left.is,
        //     )} vs ${showType(env, is.args[0])} at ${showLocation(
        //         left.location,
        //     )}`,
        // );
    }
    const secondErr = getTypeError(
        env,
        rarg.is,
        is.args[1],
        rarg.location || nullLocation,
    );
    if (secondErr != null) {
        throw secondErr;
    }
    return {
        type: 'apply',
        originalTargetType: is,
        location:
            left.location && right.location
                ? {
                      start: left.location.start,
                      end: right.location.end,
                  }
                : null,
        target: {
            location,
            type: 'ref',
            ref: { type: 'builtin', name: op },
            is,
        },
        effectVbls: null,
        typeVbls: [],
        args: [left, rarg],
        is: is.res,
    };
};

const precedence = [['=='], ['++', '+', '-'], ['/', '*'], ['^']];

type Section = {
    ops: Ops;
    op: string | null;
};

const organizeOps = (expr: Ops, groups: Array<Array<string>>): Ops => {
    if (!groups.length) {
        return expr;
    }
    // ok how do we do this?
    // for (let group of precedence) {
    const group = groups[0];
    const otherGroups = groups.slice(1);
    if (!expr.rest.some((ex) => group.includes(ex.op))) {
        return organizeOps(expr, otherGroups);
    }

    const sections: Array<Section> = [];
    let section: Section = {
        ops: {
            type: 'ops',
            first: expr.first,
            rest: [],
            location: expr.location,
        },
        op: null,
    };
    expr.rest.forEach(({ op, right, location }) => {
        if (group.includes(op)) {
            sections.push(section);
            section = {
                ops: { type: 'ops', first: right, rest: [], location },
                op,
            };
        } else {
            section.ops.rest.push({ op, right, location });
        }
    });
    sections.push(section);
    if (sections[0].op != null) {
        throw new Error(`Why does the first section have an op`);
    }
    return {
        type: 'ops',
        first: organizeOps(sections[0].ops, otherGroups),
        rest: sections.slice(1).map(({ op, ops }) => ({
            op: op!,
            right: organizeOps(ops, otherGroups),
            location: ops.location,
        })),
        location: expr.location,
    };
};

const _typeOps = (env: Env, expr: Ops): Term => {
    let left: Term =
        expr.first.type === 'ops'
            ? _typeOps(env, expr.first)
            : typeExpr(env, expr.first);
    expr.rest.forEach(({ op, right, location }) => {
        left = typeOp(env, left, op, right, location);
    });
    return left;
};

export const typeOps = (env: Env, expr: Ops): Term => {
    return _typeOps(env, organizeOps(expr, precedence));
    // ok, left associative, right? I think so.
    // let left: Term = typeExpr(env, expr.first);
    // expr.rest.forEach(({ op, right, location }) => {
    //     left = typeOp(env, left, op, right, location);
    // });
    // return left;
};
