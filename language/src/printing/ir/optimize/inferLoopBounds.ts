import { newSym } from '../../../typing/env';
import { Symbol } from '../../../typing/types';
import { debugExpr, debugStmt } from '../../irDebugPrinter';
import { printToString } from '../../printer';
import { Expr, Stmt } from '../intermediateRepresentation';
import { defaultVisitor, transformExpr, transformStmt } from '../transform';
import { Apply, Assign, IfStmt, LoopBounds } from '../types';
import { builtin, callExpression, int, intLiteral, var_ } from '../utils';
import { plus } from './arraySlices';
import { Context, Optimizer2 } from './optimize';

// export const inferLoopBounds: Optimizer2 = (ctx: Context, expr: Expr) => {
//     return transformExpr(expr, {
//         ...defaultVisitor,
//         stmt: (stmt) => {
//             if (stmt.type === 'Loop' && stmt.bounds == null) {
//                 return {
//                     ...stmt,
//                     bounds: {
//                         end: intLiteral(10, stmt.loc),
//                         op: '<',
//                         step: plus(
//                             ctx.env,
//                             intLiteral(10, stmt.loc),
//                             intLiteral(3, stmt.loc),
//                             stmt.loc,
//                         ),
//                         sym: newSym(ctx.env, 'YES'),
//                     },
//                 };
//             }
//             return null;
//         },
//     });
// };

