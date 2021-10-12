import { idName } from '../typing/env';
import {Id, GlobalEnv, EffectDef, Env, newLocal} from '../typing/types';
import { Context } from './Context';

const converEffectConstructors = (input: Context['library']['effects']['constructors']['names']) => {
    const output: GlobalEnv['effectConstructors'] = {}
    Object.keys(input).forEach(k => {
        output[k] = {idName: idName(input[k][0].id), idx: input[k][0].idx}
    })
    return output
}

const toIdNames = (ids: {[key: string]: Array<Id>}) => {
    const output: GlobalEnv['effectNames'] = {}
    Object.keys(ids).forEach(name => {
        output[name] = ids[name].map(idName)
    })
    return output
}

const convertEffects = (effects: {[key: string]: EffectDef}) => {
    const output: GlobalEnv['effects'] = {}
    Object.keys(effects).forEach(k => {
        output[k] = effects[k].constrs
    })
    return output
}

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
        decorators: ctx.library.decorators.defns,
        effectConstrNames: ctx.library.effects.constructors.idToNames,
        effectConstructors: converEffectConstructors(ctx.library.effects.constructors.names),
        effectNames: toIdNames(ctx.library.effects.names),
        effects: convertEffects(ctx.library.effects.defns),
        exportedTerms: {},
        idNames,
        metaData: {},
        names: ctx.library.terms.names,
        recordGroups: ctx.library.types.constructors.idToNames,
        rng: () => 0.0,
        terms: ctx.library.terms.defns,
        typeNames: ctx.library.types.names,
        types: ctx.library.types.defns,
    };
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
