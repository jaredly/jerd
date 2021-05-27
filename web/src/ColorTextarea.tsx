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
import { Env } from '@jerd/language/src/typing/types';

const maybeParse = (
    env: Env,
    value: string,
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

const getCode = (root: ChildNode) => {
    if (root.textContent === '#') {
        // @ts-ignore
        const hash = root.getAttribute('data-hash');
        if (hash != null) {
            return '#' + hash;
        }
    }
    let res = '';
    root.childNodes.forEach((node) => {
        if (node.nodeName === '#text') {
            res += node.textContent;
        } else {
            res += getCode(node);
        }
    });
    return res;
};

export default ({ env, contents, value, onChange, onKeyDown }: any) => {
    const ref = React.useRef(null as HTMLDivElement | null);
    const set = React.useRef(false);
    React.useEffect(() => {
        if (!ref.current || set.current) {
            return;
        }
        const c = ref.current;
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
                    onChange(getCode(evt.currentTarget));
                }}
                onKeyDown={(evt) => {
                    if (evt.key === 'Tab') {
                        evt.preventDefault();
                        evt.stopPropagation();
                        console.log(evt.currentTarget, evt.target);
                        const sel = document.getSelection();
                        if (!sel || !sel.anchorNode) {
                            return;
                        }
                        console.log(sel);
                        const node = document.createElement('span');
                        node.textContent = '    ';
                        if (sel.anchorNode.nodeName === '#text') {
                            const parent = sel.anchorNode.parentElement;
                            if (parent) {
                                parent.insertBefore(
                                    node,
                                    sel.anchorNode.nextSibling,
                                );
                            }
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
                        return false;
                    }
                    onKeyDown(evt);
                }}
            />
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
