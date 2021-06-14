import { idFromName, idName } from '../../../typing/env';
import { Env, RecordDef, Symbol } from '../../../typing/types';
import {
    defaultVisitor,
    transformExpr,
    transformStmt,
    Visitor,
} from '../transform';
import { Expr, OutputOptions, Stmt, Record, RecordSubType } from '../types';
import { block, iffe, typeFromTermType } from '../utils';
import { isConstant, transformRepeatedly } from './optimize';

export const flattenRecordSpread = (
    env: Env,
    opts: OutputOptions,
    expr: Record,
): Expr => {
    // console.log('flatten');
    const inits: Array<Stmt> = [];

    const subTypes: { [key: string]: RecordSubType } = { ...expr.subTypes };

    if (expr.base.type === 'Concrete') {
        const b = expr.base;
        if (expr.base.spread) {
            let target: Expr;
            if (isConstant(expr.base.spread)) {
                target = expr.base.spread;
            } else {
                const v: Symbol = {
                    name: 'arg_spread',
                    unique: env.local.unique.current++,
                };
                inits.push({
                    type: 'Define',
                    sym: v,
                    value: expr.base.spread,
                    loc: expr.loc,
                    is: expr.is,
                });
                target = { type: 'var', sym: v, loc: expr.loc, is: expr.is };
            }
            const d = env.global.types[idName(expr.base.ref.id)] as RecordDef;
            const rows: Array<Expr> = expr.base.rows.map((row, i) => {
                if (row == null) {
                    return {
                        type: 'attribute',
                        target,
                        ref: b.ref,
                        idx: i,
                        loc: expr.loc,
                        is: typeFromTermType(env, opts, d.items[i]),
                    };
                } else {
                    return row;
                }
            });
            expr = { ...expr, base: { ...expr.base, spread: null, rows } };

            Object.keys(expr.subTypes).forEach((k) => {
                const subType = expr.subTypes[k];
                const d = env.global.types[k] as RecordDef;
                const rows: Array<Expr> = subType.rows.map((row, i) => {
                    if (row == null) {
                        return {
                            type: 'attribute',
                            // TODO: check if this is complex,
                            // and if so, make a variable
                            target,
                            ref: { type: 'user', id: idFromName(k) },
                            idx: i,
                            loc: expr.loc,
                            is: typeFromTermType(env, opts, d.items[i]),
                        };
                    } else {
                        return row;
                    }
                });
                subTypes[k] = { ...subType, rows };
            });
        } else if (expr.base.rows.some((r) => r == null)) {
            throw new Error(`No spread, but some null`);
        }
    } else {
        throw new Error('variable sorry');
    }

    Object.keys(expr.subTypes).forEach((k) => {
        const subType = expr.subTypes[k];
        if (subType.spread) {
            let target: Expr;
            if (isConstant(subType.spread)) {
                target = subType.spread;
            } else {
                const v: Symbol = {
                    name: 'st' + k,
                    unique: env.local.unique.current++,
                };
                inits.push({
                    type: 'Define',
                    sym: v,
                    value: subType.spread,
                    loc: subType.spread.loc,
                    is: {
                        type: 'ref',
                        ref: { type: 'user', id: idFromName(k) },
                        loc: subType.spread.loc,
                        typeVbls: [],
                    },
                });
                target = { type: 'var', sym: v, loc: expr.loc, is: expr.is };
            }
            const d = env.global.types[k] as RecordDef;
            const rows: Array<Expr> = subType.rows.map((row, i) => {
                if (row == null) {
                    return {
                        type: 'attribute',
                        // TODO: check if this is complex,
                        // and if so, make a variable
                        target,
                        ref: { type: 'user', id: idFromName(k) },
                        idx: i,
                        loc: expr.loc,
                        is: typeFromTermType(env, opts, d.items[i]),
                    };
                } else {
                    return row;
                }
            });
            subTypes[k] = { ...subTypes[k], spread: null, rows };
        } else {
            subTypes[k] = subTypes[k];
        }
    });
    expr = { ...expr, subTypes };

    if (hasSpreads(expr)) {
        throw new Error('not gone');
    }

    if (inits.length) {
        return iffe(env, {
            type: 'Block',
            items: inits.concat({
                type: 'Return',
                loc: expr.loc,
                value: expr,
            }),
            loc: expr.loc,
        });
    } else {
        return expr;
    }
};

const hasSpreads = (expr: Record) =>
    (expr.base.type === 'Concrete' && expr.base.spread != null) ||
    Object.keys(expr.subTypes).some((k) => expr.subTypes[k].spread != null);

export const flattenRecordSpreads = (
    env: Env,
    opts: OutputOptions,
    expr: Expr,
): Expr => {
    return transformRepeatedly(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            if (expr.type !== 'record') {
                return null;
            }
            // nothing to flatten
            if (!hasSpreads(expr)) {
                return null;
            }
            return flattenRecordSpread(env, opts, expr);
        },
    });
};
