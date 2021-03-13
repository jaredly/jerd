// The app

import * as React from 'react';
import parse, {
    Expression,
    Location,
    Toplevel,
} from '../../src/parsing/parser';
import {
    optimizeAST,
    removeTypescriptTypes,
} from '../../src/printing/typeScriptOptimize';
import { typeFile } from '../../src/typing/typeFile';
import { fileToTypescript } from '../../src/printing/fileToTypeScript';

import { bool, presetEnv } from '../../src/typing/preset';
import generate from '@babel/generator';
import runCode from './eval';
import { typeDefine, typeEffect, typeTypeDefn } from '../../src/typing/env';
import { EnumDef, RecordDef } from '../../src/typing/types';
import {
    declarationToPretty,
    enumToPretty,
    recordToPretty,
} from '../../src/printing/printTsLike';
import { printToString } from '../../src/printing/printer';

// Yea

const defaultText = `

type Some<T> = {
    value: T
}
type None = {}

enum Option<T> {
    Some<T>,
    None
}

type Twice<T> = {
    one: T,
    two: T,
}

enum OptionOrTwice<T> {
    ...Option<T>,
    Twice<T>
}

const x = Option<int>:Some<int>{_: 10}
const y = Option<int>:None
// Option<int> is a subtype of OptionOrTwice<int>, so this works
const y1 = OptionOrTwice<int>:y
const y2 = OptionOrTwice<int>:Twice<int>{one: 3, two: 10}

switch y2 {
    Twice{one, two} => one + two,
    _ => 0
} == 13

`;

const toJs = (raw: string) => {
    const parsed: Array<Toplevel> = parse(raw);

    const { expressions, env } = typeFile(parsed);
    const ast = fileToTypescript(expressions, env, true, false);
    removeTypescriptTypes(ast);
    const { code, map } = generate(ast, {
        sourceMaps: true,
        sourceFileName: 'hello.jd',
    });

    // const buildDir = path.join(path.dirname(fname), 'build');

    // const dest = path.join(buildDir, path.basename(fname) + '.mjs');

    // const mapName = ''
    // const mapName = path.basename(fname) + '.mjs.map';
    // fs.writeFileSync(
    //     path.join(buildDir, mapName),
    //     JSON.stringify(map, null, 2),
    // );

    // This indirection is so avoid confusing source mapping
    // in the generated main.js of the compiler.
    // const m = '# source';
    // const text = code + '\n\n//' + m + 'MappingURL=' + mapName;
    // TODO inline sourceMap probably
    return code;
};

// const setupEnv = () => {
//     const env = presetEnv()
// }

export default () => {
    // const [text, setText] = React.useState(defaultText);
    const [data, setData] = React.useState(() => {
        return typeFile(parse(defaultText));
    });
    // const js = React.useMemo(() => {
    //     try {
    //         return toJs(text);
    //     } catch (err) {
    //         return `Failed to compile: ${err.message}`;
    //     }
    // }, [text]);
    return (
        <div>
            {Object.keys(data.env.global.types).map((hash) => (
                <div key={hash}>
                    {/* {hash} */}
                    <pre>
                        <code>
                            {data.env.global.types[hash].type === 'Enum'
                                ? printToString(
                                      enumToPretty(
                                          data.env,
                                          { hash, size: 1, pos: 0 },
                                          data.env.global.types[
                                              hash
                                          ] as EnumDef,
                                      ),
                                      100,
                                  )
                                : printToString(
                                      recordToPretty(
                                          data.env,
                                          { hash, size: 1, pos: 0 },
                                          data.env.global.types[
                                              hash
                                          ] as RecordDef,
                                      ),
                                      100,
                                  )}
                        </code>
                    </pre>
                </div>
            ))}
            {Object.keys(data.env.global.terms).map((hash) => (
                <div key={hash}>
                    {hash}
                    <pre>
                        <code>
                            {printToString(
                                declarationToPretty(
                                    data.env,
                                    { hash, size: 1, pos: 0 },
                                    data.env.global.terms[hash],
                                ),
                                100,
                            )}
                        </code>
                    </pre>
                </div>
            ))}
            {/* <textarea
                style={{
                    width: 500,
                    height: 300,
                    fontFamily: '"Source Code Pro", monospace',
                }}
                value={text}
                onChange={(evt) => setText(evt.target.value)}
            /> */}
            {/* <button
                onClick={() => {
                    runCode(js);
                }}
            >
                Run!
            </button>
            <pre>{js}</pre> */}
        </div>
    );
};
