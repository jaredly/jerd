/** @jsx jsx */
import { jsx } from '@emotion/react';
import {
    Extra,
    printToAttributedText,
    SourceItem,
    SourceMap,
} from '@jerd/language/src/printing/printer';
import { toplevelToPretty } from '@jerd/language/src/printing/printTsLike';
import {
    hashObject,
    idFromName,
    idName,
    ToplevelT,
} from '@jerd/language/src/typing/env';
import { Env, Id, Location, Term } from '@jerd/language/src/typing/types';
import * as React from 'react';
// import { Location } from '../../language/src/parsing/parser';
import {
    addLocationIndices,
    isAtomic,
    makeIdxTree,
} from '../../language/src/typing/analyze';
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
    focused: boolean;
    onRun: (id: Id) => void;
    addCell: (content: Content, position: Position) => void;
    onEdit: () => void;
    onSetPlugin: (display: Display | null) => void;
    onPin: (display: Display, id: Id) => void;
    onChange: (toplevel: ToplevelT) => void;
};

// const;

const RenderItem_ = ({
    env,
    cell,
    content,
    evalEnv,
    onRun,
    onEdit,
    addCell,
    plugins,
    focused,
    maxWidth,

    onSetPlugin,
    onChange,
    onPin,
}: Props) => {
    let [top, term, idxTree, attributedText, sourceMap] = React.useMemo(() => {
        let top = getToplevel(env, content);
        top = addLocationIndices(top);
        const term =
            top.type === 'Define' || top.type === 'Expression'
                ? top.term
                : null;
        const sourceMap: SourceMap = {};
        const attributedText = printToAttributedText(
            toplevelToPretty(env, top),
            maxWidth,
            undefined,
            sourceMap,
        );
        return [
            top,
            term,
            term ? makeIdxTree(term) : null,
            attributedText,
            sourceMap,
        ];
    }, [env, content, maxWidth]);

    console.log(sourceMap);

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

    const [idx, setIdx] = React.useState(0);

    const cidxTree = React.useRef(idxTree);
    cidxTree.current = idxTree;

    React.useEffect(() => {
        if (!focused || !idxTree) {
            return;
        }

        // const locLines: Array<Array<Location>> = [];
        // Object.keys(sourceMap).forEach((name: unknown) => {
        //     locLines[name as number]
        // })

        const locLines: Array<Array<SourceItem>> = [];
        Object.keys(sourceMap).forEach((idx: unknown) => {
            const loc = sourceMap[idx as number];
            if (!isAtomic(idxTree!.locs[idx as number].kind)) {
                console.log(
                    'skip',
                    idx,
                    loc,
                    idxTree!.locs[idx as number].kind,
                );
                return;
            }
            if (locLines[loc.start.line]) {
                locLines[loc.start.line].push(loc);
            } else {
                locLines[loc.start.line] = [loc];
            }
        });
        locLines.forEach((line) =>
            line.sort((a, b) => a.start.column - b.start.column),
        );
        console.log('LINES');
        console.log(locLines);
        window.ddata = { locLines, idxTree };

        const fn = (evt: KeyboardEvent) => {
            const { locs, parents, children } = idxTree!;

            /*
            Ok what's my deal here
            - hm maybe only show the atomic things
            - but hm
            */
            console.log(evt.key);
            if (evt.key === 'ArrowUp') {
                setIdx((idx) => {
                    if (!locs[idx]) {
                        console.log('wat', idx, locs);
                        return idx;
                    }
                    const pos = sourceMap[idx];
                    if (pos.start.line === 0) {
                        return idx;
                    }
                    for (let lno = pos.start.line - 1; lno >= 0; lno--) {
                        const line = locLines[lno];
                        if (!line) {
                            continue;
                        }
                        for (let i = 0; i < line.length; i++) {
                            if (line[i].start.column > pos.start.column) {
                                console.log(line[i], line);
                                return line[Math.max(0, i - 1)].idx;
                            }
                        }
                        if (line.length > 0) {
                            return line[0].idx;
                        }
                    }

                    return idx;
                });
            }

            if (evt.key === 'ArrowDown') {
                setIdx((idx) => {
                    const pchildren = children[idx];
                    if (pchildren) {
                        return pchildren[0];
                    }
                    return idx;
                });
            }

            if (evt.key === 'ArrowRight') {
                setIdx((idx) => {
                    const parent = parents[idx];
                    if (parent) {
                        const pchildren = children[parent];
                        const i0 = pchildren.indexOf(idx);
                        if (i0 < pchildren.length - 1) {
                            return pchildren[i0 + 1];
                        }
                    }
                    return idx;
                });
            }
            if (evt.key === 'ArrowLeft') {
                setIdx((idx) => {
                    const parent = parents[idx];
                    if (parent) {
                        const pchildren = children[parent];
                        const i0 = pchildren.indexOf(idx);
                        if (i0 < pchildren.length - 1) {
                            return pchildren[i0 + 1];
                        }
                    }
                    return idx;
                });
            }
        };
        window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, [focused, idxTree]);

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
                    attributedText,
                    onClick(env, cell, addCell, setScrub, term, value, setIdx),
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
                    idx,
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
