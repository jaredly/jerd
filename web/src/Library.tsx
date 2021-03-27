// The app

import * as React from 'react';
import { Env } from '@jerd/language/src/typing/types';
import { Content } from './Cell';

const styles = {
    item: {
        padding: '4px 8px',
        cursor: 'pointer',
    },
    header: {
        padding: '4px 8px',
        fontWeight: 'bold',
        textDecoration: 'underline',
    },
};

const Library = ({
    env,
    onOpen,
}: {
    env: Env;
    onOpen: (c: Content) => void;
}) => {
    return (
        <div
            style={{
                backgroundColor: 'rgba(100,100,100,0.1)',
                color: 'white',
                fontFamily: 'monospace',
            }}
        >
            <div>
                <div style={styles.header}>Types</div>
                {Object.keys(env.global.types).map((hash) => (
                    <div
                        style={styles.item}
                        key={hash}
                        onClick={() =>
                            onOpen(
                                env.global.types[hash].type === 'Enum'
                                    ? {
                                          type: 'enum',
                                          id: { hash, size: 1, pos: 0 },
                                          name:
                                              env.global.idNames[hash] ||
                                              'unnamed',
                                      }
                                    : {
                                          type: 'record',
                                          id: { hash, size: 1, pos: 0 },
                                          name:
                                              env.global.idNames[hash] ||
                                              'unnamed',
                                          attrs: env.global.recordGroups[hash],
                                      },
                            )
                        }
                    >
                        {env.global.idNames[hash] || hash}#{hash}
                    </div>
                ))}
            </div>
            <div>
                <div style={styles.header}>Terms</div>
                {Object.keys(env.global.terms).map((hash) => (
                    <div
                        style={styles.item}
                        onClick={() => {
                            onOpen({
                                type: 'term',
                                id: { hash, size: 1, pos: 0 },
                                name: env.global.idNames[hash] || 'unnamed',
                            });
                        }}
                        key={hash}
                    >
                        {env.global.idNames[hash] || hash}#{hash}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Library;
