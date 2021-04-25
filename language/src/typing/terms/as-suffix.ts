import { AsSuffix } from '../../parsing/parser';
import { idFromName, symPrefix } from '../env';
import { LocatedError } from '../errors';
import { getTypeError } from '../getTypeError';
import { pureFunction } from '../preset';
import { findAs } from '../typeExpr';
import { Env, Term, Type, UserReference } from '../types';
import typeType from '../typeType';
import { showType } from '../unify';

export const typeAs = (env: Env, target: Term, suffix: AsSuffix): Term => {
    const ttype = typeType(env, suffix.t);
    const stype = target.is;
    // Look for an `As` that fits!
    const asRecord: UserReference = {
        type: 'user',
        id: { hash: 'As', pos: 0, size: 1 },
    };
    const goalType: Type = {
        type: 'ref',
        ref: asRecord,
        typeVbls: [stype, ttype],
        // effectVbls: [],
        location: null,
    };
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
            const t = env.global.terms[suffix.hash.slice(1)];
            if (!t) {
                throw new LocatedError(
                    suffix.location,
                    `Unknown term ${suffix.hash.slice(1)}`,
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
        const ref = findAs(env, stype, ttype, suffix.location);
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
            location: null,
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
            location: null,
            inferred: true,
            is: pureFunction([stype], ttype),
        },
        typeVbls: [],
        effectVbls: null,
        is: ttype,
        location: null,
    };
};
