// The bulk of stuff happens here

import {
    Term,
    Env,
    Symbol,
    Lambda,
    LambdaType as TLambdaType,
    Sequence,
    getEffects,
} from '../../typing/types';
import {
    builtinType,
    lambdaTypeFromTermType,
    pureFunction,
    showType,
    sortedExplicitEffects,
    void_,
} from './utils';

import {
    Expr,
    Block,
    Stmt,
    LambdaExpr,
    OutputOptions,
    LambdaType,
    CPS,
} from './types';
import { callExpression, typeFromTermType } from './utils';

import {
    termToAstCPS,
    handlerArg,
    handlerTypesForEffects,
    handleArgsForEffects,
} from './cps';
import { arrowFunctionExpression, builtin } from './utils';
import { printTerm } from './term';
import { withNoEffects } from '../../typing/transform';
import { cpus } from 'os';
import { isVoid } from '../../typing/terms/handle';

export const printLambda = (
    env: Env,
    opts: OutputOptions,
    term: Lambda,
): Expr => {
    if (term.tags && term.tags.includes('newHandlers')) {
        opts = {
            ...opts,
            explicitHandlerFns: true,
        };
    }
    if (term.is.effects.length > 0) {
        if (
            term.is.effects.every((x) => x.type === 'var') &&
            term.is.effectVbls.length
        ) {
            const directVersion = withNoEffects(env, term);
            // console.log(`Direct version folks`);
            // console.log(printToString(termToPretty(env, term), 100));
            // console.log(printToString(termToPretty(env, directVersion), 100));
            return {
                type: 'effectfulOrDirectLambda',
                loc: term.location,
                effectful: effectfulLambda(env, opts, term),
                direct: arrowFunctionExpression(
                    directVersion.args.map(
                        (sym, i) => ({
                            sym,
                            type: typeFromTermType(
                                env,
                                opts,
                                directVersion.is.args[i],
                            ),
                            loc: null,
                        }), // TODO(sourcemap): hang on to location for lambda args?
                    ),
                    withExecutionLimit(
                        env,
                        opts,
                        printLambdaBody(env, opts, directVersion.body, null),
                    ),
                    term.location,
                    term.is.typeVbls,
                    term.tags,
                ),
                is: lambdaTypeFromTermType(env, opts, term.is as TLambdaType),
            };
        }
        return effectfulLambda(env, opts, term);
    } else {
        return arrowFunctionExpression(
            term.args.map((sym, i) => ({
                sym,
                type: typeFromTermType(env, opts, term.is.args[i]),
                loc: null,
            })),
            withExecutionLimit(
                env,
                opts,
                printLambdaBody(env, opts, term.body, null),
            ),
            term.location,
            term.is.typeVbls,
            term.tags,
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
                    env,
                    builtin(
                        'checkExecutionLimit',
                        body.loc,
                        pureFunction([], void_),
                    ),
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
    const doneArgs = handlerTypesForEffects(
        env,
        opts,
        term.is.effects,
        term.location,
    );
    if (!isVoid(term.is.res)) {
        doneArgs.push(typeFromTermType(env, opts, term.is.res));
    }
    const doneT: LambdaType = pureFunction(doneArgs, void_, [], term.location);
    const { args, handlers } = handleArgsForEffects(
        env,
        opts,
        term.is.effects,
        term.location,
    );
    return arrowFunctionExpression(
        term.args
            .map((sym, i) => ({
                sym,
                type: typeFromTermType(env, opts, term.is.args[i]),
                loc: term.location,
            }))
            .concat([
                ...args,
                // handlerArg(term.location),
                { sym: done, type: doneT, loc: term.location },
            ]),
        withExecutionLimit(
            env,
            opts,
            printLambdaBody(env, opts, term.body, {
                done: {
                    type: 'var',
                    sym: done,
                    loc: term.location,
                    is: doneT,
                },
                handlers: handlers,
            }),
        ),
        term.location,
        term.is.typeVbls,
        term.tags,
    );
};

export const sequenceToBlock = (
    env: Env,
    opts: OutputOptions,
    term: Sequence,
    cps: null | CPS,
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
                            is: typeFromTermType(env, opts, s.is),
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
        let inner: CPS = cps;
        for (let i = term.sts.length - 1; i >= 0; i--) {
            if (i > 0) {
                const { args, handlers } = handleArgsForEffects(
                    env,
                    opts,
                    getEffects(term.sts[i]),
                    term.location,
                );
                inner = {
                    ...inner,
                    done: arrowFunctionExpression(
                        [
                            ...args,
                            //         handlerArg(term.sts[i].location),
                            // BUG CHECK:
                            // If we run into problems with done
                            // not being passed around correctly
                            // in cps,
                            // which like could totally happen
                            // erm
                            // just re-enable this, and probably live with it?
                            // idk, I'm worried about the case
                            // where some function is passed to another one
                            // or something.
                            // but maybe that just wouldn't happen? idk
                            //
                            // { sym: { name: '_ignored', unique: 1 }, type: builtinType('unknown'), loc: null, },
                        ],
                        {
                            type: 'Block',
                            loc: term.sts[i].location,
                            items: [
                                {
                                    type: 'Expression',
                                    expr: termToAstCPS(env, opts, term.sts[i], {
                                        ...inner,
                                        handlers: {
                                            ...inner.handlers,
                                            ...handlers,
                                        },
                                    }),
                                    loc: term.sts[i].location,
                                },
                            ],
                        },
                        term.sts[i].location,
                    ),
                };
            } else {
                inner = {
                    ...inner,
                    done: termToAstCPS(env, opts, term.sts[i], inner),
                };
            }
        }
        return {
            type: 'Block',
            items: [
                { type: 'Expression', expr: inner.done, loc: term.location },
            ],
            loc: term.location,
        };
    }
};

export const printLambdaBody = (
    env: Env,
    opts: OutputOptions,
    term: Term,
    cps: null | CPS,
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
