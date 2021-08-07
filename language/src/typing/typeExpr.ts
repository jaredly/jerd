import {
    Env,
    Type,
    Term,
    Reference,
    LambdaType,
    Let,
    EffectRef,
    isRecord,
    TypeReference,
    RecordDef,
    UserReference,
    EnumDef,
    GlobalEnv,
    TypeVblDecl,
    typesEqual,
    nullLocation,
    UserTypeReference,
} from './types';
import { Expression } from '../parsing/parser';
import { subEnv, Location } from './types';
import typeType, { walkType } from './typeType';
import { showType } from './unify';
import { void_, string, bool, float, int } from './preset';
import {
    hasSubType,
    idFromName,
    idName,
    makeLocal,
    resolveIdentifier,
    resolveType,
} from './env';
import { typeLambda } from './terms/lambda';
import { typeHandle } from './terms/handle';
import { typeRecord } from './terms/record';
import { typeApply } from './terms/apply';
import { typeSwitch } from './terms/switch';
import { findUnaryOp, typeOps } from './terms/ops';
import { LocatedError, TypeError, UnresolvedIdentifier } from './errors';
import { getTypeError } from './getTypeError';
import { typeAs } from './terms/as-suffix';
import { typeAttribute } from './terms/attribute';
import { typeArray } from './terms/array';
import { Loc } from '../printing/ir/types';
import { enumToPretty } from '../printing/printTsLike';
import { printToString } from '../printing/printer';

const expandEffectVars = (
    effects: Array<EffectRef>,
    vbls: { [unique: number]: Array<EffectRef> },
    nullIfUnchanged: boolean,
): null | Array<EffectRef> => {
    let changed = false;
    const result: Array<EffectRef> = [];
    effects.forEach((eff) => {
        if (eff.type === 'var' && vbls[eff.sym.unique] != null) {
            result.push(...vbls[eff.sym.unique]);
            changed = true;
        } else {
            result.push(eff);
        }
    });
    if (changed || !nullIfUnchanged) {
        return result;
    }
    return null;
};

const subtEffectVars = (
    t: Type,
    vbls: { [unique: number]: Array<EffectRef> },
): Type => {
    return (
        walkType(t, (t) => {
            if (t.type === 'lambda') {
                let changed = false;
                const effects = expandEffectVars(t.effects, vbls, true);
                if (effects != null) {
                    return {
                        ...t,
                        effects,
                    };
                }
            }
            return null;
        }) || t
    );
};

export const subtTypeVars = (
    t: Type,
    vbls: { [unique: number]: Type },
    selfHash: string | undefined,
): Type => {
    return (
        walkType(t, (t) => {
            if (t.type === 'var') {
                if (vbls[t.sym.unique]) {
                    return vbls[t.sym.unique];
                }
                return t;
            }
            if (t.type === 'ref') {
                if (
                    t.ref.type === 'user' &&
                    t.ref.id.hash === '<self>' &&
                    selfHash != null
                ) {
                    t = {
                        ...t,
                        ref: { ...t.ref, id: { ...t.ref.id, hash: selfHash } },
                    };
                }
                if (t.typeVbls.length > 0) {
                    return {
                        ...t,
                        typeVbls: t.typeVbls.map((t) =>
                            subtTypeVars(t, vbls, selfHash),
                        ),
                    };
                }
                if (t.ref.type === 'builtin') {
                    return null;
                }
            }
            return null;
        }) || t
    );
};

export const showLocation = (loc: Location | null, startOnly?: boolean) => {
    if (!loc) {
        return `<no location>`;
    }
    if (startOnly) {
        return `${loc.source ? loc.source + ':' : ''}${loc.start.line}:${
            loc.start.column
        }`;
    }
    return `${loc.source ? loc.source + ':' : ''}${loc.start.line}:${
        loc.start.column
    }-${loc.end.line}:${loc.end.column}`;
};

