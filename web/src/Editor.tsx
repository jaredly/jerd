// The editor bit

import * as React from 'react';
import { parse } from '../../src/parsing/grammar';
import { Expression, Toplevel } from '../../src/parsing/parser';
import {
    printToAttributedText,
    printToString,
} from '../../src/printing/printer';
import { termToPretty } from '../../src/printing/printTsLike';
import typeExpr from '../../src/typing/typeExpr';
import { renderAttributedText } from './Render';

export default ({ env, expr, onClose, onChange }) => {
    const [text, setText] = React.useState(() => {
        return printToString(termToPretty(env, expr), 50);
    });
    const typed = React.useMemo(() => {
        try {
            const parsed: Array<Toplevel> = parse(text);
            const typed = typeExpr(env, parsed[0] as Expression);

            return typed;
        } catch (err) {
            return {
                type: 'error',
                message: err.message,
                location: err.location,
            };
        }
    }, [text]);

    return (
        <div style={{ marginRight: 10 }}>
            <button onClick={() => onClose()}>Close</button>
            <textarea
                value={text}
                onChange={(evt) => setText(evt.target.value)}
                onKeyDown={(evt) => {
                    if (evt.metaKey && evt.key === 'Enter') {
                        console.log('run it');
                    }
                }}
                style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    height: 200,
                }}
            />
            <div>
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                    <code>
                        {'type' in typed && typed.type === 'error'
                            ? typed.message
                            : renderAttributedText(
                                  printToAttributedText(
                                      termToPretty(env, typed),
                                      50,
                                  ),
                              )}
                    </code>
                </pre>
            </div>
        </div>
    );
};
