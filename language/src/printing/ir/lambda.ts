// The bulk of stuff happens here

import {
    Term,
    Env,
    Symbol,
    EffectRef,
    Lambda,
    LambdaType,
    walkTerm,
} from '../../typing/types';
import { builtinType, void_ } from '../../typing/preset';
import { applyEffectVariables } from '../../typing/typeExpr';

import {
    Expr,
    Block,
    Stmt,
    handlersType,
    handlerSym,
    LambdaExpr,
    OutputOptions,
} from './types';

import { termToAstCPS } from './cps';
import { arrowFunctionExpression } from './utils';
import { printTerm } from './term';

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
                            type: directVersion.is.args[i],
                            loc: null,
                        }), // TODO(sourcemap): hang on to location for lambda args?
                    ),
                    // TODO withExecutionLimit
                    printLambdaBody(env, opts, directVersion.body, null),
                    directVersion.is.res,
                    term.location,
                ),
            };
        }
        return effectfulLambda(env, opts, term);
    } else {
        return arrowFunctionExpression(
            term.args.map((sym, i) => ({
                sym,
                type: term.is.args[i],
                loc: null,
            })),
            // TODO withExecutionLimit
            printLambdaBody(env, opts, term.body, null),
            term.is.res,
            term.location,
        );
    }
};

// yeah we need to go in, and
// apply the effect variables all over
const withNoEffects = (env: Env, term: Lambda): Lambda => {
    const vbls = term.is.effectVbls;
    const is = applyEffectVariables(env, term.is, []) as LambdaType;
    // lol clone
    term = JSON.parse(JSON.stringify(term)) as Lambda;
    walkTerm(term, (t) => {
        if (t.type === 'apply') {
            const is = t.target.is as LambdaType;
            if (is.effects) {
                is.effects = clearEffects(vbls, is.effects);
            }
        }
    });
    return { ...term, is };
};

const effectfulLambda = (
    env: Env,
    opts: OutputOptions,
    term: Lambda,
): LambdaExpr => {
    const done: Symbol = { name: 'done', unique: env.local.unique++ };
    const doneT: LambdaType = {
        type: 'lambda',
        args: [handlersType, term.is.res],
        typeVbls: [],
        effectVbls: [],
        effects: [],
        rest: null,
        location: null,
        res: void_,
    };
    return arrowFunctionExpression(
        term.args
            .map((sym, i) => ({
                sym,
                type: term.is.args[i],
                loc: null,
            }))
            .concat([
                { type: builtinType('handlers'), sym: handlerSym, loc: null },
                { sym: done, type: doneT, loc: null },
            ]),
        // TODO: withExecutionLimit
        printLambdaBody(env, opts, term.body, {
            type: 'var',
            sym: done,
            loc: null,
        }),
        // term.is.res,
        void_,
        term.location,
    );
};

export const printLambdaBody = (
    env: Env,
    opts: OutputOptions,
    term: Term,
    // cps: null | { body: Expr; bind: t.Identifier },
    cps: null | Expr,
): Block | Expr => {
    if (cps == null) {
        if (term.type === 'sequence') {
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
                                is: s.is,
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
            return printTerm(env, opts, term);
        }
    } else {
        if (term.type === 'sequence') {
            // so we start from the last
            // and we know what we want to bind to, right? or something?
            // in what case would we want to CPS something that
            // can't be CPSd?
            let inner: Expr = cps;
            for (let i = term.sts.length - 1; i >= 0; i--) {
                if (i > 0) {
                    inner = {
                        type: 'lambda',
                        args: [
                            {
                                sym: handlerSym,
                                type: builtinType('handlers'),
                                loc: null,
                            },
                            {
                                sym: { name: '_ignored', unique: 1 },
                                type: builtinType('void'),
                                loc: null,
                            },
                        ],
                        body: {
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
                        res: void_,
                        loc: term.sts[i].location,
                    };
                } else {
                    inner = termToAstCPS(env, opts, term.sts[i], inner);
                }
            }
            return {
                type: 'Block',
                items: [
                    { type: 'Expression', expr: inner, loc: term.location },
                ],
                loc: term.location,
            };
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

const clearEffects = (
    vbls: Array<number>,
    effects: Array<EffectRef>,
): Array<EffectRef> => {
    return effects.filter(
        (e) => e.type !== 'var' || !vbls.includes(e.sym.unique),
    );
};