export const applyEffectVariables = (
    env: Env | null,
    type: Type,
    vbls: Array<EffectRef>,
    loc?: Loc,
): Type => {
    if (type.type === 'lambda') {
        const t: LambdaType = type as LambdaType;

        const mapping: { [unique: number]: Array<EffectRef> } = {};

        if (type.effectVbls.length !== 1) {
            throw new LocatedError(
                loc || type.location,
                `Multiple effect variables not yet supported: ${
                    env ? showType(env, type) : 'no env for printing'
                }`,
            );
        }

        mapping[type.effectVbls[0]] = vbls;

        return {
            ...type,
            effectVbls: [],
            effects: expandEffectVars(type.effects, mapping, false)!,
            args: type.args.map((t) => subtEffectVars(t, mapping)),
            // TODO effects with type vars!
            rest: null, // TODO rest args
            res: subtEffectVars(type.res, mapping),
        };
        // } else if (type.type === 'ref') {
        //     const t: TypeRef = type as TypeRef;

        //     const mapping: { [unique: number]: Array<EffectRef> } = {};

        //     if (type.effectVbls.length !== 1) {
        //         throw new Error(
        //             `Multiple effect variables not yet supported: ${showType(env,
        //                 type,
        //             )} : ${showLocation(type.location)}`,
        //         );
        //     }

        //     mapping[type.effectVbls[0]] = vbls;

        //     return {
        //         ...type,
        //         effectVbls: [],
        //         effects: expandEffectVars(type.effects, mapping, false)!,
        //         args: type.args.map((t) => subtEffectVars(t, mapping)),
        //         // TODO effects with type vars!
        //         rest: null, // TODO rest args
        //         res: subtEffectVars(type.res, mapping),
        //     };
    }
    // should I go full-on whatsit? maybe not yet.
    throw new Error(`Can't apply variables to non-lambdas just yet`);
};

export const applyTypeVariablesToRecord = (
    env: Env,
    type: RecordDef,
    vbls: Array<Type>,
    location: Location | null,
    selfHash: string,
): RecordDef => {
    if (type.typeVbls.length !== vbls.length) {
        throw new LocatedError(
            location,
            `Expected ${type.typeVbls.length} at ${showLocation(
                location,
            )}, found ${vbls.length}`,
        );
    }
    const mapping = createTypeVblMapping(env, type.typeVbls, vbls);
    return {
        ...type,
        typeVbls: [],
        items: type.items.map((t) => subtTypeVars(t, mapping, selfHash)),
    };
};

export const applyTypeVariables = (
    env: Env | null,
    type: Type,
    vbls: Array<Type>,
    selfHash?: string,
): Type => {
    // console.log(
    //     `Applying ${showType(env, type)} with vbls ${vbls.map(showType).join(', ')}`,
    // );
    if (type.type === 'lambda') {
        const t: LambdaType = type as LambdaType;

        const mapping: { [unique: number]: Type } = {};
        if (vbls.length !== t.typeVbls.length) {
            console.log('the variables', t.typeVbls);
            throw new Error(
                `Wrong number of type variables: ${vbls.length} : ${t.typeVbls.length}`,
            );
        }
        vbls.forEach((typ, i) => {
            // STOPSHIP CHECK HERE
            if (env) {
                const subs = t.typeVbls[i].subTypes;
                for (let sub of subs) {
                    if (!hasSubType(env, typ, sub)) {
                        throw new Error(`Expected a subtype of ${idName(sub)}`);
                    }
                }
            }
            mapping[t.typeVbls[i].unique] = typ;
        });
        return {
            ...type,
            typeVbls: [], // TODO allow partial application!
            args: type.args.map((t) => subtTypeVars(t, mapping, selfHash)),
            // TODO effects with type vars!
            rest: null, // TODO rest args
            res: subtTypeVars(type.res, mapping, selfHash),
        };
    }
    // should I go full-on whatsit? maybe not yet.
    throw new Error(`Can't apply variables to non-lambdas just yet`);
};

