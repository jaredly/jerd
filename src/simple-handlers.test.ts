// ok

const handleSimple = (fn, handler, pure) => {
    let kont = pure;
    fn(
        (backk) => {
            handler((v, newk) => {
                kont = newk;
                backk(v);
            });
        },
        (res) => kont(res),
    );
};

describe('ok', () => {
    it('lets go', () => {
        const x = (h, k) => y(h, (r) => k(r));
        const y = (h, k) => z(h, (r) => k(r));
        const z = (h, k) => h((v) => m(h, (r) => k(v + 2 + r)));
        const m = (h, k) => k(21);

        const h = (x, k) => {
            handleSimple(
                x,
                (ki) => ki(5, (r) => k([r, 4])),
                (a) => k([a, 2]),
            );
        };

        const k = jest.fn();
        h(m, k);
        expect(k).toBeCalledWith([21, 2]);

        const k2 = jest.fn();
        h(x, k2);
        expect(k2).toBeCalledWith([28, 4]);
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
