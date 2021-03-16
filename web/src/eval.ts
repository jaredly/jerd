// For running the code

import * as prelude from '../../src/printing/prelude';
const runCode = (js: string): any => {
    // Bringing these into scope for the eval'd code to use.
    let raise = prelude.raise;
    let isSquare = prelude.isSquare;
    let log = prelude.log;
    let intToString = prelude.intToString;
    let handleSimpleShallow2 = prelude.handleSimpleShallow2;
    let assert = prelude.assert;
    let assertEqual = prelude.assertEqual;
    let pureCPS = prelude.pureCPS;
    return eval(js);
};

export default runCode;
