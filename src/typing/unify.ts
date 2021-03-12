// Unify it all

import {
    effectsMatch,
    Env,
    Symbol,
    symbolsEqual,
    Term,
    Type,
    TypeConstraint,
    typesEqual,
    walkTerm,
} from './types';
import { walkType } from './typeType';
import { printToString } from '../printing/printer';
import { typeToPretty } from '../printing/printTsLike';
import { showLocation } from './typeExpr';
import { Location } from '../parsing/parser';

/*

Ok so what are the constraints on a type?
Theoretically, I think we're establishing upper & lower bounds ;)

also I don't remember much type theory

smallest bound = a concrete type
largest bound = ???

but like

uh

yeah I need some type theory I think

A) X smaller-than Y means "I found a var(x) when I expected a Y"
B) X larger-than  Y means "I found a Y      when I expected a var(y)"

What kinds of things can be found?
- concrete types (int, string, float, char, unit, non-generic user types)
- generic types (including list, record, enums etc.) with args
- a forall
- functions! Are these no different than generic types? I think so?

concrete types cannot be exchanged for each other.

if A.Y is a concrete type, var(x) must be exactly that concrete type.
if A.Y is a forall, var(x) must be forall as well
if A.Y is a generic type, var(x) must be that same type, and the args must also satisfy smaller-than

if B.Y is a concrete type, var(x) must be exactly that, or a forall
if B.Y is a generic type, var(x) must be ... exactly that, or a forall, and the args the same?

Like passing Array<int> to a fucntion expecting 'a is fine or Array<'a> or Array<int>

So, we need to check:
> do we have Upper bounds?
> if not, forall is fine, why not, right?

yeah I think so.

and smaller & larger-thans should be transitive.

So first pass:
- go through all the smaller-thans, go concrete
- then go through constraints and replace and vbls
- then go through again

so if you have (x, f) => f(x)




*/

const unifySimple = (
    env: Env,
    initialTypeVbls: { [unique: string]: Array<TypeConstraint> },
    // round = 0,
) => {
    const unified: { [unique: string]: Type } = {};
    // const typeVbls = { ...initialTypeVbls };
    for (let key of Object.keys(initialTypeVbls)) {
        unified[key] = initialTypeVbls[key].reduce(
            (a: Type | null, b) => unify(env, a, b),
            null,
        )!;
    }
    return unified;
};

