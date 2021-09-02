// For the record

import {
    Env,
    Type,
    Term,
    Reference,
    typesEqual,
    symbolsEqual,
    getAllSubTypes,
    Record as RecordTerm,
    Id,
    RecordDef,
    RecordBase,
    isRecord,
    idsEqual,
} from '../types';
import { Record } from '../../parsing/parser';
import { showType } from '../unify';
import { idFromName, idName } from '../env';
import typeExpr, {
    applyTypeVariablesToRecord,
    showLocation,
} from '../typeExpr';
import typeType from '../typeType';
import { getTypeError } from '../getTypeError';
import { LocatedError, TypeError } from '../errors';

// export const recordNamesAndSuch =

export const typeRecord = (env: Env, expr: Record): RecordTerm => {
    const names: { [key: string]: { i: number; id: Id | null } } = {};

    const subTypes: {
        [id: string]: {
            covered: boolean;
            spread: Term | null;
            rows: Array<{ type: Type; value: Term | null }>;
        };
    } = {};
    const subTypeTypes: { [id: string]: RecordDef } = {};

    let base: RecordBase<{ type: Type; value: Term | null }>;
    let subTypeIds: Array<Id>;
    let is: Type;

    // TODO: we should resolve the #hash first
    if (env.local.typeVblNames[expr.id.text]) {
        const sym = env.local.typeVblNames[expr.id.text];
        const t = env.local.typeVbls[sym.unique];
        base = {
            type: 'Variable',
            var: sym,
            spread: null as any,
        };
        subTypeIds = [];
        t.subTypes.forEach((id) => {
            const t = env.global.types[idName(id)] as RecordDef;
            subTypeIds.push(...getAllSubTypes(env.global, t.extends));
        });
        is = { type: 'var', sym, location: expr.id.location };
    } else {
        let id: Id;
        if (expr.id.hash) {
            const hash = expr.id.hash.slice(1);
            id = idFromName(hash);
            // console.log(expr.id.hash);
            if (!env.global.types[hash]) {
                throw new Error(`No type with id ${hash}`);
            }
        } else {
            const ids = env.global.typeNames[expr.id.text];
            if (!ids) {
                console.log(env.global.typeNames);
                throw new LocatedError(
                    expr.location,
                    `No Record type ${expr.id.text} at ${showLocation(
                        expr.location,
                    )}`,
                );
            }
            id = ids[0];
            if (ids.length > 1) {
                for (let i of ids) {
                    const def = env.global.types[idName(i)];
                    if (
                        def.type === 'Record' &&
                        def.typeVbls.length === expr.typeVbls.length
                    ) {
                        id = i;
                        break;
                    }
                }
            }
        }
        const def = env.global.types[idName(id)] as RecordDef;
        const typeVbls = expr.typeVbls.map((t) => typeType(env, t));
        const t = applyTypeVariablesToRecord(
            env,
            def,
            typeVbls,
            expr.location,
            id.hash,
        );
        const ref: Reference = { type: 'user', id };
        const rows: Array<{ value: Term | null; type: Type }> = new Array(
            t.items.length,
        );

        t.items.forEach((type, i) => {
            rows[i] = { type, value: null };
        });

        // So we can detect missing items
        // rows.fill(null);
        base = { rows, ref, type: 'Concrete', spread: null };
        env.global.recordGroups[idName(id)].forEach(
            (name, i) => (names[name] = { i, id: null }),
        );

        // TODO: deduplicate
        subTypeIds = getAllSubTypes(env.global, t.extends);
        is = {
            type: 'ref',
            ref,
            location: expr.id.location,
            typeVbls,
            // effectVbls: [], // STOPSHIP: allow effect variables to be specified for records
        };
    }

    // let spread = null;

    subTypeIds.forEach((id) => {
        const t = env.global.types[idName(id)] as RecordDef;
        subTypeTypes[idName(id)] = t;
        const rows = new Array(t.items.length);
        t.items.forEach((type, i) => {
            rows[i] = { type, value: null };
        });
        subTypes[idName(id)] = {
            covered: false,
            spread: null,
            rows,
        };
        env.global.recordGroups[idName(id)].forEach(
            (name, i) => (names[name] = { i, id }),
        );
    });

    // How to indicate what spreads are covered?
    // and how are we codegenning this?
    // like with go, we won't be spreading, we'll
    // be specifying each item
    // ok, I think we need to

    // SubType spreads need to be ordered
    const spreadOrder: Array<string> = [];

    // const names = env.global.recordGroups[idName(id)];
    expr.rows.forEach((row, idx) => {
        if (row.type === 'Spread') {
            const v = typeExpr(env, row.value);
            if (base.type === 'Concrete') {
                if (isRecord(v.is, base.ref)) {
                    // STOPSHIP: check that type variables match up
                    Object.keys(subTypes).forEach(
                        (k) => (subTypes[k].covered = true),
                    );
                    if (base.spread != null) {
                        throw new LocatedError(
                            expr.location,
                            `Multiple spreads of the base type don't make any sense.`,
                        );
                    }
                    base.spread = v;
                    return;
                }
            } else if (
                v.is.type === 'var' &&
                symbolsEqual(v.is.sym, base.var)
            ) {
                Object.keys(subTypes).forEach(
                    (k) => (subTypes[k].covered = true),
                );
                if (base.spread != null) {
                    throw new LocatedError(
                        expr.location,
                        `Multiple spreads of the base type don't make any sense.`,
                    );
                }
                base.spread = v;
                return;
            }
            // ummm I kindof want to
            for (let id of subTypeIds) {
                if (
                    // ermmm we're gonna ignore type variables here
                    isRecord(v.is, { type: 'user', id })
                ) {
                    spreadOrder.push(idName(id));
                    const sub = subTypes[idName(id)];
                    if (sub.spread != null) {
                        throw new LocatedError(
                            expr.location,
                            `Multiple spreads of the same subtype (${idName(
                                id,
                            )}) don't make any sense.`,
                        );
                    }
                    sub.spread = v;
                    sub.covered = true;
                    getAllSubTypes(
                        env.global,
                        subTypeTypes[idName(id)].extends,
                    ).forEach((sid) => {
                        subTypes[idName(sid)].covered = true;
                    });
                    return;
                }
            }
            throw new Error(`Invalid spread ${showType(env, v.is)}`);
        }

        let id: Id | null;
        let i: number;
        if (row.id.text === '_') {
            if (base.type !== 'Concrete') {
                throw new Error(
                    `Can only omit attribute names for concrete record declarations`,
                );
            }
            // Umm TODO throw if you're mixing unnamed attributes and like literally anything else?
            id = null;
            i = idx;
        } else {
            if (!names[row.id.text]) {
                throw new Error(
                    `Unexpected attribute name ${row.id.text} at ${showLocation(
                        row.id.location,
                    )}. Possible names: ${Object.keys(names).join(', ')}`,
                );
            }
            const got = names[row.id.text];
            i = got.i;
            id = got.id;
        }

        let rowsToMod =
            id == null && base.type === 'Concrete'
                ? base.rows
                : subTypes[idName(id!)].rows;
        const recordType =
            id == null && base.type === 'Concrete'
                ? (env.global.types[idName(base.ref.id)] as RecordDef)
                : subTypeTypes[idName(id!)];
        if (rowsToMod[i].value != null) {
            throw new Error(
                `Multiple values provided for ${i} ${
                    names[i]
                } at ${showLocation(row.id.location)}`,
            );
        }
        let v = typeExpr(env, row.value, rowsToMod[i].type);
        const err = getTypeError(
            env,
            v.is,
            rowsToMod[i].type,
            row.value.location,
        );
        if (err != null) {
            v = {
                type: 'TypeError',
                is: rowsToMod[i].type,
                inner: v,
                location: v.location,
                message: err.getMessage(),
            };
        }
        rowsToMod[i].value = v;
    });
    // TODO: once I have subtyping, this will have to be more clever.
    // of course, `rows` will also need to be more clever.
    if (base.type === 'Concrete' && base.spread == null) {
        const r = base.ref;
        const def = env.global.types[idName(r.id)] as RecordDef;
        base.rows.forEach((row, i) => {
            if (row.value != null) {
                return;
            }
            if (def.defaults) {
                const found = def.defaults.find(
                    (item) => i === item.idx && item.id === null,
                );
                if (found != null) {
                    row.value = found.value;
                    return;
                }
            }
            throw new LocatedError(
                expr.location,
                `Record missing attribute "${
                    env.global.recordGroups[idName(r.id)][i]
                }" at ${showLocation(expr.location)}`,
            );
        });
    } else if (base.type === 'Variable' && base.spread == null) {
        throw new Error(`Cannot create a new record of a variable type.`);
    }

    const finishedSubTypes: {
        [id: string]: {
            covered: boolean;
            spread: Term | null;
            rows: Array<Term | null>;
        };
    } = {};

    // This will initialized the finishedSubTypes object
    // with the subtypes in the proper order to preserve spreads.
    spreadOrder.forEach((id) => {
        finishedSubTypes[id] = {
            covered: false,
            spread: null,
            rows: [],
        };
    });

    Object.keys(subTypes).forEach((id) => {
        finishedSubTypes[id] = {
            ...subTypes[id],
            rows: subTypes[id].rows.map((r) => r.value),
        };

        if (!subTypes[id].covered) {
            subTypes[id].rows.forEach((row, i) => {
                if (row.value == null) {
                    throw new Error(
                        `Record missing attribute from subtype ${id} "${
                            env.global.recordGroups[id][i]
                        }" at ${showLocation(expr.location)}`,
                    );
                }
            });
        }
    });

    return {
        type: 'Record',
        location: expr.location,
        base:
            base.type === 'Concrete'
                ? { ...base, rows: base.rows.map((r) => r.value) }
                : base,
        is,
        subTypes: finishedSubTypes,
    };
};
