import { newSym } from '../../../typing/env';
import { Symbol } from '../../../typing/types';
import { Expr, Stmt } from '../intermediateRepresentation';
import { defaultVisitor, transformExpr, transformStmt } from '../transform';
import { ArrayExpr, ArrayType, Assign, Loop } from '../types';
import { var_, void_ } from '../utils';
import { Context, Optimizer2 } from './optimize';

export const containsVar = (stmt: Stmt, sym: Symbol) => {
    let found = false;
    transformStmt(stmt, {
        ...defaultVisitor,
        expr: (expr) => {
            if (expr.type === 'var' && expr.sym.unique === sym.unique) {
                found = true;
            }
            return found ? false : null;
        },
    });
    return found;
};

// Assumptions:
// - there's a `x = [...x, y]` inside of a loop.
// - x isn't used anywhere during or after the loop.
export const spreadLoopToAppend: Optimizer2 = (ctx: Context, expr: Expr) => {
    return transformExpr(expr, {
        ...defaultVisitor,
        block: (block) => {
            // hmmmmm
            // I mean, for the moment I can limit myself
            // to assuming only one loop in a block.
            const loop = block.items.find(
                (item) => item.type === 'Loop',
            ) as Loop | null;
            if (!loop) {
                return null;
            }
            const spread = loop.body.items.find(
                (item) =>
                    item.type === 'Assign' &&
                    item.value.type === 'array' &&
                    item.value.items.length > 0 &&
                    item.value.items[0].type === 'Spread' &&
                    item.value.items[0].value.type === 'var' &&
                    item.value.items[0].value.sym.unique === item.sym.unique &&
                    item.value.items.every(
                        (item, i) => i === 0 || item.type !== 'Spread',
                    ),
            ) as Assign;
            if (!spread) {
                return null;
            }
            if (spread.is.type !== 'Array') {
                return null;
            }
            // Don't mess with inferred size things just yet,
            // that's more complicated
            if (spread.is.inferredSize != null) {
                return null;
            }
            const othersClear = loop.body.items.every(
                (item) => item === spread || !containsVar(item, spread.sym),
            );
            if (!othersClear) {
                // ctx.notes = [`sym was used elsewhere in the loop`]
                return null;
            }
            // const block.items.slice(block.items.indexOf(loop) + 1).some(stmt => )
            // TODO replace all references after the block with the new sym name
            const sym = newSym(ctx.env, spread.sym.name);
            const items: Array<Stmt> = [];
            block.items.forEach((item) => {
                if (item === loop) {
                    items.push({
                        type: 'Define',
                        value: {
                            type: 'arrayCopy',
                            value: var_(spread.sym, item.loc, spread.is),
                            is: spread.is as ArrayType,
                            loc: item.loc,
                        },
                        is: spread.value.is,
                        loc: item.loc,
                        sym,
                    });
                    items.push({
                        ...loop,
                        body: {
                            ...loop.body,
                            items: loop.body.items.map(
                                (item): Stmt => {
                                    if (item === spread) {
                                        return {
                                            type: 'Expression',
                                            loc: spread.loc,
                                            expr: {
                                                type: 'arrayAppend',
                                                value: var_(
                                                    sym,
                                                    spread.loc,
                                                    spread.is,
                                                ),
                                                loc: spread.loc,
                                                is: void_,
                                                items: (spread.value as ArrayExpr).items.slice(
                                                    1,
                                                ) as Array<Expr>,
                                            },
                                        };
                                    }
                                    return item;
                                },
                            ),
                        },
                    });
                } else {
                    items.push(item);
                }
            });
            return { ...block, items };
        },
    });
};
