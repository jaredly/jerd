import { idName, idFromName } from '@jerd/language/src/typing/env';
import {
    ToplevelT,
    ToplevelDefine,
    ToplevelDecorator,
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
    getUsedDecorators,
} from '@jerd/language/src/typing/analyze';
import { Display } from '../State';

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

    const decorators = getUsedDecorators(depsInOrder.map((t) => t.term)).map(
        (id): ToplevelDecorator => ({
            type: 'Decorator',
            defn: env.global.decorators[idName(id)],
            id,
            location: nullLocation,
            name: env.global.idNames[idName(id)],
        }),
    );

    const items = typesInOrder
        .concat(decorators)
        .concat(depsInOrder)
        .map((top) => {
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
