// General thing

import { Location } from '../../parsing/parser';
import { idName, newSym, refName } from '../../typing/env';
import { LocatedError } from '../../typing/errors';
import { binOps } from '../../typing/preset';
import { applyEffectVariables } from '../../typing/typeExpr';
import {
    EffectRef,
    EffectReference,
    Env,
    LambdaType as TermLambdaType,
    LambdaType as TLambdaType,
    nullLocation,
    Reference,
    Symbol,
    Term,
    Type as TermType,
    RecordDef as TermRecordDef,
    TypeVblDecl,
} from '../../typing/types';
import { args, atom, id, items, PP, printToString } from '../printer';
import { refToPretty, symToPretty } from '../printTsLike';
import { handleArgsForEffects, handlerTypesForEffects } from './cps';
import { defaultVisitor, transformExpr } from './transform';
import {
    Apply,
    Arg,
    Assign,
    Block,
    CPS,
    CPSLambdaType,
    Define,
    DoneLambdaType,
    EffectHandler,
    Expr,
    LambdaExpr,
    LambdaType,
    Loc,
    MaybeEffLambda,
    OutputOptions,
    RecordDef,
    Stmt,
    Type,
    typeForLambdaExpression,
    typesEqual,
} from './types';

// import { getTypeError } from '../../typing/getTypeError';

const cmp = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

export const isLiteral = (expr: Expr) => {
    switch (expr.type) {
        case 'int':
        case 'float':
        case 'string':
        case 'boolean':
            return true;
        default:
            return false;
    }
};

export const expectLambdaType = (
    env: Env,
    opts: OutputOptions,
    t: Type,
): LambdaType => {
    if (t.type === 'cps-lambda') {
        return cpsLambdaToLambda(env, opts, t);
    }
    if (t.type !== 'lambda') {
        throw new Error('not a lambda type');
    }
    return t;
};

export const doneLambdaToLambda = (
    env: Env,
    opts: OutputOptions,
    type: DoneLambdaType,
): LambdaType => {
    throw new Error('nipe');
};

export const cpsLambdaToLambda = (
    env: Env,
    opts: OutputOptions,
    type: CPSLambdaType,
): LambdaType => {
    const doneArgs = handlerTypesForEffects(env, opts, type.effects, type.loc);
    if (!typesEqual(type.returnValue, void_)) {
        doneArgs.push(type.returnValue);
    }
    return {
        type: 'lambda',
        loc: type.loc,
        typeVbls: type.typeVbls,
        note: 'from cps lambda',
        args: type.args.concat([
            ...handlerTypesForEffects(env, opts, type.effects, type.loc),
            pureFunction(doneArgs, void_),
        ]),
        res: void_,
        rest: null,
    };
};

export const sortedExplicitEffects = (
    effects: Array<EffectRef>,
): Array<EffectReference> => {
    const deduped: { [key: string]: EffectReference } = {};
    effects.forEach((eff) => {
        if (eff.type === 'ref') {
            deduped[refName(eff.ref)] = eff;
        }
    });
    const ids = Object.keys(deduped);
    ids.sort(cmp);
    return ids.map((id) => deduped[id]);
};

export const tupleType = (itemTypes: Array<Type>, loc: Loc): Type => ({
    type: 'ref',
    ref: { type: 'builtin', name: `Tuple${itemTypes.length}` },
    loc,
    typeVbls: itemTypes,
});

export const builtinType = (
    name: string,
    typeVbls: Array<Type> = [],
    loc: Location = nullLocation,
): Type => ({
    type: 'ref',
    ref: { type: 'builtin', name },
    loc,
    typeVbls,
});

export const pureFunction = (
    args: Array<Type>,
    res: Type,
    typeVbls: Array<TypeVblDecl> = [],
    loc: Location = nullLocation,
): LambdaType => {
    return {
        type: 'lambda',
        typeVbls,
        args,
        rest: null,
        res,
        loc,
    };
};

export const handlerSym = { name: 'handlers', unique: 15000 };
export const handlersType: Type = {
    type: 'effect-handler',
    ref: { type: 'builtin', name: 'Handlers' },
    loc: nullLocation,
};

