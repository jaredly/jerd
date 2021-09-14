/** @jsx jsx */
import { jsx } from '@emotion/react';
// Ok

import * as React from 'react';
import {
    addExpr,
    addDefine,
    addRecord,
    addEnum,
    idName,
    addEffect,
    ToplevelT,
    ToplevelDefine,
} from '@jerd/language/src/typing/env';
import {
    EnumDef,
    Env,
    Id,
    nullLocation,
} from '@jerd/language/src/typing/types';
import { Content, TopContent } from './State';

export const getToplevel = (env: Env, content: TopContent): ToplevelT => {
    if (content.type === 'term') {
        if (content.proposed) {
            return content.proposed;
        }
        const name = env.global.idNames[idName(content.id)];
        if (name == null) {
            return {
                type: 'Expression',
                id: content.id,
                term: env.global.terms[idName(content.id)],
                location: nullLocation,
            };
        } else {
            return {
                type: 'Define',
                name: name,
                term: env.global.terms[idName(content.id)],
                id: content.id,
                location: nullLocation,
            };
        }
    }
    if (content.type === 'record') {
        const name = env.global.idNames[idName(content.id)];
        const defn = env.global.types[idName(content.id)];
        if (!defn) {
            throw new Error(`No type info!`);
        }
        if (defn.type !== 'Record') {
            throw new Error(`Type is not a record`);
        }
        return {
            type: 'RecordDef',
            def: defn,
            name: name,
            attrNames: env.global.recordGroups[idName(content.id)],
            location: nullLocation,
            id: content.id,
        };
    }
    if (content.type === 'effect') {
        const name = env.global.idNames[idName(content.id)];
        return {
            type: 'Effect',
            constrNames: env.global.effectConstrNames[idName(content.id)],
            name: name,
            location: nullLocation,
            id: content.id,
            effect: {
                type: 'EffectDef',
                constrs: env.global.effects[idName(content.id)],
                location: nullLocation,
            },
        };
    }
    if (content.type === 'enum') {
        return {
            type: 'EnumDef',
            def: env.global.types[idName(content.id)] as EnumDef,
            name: env.global.idNames[idName(content.id)],
            location: nullLocation,
            id: content.id,
            inner: [],
        };
    }
    console.log(content);
    throw new Error(`unsupported toplevel`);
};

const getPidToOverride = (
    env: Env,
    term: ToplevelDefine,
    prevContent: undefined | Content,
): Id | undefined => {
    if (!prevContent || prevContent.type !== 'term') {
        return;
    }
    const prevName = env.global.idNames[idName(prevContent.id)];
    if (prevName === term.name) {
        return prevContent.id;
    }
    return;
};

export const updateToplevel = (
    env: Env,
    term: ToplevelT,
    prevContent?: Content,
): { env: Env; content: Content } => {
    if (term.type === 'Expression') {
        const pid = prevContent?.type === 'term' ? prevContent.id : null;
        let { id, env: nenv } = addExpr(env, term.term, pid);
        return { content: { type: 'term', id: id }, env: nenv };
    } else if (term.type === 'Define') {
        const pid = getPidToOverride(env, term, prevContent);
        const { id, env: nenv } = addDefine(env, term.name, term.term, pid);
        return {
            content: { type: 'term', id: id },
            env: nenv,
        };
    } else if (term.type === 'RecordDef') {
        const { id, env: nenv } = addRecord(
            env,
            term.name,
            term.attrNames,
            term.def,
        );
        return {
            content: {
                type: 'record',
                id: id,
            },
            env: nenv,
        };
    } else if (term.type === 'EnumDef') {
        term.inner.forEach((record) => {
            ({ env } = addRecord(
                env,
                record.name,
                record.attrNames,
                record.def,
            ));
        });
        const { id, env: nenv } = addEnum(env, term.name, term.def);
        return {
            content: {
                type: 'enum',
                id: id,
            },
            env: nenv,
        };
    } else if (term.type === 'Effect') {
        const { env: nenv, id } = addEffect(
            env,
            term.name,
            term.constrNames,
            term.effect,
        );
        return {
            content: {
                type: 'effect',
                id: id,
            },
            env: nenv,
        };
    } else {
        throw new Error('toplevel type not yet supported');
    }
};
