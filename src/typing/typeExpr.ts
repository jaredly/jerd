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
import { showType, fitsExpectation, assertFits } from './unify';
import { void_, string, bool } from './preset';
import { hasSubType, idName, resolveIdentifier } from './env';
import { typeLambda } from './terms/lambda';
import { typeHandle } from './terms/handle';
import { typeRecord } from './terms/record';
import { typeApply } from './terms/apply';
import { typeSwitch } from './terms/switch';

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
                if (t.ref.type === 'builtin') {
                    return null;
                }
                if (t.typeVbls.length > 0) {
                    return {
                        ...t,
                        typeVbls: t.typeVbls.map((t) => subtTypeVars(t, vbls)),
                    };
                }
            }
            return null;
        }) || t
    );
};

export const showLocation = (loc: Location | null) => {
    if (!loc) {
        return `<no location>`;
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
                    if (
                        item.ann &&
                        fitsExpectation(env, value.is, type) === false
                    ) {
                        throw new Error(
                            `Value of const doesn't match type annotation. ${showType(
                                env,
                                value.is,
                            )}, expected ${showType(env, type)}`,
                        );
                    }
                    const unique = Object.keys(innerEnv.local.locals).length;
                    const sym: Symbol = { name: item.id.text, unique };
                    innerEnv.local.locals[item.id.text] = { sym, type };
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
            if (fitsExpectation(env, cond.is, bool) !== true) {
                throw new Error(`Condition of if must be a boolean`);
            }

            if (fitsExpectation(env, yes.is, no ? no.is : void_) !== true) {
                throw new Error(`Branches of if dont agree`);
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
            // ok, left associative, right? I think so.
            let left: Term = typeExpr(env, expr.first);
            expr.rest.forEach(({ op, right, location }) => {
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
                const rarg = typeExpr(env, right);

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

                if (fitsExpectation(env, left.is, is.args[0]) !== true) {
                    throw new Error(`first arg to ${op} wrong type`);
                }
                if (fitsExpectation(env, rarg.is, is.args[1]) !== true) {
                    throw new Error(`second arg to ${op} wrong type`);
                }
                left = {
                    type: 'apply',
                    location: {
                        start: left.location.start,
                        end: right.location.end,
                    },
                    target: {
                        location,
                        type: 'ref',
                        ref: { type: 'builtin', name: op },
                        is,
                    },
                    args: [left, rarg],
                    is: is.res,
                };
            });
            return left;
        }
        case 'WithSuffix': {
            let target = typeExpr(env, expr.target);
            // So, among the denormalizations that we have,
            // the fact that references copy over the type of the thing
            // being referenced might be a little odd.
            for (let suffix of expr.suffixes) {
                if (suffix.type === 'Apply') {
                    target = typeApply(env, target, suffix);
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
                    if (suffix.id.text.match(/^\d+$/)) {
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
                // console.log(`${expr.text} : ${showType(env, term.is)}`);
                return term;
            }
            // console.log(env.local.locals);
            throw new Error(
                `Identifier "${expr.text}" at ${showLocation(
                    expr.location,
                )} hasn't been defined anywhere.`,
            );
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
                if (fitsExpectation(env, t.is, eff.args[i]) !== true) {
                    throw new Error(
                        `Wrong type for arg ${i}: ${showType(
                            env,
                            t.is,
                        )}, expected ${showType(
                            env,
                            eff.args[i],
                        )} - ${showLocation(t.location)}`,
                    );
                }
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
        // console.log(allReferences.map(showType));
        // console.log(innerReferences.map(showType));
        for (let ref of innerReferences) {
            let found = false;
            for (let outer of allReferences) {
                if (fitsExpectation(null, ref, outer)) {
                    found = true;
                    break;
                }
                // console.log(showType(env, outer), showType(env, ref));
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
        // throw new Error('enum coersion not yet supported');
    }
    // const enumDef = typeDef(env, enumRef.ref)
    // if (enumDef == null || enumDef.type !== 'Enum') {
    //     throw new Error(`Not an enum ${showType(env, enumRef)}`)
    // }
    for (let ref of allReferences) {
        if (isRecord(recordType, ref.ref)) {
            return true;
        }
    }
    // console.log('References', allReferences);
    // console.log(recordType);
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
    };
};

export default typeExpr;
