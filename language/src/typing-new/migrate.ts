import { idName } from '../typing/env';
import * as typed from '../typing/types';
import { Context } from './Context';

export const ctxToGlobalEnv = (ctx: Context): typed.GlobalEnv => {
    const idNames: { [key: string]: string } = {};
    const addNames = (names: { [key: string]: Array<typed.Id> }) => {
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
        builtinTypes: {},
        builtins: {},
        decoratorNames: ctx.library.decorators.names,
        decorators: ctx.library.decorators.defns,
        effectConstrNames: ctx.library.effects.constructors.idToNames,
        effectConstructors: {},
        effectNames: {},
        effects: {},
        exportedTerms: {},
        idNames,
        metaData: {},
        names: {},
        recordGroups: ctx.library.types.constructors.idToNames,
        rng: () => 0.0,
        terms: ctx.library.terms.defns,
        typeNames: ctx.library.types.names,
        types: ctx.library.types.defns,
    };
};

export const ctxToEnv = (ctx: Context): typed.Env => {
    return {
        depth: 0,
        term: {
            localNames: {},
            nextTraceId: 0,
        },
        global: ctxToGlobalEnv(ctx),
        local: typed.newLocal(),
    };
};
