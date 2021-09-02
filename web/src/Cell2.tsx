/** @jsx jsx */
import { jsx } from '@emotion/react';
// The app

import * as React from 'react';
import {
    hashObject,
    idName,
    ToplevelT,
    typeToplevelT,
} from '@jerd/language/src/typing/env';
import {
    acceptProposed,
    CellProps,
    MovePosition,
    rejectProposed,
    Selection,
    updatePending,
    updateProposed,
} from './Cell';
import {
    Cell,
    Content,
    Display,
    EvalEnv,
    RawContent,
    RenderPlugins,
    TopContent,
} from './State';
import { runTerm } from './eval';
import { HistoryUpdate, Workspace } from './App';
import {
    Env,
    GlobalEnv,
    Id,
    newWithGlobal,
    nullLocation,
} from '../../language/src/typing/types';
import { WorkspacePicker } from './WorkspacePicker';
import { sortCells } from './Workspace';
import { Action as TopAction } from './Cells';
import { parse, Toplevel } from '../../language/src/parsing/parser';
import { addLocationIndices } from '../../language/src/typing/analyze';
import { getToplevel, updateToplevel } from './toplevels';
import { CellWrapper } from './CellWrapper';
import { cellTitle } from './cellTitle';
import { getMenuItems } from './getMenuItems';
import ColorTextarea from './ColorTextarea';
import { RenderItem } from './RenderItem';
import { printToString } from '../../language/src/printing/printer';
import { toplevelToPretty } from '../../language/src/printing/printTsLike';
import { RenderResult } from './RenderResult';

// hrmmmm can I move the selection dealio up a level? Should I? hmm I do like each cell managing its own cursor, tbh.

export type SelectionPos = 'start' | 'end' | 'change';
export type State =
    | {
          type: 'text';
          idx: number | null;
          selectionPos: SelectionPos;
          raw: string;
          node: HTMLElement | null;
          // May or may not have worked
          //   toplevel: ToplevelT | null;
      }
    | {
          type: 'normal';
          idx: number;
          marks: Array<number>;
          // TODO: "active"?
          // like, what?
      };

type Action =
    | { type: 'raw'; text: string }
    | { type: 'raw:close'; idx: number }
    | { type: 'selection'; idx: number; marks?: Array<number> }
    // | {type: 'edit-raw'}
    | {
          type: 'raw:selection';
          newSel: { idx: number; node: HTMLElement } | null;
      };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'raw:close': {
            return {
                type: 'normal',
                idx: action.idx,
                marks: [],
            };
        }
        case 'raw': {
            // const parsed =
            return {
                type: 'text',
                raw: action.text,
                selectionPos: 'change',
                // toplevel: null,
                idx: null,
                node: null,
            };
        }
        case 'raw:selection':
            return state.type === 'normal'
                ? state
                : {
                      ...state,
                      idx: action.newSel ? action.newSel.idx : state.idx,
                      node: action.newSel ? action.newSel.node : null,
                  };
        case 'selection':
            return state.type !== 'normal'
                ? state
                : {
                      ...state,
                      idx: action.idx,
                      marks: action.marks ?? state.marks,
                  };
    }
};

export const termForToplevel = (t: ToplevelT | null) =>
    t && (t.type === 'Expression' || t.type === 'Define') ? t.term : null;

const parseRaw = (raw: string, global: GlobalEnv) => {
    try {
        const parsed: Array<Toplevel> = parse(raw);
        if (parsed.length > 1) {
            return null;
        }
        return addLocationIndices(
            typeToplevelT(newWithGlobal(global), parsed[0], null),
        );
    } catch (err) {
        return null;
    }
};

