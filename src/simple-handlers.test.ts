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

describe('ok', () => {
    it('simple "get" handler', () => {
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

    it('bidirectional, love it', () => {
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

    // it('handle multiple by recursion', () => {
    //     const x = (h, k) => y(h, (r) => k(r));
    //     const y = (h, k) => z(h, (r) => k(r));
    //     const z = (h, k) =>
    //         // first get
    //         h((v) => {
    //             m(h, (r) =>
    //                 // second get
    //                 h((v2) => k(v + v2 + r)),
    //             );
    //         });
    //     const m = (h, k) => k(21);

    //     const h = (n) => (x, k) => {
    //         handleSimple(
    //             x,
    //             // first handle
    //             (ki) =>
    //                 /*
    //             (get () -> k) =>
    //                 handle [(k n), m, 4] with h(n * 10)
    //             */
    //                 h(n * 10)((h, k) => ki(n, (r) => k([r, n, 'handled'])), k),
    //             (a) => k([a, 'pure', n]),
    //         );
    //     };

    //     const k2 = jest.fn();
    //     h(5)(x, k2);
    //     expect(k2).toBeCalledTimes(1);
    //     expect(k2).toBeCalledWith([28, 4]);
    // });

    it('double stack', () => {
        // print and get maybe
    });

    it('Store.get/set', () => {});
});
