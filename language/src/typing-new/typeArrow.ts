import { Lambda, Location } from '../parsing/parser-new';
import {
    Type,
    Lambda as TLambda,
    Term,
    Symbol,
    Id,
    typesEqual,
    LambdaType,
    TypeVblDecl,
    EffectRef,
    getEffects,
    effectsMatch,
    effectsEqual,
    effectKey,
} from '../typing/types';
import { Context, idToSym } from './Context';
import { resolveEffectId, resolveTypeId } from './resolve';
import { typeExpression, wrapExpected } from './typeExpression';
import { typeType } from './typeType';

export const typeArrow = (
    ctx: Context,
    arrow: Lambda,
    expected: Array<Type>,
): Term => {
    let changed = false;
    if (arrow.typevbls?.items.length) {
        const types = ctx.bindings.types.slice();
        arrow.typevbls.items.forEach((ok) => {
            const sym = idToSym(ctx, ok.id);
            const subTypes =
                (ok.subTypes?.items
                    .map((id) => resolveTypeId(ctx, id))
                    .filter(Boolean) as Array<Id>) || [];
            types.push({ sym, location: ok.id.location, subTypes });
        });
    }
    let values = ctx.bindings.values;
    let types = ctx.bindings.types;
    let effects = ctx.bindings.effects;
    if (arrow.args?.items.length) {
        values = values.slice();
    }
    if (arrow.typevbls?.items.length) {
        types = types.slice();
    }
    if (arrow.effvbls?.inner?.items.length) {
        effects = effects.slice();
    }
    if (
        arrow.args?.items.length ||
        arrow.typevbls?.items.length ||
        arrow.effvbls?.inner?.items.length
    ) {
        ctx = { ...ctx, bindings: { ...ctx.bindings, types, values, effects } };
    }

    const effectVbls =
        arrow.effvbls?.inner?.items.map((id, i) => {
            if (i > 0) {
                throw new Error(
                    'multiple effect variables we dont know what to do here folks?',
                );
            }
            const sym = idToSym(ctx, id);
            effects.push({
                location: id.location,
                sym,
            });
            return sym.unique;
        }) || [];

    const typeVbls: Array<TypeVblDecl> =
        arrow.typevbls?.items.map((item) => {
            const sym = idToSym(ctx, item.id);
            const subTypes =
                (item.subTypes?.items
                    .map((id) => resolveTypeId(ctx, id))
                    .filter(Boolean) as Array<Id>) || [];
            types.push({
                sym,
                location: item.location,
                subTypes,
            });
            return {
                unique: sym.unique,
                name: sym.name,
                location: item.location,
                subTypes,
            };
        }) || [];

    const boundEffects = arrow.effects
        ? (arrow.effects.effects?.items
              .map((id) => resolveEffectId(ctx, id))
              .filter(Boolean) as Array<EffectRef>) || []
        : null;

    let args: Array<{ sym: Symbol; location: Location; type: Type | null }> =
        arrow.args?.items.map((arg) => {
            const sym = idToSym(ctx, arg.id);
            const type = arg.type ? typeType(ctx, arg.type) : null;
            return { sym, location: arg.id.location, type };
        }) || [];

    const returnType = arrow.rettype ? typeType(ctx, arrow.rettype) : null;

    const validExpected: Array<LambdaType> = expected.filter((typ) => {
        if (typ.type !== 'lambda') {
            return false;
        }
        if (typ.args.length !== args.length) {
            return false;
        }
        if (typ.effectVbls.length !== effectVbls.length) {
            return false;
        }
        if (typ.typeVbls.length !== typeVbls.length) {
            return false;
        }
        if (boundEffects != null) {
            if (boundEffects.length !== typ.effects.length) {
                return false;
            }
            // ugh make a nice function to do comparison of these
            return false;
            // if (boundEffects.some())
        }
        // STOPSHIP: This won't handle type variables correctly I don't think.
        if (
            typ.args.some(
                (arg, i) => args[i].type && !typesEqual(args[i].type, arg),
            )
        ) {
            return false;
        }
        if (returnType && !typesEqual(typ.res, returnType)) {
            return false;
        }
        // TODO TODO : rest args folks!!
        return true;
    }) as Array<LambdaType>;

    if (validExpected.length) {
        const first = validExpected[0];
        // Fill in missing with expected types
        args = args.map((arg, i) =>
            arg.type === null ? { ...arg, type: first.args[i] } : arg,
        );
    }

    args.forEach((arg) => {
        // NOTE: this means that the typeExpression will /modify/ the arg object here
        // so we will know after the typeExpression wether inference worked.
        values.unshift(arg);
    });

    // TODO: should I try to test all of the potential expecteds here?
    const body = typeExpression(
        ctx,
        arrow.body,
        returnType
            ? [returnType]
            : validExpected.length
            ? [validExpected[0].res]
            : [],
    );

    let gotEffects = getEffects(body);
    if (boundEffects) {
        gotEffects.forEach((got) => {
            if (!boundEffects.some((eff) => effectsEqual(eff, got))) {
                boundEffects.push(got);
                ctx.warnings.push({
                    location: arrow.location,
                    text: `Function body had an effect that wasn't declated: ${effectKey(
                        got,
                    )}`,
                });
            }
        });
    }

    const is: LambdaType = {
        type: 'lambda',
        args: args.map(({ location, type }, i): LambdaType['args'][0] =>
            type ? type : { type: 'THole', location },
        ),
        effectVbls,
        effects: boundEffects || gotEffects,
        location: arrow.location,
        res: body.is,
        rest: null,
        typeVbls,
    };

    return wrapExpected(
        {
            type: 'lambda',
            args: args.map((arg) => ({ sym: arg.sym, location: arg.location })),
            body,
            is,
            location: arrow.location,
        },
        expected,
    );
};
