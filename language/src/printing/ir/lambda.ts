// The bulk of stuff happens here

import {
    Term,
    Env,
    Symbol,
    EffectRef,
    Lambda,
    LambdaType,
    walkTerm,
    EffectReference,
} from '../../typing/types';
import { builtinType, pureFunction, void_ } from '../../typing/preset';
import { applyEffectVariables } from '../../typing/typeExpr';

import {
    Expr,
    Block,
    Stmt,
    // handlersType,
    // handlerSym,
    LambdaExpr,
    OutputOptions,
    callExpression,
    Arg,
} from './types';

import { EffectHandlers, effectHandlerType, termToAstCPS } from './cps';
import { arrowFunctionExpression, builtin } from './utils';
import { printTerm } from './term';
import { idName, refName } from '../../typing/env';
import { nullLocation } from '../../parsing/parser';

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
                    withExecutionLimit(
                        env,
                        opts,
                        printLambdaBody(
                            env,
                            opts,
                            directVersion.body,
                            {},
                            null,
                        ),
                    ),
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
            withExecutionLimit(
                env,
                opts,
                printLambdaBody(env, opts, term.body, {}, null),
            ),
            term.is.res,
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
                    builtin('checkExecutionLimit', body.loc),
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

const cmp = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

export const sortedExplicitEffects = (
    effects: Array<EffectRef>,
): Array<EffectReference> => {
    return (effects.filter(
        (e) => e.type === 'ref',
    ) as Array<EffectReference>).sort((a, b) =>
        cmp(refName(a.ref), refName(b.ref)),
    );
};

const effectfulLambda = (
    env: Env,
    opts: OutputOptions,
    term: Lambda,
): LambdaExpr => {
    const done: Symbol = { name: 'done', unique: env.local.unique++ };

    const explicitEffects = sortedExplicitEffects(term.is.effects);
    const effectHandlerTypes = explicitEffects.map((eff) => {
        return effectHandlerType(env, eff);
    });

    const doneT: LambdaType = {
        type: 'lambda',
        args: [...effectHandlerTypes, term.is.res],
        typeVbls: [],
        effectVbls: [],
        effects: [],
        rest: null,
        location: null,
        res: void_,
    };
    const effectHandlers: EffectHandlers = {};
    const syms = sortedExplicitEffects(term.is.effects)
        .map((eff) => {
            const sym: Symbol = {
                name: 'eff' + refName(eff.ref),
                unique: env.local.unique++,
            };
            effectHandlers[refName(eff.ref)] = {
                expr: {
                    type: 'var',
                    sym,
                    loc: nullLocation,
                    is: effectHandlerType(env, eff),
                },
                sym,
            };
            return { sym, type: effectHandlerType(env, eff), loc: null };
        })
        .filter(Boolean) as Array<Arg>;
    return arrowFunctionExpression(
        term.args
            .map(
                (sym, i) =>
                    ({
                        sym,
                        type: term.is.args[i],
                        loc: null,
                    } as Arg),
            )
            .concat([...syms, { sym: done, type: doneT, loc: null }]),
        withExecutionLimit(
            env,
            opts,
            printLambdaBody(
                env,
                opts,
                term.body,
                effectHandlers,
                // so
                // is this where we pre-pack things?
                // or is it on-use?
                // maybe on-use folks.
                {
                    type: 'var',
                    sym: done,
                    is: doneT,
                    loc: null,
                },
            ),
        ),
        // term.is.res,
        void_,
        term.location,
    );
};

export const printLambdaBody = (
    env: Env,
    opts: OutputOptions,
    term: Term,
    effectHandlers: EffectHandlers,
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
                            // {
                            //     sym: handlerSym,
                            //     type: builtinType('handlers'),
                            //     loc: null,
                            // },
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
                                        effectHandlers,
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
                    inner = termToAstCPS(
                        env,
                        opts,
                        term.sts[i],
                        effectHandlers,
                        inner,
                    );
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
                        expr: termToAstCPS(
                            env,
                            opts,
                            term,
                            effectHandlers,
                            cps,
                        ),
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
