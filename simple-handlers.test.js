const handle = (fn, handler, pure) => {
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
            handle(
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
});
