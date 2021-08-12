// import './polyfill';
// import App from './App';
// import ASTDebug from './ASTDebug';
// import GLSL from './GLSL';
import * as React from 'react';
import { render } from 'react-dom';
import { OpenGLCanvas } from './display/OpenGLCanvas';
// import { initialState } from './persistence';

// Get the shader data somehow

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

const isShaders = (data: any) =>
    Array.isArray(data) &&
    data.every((s) => typeof s === 'string' && s.startsWith('#version'));

if (window.location.search) {
    const gist = window.location.search.slice(1);
    render(<div>Loading...</div>, document.getElementById('root'));
    fetch('https://api.github.com/gists/' + gist)
        .then((r) => r.json())
        .then(
            (response) => {
                const raw =
                    response.files[Object.keys(response.files)[0]].content;
                let data = null;
                try {
                    data = JSON.parse(raw);
                } catch (err) {
                    return render(
                        <div>
                            Invalid gist. The first file must be in json format.
                        </div>,
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
            },
            (err) => {},
        );
} else {
    render(<Unloaded />, document.getElementById('root'));
}
