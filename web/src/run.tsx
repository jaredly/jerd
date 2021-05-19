import './polyfill';
import App from './App';
import ASTDebug from './ASTDebug';
import GLSL from './GLSL';
import * as React from 'react';
import { render } from 'react-dom';

if (location.search === '?ast') {
    render(<ASTDebug />, document.getElementById('root'));
} else if (location.search === '?glsl') {
    render(<GLSL />, document.getElementById('root'));
} else {
    render(<App />, document.getElementById('root'));
}
