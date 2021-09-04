/** @jsx jsx */
import { jsx, css } from '@emotion/react';
// The app

import * as React from 'react';
import { Env } from '@jerd/language/src/typing/types';
import { Content } from './State';
import { idFromName, idName } from '@jerd/language/src/typing/env';

const styles = {
    group: css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        // flexShrink: 1,
        minHeight: 100,
    }),
    groupItems: css({
        flex: 1,
        overflow: 'auto',
        paddingBottom: 24,
        minHeight: 50,
    }),
    item: css({
        display: 'flex',
        padding: '4px 8px',
        cursor: 'pointer',
        alignItems: 'flex-end',
        ':hover': {
            backgroundColor: 'rgba(100,100,100,0.3)',
        },
    }),
    header: css({
        padding: '4px 8px',
        // fontWeight: 'bold',
        // textDecoration: 'underline',
        backgroundColor: 'rgba(100,100,100,0.3)',
        opacity: 0.8,
    }),
    hash: css({
        fontSize: '80%',
        opacity: 0.8,
        marginLeft: 8,
    }),
};

const typeContent = (env: Env, idRaw: string): Content => {
    return env.global.types[idRaw].type === 'Enum'
        ? {
              type: 'enum',
              id: idFromName(idRaw),
          }
        : {
              type: 'record',
              id: idFromName(idRaw),
          };
};

const Library = ({
    env,
    onOpen,
    footer,
}: {
    env: Env;
    onOpen: (c: Content) => void;
    footer: React.ReactChild;
}) => {
    return (
        <div
            style={{
                backgroundColor: 'rgba(100,100,100,0.1)',
                color: 'white',
                fontFamily: 'monospace',
                overflow: 'auto',
                width: 200,
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
            }}
        >
            <div css={styles.group}>
                <div css={styles.header}>Types</div>
                <div css={styles.groupItems}>
                    {Object.keys(env.global.typeNames)
                        .sort()
                        .map((name) => {
                            const ids = env.global.typeNames[name];
                            const hash = idName(ids[0]);
                            return (
                                <div
                                    css={styles.item}
                                    style={{
                                        color:
                                            env.global.types[hash].type ===
                                            'Enum'
                                                ? '#afa'
                                                : 'white',
                                    }}
                                    key={name}
                                    onClick={() =>
                                        onOpen(typeContent(env, hash))
                                    }
                                >
                                    {name}
                                    <div style={{ flex: 1 }} />
                                    <div css={styles.hash}>#{hash}</div>
                                </div>
                            );
                        })}
                </div>
            </div>
            <div css={styles.group}>
                <div css={styles.header}>Effects</div>

                <div css={styles.groupItems}>
                    {Object.keys(env.global.effectNames)
                        .sort()
                        .map((name) => {
                            const idRaw = env.global.effectNames[name][0];
                            return (
                                <div
                                    css={styles.item}
                                    key={name}
                                    onClick={() =>
                                        onOpen({
                                            type: 'effect',
                                            id: idFromName(idRaw),
                                        })
                                    }
                                >
                                    {name}
                                    <div style={{ flex: 1 }} />
                                    <div css={styles.hash}>#{idRaw}</div>
                                </div>
                            );
                        })}
                </div>
            </div>
            <div css={styles.group}>
                <div css={styles.header}>Terms</div>
                <div css={styles.groupItems}>
                    {Object.keys(env.global.names)
                        .sort()
                        .map((name) => {
                            const idRaw = idName(env.global.names[name][0]);
                            return (
                                <div
                                    css={styles.item}
                                    onClick={() => {
                                        onOpen({
                                            type: 'term',
                                            id: idFromName(idRaw),
                                        });
                                    }}
                                    key={name}
                                >
                                    {name}
                                    <div style={{ flex: 1 }} />
                                    <div css={styles.hash}>#{idRaw}</div>
                                </div>
                            );
                        })}
                </div>
            </div>
            {footer}
        </div>
    );
};

export default Library;
