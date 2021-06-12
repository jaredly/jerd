/** @jsx jsx */
import { jsx } from '@emotion/react';
// Ok

import * as React from 'react';
import { idName, idFromName } from '@jerd/language/src/typing/env';
import { Env, Id } from '@jerd/language/src/typing/types';
import { toplevelToPretty } from '@jerd/language/src/printing/printTsLike';
import { printToAttributedText } from '@jerd/language/src/printing/printer';
import Editor from './Editor';
import { termToJS } from './eval';
import { renderAttributedText } from './Render';
import {
    Cell,
    Content,
    Display,
    EvalEnv,
    RenderPlugins,
    RenderPluginT,
} from './State';
import { RenderResult } from './RenderResult';
import { getToplevel, updateToplevel } from './toplevels';
import { Position } from './Cells';
import { addLocationIndices } from '../../language/src/typing/analyze';

export const RenderItem = ({
    env,
    cell,
    content,
    evalEnv,
    onRun,
    onEdit,
    addCell,
    plugins,
    maxWidth,

    collapsed,
    setCollapsed,
    onSetPlugin,
    onPin,
}: {
    env: Env;
    cell: Cell;
    maxWidth: number;
    plugins: RenderPlugins;
    content: Content;
    evalEnv: EvalEnv;
    onRun: (id: Id) => void;
    addCell: (content: Content, position: Position) => void;
    onEdit: () => void;
    collapsed: boolean | undefined;
    setCollapsed: (n: boolean) => void;
    onSetPlugin: (display: Display | null) => void;
    onPin: (display: Display, id: Id) => void;
}) => {
    const onClick = (id: string, kind: string) => {
        console.log(kind);
        const position: Position = { type: 'after', id: cell.id };
        if (kind === 'term' || kind === 'as') {
            addCell(
                {
                    type: 'term',
                    id: idFromName(id),
                    name: env.global.idNames[id],
                },
                position,
            );
            return true;
        } else if (kind === 'type') {
            if (env.global.types[id].type === 'Record') {
                addCell(recordContent(env, id), position);
                return true;
            } else {
                addCell(enumContent(env, id), position);
                return true;
            }
        } else if (kind === 'record') {
            addCell(recordContent(env, id), position);
            return true;
        } else if (kind === 'custom-binop') {
            const [term, type, idx] = id.split('#');
            if (!env.global.terms[term]) {
                return false;
            }
            addCell(
                {
                    type: 'term',
                    id: idFromName(term),
                    name: env.global.idNames[term],
                },
                position,
            );
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
        let top = getToplevel(env, content);
        top = addLocationIndices(top);
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
                        undefined,
                        undefined,
                        (id, kind) =>
                            [
                                'term',
                                'type',
                                'as',
                                'record',
                                'custom-binop',
                            ].includes(kind),
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

const styles = {
    hash: {
        position: 'absolute',
        top: 8,
        right: 8,
        fontSize: '80%',
        color: 'rgba(255,255,255,0.5)',
    },
};
