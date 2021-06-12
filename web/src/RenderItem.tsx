/** @jsx jsx */
import { jsx } from '@emotion/react';
// Ok

import * as React from 'react';
import { idName, idFromName, ToplevelT } from '@jerd/language/src/typing/env';
import {
    Env,
    Float,
    Id,
    Location,
    Term,
} from '@jerd/language/src/typing/types';
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
    TopContent,
} from './State';
import { RenderResult } from './RenderResult';
import { getToplevel, updateToplevel } from './toplevels';
import { Position } from './Cells';
import { addLocationIndices } from '../../language/src/typing/analyze';
import { transform, walkTerm } from '../../language/src/typing/transform';
import { IconButton } from './display/OpenGL';

const onClick = (
    env: Env,
    cell: Cell,
    addCell: (c: Content, p: Position) => void,
    setScrub: (s: Scrub) => void,
    term: Term | null,
    value: any,
) => (evt: React.MouseEvent, id: string, kind: string, loc?: Location) => {
    console.log(kind, id, loc);
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
    } else if (kind === 'float' && term != null && loc && loc.idx != null) {
        const literal = findByIndex(term, loc.idx);
        if (!literal) {
            console.log('notfound by index');
            return false;
        }
        if (literal.type !== 'float') {
            console.error('found not a float');
            return false;
        }
        const parent = (evt.target as HTMLElement).offsetParent!;
        const box = parent.getBoundingClientRect();
        const thisBox = (evt.target as HTMLElement).getBoundingClientRect();

        setScrub({
            term,
            returnValue: value,
            scrubbed: literal.value,
            original: literal,
            pos: {
                left: thisBox.left - box.left,
                top: thisBox.bottom - box.top,
            },
            loc,
        });
        return true;
    }
    return false;
};

const findByIndex = (term: Term, idx: number): Term | null => {
    let found: null | Term = null;
    walkTerm(term, (t) => {
        if (t.type !== 'Let' && t.location.idx === idx) {
            found = t;
            return false;
        }
    });
    return found;
};

export type Props = {
    env: Env;
    cell: Cell;
    maxWidth: number;
    plugins: RenderPlugins;
    content: TopContent;
    evalEnv: EvalEnv;
    onRun: (id: Id) => void;
    addCell: (content: Content, position: Position) => void;
    onEdit: () => void;
    onSetPlugin: (display: Display | null) => void;
    onPin: (display: Display, id: Id) => void;
    onChange: (toplevel: ToplevelT) => void;
};

export type Scrub = {
    term: Term;
    returnValue: any;
    loc: Location;
    pos: { left: number; top: number };
    // TODO generalize
    scrubbed: number;
    original: Float;
};

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

    onSetPlugin,
    onChange,
    onPin,
}: Props) => {
    let top = getToplevel(env, content);
    top = addLocationIndices(top);
    const term =
        top.type === 'Define' || top.type === 'Expression' ? top.term : null;
    const [scrub, setScrub] = React.useState(null as null | Scrub);
    const value = evalEnv.terms[idName(content.id)];

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
                    printToAttributedText(toplevelToPretty(env, top), maxWidth),
                    onClick(env, cell, addCell, setScrub, term, value),
                    undefined,
                    undefined,
                    (id, kind) =>
                        [
                            'term',
                            'type',
                            'as',
                            'record',
                            'custom-binop',
                            'float',
                        ].includes(kind),
                )}
                {scrub ? (
                    <div
                        css={{
                            position: 'absolute',
                            padding: '4px 8px',
                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                            // color: 'black',
                            borderRadius: 4,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                        style={{
                            left: scrub.pos.left,
                            top: scrub.pos.top + 4,
                        }}
                        onMouseDown={(evt) => evt.stopPropagation()}
                        onClick={(evt) => evt.stopPropagation()}
                    >
                        <input
                            type="range"
                            min={scrub.original.value / 2.0}
                            max={scrub.original.value * 2.0}
                            value={scrub.scrubbed}
                            onChange={(evt) => {
                                const value = +evt.target.value;
                                const term = transform(scrub.term, {
                                    term: (t) => {
                                        if (
                                            t.location.idx ===
                                            scrub.original.location.idx
                                        ) {
                                            return {
                                                ...scrub.original,
                                                value,
                                            };
                                        }
                                        return null;
                                    },
                                    let: (l) => null,
                                });
                                setScrub({
                                    ...scrub,
                                    term,
                                    scrubbed: value,
                                });
                            }}
                        />
                        {scrub.scrubbed}
                        <IconButton
                            icon="done"
                            onClick={() => {
                                onChange({
                                    ...top,
                                    term: scrub.term,
                                });
                                setScrub(null);
                                // change the term to be this term ...
                            }}
                        />
                        <IconButton
                            icon="cancel"
                            onClick={() => {
                                setScrub(null);
                            }}
                        />
                    </div>
                ) : null}
            </div>
            {term ? (
                <RenderResult
                    onSetPlugin={onSetPlugin}
                    onPin={onPin}
                    cell={cell}
                    term={scrub ? scrub.term : term}
                    value={scrub ? scrub.returnValue : value}
                    plugins={plugins}
                    id={content.id}
                    env={env}
                    evalEnv={evalEnv}
                    onRun={onRun}
                />
            ) : null}
        </div>
    );
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