export const int: Type = builtinType('int');
export const float: Type = builtinType('float');
export const string: Type = builtinType('string');
export const void_: Type = builtinType('void');
export const bool: Type = builtinType('bool');

export const lambdaTypeFromTermType = (
    env: Env,
    opts: OutputOptions,
    type: TermLambdaType,
): LambdaType | CPSLambdaType | MaybeEffLambda => {
    return typeFromTermType(env, opts, type) as LambdaType | MaybeEffLambda;
};

export const _lambdaTypeFromTermType = (
    env: Env,
    opts: OutputOptions,
    type: TermLambdaType,
): LambdaType | CPSLambdaType => {
    const mapType = (t: TermType) => typeFromTermType(env, opts, t);
    if (type.effects.length) {
        return {
            type: 'cps-lambda',
            loc: type.location,
            typeVbls: type.typeVbls,
            note: 'from with effects',
            args: type.args.map(mapType),
            effects: type.effects,
            effectVbls: type.effectVbls,
            returnValue: mapType(type.res),
        };
    }
    return {
        type: 'lambda',
        loc: type.location,
        typeVbls: type.typeVbls,
        args: type.args.map(mapType),
        rest: type.rest ? mapType(type.rest) : null,
        res: mapType(type.res),
    };
};

export const parseCPSArgs = (args: Array<Type>) => {
    const normal: Array<Type> = [];
    const handlers: Array<EffectHandler> = [];
    const done = args[args.length - 1];
    let inEffects = false;
    args.slice(0, -1).forEach((arg, i) => {
        if (!inEffects && arg.type === 'effect-handler') {
            inEffects = true;
        }
        if (!inEffects) {
            normal.push(arg);
            return;
        } else if (arg.type === 'effect-handler') {
            handlers.push(arg);
            return;
        }
        throw new Error(`Unexpected cps arg`);
    });
    return { normal, handlers, done };
};

export const recordDefFromTermType = (
    env: Env,
    opts: OutputOptions,
    defn: TermRecordDef,
): RecordDef => {
    return {
        type: 'Record',
        unique: defn.unique,
        location: defn.location,
        typeVbls: defn.typeVbls,
        extends: defn.extends,
        items: defn.items.map((t) => typeFromTermType(env, opts, t)),
        ffi: defn.ffi,
    };
};

export const typeFromTermType = (
    env: Env,
    opts: OutputOptions,
    type: TermType,
): Type => {
    switch (type.type) {
        case 'ref':
            if (type.ref.type === 'builtin' && type.ref.name === 'Array') {
                return {
                    type: 'Array',
                    inner: typeFromTermType(env, opts, type.typeVbls[0]),
                    loc: type.location,
                    inferredSize: null,
                };
            }
            return {
                type: 'ref',
                ref: type.ref,
                loc: type.location,
                typeVbls: type.typeVbls.map((t) =>
                    typeFromTermType(env, opts, t),
                ),
            };
        case 'Hole':
        case 'InvalidTypeApplication':
        case 'NotFound':
        case 'NotASubType':
        case 'Ambiguous':
            throw new Error(
                `Cannot convert ambiguous type to IR. Must resolve before printing.`,
            );
        case 'var':
            return {
                type: 'var',
                sym: type.sym,
                loc: type.location,
            };
        case 'lambda':
            if (type.effects.length) {
                if (
                    type.effects.every((x) => x.type === 'var') &&
                    type.effectVbls.length === 1
                ) {
                    const directVersion = applyEffectVariables(
                        null as any,
                        type,
                        [],
                    );
                    return {
                        type: 'effectful-or-direct',
                        loc: type.location,
                        effectful: _lambdaTypeFromTermType(
                            env,
                            opts,
                            type,
                        ) as CPSLambdaType,
                        direct: expectLambdaType(
                            env,
                            opts,
                            _lambdaTypeFromTermType(
                                env,
                                opts,
                                directVersion as TLambdaType,
                            ),
                        ),
                    };
                }
            }
            return _lambdaTypeFromTermType(env, opts, type);
    }
};

