import * as React from 'react';
import { parse, SyntaxError } from '@jerd/language/src/parsing/grammar';
import { Expression, Toplevel } from '@jerd/language/src/parsing/parser';
import {
    printToAttributedText,
    printToString,
} from '@jerd/language/src/printing/printer';
import {
    termToPretty,
    toplevelToPretty,
    ToplevelT,
} from '@jerd/language/src/printing/printTsLike';
import typeExpr, { showLocation } from '@jerd/language/src/typing/typeExpr';
import {
    EnumDef,
    Env,
    Id,
    Symbol,
    Term,
    Type,
} from '@jerd/language/src/typing/types';
import {
    hashObject,
    idName,
    typeToplevelT,
} from '@jerd/language/src/typing/env';
import { renderAttributedText, renderAttributedTextToHTML } from './Render';
import AutoresizeTextarea from 'react-textarea-autosize';
import { UnresolvedIdentifier } from '@jerd/language/src/typing/errors';
import { Content } from './Cell';

const topHash = (t: ToplevelT) =>
    t.type === 'Expression' ? hashObject(t.term) : t.id.hash;

const maybeParse = (
    env,
    value,
    contents: ToplevelT | string,
): ToplevelT | null => {
    try {
        const parsed: Array<Toplevel> = parse(value);
        if (parsed.length > 1) {
            return null;
        }
        return typeToplevelT(
            env,
            parsed[0],
            typeof contents !== 'string' && contents.type === 'RecordDef'
                ? contents.def.unique
                : null,
        );
    } catch (err) {
        return null;
    }
};

export default ({ env, contents, value, onChange, onKeyDown }) => {
    const ref = React.useRef(null);
    const set = React.useRef(false);
    React.useEffect(() => {
        if (!ref.current || set.current) {
            return;
        }
        set.current = true;
        const parsed = maybeParse(env, value, contents);
        if (parsed) {
            ref.current.innerHTML = renderAttributedTextToHTML(
                env.global,
                printToAttributedText(toplevelToPretty(env, parsed), 50),
                true,
            );
        } else {
            ref.current.innerText = value;
        }
        ref.current.focus();
    }, [ref.current]);
    return (
        <div
            ref={ref}
            spellCheck="false"
            autoCorrect="false"
            autoCapitalize="false"
            contentEditable
            style={{
                backgroundColor: '#2b2b2b',
                padding: 8,
                borderRadius: 4,
                outline: 'none',
                whiteSpace: 'pre-wrap',
                fontFamily: '"Source Code Pro", monospace',
                minHeight: '1em',
            }}
            onInput={(evt) => {
                onChange(evt.currentTarget.innerText);
            }}
            onKeyDown={onKeyDown}
        />
    );
};

// export default ({
//     env,
//     contents,
// }: {
//     env: Env;
//     contents: ToplevelT | string;
// }) => {
//     const [text, setText] = React.useState(() => {
//         return typeof contents === 'string'
//             ? contents
//             : printToString(toplevelToPretty(env, contents), 50);
//     });

//     const ref = React.useRef(null);

//     const prevHash = React.useRef(null);

//     const [typed, err] = React.useMemo(() => {
//         if (text.trim().length === 0) {
//             return [null, null];
//         }
//         try {
//             const parsed: Array<Toplevel> = parse(text);
//             if (parsed.length > 1) {
//                 return [
//                     null,
//                     { type: 'error', message: 'multiple toplevel items' },
//                 ];
//             }
//             const t = typeToplevelT(
//                 env,
//                 parsed[0],
//                 typeof contents !== 'string' && contents.type === 'RecordDef'
//                     ? contents.def.unique
//                     : null,
//             );
//             if (topHash(t) !== prevHash.current && ref.current != null) {
//                 ref.current.innerHTML = renderAttributedTextToHTML(
//                     env.global,
//                     printToAttributedText(toplevelToPretty(env, t), 50),
//                     true,
//                 );
//             }

//             return [t, null];
//         } catch (err) {
//             return [null, err];
//         }
//     }, [text]);

//     // prevHash.current = typed != null ? topHash(typed) : null;

//     React.useEffect(() => {
//         if (typed != null) {
//             ref.current.innerHTML = renderAttributedTextToHTML(
//                 env.global,
//                 printToAttributedText(toplevelToPretty(env, typed), 50),
//                 true,
//             );
//         } else if (typeof contents === 'string') {
//             ref.current.innerHTML = contents;
//         }
//     }, [ref.current]);

//     return (
//         <div>
//             <div
//                 ref={ref}
//                 spellCheck="false"
//                 autoCorrect="false"
//                 autoCapitalize="false"
//                 onInput={(evt) => {
//                     console.log(evt.currentTarget.innerHTML);
//                     setText(evt.currentTarget.innerText);
//                 }}
//                 style={{
//                     whiteSpace: 'pre-wrap',
//                     fontFamily: '"Source Code Pro", monospace',
//                     minHeight: '1em',
//                 }}
//                 contentEditable
//             />
//         </div>
//     );
// };

const styles = {
    hash: {
        position: 'absolute',
        top: 8,
        right: 8,
        fontSize: '80%',
        color: 'rgba(255,255,255,0.5)',
    },
};
