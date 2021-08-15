import { AttributeSuffix } from '../../parsing/parser';
import { hasSubType, idFromName, idName } from '../env';
import { LocatedError } from '../errors';
import { applyTypeVariablesToRecord, showLocation } from '../typeExpr';
import {
    Env,
    getAllSubTypes,
    idsEqual,
    isRecord,
    refsEqual,
    Term,
    UserReference,
} from '../types';
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
    let ref: UserReference | null = null;
    if (suffix.id.hash != null) {
        const [id, num] = suffix.id.hash.slice(1).split('#');
        ref = { type: 'user', id: idFromName(id) };
        idx = +num;
        if (target.is.type === 'ref') {
            if (target.is.ref.type === 'user') {
                // This is the type of the record at hand that we're trying to get something out of.
                // If this is a valid attribute, the hash must be equal to the record type, or
                // an extended record type.
                const rid = target.is.ref.id;
                const defn = env.global.types[idName(rid)];
                if (defn.type === 'Enum') {
                    throw new Error(`can't attribute an enum just yet folks`);
                }
                const sub = getAllSubTypes(env.global, defn.extends);
                // TODO: need to check subtypes / spreads n stuffs
                // this is wrong
                if (
                    !refsEqual(ref, target.is.ref) &&
                    !sub.some((id) => idsEqual(id, ref!.id))
                ) {
                    // console.log(sub, rid, ref);
                    target = {
                        type: 'TypeError',
                        is: {
                            type: 'ref',
                            ref,
                            typeVbls: [],
                            location: target.location,
                        },
                        inner: target,
                        location: target.location,
                    };
                    // throw new LocatedError(
                    //     suffix.location,
                    //     `hashed attribute doesnt line up`,
                    // );
                }
            }
        } else if (target.is.type === 'var') {
            throw new Error(`Ref what`);
            // TOOD FIX
        } else {
            throw new LocatedError(
                suffix.location,
                `Not a record ${showType(env, target.is)} at ${showLocation(
                    suffix.location,
                )}`,
            );
        }
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
    } else if (target.is.type === 'ref' && target.is.ref.type === 'user') {
        const typeName = idName(target.is.ref.id);
        const defn = env.global.types[typeName];
        // TODO TODO: allow attribute access on Enums, if all subtypes allow it
        if (defn.type !== 'Record') {
            throw new LocatedError(suffix.location, `Target is not a Record`);
        }
        idx = env.global.recordGroups[typeName].indexOf(suffix.id.text);
        if (idx !== -1) {
            ref = target.is.ref;
        } else {
            const subTypes = getAllSubTypes(env.global, defn.extends);
            for (let id of subTypes) {
                idx = env.global.recordGroups[idName(id)].indexOf(
                    suffix.id.text,
                );
                if (idx !== -1) {
                    ref = { type: 'user', id };
                    break;
                }
            }
        }
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

    if (ref === null) {
        throw new LocatedError(
            suffix.location,
            `Unknown attribute ${suffix.id.text} for type ${showType(
                env,
                target.is,
            )}`,
        );
    }

    let t = env.global.types[idName(ref.id)];
    if (t.type !== 'Record') {
        throw new Error(`Not a record ${idName(ref.id)}`);
    }
    if (target.is.type !== 'ref') {
        throw new Error(
            'Yeah just not supporting non-ref target type at the moment',
        );
    }
    t = applyTypeVariablesToRecord(
        env,
        t,
        target.is.typeVbls,
        target.is.location,
        ref.id.hash,
    );
    if (t.type !== 'Record') {
        throw new Error(`${idName(ref.id)} is not a record type`);
    }

    return {
        type: 'Attribute',
        target,
        location: suffix.location,
        idLocation: suffix.id.location,
        inferred: false,
        idx,
        ref,
        refTypeVbls: target.is.typeVbls.length ? target.is.typeVbls : undefined,
        is: t.items[idx],
    };
};
