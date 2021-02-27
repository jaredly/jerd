// Presets

import { Env, newEnv, Term, Type, TypeConstraint } from './types';

export const int: Type = {
    type: 'ref',
    ref: { type: 'builtin', name: 'int' },
    location: null,
};
export const string: Type = {
    type: 'ref',
    ref: { type: 'builtin', name: 'string' },
    location: null,
};
export const void_: Type = {
    type: 'ref',
    ref: { type: 'builtin', name: 'void' },
    location: null,
};
export const bool: Type = {
    type: 'ref',
    ref: { type: 'builtin', name: 'bool' },
    location: null,
};

// export const prelude = [
//     'const log = console.log',
//     `const raise = (handlers, hash, idx, args, done) => {

//         // Linked list it up!!
//         let prev = null;
//         while (handlers != null) {
//             // OOOOooohhhhhh should I modify "done"?
//             // Like, reattach the prev at that point???
//             // maybe.
//             if (handlers[0].hash !== hash) {
//                 prev = [handlers[0], prev]
//                 handlers = handlers[1]
//                 continue;
//             }

//             const handler = handlers[0]
//             let otherHandlers = handlers[1]
//             // Recreate the top of the stack
//             while (prev != null) {
//                 otherHandlers = [prev[0], otherHandlers]
//                 prev = prev[1]
//             }
//             handler.fn(otherHandlers, idx, args, done)
//         }
//         throw new Error("effect not handled")

//         // console.log('Raise!', hash, args);
//         // handlers[hash](handlers, idx, args, done)
//         // for (let i=handlers.length - 1; i>=0; i--) {
//         //     if (handlers[i].hash === hash) {
//         //         const otherHandlers = handlers.slice()
//         //         otherHandlers.splice(i, 1)
//         //         handlers[i].fn(otherHandlers, idx, args, done);
//         //         break
//         //     }
//         // }
//     }`,
//     `type ShallowHandler<Get, Set> = (
//             idx: number,
//             args: Set,
//             returnIntoFn: (newHandler: {[hash: string]: ShallowHandler<Get, Set>}, value: Get) => void,
//         ) => void;`,
//     `const joinLinked = (head, tail) => {
//         if (head == null) {
//             return tail
//         }
//         if (tail == null) {
//             return head
//         }
//         const top = [head[0], null]
//         let current = top
//         // head = head[1]
//         while (head[1] != null) {
//             current[1] = [head[1][0], null]
//             current = current[1]
//             head = head[1]
//             // current[0] = head[0]
//             // current[1] = []
//             // head =
//         }
//         current[1] = tail
//         return top
//     }`,
//     `const handleSimpleShallow2 = <Get, Set, R>(
//             hash: string,
//             fn: (handler: {[hash: string]: ShallowHandler<Get, Set>}, cb: (fnReturnValue: R) => void) => void,
//             handleEffect: Array<(
//                 value: Set,
//                 cb: (
//                     gotten: Get,
//                     newHandler: {[hash: string]: ShallowHandler<Get, Set>},
//                     returnIntoHandler: (fnReturnValue: R) => void,
//                 ) => void,
//             ) => void>,
//             handlePure: (handlers: any, fnReturnValue: R) => void,
//             otherHandlers: any | null,
//         ) => {
//             let fnsReturnPointer = handlePure;
//             const thisHandler = {hash, fn: (currentHandlers, idx, args, returnIntoFn) => {
//                 handleEffect[idx](
//                     currentHandlers,
//                     args,
//                     (handlersValueToSend, newHandler, returnIntoHandler) => {
//                         if (returnIntoHandler === undefined) {
//                             /// @ts-ignore
//                             returnIntoHandler = newHandler
//                             /// @ts-ignore
//                             newHandler = handlersValueToSend
//                             /// @ts-ignore
//                             handlersValueToSend = null
//                         }
//                         fnsReturnPointer = returnIntoHandler;
//                         // TODO: I think we can remove this filter, but I don't want to jinx it before I have a more complete test suite.
//                         // oooh joining two linked lists is tricky actually
//                         returnIntoFn(currentHandlers == null ? newHandler : joinLinked(newHandler, currentHandlers), handlersValueToSend);
//                         // returnIntoFn(currentHandlers.concat(newHandler), handlersValueToSend);
//                         // returnIntoFn(currentHandlers.concat(newHandler).filter(h => h !== thisHandler), handlersValueToSend);
//                     },
//                 );
//             }}
//             fn(
//                 [thisHandler, otherHandlers],
//                 // (otherHandlers ? otherHandlers.concat([thisHandler]) : [thisHandler]),
//                 (handlers, fnsReturnValue) => {
//                     // do we always assume that "thisHandler" will be the final one? maybe? idk.
//                     // const idx = handlers.indexOf(thisHandler)
//                     // const nHandlers = idx === -1 ? handlers : handlers.slice();
//                     // if (idx !== -1) {
//                     //     nHandlers.splice(idx, 1)
//                     // }
//                     // fnsReturnPointer(nHandlers, fnsReturnValue)
//                     // STOPSHIP: waiiiit I thought I needed to filter here? 🤔
//                     // Try to construct a thing where we definitely need to filter here
//                     fnsReturnPointer(handlers, fnsReturnValue)
//                     // fnsReturnPointer(handlers.filter(h => h !== thisHandler), fnsReturnValue)
//                 },
//             );
//         };`,
//     // Just for the eff paper 🙃
//     `const isSquare = (x) => {
//             const m = Math.sqrt(x)
//             return Math.floor(m) === m
//         };`,
//     `const intToString = x => x.toString();`,
// ];
// import fs from 'fs'

