// Ok so it'll be a contenteditable,
// with the content replaced & colorized ... when? when it type checks?
// will that be annoying? or do you do a keycode?
// we can have the running full dealio below, I think...
// Also, how do we indicate ids? Should they be rendered?

import * as React from 'react';
import { parse, SyntaxError } from '../../src/parsing/grammar';
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
import typeExpr, { showLocation } from '../../src/typing/typeExpr';
import { EnumDef, Env, Id, Symbol, Term, Type } from '../../src/typing/types';
import { idName, typeToplevelT } from '../../src/typing/env';
import { renderAttributedText, renderAttributedTextToHTML } from './Render';
import AutoresizeTextarea from 'react-textarea-autosize';
import { UnresolvedIdentifier } from '../../src/typing/errors';

export default ({
    env,
    contents,
}: {
    env: Env;
    contents: ToplevelT | string;
}) => {
    const [text, setText] = React.useState(() => {
        return typeof contents === 'string'
            ? contents
            : printToString(toplevelToPretty(env, contents), 50);
    });

    const ref = React.useRef(null);

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
            const t = typeToplevelT(
                env,
                parsed[0],
                typeof contents !== 'string' && contents.type === 'RecordDef'
                    ? contents.def.unique
                    : null,
            );
            ref.current.innerHTML = renderAttributedTextToHTML(
                env.global,
                printToAttributedText(toplevelToPretty(env, t), 50),
            );

            return [t, null];
        } catch (err) {
            return [null, err];
        }
    }, [text]);

    React.useEffect(() => {
        if (typed != null) {
            ref.current.innerHTML = renderAttributedTextToHTML(
                env.global,
                printToAttributedText(toplevelToPretty(env, typed), 50),
            );
        } else if (typeof contents === 'string') {
            ref.current.innerHTML = contents;
        }
    }, [ref.current]);

    return (
        <div>
            Edit please
            <div
                ref={ref}
                onInput={(evt) => {
                    console.log(evt.currentTarget.innerHTML);
                    setText(evt.currentTarget.innerText);
                }}
                style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: '"Source Code Pro", monospace',
                    minHeight: '1em',
                }}
                contentEditable
            />
            <div
                style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: '"Source Code Pro", monospace',
                    padding: 8,
                    position: 'relative',
                }}
            >
                {err != null
                    ? err.message
                    : typed == null
                    ? null
                    : renderAttributedText(
                          env.global,
                          printToAttributedText(
                              toplevelToPretty(env, typed),
                              50,
                          ),
                      )}
                {typed != null && typed.id != null ? (
                    // @ts-ignore
                    <div style={styles.hash}>#{idName(typed.id)}</div>
                ) : null}
            </div>
        </div>
    );
};

const styles = {
    hash: {
        position: 'absolute',
        top: 8,
        right: 8,
        fontSize: '80%',
        color: 'rgba(255,255,255,0.5)',
    },
};
