import {
    Env,
    Type,
    Term,
    Reference,
    Symbol,
    LambdaType,
    Let,
    typesEqual,
    EffectRef,
    isRecord,
    TypeRef,
    TypeReference,
    RecordDef,
    ArraySpread,
    Id,
    UserReference,
    EnumDef,
    GlobalEnv,
    RecordType,
    TypeVblDecl,
    Pattern,
} from './types';
import { Expression, Location } from '../parsing/parser';
import { subEnv } from './types';
import typeType, { walkType } from './typeType';
import { showType, assertFits } from './unify';
import { void_, string, bool, pureFunction } from './preset';
import {
    hasSubType,
    idFromName,
    idName,
    makeLocal,
    resolveIdentifier,
    symPrefix,
} from './env';
import { typeLambda } from './terms/lambda';
import { typeHandle } from './terms/handle';
import { typeRecord } from './terms/record';
import { typeApply } from './terms/apply';
import { typeSwitch } from './terms/switch';
import { typeOps } from './terms/ops';
import { LocatedError, TypeError, UnresolvedIdentifier } from './errors';
import { getTypeError } from './getTypeError';

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
                if (t.typeVbls.length > 0) {
                    return {
                        ...t,
                        typeVbls: t.typeVbls.map((t) => subtTypeVars(t, vbls)),
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
        return `${loc.start.line}:${loc.start.column}`;
    }
    return `${loc.start.line}:${loc.start.column}-${loc.end.line}:${loc.end.column}`;
};

export const applyEffectVariables = (
    env: Env,
    type: Type,
    vbls: Array<EffectRef>,
): Type => {
    if (type.type === 'lambda') {
        const t: LambdaType = type as LambdaType;

        const mapping: { [unique: number]: Array<EffectRef> } = {};

        if (type.effectVbls.length !== 1) {
            throw new Error(
                `Multiple effect variables not yet supported: ${showType(
                    env,
                    type,
                )} : ${showLocation(type.location)}`,
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
): RecordDef => {
    if (type.typeVbls.length !== vbls.length) {
        throw new Error(
            `Expected ${type.typeVbls.length} at ${showLocation(
                location,
            )}, found ${vbls.length}`,
        );
    }
    const mapping = createTypeVblMapping(env, type.typeVbls, vbls);
    return {
        ...type,
        typeVbls: [],
        items: type.items.map((t) => subtTypeVars(t, mapping)),
    };
};

export const applyTypeVariables = (
    env: Env,
    type: Type,
    vbls: Array<Type>,
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
            const subs = t.typeVbls[i].subTypes;
            for (let sub of subs) {
                if (!hasSubType(env, typ, sub)) {
                    throw new Error(`Expected a subtype of ${idName(sub)}`);
                }
            }
            // if (hasSubType(typ, ))
            mapping[t.typeVbls[i].unique] = typ;
        });
        // console.log(`Mapping`, mapping);
        return {
            ...type,
            typeVbls: [], // TODO allow partial application!
            args: type.args.map((t) => subtTypeVars(t, mapping)),
            // TODO effects with type vars!
            rest: null, // TODO rest args
            res: subtTypeVars(type.res, mapping),
        };
    }
    // should I go full-on whatsit? maybe not yet.
    throw new Error(`Can't apply variables to non-lambdas just yet`);
};

