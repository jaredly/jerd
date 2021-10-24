import { Location, Switch } from '../parsing/parser-new';
import { isErrorPattern } from '../typing/auto-transform';
import { idName } from '../typing/env';
import {
    anything,
    constructor,
    Groups,
    isExhaustive,
    Matrix,
    or,
    Pattern as ExPattern,
} from '../typing/terms/exhaustive';
import {
    ArrayPattern,
    Pattern,
    RecordDef,
    RecordPattern,
    Reference,
    refsEqual,
    SwitchCase,
    Term,
    TuplePattern,
    Type,
    typesEqual,
    UserTypeReference,
} from '../typing/types';
import { Context, ValueBinding } from './Context';
import { getEnumReferences, typeDef } from './Library';
import { typePattern } from './pattern/typePattern';
import { typeExpression } from './typeExpression';
import { getAllSubTypes } from './typeRecord';

export const typeSwitch = (
    ctx: Context,
    term: Switch,
    expected: Array<Type>,
): Term => {
    // Which do we do first?
    // The object of our affection?
    // or the cases. Probably the cases?
    // and like
    // at that point
    // do we ... just look for all enums that cover these things?
    // hmmmmmmmm

    // ok, let's go simple for the moment.

    const input = typeExpression(ctx, term.expr, []);
    let is: Type | null = null;
    // annnd for patterns, I think we'll just ignore expected types? idk
    const cases = term.cases.items.map(
        (kase): SwitchCase => {
            const bindings: Array<ValueBinding> = [];
            const pattern = typePattern(ctx, kase.pattern, bindings, input.is);
            const inner = {
                ...ctx,
                bindings: {
                    ...ctx.bindings,
                    values: bindings.concat(ctx.bindings.values),
                },
            };
            const body = typeExpression(inner, kase.body, is ? [is] : expected);
            if (is == null) {
                is = body.is;
            }
            return {
                pattern,
                body,
                location: kase.location,
            };
        },
    );
    if (
        !casesAreExhaustive(
            ctx,
            input.is,
            cases.map((kase) => kase.pattern),
        )
    ) {
        cases.push({
            body: { type: 'Hole', location: term.location, is: is! },
            location: term.location,
            pattern: { type: 'Ignore', location: term.location },
        });
    }
    return {
        type: 'Switch',
        cases,
        is: is!,
        location: term.location,
        term: input,
    };
};

export const casesAreExhaustive = (
    ctx: Context,
    t: Type,
    cases: Array<Pattern>,
) => {
    const groups = {
        int: null,
        string: null,
        float: null,
        boolean: ['true', 'false'],
    };
    const matrix: Matrix = [];
    cases.forEach((kase) => {
        matrix.push([patternToExPattern(ctx, t, groups, kase)]);
    });

    return isExhaustive(groups, matrix);
};

const groupIdForRef = (ref: Reference) =>
    ref.type === 'builtin' ? ref.name : idName(ref.id);

export const patternToExPattern = (
    ctx: Context,
    type: Type,
    groups: Groups,
    pattern: Pattern,
): ExPattern => {
    if (isErrorPattern(pattern)) {
        throw new Error(`error pattern`);
    }
    switch (pattern.type) {
        case 'Alias':
            return patternToExPattern(ctx, type, groups, pattern.inner);
        case 'int':
            return constructor(pattern.value.toString(), 'int', []);
        case 'float':
            return constructor(pattern.value.toString(), 'float', []);
        case 'string':
            return constructor(pattern.text, 'string', []);
        case 'boolean':
            return constructor(pattern.value.toString(), 'boolean', []);
        case 'Binding':
        case 'Ignore':
            return anything;
        case 'Enum': {
            if (type.type !== 'ref' || pattern.ref.ref.type !== 'user') {
                throw new Error(`enum pattern`);
            }
            // const groupId = groupIdForRef(type.ref);
            const all = getEnumReferences(
                ctx,
                pattern.ref as UserTypeReference,
                pattern.location as Location,
            );
            // if (!groups[groupId]) {
            //     groups[groupId] = all.map((t) => groupIdForRef(t.ref));
            // }

            let last: ExPattern | null = null;
            all.forEach((ref) => {
                const p = recordToExPattern(
                    type as UserTypeReference,
                    {
                        type: 'Record',
                        ref,
                        location: pattern.location,
                        items: [],
                    },
                    groups,
                    ctx,
                );
                last = last ? or(p, last) : p;
            });
            if (last == null) {
                throw new Error(`enum has no items?`);
            }
            return last;
        }
        case 'Record': {
            // TODO: got to look up all the options...
            // for the current type.
            // if the current type is the record,
            // then we just make a unary group
            // otherwise, we list all possible constructors
            return recordToExPattern(
                type as UserTypeReference,
                pattern,
                groups,
                ctx,
            );
        }
        case 'Array': {
            return arrayToExPattern(type, pattern, groups, ctx);
        }
        case 'Tuple': {
            return tupleToExPattern(type, pattern, groups, ctx);
        }
        default:
            const _x: never = pattern;
            throw new Error(`Unhandled pattern ${(pattern as any).type}`);
    }
};

