// For the applys

import { Env, Type, Term, LambdaType, EffectRef } from '../types';
import { ApplySuffix } from '../../parsing/parser';
import { showType } from '../unify';
import { resolveEffect } from '../env';
import typeExpr, {
    applyEffectVariables,
    applyTypeVariables,
    showLocation,
} from '../typeExpr';
import typeType from '../typeType';
import { getTypeError } from '../getTypeError';
import { LocatedError } from '../errors';

export const typeApply = (
    env: Env,
    target: Term,
    suffix: ApplySuffix,
): Term => {
    const { args, effectVbls } = suffix;
    const typeVbls = suffix.typevbls.map((t) => typeType(env, t));
    // const originalTargetType = target.is as LambdaType;
    let applied = target.is;
    if (typeVbls.length) {
        // ahhhh it's my old nemesis come back to haunt me.
        // yes indeed I do need to know what the types of these things are
        // darn it.
        // because if, well, um,
        // the type of an argument was a variable,
        // then in Go it needs to be wrapped in `(interface{})(v)`
        // also if the return value was a variable,
        // then in Go the result needs to have the type assertion `.(theType)` after the fn call.

        // HERMMM This might be illegal.
        // or rather, doing it like this
        // does weird things to the pretty-printing end.
        // Because we lose the `<T>`.
        applied = applyTypeVariables(
            env,
            target.is,
            typeVbls,
            '<self>',
        ) as LambdaType;
        // console.log(
        //     'Applying type variables',
        //     typeVbls.map((t) => showType(env, t)).join(', '),
        //     '\n' + showType(env, target.is),
        //     '\n' + showType(env, applied),
        // );
        // @ts-ignore
        // target = {
        //     ...target,
        //     is: applied,
        // };
    }

    const prevEffects = target.is.type === 'lambda' ? target.is.effects : [];
    const mappedVbls: null | Array<EffectRef> = effectVbls
        ? effectVbls.map((id) => resolveEffect(env, id))
        : null;
    if (mappedVbls != null) {
        // const pre = target.is;
        // @ts-ignore
        applied = applyEffectVariables(env, applied, mappedVbls) as LambdaType;
        // console.log(
        //     `Mapped effect variables - ${showType(env,
        //         pre,
        //     )} ---> ${showType(env, target.is)}`,
        // );
    }

    let is: LambdaType;
    if (target.is.type === 'var') {
        // const argTypes: Array<Type> = [];
        // for (let i = 0; i < args.length; i++) {
        //     argTypes.push(newTypeVbl(env));
        // }
        // is = {
        //     type: 'lambda',
        //     typeVbls: [],
        //     effectVbls: [],
        //     location: null,
        //     args: argTypes,
        //     effects: [], // STOPSHIP add effect vbls
        //     res: newTypeVbl(env),
        //     rest: null, // STOPSHIP(rest)
        // };
        // if (getTypeErrorOld(env, is, target.is) !== true) {
        //     throw new Error('we literally just created this');
        // }
        throw new Error(`Target is a var, can't do it`);
    } else {
        if (applied.type !== 'lambda') {
            throw new Error(
                `Trying to call ${showType(env, applied)} at ${showLocation(
                    target.location,
                )}`,
            );
        }
        if (applied.args.length !== args.length) {
            throw new Error(
                `Wrong number of arguments ${showType(env, applied)}, ${
                    applied.args.length
                } vs ${args.length} at ${showLocation(target.location)}`,
            );
        }
        is = applied;
    }

    const resArgs: Array<Term> = [];
    args.forEach((term, i) => {
        const t: Term = typeExpr(env, term, is.args[i]);
        const err = getTypeError(env, t.is, is.args[i], term.location);
        if (err !== null) {
            throw new LocatedError(
                term.location,
                `Wrong type for arg ${i}: \nFound: ${showType(
                    env,
                    t.is,
                )}\nbut expected ${showType(env, is.args[i])} : ${showLocation(
                    t.location,
                )}`,
            ).wrap(err);
        }
        resArgs.push(t);
    });

    return {
        type: 'apply',
        // originalTargetType,
        // STOPSHIP(sourcemap): this should be better
        location: target.location,
        typeVbls,
        effectVbls: mappedVbls,
        hadAllVariableEffects:
            effectVbls != null &&
            effectVbls.length === 1 &&
            prevEffects.length > 0 &&
            prevEffects.filter((e) => e.type === 'ref').length === 0,
        target,
        args: resArgs,
        is: is.res,
    };
};
