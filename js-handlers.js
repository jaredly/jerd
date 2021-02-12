// umm ok

const choose = (a, b, handlers, k) => {
    return handlers.decide((handlers, v) => k(handlers, v ? a : b));
};

const chooseDiff = (handlers, k) => {
    return choose(15, 30, handlers, (handlers, x) => {
        console.log('first choose', x, handlers.i);
        return choose(5, 10, handlers, (handlers, y) => {
            console.log('second choose', x, y, handlers.i);
            return k(handlers, x - y);
        });
    });
};

const pickMax = (i, f) => {
    return f(
        {
            i,
            decide: (k) => {
                const t = pickMax(i + 10, (handlers, k2) =>
                    k2(handlers, k(handlers, true)),
                );
                console.log(i, 't', t);
                const f = pickMax(i + 11, (handlers, k2) =>
                    k2(handlers, k(handlers, false)),
                );
                console.log(i, 'f', f);
                console.log(i, 'checking', t, f);
                return Math.max(t, f);
            },
        },
        (_, x) => {
            console.log('pure', i, x);
            return x;
        },
    );
};

console.log(pickMax(0, chooseDiff));
