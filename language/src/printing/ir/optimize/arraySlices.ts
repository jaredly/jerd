import { idFromName, idName } from '../../../typing/env';
import { showLocation } from '../../../typing/typeExpr';
import {
    Env,
    Id,
    idsEqual,
    Location,
    RecordDef,
    refsEqual,
    Symbol,
    symbolsEqual,
} from '../../../typing/types';
import { termToGlsl } from '../../glslPrinter';
import { printToString } from '../../printer';
import { reUnique } from '../../typeScriptPrinterSimple';
import { uniquesReallyAreUnique } from '../analyze';
import {
    defaultVisitor,
    transformBlock,
    transformExpr,
    transformLambdaBody,
    transformStmt,
    Visitor,
} from '../transform';
import {
    Expr,
    OutputOptions,
    Record,
    RecordSubType,
    Stmt,
    Tuple,
    Type,
} from '../types';
import {
    block,
    callExpression,
    int,
    pureFunction,
    typeFromTermType,
} from '../utils';
import { and, asBlock, builtin, iffe } from '../utils';
import { explicitSpreads } from './explicitSpreads';
import { flattenIffe } from './flattenIFFE';
import { flattenImmediateCalls } from './flattenImmediateCalls';
import { flattenRecordSpreads } from './flattenRecordSpread';
import { foldConstantAssignments } from './foldConstantAssignments';
import { foldSingleUseAssignments } from './foldSingleUseAssignments';
import { inlint } from './inline';
import { monoconstant } from './monoconstant';
import { monomorphize } from './monomorphize';
import { symName } from './optimize';
import { optimizeTailCalls } from './tailCall';

export const arraySlices = (env: Env, expr: Expr): Expr => {
    const arrayInfos: {
        [key: string]: {
            start: Symbol;
            src: Symbol;
        };
    } = {};
    const resolve = (
        sym: Symbol,
        loc: Location,
    ): { src: Symbol; start: Expr } | null => {
        const n = symName(sym);
        if (!arrayInfos[n]) {
            return null;
        }
        // let {start, src} = arrayInfos[n]
        let start: Expr = {
            type: 'var',
            loc,
            sym: arrayInfos[n].start,
            is: int,
        };
        let src = arrayInfos[n].src;
        const nxt = resolve(arrayInfos[n].src, loc);
        if (nxt != null) {
            src = nxt.src;
            start = callExpression(
                env,
                builtin('+', expr.loc, pureFunction([int, int], int)),
                [start, nxt.start],
                expr.loc,
            );
        }
        return { src, start };
    };

    return transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            switch (expr.type) {
                case 'slice':
                    if (expr.value.type === 'var' && expr.end == null) {
                        const res = resolve(expr.value.sym, expr.loc);
                        if (res == null) {
                            return null;
                        }
                        return {
                            ...expr,
                            value: { ...expr.value, sym: res.src },
                            start: callExpression(
                                env,
                                builtin(
                                    '+',
                                    expr.loc,
                                    pureFunction([int, int], int),
                                ),
                                [expr.start, res.start],
                                expr.loc,
                            ),
                        };
                    }
                    return null;
                case 'arrayIndex':
                    if (expr.value.type === 'var') {
                        const res = resolve(expr.value.sym, expr.loc);
                        if (res == null) {
                            return null;
                        }
                        return {
                            ...expr,
                            value: { ...expr.value, sym: res.src },
                            idx: callExpression(
                                env,
                                builtin(
                                    '+',
                                    expr.loc,
                                    pureFunction([int, int], int),
                                ),
                                [expr.idx, res.start],
                                expr.loc,
                            ),
                        };
                    }
                    return null;
                case 'arrayLen':
                    if (expr.value.type === 'var') {
                        const res = resolve(expr.value.sym, expr.loc);
                        if (res == null) {
                            return null;
                        }
                        return callExpression(
                            env,
                            builtin(
                                '-',
                                expr.loc,
                                pureFunction([int, int], int),
                            ),
                            [
                                {
                                    ...expr,
                                    value: { ...expr.value, sym: res.src },
                                },
                                res.start,
                            ],
                            expr.loc,
                        );
                    }
                    return null;
            }
            return null;
        },
        stmt: (stmt) => {
            // TODO assign as well
            if (
                stmt.type === 'Define' &&
                stmt.value != null &&
                stmt.value.type === 'slice' &&
                stmt.value.end == null &&
                stmt.value.value.type === 'var'
            ) {
                const sym = {
                    name: stmt.sym.name + '_i',
                    unique: env.local.unique.current++,
                };
                arrayInfos[symName(stmt.sym)] = {
                    start: sym,
                    src: stmt.value.value.sym,
                };
                return [
                    stmt,
                    {
                        type: 'Define',
                        is: int,
                        loc: stmt.loc,
                        sym,
                        value: stmt.value.start,
                    },
                ];
            }
            return null;
        },
    });
};