const typeExpr = (env: Env, expr: Expression, expectedType?: Type): Term => {
    switch (expr.type) {
        case 'float':
            return {
                type: 'float',
                value: expr.value,
                location: expr.location,
                is: {
                    type: 'ref',
                    location: expr.location,
                    ref: { type: 'builtin', name: 'float' },
                    typeVbls: [],
                    // effectVbls: [],
                },
            };
        case 'int':
            return {
                type: 'int',
                value: expr.value,
                location: expr.location,
                is: {
                    type: 'ref',
                    location: expr.location,
                    ref: { type: 'builtin', name: 'int' },
                    typeVbls: [],
                    // effectVbls: [],
                },
            };
        case 'boolean':
            return {
                type: 'boolean',
                value: expr.value,
                location: expr.location,
                is: bool,
            };
        case 'string':
            return {
                type: 'string',
                text: expr.text,
                location: expr.location,
                is: string,
            };
        case 'Switch': {
            return typeSwitch(env, expr);
        }
        case 'block': {
            const inner: Array<Term | Let> = [];
            let innerEnv = env;
            for (let item of expr.items) {
                if (item.type === 'define') {
                    const value = typeExpr(innerEnv, item.expr);
                    innerEnv = subEnv(innerEnv);

                    const type = item.ann
                        ? typeType(innerEnv, item.ann)
                        : value.is;
                    if (item.ann) {
                        const err = getTypeError(
                            env,
                            value.is,
                            type,
                            expr.location,
                        );
                        if (err != null) {
                            throw new TypeError(
                                `Value of const doesn't match type annotation.`,
                            ).wrap(err);
                        }
                    }
                    const sym = makeLocal(innerEnv, item.id, type);
                    inner.push({
                        type: 'Let',
                        location: item.location,
                        idLocation: item.id.location,
                        binding: sym,
                        value,
                        is: type,
                    });
                } else {
                    inner.push(typeExpr(innerEnv, item));
                }
            }
            return {
                type: 'sequence',
                sts: inner,
                location: expr.location,
                is: inner.length ? inner[inner.length - 1].is : void_,
            };
        }
        case 'If': {
            const cond = typeExpr(env, expr.cond);
            const yes = typeExpr(env, expr.yes, expectedType);
            const no = expr.no ? typeExpr(env, expr.no, expectedType) : null;
            const condErr = getTypeError(
                env,
                cond.is,
                bool,
                expr.cond.location,
            );
            if (condErr !== null) {
                throw new LocatedError(
                    expr.location,
                    `Condition of if must be a boolean`,
                ).wrap(condErr);
            }

            const branchErr = getTypeError(
                env,
                yes.is,
                no ? no.is : void_,
                expr.yes.location,
            );
            if (branchErr !== null) {
                throw new LocatedError(
                    expr.location,
                    `Branches of if dont agree`,
                ).wrap(branchErr);
            }
            return {
                type: 'if',
                cond,
                yes,
                no,
                location: expr.location,
                is: yes.is,
            };
        }
        case 'ops': {
            return typeOps(env, expr);
        }
        case 'WithSuffix': {
            // if (expr.suffixes[0].type === 'Apply') {
            //     // OK here's where we'll want to do the bidirectional goodness.
            //     // So tbh we'll want oooooh ok folks
            //     // if we see a number without a decimal, we'll return a
            //     // AmbiguousNumeral(value), and when we're passing it in
            //     // somewhere, we can lock it down.........
            //     // START HERE yes.
            // }

            let target = typeExpr(env, expr.target);
            // So, among the denormalizations that we have,
            // the fact that references copy over the type of the thing
            // being referenced might be a little odd.
            for (let suffix of expr.suffixes) {
                if (suffix.type === 'Apply') {
                    target = typeApply(env, target, suffix);
                } else if (suffix.type === 'As') {
                    target = typeAs(env, target, suffix);
                } else if (suffix.type === 'Attribute') {
                    target = typeAttribute(env, target, suffix);
                } else if (suffix.type === 'Index') {
                    throw new Error(`Can't handle indexes yet`);
                } else {
                    throw new Error(
                        `Unhandled suffix ${showLocation(
                            (suffix as any).location,
                        )}`,
                    );
                }
            }
            return target;
        }
        case 'id': {
            const term = resolveIdentifier(env, expr);
            if (term != null) {
                return term;
            }
            throw new UnresolvedIdentifier(expr, env);
        }
        case 'lambda':
            return typeLambda(env, expr, expectedType);

        case 'handle': {
            return typeHandle(env, expr);
        }
        case 'raise': {
            const key = expr.name.text + '.' + expr.constr.text;
            const effid = env.global.effectConstructors[key];
            if (!effid) {
                throw new Error(`Unknown effect ${key}`);
            }
            const eff = env.global.effects[effid.idName][effid.idx];
            if (eff.args.length !== expr.args.length) {
                throw new Error(`Effect constructor wrong number of args`);
            }
            const ref: Reference = {
                type: 'user',
                id: idFromName(effid.idName),
            };
            const args: Array<Term> = [];
            expr.args.forEach((term, i) => {
                const t = typeExpr(env, term); // STOPSHIP figure this out , eff.args[i]);
                const err = getTypeError(env, t.is, eff.args[i], term.location);
                if (err != null) {
                    throw new TypeError(
                        `Wrong type for arg ${i} in raise!()`,
                    ).wrap(err);
                }
                // if (____(env, t.is, eff.args[i]) !== true) {
                //     throw new Error(
                //         `Wrong type for arg ${i}: ${showType(
                //             env,
                //             t.is,
                //         )}, expected ${showType(
                //             env,
                //             eff.args[i],
                //         )} - ${showLocation(t.location)}`,
                //     );
                // }
                args.push(t);
            });

            return {
                type: 'raise',
                location: expr.location,
                ref,
                idx: effid.idx,
                args,
                is: eff.ret,
            };
        }
        case 'Record': {
            return typeRecord(env, expr);
        }
        case 'Enum': {
            // TODO: make multiple names work
            const id = resolveType(env, expr.id)[0];

            // const ids = env.global.typeNames[expr.id.text];
            // if (!ids) {
            //     throw new Error(
            //         `No Enum type ${expr.id.text} at ${showLocation(
            //             expr.location,
            //         )}`,
            //     );
            // }
            // const id = ids[0];

            let t = env.global.types[idName(id)] as EnumDef;
            if (t.type !== 'Enum') {
                throw new Error(
                    `${expr.id.text} is not an enum. ${showLocation(
                        expr.location,
                    )}`,
                );
            }

            const typeVbls = expr.typeVbls.map((t) => typeType(env, t));
            const is: TypeReference = {
                type: 'ref',
                ref: { type: 'user', id },
                location: expr.id.location,
                typeVbls,
            };

            const inner = typeExpr(env, expr.expr);
            try {
                if (!typeFitsEnum(env, inner.is, is, expr.location)) {
                    throw new LocatedError(
                        expr.location,
                        `Record ${showType(
                            env,
                            inner.is,
                        )} doesn't fit enum ${showType(
                            env,
                            is,
                        )} at ${showLocation(expr.location)}`,
                    );
                }
            } catch (err) {
                throw new LocatedError(expr.location, err.message);
            }

            return {
                type: 'Enum',
                inner,
                location: expr.location,
                is,
            };
        }
        case 'Trace': {
            const args: Array<Term> = expr.args.map((item) => {
                return typeExpr(env, item);
            });
            return {
                type: 'Trace',
                location: expr.location,
                idx: env.term.nextTraceId++, // STOPSHIP: make this actually a thing
                args,
                is: args[0].is,
            };
        }
        case 'Tuple': {
            const items: Array<Term> = expr.items.map((item) => {
                return typeExpr(env, item);
            });
            if (items.length < 2) {
                throw new Error(`Can't have a 1-tuple`);
            }
            return {
                type: 'Tuple',
                location: expr.location,
                items,
                is: tupleType(
                    items.map((t) => t.is),
                    expr.location,
                ),
            };
        }
        case 'Array': {
            return typeArray(env, expr);
        }
        case 'Decorated': {
            const inner = typeExpr(env, expr.wrapped);
            if (inner.type === 'lambda') {
                inner.tags = expr.decorators.map((d) => d.id.text);
            } else {
                throw new Error(`Only lambdas can be decorated right now`);
            }
            return inner;
        }
        case 'Unary': {
            const inner = typeExpr(env, expr.inner);
            if (!env.global.attributeNames[expr.op]) {
                if (expr.op === '-' && typesEqual(inner.is, float)) {
                    return {
                        type: 'unary',
                        op: '-',
                        inner,
                        location: expr.location,
                        is: float,
                    };
                }

                if (expr.op === '-' && typesEqual(inner.is, int)) {
                    return {
                        type: 'unary',
                        op: '-',
                        inner,
                        location: expr.location,
                        is: int,
                    };
                }

                throw new LocatedError(
                    expr.location,
                    `Unknown unary op ${expr.op}`,
                );
            }
            const { idx, id } = env.global.attributeNames[expr.op][0];
            const fn = findUnaryOp(env, id, idx, inner.is, expr.location);
            if (!fn) {
                if (expr.op === '-' && typesEqual(inner.is, float)) {
                    return {
                        type: 'unary',
                        op: '-',
                        inner,
                        location: expr.location,
                        is: float,
                    };
                }
                throw new LocatedError(expr.location, `No matching unary fn`);
            }
            return {
                type: 'apply',
                location: expr.location,
                target: fn,
                hadAllVariableEffects: false,
                effectVbls: null,
                typeVbls: [],
                args: [inner],
                is: (fn.is as LambdaType).res,
            };
        }
        default:
            let _x: never = expr;
            throw new Error(`Unexpected parse type ${(expr as any).type}`);
    }
};

