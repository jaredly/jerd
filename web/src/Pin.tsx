/** @jsx jsx */
import { jsx } from '@emotion/react';
// The app

import * as React from 'react';
import { Env, Id, nullLocation } from '@jerd/language/src/typing/types';
import {
    Content,
    Display,
    EvalEnv,
    RenderPlugins,
    RenderPluginT,
} from './State';

import { idName } from '@jerd/language/src/typing/env';
import { getTypeError } from '@jerd/language/src/typing/getTypeError';
import { hashStyle } from './Cell';

export type Pin = { id: Id; display: Display };

const Pin_ = ({
    pin,
    env,
    evalEnv,
    plugins,
    onRun,
    onRemove,
    onArchive,
    onOpen,
    isFrozen,
}: {
    pin: Pin;
    env: Env;
    evalEnv: EvalEnv;
    plugins: RenderPlugins;
    isFrozen: boolean;
    onRun: (id: Id) => void;
    onRemove: (pin: Pin) => void;
    onArchive: (pin: Pin) => void;
    onOpen: (content: Content) => void;
}) => {
    const hash = idName(pin.id);

    React.useEffect(() => {
        if (evalEnv.terms[hash] == null) {
            onRun(pin.id);
        }
    }, [evalEnv.terms[hash] == null]);

    let body = null;

    if (evalEnv.terms[hash] == null) {
        body =
            // <div
            //     style={{
            //         padding: 16,
            //         // width: 200,
            //         height: 200,
            //         boxSizing: 'border-box',
            //         display: 'flex',
            //         alignItems: 'center',
            //         justifyContent: 'center',
            //         opacity: 0.5,
            //     }}
            // >
            'Loading...';
        // </div>
    } else {
        const t = env.global.terms[hash];
        const plugin: RenderPluginT = plugins[pin.display.type];
        const err = getTypeError(
            env,
            t.is,
            plugin.type,
            nullLocation,
            undefined,
            true,
        );
        if (err == null) {
            body = plugin.render(
                evalEnv.terms[idName(pin.id)],
                evalEnv,
                env,
                t,
                true,
            );
        } else {
            body = <div>Invalid term for plugin. Type mismatch.</div>;
        }
    }
    return (
        <div
            css={{
                borderBottom: '1px dashed #ababab',
                marginBottom: 8,
                paddingBottom: 8,
            }}
        >
            <div
                css={{
                    backgroundColor: '#151515',
                    padding: 4,
                    display: 'flex',
                }}
            >
                <span
                    onClick={() => onOpen(contentForId(env, pin.id))}
                    css={{
                        ...hashStyle,
                        cursor: 'pointer',
                    }}
                >
                    #{hash}
                </span>
                <div css={{ flex: 1 }} />
                <button
                    css={{
                        cursor: 'pointer',
                        fontSize: '50%',
                        backgroundColor: 'transparent',
                        border: 'none',
                        padding: 0,
                        marginLeft: 8,
                        marginRight: 4,
                        ...(isFrozen
                            ? {
                                  color: 'white',
                                  //   backgroundColor: 'rgba(255,255,255,0.8)',
                              }
                            : {
                                  color: '#ccc',
                              }),
                    }}
                    onClick={() => onArchive(pin)}
                    className="material-icons"
                >
                    ac_unit
                </button>
                <button
                    css={{
                        cursor: 'pointer',
                        fontSize: '50%',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'inherit',
                        padding: 0,
                        marginLeft: 8,
                        marginRight: 4,
                    }}
                    onClick={() => onRemove(pin)}
                >
                    ╳
                </button>
            </div>
            {body}
        </div>
    );
};
export const Pin = React.memo(Pin_);

const contentForId = (env: Env, id: Id): Content => {
    const name = env.global.idNames[idName(id)];
    return {
        type: 'term',
        id,
    };
};
