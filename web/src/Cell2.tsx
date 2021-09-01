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
} from './Cell';
import { Cell, Content, Display, EvalEnv, RenderPlugins } from './State';
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

// hrmmmm can I move the selection dealio up a level? Should I? hmm I do like each cell managing its own cursor, tbh.

export type State =
    | {
          type: 'text';
          idx: number | null;
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
    // | {type: 'edit-raw'}
    | {
          type: 'raw:selection';
          newSel: { idx: number; node: HTMLElement } | null;
      };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'raw': {
            // const parsed =
            return {
                type: 'text',
                raw: action.text,
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

    const body =
        state.type === 'text' ? (
            <ColorTextarea
                // NOTE: this is ~uncontrolled at the moment.
                value={state.raw}
                env={env}
                maxWidth={maxWidth}
                unique={
                    toplevel && toplevel.type === 'RecordDef'
                        ? toplevel.def.unique
                        : null
                }
                // contents={state.toplevel}
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
                    if (evt.metaKey && evt.key === 'Enter') {
                        console.log('run it');
                        // onChange(typed == null ? text : typed);
                    }
                    if (evt.key === 'Escape') {
                        // onClose(typed);
                    }
                }}
            />
        ) : null;

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
            focused={focused ? focused.tick : null}
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
        </CellWrapper>
    );
};

export const CellView = React.memo(CellView_);
