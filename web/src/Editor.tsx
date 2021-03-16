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
        if (text.trim().length === 0) {
            return [null, null];
        }
        try {
            const parsed: Array<Toplevel> = parse(text);
            if (parsed.length > 1) {
                return [
                    null,
                    { type: 'error', message: 'multiple toplevel items' },
                ];
            }
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
            <AutoresizeTextarea
                value={text}
                autoFocus
                onBlur={() => {
                    onClose();
                }}
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
                    // height: 200,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    padding: 8,
                    border: 'none',
                    fontSize: 'inherit',
                    outline: 'none',
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
                    : typed == null
                    ? null
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
