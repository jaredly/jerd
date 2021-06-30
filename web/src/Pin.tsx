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

export const Pin = ({
    pin,
    env,
    evalEnv,
    plugins,
    onRun,
    onRemove,
    onArchive,
    onOpen,
}: {
    pin: { id: Id; display: Display };
    env: Env;
    evalEnv: EvalEnv;
    plugins: RenderPlugins;
    onRun: (id: Id) => void;
    onRemove: () => void;
    onArchive: () => void;
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
        const err = getTypeError(env, t.is, plugin.type, nullLocation);
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
                        color: 'inherit',
                        padding: 0,
                        marginLeft: 8,
                        marginRight: 4,
                    }}
                    onClick={onArchive}
                    className="material-icons"
                >
                    inventory_2
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
                    onClick={onRemove}
                >
                    ╳
                </button>
            </div>
            {body}
        </div>
    );
};

const contentForId = (env: Env, id: Id): Content => {
    const name = env.global.idNames[idName(id)];
    if (name) {
        return {
            type: 'term',
            id,
            name,
        };
    } else {
        return { type: 'expr', id };
    }
};
