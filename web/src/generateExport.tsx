import { idName, idFromName, ToplevelT } from '@jerd/language/src/typing/env';
import { Env, Id, nullLocation } from '@jerd/language/src/typing/types';
import { toplevelToPretty } from '@jerd/language/src/printing/printTsLike';
import { printToString } from '@jerd/language/src/printing/printer';
import {
    expressionDeps,
    expressionTypeDeps,
} from '@jerd/language/src/typing/analyze';

export const generateExport = (env: Env, id: Id, hideIds: boolean = true) => {
    const typesInOrder: Array<ToplevelT> = expressionTypeDeps(env, [
        env.global.terms[idName(id)],
    ]).map(
        (idRaw): ToplevelT => {
            const defn = env.global.types[idRaw];
            const name = env.global.idNames[idRaw];
            if (defn.type === 'Record') {
                return {
                    type: 'RecordDef',
                    attrNames: env.global.recordGroups[idRaw],
                    def: defn,
                    id: idFromName(idRaw),
                    location: nullLocation,
                    name,
                };
            } else {
                return {
                    type: 'EnumDef',
                    def: defn,
                    id: idFromName(idRaw),
                    location: nullLocation,
                    inner: [],
                    name,
                };
            }
        },
    );
    const depsInOrder: Array<ToplevelT> = expressionDeps(env, [
        env.global.terms[idName(id)],
    ])
        .concat([idName(id)])
        .map((idRaw) => ({
            type: 'Define',
            id: idFromName(idRaw),
            term: env.global.terms[idRaw],
            location: nullLocation,
            name: env.global.idNames[idRaw],
        }));
    const items = typesInOrder
        .concat(depsInOrder)
        .map((top) => toplevelToPretty(env, top));
    return items.map((pp) => printToString(pp, 100, { hideIds })).join('\n\n');
};
