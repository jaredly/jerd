/** @jsx jsx */
import { jsx } from '@emotion/react';
// The app

import * as React from 'react';
import { Env, Id } from '@jerd/language/src/typing/types';
import { Display, EvalEnv, Plugins, PluginT } from './State';

import { idName } from '@jerd/language/src/typing/env';
import { getTypeError } from '@jerd/language/src/typing/getTypeError';
import { nullLocation } from '@jerd/language/src/parsing/parser';

export const Pin = ({
    pin,
    env,
    evalEnv,
    plugins,
    onRun,
}: {
    pin: { id: Id; display: Display };
    env: Env;
    evalEnv: EvalEnv;
    plugins: Plugins;
    onRun: (id: Id) => void;
}) => {
    const hash = idName(pin.id);

    React.useEffect(() => {
        if (evalEnv.terms[hash] == null) {
            onRun(pin.id);
        }
    }, [evalEnv.terms[hash] == null]);

    if (evalEnv.terms[hash] == null) {
        return (
            <div
                style={{
                    padding: 16,
                    // width: 200,
                    height: 200,
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.5,
                }}
            >
                {/* {idName(pin.id)} has not yet been evaluated. */}
                Loading...
            </div>
        );
    }

    const t = env.global.terms[idName(pin.id)];
    const plugin: PluginT = plugins[pin.display.type];
    const err = getTypeError(env, t.is, plugin.type, nullLocation);
    if (err == null) {
        return plugin.render(evalEnv.terms[idName(pin.id)], evalEnv, env, t);
    }
    return <div>Error folks</div>;
};
