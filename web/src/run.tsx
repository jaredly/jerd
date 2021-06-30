import './polyfill';
import App from './App';
import ASTDebug from './ASTDebug';
import GLSL from './GLSL';
import * as React from 'react';
import { render } from 'react-dom';
import { initialState } from './persistence';
import { DebugGlsl } from './DebugGlsl';
import { idFromName } from '../../language/src/typing/env';

if (location.search === '?ast') {
    render(<ASTDebug />, document.getElementById('root'));
} else if (location.search === '?glsl') {
    render(<GLSL />, document.getElementById('root'));
} else if (location.search.startsWith('?debug-glsl=')) {
    initialState().then((state) =>
        render(
            <DebugGlsl
                state={state}
                id={idFromName(location.search.slice('?debug-glsl='.length))}
            />,
            document.getElementById('root'),
        ),
    );
} else {
    initialState().then((state) =>
        render(<App initial={state} />, document.getElementById('root')),
    );
}
