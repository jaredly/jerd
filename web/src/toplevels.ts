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
} from '@jerd/language/src/typing/env';
import { EnumDef, Env, nullLocation } from '@jerd/language/src/typing/types';
import { Content } from './State';

export const getToplevel = (env: Env, content: Content): ToplevelT => {
    if (content.type === 'term') {
        const name = env.global.idNames[idName(content.id)];
        if (name == null) {
            return {
                type: 'Expression',
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
        };
    }
    throw new Error(`unsupported toplevel`);
};

export const updateToplevel = (
    env: Env,
    term: ToplevelT,
    prevContent?: Content,
): { env: Env; content: Content } => {
    if (term.type === 'Expression') {
        const pid = null;
        // prevContent.type === 'expr' || prevContent.type === 'term'
        //     ? prevContent.id
        //     : null;
        let { id, env: nenv } = addExpr(env, term.term, pid);
        return { content: { type: 'term', id: id }, env: nenv };
    } else if (term.type === 'Define') {
        const { id, env: nenv } = addDefine(env, term.name, term.term);
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