const CellView_ = ({
    cell,
    env,
    maxWidth,
    focused,
    evalEnv,
    dispatch,
    plugins,
    getHistory,
}: CellProps) => {
    const [state, updateLocal] = React.useReducer(
        reducer,
        {},
        (_): State =>
            cell.content.type === 'raw'
                ? {
                      type: 'text',
                      raw: cell.content.text,
                      selectionPos: 'change',
                      idx: null,
                      node: null,
                      //   toplevel: parseRaw(cell.content.text, env.global),
                  }
                : {
                      type: 'normal',
                      idx: 0,
                      marks: [],
                  },
    );

    const evalCache = React.useRef({} as { [key: string]: any });

    const toplevel = React.useMemo(() => {
        return state.type === 'text'
            ? parseRaw(state.raw, env.global)
            : cell.content.type === 'raw'
            ? parseRaw(cell.content.text, env.global)
            : getToplevel(env, cell.content);
    }, [state.type === 'text' ? state.raw : cell.content]);

    const evaled = React.useMemo(() => {
        if (
            toplevel &&
            (toplevel.type === 'Expression' || toplevel.type === 'Define')
        ) {
            const id =
                toplevel.type === 'Expression'
                    ? { hash: hashObject(toplevel.term), size: 1, pos: 0 }
                    : toplevel.id;
            const already = evalEnv.terms[idName(id)];

            if (already) {
                return already;
            } else if (evalCache.current[idName(id)] != null) {
                return evalCache.current[idName(id)];
            } else {
                try {
                    const v = runTerm(env, toplevel.term, id, evalEnv)[
                        idName(id)
                    ];
                    evalCache.current[idName(id)] = v;
                    return v;
                } catch (err) {
                    console.log('Failure while evaling', err);
                }
            }
        }
        return null;
    }, [toplevel]);

    const onSetToplevel = React.useCallback(
        (toplevel: ToplevelT) => {
            const { env: nenv, content } = updateToplevel(
                env,
                toplevel,
                cell.content,
            );
            dispatch({ type: 'change', env: nenv, cell: { ...cell, content } });
        },
        [env, cell],
    );

    const setCollapsed = (collapsed: boolean) =>
        dispatch({ type: 'change', cell: { ...cell, collapsed } });

    const onSetPlugin = React.useCallback(
        (display) => {
            dispatch({ type: 'change', cell: { ...cell, display } });
        },
        [cell],
    );

    const body =
        state.type === 'text' && focused?.active ? (
            <ColorTextarea
                value={state.raw}
                env={env}
                maxWidth={maxWidth}
                unique={
                    toplevel && toplevel.type === 'RecordDef'
                        ? toplevel.def.unique
                        : null
                }
                selection={
                    state.idx && state.node
                        ? { idx: state.idx, node: state.node }
                        : null
                }
                updateSelection={(newSel) =>
                    updateLocal({ type: 'raw:selection', newSel })
                }
                onChange={(text: string) => updateLocal({ type: 'raw', text })}
                onKeyDown={(evt: any) => {
                    // TODO: /should/ I allow 'raw's anymore?
                    // I mean with this setup, you can't really save a raw.
                    if (evt.key === 'Escape') {
                        if (toplevel) {
                            if (
                                (toplevel.type === 'Define' ||
                                    toplevel.type === 'Expression') &&
                                cell.content.type === 'term'
                            ) {
                                updateProposed(cell, dispatch, toplevel);
                            } else {
                                const { env: nenv, content } = updateToplevel(
                                    env,
                                    toplevel,
                                    cell.content,
                                );
                                dispatch({
                                    type: 'change',
                                    env: nenv,
                                    cell: {
                                        ...cell,
                                        content,
                                    },
                                });
                            }
                            updateLocal({
                                type: 'raw:close',
                                // TODO: Come up with a better default "selected idx" if there isn't one
                                idx: state.idx || 0,
                            });
                        } else {
                            dispatch({
                                type: 'change',
                                cell: {
                                    ...cell,
                                    content: { type: 'raw', text: state.raw },
                                },
                            });
                            // Relinquish active focus, there's no normal mode for raw content.
                            dispatch({
                                type: 'focus',
                                active: false,
                                id: cell.id,
                            });
                        }

                        // // onClose(typed);
                        // updateProposed(cell, dispatch, toplevel);
                    }
                }}
            />
        ) : state.type === 'text' || cell.content.type === 'raw' ? (
            <div
                onClick={() => {
                    // setEditing(true);
                    if (cell.content.type === 'raw') {
                        updateLocal({
                            type: 'raw',
                            text: cell.content.text,
                        });
                    }
                }}
                style={{
                    fontFamily: '"Source Code Pro", monospace',
                    whiteSpace: 'pre-wrap',
                    position: 'relative',
                    cursor: 'pointer',
                    padding: 8,
                }}
            >
                {state.type === 'text'
                    ? state.raw
                    : (cell.content as RawContent).text.trim() === ''
                    ? '[empty]'
                    : (cell.content as RawContent).text}
            </div>
        ) : (
            <RenderItem
                maxWidth={maxWidth}
                onSetPlugin={onSetPlugin}
                onChange={onSetToplevel}
                selection={{
                    idx: state.idx,
                    marks: state.marks,
                    active: focused ? focused.active : false,
                }}
                setSelection={(idx, marks) => {
                    updateLocal({ type: 'selection', idx, marks });
                    // setSelection((sel) => ({
                    //     idx,
                    //     marks: marks != null ? marks : sel.marks,
                    //     level: 'normal',
                    //     node: null,
                    // }));
                    if (!focused || !focused.active) {
                        dispatch({ type: 'focus', id: cell.id, active: true });
                    }
                }}
                focused={focused != null ? focused.active : null}
                onFocus={(active: boolean, direction?: 'up' | 'down') => {
                    dispatch({
                        type: 'focus',
                        id: cell.id,
                        direction,
                        active,
                    });
                }}
                onClick={() => {
                    // setSelection((s) => ({ ...s, level: 'outer' }));
                    dispatch({ type: 'focus', id: cell.id, active: false });
                }}
                onPending={updatePending(cell, dispatch)}
                dispatch={dispatch}
                cell={cell}
                plugins={plugins}
                content={cell.content}
                onEdit={() =>
                    updateLocal({
                        type: 'raw',
                        // So.... it's weird to me that we're dealing with
                        // raw text here ... but maybe it's fine? yeah I guess
                        // this is fine.
                        text: printToString(
                            toplevelToPretty(
                                env,
                                getToplevel(env, cell.content as TopContent),
                            ),
                            50,
                        ),
                    })
                }
                env={env}
                evalEnv={evalEnv}
            />
            // <div>No toplevel?</div>
        );

    const termAndValue = getTermAndValue(toplevel, evalEnv);
    // const term =
    //     toplevel &&
    //     (toplevel.type === 'Define' || toplevel.type === 'Expression')
    //         ? toplevel.term
    //         : null;
    // const id = cell.content.type === 'term' ? cell.content.id : null;
    // const value = id ? evalEnv.terms[idName(id)] : null;

    // const memoTerm = React.useMemo(() => term, [
    //     term ? hashObject(term) : null,
    // ]);

    return (
        <CellWrapper
            getHistory={() => ({
                env,
                items: getHistory(cell.id),
            })}
            title={cellTitle(
                env,
                cell,
                maxWidth,
                cell.collapsed,
                rejectProposed(cell, dispatch, env),
                acceptProposed(cell, env, onSetToplevel),
            )}
            onRevertToTerm={(id: Id) => {
                dispatch({
                    type: 'change',
                    cell: { ...cell, content: { type: 'term', id } },
                });
            }}
            onRemove={() => dispatch({ type: 'remove', id: cell.id })}
            focused={focused}
            onFocus={() =>
                dispatch({ type: 'focus', id: cell.id, active: true })
            }
            collapsed={cell.collapsed || false}
            setCollapsed={setCollapsed}
            onToggleSource={() => 'todo'}
            menuItems={getMenuItems({
                dispatch,
                // onMove,
                // onDuplicate,
                setCollapsed,
                setShowSource: () => 'todo show source',
                term: termForToplevel(toplevel),
                showSource: false,
                showGLSL: false,
                cell,
                env,
                setShowGLSL: () => 'todo',
            })}
        >
            {body}
            {termAndValue ? (
                <RenderResult
                    onSetPlugin={onSetPlugin}
                    focused={focused != null}
                    // onPin={onPin}
                    cell={cell}
                    term={termAndValue[0][0]}
                    value={termAndValue[1]}
                    plugins={plugins}
                    id={termAndValue[0][1]!}
                    env={env}
                    evalEnv={evalEnv}
                    dispatch={dispatch}
                />
            ) : null}
        </CellWrapper>
    );
};

const getTermAndValue = (toplevel: ToplevelT | null, evalEnv: EvalEnv) => {
    if (
        toplevel &&
        (toplevel.type === 'Expression' || toplevel.type === 'Define')
    ) {
        const name = idName(toplevel.id);
        const tid = React.useMemo(() => {
            return [toplevel.term, toplevel.id];
        }, [name]);
        return [tid, evalEnv.terms[idName(toplevel.id)]];
    }
};

export const Cell2 = React.memo(CellView_);
