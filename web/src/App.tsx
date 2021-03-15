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
    termToPretty,
} from '../../src/printing/printTsLike';
import {
    printToString,
    printToAttributedText,
    AttributedText,
} from '../../src/printing/printer';
import { render } from 'react-dom';
import Editor from './Editor';
import { renderAttributedText } from './Render';

// Yea

const toJs = (raw: string) => {
    const parsed: Array<Toplevel> = parse(raw);

    const { expressions, env } = typeFile(parsed);
    const ast = fileToTypescript(expressions, env, true, false);
    removeTypescriptTypes(ast);
    const { code, map } = generate(ast, {
        sourceMaps: true,
        sourceFileName: 'hello.jd',
    });
    return code;
};

// const setupEnv = () => {
//     const env = presetEnv()
// }

const maxWidth = 60;

export default () => {
    // const [text, setText] = React.useState(defaultText);
    const [data, setData] = React.useState(() => {
        return typeFile(parse(defaultText));
    });
    // const [editing, setEditing] = React.useState(null)
    // const js = React.useMemo(() => {
    //     try {
    //         return toJs(text);
    //     } catch (err) {
    //         return `Failed to compile: ${err.message}`;
    //     }
    // }, [text]);
    return (
        <div
            style={{
                backgroundColor: '#1E1E1E',
                padding: 20,
                color: '#D4D4D4',
                display: 'flex',
                flexDirection: 'row',
            }}
        >
            <div style={{ flex: 1 }}>
                {Object.keys(data.env.global.terms).map((hash) => (
                    <div key={hash}>
                        <pre>
                            <code>
                                {renderAttributedText(
                                    printToAttributedText(
                                        declarationToPretty(
                                            data.env,
                                            { hash, size: 1, pos: 0 },
                                            data.env.global.terms[hash],
                                        ),
                                        maxWidth,
                                    ),
                                )}
                            </code>
                        </pre>
                    </div>
                ))}
            </div>
            <div style={{ flex: 1 }}>
                {data.expressions.map((expr, i) => (
                    <div key={i}>
                        <EditableExpression expr={expr} env={data.env} />
                    </div>
                ))}
            </div>
            <div style={{ flex: 0.5 }}>
                {Object.keys(data.env.global.types).map((hash) => (
                    <div key={hash}>
                        {/* {hash} */}
                        <pre>
                            <code>
                                {data.env.global.types[hash].type === 'Enum'
                                    ? renderAttributedText(
                                          printToAttributedText(
                                              enumToPretty(
                                                  data.env,
                                                  { hash, size: 1, pos: 0 },
                                                  data.env.global.types[
                                                      hash
                                                  ] as EnumDef,
                                              ),
                                              maxWidth,
                                          ),
                                      )
                                    : renderAttributedText(
                                          printToAttributedText(
                                              recordToPretty(
                                                  data.env,
                                                  { hash, size: 1, pos: 0 },
                                                  data.env.global.types[
                                                      hash
                                                  ] as RecordDef,
                                              ),
                                              maxWidth,
                                          ),
                                      )}
                            </code>
                        </pre>
                    </div>
                ))}
            </div>
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

export const EditableExpression = ({ env, expr }) => {
    const [editing, setEditing] = React.useState(false);
    if (editing) {
        return (
            <Editor env={env} expr={expr} onClose={() => setEditing(false)} />
        );
    }
    return (
        <pre onClick={() => setEditing(true)}>
            <code>
                {renderAttributedText(
                    printToAttributedText(termToPretty(env, expr), maxWidth),
                )}
            </code>
        </pre>
    );
};
