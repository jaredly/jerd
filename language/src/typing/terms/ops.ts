// Binary operations

import { Identifier, nullLocation, Ops } from '../../parsing/parser';
import {
    Env,
    Term,
    LambdaType,
    typesEqual,
    RecordDef,
    idsEqual,
} from '../types';
import { Expression, Location } from '../../parsing/parser';
import { showType } from '../unify';
import typeExpr, {
    applyTypeVariables,
    applyTypeVariablesToRecord,
    showLocation,
} from '../typeExpr';
import { getTypeError } from '../getTypeError';
import { idFromName, idName, resolveIdentifier } from '../env';
import { LocatedError, UnresolvedIdentifier } from '../errors';
import { refName } from '../typePattern';

const typeNewOp = (
    env: Env,
    left: Term,
    op: string,
    id: Identifier | null,
    right: Expression,
    location: Location,
): Term | null => {
    let fn: Term;
    if (id != null) {
        const found = resolveIdentifier(env, id);
        if (!found) {
            throw new UnresolvedIdentifier(id, env);
        }
        if (found.is.type !== 'ref') {
            throw new LocatedError(
                id.location,
                `Identifier isn't a ref ${showType(env, found.is)}`,
            );
        }
        const idx = env.global.recordGroups[refName(found.is.ref)].indexOf(op);
        if (idx === -1) {
            throw new LocatedError(
                id.location,
                `Record ${refName(found.is.ref)} has no member ${op}`,
            );
        }
        const t = env.global.types[refName(found.is.ref)] as RecordDef;
        fn = {
            type: 'Attribute',
            target: found,
            idx: idx,
            is: t.items[idx],
            location: id.location,
            ref: found.is.ref,
            inferred: true,
        };
        // TODO: allow ambiguity
    } else if (env.global.attributeNames[op]) {
        const { idx, id } = env.global.attributeNames[op];
        let found: Term | null = null;
        for (let k of Object.keys(env.global.terms)) {
            const is = env.global.terms[k].is;
            if (
                is.type === 'ref' &&
                is.ref.type === 'user' &&
                idsEqual(is.ref.id, id)
            ) {
                found = {
                    type: 'ref',
                    ref: { type: 'user', id: idFromName(k) },
                    location: location,
                    is: env.global.terms[k].is,
                };
                break;
            }
        }
        if (!found) {
            throw new LocatedError(
                location,
                `Unable to find an implementor for the record for ${op}`,
            );
        }
        let t = env.global.types[idName(id)] as RecordDef;
        if (found.is.type === 'ref') {
            t = applyTypeVariablesToRecord(
                env,
                t,
                found.is.typeVbls,
                found.is.location,
            );
        }
        fn = {
            type: 'Attribute',
            target: found,
            idx: idx,
            is: t.items[idx],
            location: location,
            ref: { type: 'user', id },
            inferred: true,
        };
    } else {
        return null;
    }

    if (fn.is.type !== 'lambda') {
        throw new Error(`${op} is not a function`);
    }
    if (fn.is.args.length !== 2) {
        throw new Error(`${op} is not a binary function`);
    }

    const rarg =
        right.type === 'ops' ? _typeOps(env, right) : typeExpr(env, right);

    const firstErr = getTypeError(
        env,
        left.is,
        fn.is.args[0],
        left.location || nullLocation,
    );
    if (firstErr != null) {
        throw firstErr;
    }
    const secondErr = getTypeError(
        env,
        rarg.is,
        fn.is.args[1],
        rarg.location || nullLocation,
    );
    if (secondErr != null) {
        throw secondErr;
    }

    return {
        type: 'apply',
        originalTargetType: fn.is,
        location:
            left.location && right.location
                ? {
                      start: left.location.start,
                      end: right.location.end,
                  }
                : null,
        target: fn,
        hadAllVariableEffects: false,
        effectVbls: null,
        typeVbls: [],
        args: [left, rarg],
        is: fn.is.res,
    };
};

const typeOp = (
    env: Env,
    left: Term,
    op: string,
    id: Identifier | null,
    right: Expression,
    location: Location,
): Term => {
    const result = typeNewOp(env, left, op, id, right, location);
    if (result != null) {
        return result;
    }

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
        hadAllVariableEffects: false,
        effectVbls: null,
        typeVbls: [],
        args: [left, rarg],
        is: is.res,
    };
};

const precedence = [['='], ['+', '-'], ['/', '*'], ['^']];

type Section = {
    ops: Ops;
    id: Identifier | null;
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
    if (!expr.rest.some((ex) => group.includes(ex.op[0]))) {
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
        id: null,
        op: null,
    };
    expr.rest.forEach(({ op, id, right, location }) => {
        if (group.includes(op[0])) {
            sections.push(section);
            section = {
                ops: { type: 'ops', first: right, rest: [], location },
                id,
                op,
            };
        } else {
            section.ops.rest.push({ op, id, right, location });
        }
    });
    sections.push(section);
    if (sections[0].op != null) {
        throw new Error(`Why does the first section have an op`);
    }
    return {
        type: 'ops',
        first: organizeOps(sections[0].ops, otherGroups),
        rest: sections.slice(1).map(({ op, id, ops }) => ({
            op: op!,
            id,
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
    expr.rest.forEach(({ op, id, right, location }) => {
        left = typeOp(env, left, op, id, right, location);
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
