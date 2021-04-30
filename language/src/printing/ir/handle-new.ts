// The bulk of stuff happens here

import {
    Env,
    Symbol,
    LambdaType,
    Handle,
    UserReference,
    EffectReference,
} from '../../typing/types';
import { Expr, OutputOptions, Stmt, Type } from './types';
import {
    arrowFunctionExpression,
    define,
    pureFunction,
    typeFromTermType,
    void_,
} from './utils';

import { iffe, asBlock, block } from './utils';
import { printLambdaBody } from './lambda';
import { printTerm } from './term';
import { newSym } from '../../typing/env';

export const printHandle = (
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
        [typeFromTermType(env, opts, term.is)],
        void_,
    );
    const doneVar: Expr = cps || {
        type: 'var',
        sym: doneS,
        loc: null,
        is: doneT,
    };

    const fnReturnPointer = newSym(env, 'fnReturnPointer');

    // TODO can I make this as straightforward as I can?
    return iffe(
        env,
        block(
            [
                define(fnReturnPointer, arrowFunctionExpression(
                    [],
                    printLambdaBody(env, opts, term.pure.body, doneVar),
                    term.location,
                )),
            ],
            term.location,
        ),
    );
};
