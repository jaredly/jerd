import { idName } from '@jerd/language/src/typing/env';
import { Env, Term } from '@jerd/language/src/typing/types';
import { Cell } from './State';
import { MenuItem } from './CellWrapper';
import { MovePosition } from './Cell';
import { generateExport } from './generateExport';
import { Action } from './Cells';

export const getMenuItems = ({
    // onMove,
    // onDuplicate,
    dispatch,
    setCollapsed,
    setShowSource,
    term,
    showSource,
    showGLSL,
    cell,
    env,
    setShowGLSL,
}: {
    // onMove: (id: string, dir: MovePosition) => void;
    // onDuplicate: (id: string) => void;
    dispatch: (action: Action) => void;
    setCollapsed: (c: boolean) => void;
    setShowSource: (show: boolean) => void;
    term: Term | null;
    showSource: boolean;
    showGLSL: boolean;
    cell: Cell;
    env: Env;
    setShowGLSL: (show: boolean) => void;
}) => () => {
    return [
        {
            name: 'Move up',
            action: () =>
                dispatch({ type: 'move', id: cell.id, position: 'up' }),
        },
        {
            name: 'Move down',
            action: () =>
                dispatch({ type: 'move', id: cell.id, position: 'down' }),
        },
        { name: 'Move to workspace', action: () => {} },
        {
            name: 'Duplicate cell',
            action: () => dispatch({ type: 'duplicate', id: cell.id }),
        },
        {
            name: 'History',
            action: () => console.log('Ok history I guess'),
        },
        ...(cell.collapsed
            ? [
                  {
                      name: 'Expand',
                      action: () => setCollapsed(false),
                  },
              ]
            : [
                  {
                      name: 'Collapse',
                      action: () => setCollapsed(true),
                  },
                  term
                      ? showSource
                          ? {
                                name: 'Hide generated javascript',
                                action: () => setShowSource(false),
                            }
                          : {
                                name: 'Show generated javascript',
                                action: () => setShowSource(true),
                            }
                      : null,
                  term
                      ? showGLSL
                          ? {
                                name: 'Hide generated GLSL',
                                action: () => setShowGLSL(false),
                            }
                          : {
                                name: 'Show generated GLSL',
                                action: () => setShowGLSL(true),
                            }
                      : null,
                  term
                      ? {
                            name: 'Debug GLSL',
                            action: () =>
                                (window.location.search =
                                    '?debug-glsl=' +
                                    idName((cell.content as any).id)),
                        }
                      : null,
              ]),
        ...(cell.content.type === 'term'
            ? [
                  {
                      name: 'Export term & dependencies to tslike syntax',
                      action: () => {
                          if (cell.content.type !== 'term') {
                              return;
                          }
                          const text = generateExport(
                              env,
                              cell.content.id,
                              undefined,
                              cell.display,
                          );
                          navigator.clipboard.writeText(text);
                      },
                  },
                  {
                      name: 'Export with IDs',
                      action: () => {
                          if (cell.content.type !== 'term') {
                              return;
                          }
                          const text = generateExport(
                              env,
                              cell.content.id,
                              false,
                              cell.display,
                          );
                          navigator.clipboard.writeText(text);
                      },
                  },
              ]
            : []),
    ].filter(Boolean) as Array<MenuItem>;
};
