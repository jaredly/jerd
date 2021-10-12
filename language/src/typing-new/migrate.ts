import { idName } from '../typing/env';
import { Id, GlobalEnv, EffectDef, Env, newLocal } from '../typing/types';
import { Context } from './Context';

const converEffectConstructors = (
    input: Context['library']['effects']['constructors']['names'],
) => {
    const output: GlobalEnv['effectConstructors'] = {};
    Object.keys(input).forEach((k) => {
        output[k] = { idName: idName(input[k][0].id), idx: input[k][0].idx };
    });
    return output;
};

const toIdNames = (ids: { [key: string]: Array<Id> }) => {
    const output: GlobalEnv['effectNames'] = {};
    Object.keys(ids).forEach((name) => {
        output[name] = ids[name].map(idName);
    });
    return output;
};

const convertEffects = (effects: { [key: string]: EffectDef }) => {
    const output: GlobalEnv['effects'] = {};
    Object.keys(effects).forEach((k) => {
        output[k] = effects[k].constrs;
    });
    return output;
};

export const ctxToGlobalEnv = (ctx: Context): GlobalEnv => {
    const idNames: { [key: string]: string } = {};
    const addNames = (names: { [key: string]: Array<Id> }) => {
        Object.keys(names).forEach((name) =>
            names[name].forEach((id) => (idNames[idName(id)] = name)),
        );
    };
    addNames(ctx.library.types.names);
    addNames(ctx.library.terms.names);
    addNames(ctx.library.effects.names);
    addNames(ctx.library.decorators.names);
    return {
        attributeNames: ctx.library.types.constructors.names,
        builtinTypes: ctx.builtins.types,
        builtins: ctx.builtins.terms,
        decoratorNames: ctx.library.decorators.names,
        decorators: mapObj(ctx.library.decorators.defns, (input) => input.defn),
        effectConstrNames: ctx.library.effects.constructors.idToNames,
        effectConstructors: converEffectConstructors(
            ctx.library.effects.constructors.names,
        ),
        effectNames: toIdNames(ctx.library.effects.names),
        effects: convertEffects(
            mapObj(ctx.library.effects.defns, (input) => input.defn),
        ),
        exportedTerms: {},
        idNames,
        metaData: {},
        names: ctx.library.terms.names,
        recordGroups: ctx.library.types.constructors.idToNames,
        rng: () => 0.0,
        terms: mapObj(ctx.library.terms.defns, (d) => d.defn),
        typeNames: ctx.library.types.names,
        types: mapObj(ctx.library.types.defns, (d) => d.defn),
    };
};

export const mapObj = <A, B>(
    a: { [key: string]: A },
    fn: (input: A) => B,
): { [key: string]: B } => {
    const res: { [key: string]: B } = {};
    Object.keys(a).forEach((k) => (res[k] = fn(a[k])));
    return res;
};

export const ctxToEnv = (ctx: Context): Env => {
    return {
        depth: 0,
        term: {
            localNames: {},
            nextTraceId: 0,
        },
        global: ctxToGlobalEnv(ctx),
        local: newLocal(),
    };
};