export const isConstantExpr = (arg: Expr) => {
    switch (arg.type) {
        case 'int':
        case 'float':
        case 'string':
        case 'boolean':
        case 'term':
        case 'builtin':
        case 'var':
            return true;
        default:
            return false;
    }
};

export const isConstant = (arg: Term) => {
    switch (arg.type) {
        case 'int':
        case 'float':
        case 'string':
        case 'boolean':
        case 'ref':
        case 'var':
            return true;
        default:
            return false;
    }
};

const isSimpleBuiltin = (name: string) => {
    return binOps.includes(name);
};

export const isSimple = (arg: Term) => {
    if (isConstant(arg)) {
        return true;
    }
    if (
        arg.type === 'apply' &&
        arg.args.every(isSimple) &&
        arg.target.type === 'ref' &&
        arg.target.ref.type === 'builtin' &&
        isSimpleBuiltin(arg.target.ref.name)
    ) {
        return true;
    }
    return false;
};

export const returnStatement = (expr: Expr): Stmt => ({
    type: 'Return',
    value: expr,
    loc: expr.loc,
});

export const withSym = <T>(
    env: Env,
    name: string,
    fn: (sym: Symbol) => T,
): T => {
    const sym = newSym(env, name);
    return fn(sym);
};

export const expressionStatement = (expr: Expr): Stmt => ({
    type: 'Expression',
    expr,
    loc: expr.loc,
});

export const assign = (sym: Symbol, value: Expr): Assign => {
    return {
        type: 'Assign',
        sym,
        value: value,
        is: value.is,
        loc: value.loc,
    };
};

export const var_ = (sym: Symbol, loc: Loc, is: Type): Expr => ({
    type: 'var',
    sym,
    loc,
    is,
});

export const define = (
    sym: Symbol,
    value?: Expr,
    loc?: Loc,
    type?: Type,
    fakeInit?: boolean,
): Define => {
    return {
        type: 'Define',
        sym,
        value: value ? value : null,
        is: value ? value.is : type || void_,
        loc: value ? value.loc : loc || nullLocation,
        fakeInit,
    };
};

export const iffe = (env: Env, st: Block): Expr => {
    return callExpression(
        env,
        arrowFunctionExpression([], st, st.loc),
        [],
        st.loc,
    );
};

export const attribute = (
    env: Env,
    opts: OutputOptions,
    target: Expr,
    ref: Reference,
    refTypeVbls: Array<Type>,
    idx: number,
    loc: Loc,
): Expr => {
    const decl = env.global.types[refName(ref)];
    return {
        type: 'attribute',
        target,
        ref,
        refTypeVbls,
        idx,
        loc,
        is: typeFromTermType(env, opts, decl.items[idx]),
    };
};

export const block = (items: Array<Stmt>, loc: Loc): Block => {
    return {
        type: 'Block',
        items: items,
        loc,
    };
};

export const ifBlock = (x: Block | Expr): Block => {
    if (x.type === 'Block') {
        return x;
    } else {
        return {
            type: 'Block',
            items: [{ type: 'Return', value: x, loc: x.loc }],
            loc: x.loc,
        };
    }
};

export const boolLiteral = (value: boolean, loc: Location): Expr => ({
    type: 'boolean',
    value,
    loc,
    is: bool,
});

export const intLiteral = (value: number, loc: Location): Expr => ({
    type: 'int',
    value,
    loc,
    is: int,
});

export const floatLiteral = (value: number, loc: Location): Expr => ({
    type: 'float',
    value,
    loc,
    is: float,
});

export const ifStatement = (
    cond: Expr,
    yes: Expr | Block,
    no: Expr | Block | null,
    loc: Loc,
): Stmt => {
    return {
        type: 'if',
        cond,
        loc,
        yes: ifBlock(yes),
        no: no ? ifBlock(no) : null,
    };
};

export const asBlock = (item: Block | Expr): Block =>
    item.type === 'Block'
        ? item
        : {
              type: 'Block',
              loc: item.loc,
              items: [{ type: 'Return', value: item, loc: item.loc }],
          };