export const binOps = ['++', '+', '>', '<', '/', '*', '==', '-'];

export function presetEnv() {
    const env = newEnv({
        name: 'global',
        type: {
            type: 'ref',
            ref: { type: 'builtin', name: 'never' },
            location: null,
        },
    });
    env.global.builtins['true'] = bool;
    env.global.builtins['false'] = bool;

    // Just for the eff paper
    env.global.builtins['isSquare'] = {
        type: 'lambda',
        typeVbls: [],
        args: [int],
        effects: [],
        rest: null,
        res: bool,
        location: null,
    };
    env.global.builtins['intToString'] = {
        type: 'lambda',
        typeVbls: [],
        args: [int],
        effects: [],
        rest: null,
        res: string,
        location: null,
    };

    env.global.builtins['++'] = {
        type: 'lambda',
        typeVbls: [],
        args: [string, string],
        effects: [],
        rest: null,
        res: string,
        location: null,
    };
    env.global.builtins['>'] = {
        type: 'lambda',
        typeVbls: [],
        args: [int, int],
        effects: [],
        rest: null,
        res: bool,
        location: null,
    };
    env.global.builtins['<'] = {
        type: 'lambda',
        typeVbls: [],
        args: [int, int],
        effects: [],
        rest: null,
        res: bool,
        location: null,
    };
    env.global.builtins['=='] = {
        type: 'lambda',
        typeVbls: [10000],
        args: [
            { type: 'var', sym: { unique: 10000, name: 'T' }, location: null },
            { type: 'var', sym: { unique: 10000, name: 'T' }, location: null },
        ],
        effects: [],
        rest: null,
        res: bool,
        location: null,
    };
    env.global.builtins['+'] = {
        type: 'lambda',
        typeVbls: [],
        args: [int, int],
        effects: [],
        rest: null,
        res: int,
        location: null,
    };
    env.global.builtins['-'] = {
        type: 'lambda',
        typeVbls: [],
        args: [int, int],
        effects: [],
        rest: null,
        res: int,
        location: null,
    };
    env.global.builtins['/'] = {
        type: 'lambda',
        typeVbls: [],
        args: [int, int],
        effects: [],
        rest: null,
        res: int,
        location: null,
    };
    env.global.builtins['*'] = {
        type: 'lambda',
        typeVbls: [],
        args: [int, int],
        effects: [],
        rest: null,
        res: int,
        location: null,
    };
    env.global.builtins['log'] = {
        type: 'lambda',
        typeVbls: [],
        args: [
            // { type: 'var', sym: { unique: 10000, name: 'T' }, location: null },
            string,
        ],
        effects: [],
        rest: null,
        res: void_,
        location: null,
    };
    env.global.builtinTypes['unit'] = 0;
    env.global.builtinTypes['void'] = 0;
    env.global.builtinTypes['int'] = 0;
    env.global.builtinTypes['bool'] = 0;
    env.global.builtinTypes['string'] = 0;

    return env;
}
