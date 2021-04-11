import { Location, nullLocation } from '../parsing/parser';
import {
    LocatedError,
    MismatchedArgument,
    MismatchedTypeVbl,
    RefMismatch,
    TypeError,
    TypeMismatch,
    VarMismatch,
    WrongEffects,
} from './errors';
import {
    effectsMatch,
    Env,
    LambdaType,
    refsEqual,
    symbolsEqual,
    Type,
    TypeReference,
    TypeVar,
} from './types';

export const isType = (env: Env, found: Type, expected: Type) =>
    getTypeError(env, found, expected, nullLocation) == null;

export const getTypeError = (
    env: Env,
    found: Type,
    expected: Type,
    location: Location,
): TypeError | null => {
    if (found.type !== expected.type) {
        return new TypeMismatch(env, found, expected, location);
    } else if (found.type === 'var') {
        const e = expected as TypeVar;
        if (!symbolsEqual(found.sym, e.sym)) {
            console.log(env.local.tmpTypeVbls);
            console.log(env.local.typeVbls);
            console.log(env.local.typeVblNames);
            return new VarMismatch(env, found.sym, e.sym, location);
        }
        return null;
    } else if (found.type === 'ref') {
        const e = expected as TypeReference;
        // ok folks, we need to handle `self`s correctly.
        // basically,
        // when we're getting types from an enum
        // or a defn
        // we need to swap them out.
        // oh yeah that's the good stuff.
        if (!refsEqual(found.ref, e.ref)) {
            return new RefMismatch(env, found.ref, e.ref, location);
        }
        if (found.typeVbls.length !== e.typeVbls.length) {
            return new LocatedError(
                location,
                `Different number of type variables: found ${found.typeVbls.length}, expected ${e.typeVbls.length}`,
            ).wrapped(new TypeMismatch(env, found, expected, location));
        }
        for (let i = 0; i < found.typeVbls.length; i++) {
            const err = getTypeError(
                env,
                found.typeVbls[i],
                e.typeVbls[i],
                location,
            );
            // TODO: do this better
            if (err !== null) {
                return err.wrapped(
                    new MismatchedTypeVbl(env, i, found, expected, location),
                );
            }
        }

        if (!effectsMatch(found.effectVbls, e.effectVbls)) {
            return new WrongEffects(
                found.effectVbls,
                e.effectVbls,
                env,
                location,
            ).wrapped(new TypeMismatch(env, found, expected, location));
        }
        return null;
    } else if (found.type === 'lambda') {
        const e = expected as LambdaType;
        if (found.args.length !== e.args.length) {
            return new LocatedError(
                location,
                `Different number of arguments: found ${found.args.length}, expected ${e.args.length}`,
            ).wrapped(new TypeMismatch(env, found, expected, location));
        }
        for (let i = 0; i < found.args.length; i++) {
            const err = getTypeError(env, found.args[i], e.args[i], location);
            if (err !== null) {
                return err.wrapped(new MismatchedArgument(i, found, e));
            }
        }
        if (found.typeVbls.length !== e.typeVbls.length) {
            return new LocatedError(
                location,
                `Different number of type variables`,
            );
        }
        // for (let i=0; i<found.typeVbls.length; i++) {
        //     const err = getTypeError(env, found.typeVbls[i], e.typeVbls[i], location)
        //     // TODO: do this better
        //     if (err !== null) {
        //         return err.wrapped(new MismatchedTypeVbl(env, i, found, expected, location))
        //     }
        // }
        if (!effectsMatch(found.effects, e.effects)) {
            return new WrongEffects(
                found.effects,
                e.effects,
                env,
                location,
            ).wrapped(new TypeMismatch(env, found, expected, location));
        }
        const res = getTypeError(env, found.res, e.res, location);
        if (res != null) {
            return res.wrapped(new TypeMismatch(env, found, e, location));
        }
        return null;
    }

    return null;
};