const unifyInner = (
    env: Env,
    initialTypeVbls: { [unique: string]: Array<TypeConstraint> },
    // round = 0,
) => {
    const unified: { [unique: string]: Type } = {};
    const typeVbls = { ...initialTypeVbls };

    for (let round = 0; round < 10; round++) {
        // TODO detect loops
        for (let key of Object.keys(typeVbls)) {
            // If we have a 'larger-than' that's a function
            // it's really a smaller-than?
            // or like, we should treat it as such?
            // because the arg vbls will already be taken care of, right?
            // I think so.
            // let's try it.
            const smallers = typeVbls[key].filter(
                (c) => c.type === 'smaller-than' && c.other.type !== 'var',
                // (c.other.type !== 'var' ||
                //     unified[c.other.sym.unique] != null),
            );
            // .map((c) =>
            //     c.other.type === 'var'
            //         ? { ...c, other: unified[c.other.sym.unique] }
            //         : c,
            // );
            if (!smallers.length) {
                const largerFns = typeVbls[key].filter(
                    (c) =>
                        c.type === 'larger-than' && c.other.type === 'lambda',
                );
                if (largerFns.length > 0) {
                    // uh
                    unified[key] = largerFns[0].other;
                    delete typeVbls[key];
                }
                // oh for functions it'll be "larger-than" I guess?
                console.log(`maybe no constraints on ${key}`);
                continue;
            }
            // const sm0 = smallers[0].other;
            const final = smallers.reduce(
                (a: null | Type, b) => unify(env, a, b),
                null,
            )!;
            typeVbls[key].forEach((c) => {
                if (c.type === 'larger-than') {
                    if (fitsExpectation(null, c.other, final) !== true) {
                        throw new Error(`Unable to unify constraints`);
                    }
                }
            });
            unified[key] = final;
            delete typeVbls[key];

            // for (let constraint of typeVbls[key]) {
            //     // do a basic check
            //     // "int" can be "smaller than" a vbl ...
            //     // but it can't be "larger" than a vbl. Right?
            //     // or wait.
            //     // a => a + 2
            //     // a needs to be smaller than int
            //     // a starts as a vbl
            //     // manual type variables have a "forall" constraint.
            //     // a . a => a + 2
            //     // forall can't be smaller than int
            //     // ugh how do I hmmm
            //     // how do constraints work?
            //     // like
            // }
        }
        if (Object.keys(typeVbls).length === 0) {
            break;
        }
        Object.keys(typeVbls).forEach((key) => {
            const res = typeVbls[key].map((c) =>
                c.other.type === 'var' && unified[c.other.sym.unique]
                    ? unified[c.other.sym.unique]
                    : c,
            );
            typeVbls[key] = res as any;
        });
        // console.log(JSON.stringify(unified));
        // console.log(JSON.stringify(typeVbls));
        if (round >= 9) {
            console.log(JSON.stringify(typeVbls));
            console.log(JSON.stringify(unified));
            throw new Error(`Probably bad news in unification land.`);
        }
    }

    // for (let key of Object.keys(typeVbls)) {
    //     unified[key] = typeVbls[key].reduce(unify, null);
    // }

    return unified;
};

export const unifyVariables = (
    env: Env,
    typeVbls: {
        [unique: string]: Array<TypeConstraint>;
    },
) => {
    // const copy = {};
    // Object.keys(typeVbls).forEach((k) => (copy[k] = typeVbls[k].slice()));
    // const unified: { [key: string]: Type } = {};
    // console.log(JSON.stringify(typeVbls, null, 2));
    return unifySimple(env, typeVbls);
    // ok so if we have some constraints
    // and they go in multiple directions
    // uh maybe that's where constraint solvers come in?
    // am I gonna build a dumb constraint solver?

    // I guess one question is: can I reduce my thing to 3sat? if so, it's NP-hard
    // ok so basically, if I come to a loop, it needs to collapse, right?

    // the simplest would be:
    // make fitsExpectation indicate what kind of failure we're dealing with
    // if it's a "two vars" failure, wait until next round?
    // return unified;
};

export const unifyInTerm = (
    unified: { [key: string]: Type | null },
    term: Term,
) => {
    walkTerm(term, (term) => {
        const changed = walkType(term.is, (t: Type) => {
            if (t.type === 'var' && unified[t.sym.unique] != null) {
                return unified[t.sym.unique];
            }
            return null;
        });
        if (changed) {
            term.is = changed;
        }
    });
};

export const unifyInType = (
    unified: { [key: string]: Type | null },
    type: Type,
): Type | null => {
    return walkType(type, (t: Type) => {
        if (t.type === 'var' && unified[t.sym.unique] != null) {
            return unified[t.sym.unique];
        }
        return null;
    });
};

export const showType = (env: Env, t: Type): string =>
    printToString(typeToPretty(env, t), 100);

const unify = (
    env: Env,
    one: Type | null,
    constraint: TypeConstraint,
): Type => {
    if (one == null) {
        return constraint.other;
    }
    if (one.type === 'var') {
        if (constraint.other.type === 'var') {
            throw new Error('what to do with two vars');
        }
        return constraint.other;
    }
    if (constraint.other.type === 'var') {
        return one;
    }
    // TODO functions with args that are vars will die.
    // or rather, they need to be updated.
    if (constraint.type === 'larger-than') {
        if (fitsExpectation(null, constraint.other, one) !== true) {
            throw new Error(
                `Unification error folks larger ${showType(
                    env,
                    one,
                )} : ${showType(env, constraint.other)}`,
            );
        }
    } else {
        if (fitsExpectation(null, one, constraint.other) !== true) {
            throw new Error(
                `Unification error folks smaller ${showType(
                    env,
                    one,
                )} : ${showType(env, constraint.other)}`,
            );
        }
    }
    return one;
};

