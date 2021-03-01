// ok

// This is a function that allows you to handle
// effects of type `{ eff () -> Get }` and a function
// of type `() -> R` (written in direct, non-CPS style)
const handleSimple = <Get, R>(
    fn: (
        handler: (returnIntoFn: (value: Get) => void) => void,
        cb: (fnReturnValue: R) => void,
    ) => void,
    handleEffect: (
        cb: (
            gotten: Get,
            returnIntoHandler: (fnReturnValue: R) => void,
        ) => void,
    ) => void,
    handlePure: (fnReturnValue: R) => void,
) => {
    let fnsReturnPointer = handlePure;
    fn(
        (returnIntoFn) => {
            handleEffect((handlersValueToSend, returnIntoHandler) => {
                fnsReturnPointer = returnIntoHandler;
                returnIntoFn(handlersValueToSend);
            });
        },
        (fnsReturnValue) => fnsReturnPointer(fnsReturnValue),
    );
};

describe('handleSimple', () => {
    it('should work', () => {
        const x = (currentHandler, done) => z(currentHandler, (r) => done(r));
        const z = (currentHandler, done) => currentHandler((v) => done(v + 2));
        const m = (_currentHandler, done) => done(21);

        const myHandler = (fn, done) => {
            handleSimple(
                fn,
                (resumeExecution) =>
                    resumeExecution(5, (finalExecutionValue) =>
                        done([finalExecutionValue, 'handled']),
                    ),
                (pureValue) => done([pureValue, 'pure']),
            );
        };

        const k = jest.fn();
        myHandler(m, k);
        expect(k).toBeCalledWith([21, 'pure']);

        const k2 = jest.fn();
        myHandler(x, k2);
        expect(k2).toBeCalledWith([7, 'handled']);
    });
});

// This is a function that allows you to handle
// effects of type `{ eff () -> R }`
const handleBidirectional = <Get, Set, R>(
    fn: (
        handler: (toSet: Set, returnIntoFn: (value: Get) => void) => void,
        cb: (fnReturnValue: R) => void,
    ) => void,
    handleEffect: (
        toSet: Set,
        cb: (
            gotten: Get,
            returnIntoHandler: (fnReturnValue: R) => void,
        ) => void,
    ) => void,
    handlePure: (fnReturnValue: R) => void,
) => {
    let fnsReturnPointer = handlePure;
    fn(
        (toSet, returnIntoFn) => {
            handleEffect(toSet, (handlersValueToSend, returnIntoHandler) => {
                fnsReturnPointer = returnIntoHandler;
                returnIntoFn(handlersValueToSend);
            });
        },
        (fnsReturnValue) => fnsReturnPointer(fnsReturnValue),
    );
};

describe('handleBidirectional', () => {
    it('should work', () => {
        const x = (currentHandler, done) => z(currentHandler, (r) => done(r));
        const z = (currentHandler, done) =>
            currentHandler(42, (v) => done([...v, 'z done']));
        const m = (_currentHandler, done) => done(21);

        const myTimes5 = (fn, done) => {
            handleBidirectional<Array<any>, number, Array<any>>(
                fn,
                (value, resumeExecution) =>
                    resumeExecution(
                        [5 * value, 'sent'],
                        (finalExecutionValue) =>
                            done([...finalExecutionValue, 'handled']),
                    ),
                (pureValue) => done([pureValue, 'pure']),
            );
        };

        const k = jest.fn();
        myTimes5(m, k);
        expect(k).toBeCalledWith([21, 'pure']);

        const k2 = jest.fn();
        myTimes5(x, k2);
        expect(k2).toBeCalledWith([210, 'sent', 'z done', 'handled']);
    });
});

type ShallowHandler<Get> = (
    returnIntoFn: (newHandler: ShallowHandler<Get>, value: Get) => void,
) => void;

// This is a function that allows you to handle
// effects of type `{ eff () -> Get }` and a function
// of type `() -> R` (written in direct, non-CPS style)
const handleSimpleShallow = <Get, R>(
    fn: (handler: ShallowHandler<Get>, cb: (fnReturnValue: R) => void) => void,
    handleEffect: (
        cb: (
            gotten: Get,
            newHandler: ShallowHandler<Get>,
            returnIntoHandler: (fnReturnValue: R) => void,
        ) => void,
    ) => void,
    handlePure: (fnReturnValue: R) => void,
) => {
    let fnsReturnPointer = handlePure;
    fn(
        (returnIntoFn) => {
            handleEffect(
                (handlersValueToSend, newHandler, returnIntoHandler) => {
                    fnsReturnPointer = returnIntoHandler;
                    returnIntoFn(newHandler, handlersValueToSend);
                },
            );
        },
        (fnsReturnValue) => fnsReturnPointer(fnsReturnValue),
    );
};

/*

effect Stdio {
    read: () => string,
    write: (string) => unit,
}

const respondWith = (responseValue: text) => (fn) => {
    handle! fn {
        Stdio.read(() => k) => k(text),
        Stdio.write((v) => k) => {
            log(v);
            k()
        },
    }
}

const test1 = () => {
    respondWith("hello")(() => {
        raise!(Stdio.read())
    })
}

*/

describe('handleSimpleShallow', () => {
    it('should work', () => {
        const x = (currentHandler, done) => z(currentHandler, (r) => done(r));
        const z = (currentHandler, done) =>
            currentHandler((newHandler, one) =>
                newHandler((_newNewHandler, two) =>
                    done(['one', one, 'two', two]),
                ),
            );

        const respondWith = (responseValue: number) => (
            fn: (
                currentHandler: ShallowHandler<number>,
                cb: (value: Array<any>) => void,
            ) => void,
            done: (res: Array<any>) => void,
        ) => {
            handleSimpleShallow(
                fn,
                (resumeExecution) =>
                    respondWith(responseValue + 5)(
                        (newHandler, innerDone) =>
                            resumeExecution(
                                responseValue,
                                newHandler,
                                (finalExecutionValue) =>
                                    innerDone([
                                        ...finalExecutionValue,
                                        'handled',
                                        responseValue,
                                    ]),
                            ),
                        done,
                    ),
                (pureValue) => done([pureValue, 'pure', responseValue]),
            );
        };

        const k = jest.fn();
        respondWith(10)(x, k);
        expect(k).toBeCalledWith([
            ['one', 10, 'two', 15, 'handled', 10, 'handled', 15],
            'pure',
            20,
        ]);
    });

    // um what do I mean? oh two different handlers
    it('double stack', () => {
        // print and get maybe
    });

    it('Store.get/set', () => {});
});

describe('multiple effects', () => {});