// export const typeSwitch = (env: Env, expr: Switch): Term => {
//     const term = typeExpr(env, expr.expr);
//     // TODO: do I need this?
//     // const selfHash =
//     //     term.is.type === 'ref' && term.is.ref.type === 'user'
//     //         ? term.is.ref.id.hash
//     //         : undefined;
//     const cases: Array<{
//         pattern: Pattern;
//         body: Term;
//         location: Location;
//     }> = [];
//     let is: Type | null = null;
//     expr.cases.forEach((c) => {
//         const inner = subEnv(env);
//         const pattern = typePattern(inner, c.pattern, term.is);
//         const body = typeExpr(inner, c.body);
//         if (is == null) {
//             is = body.is;
//         } else {
//             const err = getTypeError(
//                 env,
//                 body.is,
//                 is,
//                 c.body.location,
//                 // selfHash,
//             );
//             if (err != null) {
//                 throw new LocatedError(
//                     c.body.location,
//                     `Bodies of case arms don't agree!`,
//                 ).wrap(err);
//             }
//         }
//         cases.push({
//             location: c.location,
//             pattern,
//             body,
//         });
//     });
//     exhaustivenessCheck(
//         env,
//         term.is,
//         cases.map((c) => c.pattern),
//         expr.location,
//     );
//     // STOPSHIP: gotta ensure exhaustivity here folks!
//     // hrmmm this could be tricky
//     // ok, so maybe we can have paths?
//     // [idName, attr, etc.]
//     // and if [idName] => true, then that record is covered
//     // and if [] => true, then we have a wildcard coverage.
//     return {
//         type: 'Switch',
//         term,
//         cases,
//         location: expr.location,
//         is: is!,
//     };
// };

const tupleToExPattern = (
    type: Type,
    pattern: TuplePattern,
    groups: Groups,
    ctx: Context,
): ExPattern => {
    if (
        type.type !== 'ref' ||
        type.ref.type !== 'builtin' ||
        type.ref.name !== `Tuple${pattern.items.length}` ||
        type.typeVbls.length !== pattern.items.length
    ) {
        throw new Error(`Non-tuple type with tuple`);
    }
    const vbls = type.typeVbls;
    const n = pattern.items.length;

    const groupId = 'tuple-' + n;
    if (!groups[groupId]) {
        groups[groupId] = [groupId];
    }

    const inner = pattern.items.map((item, i) =>
        patternToExPattern(ctx, vbls[i], groups, item),
    );
    return constructor(groupId, groupId, inner);
};

const arrayToExPattern = (
    type: Type,
    pattern: ArrayPattern,
    groups: Groups,
    ctx: Context,
): ExPattern => {
    if (
        type.type !== 'ref' ||
        type.ref.type !== 'builtin' ||
        type.ref.name !== 'Array'
    ) {
        throw new Error(`Non-array type with array spread`);
    }
    const elemType = type.typeVbls[0];
    if (!typesEqual(elemType, pattern.is)) {
        throw new Error(`array element type mismatch`);
    }

    const groupId = 'array-literal';
    groups[groupId] = [groupId];

    const consListId = 'array-cons-list';
    const consId = 'array-cons';
    const nilId = 'array-nil';
    groups[consListId] = [consId, nilId];

    const toConsList = (items: Array<Pattern>, tail: ExPattern | null) => {
        let last = tail == null ? constructor(nilId, consListId, []) : tail;
        for (let i = items.length - 1; i >= 0; i--) {
            last = constructor(consId, consListId, [
                patternToExPattern(ctx, elemType, groups, items[i]),
                last,
            ]);
        }
        return last;
    };

    const head = toConsList(
        pattern.preItems,
        pattern.spread
            ? patternToExPattern(ctx, type, groups, pattern.spread)
            : null,
    );
    const tail = pattern.postItems.length
        ? toConsList(pattern.postItems, null)
        : anything;

    return constructor(groupId, groupId, [head, tail]);
};

const recordToExPattern = (
    type: UserTypeReference,
    pattern: RecordPattern,
    groups: Groups,
    ctx: Context,
): ExPattern => {
    if (type.type !== 'ref') {
        throw new Error(`Nope`);
    }
    const groupId = groupIdForRef(type.ref);
    if (!groups[groupId]) {
        const all = getEnumReferences(ctx, type, pattern.location as Location);
        groups[groupId] = all.map((t) => groupIdForRef(t.ref));
    }
    const defn = ctx.library.types.defns[groupIdForRef(pattern.ref.ref)]
        .defn as RecordDef;
    const subTypes = getAllSubTypes(
        ctx.library,
        defn.extends.map((t) => t.ref.id),
    );
    const valuesBySubType: {
        [idName: string]: {
            row: Array<ExPattern>;
            types: Array<Type>;
        };
    } = {};
    subTypes.forEach((id) => {
        const defn = ctx.library.types.defns[idName(id)].defn as RecordDef;
        valuesBySubType[idName(id)] = {
            row: defn.items.map(() => anything),
            types: defn.items,
        };
    });

    // Initialize all attributes with the "anything" matcher,
    // and replace them with more specific ones if they are specified.
    const inner = defn.items.map(() => anything);
    pattern.items.forEach((item) => {
        if (refsEqual(item.ref, pattern.ref.ref)) {
            inner[item.idx] = patternToExPattern(
                ctx,
                defn.items[item.idx],
                groups,
                item.pattern,
            );
        } else {
            const sub = valuesBySubType[idName(item.ref.id)];
            sub.row[item.idx] = patternToExPattern(
                ctx,
                sub.types[item.idx],
                groups,
                item.pattern,
            );
        }
    });
    const subIds = Object.keys(valuesBySubType).sort();
    subIds.forEach((sub) => {
        inner.push(...valuesBySubType[sub].row);
    });
    return constructor(groupIdForRef(pattern.ref.ref), groupId, inner);
};
