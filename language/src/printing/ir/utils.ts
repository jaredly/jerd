// General thing

import { Term, Type } from '../../typing/types';
import { binOps, bool, pureFunction } from '../../typing/preset';

import {
    Loc,
    Expr,
    Block,
    Stmt,
    Arg,
    LambdaExpr,
    callExpression,
} from './types';

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
        arrowFunctionExpression([], st, res, st.loc, pureFunction([], res)),
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

export const and = (left: Expr, right: Expr, loc: Loc) =>
    callExpression(
        builtin('&&', loc, pureFunction([bool, bool], bool)),
        pureFunction([bool, bool], bool),
        bool,
        [left, right],
        loc,
    );

export const or = (left: Expr, right: Expr, loc: Loc) =>
    callExpression(
        builtin('||', loc, pureFunction([bool, bool], bool)),
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
    is: Type,
    note?: string,
): LambdaExpr => {
    return {
        type: 'lambda',
        args,
        body,
        res,
        loc,
        is,
        note,
    };
};
