/** @jsx jsx */
import { jsx } from '@emotion/react';
// A cmd-p menu for pulling things up quickly

// Behavior
// # Search
// - with no input, list the most recently used things (grouping things with the same name)
// - with some input, do fuzzy matching on the name
// - if you select a type and tab, that becomes the search term, and we're now searching for usages
//   - this should all be well indexed in a `termRelations` table (user: id, used: id)
// # Commands
// - import/export environment
// - um probably some refactoring commands? idk

import * as React from 'react';
import { idFromName, idName } from '../../language/src/typing/env';
import { Env } from '../../language/src/typing/types';
import { Content } from './State';

export type Props = {
    env: Env;
    onClose: () => unknown;
    onOpen: (content: Content) => void;
};

export const QuickMenu = ({ env, onClose, onOpen }: Props) => {
    const [refered, setRefered] = React.useState(
        [] as Array<{ type: 'type' | 'term'; id: string }>,
    );
    const [input, setInput] = React.useState('');

    const results = React.useMemo(() => {
        const names = Object.keys(env.global.names);
        const typeNames = Object.keys(env.global.typeNames);
        const needle = input.toLowerCase();
        // TODO: sort by added date
        // env.global.metaData
        if (input == '') {
            return names.slice(-10).map((n) => ({ type: 'term', name: n }));
        }
        return names
            .filter((n) => n.toLowerCase().includes(needle))
            .map((n) => ({ type: 'term', name: n }))
            .concat(
                typeNames
                    .filter((n) => n.toLowerCase().includes(needle))
                    .map((n) => ({ type: 'type', name: n })),
            );
    }, [env, input, refered]);

    return (
        <div
            css={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.1)',
                display: 'flex',
                padding: 30,
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <div
                css={{
                    display: 'flex',
                    maxWidth: '90vw',
                    boxShadow: '0 0 2px #fff',
                    padding: 4,
                    borderRadius: 4,
                    width: 800,
                    flexDirection: 'column',
                    backgroundColor: '#333',
                    alignItems: 'stretch',
                }}
            >
                <input
                    value={input || ''}
                    autoFocus
                    onChange={(evt) => {
                        setInput(evt.target.value);
                    }}
                    onKeyDown={(evt) => {
                        if (evt.key === 'Escape') {
                            evt.preventDefault();
                            onClose();
                            return;
                        }
                        if (evt.key === 'Enter') {
                            const r = results[0];
                            if (r.type === 'term') {
                                onOpen({
                                    type: 'term',
                                    id: env.global.names[r.name][0],
                                    name: r.name,
                                });
                                onClose();
                            }
                        }
                    }}
                />
                <div
                    css={{
                        overflow: 'auto',
                    }}
                >
                    {results
                        .map((r) => {
                            if (r.type === 'term') {
                                return {
                                    key: 'term-' + r.name,
                                    title: r.name,
                                    ids: env.global.names[r.name],
                                };
                            } else {
                                return {
                                    key: 'type-' + r.name,
                                    title: r.name,
                                    ids: env.global.typeNames[r.name],
                                };
                            }
                        })
                        .map((r) => {
                            return (
                                <div
                                    key={r.key}
                                    css={{
                                        padding: '4px 8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    {r.title}
                                    <div css={{ flex: 1 }} />
                                    {r.ids
                                        .map((r) => '#' + idName(r))
                                        .join(' ')}
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};
