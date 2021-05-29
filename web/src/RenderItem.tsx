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
    idFromName,
} from '@jerd/language/src/typing/env';
import {
    EnumDef,
    Env,
    Id,
    RecordDef,
    selfEnv,
    Term,
    Type,
} from '@jerd/language/src/typing/types';
import {
    declarationToPretty,
    termToPretty,
    ToplevelT,
    toplevelToPretty,
} from '@jerd/language/src/printing/printTsLike';
import { printToAttributedText } from '@jerd/language/src/printing/printer';
import Editor from './Editor';
import { termToJS } from './eval';
import { renderAttributedText } from './Render';
import { Cell, Content, Display, EvalEnv, Plugins, PluginT } from './State';
import { RenderResult } from './RenderResult';
import { getToplevel, updateToplevel } from './toplevels';

export const RenderItem = ({
    env,
    cell,
    content,
    evalEnv,
    onRun,
    onEdit,
    addCell,
    plugins,
    showSource,
    maxWidth,

    collapsed,
    setCollapsed,
    onSetPlugin,
    onPin,
}: {
    env: Env;
    cell: Cell;
    maxWidth: number;
    plugins: Plugins;
    content: Content;
    evalEnv: EvalEnv;
    showSource: boolean;
    onRun: (id: Id) => void;
    addCell: (content: Content) => void;
    onEdit: () => void;
    collapsed: boolean | undefined;
    setCollapsed: (n: boolean) => void;
    onSetPlugin: (display: Display | null) => void;
    onPin: (display: Display, id: Id) => void;
}) => {
    const onClick = (id: string, kind: string) => {
        console.log(kind);
        if (kind === 'term' || kind === 'as') {
            addCell({
                type: 'term',
                id: idFromName(id),
                name: env.global.idNames[id],
            });
            return true;
        } else if (kind === 'type') {
            if (env.global.types[id].type === 'Record') {
                addCell(recordContent(env, id));
                return true;
            } else {
                addCell(enumContent(env, id));
                return true;
            }
        } else if (kind === 'record') {
            addCell(recordContent(env, id));
            return true;
        }
        return false;
    };

    if (content.type === 'raw') {
        return (
            <div
                onClick={() => onEdit()}
                style={{
                    fontFamily: '"Source Code Pro", monospace',
                    whiteSpace: 'pre-wrap',
                    position: 'relative',
                    cursor: 'pointer',
                    padding: 8,
                }}
            >
                {content.text.trim() === '' ? '[empty]' : content.text}
            </div>
        );
    } else {
        const top = getToplevel(env, content);
        const term =
            content.type === 'expr' || content.type === 'term'
                ? env.global.terms[idName(content.id)]
                : null;
        return (
            <div>
                <div
                    style={{
                        fontFamily: '"Source Code Pro", monospace',
                        whiteSpace: 'pre-wrap',
                        position: 'relative',
                        cursor: 'pointer',
                        padding: 8,
                    }}
                    onClick={() => onEdit()}
                >
                    {renderAttributedText(
                        env.global,
                        printToAttributedText(
                            toplevelToPretty(env, top),
                            maxWidth,
                        ),
                        onClick,
                    )}
                </div>
                {term ? (
                    <RenderResult
                        onSetPlugin={onSetPlugin}
                        onPin={onPin}
                        cell={cell}
                        plugins={plugins}
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                        id={content.id}
                        env={env}
                        evalEnv={evalEnv}
                        onRun={onRun}
                    />
                ) : null}
                {term && showSource ? (
                    <ViewSource
                        hash={idName(content.id)}
                        env={env}
                        term={term}
                    />
                ) : null}
            </div>
        );
    }
};

const enumContent = (env: Env, rawId: string): Content => {
    return {
        type: 'enum',
        id: idFromName(rawId),
        name: env.global.idNames[rawId],
    };
};

const recordContent = (env: Env, rawId: string): Content => {
    return {
        type: 'record',
        id: idFromName(rawId),
        name: env.global.idNames[rawId],
        attrs: env.global.recordGroups[rawId],
    };
};

const ViewSource = ({
    env,
    term,
    hash,
}: {
    env: Env;
    term: Term;
    hash: string;
}) => {
    const source = React.useMemo(() => {
        return termToJS(
            selfEnv(env, {
                type: 'Term',
                name: hash,
                ann: term.is,
            }),
            term,
            idFromName(hash),
            {},
        );
    }, [env, term]);
    return (
        <div
            css={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                lineHeight: 1.4,
                color: '#bbb',
                textShadow: '1px 1px 2px #000',
                padding: '8px 12px',
                background: '#333',
                borderRadius: '4px',
            }}
        >
            {source}
        </div>
    );
};

const styles = {
    hash: {
        position: 'absolute',
        top: 8,
        right: 8,
        fontSize: '80%',
        color: 'rgba(255,255,255,0.5)',
    },
};
