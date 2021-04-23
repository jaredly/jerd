// General thing

import {
    Term,
    Env,
    Type,
    getEffects,
    Let,
    Var,
    EffectRef,
    UserReference,
} from '../../typing/types';
import {
    bool,
    builtinType,
    lambdaTypeFromTermType,
    pureFunction,
    typeFromTermType,
    void_,
} from './utils';
import { showLocation } from '../../typing/typeExpr';

import {
    stringLiteral,
    callExpression,
    handlerSym,
    handlersType,
} from './utils';

import { Loc, Expr, Block, Arg, OutputOptions } from './types';
import { printLambdaBody, sequenceToBlock } from './lambda';
import { printTerm } from './term';
import {
    ifStatement,
    iffe,
    blockStatement,
    arrowFunctionExpression,
    isSimple,
} from './utils';
import { maybeWrapPureFunction } from '../../typing/transform';

export const handlerVar = (loc: Loc): Expr => ({
    type: 'var',
    sym: handlerSym,
    loc,
    is: handlersType,
});

export const cpsLambda = (arg: Arg, body: Expr | Block, loc: Loc): Expr => {
    return arrowFunctionExpression(
        [
            {
                sym: handlerSym,
                type: builtinType('handlers'),
                loc: loc,
            },
            arg,
        ],
        body,
        void_,
        loc,
    );
};

export const termToAstCPS = (
    env: Env,
    opts: OutputOptions,
    term: Term | Let,
    done: Expr,
): Expr => {
    return _termToAstCPS(env, opts, term, done);
};