export const blockStatement = (items: Array<Stmt>, loc: Loc): Block => ({
    type: 'Block',
    items,
    loc,
});

export const builtin = (name: string, loc: Loc, is: Type): Expr => ({
    type: 'builtin',
    name,
    loc,
    is,
});

export const and = (env: Env, left: Expr, right: Expr, loc: Loc) =>
    callExpression(
        env,
        builtin('&&', loc, pureFunction([bool, bool], bool)),
        [left, right],
        loc,
    );

export const or = (env: Env, left: Expr, right: Expr, loc: Loc) =>
    callExpression(
        env,
        builtin('||', loc, pureFunction([bool, bool], bool)),
        [left, right],
        loc,
    );

export const cpsArrowFunctionExpression = (
    env: Env,
    opts: OutputOptions,
    args: Array<Arg>,
    effects: Array<EffectRef>,
    doneType: Type,
    makeBody: (cps: CPS) => Block,
    loc: Loc,
    typeVbls?: Array<TypeVblDecl>,
    tags?: Array<string>,
): LambdaExpr => {
    const done: Symbol = { name: 'done', unique: env.local.unique.current++ };
    const doneArgs = handlerTypesForEffects(env, opts, effects, loc);
    if (!typesEqual(doneType, void_)) {
        doneArgs.push(doneType);
    }
    const doneT: LambdaType = pureFunction(doneArgs, void_, [], loc);
    const { args: hargs, handlers } = handleArgsForEffects(
        env,
        opts,
        effects,
        loc,
    );

    const allArgs = args.concat([
        ...hargs,
        // handlerArg(term.location),
        { sym: done, type: doneT, loc },
    ]);

    const body = makeBody({
        done: {
            type: 'var',
            sym: done,
            loc: loc,
            is: doneT,
        },
        handlers: handlers,
    });

    const res = typeForLambdaExpression(body) || void_;
    return {
        type: 'lambda',
        args: allArgs,
        body,
        res,
        loc,
        is: {
            type: 'cps-lambda',
            loc,
            typeVbls: typeVbls || [],
            args: args.map((arg) => arg.type),
            effectVbls: [],
            effects,
            returnValue: doneType,
        },
        // is: pureFunction(
        //     args.map((arg) => arg.type),
        //     res,
        //     typeVbls,
        // ),
        tags,
    };
};

export const arrowFunctionExpression = (
    args: Array<Arg>,
    body: Expr | Block,
    loc: Loc,
    typeVbls?: Array<TypeVblDecl>,
    tags?: Array<string>,
): LambdaExpr => {
    // const e = new Error();
    // const stack = e.stack!.split('\n').slice(0, 4).join('\n');
    // console.log(e);

    const block = asBlock(body);
    const res = typeForLambdaExpression(block) || void_;
    return {
        type: 'lambda',
        args,
        body: block,
        res,
        loc,
        is: pureFunction(
            args.map((arg) => arg.type),
            res,
            typeVbls,
        ),
        tags,
        // note: stack,
    };
};

const CHECK_CALLS = false;

