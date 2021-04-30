// The bulk of stuff happens here

import {
    Env,
    Symbol,
    LambdaType,
    Handle,
    UserReference,
    EffectReference,
} from '../../typing/types';
import {
    Expr,
    OutputOptions,
    Stmt,
    Type,
    LambdaType as ILambdaType,
} from './types';
import {
    arrowFunctionExpression,
    assign,
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
import { handleArgsForEffects, handlerTypesForEffects } from './cps';

export const printHandleNew = (
    env: Env,
    opts: OutputOptions,
    term: Handle,
    cps: Expr | null,
): Expr => {
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
    const sym: Symbol = newSym(env, 'result');
    const doneS: Symbol = newSym(env, 'done');
    const doneT: Type = pureFunction(
        [
            ...handlerTypesForEffects(env, opts, []),
            typeFromTermType(env, opts, term.is),
        ],
        void_,
    );
    const doneVar: Expr = cps || {
        type: 'var',
        sym: doneS,
        loc: term.location,
        is: doneT,
    };
    const resT = typeFromTermType(env, opts, term.is);

    const fnReturnPointer = newSym(env, 'fnReturnPointer');
    const targetIs = term.target.is as LambdaType;
    const targetType = lambdaTypeFromTermType(
        env,
        opts,
        targetIs,
    ) as ILambdaType;

    // TODO can I make this as straightforward as I can?
    return iffe(
        env,
        block(
            [
                define(sym, undefined, term.location, resT, true),
                define(doneS, withSym(env, 'value', (value) =>
                    arrowFunctionExpression(
                        [
                            ...handleArgsForEffects(
                                env,
                                opts,
                                [],
                                term.location,
                            ),
                            { type: resT, sym: value, loc: term.location },
                        ],
                        block(
                            [assign(sym, var_(value, term.location, resT))],
                            term.location,
                        ),
                        term.location,
                    ),
                )),
                define(fnReturnPointer, arrowFunctionExpression(
                    [
                        ...handleArgsForEffects(env, opts, [], term.location),
                        {
                            type: targetType.res,
                            sym: term.pure.arg,
                            loc: term.location,
                        },
                    ],
                    printLambdaBody(env, opts, term.pure.body, doneVar),
                    term.location,
                )),
                returnStatement(var_(sym, term.location, resT)),
            ],
            term.location,
        ),
    );
};