const typeExpr = (env: Env, expr: Expression, hint?: Type | null): Term => {
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
                    effectVbls: [],
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
                    effectVbls: [],
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
                        binding: sym,
                        value,
                        is: void_,
                    });
                } else {
                    inner.push(typeExpr(innerEnv, item));
                }
            }
            return {
                type: 'sequence',
                sts: inner,
                location: expr.location,
                is: inner[inner.length - 1].is,
            };
        }
        case 'If': {
            const cond = typeExpr(env, expr.cond);
            const yes = typeExpr(env, expr.yes);
            const no = expr.no ? typeExpr(env, expr.no) : null;
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
            let target = typeExpr(env, expr.target);
            // So, among the denormalizations that we have,
            // the fact that references copy over the type of the thing
            // being referenced might be a little odd.
            for (let suffix of expr.suffixes) {
                if (suffix.type === 'Apply') {
                    target = typeApply(env, target, suffix);
                } else if (suffix.type === 'As') {
                    const ttype = typeType(env, suffix.t);
                    const stype = target.is;
                    // Look for an `As` that fits!
                    const asRecord: UserReference = {
                        type: 'user',
                        id: { hash: 'As', pos: 0, size: 1 },
                    };
                    const goalType: Type = {
                        type: 'ref',
                        ref: asRecord,
                        typeVbls: [stype, ttype],
                        effectVbls: [],
                        location: null,
                    };
                    let foundImpl: Term;
                    if (suffix.hash != null) {
                        if (suffix.hash.startsWith(symPrefix)) {
                            const symNum = +suffix.hash.slice(symPrefix.length);
                            const local = env.local.locals[symNum];
                            if (!local) {
                                throw new LocatedError(
                                    suffix.location,
                                    `No symbol ${suffix.hash}`,
                                );
                            }
                            const err = getTypeError(
                                env,
                                local.type,
                                goalType,
                                suffix.location,
                            );
                            if (err != null) {
                                throw err;
                            }
                            foundImpl = {
                                type: 'var',
                                sym: local.sym,
                                location: suffix.location,
                                is: local.type,
                            };
                        } else {
                            const t = env.global.terms[suffix.hash.slice(1)];
                            if (!t) {
                                throw new LocatedError(
                                    suffix.location,
                                    `Unknown term ${suffix.hash.slice(1)}`,
                                );
                            }
                            const err = getTypeError(
                                env,
                                t.is,
                                goalType,
                                suffix.location,
                            );
                            if (err != null) {
                                throw err;
                            }
                            foundImpl = {
                                type: 'ref',
                                ref: {
                                    type: 'user',
                                    id: idFromName(suffix.hash.slice(1)),
                                },
                                is: t.is,
                                location: suffix.location,
                            };
                        }
                    } else {
                        const ref = findAs(env, stype, ttype, suffix.location);
                        if (ref == null) {
                            // STOPSHIP: make a "type error" node type.
                            // repls and stuff can allow compiling with them,
                            // but if you want to actually compile a runnable thing,
                            // it won't let you.
                            throw new Error(
                                `No impl found for as ${showType(
                                    env,
                                    stype,
                                )} (as) ${showType(env, ttype)}`,
                            );
                        }

                        foundImpl = {
                            type: 'ref',
                            ref,
                            is: goalType,
                            location: null,
                        };
                    }
                    target = {
                        type: 'apply',
                        originalTargetType: pureFunction([stype], ttype),
                        args: [target],
                        hadAllVariableEffects: false,
                        target: {
                            type: 'Attribute',
                            target: foundImpl,
                            idx: 0,
                            ref: asRecord,
                            location: null,
                            inferred: true,
                            is: pureFunction([stype], ttype),
                        },
                        typeVbls: [],
                        effectVbls: null,
                        is: ttype,
                        location: null,
                    };
                } else if (suffix.type === 'Attribute') {
                    // OOOOKKK.
                    // So here we have some choices, right?
                    // first we find the object this is likely to be attached to
                    // ermmm yeah maybe this is where constraint solving becomes a thing?
                    // which, ugh
                    // So yeah, when parsing, if there are multiple things with the
                    // same name, tough beans I'm sorry.
                    // Oh maybe allow it to be "fully qualified"?
                    // like `.<Person>name`? or `.Person::name`?
                    // yeah that could be cool.
                    let idx: number;
                    let ref: UserReference;
                    if (suffix.id.hash != null) {
                        const [id, num] = suffix.id.hash.slice(1).split('#');
                        ref = { type: 'user', id: idFromName(id) };
                        idx = +num;
                    } else if (suffix.id.text.match(/^\d+$/)) {
                        idx = +suffix.id.text;
                        if (
                            target.is.type !== 'ref' ||
                            target.is.ref.type !== 'user'
                        ) {
                            throw new Error(
                                `Not a record ${showType(
                                    env,
                                    target.is,
                                )} at ${showLocation(suffix.location)}`,
                            );
                        }
                        ref = target.is.ref;
                    } else {
                        if (!env.global.attributeNames[suffix.id.text]) {
                            throw new Error(
                                `Unknown attribute name ${suffix.id.text}`,
                            );
                        }
                        const attr = env.global.attributeNames[suffix.id.text];
                        idx = attr.idx;
                        const id = attr.id;
                        ref = { type: 'user', id };
                        if (
                            !isRecord(target.is, ref) &&
                            !hasSubType(env, target.is, id)
                        ) {
                            throw new Error(
                                `Expression at ${showLocation(
                                    suffix.location,
                                )} is not a ${idName(
                                    id,
                                )} or its supertype. It is a ${showType(
                                    env,
                                    target.is,
                                )}`,
                            );
                        }
                    }

                    let t = env.global.types[idName(ref.id)];
                    if (t.type !== 'Record') {
                        throw new Error(`Not a record ${idName(ref.id)}`);
                    }
                    if (target.is.type === 'ref') {
                        t = applyTypeVariablesToRecord(
                            env,
                            t,
                            target.is.typeVbls,
                            target.is.location,
                        );
                    }
                    if (t.type !== 'Record') {
                        throw new Error(
                            `${idName(ref.id)} is not a record type`,
                        );
                    }

                    target = {
                        type: 'Attribute',
                        target,
                        location: suffix.location,
                        inferred: false,
                        idx,
                        ref,
                        is: t.items[idx],
                    };
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
            return typeLambda(env, expr);

        case 'handle': {
            return typeHandle(env, expr);
        }
        case 'raise': {
            const key = expr.name.text + '.' + expr.constr.text;
            const effid = env.global.effectConstructors[key];
            if (!effid) {
                throw new Error(`Unknown effect ${key}`);
            }
            const eff = env.global.effects[effid.hash][effid.idx];
            if (eff.args.length !== expr.args.length) {
                throw new Error(`Effect constructor wrong number of args`);
            }
            const ref: Reference = {
                type: 'user',
                id: { hash: effid.hash, size: 1, pos: 0 },
            };
            const args: Array<Term> = [];
            expr.args.forEach((term, i) => {
                const t = typeExpr(env, term, eff.args[i]);
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
            const id = env.global.typeNames[expr.id.text];
            if (!id) {
                throw new Error(
                    `No Enum type ${expr.id.text} at ${showLocation(
                        expr.location,
                    )}`,
                );
            }

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
                effectVbls: [],
            };

            const inner = typeExpr(env, expr.expr);
            try {
                if (!typeFitsEnum(env, inner.is, is, expr.location)) {
                    throw new Error(
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
                throw new Error(
                    err.message + ' : ' + showLocation(expr.location),
                );
            }

            return {
                type: 'Enum',
                inner,
                location: expr.location,
                is,
            };
        }
        case 'Array': {
            // ok so the type of the first one determines it?
            // I mean, what syntax are we thinking of here for explicitly typed array?
            // like <x>[1, 2, 3]? I guess. It would be consistent. And like somewhat weird.
            // ok we can cross that bridge in a minute.
            // I guess another option would be to search for the common supertype, if it exists.
            // oh and for an empty array? what do we do? erm yeah. gotta be explicit?
            // or we could just type it as never...
            let itemType: Type | null = expr.ann
                ? typeType(env, expr.ann)
                : null;
            if (expr.ann == null && expr.items.length === 0) {
                itemType = void_;
            }
            const items: Array<Term | ArraySpread> = expr.items.map((item) => {
                if (item.type === 'ArraySpread') {
                    const value = typeExpr(env, item.value);
                    if (
                        !isRecord(value.is, {
                            type: 'builtin',
                            name: 'Array',
                        })
                    ) {
                        throw new Error(
                            `Can't spread something that's not an array. ${showType(
                                env,
                                value.is,
                            )} at ${showLocation(value.location)}`,
                        );
                    }
                    if (itemType == null) {
                        itemType = (value.is as TypeReference).typeVbls[0];
                    } else {
                        assertFits(
                            env,
                            (value.is as TypeReference).typeVbls[0],
                            itemType,
                            value.location,
                        );
                    }
                    return {
                        type: 'ArraySpread',
                        location: item.location,
                        value,
                    };
                } else {
                    const value = typeExpr(env, item);
                    if (itemType == null) {
                        itemType = value.is;
                    } else {
                        assertFits(env, value.is, itemType);
                    }
                    return value;
                }
            });
            return {
                type: 'Array',
                location: expr.location,
                items,
                is: {
                    type: 'ref',
                    ref: { type: 'builtin', name: 'Array' },
                    location: null,
                    typeVbls: [itemType!],
                    effectVbls: [],
                },
            };
        }
        default:
            let _x: never = expr;
            throw new Error(`Unexpected parse type ${(expr as any).type}`);
    }
};

const typeDef = (
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

    const allReferences = getEnumReferences(env, enumRef);

    if (t.type === 'Enum') {
        const innerReferences = getEnumReferences(env, recordType);
        for (let ref of innerReferences) {
            let found = false;
            for (let outer of allReferences) {
                const err = getTypeError(env, ref, outer, location);
                if (err != null) {
                    continue;
                }
                found = true;
                break;
            }
            if (!found) {
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
    for (let ref of allReferences) {
        if (isRecord(recordType, ref.ref)) {
            return true;
        }
    }
    return false;
};

export const getEnumSuperTypes = (
    env: Env,
    enumRef: TypeReference,
): Array<TypeReference> => {
    let enumDef = typeDef(env.global, enumRef.ref);
    if (enumDef == null) {
        throw new Error(`Unknown type definition ${showType(env, enumRef)}`);
    }
    if (enumDef.type !== 'Enum') {
        throw new Error(`Not an enum, it's a record ${showType(env, enumRef)}`);
    }
    enumDef = applyTypeVariablesToEnum(env, enumDef, enumRef.typeVbls);
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
): Array<TypeReference> => {
    let enumDef = typeDef(env.global, enumRef.ref);
    if (enumDef == null) {
        throw new Error(`Unknown type definition ${showType(env, enumRef)}`);
    }
    if (enumDef.type !== 'Enum') {
        throw new Error(`Not an enum, it's a record ${showType(env, enumRef)}`);
    }
    enumDef = applyTypeVariablesToEnum(env, enumDef, enumRef.typeVbls);
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
): EnumDef => {
    if (vbls.length === 0 && type.typeVbls.length === 0) {
        return type;
    }
    const mapping = createTypeVblMapping(env, type.typeVbls, vbls);

    return {
        type: 'Enum',
        typeVbls: [],
        effectVbls: [], // STOPSHIP effect vbls for enums
        items: type.items.map((t) => subtTypeVars(t, mapping) as TypeReference),
        extends: type.extends.map(
            (t) => subtTypeVars(t, mapping) as TypeReference,
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
        effectVbls: [],
        location: null,
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