export const inferLoopBounds: Optimizer2 = (ctx: Context, expr: Expr) => {
    // Ok, so I find a loop that's unbounded
    // and by the way I'm collecting constants
    const constants: { [unique: number]: number } = {};
    // console.log('check loop');
    return transformExpr(expr, {
        ...defaultVisitor,
        stmt: (stmt) => {
            if (
                stmt.type === 'Define' &&
                stmt.value &&
                stmt.value.type === 'int'
            ) {
                constants[stmt.sym.unique] = stmt.value.value;
            }
            if (stmt.type == 'Loop' && stmt.bounds == null) {
                console.log('um');
                // Ok, so we look for: What is the break condition?
                const breaks = stmt.body.items.filter(
                    (item) =>
                        item.type === 'if' &&
                        !item.no &&
                        item.yes.items.find((s) => s.type === 'Break'),
                );
                const goes = stmt.body.items.filter(
                    (item) =>
                        item.type === 'if' &&
                        !item.no &&
                        item.yes.items.find((s) => s.type === 'Continue'),
                );
                const others = stmt.body.items.filter(
                    (k) =>
                        !breaks.includes(k) &&
                        !goes.includes(k) &&
                        k.type !== 'MatchFail',
                );

                if (others.length) {
                    const showStmt = (stmt: Stmt) =>
                        printToString(debugStmt(ctx.env, stmt), 100);
                    console.log('OTHERS', breaks.map(showStmt).join('\n'));
                    console.log(goes.map(showStmt).join('\n'));
                    console.log(others.map(showStmt).join('\n'));
                    return null;
                }
                if (
                    breaks.length !== 1 ||
                    goes.length !== 1 ||
                    breaks[0] === goes[0]
                ) {
                    console.log('WRONG', breaks, goes, others);
                    return null;
                }
                // Ok so we have one arm each, it's good
                const bif = breaks[0] as IfStmt;
                const vars: Array<Symbol> = [];
                transformExpr(bif.cond, {
                    ...defaultVisitor,
                    expr: (expr) => {
                        if (expr.type === 'var') {
                            vars.push(expr.sym);
                        }
                        return null;
                    },
                });
                if (vars.length !== 1) {
                    console.log('NO VARS', vars);
                    console.log(
                        printToString(debugExpr(ctx.env, bif.cond), 100),
                    );
                    return null;
                }
                const cond = vars[0];
                if (constants[cond.unique] == null) {
                    console.log('cond not const');
                    return null;
                }
                const gif = goes[0] as IfStmt;
                // if (1 == 1) {
                //     return [
                //         {
                //             ...stmt,
                //             // type: 'Loop',
                //             // bounds: {},
                //             body: {
                //                 ...stmt.body,
                //                 items: [gif.yes],
                //             },
                //         },
                //         bif.yes,
                //     ];
                // }

                const isIncOrDec = (value: Expr, sym: Symbol) => {
                    return (
                        value.type === 'apply' &&
                        value.target.type === 'builtin' &&
                        ['-', '+'].includes(value.target.name) &&
                        value.args.length === 2 &&
                        ((value.args[0].type === 'var' &&
                            value.args[0].sym.unique === sym.unique &&
                            value.args[1].type === 'int') ||
                            (value.args[1].type === 'var' &&
                                value.args[1].sym.unique === sym.unique &&
                                value.target.name === '+' &&
                                value.args[0].type === 'int'))
                    );
                };
                const updates: Array<Assign> = gif.yes.items.filter(
                    (s) =>
                        s.type === 'Assign' &&
                        s.sym.unique === cond.unique &&
                        isIncOrDec(s.value, cond),
                ) as Array<Assign>;
                if (updates.length !== 1) {
                    console.log('NO UPDA');
                    return null;
                }
                // Ok, at this point we have
                // - a break branch
                // - a yes branch
                // - a variable that is updated
                // ASSUMPTION: the loop variable isn't referenced after being updated.
                // How to check this?
                // ok good
                let found = false;
                let updatedAfterIncremented = false;
                gif.yes.items.forEach((st) => {
                    if (st === updates[0]) {
                        found = true;
                        return;
                    }
                    if (found) {
                        transformStmt(st, {
                            ...defaultVisitor,
                            expr: (expr) => {
                                if (
                                    expr.type === 'var' &&
                                    expr.sym.unique === cond.unique
                                ) {
                                    updatedAfterIncremented = true;
                                }
                                return null;
                            },
                        });
                    }
                });
                if (updatedAfterIncremented) {
                    console.log('updated after folks');
                    return null;
                }
                console.log('UES');

                const bounds = condToBound(
                    constants[cond.unique],
                    bif.cond as Apply,
                    cond,
                    updates[0].value as Apply,
                );

                // // And what we do is:
                // // - remove the increment
                // // - set the bound
                // // - maybe remove the break? or maybe just put the break stuffs after...
                return [
                    {
                        ...stmt,
                        // type: 'Loop',
                        bounds,

                        // {
                        //     sym: cond,
                        //     end: intLiteral(10, stmt.loc),
                        //     op: '<',
                        //     step: updates[0].value,
                        // },
                        body: {
                            ...stmt.body,
                            items: [gif.yes],
                        },
                    },
                    {
                        ...bif.yes,
                        items: bif.yes.items.filter((s) => s.type !== 'Break'),
                    },
                ];
                // return gif;
            }
            return null;
        },
    });
};

// START HERE PLEASE:
// - do the mathematical whatsit to isolate the var on one side.
const juggle = (
    args: [Expr, Expr],
    name: string,
    sym: Symbol,
    increasing: boolean,
): null | { expr: Expr; op: any } => {
    // um
    // x + 10 == 0
    if (args[1].type === 'int') {
    }
    return null;
};

const condToBound = (
    initial: number,
    cond: Apply,
    sym: Symbol,
    step: Apply,
): undefined | LoopBounds => {
    if (
        cond.type !== 'apply' ||
        cond.target.type !== 'builtin' ||
        !['<', '>', '<=', '>=', '=='].includes(cond.target.name)
    ) {
        return;
    }

    const res = juggle(
        cond.args as [Expr, Expr],
        cond.target.name,
        sym,
        isIncreasing(step),
    );
    if (!res) {
        return;
    }

    return {
        end: res.expr,
        op: res.op,
        step,
        sym,
    };
};

const isIncreasing = (step: Apply) => {
    if (step.target.type !== 'builtin') {
        return false;
    }
    if (step.target.name === '-') {
        return false;
    }
    if (step.args[0].type === 'int') {
        return step.args[0].value > 0;
    }
    if (step.args[1].type === 'int') {
        return step.args[1].value > 0;
    }
    return false;
};
