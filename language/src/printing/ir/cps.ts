// General thing

import {
    Term,
    Env,
    Type as TermType,
    getEffects,
    Let,
    Var,
    EffectRef,
    UserReference,
    EffectReference,
    LambdaType,
    Symbol,
} from '../../typing/types';
import {
    bool,
    builtinType,
    lambdaTypeFromTermType,
    pureFunction,
    showType,
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

import {
    Loc,
    Expr,
    Block,
    Arg,
    LambdaType as ILambdaType,
    OutputOptions,
    Type,
} from './types';
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
import { isVoid } from '../../typing/terms/handle';

export type EffectHandlers = { [id: string]: { expr: Expr; sym: Symbol } };

export const effectHandlerType = (env: Env, eff: EffectReference): Type => {
    return {
        type: 'effect-handler',
        ref: eff.ref,
        loc: null,
    };
};

export const effectConstructorType = (
    env: Env,
    eff: EffectReference,
    constr: { args: Array<TermType>; ret: TermType },
): Type => {
    return pureFunction(
        constr.args
            .map(typeFromTermType)
            .concat([
                pureFunction(
                    [
                        effectHandlerType(env, eff),
                        ...(isVoid(constr.ret)
                            ? []
                            : [typeFromTermType(constr.ret)]),
                    ],
                    void_,
                    [],
                    null,
                ),
            ]),
        void_,
        [],
        null,
    );
};

export const handlerVar = (loc: Loc): Expr => ({
    type: 'var',
    sym: handlerSym,
    loc,
    is: handlersType,
});

export const handlerArg = (loc: Loc): Arg => ({
    sym: handlerSym,
    type: handlersType,
    loc: loc,
});

export const cpsLambda = (arg: Arg, body: Expr | Block, loc: Loc): Expr => {
    return arrowFunctionExpression([handlerArg(loc), arg], body, loc);
};

export const termToAstCPS = (
    env: Env,
    opts: OutputOptions,
    term: Term | Let,
    done: Expr,
): Expr => {
    return _termToAstCPS(env, opts, term, done);
};

const _termToAstCPS = (
    env: Env,
    opts: OutputOptions,
    term: Term | Let,
    done: Expr,
): Expr => {
    // No effects in the term
    if (!getEffects(term).length && term.type !== 'Let') {
        const tt = typeFromTermType(term.is);
        return callDone(env, done, printTerm(env, opts, term), term.location);
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
                pure: {
                    arg: term.pure.arg,
                    argType: typeFromTermType(
                        (term.target.is as LambdaType).res,
                    ),
                    body: printLambdaBody(env, opts, term.pure.body, done),
                },
                cases: term.cases.map((kase) => ({
                    ...kase,
                    args: kase.args.map((arg) => ({
                        ...arg,
                        type: typeFromTermType(arg.type),
                    })),
                    k: {
                        ...kase.k,
                        type: typeFromTermType(kase.k.type),
                    },
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
                    callDone(env, done, null, term.location),
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
                throw new Error(`Condition effects -- call liftEffects first`);
            }

            const cond = printTerm(env, opts, term.cond);

            return iffe(
                env,
                blockStatement(
                    [
                        ifStatement(
                            cond,
                            printLambdaBody(env, opts, term.yes, done),
                            term.no
                                ? printLambdaBody(env, opts, term.no, done)
                                : callDone(env, done, null, term.location),
                            term.location,
                        ),
                    ],
                    term.location,
                ),
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

            if (term.args.some((arg) => getEffects(arg).length > 0)) {
                throw new Error(
                    `Apply arg had an effect - you need to run liftEffects first.`,
                );
            }
            let target = printTerm(env, opts, term.target);
            if (target.is.type === 'effectful-or-direct') {
                target = {
                    type: 'effectfulOrDirect',
                    target,
                    effectful: true,
                    loc: target.loc,
                    is: target.is.effectful,
                };
            }
            return passDone(
                env,
                target,
                args.map((arg, i) => printTerm(env, opts, arg)),
                done,
                term.location,
                term.typeVbls.map((t) => typeFromTermType(t)),
            );
        }
        case 'sequence':
            return iffe(env, sequenceToBlock(env, opts, term, done));
        default:
            return callDone(
                env,
                done,
                printTerm(env, opts, term),
                term.location,
            );
    }
};

// Should I have a function
// that gets the "handler arguments"?
// and the "done argument"?
// I need a function that is "does this done function want an argument"
// right?

export const passDone = (
    env: Env,
    target: Expr,
    args: Array<Expr>,
    done: Expr,
    loc: Loc,
    typeVbls?: Array<Type>,
) => {
    const tt = target.is as ILambdaType;
    const dt = done.is as ILambdaType;
    const edt = tt.args[tt.args.length - 1] as ILambdaType;
    if (edt.args.length > dt.args.length) {
        const args: Array<Arg> = edt.args.map((type, i) => ({
            type,
            loc,
            sym: { name: `arg_${i}`, unique: env.local.unique++ },
        }));
        done = arrowFunctionExpression(
            args,
            callExpression(
                env,
                done,
                args.slice(0, dt.args.length).map((arg) => ({
                    type: 'var',
                    sym: arg.sym,
                    is: arg.type,
                    loc,
                })),
                loc,
                [],
            ),
            loc,
        );
    }

    return callExpression(
        env,
        target,
        args.concat([handlerVar(loc), done]),
        loc,
        typeVbls,
    );
};

export const callDone = (
    env: Env,
    done: Expr,
    returnValue: Expr | null,
    loc: Loc,
) => {
    if (done.is.type !== 'lambda') {
        throw new Error(`Done is not a lambda ${done.is.type}`);
    }
    const args = [handlerVar(loc)];
    const dt = done.is as ILambdaType;
    if (returnValue != null && dt.args.length === 2) {
        args.push(returnValue);
    }
    return callExpression(env, done, args, loc);
};
