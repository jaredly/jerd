import { Location, Switch } from '../../parsing/parser';
import { idName } from '../env';
import { LocatedError } from '../errors';
import { getTypeError } from '../getTypeError';
import typeExpr, { getEnumReferences, showLocation } from '../typeExpr';
import typePattern from '../typePattern';
import {
    ArrayPattern,
    Env,
    getAllSubTypes,
    Pattern,
    RecordDef,
    RecordPattern,
    Reference,
    refsEqual,
    subEnv,
    Term,
    TuplePattern,
    Type,
} from '../types';
import { showType } from '../unify';
import {
    Pattern as ExPattern,
    Groups,
    Matrix,
    anything,
    isExhaustive,
    constructor,
    or,
} from './exhaustive';

const groupIdForRef = (ref: Reference) =>
    ref.type === 'builtin' ? ref.name : idName(ref.id);

const patternToExPattern = (
    env: Env,
    type: Type,
    groups: Groups,
    pattern: Pattern,
): ExPattern => {
    switch (pattern.type) {
        case 'Alias':
            return patternToExPattern(env, type, groups, pattern.inner);
        case 'int':
            return constructor(pattern.value.toString(), 'int', []);
        case 'float':
            return constructor(pattern.value.toString(), 'float', []);
        case 'string':
            return constructor(pattern.text, 'string', []);
        case 'boolean':
            return constructor(pattern.value.toString(), 'boolean', []);
        case 'Binding':
            return anything;
        case 'Enum': {
            if (type.type !== 'ref') {
                throw new Error(
                    `Non-concrete type ${showType(
                        env,
                        type,
                    )} for enum pattern ${showLocation(pattern.location)}`,
                );
            }
            // const groupId = groupIdForRef(type.ref);
            const all = getEnumReferences(env, pattern.ref);
            // if (!groups[groupId]) {
            //     groups[groupId] = all.map((t) => groupIdForRef(t.ref));
            // }

            let last: ExPattern | null = null;
            all.forEach((ref) => {
                const p = recordToExPattern(
                    type,
                    {
                        type: 'Record',
                        ref,
                        location: pattern.location,
                        items: [],
                    },
                    groups,
                    env,
                );
                last = last ? or(p, last) : p;
            });
            if (last == null) {
                throw new Error(
                    `Enum ${showType(
                        env,
                        pattern.ref,
                    )} has no items. Cannot match at ${showLocation(
                        pattern.location,
                    )}`,
                );
            }
            return last;
        }
        case 'Record': {
            // TODO: got to look up all the options...
            // for the current type.
            // if the current type is the record,
            // then we just make a unary group
            // otherwise, we list all possible constructors
            return recordToExPattern(type, pattern, groups, env);
        }
        case 'Array': {
            return arrayToExPattern(type, pattern, groups, env);
        }
        case 'Tuple': {
            return tupleToExPattern(type, pattern, groups, env);
        }
        default:
            throw new Error(`Unhandled pattern ${(pattern as any).type}`);
    }
};

export const exhaustivenessCheck = (
    env: Env,
    t: Type,
    cases: Array<Pattern>,
    location: Location,
) => {
    const groups = {
        int: null,
        string: null,
        boolean: ['true', 'false'],
    };
    const matrix: Matrix = [];
    cases.forEach((kase) => {
        matrix.push([patternToExPattern(env, t, groups, kase)]);
    });

    if (isExhaustive(groups, matrix)) {
        return true;
    } else {
        throw new Error(`Not exhaustive ${showLocation(location)}`);
    }
};

export const typeSwitch = (env: Env, expr: Switch): Term => {
    const term = typeExpr(env, expr.expr);
    const cases: Array<{ pattern: Pattern; body: Term }> = [];
    let is: Type | null = null;
    expr.cases.forEach((c) => {
        const inner = subEnv(env);
        const pattern = typePattern(inner, c.pattern, term.is);
        const body = typeExpr(inner, c.body);
        if (is == null) {
            is = body.is;
        } else {
            const err = getTypeError(env, body.is, is, c.body.location);
            if (err != null) {
                throw new LocatedError(
                    c.body.location,
                    `Bodies of case arms don't agree!`,
                ).wrap(err);
            }
        }
        cases.push({
            pattern,
            body,
        });
    });

    exhaustivenessCheck(
        env,
        term.is,
        cases.map((c) => c.pattern),
        expr.location,
    );

    // STOPSHIP: gotta ensure exhaustivity here folks!
    // hrmmm this could be tricky
    // ok, so maybe we can have paths?
    // [idName, attr, etc.]
    // and if [idName] => true, then that record is covered
    // and if [] => true, then we have a wildcard coverage.
    return {
        type: 'Switch',
        term,
        cases,
        location: expr.location,
        is: is!,
    };
};

