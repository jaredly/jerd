import { idFromName, idName } from '../../../typing/env';
import {
    Env,
    Id,
    idsEqual,
    RecordDef,
    refsEqual,
    Symbol,
    symbolsEqual,
} from '../../../typing/types';
import { reUnique } from '../../typeScriptPrinterSimple';
import {
    defaultVisitor,
    transformBlock,
    transformExpr,
    transformLambdaBody,
    transformStmt,
    Visitor,
} from '../transform';
import {
    Apply,
    Block,
    Define,
    Expr,
    isTerm,
    LambdaExpr,
    OutputOptions,
    Record,
    RecordSubType,
    ReturnStmt,
    Stmt,
    Tuple,
    Type,
} from '../types';
import {
    callExpression,
    define,
    handlerSym,
    int,
    pureFunction,
    typeFromTermType,
} from '../utils';
import { and, asBlock, builtin, iffe } from '../utils';
import { Exprs } from './optimize';

const isInlinable = (t: LambdaExpr, self: Id) => {
    // TODO: make this much faster folks
    if (t.body.type === 'Block') {
        return false;
    }
    let found = false;
    transformExpr(t, {
        ...defaultVisitor,
        expr: (expr) => {
            found = found || (expr.type === 'term' && idsEqual(self, expr.id));
            return null;
        },
    });
    return !found;
    // return false;
};

const getInlineableFunction = (
    env: Env,
    exprs: Exprs,
    target: Expr,
    self: Id,
): Expr | null => {
    // lol this would be nice
    // if (target.type === 'builtin')
    if (target.type === 'term') {
        // Self recursion, can't do it folks.
        if (idsEqual(self, target.id)) {
            return null;
        }
        // console.log('inline', target.id, self);
        // Hmm this might just be a rename. Can't count on it being an expr
        const t = exprs[idName(target.id)];
        if (!t || t.type !== 'lambda') {
            return null;
        }
        // hmm just reject self-recursive things please I think
        if (isInlinable(t, target.id)) {
            return t;
        }
    }
    // It's might be a constant!
    if (target.type === 'attribute' && target.target.type === 'term') {
        const t = exprs[idName(target.target.id)];
        if (!t || t.type !== 'record' || t.base.type !== 'Concrete') {
            return null;
        }
        if (!refsEqual(target.ref, t.base.ref)) {
            console.error('attribute not right ref');
            return null;
        }
        // these can't be self-referrential, at least not right now
        const value = t.base.rows[target.idx];
        if (!value || value.type !== 'lambda') {
            return null;
        }
        if (isInlinable(value as LambdaExpr, self)) {
            return value;
        }
        // target.ref;
    }
    return null;
};

const maxUnique = (expr: Expr) => {
    let max = 0;
    transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            if (expr.type === 'var') {
                max = Math.max(max, expr.sym.unique);
            }
            return null;
        },
    });
    return max;
};

export const inlint = (env: Env, exprs: Exprs, expr: Expr, self: Id): Expr => {
    let outerMax = maxUnique(expr);
    return transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            if (expr.type === 'apply') {
                const lambda = getInlineableFunction(
                    env,
                    exprs,
                    expr.target,
                    self,
                );
                // ooh I already have another opt for immediate applys. So I don't have to mess really.
                if (lambda) {
                    const innerMax = maxUnique(lambda);
                    const unique = {
                        current: Math.max(outerMax, innerMax) + 1,
                    };
                    const t = reUnique(unique, lambda);
                    env.local.unique.current = unique.current;
                    outerMax = unique.current;
                    return { ...expr, target: t };
                }
            }
            return null;
        },
    });
};
