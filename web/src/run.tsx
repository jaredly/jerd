import './polyfill';
import App from './App';
import ASTDebug from './ASTDebug';
import GLSL from './GLSL';
import * as React from 'react';
import { render } from 'react-dom';
import { initialState } from './persistence';

if (location.search === '?ast') {
    render(<ASTDebug />, document.getElementById('root'));
} else if (location.search === '?glsl') {
    render(<GLSL />, document.getElementById('root'));
} else {
    initialState().then((state) =>
        render(<App initial={state} />, document.getElementById('root')),
    );
}