type UnificationResult = true | false | Symbol;

export const assertFits = (
    env: Env,
    t: Type,
    expected: Type,
    location?: Location | null,
) => {
    if (fitsExpectation(env, t, expected) !== true) {
        throw new Error(
            `Type error, expected ${showType(env, expected)}, found ${showType(
                env,
                t,
            )} at ${showLocation(location || t.location)}`,
        );
    }
};

// `t` is being passed as an argument to a function that expects `target`.
// Is it valid?
export const fitsExpectation = (
    env: Env | null,
    t: Type,
    target: Type,
): UnificationResult => {
    if (t.type === 'var' && env != null) {
        // if (env.local.typeVbls[])
        if (typesEqual(t, target)) {
            return true;
        }
        // if (target.type === 'var')
        if (!env.local.tmpTypeVbls[t.sym.unique]) {
            throw new Error(
                `Explicit type variable ${t.sym.name}#${
                    t.sym.unique
                } can't unify with ${showType(env, target)} - ${showLocation(
                    t.location,
                )} : ${showLocation(target.location)}`,
            );
        }
        env.local.tmpTypeVbls[t.sym.unique].push({
            type: 'smaller-than',
            other: target,
        });
        // TODO check if it's obviously broken
        return true;
    }
    if (target.type === 'var' && env != null) {
        if (!env.local.tmpTypeVbls[target.sym.unique]) {
            throw new Error(
                `Unable to unify ${showType(env, t)} ${showLocation(
                    t.location,
                )} with type variable ${target.sym.name}#${
                    target.sym.unique
                } ${showLocation(target.location)}`,
            );
        }
        env.local.tmpTypeVbls[target.sym.unique].push({
            type: 'larger-than',
            other: t,
        });
        // TODO check if it's obviously broken
        return true;
    }
    if (t.type !== target.type) {
        // um there's a chance we'd need to resolve something? maybe?
        return false;
    }
    switch (t.type) {
        case 'var':
            if (target.type === 'var') {
                if (!symbolsEqual(t.sym, target.sym)) {
                    return target.sym;
                }
                return true;
            }
            console.log('env is null I guess');
            return false;
        case 'ref':
            return typesEqual(t, target);
        case 'lambda':
            if (target.type !== 'lambda') {
                return false;
            }
            // unless there's optional arguments going on here, stay tuned?
            // I guess. maybe.
            if (target.args.length !== t.args.length) {
                console.log('arglen');
                return false;
            }
            const res = fitsExpectation(env, t.res, target.res);
            if (res !== true) {
                console.log('resoff', t.res, target.res);
                return res;
            }
            // Is target allowed to have more, or fewer effects than t?
            // more. t's effects list must be a strict subset.
            if (!effectsMatch(target.effects, t.effects, true)) {
                throw new Error(
                    `Unexpected argument effect: ${showLocation(
                        target.location,
                    )} - ${showLocation(t.location)}`,
                );
            }
            // t.effects.forEach((e) => {
            //     if (!target.effects.some((ef) => refsEqual(ef, e))) {
            //         throw new Error(
            //             `Argument has effect ${JSON.stringify(
            //                 e,
            //             )}, which was not expected.`,
            //         );
            //     }
            // });
            for (let i = 0; i < t.args.length; i++) {
                const arg = fitsExpectation(env, t.args[i], target.args[i]);
                if (arg !== true) {
                    console.log('Arg is off', i);
                    console.log(t.args[i], target.args[i]);
                    return arg;
                }
            }
            return true;
    }
};
