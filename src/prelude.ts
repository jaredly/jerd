const log = console.log;

// const raise_ll = (handlers, hash, idx, args, done) => {
//     // Linked list it up!!
//     let prev: LinkedList<Handler> = null;
//     let top: LinkedList<Handler> = prev;
//     while (handlers != null) {
//         // OOOOooohhhhhh should I modify "done"?
//         // Like, reattach the prev at that point???
//         // maybe.
//         if (handlers[0].hash !== hash) {
//             if (prev == null) {
//                 prev = [handlers[0], null];
//                 top = prev;
//             } else {
//                 prev[1] = [handlers[0], null];
//                 prev = prev[1];
//             }
//             // prev = [handlers[0], prev];
//             handlers = handlers[1];
//             continue;
//         }

//         const handler = handlers[0];
//         let otherHandlers = top === null ? handlers[1] : top;
//         if (prev !== null) {
//             prev[1] = handlers[1];
//         }
//         // Recreate the top of the stack
//         // while (prev != null) {
//         //     otherHandlers = [prev[0], otherHandlers];
//         //     prev = prev[1];
//         // }
//         handler.fn(otherHandlers, idx, args, done);
//     }
//     throw new Error('effect not handled');
// };

type LinkedList<T> = null | [T, LinkedList<T>];

// const extract = <T>(head: LinkedList<T>, find: T => bool): [T | null, LinkedList<T>] => {
//     return x
// }

const extractItem = <T>(
    head: LinkedList<T>,
    find: (item: T) => boolean,
): [T | null, LinkedList<T>] => {
    if (head == null) {
        return [null, null];
    }
    if (find(head[0])) {
        return head;
    }
    const top: LinkedList<T> = [head[0], null];
    let current: LinkedList<T> = top;
    let found: T | null = null;
    while (head[1] != null) {
        if (find(head[1][0])) {
            found = head[1][0];
        } else {
            current[1] = [head[1][0], null];
            current = current[1];
        }
        head = head[1];
    }
    return [found, top];
};

const withoutItem = <T>(head: LinkedList<T>, item: T) => {
    if (head == null) {
        return null;
    }
    if (head[0] === item) {
        return head[1];
    }
    const top: LinkedList<T> = [head[0], null];
    let current: LinkedList<T> = top;
    while (head[1] != null) {
        if (head[1][0] !== item) {
            current[1] = [head[1][0], null];
            current = current[1];
        }
        head = head[1];
        // current[0] = head[0]
        // current[1] = []
        // head =
    }
    // current[1] = tail;
    return top;
};

const joinLinked = <T>(
    head: LinkedList<T>,
    tail: LinkedList<T>,
): LinkedList<T> => {
    if (head == null) {
        return tail;
    }
    if (tail == null) {
        return head;
    }
    const top: LinkedList<T> = [head[0], null];
    let current: LinkedList<T> = top;
    // head = head[1]
    while (head[1] != null) {
        current[1] = [head[1][0], null];
        current = current[1];
        head = head[1];
        // current[0] = head[0]
        // current[1] = []
        // head =
    }
    current[1] = tail;
    return top;
};

const raise = (handlers, hash, idx, args, done) => {
    for (let i = 0; i < handlers.length; i++) {
        if (handlers[i].hash === hash) {
            const otherHandlers = handlers.slice();
            otherHandlers.splice(i, 1);
            handlers[i].fn(otherHandlers, idx, args, done);
            break;
        }
    }
};

type Handler = { hash: string; fn: ShallowHandler<any, any> };

// type Handlers = LinkedList<Handler>;
type Handlers = Array<Handler>;

type ShallowHandler<Get, Set> = (
    currentHandlers: Handlers,
    idx: number,
    args: Set,
    returnIntoFn: (newHandler: Handlers, value: Get) => void,
) => void;

const handleSimpleShallow2 = <Get, Set, R>(
    hash: string,
    fn: (
        handler: Handlers,
        cb: (handlers: Handlers, fnReturnValue: R) => void,
    ) => void,
    handleEffect: Array<
        (
            handlers: Handlers,
            value: Set,
            cb: (
                gotten: Get,
                newHandler: Handlers,
                returnIntoHandler: (fnReturnValue: R) => void,
            ) => void,
        ) => void
    >,
    handlePure: (handlers: any, fnReturnValue: R) => void,
    otherHandlers: any | null,
) => {
    let fnsReturnPointer = handlePure;
    const thisHandler: Handler = {
        hash,
        fn: (currentHandlers, idx, args, returnIntoFn) => {
            handleEffect[idx](
                currentHandlers,
                args,
                (handlersValueToSend, newHandler, returnIntoHandler) => {
                    if (returnIntoHandler === undefined) {
                        /// @ts-ignore
                        returnIntoHandler = newHandler;
                        /// @ts-ignore
                        newHandler = handlersValueToSend;
                        /// @ts-ignore
                        handlersValueToSend = null;
                    }
                    fnsReturnPointer = returnIntoHandler;
                    // TODO: I think we can remove this filter, but I don't want to jinx it before I have a more complete test suite.
                    // oooh joining two linked lists is tricky actually

                    // // LL
                    // returnIntoFn(
                    //     currentHandlers == null
                    //         ? newHandler
                    //         : joinLinked(newHandler, currentHandlers),
                    //     handlersValueToSend,
                    // );

                    returnIntoFn(
                        currentHandlers.length
                            ? newHandler.concat(currentHandlers)
                            : newHandler,
                        handlersValueToSend,
                    );
                },
            );
        },
    };
    fn(
        // LL
        // [thisHandler, otherHandlers],
        otherHandlers ? [thisHandler].concat(otherHandlers) : [thisHandler],

        (handlers, fnsReturnValue) => {
            // do we always assume that "thisHandler" will be the final one? maybe? idk.
            // const idx = handlers.indexOf(thisHandler)
            // const nHandlers = idx === -1 ? handlers : handlers.slice();
            // if (idx !== -1) {
            //     nHandlers.splice(idx, 1)
            // }
            // fnsReturnPointer(nHandlers, fnsReturnValue)
            // STOPSHIP: waiiiit I thought I needed to filter here? 🤔
            // Try to construct a thing where we definitely need to filter here

            // fnsReturnPointer(handlers, fnsReturnValue);
            fnsReturnPointer(
                // LL
                // withoutItem(handlers, thisHandler),
                handlers.filter((h) => h !== thisHandler),
                fnsReturnValue,
            );
        },
    );
};

// Just for the eff paper 🙃
const isSquare = (x) => {
    const m = Math.sqrt(x);
    return Math.floor(m) === m;
};
const intToString = (x) => x.toString();

const assert = (x) => {
    if (!x) {
        throw new Error(`Assertion error.`);
    }
    return x;
};

const assertEqual = (a, b) => {
    if (a != b) {
        throw new Error(`Assertion error. ${a} should equal ${b}`);
    }
    console.log(`✅ Passed`);
    return true;
};

export { log, isSquare, intToString, handleSimpleShallow2 };
export { raise, assert, assertEqual };
export { joinLinked, withoutItem, extractItem, LinkedList };
