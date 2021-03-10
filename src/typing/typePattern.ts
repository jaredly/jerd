import { Pattern as RawPattern } from '../parsing/parser';
import { idName } from './env';
import { int, string } from './preset';
import { showLocation, getEnumReferences } from './typeExpr';
import {
    Env,
    getAllSubTypes,
    Id,
    isRecord,
    Pattern,
    RecordBase,
    RecordDef,
    RecordPatternItem,
    Reference,
    refsEqual,
    Symbol,
    Term,
    Type,
} from './types';
import { assertFits, showType } from './unify';

const typePattern = (
    env: Env,
    pattern: RawPattern,
    expectedType: Type,
): Pattern => {
    switch (pattern.type) {
        case 'string':
            assertFits(env, string, expectedType, pattern.location);
            return {
                type: 'string',
                text: pattern.text,
                is: string,
                location: pattern.location,
            };
        case 'int':
            assertFits(env, int, expectedType, pattern.location);
            return {
                type: 'int',
                value: pattern.value,
                is: int,
                location: pattern.location,
            };
        case 'id': {
            if (env.global.typeNames[pattern.text]) {
                // We're interpreting this as a type!
                // it's a little weird to do it this way
                // but syntax is dumb
                // and a structured editor will capture intent much better

                if (expectedType.type !== 'ref') {
                    console.log(pattern);
                    throw new Error(`Not a type ${showType(expectedType)}`);
                }
                const id = env.global.typeNames[pattern.text];
                if (!id) {
                    throw new Error(`Unknown type ${pattern.text}`);
                }
                if (env.global.types[idName(id)].type === 'Enum') {
                    throw new Error('enums not supported yet');
                }
                const allReferences = getEnumReferences(env, expectedType);
                let found = false;
                for (let ref of allReferences) {
                    if (refsEqual(ref.ref, { type: 'user', id })) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    throw new Error(`Enum doesn't match`);
                }
                return {
                    type: 'Record',
                    ref: { type: 'user', id },
                    items: [],
                    location: pattern.location,
                };
            } else {
                const unique = env.local.unique++;
                const sym: Symbol = {
                    unique,
                    name: pattern.text,
                };
                env.local.locals[pattern.text] = { sym, type: expectedType };

                return {
                    type: 'Binding',
                    location: pattern.location,
                    sym,
                };
            }
        }
        case 'Record': {
            const names: { [key: string]: { i: number; id: Id } } = {};
            let subTypeIds: Array<Id>;
            let base: RecordBase<{ type: Type; value: Term | null }>;
            const subTypeTypes: { [id: string]: RecordDef } = {};

            // TODO: if I allow destructuring of type vbl records,
            // like in a let, I'll need this.
            // if (env.local.typeVblNames[pattern.id.text]) {
            //     const sym = env.local.typeVblNames[pattern.id.text];
            //     const t = env.local.typeVbls[sym.unique];
            //     subTypeIds = [];
            //     t.subTypes.forEach((id) => {
            //         const t = env.global.types[idName(id)] as RecordDef;
            //         subTypeIds.push(...getAllSubTypes(env.global, t));
            //     });
            //     base = {
            //         type: 'Variable',
            //         var: sym,
            //         spread: null as any,
            //     };
            // } else {
            const id = env.global.typeNames[pattern.id.text];
            if (!id) {
                throw new Error(`Unknown type ${pattern.id.text}`);
            }

            // Validate record in enum
            if (expectedType.type !== 'ref') {
                throw new Error(`Not a type`);
            }
            const allReferences = getEnumReferences(env, expectedType);
            let found = false;
            for (let ref of allReferences) {
                if (refsEqual(ref.ref, { type: 'user', id })) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                throw new Error(`Enum doesn't match`);
            }

            const t = env.global.types[idName(id)];
            if (t.type !== 'Record') {
                throw new Error(`Not a record ${idName(id)}`);
            }
            subTypeIds = getAllSubTypes(env.global, t);

            env.global.recordGroups[idName(id)].forEach(
                (name, i) => (names[name] = { i, id }),
            );
            const ref: Reference = { type: 'user', id };
            base = { rows: [], ref, type: 'Concrete', spread: null };
            // }

            subTypeIds.forEach((id) => {
                const t = env.global.types[idName(id)] as RecordDef;
                subTypeTypes[idName(id)] = t;
                // const rows = new Array(t.items.length);
                // t.items.forEach((type, i) => {
                //     rows[i] = { type, value: null };
                // });
                // subTypes[idName(id)] = {
                //     covered: false,
                //     spread: null,
                //     rows,
                // };
                env.global.recordGroups[idName(id)].forEach(
                    (name, i) => (names[name] = { i, id }),
                );
            });

            const items: Array<RecordPatternItem> = [];

            pattern.items.forEach((row, idx) => {
                // ok

                let rowId: Id | null = null;
                let ref: Reference;
                let i: number;
                if (row.id.text === '_') {
                    if (base.type !== 'Concrete') {
                        throw new Error(
                            `Can only omit attribute names for concrete record declarations`,
                        );
                    }
                    // Umm TODO throw if you're mixing unnamed attributes and like literally anything else?
                    // rowId = id;
                    i = idx;
                    ref = { type: 'user', id };
                } else {
                    if (!names[row.id.text]) {
                        throw new Error(
                            `Unexpected attrbute name ${
                                row.id.text
                            } at ${showLocation(row.id.location)}`,
                        );
                    }
                    const got = names[row.id.text];
                    i = got.i;
                    rowId = got.id;
                    ref = { type: 'user', id: got.id };
                }

                const recordType =
                    rowId == null && base.type === 'Concrete'
                        ? (env.global.types[idName(base.ref.id)] as RecordDef)
                        : subTypeTypes[idName(rowId!)];

                // let rowsToMod =
                //     id == null && base.type === 'Concrete'
                //         ? base.rows
                //         : subTypes[idName(id!)].rows;
                if (!recordType) {
                    console.log(row, base, rowId);

                    throw new Error(`No record?`);
                }

                const is = recordType.items[i];

                // const v = typeExpr(env, row.value);
                // if (!fitsExpectation(env, v.is, rowsToMod[i].type)) {
                //     throw new Error(
                //         `Invalid type for attribute ${row.id.text} at ${showLocation(
                //             row.value.location,
                //         )}. Expected ${showType(recordType.items[i])}, got ${showType(
                //             v.is,
                //         )}`,
                //     );
                // }

                items.push({
                    // sym,
                    ref,
                    idx: i,
                    location: row.location,
                    pattern: typePattern(env, row.pattern, is),
                    is,
                });
            });

            return {
                type: 'Record',
                ref,
                items,
                location: pattern.location,
            };
        }
        default:
            throw new Error(`Not supported pattern type ${pattern.type}`);
    }
};

export default typePattern;
