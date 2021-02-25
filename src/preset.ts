// Presets

import { Env, newEnv, Term, Type, TypeConstraint } from './types';

export const int: Type = { type: 'ref', ref: { type: 'builtin', name: 'int' } };
export const string: Type = {
    type: 'ref',
    ref: { type: 'builtin', name: 'string' },
};
export const void_: Type = {
    type: 'ref',
    ref: { type: 'builtin', name: 'void' },
};
export const bool: Type = {
    type: 'ref',
    ref: { type: 'builtin', name: 'bool' },
};

export const prelude = [
    `export {}`,
    'const log = console.log',
    `const raise = (handlers, hash, idx, args, done) => {
            handlers[hash](idx, args, done)
        }`,
    `type ShallowHandler<Get, Set> = (
            idx: number,
            args: Set,
            returnIntoFn: (newHandler: {[hash: string]: ShallowHandler<Get, Set>}, value: Get) => void,
        ) => void;`,
    `const handleSimpleShallow2 = <Get, Set, R>(
            hash: string,
            fn: (handler: {[hash: string]: ShallowHandler<Get, Set>}, cb: (fnReturnValue: R) => void) => void,
            handleEffect: Array<(
                value: Set,
                cb: (
                    gotten: Get,
                    newHandler: {[hash: string]: ShallowHandler<Get, Set>},
                    returnIntoHandler: (fnReturnValue: R) => void,
                ) => void,
            ) => void>,
            handlePure: (fnReturnValue: R) => void,
            otherHandlers: any | null,
        ) => {
            let fnsReturnPointer = handlePure;
            fn(
                {...otherHandlers, [hash]: (idx, args, returnIntoFn) => {
                    handleEffect[idx](
                        args,
                        (handlersValueToSend, newHandler, returnIntoHandler) => {
                            if (returnIntoHandler === undefined) {
                                /// @ts-ignore
                                returnIntoHandler = newHandler
                                /// @ts-ignore
                                newHandler = handlersValueToSend
                                /// @ts-ignore
                                handlersValueToSend = null
                            }
                            fnsReturnPointer = returnIntoHandler;
                            returnIntoFn(newHandler, handlersValueToSend);
                        },
                    );
                }},
                (fnsReturnValue) => {
                    fnsReturnPointer(fnsReturnValue)
                },
            );
        };`,
];

export const binOps = ['++', '+', '>', '<', '/', '*', '==', '-'];

export function presetEnv() {
    const env = newEnv({
        name: 'global',
        type: { type: 'ref', ref: { type: 'builtin', name: 'never' } },
    });
    env.global.builtins['true'] = bool;
    env.global.builtins['false'] = bool;
    env.global.builtins['++'] = {
        type: 'lambda',
        typeVbls: [],
        args: [string, string],
        effects: [],
        rest: null,
        res: string,
    };
    env.global.builtins['>'] = {
        type: 'lambda',
        typeVbls: [],
        args: [int, int],
        effects: [],
        rest: null,
        res: bool,
    };
    env.global.builtins['<'] = {
        type: 'lambda',
        typeVbls: [],
        args: [int, int],
        effects: [],
        rest: null,
        res: bool,
    };
    env.global.builtins['=='] = {
        type: 'lambda',
        typeVbls: [],
        args: [string, string],
        effects: [],
        rest: null,
        res: bool,
    };
    env.global.builtins['+'] = {
        type: 'lambda',
        typeVbls: [],
        args: [int, int],
        effects: [],
        rest: null,
        res: int,
    };
    env.global.builtins['-'] = {
        type: 'lambda',
        typeVbls: [],
        args: [int, int],
        effects: [],
        rest: null,
        res: int,
    };
    env.global.builtins['/'] = {
        type: 'lambda',
        typeVbls: [],
        args: [int, int],
        effects: [],
        rest: null,
        res: int,
    };
    env.global.builtins['*'] = {
        type: 'lambda',
        typeVbls: [],
        args: [int, int],
        effects: [],
        rest: null,
        res: int,
    };
    env.global.builtins['log'] = {
        type: 'lambda',
        typeVbls: [],
        args: [string],
        effects: [],
        rest: null,
        res: void_,
    };
    env.global.builtinTypes['unit'] = 0;
    env.global.builtinTypes['void'] = 0;
    env.global.builtinTypes['int'] = 0;
    env.global.builtinTypes['bool'] = 0;
    env.global.builtinTypes['string'] = 0;

    return env;
}
