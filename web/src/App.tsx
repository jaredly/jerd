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

// Yea

const defaultText = `


// type Person = {
//     ...HasName,
//     ...HasAge,
//     what: int,
// }

type Id = {
    hash: string,
    size: int,
    pos: int,
}

// type UserReference = {
//     id: Id
// }
// enum Reference {
//     Builtin{name: string},
//     =UserReference
// }

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

switch y1 {
    Twice{one, two} => one + two,
    None => 2,
    _ => 0
} == 2

const something = Some<int>{_: 10}
// We can do enum conversion on variables too
const asOption = Option<int>:something

const isPresent = <T,>(x: Option<T>): bool => {
    switch x {
        Some => true,
        None => false
    }
}

isPresent(Option<int>:Some<int>{_: 3}) == true
isPresent(Option<int>:None) == false

const getWithDefault = <T,>(x: Option<T>, default: T): T => {
    switch x {
        Some{_: v} => v,
        None => default,
    }
}

getWithDefault<int>(Option<int>:None, 20) == 20
getWithDefault<int>(Option<int>:Some<int>{_: 3}, 20) == 3

@typeError("Bodies of case arms don't agree")
switch 10 { 4 => 10, 10 => true }

@typeError("Not an enum")
switch None { None => true }

// um what were the other errors I wanted to verify?

switch 10 {
    4 => false,
    10 => true,
    _ => false
} == true

switch Option<string>:Some<string>{_: "yes"} {
    Some{_: "no"} => false,
    None => false,
    Some{_: v} => v == "yes"
} == true

@typeError("Not exhaustive")
switch Option<string>:Some<string>{_: "yes"} {
    Some{_: "no"} => false,
    None => false,
}

@typeError("expected string, found int")
switch Option<string>:Some<string>{_: "yes"} {
    Some{_: 5} => false,
    None => false,
    Some{_: v} => v == "yes"
}

@typeError("Not exhaustive")
switch 10 {
    10 => true
}

@typeError("Not exhaustive")
switch "hi" {
    "ho" => true
}

@typeError("Not exhaustive")
switch true {
    false => false
}

switch true {
    false => false,
    _ => true
} == true

@typeError("Not exhaustive")
switch y {
    None => true
}

// Type refinement please
switch y {
    Some as x => x.value == 2,
    None => true
}

switch y1 {
    Twice{two: 5} => false,
    Twice => false,
    Option as x => switch x {
        Some => false,
        None => true
    },
}

/*

const d = {type: "some", contents: "yes"}

if (d.type === 'some' && d.contents === 'no') {
    retur false
} else if (d.type === 'none') {
    return false
} else if (d.type === 'some') {
    return d.contents > 'hi'
}

switch v {
    [x, ...y, 10, 1] => true,
    [] => false,
    [2, 3 as x] => true
}

- ok what if the plan was:
- you have bindings, and conditions, and such.
- also I need to make sure uniques are actually unique. probably per-term

ok new plan. doesn't use "else".
just return when you're done.

let _handled = false

if (v.length >= 3) {
    const x = v[0]
    const y = v.slice(1, -2)
    if (v[v.length - 1] === 1) {
        if (v[v.length - 2] === 10) {
            _handled = true
            return true
        }
    }
}

// hmm does this work for the 'let binding' case?
// I guess for let-bindings we don't have conditional success.
// so its very different.





if (v.length >= 3) {

} else {
    if (v.length === 0) {
    
    } else {
        if (v.length === 2) {

        }
    }
}

if (v.length >= 3 && v[v.length - 2] === 10 && v[v.length - 1] === 1) {
    const x = v[0]
    const y = v.slice(1, -2)
    return true
}


*/


// This now has type 'Option<never>:None', which can be coerced to anything.
// const z = Option:None

// Ok type-time representation of an enum value:
// its like...
// um do I need one?
// it's just a ref, right?
// And then you go to the definition, and plug & play type variable substitutions and such.
// yeah that should be fine.

/*

Ok I think I have a plan.

*/



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

const stylesForAttributes = (attributes: Array<string>) => {
    if (attributes.includes('string')) {
        return { color: '#ce9178' };
    }
    if (attributes.includes('int')) {
        return { color: '#b5cea8' };
    }
    if (attributes.includes('bool')) {
        return { color: '#DCDCAA' };
    }
    if (attributes.includes('keyword')) {
        return { color: '#C586C0' };
    }
    if (attributes.includes('literal')) {
        return { color: 'red' };
    }
    return { color: '#aaa' };
};

const maxWidth = 60;

const renderAttributedText = (text: Array<AttributedText>) => {
    return text.map((item, i) => {
        if (typeof item === 'string') {
            return <span key={i}>{item}</span>;
        }
        if ('kind' in item) {
            return (
                <span
                    style={{
                        color: item.kind === 'sym' ? '#9CDCFE' : '#4EC9B0',
                    }}
                    key={i}
                    title={item.id + ' ' + item.kind}
                >
                    {item.text}
                </span>
            );
        }
        return (
            <span style={stylesForAttributes(item.attributes)} key={i}>
                {item.text}
            </span>
        );
    });
};

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
        <div
            style={{
                backgroundColor: '#1E1E1E',
                padding: 20,
                color: '#D4D4D4',
            }}
        >
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
            {data.expressions.map((expr, i) => (
                <div key={i}>
                    <pre>
                        <code>
                            {renderAttributedText(
                                printToAttributedText(
                                    termToPretty(data.env, expr),
                                    maxWidth,
                                ),
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