export const arrayType = (elemType: Type): TypeReference => ({
    type: 'ref',
    ref: { type: 'builtin', name: 'Array' },
    location: nullLocation,
    typeVbls: [elemType],
    // effectVbls: [],
});

export const tupleType = (
    itemTypes: Array<Type>,
    location: Location,
): TypeReference => ({
    type: 'ref',
    ref: { type: 'builtin', name: `Tuple${itemTypes.length}` },
    location,
    typeVbls: itemTypes,
    // effectVbls: [],
});

export const typeDef = (
    env: GlobalEnv,
    ref: Reference,
): RecordDef | EnumDef | null => {
    if (ref.type === 'builtin') {
        return null;
    }
    return env.types[idName(ref.id)];
};

// TODO: ensure that type variables fit.
export const typeFitsEnum = (
    env: Env,
    recordType: Type,
    enumRef: TypeReference,
    location: Location,
): boolean => {
    if (recordType.type !== 'ref') {
        throw new Error(
            `Can only wrap a concrete record (or other enum) in an enum, not ${
                recordType.type
            }. ${showLocation(location)}`,
        );
    }
    const t = typeDef(env.global, recordType.ref);
    if (t == null) {
        throw new Error(
            `Can't resolve type definition ${showType(env, recordType)}`,
        );
    }

    const selfHash =
        enumRef.ref.type === 'user' ? enumRef.ref.id.hash : undefined;
    const allReferences = getEnumReferences(env, enumRef);

    if (t.type === 'Enum') {
        // The "found" type is an enum.
        const innerReferences = getEnumReferences(env, recordType);
        for (let ref of innerReferences) {
            let found = false;
            const errs: Array<TypeError> = [];
            for (let outer of allReferences) {
                const err = getTypeError(env, ref, outer, location);
                if (err != null) {
                    errs.push(err);
                    continue;
                }
                found = true;
                break;
            }
            if (!found) {
                errs.forEach((e) => console.log(e));
                throw new Error(
                    `Enum ${showType(
                        env,
                        recordType,
                    )} is not a subtype of ${showType(
                        env,
                        enumRef,
                    )}. ${showType(
                        env,
                        ref,
                    )} is a member of the former but not the latter.`,
                );
            }
        }
        return true;
    }
    // Otherwise, the found type is a ref.
    for (let ref of allReferences) {
        const err = getTypeError(env, recordType, ref, location);
        if (err == null) {
            return true;
        }
    }
    return false;
};

