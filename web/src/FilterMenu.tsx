/** @jsx jsx */
import { jsx } from '@emotion/react';
import * as React from 'react';
import { MenuItem } from './Cell/CellWrapper';

export const FilterMenu = ({
    items,
    setGetString,
    onClose,
}: {
    items: Array<MenuItem>;
    setGetString: (value: {
        prompt: string;
        action: (v: string) => void;
    }) => void;
    onClose: () => void;
}) => {
    const [state, setState] = React.useState({ text: '', selection: 0 });
    const text = state.text.toLowerCase();
    const results = React.useMemo(
        () => items.filter((item) => item.name.toLowerCase().includes(text)),
        [items, text],
    );
    return (
        <div>
            {results.map((item, i) => (
                <div
                    key={i}
                    style={
                        i === state.selection
                            ? { textDecoration: 'underline' }
                            : undefined
                    }
                    css={{
                        padding: 8,
                        cursor: 'pointer',
                        ':hover': {
                            backgroundColor: '#333',
                        },
                    }}
                    onClick={() => {
                        onClose();
                        if (item.askString) {
                            setGetString({
                                prompt: item.askString,
                                action: item.action,
                            });
                        } else {
                            item.action('');
                        }
                    }}
                >
                    {item.name}
                </div>
            ))}
            <input
                value={text}
                autoFocus
                onKeyDown={(evt) => {
                    evt.stopPropagation();
                    if (evt.key === 'Escape') {
                        evt.preventDefault();
                        onClose();
                    } else if (evt.key === 'Enter') {
                        evt.preventDefault();
                        const item = results[state.selection];
                        if (!item) {
                            return onClose();
                        }
                        if (item.askString) {
                            setGetString({
                                prompt: item.askString,
                                action: item.action,
                            });
                        } else {
                            item.action('');
                        }
                        onClose();
                    } else if (evt.key === 'ArrowUp') {
                        evt.preventDefault();
                        setState((state) => ({
                            ...state,
                            selection:
                                state.selection + 1 < results.length
                                    ? state.selection + 1
                                    : 0,
                        }));
                    } else if (evt.key === 'ArrowDown') {
                        evt.preventDefault();
                        setState((state) => ({
                            ...state,
                            selection:
                                state.selection > 0
                                    ? state.selection - 1
                                    : results.length - 1,
                        }));
                    }
                }}
                onChange={(evt) =>
                    setState((s) => ({ ...s, text: evt.target.value }))
                }
                css={{
                    padding: 4,
                    backgroundColor: '#555',
                    color: '#fff',
                }}
            />
        </div>
    );
};
