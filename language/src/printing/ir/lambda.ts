// The bulk of stuff happens here

import {
    Term,
    Env,
    Symbol,
    EffectRef,
    Lambda,
    LambdaType as ILambdaType,
    walkTerm,
    Sequence,
} from '../../typing/types';
import {
    builtinType,
    lambdaTypeFromTermType,
    pureFunction,
    void_,
} from './utils';
import { applyEffectVariables } from '../../typing/typeExpr';

import {
    Expr,
    Block,
    Stmt,
    LambdaExpr,
    OutputOptions,
    LambdaType,
} from './types';
import {
    callExpression,
    typeFromTermType,
    handlersType,
    handlerSym,
} from './utils';

import { termToAstCPS } from './cps';
import { arrowFunctionExpression, builtin } from './utils';
import { printTerm } from './term';
import { withNoEffects } from '../../typing/transform';

export const printLambda = (
    env: Env,
    opts: OutputOptions,
    term: Lambda,
): Expr => {
    if (term.is.effects.length > 0) {
        if (term.is.effects.every((x) => x.type === 'var')) {
            const directVersion = withNoEffects(env, term);
            return {
                type: 'effectfulOrDirectLambda',
                loc: term.location,
                effectful: effectfulLambda(env, opts, term),
                direct: arrowFunctionExpression(
                    directVersion.args.map(
                        (sym, i) => ({
                            sym,
                            type: typeFromTermType(directVersion.is.args[i]),
                            loc: null,
                        }), // TODO(sourcemap): hang on to location for lambda args?
                    ),
                    withExecutionLimit(
                        env,
                        opts,
                        printLambdaBody(env, opts, directVersion.body, null),
                    ),
                    typeFromTermType(directVersion.is.res),
                    term.location,
                ),
                is: {
                    type: 'effectful-or-direct',
                    loc: term.location,
                    effectful: lambdaTypeFromTermType(term.is as ILambdaType),
                    direct: lambdaTypeFromTermType(
                        directVersion.is as ILambdaType,
                    ),
                },
            };
        }
        return effectfulLambda(env, opts, term);
    } else {
        return arrowFunctionExpression(
            term.args.map((sym, i) => ({
                sym,
                type: typeFromTermType(term.is.args[i]),
                loc: null,
            })),
            withExecutionLimit(
                env,
                opts,
                printLambdaBody(env, opts, term.body, null),
            ),
            typeFromTermType(term.is.res),
            term.location,
        );
    }
};

export const withExecutionLimit = (
    env: Env,
    opts: OutputOptions,
    body: Block | Expr,
): Expr | Block => {
    if (!opts.limitExecutionTime) {
        return body;
    }
    return {
        type: 'Block',
        loc: body.loc,
        items: [
            {
                type: 'Expression',
                loc: body.loc,
                expr: callExpression(
                    builtin(
                        'checkExecutionLimit',
                        body.loc,
                        pureFunction([], void_),
                    ),
                    pureFunction([], void_),
                    void_,
                    [],
                    body.loc,
                ),
            },
            ...(body.type === 'Block'
                ? body.items
                : [{ type: 'Return', loc: body.loc, value: body } as Stmt]),
        ],
    };
    // return t.blockStatement([
    //     t.expressionStatement(
    //         t.callExpression(scopedId(opts, 'checkExecutionLimit'), []),
    //     ),
    //     ...(body.type === 'BlockStatement'
    //         ? body.body
    //         : [t.returnStatement(body)]),
    // ]);
};

const effectfulLambda = (
    env: Env,
    opts: OutputOptions,
    term: Lambda,
): LambdaExpr => {
    const done: Symbol = { name: 'done', unique: env.local.unique++ };
    const doneT: LambdaType = pureFunction(
        [handlersType, typeFromTermType(term.is.res)],
        void_,
        [],
        term.location,
    );
    return arrowFunctionExpression(
        term.args
            .map((sym, i) => ({
                sym,
                type: typeFromTermType(term.is.args[i]),
                loc: null,
            }))
            .concat([
                { type: handlersType, sym: handlerSym, loc: null },
                { sym: done, type: doneT, loc: null },
            ]),
        withExecutionLimit(
            env,
            opts,
            printLambdaBody(env, opts, term.body, {
                type: 'var',
                sym: done,
                loc: null,
                is: doneT,
            }),
        ),
        // term.is.res,
        void_,
        term.location,
    );
};

export const sequenceToBlock = (
    env: Env,
    opts: OutputOptions,
    term: Sequence,
    cps: null | Expr,
): Block => {
    if (cps == null) {
        return {
            type: 'Block',
            items: term.sts.map(
                (s, i): Stmt => {
                    if (s.type === 'Let') {
                        return {
                            type: 'Define',
                            sym: s.binding,
                            value: printTerm(env, opts, s.value),
                            loc: s.location,
                            is: typeFromTermType(s.is),
                        };
                    } else if (i === term.sts.length - 1) {
                        return {
                            type: 'Return',
                            value: printTerm(env, opts, s),
                            loc: s.location,
                        };
                    } else {
                        return {
                            type: 'Expression',
                            expr: printTerm(env, opts, s),
                            loc: s.location,
                        };
                    }
                },
            ),
            loc: term.location,
        };
    } else {
        // so we start from the last
        // and we know what we want to bind to, right? or something?
        // in what case would we want to CPS something that
        // can't be CPSd?
        let inner: Expr = cps;
        for (let i = term.sts.length - 1; i >= 0; i--) {
            if (i > 0) {
                inner = arrowFunctionExpression(
                    [
                        {
                            sym: handlerSym,
                            type: handlersType,
                            loc: null,
                        },
                        {
                            sym: { name: '_ignored', unique: 1 },
                            type: void_,
                            loc: null,
                        },
                    ],
                    {
                        type: 'Block',
                        loc: term.sts[i].location,
                        items: [
                            {
                                type: 'Expression',
                                expr: termToAstCPS(
                                    env,
                                    opts,
                                    term.sts[i],
                                    inner,
                                ),
                                loc: term.sts[i].location,
                            },
                        ],
                    },
                    void_,
                    term.sts[i].location,
                );
            } else {
                inner = termToAstCPS(env, opts, term.sts[i], inner);
            }
        }
        return {
            type: 'Block',
            items: [{ type: 'Expression', expr: inner, loc: term.location }],
            loc: term.location,
        };
    }
};

export const printLambdaBody = (
    env: Env,
    opts: OutputOptions,
    term: Term,
    cps: null | Expr,
): Block | Expr => {
    if (cps == null) {
        if (term.type === 'sequence') {
            return sequenceToBlock(env, opts, term, null);
        } else {
            return printTerm(env, opts, term);
        }
    } else {
        if (term.type === 'sequence') {
            return sequenceToBlock(env, opts, term, cps);
        } else {
            return {
                type: 'Block',
                items: [
                    {
                        type: 'Expression',
                        expr: termToAstCPS(env, opts, term, cps),
                        loc: term.location,
                    },
                ],
                loc: term.location,
            };
        }
    }
};
