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
    if (content.type === 'expr') {
        return {
            type: 'Expression',
            term: env.global.terms[idName(content.id)],
            location: nullLocation,
        };
    }
    if (content.type === 'term') {
        return {
            type: 'Define',
            term: env.global.terms[idName(content.id)],
            id: content.id,
            location: nullLocation,
            name: content.name,
        };
    }
    if (content.type === 'record') {
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
            name: content.name,
            attrNames: content.attrs,
            location: nullLocation,
            id: content.id,
        };
    }
    if (content.type === 'effect') {
        return {
            type: 'Effect',
            constrNames: env.global.effectConstrNames[idName(content.id)],
            name: content.name,
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
            name: content.name,
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
        return { content: { type: 'expr', id: id }, env: nenv };
    } else if (term.type === 'Define') {
        const { id, env: nenv } = addDefine(env, term.name, term.term);
        return {
            content: { type: 'term', id: id, name: term.name },
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
                name: term.name,
                attrs: term.attrNames,
            },
            env: nenv,
        };
    } else if (term.type === 'EnumDef') {
        const { id, env: nenv } = addEnum(env, term.name, term.def);
        return {
            content: {
                type: 'enum',
                id: id,
                name: term.name,
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
                name: term.name,
                constrNames: term.constrNames,
            },
            env: nenv,
        };
    } else {
        throw new Error('toplevel type not yet supported');
    }
};
