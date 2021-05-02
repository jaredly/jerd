// The bulk of stuff happens here

import {
    Env,
    Symbol,
    LambdaType,
    Handle,
    UserReference,
    EffectReference,
    EffectRef,
} from '../../typing/types';
import {
    Expr,
    OutputOptions,
    Stmt,
    Type,
    LambdaType as ILambdaType,
    Loc,
} from './types';
import {
    arrowFunctionExpression,
    assign,
    callExpression,
    define,
    expressionStatement,
    lambdaTypeFromTermType,
    pureFunction,
    returnStatement,
    typeFromTermType,
    var_,
    void_,
    withSym,
} from './utils';

import { iffe, asBlock, block } from './utils';
import { printLambdaBody } from './lambda';
import { printTerm } from './term';
import { newSym } from '../../typing/env';
import {
    handleArgsForEffects,
    handlerTypesForEffects,
    handleValuesForEffects,
} from './cps';

export const printHandleNew = (
    env: Env,
    opts: OutputOptions,
    term: Handle,
    done: Expr | null,
): Expr => {
    if (!done) {
        const resT = typeFromTermType(env, opts, term.is);
        return withSyncDone(env, opts, resT, term.location, (done) =>
            _printHandleNew(env, opts, term, done),
        );
    }

    return iffe(
        env,
        block(_printHandleNew(env, opts, term, done), term.location),
    );
};

export const _printHandleNew = (
    env: Env,
    opts: OutputOptions,
    term: Handle,
    done: Expr,
): Array<Stmt> => {
    /*
    handle! fn {
        Write.write((v) => k) => xyz,
        pure(x) => z,
    }

    becomes

    let fnReturnPointer = {pure as a function that just takes a value}
    fn([
        (value: string, rawK: (handler: handle123123, returnValue: string) => void) => {
            const k = (returnValue: string, handler: handle123123, returnToHandler: ...) => {
                fnReturnPointer = returnToHandler
                rawK(handler, reyturnValue)
            }
            // k is now set.
        }
    ], (_handlerIThink, returnValue) => fnReturnPointer(returnValue))

    // ok worth a shot
    */
    const fnReturnPointer = newSym(env, 'fnReturnPointer');
    const targetType = lambdaTypeFromTermType(
        env,
        opts,
        term.target.is as LambdaType,
    ) as ILambdaType;

    const effectRef: EffectRef = { type: 'ref', ref: term.effect };

    const fnReturn = arrowFunctionExpression(
        [
            ...handleArgsForEffects(env, opts, [effectRef], term.location),
            {
                type: targetType.res,
                sym: term.pure.arg,
                loc: term.location,
            },
        ],
        printLambdaBody(env, opts, term.pure.body, done),
        term.location,
    );

    const fnDone = withSym(env, 'returnValue', (returnValue) =>
        arrowFunctionExpression(
            [
                ...handleArgsForEffects(env, opts, [effectRef], term.location),
                {
                    sym: returnValue,
                    type: targetType.res,
                    loc: term.location,
                },
            ],
            callExpression(
                env,
                var_(fnReturnPointer, term.location, fnReturn.is),
                [
                    ...handleValuesForEffects(
                        env,
                        opts,
                        fnReturn.is.args,
                        term.location,
                    ),
                    var_(returnValue, term.location, targetType.res),
                ],
                term.location,
            ),
            term.location,
        ),
    );

    // TODO can I make this as straightforward as I can?
    return [
        define(fnReturnPointer, fnReturn),
        expressionStatement(
            callExpression(
                env,
                printTerm(env, opts, term.target),
                [
                    ...handleValuesForEffects(
                        env,
                        opts,
                        targetType.args,
                        term.location,
                    ),
                    fnDone,
                ],
                term.location,
            ),
        ),
    ];
};

export const withSyncDone = (
    env: Env,
    opts: OutputOptions,
    vt: Type,
    loc: Loc,
    fn: (done: Expr) => Array<Stmt>,
): Expr => {
    const sym: Symbol = newSym(env, 'result');
    const doneS: Symbol = newSym(env, 'done');
    const doneT: Type = pureFunction(
        [...handlerTypesForEffects(env, opts, []), vt],
        void_,
    );

    return iffe(
        env,
        block(
            [
                define(sym, undefined, loc, vt, true),
                define(doneS, withSym(env, 'value', (value) =>
                    arrowFunctionExpression(
                        [
                            ...handleArgsForEffects(env, opts, [], loc),
                            { type: vt, sym: value, loc },
                        ],
                        block([assign(sym, var_(value, loc, vt))], loc),
                        loc,
                    ),
                )),
                ...fn(var_(doneS, loc, doneT)),
                returnStatement(var_(sym, loc, vt)),
            ],
            loc,
        ),
    );
};
