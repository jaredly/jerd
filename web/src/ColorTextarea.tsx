import * as React from 'react';
import { parse } from '@jerd/language/src/parsing/grammar';
import { Toplevel } from '@jerd/language/src/parsing/parser';
import { printToAttributedText } from '@jerd/language/src/printing/printer';
import {
    toplevelToPretty,
    ToplevelT,
} from '@jerd/language/src/printing/printTsLike';
import { hashObject, typeToplevelT } from '@jerd/language/src/typing/env';
import { renderAttributedTextToHTML } from './Render';

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
        console.log('failed to parse', err);
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
        ref.current.innerHTML = '';
        const s = document.createElement('span');
        s.textContent = 'M';
        ref.current.appendChild(s);
        const w = s.getBoundingClientRect();
        const full = ref.current.getBoundingClientRect();
        const chars = Math.floor(full.width / w.width);
        const parsed = maybeParse(env, value, contents);
        console.log('horizontal chars', chars);
        if (parsed) {
            ref.current.innerHTML = renderAttributedTextToHTML(
                env.global,
                printToAttributedText(toplevelToPretty(env, parsed), chars),
                true,
            );
        } else {
            ref.current.innerText = value;
        }
        ref.current.focus();
    }, [ref.current]);
    return (
        <div
            style={{
                padding: 8,
                backgroundColor: '#2b2b2b',
                borderRadius: 4,
            }}
        >
            <div
                ref={ref}
                spellCheck="false"
                autoCorrect="false"
                autoCapitalize="false"
                contentEditable
                style={{
                    outline: 'none',
                    whiteSpace: 'pre-wrap',
                    fontFamily: '"Source Code Pro", monospace',
                    minHeight: '1em',
                }}
                onInput={(evt) => {
                    onChange(evt.currentTarget.innerText);
                }}
                onKeyDown={(evt) => {
                    if (evt.key === 'Tab') {
                        evt.preventDefault();
                        evt.stopPropagation();
                        console.log(evt.currentTarget, evt.target);
                        const sel = document.getSelection();
                        console.log(sel);
                        const node = document.createElement('span');
                        node.textContent = '    ';
                        if (sel.anchorNode.nodeName === '#text') {
                            const parent = sel.anchorNode.parentElement;
                            // const idx = [...parent.childNodes].indexOf(sel.anchorNode)
                            // console.log(parent, idx)
                            parent.insertBefore(
                                node,
                                sel.anchorNode.nextSibling,
                            );
                        } else {
                            sel.anchorNode.insertBefore(
                                node,
                                sel.anchorNode.childNodes[sel.anchorOffset],
                            );
                        }
                        const range = document.createRange();
                        range.setStart(node.childNodes[0], 4);
                        range.collapse();
                        sel.removeAllRanges();
                        sel.addRange(range);
                        // console.log(document.getSelection());
                        return false;
                    }
                    onKeyDown(evt);
                }}
            />
        </div>
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
