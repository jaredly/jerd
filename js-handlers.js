// umm ok

// const handle = (key, handler, pure, f, handlers, k) => {
// }

// Hmm I maybe don't want the shallow handlers?
// Like, the "always-on" might be better... although not sure if I'll deal with continuations correctly.

`

(define (logger f)
    (handle! f
        (print x => k) =>
            (begin
                (console.log x)
                (logger k))
        x => x))

(define (reverse f)
    (handle! f
        (print x => k) =>
            (let [res (reverse k)]
                (raise! (print x))
                res)
        x => x))

(define (concat f)
    (handle! f
        (print x => k) =>
            (let [(res, acc) (concat k)]
                (res, (cons x acc)))
        x => (x, [])))
`;

// ok this has the double-pure issue.
// What really is k?
// Should the pure function receive a K to put things?
// I think it probably should?
// Yeah because if the pure function wants to do anything
// effecty... it would need that.
const handle = (handlers, key, handler, pure, f) => {
    f({ ...handlers, [key]: handler, pure }, (handlers, v) => {
        handlers.pure(handlers, v);
    });
};

const abc = (handlers, k) => {
    handlers.print('A', (handlers) => {
        handlers.print('B', (handlers) => {
            console.log('final k', k + '');
            handlers.print('C', k);
        });
    });
};

const concat = (f, i = 0) => {
    let res;
    handle(
        {},
        'print',
        (x, k) => {
            console.log(i, 'here we are', x, k + '');
            let [r, acc] = concat(k, i + 1);
            res = [r, [x, ...acc]];
        },
        (_, x) => {
            res = [x, []];
        },
        f,
    );
    console.log(i, 'done', res);
    return res;
};

// what if I don't do returns?
// what if I just do assigning of a variable in the final place?
// and then return that?
// because, as I covered, if we've encapsulated all effects,
// runtime is guarenteed to be synchronous. that's the whole deal.
// right?
// I'm ... pretty sure.
// I just need to make sure that re-entrance only happens when I want it to
// and in the actually async case, returns are meaningless.
const reverse = (f, handlers, kont) => {
    handle(
        handlers,
        'print',
        (x, k) => {
            // hrm should the handlers come through here?
            // otherwise we are doing the "shallow" thing. hm.
            reverse(k, handlers, (_innerHandlers, res) => {
                handlers.print(x, (_innermostHandlers) => {
                    // oh hm are we oh yeah pure needs a continuation?
                    kont(handlers, res);
                });
            });
        },
        (handlers, x) => kont(handlers, x),
        f,
        // kont,
    );
};

const logger = (f) => {
    // we shouldn't be continuing the toplevel one multiple times.
    handle(
        {},
        'print',
        (x, k) => {
            console.log(x);
            logger(k);
        },
        (x) => x,
        f,
    );
};

logger((handlers, k) => reverse(abc, handlers, k));
console.log(concat(abc));
// console.log(concat((handlers, k) => reverse(abc, handlers, k)));

`
(define (choose a b)
    (if (decide)
        a
        b)

(define (chooseDiff)
    (let [x (choose 15 30)
          y (choose 5 10)]
        (- x y)))

(define (pickMax f)
    (handle! f
        (decide () => k) =>
            (let [t (pickMax '(k true))
                  f (pickMax '(k false))]
                (max t f))
        x => x))

(define test (pickMax chooseDiff))
`;

const choose = (a, b, handlers, k) => {
    return handlers.decide((handlers, v) => k(handlers, v ? a : b));
};

const chooseDiff = (handlers, k) => {
    return choose(15, 30, handlers, function chooseDiffK0(handlers, x) {
        console.log('first choose', x, handlers.i);
        return choose(5, 10, handlers, function chooseDiffK1(handlers, y) {
            console.log('second choose', x, y, handlers.i);
            return k(handlers, x - y);
        });
    });
};

const pickMax = (i, f) => {
    return handle(
        {},
        'decide',
        (k) => {
            const t = pickMax(i + 10, (handlers, k2) =>
                k2(handlers, k(handlers, true)),
            );
            console.log(i, 't', t);
            const f = pickMax(i + 12, (handlers, k2) =>
                k2(handlers, k(handlers, false)),
            );
            console.log(i, 'f', f);
            console.log(i, 'checking', t, f);
            return Math.max(t, f);
        },
        (x) => {
            console.log('pure', i, x);
            return x;
        },
        f,
    );

    // return f(
    //     {
    //         i,
    //         decide: (k) => {
    //         },
    //         pure: (v) => {
    //             console.log('pure', i, v);
    //             console.log(new Error().stack);
    //             // this is where we'd do the outer K I think? or no maybe not
    //             // return k(v)
    //             return v;
    //         },
    //     },
    //     function pickMaxK(handlers, x) {
    //         // this way we jump ... out ... hm.
    //         // yeah the kt(k(true)) // is double-jumping us.
    //         return handlers.pure(x);
    //     },
    // );
};

// Ok yeah so I've got some confusion. Let's try another example.

// console.log(pickMax(0, chooseDiff));
