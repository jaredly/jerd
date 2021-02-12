// um

// ok this has the double-pure issue.
// What really is k?
// Should the pure function receive a K to put things?
// I think it probably should?
// Yeah because if the pure function wants to do anything
// effecty... it would need that.
const handle = (handlers, key, handler, pure, f, kont) => {
    let triggered = false;
    f(
        {
            ...handlers,
            [key]: (eff, _, k) => {
                if (triggered) {
                    throw new Error('handler called twice');
                }
                triggered = true;
                // hrm do I need this? or is the handler's kont that I was missing?
                // no I don't think that's what it was.
                if (eff.type === 'pure') {
                    pure(eff.value, kont);
                } else {
                    handler(eff.value, (handlers, result, newk) => {
                        triggered = newk;
                        k(handlers, result);
                    });
                }
            },
        },
        (_handlers, v) => {
            if (triggered) {
                triggered(v); // "resume" the handler's continuation
            } else {
                // um then what do I do here?
                pure(v, kont);
            }
        },
    );
};

// ok so the deal is, that if we make it to the end, then we say
// ok handle pure, thanks
// where the continuation of the pure handler is the top handler
// ummmm I wonder what would happen if I did the "fn" version instead?
// but like hm. yes? ok.

const call = (handlers, effect, arg, k) => {
    if (!handlers[effect]) {
        throw new Error('no handlers for ' + effect);
    }
    handlers[effect]({ type: 'eff', value: arg }, handlers, k);
};

const printA = (handlers, k) => {
    call(handlers, 'print', 'A', (handlers) => k(handlers, undefined));
};

const onPrint = (record, f, handlers = {}, k) => {
    handle(
        handlers,
        'print',
        (v, ki) => {
            record(v);
            k(handlers, ki);
        },
        (res, k) => {
            k(['pure', res]);
        },
        f,
        (v) => k(['final', ...v]),
    );
};

/* OK I think this is the part that's weirding me out.
Why do handlers expect to be able to access the return value
of the continuation?
Where in the sequence did they splice themselves into?
but
somehow it does seem to be the case
that it works?
or ... something.

def x(): y()
def y(): z()
def z(): raise(get) + 2 + m()
def m(): 21

def h(x):
    res = handle x with
        {get -> k} [k(5), 4]
        { a } -> [a, 2]
    [res, 1]

h(m)
    h -> res -> (handle) -> m
    h <- res <-{ pure } <-
[[21, 2], 1]

h
    res
        handle
            x
                y
                    z
                        raise(get)
            k(5)
                        5 + 2 + 21
                    28
                28
            28
            jump back to k(5)
        [28, 4]
        

h(x)
    h -> res -> (handle) -!!!> x -> y -> z -> raise(get)
                {get->k}
                ok, so what's needed is a check
                when we pass the continuation to the deal
                and say "if we get here, and you've already been
                called, then don't go the pure route, go whatever route
                we set up in the handler?
                yeah ok I think I have an idea?

                yeah so at the !!!, we get there and we might need to
                switch tracks.
                back to the handler's continuation

                so, like
*/

const recording = (kind, f, handlers, k) => {
    handle(
        handlers,
        kind,
        (v, ki) => {
            // recording(
            //     'print',
            //     // yeah we wouldn't be going to the end of this one
            //     // because we're resuming another one. that checks out.
            //     (h, k_) => ki(h, ['called', kind, v], k_),
            //     handlers,
            //     k,
            // );
            ki(handlers, ['called', kind, v], k);
            // k(handlers, ['called', kind, v]);
        },
        (v, k) => k(handlers, ['pure', v]),
        f,
        k,
    );
};

const cps = (f) => {
    let res;
    f((_, r) => {
        if (res != undefined) {
            throw new Error('cps continued multiple times');
        }
        res = r;
    });
    return res;
};

describe('Handle', () => {
    it('recording: noop', () => {
        expect(
            cps((k) => recording('print', (h, k) => k(h, 'hello'), {}, k)),
        ).toEqual(['pure', 'hello']);
    });

    it.only('recording: call', () => {
        expect(
            cps((k) =>
                recording(
                    'print',
                    (h, k) => {
                        call(h, 'print', 'Hello', (h, v) => k(['got', ...v]));
                    },
                    {},
                    k,
                ),
            ),
        ).toEqual(['called', 'print', 'Hello']);
    });

    it('recording: twice', () => {
        expect(
            cps((k) =>
                recording(
                    'print',
                    (h, k) => {
                        call(h, 'print', 'Hello', (h, v1) => {
                            call(h, 'print', 'Mello', (h, v2) => {
                                k(['got', ...v1, '2', ...v2]);
                            });
                        });
                    },
                    {},
                    k,
                ),
            ),
        ).toEqual(['wat', 'print', 'Hello']);
    });

    it('should call pure if nothing else', () => {
        let called = false;
        let finalCall = false;
        handle(
            {},
            'print',
            (_, __, ___) => {},
            (_, k) => {
                called = true;
                k();
            },
            (h, k) => k(h, null),
            () => {
                finalCall = true;
            },
        );
        expect(called).toBeTruthy();
        expect(finalCall).toBeTruthy();
    });

    it('should not call pure something was handled', () => {
        let called = false;
        let pure = false;
        let finalCall = false;
        handle(
            {},
            'print',
            (_, __, k) => {
                called = true;
                k({});
            },
            (_, k) => {
                pure = true;
                k();
            },
            (h, k) => call(h, 'print', 'yo', k),
            () => {
                finalCall = true;
            },
        );
        expect(called).toBeTruthy();
        expect(finalCall).toBeTruthy();
        expect(pure).toBeFalsy();
    });

    it('should not call pure something was handled', () => {
        let called = false;
        let pure = false;
        let finalCall = false;
        handle(
            {},
            'print',
            (_, __, k) => {
                called = true;
                k({});
            },
            (_, k) => {
                pure = true;
                k();
            },
            (h, k) => call(h, 'print', 'yo', k),
            () => {
                finalCall = true;
            },
        );
        expect(called).toBeTruthy();
        expect(finalCall).toBeTruthy();
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
