/** @jsx jsx */
import { jsx } from '@emotion/react';
import {
    Extra,
    printToAttributedText,
} from '@jerd/language/src/printing/printer';
import { toplevelToPretty } from '@jerd/language/src/printing/printTsLike';
import {
    hashObject,
    idFromName,
    idName,
    ToplevelT,
} from '@jerd/language/src/typing/env';
import { Env, Id, Term } from '@jerd/language/src/typing/types';
import * as React from 'react';
import { addLocationIndices } from '../../language/src/typing/analyze';
import { showType } from '../../language/src/typing/unify';
import { Position } from './Cells';
import { runTerm } from './eval';
import { renderAttributedText } from './Render';
import { RenderResult } from './RenderResult';
import { onClick, renderScrub, Scrub, ScrubItem } from './Scrubbers/Scrub';
import {
    Cell,
    Content,
    Display,
    EvalEnv,
    RenderPlugins,
    TopContent,
} from './State';
import { getToplevel } from './toplevels';

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
    const update = React.useCallback(
        (term: Term, item: ScrubItem) => {
            if (!scrub) {
                return;
            }
            const id = idFromName(hashObject(term));
            const value = runTerm(env, term, id, evalEnv);
            setScrub({ ...scrub, term, item, returnValue: value[idName(id)] });
        },
        [setScrub, scrub],
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
                    ? renderScrub(
                          env,
                          top,
                          scrub,
                          update,
                          setScrub,
                          onChange,
                          evalEnv,
                      )
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

const styles = {
    hash: {
        position: 'absolute',
        top: 8,
        right: 8,
        fontSize: '80%',
        color: 'rgba(255,255,255,0.5)',
    },
};
