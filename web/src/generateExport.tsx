import {
    idName,
    idFromName,
    ToplevelT,
    ToplevelDefine,
} from '@jerd/language/src/typing/env';
import {
    Env,
    Id,
    idsEqual,
    nullLocation,
} from '@jerd/language/src/typing/types';
import {
    termToPretty,
    toplevelToPretty,
} from '@jerd/language/src/printing/printTsLike';
import * as pp from '@jerd/language/src/printing/printer';
import {
    expressionDeps,
    expressionTypeDeps,
} from '@jerd/language/src/typing/analyze';
import { Display } from './State';

export const generateExport = (
    env: Env,
    id: Id,
    hideIds: boolean = true,
    display?: Display | null,
) => {
    const depsInOrder: Array<ToplevelDefine> = expressionDeps(env, [
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
    const typesInOrder: Array<ToplevelT> = expressionTypeDeps(
        env,
        depsInOrder.map((t) => t.term),
    ).map(
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
    const items = typesInOrder.concat(depsInOrder).map((top) => {
        if (top.type === 'Define' && idsEqual(id, top.id) && display) {
            return pp.items([
                pp.atom(`@display("${display.type}")\n`),
                termToPretty(env, top.term),
            ]);
        } else {
            return toplevelToPretty(env, top);
        }
    });
    return items
        .map((item) => pp.printToString(item, 100, { hideIds }))
        .join(';\n\n');
};
