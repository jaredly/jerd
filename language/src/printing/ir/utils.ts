// General thing

import {
    Term,
    Env,
    Type as TermType,
    getEffects,
    Symbol,
    Reference,
    Let,
    Var,
    EffectRef,
    Lambda,
    LambdaType as TLambdaType,
    walkTerm,
    Pattern,
    UserReference,
    TypeVblDecl,
    LambdaType as TermLambdaType,
    EffectReference,
} from '../../typing/types';
import {
    binOps,
    // bool,
    // builtinType,
    // int,
    // pureFunction,
    // string,
    // void_,
} from '../../typing/preset';
import {
    applyEffectVariables,
    getEnumReferences,
    showLocation,
} from '../../typing/typeExpr';
import { idName, newSym, refName } from '../../typing/env';

import {
    Loc,
    Expr,
    Block,
    Stmt,
    Arg,
    LambdaExpr,
    Literal,
    Type,
    OutputOptions,
    LambdaType,
    returnTypeForStmt,
    typeForLambdaExpression,
    typesEqual,
    MaybeEffLambda,
    Define,
    Assign,
    EffectHandler,
} from './types';
import { Location, nullLocation } from '../../parsing/parser';
import { LocatedError, TypeMismatch } from '../../typing/errors';
import { args, atom, id, items, PP, printToString } from '../printer';
import { refToPretty, symToPretty } from '../printTsLike';
import { handlerTypesForEffects } from './cps';
import { isVoid } from '../../typing/terms/handle';
// import { getTypeError } from '../../typing/getTypeError';

const cmp = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

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
    loc: Location | null = null,
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
    loc: Location | null = null,
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

export const handlerSym = { name: 'handlers', unique: 0 };
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
): LambdaType | MaybeEffLambda => {
    return typeFromTermType(env, opts, type) as LambdaType | MaybeEffLambda;
};

export const _lambdaTypeFromTermType = (
    env: Env,
    opts: OutputOptions,
    type: TermLambdaType,
): LambdaType => {
    const mapType = (t: TermType) => typeFromTermType(env, opts, t);
    if (type.effects.length) {
        const doneArgs = handlerTypesForEffects(
            env,
            opts,
            type.effects,
            type.location,
        );
        if (!isVoid(type.res)) {
            doneArgs.push(mapType(type.res));
        }
        return {
            type: 'lambda',
            loc: type.location,
            typeVbls: type.typeVbls,
            note: 'from with effects',
            args: type.args
                .map(mapType)
                .concat([
                    ...handlerTypesForEffects(
                        env,
                        opts,
                        type.effects,
                        type.location,
                    ),
                    pureFunction(doneArgs, void_),
                ]),
            rest: type.rest ? mapType(type.rest) : null,
            res: void_,
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

export const typeFromTermType = (
    env: Env,
    opts: OutputOptions,
    type: TermType,
): Type => {
    switch (type.type) {
        case 'ref':
            return {
                type: 'ref',
                ref: type.ref,
                loc: type.location,
                typeVbls: type.typeVbls.map((t) =>
                    typeFromTermType(env, opts, t),
                ),
            };
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
                        effectful: _lambdaTypeFromTermType(env, opts, type),
                        direct: _lambdaTypeFromTermType(
                            env,
                            opts,
                            directVersion as TLambdaType,
                        ),
                    };
                }
            }
            return _lambdaTypeFromTermType(env, opts, type);
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

export const arrowFunctionExpression = (
    args: Array<Arg>,
    body: Expr | Block,
    loc: Loc,
    typeVbls?: Array<TypeVblDecl>,
    tags?: Array<string>,
): LambdaExpr => {
    const res = typeForLambdaExpression(body) || void_;
    return {
        type: 'lambda',
        args,
        body,
        res,
        loc,
        is: pureFunction(
            args.map((arg) => arg.type),
            res,
            typeVbls,
        ),
        tags,
    };
};

const CHECK_CALLS = false;

export const callExpression = (
    env: Env,
    target: Expr,
    args: Array<Expr>,
    loc: Loc,
    typeVbls?: Array<Type>,
): Expr => {
    let tt = target.is as LambdaType;
    let note = undefined;
    if (CHECK_CALLS) {
        if (tt.args.length !== args.length) {
            throw new LocatedError(
                loc,
                `Wrong arg number expected ${tt.args.length}, provided ${
                    args.length
                }\n${showType(env, tt)}`,
            );
        }
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
                throw new LocatedError(
                    loc,
                    `Um Failed to apply type variables.`,
                ).wrap(err);
            }
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
        case 'var':
            return symToPretty(type.sym);
        case 'effect-handler':
            if (type.ref.type === 'builtin') {
                return atom(type.ref.name);
            } else {
                return id('handler', refName(type.ref), 'effect-handler');
                // throw new Error(`effect handler wanted`);
            }
        default:
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

export const applyTypeVariables = (
    env: Env,
    type: Type,
    vbls: Array<Type>,
    selfHash?: string,
    loc?: Loc,
): Type => {
    if (type.type === 'lambda') {
        const t: LambdaType = type as LambdaType;

        const mapping: { [unique: number]: Type } = {};
        if (vbls.length !== t.typeVbls.length) {
            console.log('the variables', t.typeVbls);
            console.log(showType(env, type));
            throw new LocatedError(
                loc || type.loc,
                `Wrong number of type variables: found ${vbls.length}, expected ${t.typeVbls.length}`,
            );
        }
        vbls.forEach((typ, i) => {
            // Umm should I still be doing the subtype checks?
            // const subs = t.typeVbls[i].subTypes;
            // for (let sub of subs) {
            //     if (!hasSubType(env, typ, sub)) {
            //         throw new Error(`Expected a subtype of ${idName(sub)}`);
            //     }
            // }
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
