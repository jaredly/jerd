// umm ok

const choose = (a, b, handlers, k) => {
    return handlers.decide((v) => k(v ? a : b));
};

const chooseDiff = (handlers, k) => {
    return choose(15, 30, handlers, (x) => {
        console.log('first choose', x);
        return choose(5, 10, handlers, (y) => {
            console.log('second choose', x, y);
            return k(x - y);
        });
    });
};

const pickMax = (i, f) => {
    return f(
        {
            decide: (k) => {
                const t = pickMax(i + 10, (handlers, k2) => k2(k(true)));
                console.log(i, 't', t);
                const f = pickMax(i + 11, (handlers, k2) => k2(k(false)));
                console.log(i, 'f', f);
                console.log(i, 'checking', t, f);
                return Math.max(t, f);
            },
        },
        (x) => x,
    );
};

console.log(pickMax(0, chooseDiff));
