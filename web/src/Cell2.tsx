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

// hrmmmm can I move the selection dealio up a level? Should I? hmm I do like each cell managing its own cursor, tbh.

export type State =
    | {
          type: 'text';
          idx: number | null;
          raw: string;
          // May or may not have worked
          toplevel: ToplevelT | null;
      }
    | {
          type: 'normal';
          idx: number;
          marks: Array<number>;
          toplevel: ToplevelT;
      };

type Action = {};

const reducer = (prevState: State, action: Action): State => {
    return prevState;
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
        (initial): State =>
            cell.content.type === 'raw'
                ? {
                      type: 'text',
                      raw: cell.content.text,
                      idx: null,
                      toplevel: parseRaw(cell.content.text, env.global),
                  }
                : {
                      type: 'normal',
                      idx: 0,
                      marks: [],
                      toplevel: getToplevel(env, cell.content),
                  },
    );

    const evalCache = React.useRef({} as { [key: string]: any });

    const evaled = React.useMemo(() => {
        if (
            state.toplevel &&
            (state.toplevel.type === 'Expression' ||
                state.toplevel.type === 'Define')
        ) {
            const id =
                state.toplevel.type === 'Expression'
                    ? { hash: hashObject(state.toplevel.term), size: 1, pos: 0 }
                    : state.toplevel.id;
            const already = evalEnv.terms[idName(id)];

            if (already) {
                return already;
            } else if (evalCache.current[idName(id)] != null) {
                return evalCache.current[idName(id)];
            } else {
                try {
                    const v = runTerm(env, state.toplevel.term, id, evalEnv)[
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
    }, [state.toplevel]);

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
            onFocus={() => dispatch({ type: 'focus', id: cell.id })}
            collapsed={cell.collapsed || false}
            setCollapsed={setCollapsed}
            onToggleSource={() => 'todo'}
            menuItems={getMenuItems({
                dispatch,
                // onMove,
                // onDuplicate,
                setCollapsed,
                setShowSource: () => 'todo show source',
                term: termForToplevel(state.toplevel),
                showSource: false,
                showGLSL: false,
                cell,
                env,
                setShowGLSL: () => 'todo',
            })}
        >
            START HERE: Make a body, with Editor and RenderItem, and then with
            plugins beneath it. Hello all
            {/* {body} */}
            {/* {term && showSource && cell.content.type === 'term' ? (
                <ViewSource
                    hash={idName(cell.content.id)}
                    env={env}
                    term={term}
                />
            ) : null}
            {term && showGLSL && cell.content.type === 'term' ? (
                <ViewGLSL
                    hash={idName(cell.content.id)}
                    env={env}
                    term={term}
                />
            ) : null} */}
        </CellWrapper>
    );
};

export const CellView = React.memo(CellView_);