const tupleToExPattern = (
    type: Type,
    pattern: TuplePattern,
    groups: Groups,
    env: Env,
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
        patternToExPattern(env, vbls[i], groups, item),
    );
    return constructor(groupId, groupId, inner);
};

const arrayToExPattern = (
    type: Type,
    pattern: ArrayPattern,
    groups: Groups,
    env: Env,
): ExPattern => {
    if (
        type.type !== 'ref' ||
        type.ref.type !== 'builtin' ||
        type.ref.name !== 'Array'
    ) {
        throw new Error(`Non-array type with array spread`);
    }
    const elemType = type.typeVbls[0];
    const notMatch = getTypeError(env, elemType, pattern.is, pattern.location!);
    if (notMatch != null) {
        throw notMatch;
    }
    // Ok
    // so we transform:
    // preItems, spread, postItems
    // into
    // Array(toCons(preItems, spread), toCons(postItems, nil))
    // and if there are no postItems but there is a spread, then the postItem thing is "any"
    // but if there is nother postItems not spread, then the postitems is nil
    /*
    we pretend that the following types exist:

    type Array<T> = {head: ConsList<T>, tail: ConsList<T>}
    type Cons<T> = {value: T, tail: ConsList}
    type Nil = {}
    enum ConsList<T> {Cons<T>, Nil}
    */
    // oh btw I should probably figure out mutually recursive types here in a minute.
    // so that you could actually define that linked list if you wanted to.

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
                patternToExPattern(env, elemType, groups, items[i]),
                last,
            ]);
        }
        return last;
    };

    // HRMMMM why is this not exhaustive:
    // [one, ...rest] => true,
    // [] => false
    // ?
    // List(Cons(anything, anything), anything)
    // List(nil, anything) ? is that how it goes? hm actually maybe it does.
    // if there's no spread, the postItems don't matter?
    // AHH yes because I'm not expressing the relationship correctly.

    // hrmm.
    // because the last thing is like "could be one or two"
    /*

    really this should be somtehing like
    // type Pattern = {preItems: Array<Pattern>, spread: {pattern: Pattern, postItems: Array<Pattern>}}
    // BUT preItems ends in Anything if we have a spread.
    // type Array<T> = {head: ConsList<T>, }


    */

    const head = toConsList(
        pattern.preItems,
        pattern.spread
            ? patternToExPattern(env, type, groups, pattern.spread)
            : null,
    );
    const tail = pattern.postItems.length
        ? toConsList(pattern.postItems, null)
        : anything;
    // : pattern.spread != null
    // ? anything
    // : constructor(nilId, consListId, []);

    return constructor(groupId, groupId, [head, tail]);

    // throw new Error('not impl');
};

const recordToExPattern = (
    type: Type,
    pattern: RecordPattern,
    groups: Groups,
    env: Env,
) => {
    if (type.type !== 'ref') {
        throw new Error(
            `Non-concrete type ${showType(
                env,
                type,
            )} for record pattern ${showLocation(pattern.location)}`,
        );
    }
    const groupId = groupIdForRef(type.ref);
    if (!groups[groupId]) {
        const all = getEnumReferences(env, type);
        groups[groupId] = all.map((t) => groupIdForRef(t.ref));
    }
    const defn = env.global.types[groupIdForRef(pattern.ref.ref)] as RecordDef;
    const subTypes = getAllSubTypes(env.global, defn);
    const valuesBySubType: {
        [idName: string]: {
            row: Array<ExPattern>;
            types: Array<Type>;
        };
    } = {};
    subTypes.forEach((id) => {
        const defn = env.global.types[idName(id)] as RecordDef;
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
                env,
                defn.items[item.idx],
                groups,
                item.pattern,
            );
        } else {
            const sub = valuesBySubType[idName(item.ref.id)];
            sub.row[item.idx] = patternToExPattern(
                env,
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
