import { Pattern as RawPattern } from '../parsing/parser';
import { idName, makeLocal } from './env';
import { bool, float, int, string } from './preset';
import {
    showLocation,
    getEnumReferences,
    applyTypeVariablesToRecord,
    getEnumSuperTypes,
} from './typeExpr';
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
    TypeReference,
} from './types';
import { assertFits, showType } from './unify';

export const patternIs = (pattern: Pattern, expected: Type): Type => {
    switch (pattern.type) {
        case 'Alias':
            return patternIs(pattern.inner, expected);
        case 'Binding':
            return expected;
        case 'string':
        case 'float':
        case 'int':
        case 'boolean':
            return pattern.is;
        case 'Enum':
            // hmmmmmmmmmmmmmmmmmmmmm
            return pattern.ref;
        case 'Record':
            return pattern.ref;
        case 'Tuple':
            const vbls = expected.type === 'ref' ? expected.typeVbls : [];
            return {
                type: 'ref',
                ref: { type: 'builtin', name: `Tuple${pattern.items.length}` },
                typeVbls: pattern.items.map((item, i) =>
                    patternIs(item, vbls[i]),
                ),
                effectVbls: [],
                location: pattern.location,
            };
        case 'Array':
            return {
                type: 'ref',
                ref: { type: 'builtin', name: 'Array' },
                typeVbls: [pattern.is],
                effectVbls: [],
                location: pattern.location,
            };
    }
};

