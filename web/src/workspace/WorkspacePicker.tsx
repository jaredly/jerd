/** @jsx jsx */
import { jsx } from '@emotion/react';
// The app
import * as React from 'react';
import { State } from '../App';
import { Action, genId, modActiveWorkspace } from './Cells';

export const WorkspacePicker = ({
    state,
    processAction,
}: {
    state: State;
    processAction: (action: Action) => void;
}) => {
    const [editing, setEditing] = React.useState(null as string | null);
    let body;
    if (editing != null) {
        body = (
            <React.Fragment>
                <input
                    value={editing}
                    autoFocus
                    onChange={(evt) => {
                        setEditing(evt.target.value);
                    }}
                />
                <button
                    onClick={() => {
                        processAction({
                            type: 'workspace:rename',
                            name: editing,
                        });
                        setEditing(null);
                    }}
                >
                    Ok
                </button>
                <button
                    onClick={() => {
                        setEditing(null);
                    }}
                >
                    Cancel
                </button>
            </React.Fragment>
        );
    } else {
        body = (
            <React.Fragment>
                <select
                    value={state.activeWorkspace}
                    onChange={(evt) => {
                        const activeWorkspace = evt.target.value;
                        console.log(evt.target.value);
                        if (evt.target.value === '<new>') {
                            processAction({ type: 'workspace:new' });
                        } else {
                            processAction({
                                type: 'workspace:focus',
                                id: activeWorkspace,
                            });
                        }
                    }}
                >
                    {Object.keys(state.workspaces).map((id) => (
                        <option value={id} key={id}>
                            {state.workspaces[id].name}
                        </option>
                    ))}
                    <option value="<new>">Create new workspace</option>
                </select>
                <button
                    onClick={() => {
                        setEditing(
                            state.workspaces[state.activeWorkspace].name,
                        );
                    }}
                >
                    Rename
                </button>
            </React.Fragment>
        );
    }
    return (
        <div
            css={{
                padding: '8px 16px',
                fontSize: 16,
            }}
        >
            Workspace: {body}
        </div>
    );
};
