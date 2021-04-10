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
        marginBottom: 24,
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
              name: env.global.idNames[idRaw] || 'unnamed',
          }
        : {
              type: 'record',
              id: idFromName(idRaw),
              name: env.global.idNames[idRaw] || 'unnamed',
              attrs: env.global.recordGroups[idRaw],
          };
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
            <div css={styles.group}>
                <div css={styles.header}>Types</div>
                {Object.keys(env.global.typeNames)
                    .sort()
                    .map((name) => {
                        const hash = idName(env.global.typeNames[name]);
                        return (
                            <div
                                css={styles.item}
                                style={{
                                    color:
                                        env.global.types[hash].type === 'Enum'
                                            ? '#afa'
                                            : 'white',
                                }}
                                key={name}
                                onClick={() => onOpen(typeContent(env, hash))}
                            >
                                {name}
                                <div style={{ flex: 1 }} />
                                <div css={styles.hash}>#{hash}</div>
                            </div>
                        );
                    })}
            </div>
            <div css={styles.group}>
                <div css={styles.header}>Effects</div>
                {Object.keys(env.global.effectNames)
                    .sort()
                    .map((name) => {
                        const idRaw = env.global.effectNames[name];
                        return (
                            <div
                                css={styles.item}
                                key={name}
                                onClick={() =>
                                    onOpen({
                                        type: 'effect',
                                        name,
                                        id: idFromName(idRaw),
                                        constrNames:
                                            env.global.effectConstrNames[idRaw],
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
            <div css={styles.group}>
                <div css={styles.header}>Terms</div>
                {Object.keys(env.global.names)
                    .sort()
                    .map((name) => {
                        const idRaw = idName(env.global.names[name]);
                        return (
                            <div
                                css={styles.item}
                                onClick={() => {
                                    onOpen({
                                        type: 'term',
                                        id: idFromName(idRaw),
                                        name:
                                            env.global.idNames[idRaw] ||
                                            'unnamed',
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
    );
};

export default Library;
