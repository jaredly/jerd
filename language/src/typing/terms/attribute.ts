import { AttributeSuffix } from '../../parsing/parser';
import { hasSubType, idFromName, idName } from '../env';
import { LocatedError } from '../errors';
import { applyTypeVariablesToRecord, showLocation } from '../typeExpr';
import { Env, isRecord, Term, UserReference } from '../types';
import { showType } from '../unify';

export const typeAttribute = (
    env: Env,
    target: Term,
    suffix: AttributeSuffix,
): Term => {
    // OOOOKKK.
    // So here we have some choices, right?
    // first we find the object this is likely to be attached to
    // ermmm yeah maybe this is where constraint solving becomes a thing?
    // which, ugh
    // So yeah, when parsing, if there are multiple things with the
    // same name, tough beans I'm sorry.
    // Oh maybe allow it to be "fully qualified"?
    // like `.<Person>name`? or `.Person::name`?
    // yeah that could be cool.
    let idx: number;
    let ref: UserReference;
    if (suffix.id.hash != null) {
        const [id, num] = suffix.id.hash.slice(1).split('#');
        ref = { type: 'user', id: idFromName(id) };
        idx = +num;
    } else if (suffix.id.text.match(/^\d+$/)) {
        idx = +suffix.id.text;
        if (
            target.is.type === 'ref' &&
            target.is.ref.type === 'builtin' &&
            target.is.ref.name.startsWith('Tuple')
        ) {
            const n = +target.is.ref.name.slice('Tuple'.length);
            if (isNaN(n)) {
                throw new Error(`Unknown tuple type ${target.is.ref.name}`);
            }
            if (idx >= n) {
                throw new Error(`Cannot access idx ${idx} of a ${n}-tuple`);
            }
            if (target.is.typeVbls.length !== n) {
                throw new Error(`Invalid tuple type`);
            }
            return {
                type: 'TupleAccess',
                idx,
                is: target.is.typeVbls[idx],
                location: suffix.location,
                target,
            };
        }
        //
        if (target.is.type !== 'ref' || target.is.ref.type !== 'user') {
            throw new Error(
                `Not a record ${showType(env, target.is)} at ${showLocation(
                    suffix.location,
                )}`,
            );
        }
        ref = target.is.ref;
    } else {
        if (!env.global.attributeNames[suffix.id.text]) {
            throw new Error(`Unknown attribute name ${suffix.id.text}`);
        }
        const attr = env.global.attributeNames[suffix.id.text][0];
        idx = attr.idx;
        const id = attr.id;
        ref = { type: 'user', id };
        if (!isRecord(target.is, ref) && !hasSubType(env, target.is, id)) {
            throw new LocatedError(
                suffix.location,
                `Expression at ${showLocation(suffix.location)} is not a ${
                    env.global.idNames[idName(id)]
                }#${idName(id)} or its supertype. It is a ${showType(
                    env,
                    target.is,
                )}`,
            );
        }
    }

    let t = env.global.types[idName(ref.id)];
    if (t.type !== 'Record') {
        throw new Error(`Not a record ${idName(ref.id)}`);
    }
    if (target.is.type === 'ref') {
        t = applyTypeVariablesToRecord(
            env,
            t,
            target.is.typeVbls,
            target.is.location,
            ref.id.hash,
        );
    }
    if (t.type !== 'Record') {
        throw new Error(`${idName(ref.id)} is not a record type`);
    }

    return {
        type: 'Attribute',
        target,
        location: suffix.location,
        inferred: false,
        idx,
        ref,
        is: t.items[idx],
    };
};
