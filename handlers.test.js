// ok this has the double-pure issue.
// What really is k?
// Should the pure function receive a K to put things?
// I think it probably should?
// Yeah because if the pure function wants to do anything
// effecty... it would need that.
const handle = (handlers, key, handler, kont, f) => {
    f({ ...handlers, [key]: handler }, (_handlers, v) => {
        // it shouldn't be the inner handlers, right?
        kont(handlers, v);
    });
};

const call = (handlers, effect, arg, k) => {
    handlers[effect](arg, k);
};

const printA = (handlers, k) => {
    call(handlers, 'print', 'A', (handlers) => k(handlers, undefined));
};

describe('Handle', () => {
    it('should call pure if nothing else', () => {
        let called = false;
        handle(
            {},
            'print',
            (_, __) => {},
            () => (called = true),
            (h, k) => k(h, null),
        );
        expect(called).toBeTruthy();
    });

    it('should not call pure something was handled', () => {
        let called = false;
        let pure = false;
        handle(
            {},
            'print',
            (_, k) => {
                called = true;
                k({});
            },
            () => (pure = true),
            (h, k) => call(h, 'print', 'yo', k),
        );
        expect(called).toBeTruthy();
        expect(pure).toBeFalsy();
    });

    // ohh yeah I need to be maintaining a full stack of pures.
    // and then remove that pure when this is handled?
    // is that it?
    it('should work and finish with pure', () => {
        // let arg = false
        // handle({}, 'print', (a, k) => {arg = a}))
    });
});
