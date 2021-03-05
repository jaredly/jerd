// For the applys

import { Env, Type, Term, LambdaType, EffectRef } from '../types';
import { ApplySuffix } from '../../parsing/parser';
import { showType, fitsExpectation, assertFits } from '../unify';
import { resolveEffect } from '../env';
import typeExpr, {
    applyEffectVariables,
    applyTypeVariables,
    showLocation,
} from '../typeExpr';
import typeType, { newTypeVbl } from '../typeType';

export const typeApply = (
    env: Env,
    target: Term,
    suffix: ApplySuffix,
): Term => {
    const { args, typevbls, effectVbls } = suffix;
    let is = target.is as LambdaType;
    if (typevbls.length || effectVbls != null) {
        if (target.type === 'lambda') {
            throw new Error(
                `Why do you have a generic immediately-called function at ${showLocation(
                    target.location,
                )}`,
            );
        }
        // HERMMM This might be illegal.
        // or rather, doing it like this
        // does weird things to the pretty-printing end.
        // Because we lose the `<T>`.
        is = applyTypeVariables(
            env,
            target.is,
            typevbls.map((t) => typeType(env, t)),
        ) as LambdaType;
        target = {
            ...target,
            is: {
                type: 'apply',
                inner: target.is,
                types: typevbls.map((t) => typeType(env, t)),
                effects:
                    effectVbls != null
                        ? effectVbls.map((id) => resolveEffect(env, id))
                        : null,
                location: suffix.location,
            },
        };
    }

    /// START HERE
    /// OOOOhhhk, so I'm thinking "what if <ref> just had like the type & effect vbls on it? seems like that would be easier"
    /// because functions were working ok.

    if (target.is.type === 'var') {
        throw new Error(`cant infer function calls yet`);
    }

    // let is: LambdaType;
    // if (target.is.type === 'var') {
    //     const argTypes: Array<Type> = [];
    //     for (let i = 0; i < args.length; i++) {
    //         argTypes.push(newTypeVbl(env));
    //     }
    //     is = {
    //         type: 'lambda',
    //         typeVbls: [],
    //         effectVbls: [],
    //         location: null,
    //         args: argTypes,
    //         effects: [], // STOPSHIP add effect vbls
    //         res: newTypeVbl(env),
    //         rest: null, // STOPSHIP(rest)
    //     };
    //     if (fitsExpectation(env, is, target.is) !== true) {
    //         throw new Error('we literally just created this');
    //     }
    // } else {
    // if (target.is.type !== 'lambda') {
    //     throw new Error(
    //         `Trying to call ${showType(target.is)}, not a lambda`,
    //     );
    // }
    if (is.args.length !== args.length) {
        throw new Error(
            `Wrong number of arguments ${JSON.stringify(target, null, 2)}`,
        );
    }
    // }

    const resArgs: Array<Term> = [];
    args.forEach((term, i) => {
        const t: Term = typeExpr(env, term, is.args[i]);
        assertFits(env, t.is, is.args[i], `arg ${i}`);
        resArgs.push(t);
    });

    return {
        type: 'apply',
        // STOPSHIP(sourcemap): this should be better
        location: target.location,
        // hadAllVariableEffects:
        //     effectVbls != null &&
        //     prevEffects.length > 0 &&
        //     prevEffects.filter((e) => e.type === 'ref').length === 0,
        target,
        args: resArgs,
        is: is.res,
    };
};
