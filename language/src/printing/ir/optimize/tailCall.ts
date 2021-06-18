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
import { termToGlsl } from '../../glslPrinter';
import { printToString } from '../../printer';
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
import { flattenImmediateCalls } from './flattenImmediateCalls';
import { inlint } from './inline';
import { monoconstant } from './monoconstant';
import { monomorphize } from './monomorphize';
import { Context } from './optimize';

export const hasTailCall = (body: Block, self: Id): boolean => {
    let found = false;
    let hasLoop = false;
    transformLambdaBody(
        body,
        {
            ...defaultVisitor,
            stmt: (stmt) => {
                if (isSelfTail(stmt, self)) {
                    found = true;
                } else if (stmt.type === 'Loop') {
                    hasLoop = true;
                }
                return null;
            },
            expr: (expr) => {
                if (expr.type === 'lambda') {
                    // don't recurse into lambdas
                    return false;
                }
                // no changes, but do recurse
                return null;
            },
        },
        0,
    );
    return found && !hasLoop;
};

const isSelfTail = (stmt: Stmt, self: Id) =>
    stmt.type === 'Return' &&
    stmt.value.type === 'apply' &&
    isTerm(stmt.value.target, self);

export const optimizeTailCalls = (ctx: Context, expr: Expr) => {
    if (expr.type === 'lambda') {
        const body = tailCallRecursion(
            ctx.env,
            expr.body,
            expr.args.map((a) => a.sym),
            ctx.id,
        );
        return body !== expr.body ? { ...expr, body } : expr;
    }
    return expr;
};

export const tailCallRecursion = (
    env: Env,
    body: Block,
    argNames: Array<Symbol>,
    self: Id,
): Block => {
    if (!hasTailCall(body, self)) {
        return body;
    }
    return {
        type: 'Block',
        loc: body.loc,
        items: [
            // This is where we would define any de-slicers
            {
                type: 'Loop',
                loc: body.loc,
                body: transformBlock(asBlock(body), {
                    ...defaultVisitor,
                    block: (block) => {
                        if (!block.items.some((s) => isSelfTail(s, self))) {
                            return null;
                        }

                        const items: Array<Stmt> = [];
                        block.items.forEach((stmt) => {
                            if (isSelfTail(stmt, self)) {
                                const apply = (stmt as ReturnStmt)
                                    .value as Apply;
                                const vbls = apply.args.map((arg, i) => {
                                    const sym: Symbol = {
                                        name: 'recur',
                                        unique: env.local.unique.current++,
                                    };
                                    // TODO: we need the type of all the things I guess...
                                    items.push({
                                        type: 'Define',
                                        sym,
                                        loc: arg.loc,
                                        value: arg,
                                        is: arg.is,
                                    });
                                    return sym;
                                });
                                vbls.forEach((sym, i) => {
                                    items.push({
                                        type: 'Assign',
                                        sym: argNames[i],
                                        loc: apply.args[i].loc,
                                        is: apply.args[i].is,
                                        value: {
                                            type: 'var',
                                            sym,
                                            loc: apply.args[i].loc,
                                            is: apply.args[i].is,
                                        },
                                    });
                                });
                                items.push({ type: 'Continue', loc: stmt.loc });
                            } else {
                                items.push(stmt);
                            }
                        });
                        return { ...block, items };
                    },
                }),
            },
        ],
    };
};
