const log = console.log;
const raise = (handlers, hash, idx, args, done) => {
    // Linked list it up!!

    // let prev: LinkedList<Handler> = null;
    // while (handlers != null) {
    //     // OOOOooohhhhhh should I modify "done"?
    //     // Like, reattach the prev at that point???
    //     // maybe.
    //     if (handlers[0].hash !== hash) {
    //         prev = [handlers[0], prev];
    //         handlers = handlers[1];
    //         continue;
    //     }

    //     const handler = handlers[0];
    //     let otherHandlers = handlers[1];
    //     // Recreate the top of the stack
    //     while (prev != null) {
    //         otherHandlers = [prev[0], otherHandlers];
    //         prev = prev[1];
    //     }
    //     handler.fn(otherHandlers, idx, args, done);
    // }
    // throw new Error('effect not handled');

    // console.log('Raise!', hash, args);
    // for (let i = 0; i < handlers.length; i++) {
    for (let i = handlers.length - 1; i >= 0; i--) {
        if (handlers[i].hash === hash) {
            const otherHandlers = handlers.slice();
            otherHandlers.splice(i, 1);
            handlers[i].fn(otherHandlers, idx, args, done);
            break;
        }
    }
};
type LinkedList<T> = null | [T, LinkedList<T>];

type Handler = { hash: string; fn: ShallowHandler<any, any> };

// type Handlers = LinkedList<Handler>;
type Handlers = Array<Handler>;

type ShallowHandler<Get, Set> = (
    currentHandlers: Handlers,
    idx: number,
    args: Set,
    returnIntoFn: (newHandler: Handlers, value: Get) => void,
) => void;

const joinLinked = (head, tail) => {
    if (head == null) {
        return tail;
    }
    if (tail == null) {
        return head;
    }
    const top = [head[0], null];
    let current = top;
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

                    // LL returnIntoFn(
                    //     currentHandlers == null
                    //         ? newHandler
                    //         : joinLinked(newHandler, currentHandlers),
                    //     handlersValueToSend,
                    // );

                    returnIntoFn(
                        // currentHandlers.length
                        //     ? newHandler.concat(currentHandlers)
                        //     : newHandler,
                        currentHandlers.concat(newHandler),
                        handlersValueToSend,
                    );
                    // returnIntoFn(currentHandlers.concat(newHandler).filter(h => h !== thisHandler), handlersValueToSend);
                },
            );
        },
    };
    fn(
        // LL: [thisHandler, otherHandlers],
        // otherHandlers ? [thisHandler].concat(otherHandlers) : [thisHandler],
        otherHandlers ? otherHandlers.concat([thisHandler]) : [thisHandler],
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
    return true;
};

export { log, isSquare, intToString, handleSimpleShallow2 };
export { raise, assert, assertEqual };
