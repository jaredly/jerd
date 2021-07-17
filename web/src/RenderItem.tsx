/** @jsx jsx */
import { jsx } from '@emotion/react';
import {
    Extra,
    printToAttributedText,
} from '@jerd/language/src/printing/printer';
import { toplevelToPretty } from '@jerd/language/src/printing/printTsLike';
import { idFromName, idName, ToplevelT } from '@jerd/language/src/typing/env';
import {
    Env,
    Float,
    Id,
    Location,
    Term,
} from '@jerd/language/src/typing/types';
// Ok
import * as React from 'react';
import { addLocationIndices } from '../../language/src/typing/analyze';
import { walkTerm } from '../../language/src/typing/transform';
import { showType } from '../../language/src/typing/unify';
import { Position } from './Cells';
import { renderAttributedText } from './Render';
import { RenderResult } from './RenderResult';
import { detectColor4Scrub, detectColorScrub } from './Scrubbers/Color';
import { detectVec2Scrub } from './Scrubbers/Position';
import { renderScrub, Scrub } from './Scrubbers/Scrub';
import {
    Cell,
    Content,
    Display,
    EvalEnv,
    RenderPlugins,
    TopContent,
} from './State';
import { getToplevel } from './toplevels';

const detectors = [detectVec2Scrub, detectColorScrub, detectColor4Scrub];

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

    if (term != null && loc != null && loc.idx != null) {
        for (let detector of detectors) {
            const item = detector(kind, id, term, loc.idx);
            if (item != null) {
                const parent = (evt.target as HTMLElement).offsetParent!;
                const box = parent.getBoundingClientRect();
                const thisBox = (evt.target as HTMLElement).getBoundingClientRect();

                setScrub({
                    term,
                    returnValue: value,
                    item,
                    pos: {
                        left: thisBox.left - box.left,
                        top: thisBox.bottom - box.top,
                    },
                });
                return true;
            }
        }
    }

    if (kind === 'term' || kind === 'as') {
        addCell(
            {
                type: 'term',
                id: idFromName(id),
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
            item: {
                type: 'float',
                x: {
                    scrubbed: literal.value,
                    original: literal,
                    loc,
                },
            },
            pos: {
                left: thisBox.left - box.left,
                top: thisBox.bottom - box.top,
            },
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

const RenderItem_ = ({
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
    let [top, term] = React.useMemo(() => {
        let top = getToplevel(env, content);
        top = addLocationIndices(top);
        const term =
            top.type === 'Define' || top.type === 'Expression'
                ? top.term
                : null;
        return [top, term];
    }, [env, content]);
    const [scrub, setScrub] = React.useState(null as null | Scrub);
    const value = evalEnv.terms[idName(content.id)];
    const [hover, setHover] = React.useState(
        null as null | [Extra, HTMLDivElement],
    );

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
                    (extra: Extra, target: HTMLDivElement | null) => {
                        if (target) {
                            setHover([extra, target]);
                        } else if (hover) {
                            setHover(null);
                        }
                    },
                )}
                {scrub
                    ? renderScrub(env, top, scrub, setScrub, onChange, evalEnv)
                    : null}
                {hover ? renderHover(env, hover) : null}
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

const renderHover = (env: Env, hover: [Extra, HTMLDivElement]) => {
    const box = hover[1].getBoundingClientRect();
    const pbox = hover[1].offsetParent!.getBoundingClientRect();
    return (
        <div
            css={{
                position: 'absolute',
                backgroundColor: 'black',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                color: 'white',
                padding: 8,
                pointerEvents: 'none',
            }}
            style={{
                top: box.bottom - pbox.top + 4,
                left: box.left - pbox.left,
            }}
        >
            Expected:
            <br />
            {showType(env, hover[0].expected)}
            <br />
            Found:
            <br />
            {showType(env, hover[0].found)}
        </div>
    );
};

export const RenderItem = React.memo(RenderItem_);

const enumContent = (env: Env, rawId: string): Content => {
    return {
        type: 'enum',
        id: idFromName(rawId),
    };
};

const recordContent = (env: Env, rawId: string): Content => {
    return {
        type: 'record',
        id: idFromName(rawId),
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
