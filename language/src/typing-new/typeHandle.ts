import { Handle } from '../parsing/parser-new';
import { idName } from '../typing/env';
import { void_ } from '../typing/preset';
import {
    Case,
    EffectRef,
    Reference,
    Symbol,
    Term,
    Type,
    typesEqual,
} from '../typing/types';
import { Context, idToSym, nextUnique, ValueBinding } from './Context';
import { typeExpression } from './typeExpression';

export const typeHandle = (
    ctx: Context,
    handle: Handle,
    expected: Array<Type>,
): Term => {
    const target = typeExpression(ctx, handle.target, []);
    if (target.is.type !== 'lambda' || target.is.args.length !== 0) {
        return {
            type: 'Hole',
            is: expected.length ? expected[0] : void_,
            location: handle.location,
        };
    }
    const targetReturn = target.is.res;
    let effName = handle.cases[0].name;
    if (handle.cases.some((c) => c.name.text !== effName.text)) {
        // throw new Error(`Can't handle multiple effects in one handler.`);
        return {
            type: 'Hole',
            is: expected.length ? expected[0] : void_,
            location: handle.location,
        };
    }
    const effIds = ctx.library.effects.names[effName.text];
    if (!effIds) {
        // throw new Error(`No effect named ${effName.text}`);
        return {
            type: 'Hole',
            is: expected.length ? expected[0] : void_,
            location: handle.location,
        };
    }
    const effId = effIds[0];
    const defn = ctx.library.effects.defns[idName(effId)].defn;
    const effect: Reference = {
        type: 'user',
        id: effId,
    };
    const kEffects: Array<EffectRef> = [
        { type: 'ref', ref: effect, location: null },
    ];
    const names = ctx.library.effects.constructors.idToNames[idName(effId)];

    // hmm got to do some type checking folks
    const cases = handle.cases
        .map((kase): Case | null => {
            // const ids = ctx.library.effects.names[kase.name.text]
            // if (!ids) {
            // 	ctx.warnings.push({location: kase.location, text: `bad effect name`})
            // 	return null
            // }
            // const id = ids[0]
            // const defn = ctx.library.effects.defns[idName(id)].defn
            const idx = names.indexOf(kase.constr.text);
            if (idx == -1) {
                ctx.warnings.push({
                    location: kase.location,
                    text: `bad effect constr name`,
                });
                return null;
            }

            const constr = defn.constrs[idx];
            const k: Symbol = { unique: nextUnique(ctx), name: 'k' };
            const kType: Type = {
                type: 'lambda',
                args: isVoid(constr.ret) ? [] : [constr.ret],
                effectVbls: [],
                effects: kEffects,
                location: kase.location,
                res: targetReturn,
                rest: null,
                typeVbls: [],
            };

            const bindings: Array<ValueBinding> = [
                {
                    sym: k,
                    type: kType,
                    location: kase.location,
                },
            ];
            return {
                args:
                    kase.args?.items.map((item, i) => {
                        const sym = idToSym(ctx, item);
                        bindings.push({
                            sym,
                            type: constr.args[i],
                            location: item.location,
                        });
                        return { sym, type: constr.args[i] };
                    }) || [],
                body: typeExpression(
                    {
                        ...ctx,
                        bindings: {
                            ...ctx.bindings,
                            values: bindings.concat(ctx.bindings.values),
                        },
                    },
                    kase.body,
                    expected,
                ),
                constr: idx,
                k: { sym: k, type: kType },
            };
        })
        .filter(Boolean) as Array<Case>;

    const pureArg: Symbol = idToSym(ctx, handle.pureId);
    const pure: Term = typeExpression(
        {
            ...ctx,
            bindings: {
                ...ctx.bindings,
                values: [
                    {
                        sym: pureArg,
                        type: targetReturn,
                        location: handle.pureId.location,
                    } as ValueBinding,
                ].concat(ctx.bindings.values),
            },
        },
        handle.pureBody,
        [],
    );

    return {
        type: 'handle',
        cases,
        effect,
        is: pure.is,
        location: handle.location,
        pure: { body: pure, arg: pureArg },
        target,
    };
};

export const isVoid = (x: Type) => {
    return typesEqual(x, void_);
};