export const callExpression = (
    env: Env,
    target: Expr,
    args: Array<Expr>,
    loc: Loc,
    typeVbls?: Array<Type>,
): Apply => {
    if (target.is.type === 'cps-lambda') {
        return {
            type: 'apply',
            typeVbls: typeVbls || [],
            is: void_,
            target,
            args,
            loc,
        };
    }

    let tt = expectLambdaType(env, {}, target.is);
    let note = undefined;

    if (typeVbls) {
        try {
            tt = applyTypeVariables(
                env,
                target.is,
                typeVbls,
                undefined,
                loc,
            ) as LambdaType;
        } catch (err) {
            // console.log(target.is);
            // console.log(typeVbls);
            // debugger;
            throw new LocatedError(
                loc,
                `Um Failed to apply type variables.`,
            ).wrap(err);
        }
    }

    if (CHECK_CALLS) {
        if (tt.args.length !== args.length) {
            throw new LocatedError(
                loc,
                `Wrong arg number expected ${tt.args.length}, provided ${
                    args.length
                }\n${showType(env, tt)}`,
            );
        }
        args.forEach((arg, i) => {
            // const err= getTypeError(env, arg.is, tt.args[i], loc)
            if (!typesEqual(arg.is, tt.args[i])) {
                throw new LocatedError(
                    arg.loc,
                    `Type Mismatch in arg ${i}! Found \n${showType(
                        env,
                        arg.is,
                    )}, expected \n${showType(env, tt.args[i])}\n${showType(
                        env,
                        target.is,
                    )}`,
                );
                // note = `Type Mismatch at arg ${i}! Found ${showType(
                //     env,
                //     arg.is,
                // )}, expected ${showType(env, targetType.args[i])}`;
                // throw new TypeMismatch(env, arg.is, targetType.args[i], arg.loc);
            }
        });
    }

    return {
        type: 'apply',
        typeVbls: typeVbls || [],
        note,
        is: tt.res,
        target,
        args,
        loc,
    };
};
export const stringLiteral = (value: string, loc: Loc): Expr => ({
    type: 'string',
    value,
    loc,
    is: string,
});

export const typeToPretty = (env: Env, type: Type): PP => {
    switch (type.type) {
        case 'ref':
            if (type.typeVbls.length) {
                return items([
                    refToPretty(env, type.ref, 'type'),
                    args(
                        type.typeVbls.map((t) => typeToPretty(env, t)),
                        '<',
                        '>',
                    ),
                ]);
            }
            return refToPretty(env, type.ref, 'type');
        case 'Array':
            return items([
                atom('Array'),
                atom('<'),
                typeToPretty(env, type.inner),
                atom('>'),
            ]);
        case 'lambda':
            return items([
                type.note ? atom('[' + type.note + ']') : null,
                type.typeVbls.length
                    ? typeVblDeclsToPretty(env, type.typeVbls)
                    : null,
                args(type.args.map((t) => typeToPretty(env, t))),
                atom(' => '),
                typeToPretty(env, type.res),
            ]);
        case 'cps-lambda':
            return items([
                atom('[cps]'),
                type.note ? atom('[' + type.note + ']') : null,
                type.typeVbls.length
                    ? typeVblDeclsToPretty(env, type.typeVbls)
                    : null,
                args(type.args.map((t) => typeToPretty(env, t))),
                atom(' ='),
                args(
                    type.effects.map((ef) =>
                        ef.type === 'ref'
                            ? refToPretty(env, ef.ref, 'effect')
                            : atom('*effvar*'),
                    ),
                    '{',
                    '}',
                ),
                atom('> '),
                typeToPretty(env, type.returnValue),
            ]);
        case 'var':
            return symToPretty(env, type.sym);
        case 'effect-handler':
            if (type.ref.type === 'builtin') {
                return atom(type.ref.name);
            } else {
                return id('handler', refName(type.ref), 'effect-handler');
                // throw new Error(`effect handler wanted`);
            }
        case 'done-lambda':
            return atom('DONE_LAMBDA');
        case 'effectful-or-direct':
            return atom('EF_OR_DIRECT');
        default:
            let _x: never = type;
            throw new Error(`Unexpected type ${JSON.stringify(type)}`);
    }
};

function typeVblDeclsToPretty(env: Env, typeVbls: TypeVblDecl[]): PP | null {
    return items([
        atom('<'),
        args(typeVbls.map((t) => atom('T_' + t.unique))),
        atom('>'),
    ]);
}
export const showType = (env: Env, t: Type): string =>
    printToString(typeToPretty(env, t), 100);

