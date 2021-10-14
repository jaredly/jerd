import { idFromName, idName } from '../typing/env';
import {
    Id,
    GlobalEnv,
    EffectDef,
    Env,
    newLocal,
    nullLocation,
    MetaData as TMetaData,
    getAllSubTypes,
} from '../typing/types';
import { Context, emptyBindings, MetaData, NamedDefns } from './Context';

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

const emptyMeta: MetaData = { created: 0 };

export const convertMeta = (meta: TMetaData | null): MetaData =>
    meta
        ? {
              created: meta.createdMs,
              //   supercededBy: meta.supersededBy
              //       ? idFromName(meta.supersededBy)
              //       : undefined,
              basedOn: meta.basedOn ? idFromName(meta.basedOn) : undefined,
              author: meta.author,
              tags: meta.tags.length ? meta.tags : undefined,
              supercedes: meta.supersedes
                  ? idFromName(meta.supersedes)
                  : undefined,
          }
        : emptyMeta;

export const globalEnvToCtx = (env: GlobalEnv): Context => {
    const types: Context['library']['types'] = {
        constructors: {
            names: env.attributeNames,
            idToNames: env.recordGroups,
        },
        defns: mapObj(env.types, (defn, k) => ({
            defn,
            meta: convertMeta(env.metaData[k]),
        })),
        names: env.typeNames,
        // Soooo yes this is denormalization, is it fine? idk.
        superTypes: mapObj(env.types, (defn, k) => {
            if (defn.type === 'Record') {
                return getAllSubTypes(env.types, defn.extends);
            }
        }),
    };
    const terms: Context['library']['terms'] = {
        defns: mapObj(env.terms, (term, k) => ({
            meta: convertMeta(env.metaData[k]),
            defn: term,
        })),
        names: env.names,
    };
    const effects: Context['library']['effects'] = {
        defns: mapObj(env.effects, (constructors, k) => ({
            meta: convertMeta(env.metaData[k]),
            defn: {
                constrs: constructors,
                location: nullLocation,
                type: 'EffectDef',
            },
        })),
        names: mapObj(env.effectNames, (k) => k.map(idFromName)),
        constructors: {
            names: mapObj(env.effectConstructors, (k) => [
                { id: idFromName(k.idName), idx: k.idx },
            ]),
            idToNames: env.effectConstrNames,
        },
    };
    const decorators: Context['library']['decorators'] = {
        defns: mapObj(env.decorators, (defn, k) => ({
            defn,
            meta: convertMeta(env.metaData[k]),
        })),
        names: env.decoratorNames,
    };
    return {
        rng: env.rng,
        bindings: emptyBindings(),
        builtins: {
            types: env.builtinTypes,
            terms: env.builtins,
            decorators: {},
        },
        library: {
            types,
            terms,
            effects,
            decorators,
        },
        warnings: [],
    };
};

export const convertMetaBack = (meta: MetaData): TMetaData => {
    const metaData: TMetaData = {
        createdMs: meta.created,
        tags: meta.tags ? meta.tags : [],
    };
    // if (meta.supercededBy) {
    //     metaData[k].supersededBy = idName(meta.supercededBy);
    // }
    if (meta.basedOn) {
        metaData.basedOn = idName(meta.basedOn);
    }
    if (meta.supercedes) {
        metaData.supersedes = idName(meta.supercedes);
    }
    return metaData;
};

export const ctxToGlobalEnv = (ctx: Context): GlobalEnv => {
    const idNames: GlobalEnv['idNames'] = {};
    const metaData: GlobalEnv['metaData'] = {};
    const processNamed = <T>(named: NamedDefns<T>) => {
        Object.keys(named.defns).forEach((k) => {
            const meta = named.defns[k].meta;
            if (meta === emptyMeta) {
                return;
            }
            metaData[k] = convertMetaBack(meta);
        });
        Object.keys(named.names).forEach((name) =>
            named.names[name].forEach((id) => (idNames[idName(id)] = name)),
        );
    };
    processNamed(ctx.library.types);
    processNamed(ctx.library.terms);
    processNamed(ctx.library.effects);
    processNamed(ctx.library.decorators);
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
        metaData,
        names: ctx.library.terms.names,
        recordGroups: ctx.library.types.constructors.idToNames,
        rng: ctx.rng,
        terms: mapObj(ctx.library.terms.defns, (d) => d.defn),
        typeNames: ctx.library.types.names,
        types: mapObj(ctx.library.types.defns, (d) => d.defn),
    };
};

export const mapObj = <A, B>(
    a: { [key: string]: A },
    fn: (input: A, key: string) => B | undefined,
): { [key: string]: B } => {
    const res: { [key: string]: B } = {};
    Object.keys(a).forEach((k) => {
        const value = fn(a[k], k);
        if (value !== undefined) {
            res[k] = value;
        }
    });
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