const typePattern = (
    env: Env,
    pattern: RawPattern,
    expectedType: Type,
): Pattern => {
    switch (pattern.type) {
        case 'boolean':
            assertFits(env, bool, expectedType, pattern.location);
            return {
                type: 'boolean',
                value: pattern.value,
                is: string,
                location: pattern.location,
            };
        case 'string':
            assertFits(env, string, expectedType, pattern.location);
            return {
                type: 'string',
                text: pattern.text,
                is: string,
                location: pattern.location,
            };
        case 'float':
            assertFits(env, float, expectedType, pattern.location);
            return {
                type: 'float',
                value: pattern.value,
                is: float,
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
                    throw new Error(
                        `Not a type ${showType(env, expectedType)}`,
                    );
                }
                const id = env.global.typeNames[pattern.text];
                if (!id) {
                    throw new Error(`Unknown type ${pattern.text}`);
                }

                const decl = env.global.types[idName(id)];
                if (!decl) {
                    throw new Error(
                        `Type not found ${pattern.text} ${showLocation(
                            pattern.location,
                        )}`,
                    );
                }
                if (decl.type === 'Enum') {
                    const allEnums = getEnumSuperTypes(env, expectedType);
                    let found = null;
                    for (let ref of allEnums) {
                        if (refsEqual(ref.ref, { type: 'user', id })) {
                            found = ref;
                        }
                    }
                    if (!found) {
                        throw new Error(`Enum doesn't match`);
                    }
                    return {
                        type: 'Enum',
                        ref: found,
                        location: pattern.location,
                    };
                }

                const allReferences = getEnumReferences(env, expectedType);

                let found = null;
                for (let ref of allReferences) {
                    if (refsEqual(ref.ref, { type: 'user', id })) {
                        found = ref;
                        break;
                    }
                }
                if (!found) {
                    throw new Error(`Enum doesn't match`);
                }
                return {
                    type: 'Record',
                    ref: found,
                    items: [],
                    location: pattern.location,
                };
            } else {
                const sym = makeLocal(env, pattern, expectedType);

                return {
                    type: 'Binding',
                    location: pattern.location,
                    sym,
                };
            }
        }
        case 'Alias': {
            const p = typePattern(env, pattern.inner, expectedType);
            const is = patternIs(p, expectedType);
            const sym = makeLocal(env, pattern.name, is);

            return {
                type: 'Alias',
                location: pattern.location,
                inner: p,
                name: sym,
            };
        }
        case 'Record': {
            const names: { [key: string]: { i: number; id: Id | null } } = {};
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
            let found: TypeReference | null = null;
            for (let ref of allReferences) {
                if (refsEqual(ref.ref, { type: 'user', id })) {
                    found = ref;
                    break;
                }
            }
            if (!found) {
                throw new Error(`Enum doesn't match`);
            }

            let t = env.global.types[idName(id)];
            if (t.type !== 'Record') {
                throw new Error(`Not a record ${idName(id)}`);
            }
            t = applyTypeVariablesToRecord(
                env,
                t,
                found.typeVbls,
                pattern.location,
                id.hash,
            );

            subTypeIds = getAllSubTypes(env.global, t);

            env.global.recordGroups[idName(id)].forEach(
                (name, i) => (names[name] = { i, id: null }),
            );
            const ref: Reference = { type: 'user', id };
            base = { rows: [], ref, type: 'Concrete', spread: null };
            // }

            subTypeIds.forEach((id) => {
                const t = env.global.types[idName(id)] as RecordDef;
                subTypeTypes[idName(id)] = t;
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
                            `Unexpected attribute name ${
                                row.id.text
                            } at ${showLocation(row.id.location)}`,
                        );
                    }
                    const got = names[row.id.text];
                    i = got.i;
                    rowId = got.id;
                    ref = { type: 'user', id: got.id || id };
                }

                const recordType =
                    rowId == null && base.type === 'Concrete'
                        ? t
                        : subTypeTypes[idName(rowId!)];

                if (!recordType) {
                    console.log(row, base, rowId, subTypeTypes);

                    throw new Error(`No record`);
                }

                const is = recordType.items[i];

                let pattern: Pattern;
                if (row.pattern == null) {
                    const sym = makeLocal(env, row.id, is);
                    pattern = { type: 'Binding', location: row.location, sym };
                } else {
                    pattern = typePattern(env, row.pattern, is);
                }

                items.push({
                    ref,
                    idx: i,
                    location: row.location,
                    pattern,
                    is,
                });
            });

            return {
                type: 'Record',
                ref: found,
                items,
                location: pattern.location,
            };
        }
        case 'Tuple': {
            const items: Array<Pattern> = [];
            const n = pattern.items.length;
            if (
                expectedType.type !== 'ref' ||
                expectedType.ref.type !== 'builtin' ||
                expectedType.ref.name !== `Tuple${n}` ||
                expectedType.typeVbls.length !== n
            ) {
                throw new Error(`${n}-tuple pattern type mismatch`);
            }
            pattern.items.forEach((item, i) => {
                items.push(typePattern(env, item, expectedType.typeVbls[i]));
            });

            return {
                type: 'Tuple',
                items,
                location: pattern.location,
            };
        }
        case 'Array': {
            const preItems: Array<Pattern> = [];
            let spread: Pattern | null = null;
            const postItems: Array<Pattern> = [];
            if (
                expectedType.type !== 'ref' ||
                expectedType.ref.type !== 'builtin' ||
                expectedType.ref.name !== 'Array'
            ) {
                throw new Error(`Array pattern type mismatch`);
            }
            const expectedElement = expectedType.typeVbls[0];
            pattern.items.forEach((item) => {
                if (item.type === 'Spread') {
                    if (spread != null) {
                        throw new Error(
                            `Cannot have multiple spreads in the same array pattern`,
                        );
                    }
                    spread = typePattern(env, item.inner, expectedType);
                } else if (spread == null) {
                    preItems.push(typePattern(env, item, expectedElement));
                } else {
                    postItems.push(typePattern(env, item, expectedElement));
                }
            });

            return {
                type: 'Array',
                preItems,
                spread,
                postItems,
                location: pattern.location,
                is: expectedElement,
            };
        }
        default:
            let _x: never = pattern;
            throw new Error(
                `Not supported pattern type ${(pattern as any).type}`,
            );
    }
};

// const refName = (ref: Reference) =>
//     ref.type === 'builtin' ? 'builtin:' + ref.name : 'user:' + idName(ref.id);

export default typePattern;
