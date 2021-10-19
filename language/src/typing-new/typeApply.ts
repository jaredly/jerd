import { ApplySuffix, Expression } from '../parsing/parser-new';
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
    const typedArgs =
        suffix.args?.items.map(({ value }) => {
            return typeExpression(ctx, value, []);
        }) || [];
    const effectVbls = suffix.effectVbls
        ? (suffix.effectVbls.inner?.items
              .map((vbl) => resolveEffectId(ctx, vbl))
              .filter(Boolean) as Array<EffectRef>) || []
        : null;
    // How to say ... we expect such and such.
    // ALSO do I want to do some inference of type variables?
    // like I super do.
    // So, if you forget a type variable, but we can infer it,
    // then just pop it on in folks.
    // But I don't have to figure that out just yet.
    // START HERE FOLKS>
    const typeVbls =
        suffix.typevbls?.inner.items.map((item) => typeType(ctx, item)) || [];
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

    const target = typeExpression(ctx, inner, []);

    let is = target.is;

    if (is.type !== 'lambda') {
        return {
            type: 'InvalidApplication',
            target,
            is: void_,
            location: suffix.location,
            extraTypeArgs: typeVbls,
            extraArgs: typedArgs,
            extraEffectArgs: effectVbls || [],
        };
    }

    // Ok: IF TOO FEW: fill with holes, it's fine
    // IF TOO MANY: InvalidApplication, yse
    if (typeVbls.length !== is.typeVbls.length) {
        // Sooo we um
        // wrap the target in an invalidTypeApplication?
    }

    const allTypeVbls: Array<Type> = is.typeVbls.map((vbl, i) =>
        i >= typeVbls.length
            ? inferTypeVblIfPossible(ctx, is as LambdaType, typedArgs, vbl) || {
                  type: 'THole',
                  location: suffix.location,
              }
            : typeVbls[i],
    );

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
            // typeVbls.slice(0, is.typeVbls.length),
            suffix.location,
        );
        if (!mapping) {
            throw new Error(`nope`);
        }
        const effectMapping =
            is.effectVbls.length === 1
                ? { [is.effectVbls[0].sym.unique]: effectVbls || [] }
                : {};
        is = mapTypeAndEffectVariablesInType(
            mapping,
            effectMapping,
            is,
        ) as LambdaType;
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
