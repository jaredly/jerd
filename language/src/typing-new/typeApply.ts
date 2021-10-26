import { ApplySuffix, Expression } from '../parsing/parser-new';
import { transformTerm } from '../typing/auto-transform';
import { void_ } from '../typing/preset';
import {
    Apply,
    EffectRef,
    LambdaType,
    Term,
    Type,
    typesEqual,
    TypeVblDecl,
} from '../typing/types';
import { Context } from './Context';
import { resolveTypeVbl } from './dependencies';
import { countErrors, errorTracker, errorVisitor } from './Library';
import { createTypeVblMapping, mapTypeAndEffectVariablesInType } from './ops';
import { resolveEffectId } from './resolve';
import { typeExpression, wrapExpected } from './typeExpression';
import { typeIdentifierMany } from './typeIdentifier';
import { typeType } from './typeType';

export const inferTypeVblIfPossible = (
    ctx: Context,
    is: LambdaType,
    args: Array<Term>,
    vbl: TypeVblDecl,
) => {
    // We assume that it will show up in one of the args
    let found: Type | null = null;
    for (let i = 0; i < is.args.length && i < args.length; i++) {
        const resolved = resolveTypeVbl(is.args[i], args[i].is, vbl.sym.unique);
        if (resolved != null) {
            return resolved;
        }
    }
    return null;
};

export const typeApply = (
    ctx: Context,
    suffix: ApplySuffix,
    inner: Expression,
    expected: Array<Type>,
): Term => {
    // Ok what's the balance.
    // IF I do know my args, but I don't know my result, I type the args first?
    // IF I don't know my args,
    // ... what's more likely, that I'll know that ypes of the args, or the type of the function?
    // probably the type of the function.
    // really I want to do a bit of speculation here I think.
    // // OK very simple heuristic: If /inner/ is simply a 'var' that does to a not-yet-typed binding,
    // // we go ahead and process the args first. Otherwise, we process the target first.
    // if (isUntypedSym(ctx, inner)) {
    // 	// TODO: type the args first, then the inner.
    // }
    // IFFF the
    // hm
    // so um maybe I actually want to do the args first after all, in general?
    // because it's hmmm
    // ok
    // so
    // if there are multiple options for the one, I want to know
    // ugh.
    // ok I think I'll just do something simple for the moment.
    // and then figure out what I want the fancier behavior to be.
    // OHH also in the IDE, you'll have actually specified the target first, so it's fine.
    // Hmmmm I wonder if ... we should ... change from having an `expected` array being
    // just a list of types, to making it a list of predicates or something.

    // let is: Type
    // // Ok, so if it's an identifier, we'll try to be cute.
    // if (inner.type === 'Identifier') {
    // 	const options = typeIdentifierMany(ctx, inner)
    // 	// so, the things that go into this:
    // 	// we've got:
    // 	// - the types of our args
    // 	// - the expected return types (multiple, possibly)
    // 	// - the applied, or maybe unapplied type variables that need to be inferred
    // 	// - the applied, or maybe unapplied effect variables that need to be inferred
    // 	//

    // 	// how do we select the "best" fit?
    // 	// for (let option of options) {
    // 	// 	if (typesEqual(option))
    // 	// }
    // }

    // We might have some multiple-resolution happening!
    // oh hey I bet I can reuse the binops stuff here as well.
    if (inner.type === 'Identifier') {
        const options = typeIdentifierMany(ctx, inner);

        const results: Array<{
            term: Term;
            errors: number;
        }> = [];

        // console.log(options);
        for (let option of options) {
            if (option.type === 'unbound') {
                // TODO: infer the type of the function, it's great.
                continue;
            }
            // fns that don't expect as many args as we're giving, pass them up on this round.
            if (
                option.is.type !== 'lambda' ||
                option.is.args.length < (suffix.args?.items.length || 0)
            ) {
                continue;
            }
            const result = wrapExpected(
                applyToTarget(ctx, option, suffix),
                expected,
            );
            const errors = countErrors(result);
            if (errors === 0) {
                return result;
            }
            results.push({ term: result, errors });
        }
        if (results.length) {
            results.sort((a, b) => a.errors - b.errors);
            return results[0].term;
        }
    }

    const target = typeExpression(ctx, inner, []);

    return wrapExpected(applyToTarget(ctx, target, suffix), expected);
};

