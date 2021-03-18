import { Location, Switch } from '../../parsing/parser';
import { idName } from '../env';
import typeExpr, { getEnumReferences, showLocation } from '../typeExpr';
import typePattern from '../typePattern';
import {
    Env,
    getAllSubTypes,
    Pattern,
    RecordDef,
    RecordPattern,
    Reference,
    refsEqual,
    subEnv,
    Term,
    Type,
} from '../types';
import { fitsExpectation, showType } from '../unify';
import {
    Constructor,
    Pattern as ExPattern,
    Groups,
    Matrix,
    anything,
    isExhaustive,
    getUseless,
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
            if (fitsExpectation(env, body.is, is) !== true) {
                throw new Error(
                    `Bodies of case arms don't agree! ${showType(
                        env,
                        body.is,
                    )} vs ${showType(env, is)} at ${showLocation(c.location)}`,
                );
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
    return constructor(
        groupIdForRef(pattern.ref.ref),
        groupId,
        // TODO: we need to serialize out all of the
        // attributes of this record, in a reproducible
        // way. So probably sort subtypes, and such.
        inner,
    );
};