// cps: t.Identifier // is it the done fn, or the thing I want you to bind to?
const _termToAstCPS = (
    env: Env,
    opts: OutputOptions,
    term: Term | Let,
    done: Expr,
): Expr => {
    // No effects in the term
    if (!getEffects(term).length && term.type !== 'Let') {
        const tt = typeFromTermType(term.is);
        return callExpression(
            done,
            pureFunction([handlersType, tt], void_),
            void_,
            [
                {
                    type: 'var',
                    sym: handlerSym,
                    loc: term.location,
                    is: handlersType,
                },
                printTerm(env, opts, term),
            ],
            term.location,
        );
    }
    switch (term.type) {
        case 'handle': {
            if (getEffects(term.target).length > 0) {
                throw new Error(
                    `Handle target has effects! should be a lambda`,
                );
            }
            return {
                type: 'handle',
                target: printTerm(env, opts, term.target),
                effect: (term.effect as UserReference).id,
                loc: term.location,
                // fail boat
                pure: {
                    arg: term.pure.arg,
                    body: printLambdaBody(env, opts, term.pure.body, done),
                },
                cases: term.cases.map((kase) => ({
                    ...kase,
                    body: printLambdaBody(env, opts, kase.body, done),
                })),
                is: void_,
                done,
            };
        }
        case 'Let': {
            return termToAstCPS(
                env,
                opts,
                term.value,
                cpsLambda(
                    {
                        sym: term.binding,
                        type: typeFromTermType(term.is),
                        loc: term.location,
                    },
                    callExpression(
                        done,
                        pureFunction([handlersType], void_),
                        void_,
                        [
                            {
                                type: 'var',
                                sym: handlerSym,
                                loc: term.location,
                                is: handlersType,
                            },
                        ],
                        term.location,
                    ),
                    term.location,
                ),
            );
        }
        case 'raise': {
            if (
                ([] as Array<EffectRef>).concat(...term.args.map(getEffects))
                    .length > 0
            ) {
                return stringLiteral('raise args effects', null);
            }
            if (term.ref.type === 'builtin') {
                throw new Error('ok');
            }
            return {
                type: 'raise',
                effect: term.ref.id,
                idx: term.idx,
                args: term.args.map((t) => printTerm(env, opts, t)),
                loc: term.location,
                is: void_,
                done,
            };
        }
        case 'if': {
            const condEffects = getEffects(term.cond);
            if (condEffects.length) {
                return termToAstCPS(
                    env,
                    opts,
                    term.cond,
                    cpsLambda(
                        {
                            sym: { name: 'cond', unique: 1000 },
                            type: bool,
                            loc: term.cond.location,
                        },
                        {
                            type: 'Block',
                            items: [
                                ifStatement(
                                    {
                                        type: 'var',
                                        sym: { name: 'cond', unique: 1000 },
                                        loc: term.cond.location,
                                        is: bool,
                                    },
                                    printLambdaBody(env, opts, term.yes, done),
                                    term.no
                                        ? printLambdaBody(
                                              env,
                                              opts,
                                              term.no,
                                              done,
                                          )
                                        : callExpression(
                                              done,
                                              pureFunction(
                                                  [handlersType],
                                                  void_,
                                              ),
                                              void_,
                                              [handlerVar(term.location)],
                                              term.location,
                                          ),
                                    term.location,
                                ),
                            ],
                            loc: term.location,
                        },
                        term.location,
                    ),
                );
            }

            const cond = printTerm(env, opts, term.cond);

            return iffe(
                blockStatement(
                    [
                        ifStatement(
                            cond,
                            printLambdaBody(env, opts, term.yes, done),
                            term.no
                                ? printLambdaBody(env, opts, term.no, done)
                                : callExpression(
                                      done,
                                      pureFunction([handlersType], void_),
                                      void_,
                                      [handlerVar(term.location)],
                                      term.location,
                                  ),
                            term.location,
                        ),
                    ],
                    term.location,
                ),
                void_,
            );
        }
        case 'apply': {
            if (getEffects(term.target).length) {
                throw new Error(`target affects in an apply, sorry`);
            }
            const u = env.local.unique++;

            if (term.target.is.type !== 'lambda') {
                throw new Error(`Target is not a function`);
            }
            const argTypes = term.target.is.args;
            const args = term.args.map((arg, i) => {
                return maybeWrapPureFunction(env, arg, argTypes[i]);
            });

            const argsEffects = ([] as Array<EffectRef>).concat(
                ...term.args.map(getEffects),
            );
            if (argsEffects.length > 0) {
                const argSyms = args.map((arg, i) =>
                    isSimple(arg)
                        ? null
                        : { name: `arg_${i}`, unique: env.local.unique++ },
                );
                let target = printTerm(env, opts, term.target);
                if (term.hadAllVariableEffects) {
                    target = {
                        type: 'effectfulOrDirect',
                        target,
                        effectful: true,
                        loc: target.loc,
                        // STOPSHIP: is this the right thing?
                        is: typeFromTermType(term.target.is),
                    };
                }
                let inner: Expr = done;
                if (term.target.is.effects.length > 0) {
                    // ok so the thing is,
                    // i only need to cps it out if the arg
                    // is an apply that does cps.
                    // but not if that arg has an arg that does cps,
                    // right?
                    inner = callExpression(
                        target,
                        // STOSHIP: add handler n stuff
                        {
                            ...lambdaTypeFromTermType(term.originalTargetType),
                            args: term.originalTargetType.args
                                .map(typeFromTermType)
                                .concat([
                                    handlersType,
                                    pureFunction(
                                        [typeFromTermType(term.is)],
                                        void_,
                                    ),
                                ]),
                            res: void_,
                        },
                        // term.originalTargetType,
                        // term.is,
                        void_,
                        (argSyms.map((sym, i) =>
                            sym
                                ? { type: 'var', sym, loc: null }
                                : printTerm(env, opts, args[i]),
                        ) as Array<Expr>).concat([
                            handlerVar(target.loc),
                            inner,
                        ]),
                        target.loc,
                    );
                } else {
                    if (!term.originalTargetType) {
                        throw new Error(
                            `No original targt type ${showLocation(
                                term.location,
                            )}`,
                        );
                    }
                    // hm. I feel like I need to introspect `done`.
                    // and have a way to flatten out immediate calls.
                    // or I could do that post-hoc?
                    // I mean that might make things simpler tbh.
                    inner = callExpression(
                        done,
                        pureFunction([handlersType, builtinType('any')], void_),
                        void_,
                        [
                            handlerVar(target.loc),
                            // so here is where we want to
                            // put the "body"
                            // which might include inverting it.
                            callExpression(
                                target,
                                // term.originalTargetType,
                                {
                                    ...lambdaTypeFromTermType(
                                        term.originalTargetType,
                                    ),
                                    args: term.originalTargetType.args
                                        .map(typeFromTermType)
                                        .concat([
                                            handlersType,
                                            pureFunction(
                                                [typeFromTermType(term.is)],
                                                void_,
                                            ),
                                        ]),
                                    res: void_,
                                },
                                typeFromTermType(term.is),
                                argSyms.map((sym, i) =>
                                    sym
                                        ? { type: 'var', sym, loc: null }
                                        : printTerm(env, opts, args[i]),
                                ) as Array<Expr>,
                                target.loc,
                            ),
                        ],
                        target.loc,
                    );
                }
                for (let i = args.length - 1; i >= 0; i--) {
                    if (isSimple(args[i])) {
                        continue;
                    }
                    // TODO: follow type refs 🤔
                    // should just have a function like
                    // `resolveType(env, theType)`
                    // if (term.target.is.type === 'lambda' && )
                    inner = termToAstCPS(
                        env,
                        opts,
                        args[i],
                        arrowFunctionExpression(
                            [
                                {
                                    sym: handlerSym,
                                    loc: null,
                                    type: builtinType('handlers'),
                                },
                                {
                                    sym: argSyms[i]!,
                                    loc: args[i].location,
                                    type: typeFromTermType(args[i].is),
                                },
                            ],
                            blockStatement(
                                [
                                    {
                                        type: 'Expression',
                                        expr: inner,
                                        loc: inner.loc,
                                    },
                                ],
                                inner.loc,
                            ),
                            void_,
                            args[i].location,
                        ),
                    );
                }
                return inner;
            }
            let target = printTerm(env, opts, term.target);
            if (term.hadAllVariableEffects) {
                target = {
                    type: 'effectfulOrDirect',
                    target,
                    effectful: true,
                    loc: target.loc,
                    is: typeFromTermType(term.target.is),
                };
                // target = memberExpression(target, t.identifier('effectful'));
            }
            return callExpression(
                target,
                // term.originalTargetType,
                {
                    ...lambdaTypeFromTermType(term.originalTargetType),
                    args: term.originalTargetType.args
                        .map(typeFromTermType)
                        .concat([
                            handlersType,
                            pureFunction([typeFromTermType(term.is)], void_),
                        ]),
                    res: void_,
                },
                typeFromTermType(term.is),
                args
                    .map((arg, i) => printTerm(env, opts, arg))
                    .concat([handlerVar(target.loc), done]),
                target.loc,
            );
        }
        case 'sequence':
            return iffe(
                sequenceToBlock(env, opts, term, done),
                typeFromTermType(term.is),
            );
        default:
            // console.log('ELSE', term.type);
            return callExpression(
                done,
                pureFunction([handlersType, typeFromTermType(term.is)], void_),
                void_,
                [handlerVar(term.location), printTerm(env, opts, term)],
                term.location,
            );
    }
};
