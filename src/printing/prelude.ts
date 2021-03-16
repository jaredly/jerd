const log = console.log;

const raise = (
    handlers: Array<Handler>,
    hash: string,
    idx: number,
    args: any,
    done: (handlers: Array<Handler>, result: any) => void,
): void => {
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

                    const keep = currentHandlers.filter(
                        (k) => !newHandler.includes(k),
                    );
                    // OK FOLKS: in some cases, there is something from currentHandlers
                    // that we need to keep. In many cases, there is not.
                    // It seems like I should be able to engineer things such that
                    // I never have to keep any.

                    returnIntoFn(
                        keep.length ? newHandler.concat(keep) : newHandler,
                        handlersValueToSend,
                    );
                },
            );
        },
    };
    fn(
        otherHandlers ? [thisHandler].concat(otherHandlers) : [thisHandler],

        (handlers, fnsReturnValue) => {
            const idx = handlers.indexOf(thisHandler);
            const without = idx === -1 ? handlers : handlers.slice();
            if (idx !== -1) {
                without.splice(idx, 1);
            }
            fnsReturnPointer(without, fnsReturnValue);
        },
    );
};

// Just for the eff paper 🙃
const isSquare = (x: number) => {
    const m = Math.sqrt(x);
    return Math.floor(m) === m;
};
const intToString = (x: number) => x.toString();

const assert = (x: boolean) => {
    if (!x) {
        throw new Error(`Assertion error.`);
    }
    return x;
};

const assertEqual = <T>(a: T, b: T) => {
    if (a != b) {
        throw new Error(`Assertion error. ${a} should equal ${b}`);
    }
    console.log(`✅ Passed`);
    return true;
};

// When a pure function is used in a place that's expecting CPS.
const pureCPS = (f: any) => {
    let res;
    f([], (_: any, v: any) => (res = v));
    return res;
};

export const pow = Math.pow;
export const ln = Math.log;
export const PI = Math.PI;
export const TAU = Math.PI * 2;
export const sqrt = Math.sqrt;
export const max = Math.max;
export const min = Math.min;

export const sin = Math.sin;
export const cos = Math.cos;
export const tan = Math.tan;
export const asin = Math.asin;
export const acos = Math.acos;
export const atan = Math.atan;
export const atan2 = Math.atan2;

export { log, isSquare, intToString, handleSimpleShallow2 };
export { raise, assert, assertEqual, pureCPS };
