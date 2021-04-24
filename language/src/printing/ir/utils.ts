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
import { idName } from '../../typing/env';

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
} from './types';
import { Location } from '../../parsing/parser';
import { LocatedError, TypeMismatch } from '../../typing/errors';
import { args, atom, items, PP, printToString } from '../printer';
import { refToPretty, symToPretty } from '../printTsLike';

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
export const handlersType = builtinType('Handlers');

export const int: Type = builtinType('int');
export const float: Type = builtinType('float');
export const string: Type = builtinType('string');
export const void_: Type = builtinType('void');
export const bool: Type = builtinType('bool');

export const lambdaTypeFromTermType = (type: TermLambdaType): LambdaType => {
    return typeFromTermType(type) as LambdaType;
};

export const _lambdaTypeFromTermType = (type: TermLambdaType): LambdaType => {
    if (type.effects.length) {
        return {
            type: 'lambda',
            loc: type.location,
            typeVbls: type.typeVbls,
            note: 'from with effects',
            args: type.args
                .map(typeFromTermType)
                .concat([
                    handlersType,
                    pureFunction(
                        [handlersType, typeFromTermType(type.res)],
                        void_,
                    ),
                ]),
            rest: type.rest ? typeFromTermType(type.rest) : null,
            res: void_,
        };
    }
    return {
        type: 'lambda',
        loc: type.location,
        typeVbls: type.typeVbls,
        args: type.args.map(typeFromTermType),
        rest: type.rest ? typeFromTermType(type.rest) : null,
        res: typeFromTermType(type.res),
    };
};

export const typeFromTermType = (type: TermType): Type => {
    switch (type.type) {
        case 'ref':
            return {
                type: 'ref',
                ref: type.ref,
                loc: type.location,
                typeVbls: type.typeVbls.map((t) => typeFromTermType(t)),
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
                        effectful: _lambdaTypeFromTermType(type),
                        direct: _lambdaTypeFromTermType(
                            directVersion as TLambdaType,
                        ),
                    };
                }
            }
            return _lambdaTypeFromTermType(type);
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

export const iffe = (env: Env, st: Block, res: Type): Expr => {
    // TODO
    // const res = typeForLambdaExpression(body) || void_;
    return callExpression(
        env,
        arrowFunctionExpression([], st, st.loc),
        pureFunction([], res),
        res,
        [],
        st.loc,
    );
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
        pureFunction([bool, bool], bool),
        bool,
        [left, right],
        loc,
    );

export const or = (env: Env, left: Expr, right: Expr, loc: Loc) =>
    callExpression(
        env,
        builtin('||', loc, pureFunction([bool, bool], bool)),
        pureFunction([bool, bool], bool),
        bool,
        [left, right],
        loc,
    );

export const arrowFunctionExpression = (
    args: Array<Arg>,
    body: Expr | Block,
    loc: Loc,
    typeVbls?: Array<TypeVblDecl>,
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
    };
};

export const callExpression = (
    env: Env,
    target: Expr,
    targetType: LambdaType,
    is: Type,
    args: Array<Expr>,
    loc: Loc,
    concreteType?: LambdaType,
): Expr => {
    if (targetType.args.length !== args.length) {
        throw new Error(
            `Wrong arg number, expected ${targetType.args.length}, found ${args.length}`,
        );
    }
    // const tt = target.is as LambdaType;
    // if (tt.args.length !== args.length) {
    //     throw new Error(
    //         `Wrong arg number expected ${tt.args.length}, provided ${args.length}`,
    //     );
    // }
    let note = undefined;
    args.forEach((arg, i) => {
        if (!typesEqual(arg.is, targetType.args[i])) {
            throw new LocatedError(
                arg.loc,
                `Type Mismatch! Found \n${showType(
                    env,
                    arg.is,
                )}, expected \n${showType(env, targetType.args[i])}`,
            );
            // note = `Type Mismatch at arg ${i}! Found ${showType(
            //     env,
            //     arg.is,
            // )}, expected ${showType(env, targetType.args[i])}`;
            // throw new TypeMismatch(env, arg.is, targetType.args[i], arg.loc);
        }
    });
    // if (!typesEqual(is, targetType.res)) {
    //     throw new Error(`return types disagree`);
    // }
    return {
        type: 'apply',
        targetType,
        concreteType: concreteType || targetType,
        note,
        is: targetType.res,
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
        default:
            throw new Error(`Unexpected type ${JSON.stringify(type)}`);
    }
};

function typeVblDeclsToPretty(env: Env, typeVbls: TypeVblDecl[]): PP | null {
    throw new Error('Function not implemented.');
}
export const showType = (env: Env, t: Type): string =>
    printToString(typeToPretty(env, t), 100);
