// import './polyfill';
// import App from './App';
// import ASTDebug from './ASTDebug';
// import GLSL from './GLSL';
import * as React from 'react';
import { render } from 'react-dom';
import { OpenGLCanvas } from './display/OpenGLCanvas';
// import { initialState } from './persistence';

// Get the shader data somehow

const App = ({ shaders }: { shaders: Array<string> }) => {
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
            initialSize={500}
            onError={(e: Error) => setError(e)}
            startPaused={false}
        />
    );
};

if (window.location.search) {
    const gist = window.location.search.slice(1);
    fetch('https://api.github.com/gists/' + gist)
        .then((r) => r.json())
        .then((data) => {
            const raw = data.files[Object.keys(data.files)[0]].content;
            let shaders = [];
            try {
                shaders = JSON.parse(raw);
            } catch (err) {
                return render(
                    <div>
                        Invalid gist. The first file must be a json
                        stringification of the glsl.
                    </div>,
                    document.getElementById('root'),
                );
            }
            render(<App shaders={shaders} />, document.getElementById('root'));
        });
} else {
    render(<div>Hello!</div>, document.getElementById('root'));
}
