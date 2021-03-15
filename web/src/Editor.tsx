// The editor bit

import * as React from 'react';
import { parse } from '../../src/parsing/grammar';
import { Expression, Toplevel } from '../../src/parsing/parser';
import {
    printToAttributedText,
    printToString,
} from '../../src/printing/printer';
import {
    termToPretty,
    toplevelToPretty,
    ToplevelT,
} from '../../src/printing/printTsLike';
import typeExpr from '../../src/typing/typeExpr';
import { EnumDef, Env, Term } from '../../src/typing/types';
import { typeToplevelT } from '../../src/typing/env';
import { renderAttributedText } from './Render';
import AutoresizeTextarea from 'react-textarea-autosize';

export default ({
    env,
    contents,
    onClose,
    onChange,
}: {
    env: Env;
    contents: ToplevelT | string;
    onClose: () => void;
    onChange: (term: ToplevelT | string) => void;
}) => {
    const [text, setText] = React.useState(() => {
        return typeof contents === 'string'
            ? contents
            : printToString(toplevelToPretty(env, contents), 50);
    });
    const [typed, err] = React.useMemo(() => {
        try {
            const parsed: Array<Toplevel> = parse(text);
            if (parsed.length > 1) {
                return [
                    null,
                    { type: 'error', message: 'multiple toplevel items' },
                ];
            }
            // if (parsed[0].type === 'define') {
            //     // TODO type annotation
            //     const term = typeExpr(env, parsed[0].expr);
            //     return {
            //         type: 'Define',
            //         id:
            //     };
            // }
            // const typed = typeExpr(env, parsed[0] as Expression);

            // return [typed, null];
            return [typeToplevelT(env, parsed[0]), null];
        } catch (err) {
            return [
                null,
                {
                    type: 'error',
                    message: err.message,
                    location: err.location,
                },
            ];
        }
    }, [text]);

    return (
        <div style={{ marginRight: 10 }}>
            <button onClick={() => onClose()}>Close</button>
            <AutoresizeTextarea
                value={text}
                onChange={(evt) => setText(evt.target.value)}
                onKeyDown={(evt) => {
                    if (evt.metaKey && evt.key === 'Enter') {
                        console.log('run it');
                        onChange(typed == null ? text : typed);
                    }
                }}
                style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    fontFamily: '"Source Code Pro", monospace',
                    height: 200,
                }}
            />
            <div
                style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: '"Source Code Pro", monospace',
                    padding: 8,
                }}
            >
                {err != null
                    ? err.message
                    : renderAttributedText(
                          printToAttributedText(
                              toplevelToPretty(env, typed),
                              50,
                          ),
                      )}
            </div>
        </div>
    );
};
