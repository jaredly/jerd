import { AsSuffix } from '../../parsing/parser';
import { idFromName, idName, symPrefix } from '../env';
import { LocatedError } from '../errors';
import { getTypeError } from '../getTypeError';
import { pureFunction } from '../preset';
import { Env, Location, Term, Type, UserReference } from '../types';
import typeType from '../typeType';
import { showType } from '../unify';

export const asRecord: UserReference = {
    type: 'user',
    id: { hash: 'As', pos: 0, size: 1 },
};

export const findAs = (
    env: Env,
    goalType: Type,
    // stype: Type,
    // ttype: Type,
    location: Location,
): UserReference | null => {
    // const goalType: Type = {
    //     type: 'ref',
    //     ref: asRecord,
    //     typeVbls: [stype, ttype],
    //     // effectVbls: [],
    //     location,
    // };
    let found = null;
    Object.keys(env.global.terms).some((k) => {
        const t = env.global.terms[k];
        if (getTypeError(env, goalType, t.is, location) == null) {
            found = idFromName(k);
            return true;
        } else if (
            t.type === 'ref' &&
            t.ref.type === 'user' &&
            t.ref.id.hash === 'As'
        ) {
            console.log('got the as', t);
        }
    });
    if (found == null) {
        return null;
    }
    return { type: 'user', id: found };
};

export const asType = (
    fromType: Type,
    toType: Type,
    location: Location,
): Type => ({
    type: 'ref',
    ref: asRecord,
    typeVbls: [fromType, toType],
    // effectVbls: [],
    location: location,
});

export const typeAs = (env: Env, target: Term, suffix: AsSuffix): Term => {
    const ttype = typeType(env, suffix.t);
    const stype = target.is;
    // Look for an `As` that fits!
    const goalType = asType(stype, ttype, target.location);
    let foundImpl: Term;
    if (suffix.hash != null) {
        if (suffix.hash.startsWith(symPrefix)) {
            const symNum = +suffix.hash.slice(symPrefix.length);
            const local = env.local.locals[symNum];
            if (!local) {
                throw new LocatedError(
                    suffix.location,
                    `No symbol ${suffix.hash}`,
                );
            }
            const err = getTypeError(
                env,
                local.type,
                goalType,
                suffix.location,
            );
            if (err != null) {
                throw err;
            }
            foundImpl = {
                type: 'var',
                sym: local.sym,
                location: suffix.location,
                is: local.type,
            };
        } else {
            let rawId = suffix.hash.slice(1);
            if (env.global.idRemap[rawId]) {
                rawId = idName(env.global.idRemap[rawId]);
            }
            const t = env.global.terms[rawId];
            if (!t) {
                throw new LocatedError(
                    suffix.location,
                    `Unknown term ${rawId}`,
                );
            }
            const err = getTypeError(env, t.is, goalType, suffix.location);
            if (err != null) {
                throw err;
            }
            foundImpl = {
                type: 'ref',
                ref: {
                    type: 'user',
                    id: idFromName(suffix.hash.slice(1)),
                },
                is: t.is,
                location: suffix.location,
            };
        }
    } else {
        const ref = findAs(env, goalType, suffix.location);
        if (ref == null) {
            // STOPSHIP: make a "type error" node type.
            // repls and stuff can allow compiling with them,
            // but if you want to actually compile a runnable thing,
            // it won't let you.
            throw new Error(
                `No impl found for as ${showType(env, stype)} (as) ${showType(
                    env,
                    ttype,
                )}`,
            );
        }

        foundImpl = {
            type: 'ref',
            ref,
            is: goalType,
            location: target.location,
        };
    }
    return {
        type: 'apply',
        args: [target],
        hadAllVariableEffects: false,
        target: {
            type: 'Attribute',
            target: foundImpl,
            idx: 0,
            ref: asRecord,
            location: target.location,
            idLocation: target.location,
            refTypeVbls:
                target.is.type === 'ref' && target.is.typeVbls.length
                    ? target.is.typeVbls
                    : undefined,
            inferred: true,
            is: pureFunction([stype], ttype),
        },
        typeVbls: [],
        effectVbls: null,
        is: ttype,
        location: target.location,
    };
};
