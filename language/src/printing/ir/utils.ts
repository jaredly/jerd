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
    // LambdaType,
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
import { showType } from '../../typing/unify';
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
} from './types';
import { Location } from '../../parsing/parser';

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
export const handlersType = builtinType('handlers');

export const int: Type = builtinType('int');
export const float: Type = builtinType('float');
export const string: Type = builtinType('string');
export const void_: Type = builtinType('void');
export const bool: Type = builtinType('bool');

export const lambdaTypeFromTermType = (type: TermLambdaType): LambdaType => {
    return typeFromTermType(type) as LambdaType;
};

export const typeFromTermType = (type: TermType): Type => {
    switch (type.type) {
        case 'ref':
            return {
                type: 'ref',
                ref: type.ref,
                loc: type.location,
                typeVbls: type.typeVbls.map((t) => typeFromTermType(t)),
                // STOPSHIP: effect vbls here?
            };
        case 'var':
            return {
                type: 'var',
                sym: type.sym,
                loc: type.location,
            };
        case 'lambda':
            return {
                type: 'lambda',
                loc: type.location,
                typeVbls: type.typeVbls,
                args: type.args.map(typeFromTermType),
                rest: type.rest ? typeFromTermType(type.rest) : null,
                res: typeFromTermType(type.res),
            };
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

export const iffe = (st: Block, res: Type): Expr => {
    return callExpression(
        arrowFunctionExpression([], st, res, st.loc),
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

export const builtin = (name: string, loc: Loc): Expr => ({
    type: 'builtin',
    name,
    loc,
});

export const and = (left: Expr, right: Expr, loc: Loc) =>
    callExpression(
        builtin('&&', loc),
        pureFunction([bool, bool], bool),
        bool,
        [left, right],
        loc,
    );

export const or = (left: Expr, right: Expr, loc: Loc) =>
    callExpression(
        builtin('||', loc),
        pureFunction([bool, bool], bool),
        bool,
        [left, right],
        loc,
    );

export const arrowFunctionExpression = (
    args: Array<Arg>,
    body: Expr | Block,
    res: Type,
    loc: Loc,
): LambdaExpr => {
    return {
        type: 'lambda',
        args,
        body,
        res,
        loc,
    };
};

export const callExpression = (
    target: Expr,
    targetType: LambdaType,
    res: Type,
    args: Array<Expr>,
    loc: Loc,
    concreteType?: LambdaType,
): Expr => ({
    type: 'apply',
    targetType,
    concreteType: concreteType || targetType,
    res,
    target,
    args,
    loc,
});
export const stringLiteral = (value: string, loc: Loc): Expr => ({
    type: 'string',
    value,
    loc,
    is: string,
});
