// ok

const handleSimple = (fn, handleEffect, handlePure) => {
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

describe('ok', () => {
    it('lets go', () => {
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