export const getEnumSuperTypes = (
    env: Env,
    enumRef: TypeReference,
): Array<UserTypeReference> => {
    let enumDef = typeDef(env.global, enumRef.ref);
    if (enumDef == null) {
        throw new Error(`Unknown type definition ${showType(env, enumRef)}`);
    }
    if (enumDef.type !== 'Enum') {
        throw new Error(`Not an enum, it's a record ${showType(env, enumRef)}`);
    }
    enumDef = applyTypeVariablesToEnum(
        env,
        enumDef,
        enumRef.typeVbls,
        enumRef.ref.type === 'user' ? enumRef.ref.id.hash : undefined,
    );
    if (!enumDef.extends.length) {
        return enumDef.extends;
    }
    return enumDef.extends.concat(
        ...enumDef.extends.map((r) => getEnumSuperTypes(env, r)),
    );
};

export const getEnumReferences = (
    env: Env,
    enumRef: TypeReference,
): Array<UserTypeReference> => {
    let enumDef = typeDef(env.global, enumRef.ref);
    if (enumDef == null) {
        throw new Error(`Unknown type definition ${showType(env, enumRef)}`);
    }
    if (enumDef.type !== 'Enum') {
        if (enumRef.ref.type === 'user') {
            return [enumRef as UserTypeReference];
        } else {
            throw new Error(`builtin record, cant do it`);
        }
    }
    enumDef = applyTypeVariablesToEnum(
        env,
        enumDef,
        enumRef.typeVbls,
        enumRef.ref.type === 'user' ? enumRef.ref.id.hash : undefined,
    );
    if (!enumDef.extends.length) {
        return enumDef.items;
    }
    // console.log(enumDef);
    return enumDef.items.concat(
        ...enumDef.extends.map((r) => getEnumReferences(env, r)),
    );
};

