import { idFromName, idName, refName } from '../../../typing/env';
import { showLocation } from '../../../typing/typeExpr';
import {
    Env,
    Id,
    idsEqual,
    RecordDef,
    Reference,
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
import { Exprs, isConstant } from './optimize';

// const isInlinable = (t: LambdaExpr, self: Id) => {
//     // TODO: make this much faster folks
//     if (t.body.type === 'Block') {
//         return false;
//     }
//     let found = false;
//     transformExpr(t, {
//         ...defaultVisitor,
//         expr: (expr) => {
//             found = found || (expr.type === 'term' && idsEqual(self, expr.id));
//             return null;
//         },
//     });
//     return !found;
//     // return false;
// };

// const getInlineableFunction = (
//     env: Env,
//     exprs: Exprs,
//     target: Expr,
//     self: Id,
// ): Expr | null => {
//     // lol this would be nice
//     // if (target.type === 'builtin')
//     if (target.type === 'term') {
//         // Self recursion, can't do it folks.
//         if (idsEqual(self, target.id)) {
//             return null;
//         }
//         // console.log('inline', target.id, self);
//         // Hmm this might just be a rename. Can't count on it being an expr
//         const t = exprs[idName(target.id)];
//         if (!t) {
//             return null;
//         }
//         if (t.expr.type !== 'lambda') {
//             if (t.expr.type === 'term' || t.expr.type === 'builtin') {
//                 return t.expr;
//             }
//             return null;
//         }
//         return null;
//         // hmm just reject self-recursive things please I think
//         // if (isInlinable(t, target.id)) {
//         //     return t;
//         // }
//     }
//     // It's might be a constant!
//     if (target.type === 'attribute' && target.target.type === 'term') {
//         const t = exprs[idName(target.target.id)];
//         if (!t || t.expr.type !== 'record' || t.expr.base.type !== 'Concrete') {
//             return null;
//         }
//         if (!refsEqual(target.ref, t.expr.base.ref)) {
//             console.error('attribute not right ref');
//             return null;
//         }
//         // these can't be self-referrential, at least not right now
//         const value = t.expr.base.rows[target.idx];
//         if (!value) {
//             return null;
//         }
//         if (value.type !== 'lambda') {
//             if (value.type === 'term' || value.type === 'builtin') {
//                 return value;
//             }
//             return null;
//         }
//         return null;
//         // if (isInlinable(value as LambdaExpr, self)) {
//         //     return value;
//         // }
//     }
//     return null;
// };

export const maxUnique = (expr: Expr) => {
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

export const toplevelRecordAttribute = (
    id: Id,
    ref: Reference,
    idx: number,
) => {
    return `${idName(id)}_${refName(ref)}_${idx}`;
};

export const inlint = (env: Env, exprs: Exprs, expr: Expr, self: Id): Expr => {
    let outerMax = Math.max(maxUnique(expr), env.local.unique.current);
    // console.log('inlining', self);
    return transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            if (expr.type === 'term') {
                const t = exprs[idName(expr.id)];
                if (t && t.inline) {
                    // console.log(
                    //     'bringing it in',
                    //     expr.id,
                    //     env.global.idNames[idName(expr.id)],
                    // );
                    const innerMax = maxUnique(t.expr);
                    const unique = {
                        current: Math.max(outerMax, innerMax) + 1,
                    };
                    // Redo uniques for the inline that we bring in.
                    const newTerm = reUnique(unique, t.expr);
                    env.local.unique.current = unique.current;
                    outerMax = unique.current;
                    return newTerm;
                }
                return null;
            }

            if (expr.type === 'genTerm') {
                const t = exprs[expr.id];
                if (t && t.inline) {
                    return t.expr;
                }
                // console.log('nope', t);
                return null;
            }

            // Toplevel attribute
            if (
                expr.type === 'attribute' &&
                expr.target.type === 'term' &&
                expr.ref.type === 'user'
            ) {
                const name = toplevelRecordAttribute(
                    expr.target.id,
                    expr.ref,
                    expr.idx,
                );
                if (!exprs[name]) {
                    return null;
                }
                if (exprs[name].inline || isConstant(exprs[name].expr)) {
                    return exprs[name].expr;
                }
                // const t = exprs[idName(expr.ref.id)]
                // if (t.type !== 'record') {
                //     // can't inline, or at least let's not right now
                //     // TODO: Add a optimization option to inline
                //     // all toplevel records, which we need to do
                //     // for GLSL.
                //     // well except for the builtin types .... hrmmm
                //     return null
                // }
                // if (t.base.type === 'Variable') {
                //     return null
                // }
                // if (!idsEqual(t.base.ref.id, expr.ref.id)) {
                //     return null
                // }
                // const value = t.base.rows[expr.idx];
                // return value
                return {
                    type: 'genTerm',
                    loc: expr.loc,
                    is: expr.is,
                    id: name,
                };
            }
            // if (expr.type === 'term') { }
            // if (expr.type === 'apply') {
            //     const lambda = getInlineableFunction(
            //         env,
            //         exprs,
            //         expr.target,
            //         self,
            //     );
            //     // ooh I already have another opt for immediate applys. So I don't have to mess really.
            //     if (lambda) {
            //         const innerMax = maxUnique(lambda);
            //         const unique = {
            //             current: Math.max(outerMax, innerMax) + 1,
            //         };
            //         const t = reUnique(unique, lambda);
            //         env.local.unique.current = unique.current;
            //         outerMax = unique.current;
            //         return { ...expr, target: t };
            //     }
            // }
            return null;
        },
    });
};
