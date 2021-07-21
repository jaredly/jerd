/** @jsx jsx */
import { jsx } from '@emotion/react';
import * as React from 'react';
import { MenuItem } from './CellWrapper';

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
                        onClose();
                    } else if (evt.key === 'Return' || evt.key === 'Enter') {
                        const item = results[state.selection];
                        if (item.askString) {
                            setGetString({
                                prompt: item.askString,
                                action: item.action,
                            });
                        } else {
                            item.action('');
                        }
                        onClose();
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