export const applyToTarget = (
    ctx: Context,
    target: Term,
    suffix: ApplySuffix,
): Term => {
    let is = target.is;
    // let args = target.is.type === 'lambda' ? target.is.args : null

    const typeVbls =
        suffix.typevbls?.inner.items.map((item) => typeType(ctx, item)) || [];

    // console.log(typeVbls);
    const effectVbls = suffix.effectVbls
        ? (suffix.effectVbls.inner?.items
              .map((vbl) => resolveEffectId(ctx, vbl))
              .filter(Boolean) as Array<EffectRef>) || []
        : null;

    if (is.type !== 'lambda') {
        return {
            type: 'InvalidApplication',
            target,
            is: void_,
            location: suffix.location,
            extraTypeArgs: typeVbls,
            extraArgs:
                suffix.args?.items.map(({ value }, i) =>
                    typeExpression(ctx, value, []),
                ) || [],
            extraEffectArgs: effectVbls || [],
        };
    }

    // OK, so if we're inferring type variables, we can't use the
    // function type to infer arg types. It's the other way around.

    let allTypeVbls: Array<Type>;
    let typedArgs: Array<Term>;
    // INFER TYPE VBLS THANKS
    if (is.typeVbls.length > typeVbls.length) {
        // Type the args first, so we can use them to infer type variables
        typedArgs =
            suffix.args?.items.map(({ value }, i) => {
                return typeExpression(ctx, value, []);
            }) || [];

        allTypeVbls = is.typeVbls.map((vbl, i) =>
            i >= typeVbls.length
                ? inferTypeVblIfPossible(
                      ctx,
                      is as LambdaType,
                      typedArgs,
                      vbl,
                  ) || {
                      type: 'THole',
                      location: suffix.location,
                  }
                : typeVbls[i],
        );

        is = applyTypeVbls(typeVbls, is, effectVbls, ctx, allTypeVbls, suffix);
    } else {
        // Type the args second, using the type variables.
        allTypeVbls = typeVbls.slice(0, is.typeVbls.length);

        is = applyTypeVbls(typeVbls, is, effectVbls, ctx, allTypeVbls, suffix);
        // console.log(is.args, is.res);

        let argTypes = is.args;

        typedArgs =
            suffix.args?.items.map(({ value }, i) => {
                return typeExpression(
                    ctx,
                    value,
                    argTypes && i < argTypes.length ? [argTypes[i]] : [],
                );
            }) || [];
    }

    const result: Apply = {
        type: 'apply',
        args: is.args.map((arg, i) => {
            if (i >= typedArgs.length) {
                return { type: 'Hole', location: suffix.location, is: arg };
            }
            return wrapExpected(typedArgs[i], [arg]);
        }),
        effectVbls,
        is: (is as LambdaType).res,
        location: suffix.location,
        target,
        typeVbls: allTypeVbls,
        hadAllVariableEffects: effectVbls
            ? effectVbls.every((v) => v.type === 'var')
            : false,
    };

    // pick up the extra args
    // SO HERE's A THING
    // a(b)(c)
    // will be treated the same as
    // a(b,c)
    // IFF a is a function that only takes one arg,
    // and doesn't return a function.

    if (
        typedArgs.length > is.args.length ||
        typeVbls.length > is.typeVbls.length
    ) {
        return {
            type: 'InvalidApplication',
            target: result,
            is: result.is,
            location: suffix.location,
            extraArgs: typedArgs.slice(is.args.length),
            extraTypeArgs: typeVbls.slice(is.typeVbls.length),
            extraEffectArgs: [],
        };
    }
    return result;
};

export function applyTypeVbls(
    typeVbls: Type[],
    is: LambdaType,
    effectVbls: EffectRef[] | null,
    ctx: Context,
    allTypeVbls: Type[],
    suffix: ApplySuffix,
): LambdaType {
    if (
        typeVbls.length ||
        is.typeVbls.length ||
        effectVbls ||
        is.effectVbls.length
    ) {
        const mapping = createTypeVblMapping(
            ctx,
            is.typeVbls,
            allTypeVbls,
            suffix.location,
        );
        if (!mapping) {
            throw new Error(`nope`);
        }
        const effectMapping =
            is.effectVbls.length === 1
                ? { [is.effectVbls[0].sym.unique]: effectVbls || [] }
                : {};
        return mapTypeAndEffectVariablesInType(
            mapping,
            effectMapping,
            is,
        ) as LambdaType;
    }
    return is;
}