export const createTypeVblMapping = (
    env: Env,
    typeVbls: Array<TypeVblDecl>,
    vbls: Array<Type>,
): { [unique: number]: Type } => {
    // console.log('create mapping', vbls);
    const mapping: { [unique: number]: Type } = {};
    if (vbls.length !== typeVbls.length) {
        // console.log('the ones', typeVbls);
        throw new Error(
            `Wrong number of type variables: ${vbls.length} : ${typeVbls.length}`,
        );
    }

    vbls.forEach((typ, i) => {
        const subs = typeVbls[i].subTypes;
        // console.log(i, typ, subs);
        for (let sub of subs) {
            if (!hasSubType(env, typ, sub)) {
                throw new Error(`Expected a subtype of ${idName(sub)}`);
            }
        }
        mapping[typeVbls[i].unique] = typ;
    });

    return mapping;
};

export const applyTypeVariablesToEnum = (
    env: Env,
    type: EnumDef,
    vbls: Array<Type>,
    selfHash: string | undefined,
): EnumDef => {
    if (vbls.length === 0 && type.typeVbls.length === 0) {
        return type;
    }
    const mapping = createTypeVblMapping(env, type.typeVbls, vbls);

    return {
        type: 'Enum',
        typeVbls: [],
        effectVbls: [], // STOPSHIP effect vbls for enums
        items: type.items.map(
            (t) => subtTypeVars(t, mapping, selfHash) as UserTypeReference,
        ),
        extends: type.extends.map(
            (t) => subtTypeVars(t, mapping, selfHash) as UserTypeReference,
        ),
        location: type.location,
    };
};

export const findAs = (
    env: Env,
    stype: Type,
    ttype: Type,
    location: Location,
): UserReference | null => {
    const asRecord: UserReference = {
        type: 'user',
        id: { hash: 'As', pos: 0, size: 1 },
    };
    const goalType: Type = {
        type: 'ref',
        ref: asRecord,
        typeVbls: [stype, ttype],
        // effectVbls: [],
        location,
    };
    let found = null;
    Object.keys(env.global.terms).some((k) => {
        const t = env.global.terms[k];
        if (getTypeError(env, goalType, t.is, location) == null) {
            found = idFromName(k);
            return true;
        } else if (
            t.type === 'ref' &&
            t.ref.type === 'user' &&
            t.ref.id.hash === 'As'
        ) {
            console.log('got the as', t);
        }
    });
    if (found == null) {
        return null;
    }
    return { type: 'user', id: found };
};

export default typeExpr;