export const makeTypeVblMapping = (
    declared: Array<TypeVblDecl>,
    vbls: Array<Type>,
) => {
    const mapping: { [unique: number]: Type } = {};
    vbls.forEach((typ, i) => {
        // Umm should I still be doing the subtype checks?
        // const subs = t.typeVbls[i].subTypes;
        // for (let sub of subs) {
        //     if (!hasSubType(env, typ, sub)) {
        //         throw new Error(`Expected a subtype of ${idName(sub)}`);
        //     }
        // }
        mapping[declared[i].unique] = typ;
    });

    return mapping;
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
        if (subs.length) {
            throw new Error(`We don't handle subtypes here yet`);
        }
        // console.log(i, typ, subs);
        // for (let sub of subs) {
        //     if (!hasSubType(env, typ, sub)) {
        //         throw new Error(`Expected a subtype of ${idName(sub)}`);
        //     }
        // }
        mapping[typeVbls[i].unique] = typ;
    });

    return mapping;
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
            `Expected ${type.typeVbls.length}, found ${vbls.length}`,
        );
    }
    const mapping = createTypeVblMapping(env, type.typeVbls, vbls);
    return {
        ...type,
        typeVbls: [],
        // TODO: Also extends!!! I mean I guess we can't supply type variables to extends yet, but soon
        items: type.items.map((t) => subtTypeVars(t, mapping, selfHash)),
    };
};

export const applyTypeVariables = (
    env: Env,
    type: Type,
    vbls: Array<Type>,
    selfHash?: string,
    loc?: Loc,
): Type => {
    if (type.type === 'lambda') {
        const t: LambdaType = type as LambdaType;

        if (vbls.length !== t.typeVbls.length) {
            console.log('the variables', t.typeVbls);
            console.log(showType(env, type));
            throw new LocatedError(
                loc || type.loc,
                `Wrong number of type variables: found ${vbls.length}, expected ${t.typeVbls.length}`,
            );
        }
        const mapping = makeTypeVblMapping(t.typeVbls, vbls);
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

export const walkType = (
    term: Type,
    handle: (term: Type) => Type | null,
): Type | null => {
    const changed = handle(term);
    if (changed) {
        return changed;
    }
    if (term.type === 'Array') {
        const inner = walkType(term.inner, handle);
        if (inner != null) {
            return { ...term, inner };
        }
        return null;
    }
    if (term.type === 'lambda') {
        const newArgs = term.args.slice();
        let changed = false;
        term.args.forEach((arg, i) => {
            const neww = walkType(arg, handle);
            if (neww != null) {
                changed = true;
                newArgs[i] = neww;
            }
        });
        const newres = walkType(term.res, handle);
        if (newres != null) {
            changed = true;
        }
        if (changed) {
            return {
                type: 'lambda',
                typeVbls: term.typeVbls.slice(),
                loc: term.loc,
                args: newArgs,
                res: newres || term.res,
                rest: null, // STOPSHIP handle rest
            };
        }
    }
    return null;
};

export const hasUndefinedReferences = (expr: Expr) => {
    const undefinedLocs: Array<{ sym: Symbol; loc: Location }> = [];
    const defined: { [unique: number]: true } = {};
    const addSym = (sym: Symbol) => {
        defined[sym.unique] = true;
    };
    const getSym = (sym: Symbol, loc: Location) => {
        if (defined[sym.unique] == null) {
            // This is probably an upper-scope variable
            undefinedLocs.push({ sym, loc });
        }
    };
    transformExpr(expr, {
        ...defaultVisitor,
        stmt: (value) => {
            if (value.type === 'Define') {
                addSym(value.sym);
            }
            if (value.type === 'Assign') {
                getSym(value.sym, value.loc);
            }
            return null;
        },
        expr: (value) => {
            switch (value.type) {
                case 'handle':
                    value.cases.map((kase) => ({
                        ...kase,
                        args: kase.args.map((arg) => ({
                            ...arg,
                            sym: addSym(arg.sym),
                        })),
                        k: { ...kase.k, sym: addSym(kase.k.sym) },
                    }));
                    addSym(value.pure.arg);
                    return null;
                case 'lambda':
                    value.args.map((arg) => ({
                        ...arg,
                        sym: addSym(arg.sym),
                    }));
                    return null;
                case 'var':
                    getSym(value.sym, value.loc);
                    return null;
            }
            return null;
        },
    });
    return undefinedLocs;
};
