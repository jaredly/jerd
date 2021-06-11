// For the applys

import { Env, Type, Term, LambdaType, EffectRef, typesEqual } from '../types';
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

    let resArgs = args.map((arg) => typeExpr(env, arg.value));

    if (target.type === 'Ambiguous') {
        // OK! resolve ambiguity pleaseeee
        // oh hrmmmmmmmmmmmmm maybe .....
        // this is...... where we resolve vbls?????
        // hmmmmmm like what if we assign something somewhere
        // .....
        // ok yeah wait I just won't deal with ambiguity
        // in other contexts (other than an apply), and you
        // just have to deal with it. It'll be an error.
        // Yes thanks.
        const matching = target.options
            .map((option) => {
                if (option.is.type !== 'lambda') {
                    return null;
                }
                if (option.is.args.length !== resArgs.length) {
                    return null;
                }
                let matches = true;
                const args = option.is.args.map((t, i) => {
                    const arg = resArgs[i];
                    if (arg.type === 'Ambiguous') {
                        for (let opt of arg.options) {
                            if (typesEqual(opt.is, t)) {
                                return opt;
                            }
                        }
                        matches = false;
                        return arg;
                    }
                    // TODO: resolve ambiguities here too!
                    if (!typesEqual(arg.is, t)) {
                        matches = false;
                    }
                    return arg;
                });
                if (!matches) {
                    return null;
                }
                return { option, args };
            })
            .filter(Boolean) as Array<{ option: Term; args: Array<Term> }>;
        if (!matching.length) {
            throw new LocatedError(
                target.location,
                `Ambiguous term doesn't match arguments ${resArgs
                    .map((arg) => showType(env, arg.is))
                    .join(', ')}`,
            );
        }
        target = matching[0].option;
        applied = target.is;
        resArgs = matching[0].args;
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
            throw new LocatedError(
                target.location,
                `Trying to call ${showType(env, applied)}`,
            );
        }
        if (applied.args.length !== args.length) {
            throw new LocatedError(
                target.location,
                `Wrong number of arguments ${showType(env, applied)}, ${
                    applied.args.length
                } vs ${args.length}`,
            );
        }
        is = applied;
    }

    // OK OK so now we need a wee bit of inference.
    // How will this work?
    // A: If target is ambiguous, then look to the args
    // if args are ambiguous, look to the target
    // um is this constraint solving?
    // hmmmmmmmmm
    // so in the UI case, we'd solve the ambiguity at the root
    // like, if the target is ultimately ambiguous, we'd ask that,
    // and then move on to the args, right?
    // Yeah, and we'd have a Term type for "Ambiguous term", right?
    // could be the same one for "unresolved term" tbh

    // const resArgs: Array<Term> = [];
    resArgs.forEach((term, i) => {
        // const t: Term = typeExpr(env, term);
        const err = getTypeError(env, term.is, is.args[i], term.location!);
        if (err !== null) {
            throw new LocatedError(
                term.location,
                `Wrong type for arg ${i}: \nFound: ${showType(
                    env,
                    term.is,
                )}\nbut expected ${showType(env, is.args[i])} : ${showLocation(
                    term.location,
                )}`,
            ).wrap(err);
        }
    });

    return {
        type: 'apply',
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
