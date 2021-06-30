// Binary operations

import { Identifier, Op, Ops } from '../../parsing/parser';
import {
    Env,
    Term,
    LambdaType,
    typesEqual,
    RecordDef,
    idsEqual,
    Id,
    Type,
    encompassingLoc,
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
import { LocatedError, TypeMismatch, UnresolvedIdentifier } from '../errors';
import { refName } from '../typePattern';
import { walkType } from '../typeType';
import { float, int, numeric, string } from '../preset';
import { termToPretty } from '../../printing/printTsLike';
import { printToString } from '../../printing/printer';

// loosest at the top, tightest at the bottom
const precedence = [
    ['&'],
    ['|'],
    ['='],
    ['>', '<'],
    ['+', '-'],
    ['/', '*'],
    ['^'],
];

export const findUnaryOp = (
    env: Env,
    id: Id,
    idx: number,
    type: Type,
    location: Location,
): Term | null => {
    for (let k of Object.keys(env.global.terms)) {
        const is = env.global.terms[k].is;
        if (
            is.type === 'ref' &&
            is.ref.type === 'user' &&
            idsEqual(is.ref.id, id)
        ) {
            const found: Term = {
                type: 'ref',
                ref: { type: 'user', id: idFromName(k) },
                location: location,
                is: env.global.terms[k].is,
            };
            let t = env.global.types[idName(id)] as RecordDef;
            if (found.is.type === 'ref') {
                t = applyTypeVariablesToRecord(
                    env,
                    t,
                    found.is.typeVbls,
                    found.is.location,
                    id.hash,
                );
            }
            const tis = t.items[idx];
            if (tis.type !== 'lambda') {
                continue;
            }
            if (tis.args.length !== 1) {
                continue;
            }
            const e1 = getTypeError(env, type, tis.args[0], location);
            if (e1) {
                continue;
            }
            return {
                type: 'Attribute',
                target: found,
                idx: idx,
                is: t.items[idx],
                location: location,
                ref: { type: 'user', id },
                inferred: true,
            };
        }
    }
    return null;
};

const findOp = (
    env: Env,
    id: Id,
    idx: number,
    ltype: Type,
    rtype: Type,
    location: Location,
): Term | null => {
    for (let k of Object.keys(env.global.terms)) {
        const is = env.global.terms[k].is;
        if (
            is.type === 'ref' &&
            is.ref.type === 'user' &&
            idsEqual(is.ref.id, id)
        ) {
            const found: Term = {
                type: 'ref',
                ref: { type: 'user', id: idFromName(k) },
                location: location,
                is: env.global.terms[k].is,
            };
            let t = env.global.types[idName(id)] as RecordDef;
            if (found.is.type === 'ref') {
                t = applyTypeVariablesToRecord(
                    env,
                    t,
                    found.is.typeVbls,
                    found.is.location,
                    id.hash,
                );
            }
            const tis = t.items[idx];
            if (tis.type !== 'lambda') {
                continue;
            }
            if (tis.args.length !== 2) {
                continue;
            }
            const e1 = getTypeError(env, ltype, tis.args[0], location);
            const e2 = getTypeError(env, rtype, tis.args[1], location);
            if (e1 || e2) {
                continue;
            }
            return {
                type: 'Attribute',
                target: found,
                idx: idx,
                is: t.items[idx],
                location: location,
                ref: { type: 'user', id },
                inferred: true,
            };
        }
    }
    return null;
};

const findMatchingOp = (
    env: Env,
    op: string,
    left: Term,
    rarg: Term,
    location: Location,
) => {
    for (let { idx, id } of env.global.attributeNames[op]) {
        // const { idx, id } = env.global.attributeNames[op][0];
        // console.log(op, idx, id, 'OP');
        const found = findOp(env, id, idx, left.is, rarg.is, location);
        if (found != null) {
            return found;
        }
    }
    return null;
};

const typeNewOp = (
    env: Env,
    left: Term,
    op: Op,
    rarg: Term,
    location: Location,
): Term | null => {
    // const rarg =
    //     right.type === 'ops' ? _typeOps(env, right) : typeExpr(env, right);

    let fn: Term;
    if (op.hash != null) {
        if (op.hash === '#builtin') {
            return null;
        }
        const [baseHash, attrHash, idxRaw] = op.hash.slice(1).split('#');
        const idx = +idxRaw;
        if (isNaN(idx)) {
            throw new LocatedError(
                op.location,
                `Invalid binop hash ${op.hash.split('#').join(', ')}`,
            );
        }
        const target = resolveIdentifier(env, {
            type: 'id',
            text: '',
            hash: '#' + baseHash,
            location: op.location,
        });
        if (!target) {
            throw new LocatedError(
                op.location,
                `Unable to find binop base ${baseHash}`,
            );
        }
        if (target.is.type !== 'ref') {
            throw new LocatedError(op.location, `binop target is not a ref`);
        }
        const id = idFromName(attrHash);
        let t = env.global.types[idName(id)] as RecordDef;
        if (target.is.typeVbls.length) {
            t = applyTypeVariablesToRecord(
                env,
                t,
                target.is.typeVbls,
                op.location,
                attrHash,
            );
        }
        if (t.type !== 'Record') {
            throw new LocatedError(op.location, `Not a record ${attrHash}`);
        }
        fn = {
            type: 'Attribute',
            target,
            idx: idx,
            is: t.items[idx],
            location: op.location,
            ref: { type: 'user', id },
            inferred: true,
        };
        // } else if (id != null) {
        //     const found = resolveIdentifier(env, id);
        //     if (!found) {
        //         throw new UnresolvedIdentifier(id, env);
        //     }
        //     if (found.is.type !== 'ref') {
        //         throw new LocatedError(
        //             id.location,
        //             `Identifier isn't a ref ${showType(env, found.is)}`,
        //         );
        //     }
        //     const idx = env.global.recordGroups[refName(found.is.ref)].indexOf(
        //         op.text,
        //     );
        //     if (idx === -1) {
        //         throw new LocatedError(
        //             id.location,
        //             `Record ${refName(found.is.ref)} has no member ${op}`,
        //         );
        //     }
        //     const t = env.global.types[refName(found.is.ref)] as RecordDef;
        //     fn = {
        //         type: 'Attribute',
        //         target: found,
        //         idx: idx,
        //         is: t.items[idx],
        //         location: id.location,
        //         ref: found.is.ref,
        //         inferred: true,
        //     };
    } else if (env.global.attributeNames[op.text]) {
        const found = findMatchingOp(env, op.text, left, rarg, location);
        if (found == null) {
            return null;
        }
        fn = found;
    } else {
        return null;
    }

    if (fn.is.type !== 'lambda') {
        throw new Error(`${op} is not a function`);
    }
    if (fn.is.args.length !== 2) {
        throw new Error(`${op} is not a binary function`);
    }

    const firstErr = getTypeError(env, left.is, fn.is.args[0], left.location);
    if (firstErr != null) {
        throw firstErr;
    }
    const secondErr = getTypeError(env, rarg.is, fn.is.args[1], rarg.location);
    if (secondErr != null) {
        throw secondErr;
    }

    return {
        type: 'apply',
        location: encompassingLoc(left.location, rarg.location),
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
    op: Op,
    right: Expression,
    location: Location,
): Term => {
    // Shortcut
    const rarg =
        right.type === 'ops' ? _typeOps(env, right) : typeExpr(env, right);

    const result = typeNewOp(env, left, op, rarg, location);
    if (result != null) {
        return result;
    }

    let is = env.global.builtins[op.text];
    if (!is) {
        throw new LocatedError(location, `Unexpected binary op ${op}`);
    }
    if (is.type !== 'lambda') {
        throw new LocatedError(location, `${op} is not a function`);
    }
    if (is.args.length !== 2) {
        throw new LocatedError(location, `${op} is not a binary function`);
    }

    if (is.typeVbls.length === 1) {
        if (!typesEqual(left.is, rarg.is)) {
            throw new LocatedError(
                left.location,
                `Fallback binops ${op} must have same-typed arguments: ${showType(
                    env,
                    left.is,
                )} vs ${showType(env, rarg.is)} at ${showLocation(
                    left.location,
                )}`,
            );
        }
        is = applyTypeVariables(env, is, [left.is]) as LambdaType;
    }

    if (
        is.args[0].type === 'ref' &&
        is.args[0].ref.type === 'builtin' &&
        is.args[0].ref.name === 'numeric'
    ) {
        if (!typesEqual(left.is, rarg.is)) {
            // OK START EHERE:
            // This is where we would, instead of bailing, say
            // "this is ok, we wrap it in an error term"
            throw new TypeMismatch(env, left.is, rarg.is, left.location);
        }
        // STOPSHIP: have an actual solution for strings
        if (
            typesEqual(left.is, string) ||
            typesEqual(left.is, int) ||
            typesEqual(left.is, float)
        ) {
            is = walkType(is, (t) =>
                typesEqual(t, numeric) ? left.is : null,
            )! as LambdaType;
        } else {
            throw new LocatedError(
                location,
                `Numeric functions only work on int and float, not ${showType(
                    env,
                    left.is,
                )}`,
            );
        }
    }

    const firstErr = getTypeError(env, left.is, is.args[0], left.location);
    if (firstErr != null) {
        throw firstErr;
    }
    const secondErr = getTypeError(env, rarg.is, is.args[1], rarg.location);
    if (secondErr != null) {
        throw secondErr;
    }

    return {
        type: 'apply',
        location: encompassingLoc(left.location, right.location),
        target: {
            location,
            type: 'ref',
            ref: { type: 'builtin', name: op.text },
            is,
        },
        hadAllVariableEffects: false,
        effectVbls: null,
        typeVbls: [],
        args: [left, rarg],
        is: is.res,
    };
};

export const opPrefixes = ([] as Array<string>).concat(...precedence);

// TODO: something more than this though
export const isBinop = (name: string) => opPrefixes.includes(name[0]);

export const getOpLevel = (op: string | null) => {
    if (!op) {
        return null;
    }
    for (let i = 0; i < precedence.length; i++) {
        if (precedence[i].includes(op[0])) {
            return i;
        }
    }
    return null;
};

type Section = {
    ops: Ops;
    // id: Identifier | null;
    op: { text: string; hash: string | null; location: Location } | null;
};

// Ok yeah here's the issue.
// I need to A * (B - C * D)
//

// So, we have Item (op) Item (op) Item (op) Item
// And within each Item, we might start over the precedence bundle

// Takes a flat list of ops
// and nests them
// const organizeOps = (expr: Ops, groups: Array<Array<string>>): Ops => {

// }

const organizeOps = (expr: Ops, groups: Array<Array<string>>): Ops => {
    if (!groups.length) {
        return expr;
    }
    // ok how do we do this?
    // for (let group of precedence) {
    const group = groups[0];
    const otherGroups = groups.slice(1);
    if (!expr.rest.some((ex) => group.includes(ex.op.text[0]))) {
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
        if (group.includes(op.text[0])) {
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
            // id,
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

const organizeDeep = (ops: Ops): Ops => {
    let first = ops.first;
    if (first.type === 'ops') {
        // This might only solve 1 layer deep?
        first = organizeDeep(first);
    }
    const rest = ops.rest.map((item) => {
        if (item.right.type === 'ops') {
            return { ...item, right: organizeDeep(item.right) };
        }
        return item;
    });
    return organizeOps({ ...ops, first, rest }, precedence);
};

export const typeOps = (env: Env, expr: Ops): Term => {
    return _typeOps(env, organizeDeep(expr));
    // ok, left associative, right? I think so.
    // let left: Term = typeExpr(env, expr.first);
    // expr.rest.forEach(({ op, right, location }) => {
    //     left = typeOp(env, left, op, right, location);
    // });
    // return left;
};
