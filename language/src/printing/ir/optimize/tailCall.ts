import { Env, Id, Symbol, symbolsEqual } from '../../../typing/types';
import {
    defaultVisitor,
    transformBlock,
    transformLambdaBody,
} from '../transform';
import {
    Apply,
    Block,
    Expr,
    isTerm,
    LoopBounds,
    ReturnStmt,
    Stmt,
    Var,
} from '../types';
import { asBlock } from '../utils';
import { Context } from './optimize';

export const hasTailCall = (body: Block, self: Id) => {
    const res = collectTailCalls(body, self);
    return res.calls.length > 0 && !res.hasLoop;
};

export const collectTailCalls = (
    body: Block,
    self: Id,
): { calls: Array<Array<Expr>>; hasLoop: boolean } => {
    let calls: Array<Array<Expr>> = [];
    let hasLoop = false;
    transformLambdaBody(
        body,
        {
            ...defaultVisitor,
            stmt: (stmt) => {
                if (isSelfTail(stmt, self)) {
                    calls.push(((stmt as ReturnStmt).value as Apply).args);
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
    return { calls, hasLoop };
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

const cmps = ['<', '<=', '>', '>='];
const flips: { [key: string]: string } = {
    '<': '>=',
    '<=': '>',
    '>': '<=',
    '>=': '<',
};
const steps = ['+', '-'];

export const findBounds = (
    body: Block,
    argNames: Array<Symbol>,
    id: Id,
):
    | undefined
    | {
          bounds: LoopBounds;
          body: Block;
          after: Block;
          prefix: Array<Stmt>;
      } => {
    // console.log('finding bounds');
    // OH if the first one is "checkExecutionLimit", let it slide.
    let item = body.items[0];
    let expectedSize = 1;
    const prefix: Array<Stmt> = [];
    if (
        item.type === 'Expression' &&
        item.expr.type === 'apply' &&
        item.expr.target.type === 'builtin' &&
        item.expr.target.name === 'checkExecutionLimit'
    ) {
        prefix.push(item);
        item = body.items[1];
        expectedSize = 2;
    }
    if (body.items.length !== expectedSize || item.type !== 'if' || !item.no) {
        // console.log('body not an if', body.items.length, item.type, item);
        return;
    }
    const cond = item.cond;
    if (
        cond.type !== 'apply' ||
        cond.args.length !== 2 ||
        cond.target.type !== 'builtin' ||
        !cmps.includes(cond.target.name)
    ) {
        // console.log('conidtion bad', cond);
        return;
    }

    const yesRes = collectTailCalls(item.yes, id);
    const noRes = collectTailCalls(item.no, id);
    const yes = yesRes.calls.length && !yesRes.hasLoop;
    const no = noRes.calls.length && !noRes.hasLoop;
    // must be either one or the other
    if (yes === no) {
        // console.log('tail call must only be in one');
        return;
    }

    const op = yes ? cond.target.name : flips[cond.target.name];

    const calls = yesRes.calls.concat(noRes.calls);

    // Here are the args that are constant
    const constArgs = argNames
        .filter((sym, i) => {
            return calls.every((args) => {
                const arg = args[i];
                return arg.type === 'var' && symbolsEqual(arg.sym, sym);
            });
        })
        .map((name) => name.unique);

    const nonConst = argNames
        .filter((sym) => !constArgs.includes(sym.unique))
        .map((sym) => sym.unique);

    // One of the sides should be a non-constant argument
    // the other side should either be a constant argument, or a literal

    const left = cond.args[0];
    const right = cond.args[1];

    const leftConst = isConstant(left, constArgs);
    const rightConst = isConstant(right, constArgs);

    // must be either one or the other
    if (leftConst === rightConst) {
        // console.log(`left or right must be constnat`);
        return;
    }

    const leftNonConst =
        left.type === 'var' && nonConst.includes(left.sym.unique);
    const rightNonConst =
        right.type === 'var' && nonConst.includes(right.sym.unique);

    if (leftNonConst === rightNonConst) {
        // console.log(`the other must not be const`);
        return;
    }

    const cmp = leftConst ? left : right;
    const counter = (leftConst ? right : left) as Var;

    let step: null | false | Apply = null;
    const counterIdx = argNames.findIndex(
        (sym) => sym.unique === counter.sym.unique,
    );
    calls.forEach((args) => {
        if (step === false) {
            return;
        }
        const arg = args[counterIdx];
        if (
            arg.type !== 'apply' ||
            arg.target.type !== 'builtin' ||
            arg.args.length !== 2 ||
            !steps.includes(arg.target.name)
        ) {
            step = false;
            return;
        }
        // TODO: Support right-hand-side e.g. `1 + x`
        if (
            arg.args[0].type !== 'var' ||
            arg.args[0].sym.unique !== counter.sym.unique
        ) {
            step = false;
            return;
        }
        if (!isConstant(arg.args[1], constArgs)) {
            step = false;
            return;
        }
        if (step != null && !stepsEqual(step, arg)) {
            step = false;
            return;
        }
        step = arg;
    });

    if (step === false || step === null) {
        // console.log(`no step found`);
        return;
    }

    return {
        bounds: {
            sym: counter.sym,
            end: cmp,
            op: op as any,
            step,
        },
        prefix,
        body: yes ? item.yes : item.no!,
        after: yes ? item.no : item.yes!,
    };
};

const sideEqual = (a: Expr, b: Expr) => {
    if (a.type !== b.type) {
        return false;
    }
    if (a.type === 'int' || a.type === 'float') {
        return a.value === (b as any).value;
    }
    if (a.type === 'var') {
        return a.sym.unique === (b as Var).sym.unique;
    }
    return false;
};

const stepsEqual = (a: Apply, b: Apply) => {
    if (a.args.length !== 2 || b.args.length !== 2) {
        return false;
    }
    if (a.target.type !== 'builtin' || b.target.type !== 'builtin') {
        return false;
    }
    if (a.target.name !== b.target.name) {
        return false;
    }
    return sideEqual(a.args[0], b.args[0]) && sideEqual(a.args[1], b.args[1]);
};

const isConstant = (v: Expr, consts: Array<number>) =>
    isNumericLiteral(v) || (v.type === 'var' && consts.includes(v.sym.unique));

const isNumericLiteral = (v: Expr) => v.type === 'int' || v.type === 'float';

export const tailCallRecursion = (
    env: Env,
    body: Block,
    argNames: Array<Symbol>,
    self: Id,
): Block => {
    if (!hasTailCall(body, self)) {
        return body;
    }
    // TODO: how to infer the bounds of a reduce, when I haven't yet inferred array sizes?
    const bounds = findBounds(body, argNames, self);
    return {
        type: 'Block',
        loc: body.loc,
        items: ([
            ...(bounds ? bounds.prefix : []),
            // This is where we would define any de-slicers
            {
                type: 'Loop',
                loc: body.loc,
                bounds: bounds ? bounds.bounds : undefined,
                body: transformBlock(bounds ? bounds.body : body, {
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
                                    if (
                                        bounds &&
                                        symbolsEqual(
                                            bounds.bounds.sym,
                                            argNames[i],
                                        )
                                    ) {
                                        // Skip this one, we've handled it
                                        return;
                                    }
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
        ] as Array<Stmt>).concat(bounds ? bounds.after.items : []),
    };
};
