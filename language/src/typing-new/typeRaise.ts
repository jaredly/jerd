import { Raise } from '../parsing/parser-new';
import { idName } from '../typing/env';
import { void_ } from '../typing/preset';
import { Term, Type } from '../typing/types';
import { Context } from './Context';
import { resolveEffectId } from './resolve';
import { typeExpression, wrapExpected } from './typeExpression';

export const typeRaise = (
    ctx: Context,
    raise: Raise,
    expected: Array<Type>,
): Term => {
    const ref = resolveEffectId(ctx, raise.name);
    if (!ref) {
        return {
            type: 'NotFound',
            location: raise.location,
            is: expected[0] || void_,
            text: raise.name.text,
        };
    }
    if (ref.type === 'var' || ref.ref.type === 'builtin') {
        // hmm do I need an error type just for invalid raise? Seems weird.
        // should I allow the raise target to be missing or something, with an optional note about what it looked for?
        // sounds legit.
        return {
            type: 'Hole',
            location: raise.location,
            is: expected[0] || void_,
        };
    }
    const defn = ctx.library.effects.defns[idName(ref.ref.id)];
    if (!defn) {
        ctx.warnings.push({
            location: raise.location,
            text: `No effect definition`,
        });
        return {
            type: 'Hole',
            location: raise.location,
            is: expected[0] || void_,
        };
    }
    if (raise.constr.hash) {
        // what am I parsing here? like #0? just an index? probably... hmmm
        // maybe I want to be able to use these without the prefix? maybe.
    }
    const names =
        ctx.library.effects.constructors.idToNames[idName(ref.ref.id)];
    const idx = names.indexOf(raise.constr.text);
    if (idx === -1) {
        ctx.warnings.push({
            location: raise.location,
            text: `Constructor ${
                raise.constr.text
            } not found for effect ${idName(ref.ref.id)}`,
        });
        return {
            type: 'Hole',
            location: raise.location,
            is: expected[0] || void_,
        };
    }
    const constr = defn.defn.constrs[idx];
    // STOPSHIP: We're currently just dropping any extra args on the floor.
    // maybe don't?
    const args: Array<Term> = constr.args.map((arg, i) => {
        const got = raise.args?.items[i];
        return got
            ? typeExpression(ctx, got, [arg])
            : { type: 'Hole', location: raise.location, is: arg };
    });
    return wrapExpected(
        {
            type: 'raise',
            args,
            ref: ref.ref,
            idx,
            is: constr.ret,
            location: raise.location,
        },
        expected,
    );
};
