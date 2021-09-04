import './polyfill';
import * as builtins from '@jerd/language/src/printing/builtins';
// import App from './App';
// import ASTDebug from './ASTDebug';
// import GLSL from './GLSL';
import * as React from 'react';
import { render } from 'react-dom';
import { parse } from '../../language/src/parsing/parser';
import { addLocationIndices } from '../../language/src/typing/analyze';
import {
    addToplevelToEnv,
    idName,
    ToplevelExpression,
    typeToplevelT,
} from '../../language/src/typing/env';
import { Env, Id, newWithGlobal } from '../../language/src/typing/types';
import { defaultPlugins } from './defaultPlugins';
import { OpenGLCanvas } from './display/OpenGLCanvas';
import { runTerm } from './eval';
import { initialEnvWithPlugins } from './initialEnvWithPlugins';
import { newEvalEnv } from './persistence';
import './polyfill';
import { RenderResult } from './RenderResult';
import { EvalEnv } from './State';

// Get the shader data somehow

type State = {
    value: any;
    evalEnv: EvalEnv;
    env: Env;
};
const Pin = ({ env, id, display }: { env: Env; id: Id; display: string }) => {
    const term = env.global.terms[idName(id)];
    // addLocationIndicesToTerm(term)
    const [state, setState] = React.useState(null as null | State);
    React.useEffect(() => {
        const state = {
            value: null,
            env: env,
            evalEnv: newEvalEnv(builtins),
        };
        const results = runTerm(env, term, id, state.evalEnv);
        setState({
            ...state,
            evalEnv: {
                ...state.evalEnv,
                terms: { ...state.evalEnv.terms, ...results },
            },
            value: results[idName(id)],
        });
    }, []);
    if (!state) {
        return <div>Loading...</div>;
    }
    console.log(state);
    return (
        <div>
            <RenderResult
                focused={true}
                cell={{
                    id: '0',
                    order: 0,
                    collapsed: false,
                    content: { type: 'term', id },
                    display: { type: display, opts: {} },
                }}
                term={term}
                value={state.value}
                evalEnv={state.evalEnv}
                id={id}
                plugins={defaultPlugins}
                env={state.env}
                dispatch={(action) => {
                    console.log('waht', action);
                }}
            />
        </div>
    );
};

const App = ({
    shaders,
    size,
    zoom,
}: {
    zoom: number;
    size: number;
    shaders: Array<string>;
}) => {
    const [error, setError] = React.useState(null as null | Error);
    if (error != null) {
        return (
            <div>
                Oh no, unable to render!
                <br />
                {error.toString()}
            </div>
        );
    }
    return (
        <OpenGLCanvas
            shaders={shaders}
            initialSize={size}
            initialZoom={zoom}
            onError={(e: Error) => setError(e)}
            startPaused={false}
        />
    );
};

const Unloaded = () => {
    const [url, setUrl] = React.useState('');
    return (
        <div>
            <input value={url} onChange={(evt) => setUrl(evt.target.value)} />
            <button
                onClick={() => {
                    const id = url.split('/').slice(-1)[0];
                    window.location.search = '?' + id;
                }}
            >
                Load Gist
            </button>
        </div>
    );
};

const processGistData = (fileName: string, raw: string) => {
    if (fileName.endsWith('.json')) {
        let data = null;
        try {
            data = JSON.parse(raw);
        } catch (err) {
            return render(
                <div>Invalid gist. The first file must be in json format.</div>,
                document.getElementById('root'),
            );
        }

        // TODO: Make this into a general "this can display a pin" thing!
        // would be cool to also render all of the code

        let shaders: Array<string> = [];
        let size = 500;
        let zoom = 0.5;
        if (isShaders(data)) {
            shaders = data;
        } else if (isShaders(data.shaders)) {
            shaders = data.shaders;
            size = data.size || 400;
            zoom = data.zoom || 0.5;
        }
        render(
            <App size={size} zoom={zoom} shaders={shaders} />,
            document.getElementById('root'),
        );
    }
    if (fileName.endsWith('.jd')) {
        const toplevels = parse(raw);
        let env = newWithGlobal(initialEnvWithPlugins());
        let main: undefined | { top: ToplevelExpression; display: string };
        toplevels.forEach((item) => {
            if (
                item.type === 'Decorated' &&
                item.decorators.length === 1 &&
                item.decorators[0].id.text === 'display' &&
                item.decorators[0].args.length === 1 &&
                item.decorators[0].args[0].type === 'Expr' &&
                item.decorators[0].args[0].expr.type === 'string'
            ) {
                const top = addLocationIndices(
                    typeToplevelT(env, item.wrapped),
                );
                if (top.type === 'Expression') {
                    // We're done!
                    env = addToplevelToEnv(env, top).env;
                    main = {
                        top,
                        display: item.decorators[0].args[0].expr.text,
                    };
                    return;
                }
            }
            const top = addLocationIndices(typeToplevelT(env, item));
            if (top.type === 'Expression') {
                console.log('Ok folks');
            }
            env = addToplevelToEnv(env, top).env;
        });
        if (main == null) {
            render(
                <div>Failed to parse .jd file</div>,
                document.getElementById('root'),
            );
        } else {
            render(
                <Pin env={env} id={main.top.id} display={main.display} />,
                document.getElementById('root'),
            );
        }
    }
};

const isShaders = (data: unknown) =>
    Array.isArray(data) &&
    data.every((s) => typeof s === 'string' && s.startsWith('#version'));

if (window.location.search) {
    const gist = window.location.search.slice(1);
    render(<div>Loading...</div>, document.getElementById('root'));
    fetch('https://api.github.com/gists/' + gist)
        .then((r) => r.json())
        .then(
            (response) => {
                const fileKeys = Object.keys(response.files);
                if (fileKeys.length > 1) {
                    console.warn('Multiple files, taking one arbitrarily');
                }
                const raw = response.files[fileKeys[0]].content;
                processGistData(fileKeys[0], raw);
            },
            (err) => {},
        );
} else {
    render(<Unloaded />, document.getElementById('root'));
}
