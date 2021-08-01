/** @jsx jsx */
import { Interpolation, jsx, Theme } from '@emotion/react';
import {
    Extra,
    printToAttributedText,
    SourceItem,
    SourceMap,
} from '@jerd/language/src/printing/printer';
import {
    toplevelToPretty,
    typeToPretty,
} from '@jerd/language/src/printing/printTsLike';
import {
    addExpr,
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
    getTermByIdx,
    isAtomic,
    makeIdxTree,
} from '../../language/src/typing/analyze';
import { showType } from '../../language/src/typing/unify';
import { Position } from './Cells';
import { MenuItem } from './CellWrapper';
import { runTerm } from './eval';
import { FilterMenu } from './FilterMenu';
import { bindKeys } from './KeyBindings';
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
    onFocus: () => void;
    onRun: (id: Id) => void;
    addCell: (
        content: Content,
        position: Position,
        updateEnv?: (e: Env) => Env,
    ) => void;
    onEdit: () => void;
    onSetPlugin: (display: Display | null) => void;
    onPin: (display: Display, id: Id) => void;
    onChange: (toplevel: ToplevelT) => void;
    onPending: (term: Term) => void;
};

// const;

export type Selection = {
    inner: boolean;
    idx: number;
    marks: Array<number>;
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
    focused,
    onFocus,
    maxWidth,

    onSetPlugin,
    onChange,
    onPending,
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
        let idxTree = null;
        if (term) {
            try {
                idxTree = makeIdxTree(term);
            } catch (err) {
                console.error(err);
            }
        }
        return [top, term, term ? idxTree : null, attributedText, sourceMap];
    }, [env, content, maxWidth]);

    // window.things = { term, idxTree, sourceMap };
    // console.log(sourceMap);

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

    const [selection, setSelection_] = React.useState({
        inner: false,
        idx: 0,
        marks: [],
    } as Selection);
    const setIdx: (
        fn: number | ((idx: number) => number),
    ) => void = React.useCallback(
        (idx) => {
            setSelection_((sel) => ({
                ...sel,
                idx: typeof idx === 'number' ? idx : idx(sel.idx),
            }));
            if (!focused) {
                onFocus();
            }
        },
        [setSelection_, onFocus, focused],
    );

    const [menu, setMenu] = React.useState(null as null | Array<MenuItem>);
    const [getString, setGetString] = React.useState(
        null as null | { prompt: string; action: (v: string) => void },
    );

    const cidxTree = React.useRef(idxTree);
    cidxTree.current = idxTree;

    React.useEffect(() => {
        if (!focused || !idxTree || !term) {
            return;
        }

        const addTerm = (newTerm: Term, newName: string) =>
            addCell(
                {
                    type: 'term',
                    id: idFromName(hashObject(newTerm)),
                },
                { type: 'after', id: cell.id },
                (env) => {
                    const res = addExpr(env, newTerm, null);
                    return {
                        ...res.env,
                        global: {
                            ...res.env.global,
                            idNames: {
                                ...res.env.global.idNames,
                                [idName(res.id)]: newName,
                            },
                        },
                    };
                },
            );

        const fn = bindKeys(
            idxTree,
            sourceMap,
            env,
            term,
            setIdx,
            setSelection_,
            setMenu,
            addTerm,
            onPending,
        );
        window.addEventListener('keydown', fn, true);
        return () => window.removeEventListener('keydown', fn, true);
    }, [focused, idxTree, term]);

    const selectedTerm = term ? getTermByIdx(term, selection.idx) : null;

    // console.log('SEL', selection);

    return (
        <div css={{ position: 'relative' }}>
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
                    (evt, id, kind, loc) => {
                        if (!evt.metaKey) {
                            if (loc && loc.idx) {
                                setSelection_((sel) => ({
                                    idx: loc.idx!,
                                    marks: sel.marks,
                                    inner: true,
                                }));
                                onFocus();
                                // setIdx(loc.idx);
                            }
                            // Just selection
                            return true;
                        }

                        return onClick(
                            env,
                            cell,
                            addCell,
                            setScrub,
                            term,
                            value,
                            setIdx,
                        )(evt, id, kind, loc);
                    },
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
                    selection,
                )}
                {scrub
                    ? renderScrub(
                          env,
                          top,
                          scrub,
                          update,
                          setScrub,
                          onPending,
                          evalEnv,
                      )
                    : null}
                {hover ? renderHover(env, hover) : null}
            </div>
            {term ? (
                <RenderResult
                    onSetPlugin={onSetPlugin}
                    focused={focused}
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
            {getString ? (
                <div css={menuOverlay}>
                    <GetString
                        getString={getString}
                        onClose={() => setGetString(null)}
                    />
                </div>
            ) : null}
            {menu ? (
                <div css={menuOverlay}>
                    <FilterMenu
                        items={menu}
                        setGetString={setGetString}
                        onClose={() => setMenu(null)}
                    />
                </div>
            ) : null}
            {selectedTerm ? (
                <div>
                    {renderAttributedText(
                        env.global,
                        printToAttributedText(
                            typeToPretty(env, selectedTerm.is),
                            maxWidth,
                        ),
                    )}
                </div>
            ) : null}
        </div>
    );
};

export const GetString = ({
    getString: { prompt, action },
    onClose,
}: {
    getString: { prompt: string; action: (v: string) => void };
    onClose: () => void;
}) => {
    const [text, setText] = React.useState('');
    return (
        <input
            placeholder={prompt}
            autoFocus
            value={text}
            onChange={(evt) => setText(evt.target.value)}
            onKeyDown={(evt) => {
                evt.stopPropagation();
                if (evt.key === 'Enter') {
                    if (text !== '') {
                        action(text);
                    }
                    return onClose();
                }
                if (evt.key === 'Escape') {
                    onClose();
                }
            }}
            css={{
                padding: 4,
                backgroundColor: '#555',
                color: '#fff',
            }}
        />
    );
};

const menuOverlay: Interpolation<Theme> = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.8)',
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
