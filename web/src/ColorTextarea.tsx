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

const getOffset = (node: HTMLElement, offset: number) => {
    if (node.nodeName === '#text') {
        return offset;
    }
    let real = 0;
    node.childNodes.forEach((child) => {
        if (offset <= 0) {
            return;
        }
        if (child.nodeName === '#text') {
            offset -= 1; //child.textContent!.length;
        } else {
            offset -= 1;
        }
        real += child.textContent!.length;
    });
    return real;
};

// If we're in the middle of a one
const getPosition = (
    root: HTMLElement,
    node: HTMLElement,
    offset: number,
): number => {
    let at = offset;
    while (node !== root) {
        while (node.previousSibling) {
            node = node.previousSibling as HTMLElement;
            at += node.textContent!.length;
        }
        node = node.parentElement!;
    }
    return at;
};

const selectPosition = (
    node: HTMLElement,
    at: number,
): { node: HTMLElement; at: number } | number => {
    if (at === 0) {
        return { node, at };
    }
    const len = node.textContent!.length;
    if (at > len) {
        // return selectPosition(node.nextSibling! as HTMLElement, at - len)
        return at - len;
    }
    if (node.nodeName === '#text') {
        return { node, at };
    }
    for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        const res = selectPosition(child as HTMLElement, at);
        if (typeof res === 'number') {
            at = res;
        } else if (res) {
            return res;
        }
    }
    throw new Error(`No position`);
    // return null
};

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

const handleTab = (shiftTab: boolean, root: HTMLElement) => {
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode) {
        return;
    }
    if (shiftTab) {
        const pos = getPosition(
            root,
            sel.anchorNode as HTMLElement,
            getOffset(sel.anchorNode as HTMLElement, sel.anchorOffset),
        );
        const start = selectPosition(root, pos - 4);
        if (typeof start === 'number') {
            return console.error(`Could not find selection pos`, pos - 4);
        }

        const range = new Range();
        range.setStart(start.node, start.at);
        range.setEnd(sel.anchorNode, sel.anchorOffset);
        if (range.toString() === '    ') {
            range.deleteContents();
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        } else {
            console.log('nope', start, JSON.stringify(range.toString()));
        }
        return;
    }
    if (sel.isCollapsed) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode('    '));
        range.collapse(false);
    } else {
        const pos = getPosition(
            root,
            sel.anchorNode as HTMLElement,
            sel.anchorOffset,
        );
        console.log(`position!`, pos);
        const lines = root.textContent!.split('\n');
        let last = 0;
        for (
            let i = 0;
            i < lines.length && last + lines[i].length <= pos;
            i++
        ) {
            last += lines[i].length + 1;
        }
        console.log('newline at', last);
        const res = selectPosition(root, last);
        if (typeof res === 'number') {
            return console.error(`Could not find selection pos`, last);
        }
        sel.removeAllRanges();
        const range = new Range();
        range.setStart(res.node, res.at);
        range.setEnd(res.node, res.at);
        sel.addRange(range);
    }

    // console.log(evt.currentTarget, evt.target);
    // const sel = document.getSelection();
    // if (!sel || !sel.anchorNode) {
    //     return;
    // }
    // console.log(sel);
    // const node = document.createElement('span');
    // node.textContent = '    ';
    // if (sel.anchorNode.nodeName === '#text') {
    //     const parent = sel.anchorNode.parentElement;
    //     if (parent) {
    //         parent.insertBefore(
    //             node,
    //             sel.anchorNode.nextSibling,
    //         );
    //     }
    // } else {
    //     sel.anchorNode.insertBefore(
    //         node,
    //         sel.anchorNode.childNodes[sel.anchorOffset],
    //     );
    // }
    // const range = document.createRange();
    // range.setStart(node.childNodes[0], 4);
    // range.collapse();
    // sel.removeAllRanges();
    // sel.addRange(range);
    return false;
};

export default ({
    env,
    contents,
    value,
    onChange,
    onKeyDown,
    maxWidth,
}: any) => {
    const ref = React.useRef(null as HTMLDivElement | null);
    const set = React.useRef(false);

    const [hover, setHover] = React.useState(
        null as null | { top: number; left: number; text: string; target: any },
    );

    React.useEffect(() => {
        if (!ref.current || set.current) {
            return;
        }
        // const c = ref.current;
        set.current = true;
        // ref.current.innerHTML = '';
        // const s = document.createElement('span');
        // s.textContent = 'M';
        // ref.current.appendChild(s);
        // const w = s.getBoundingClientRect();
        // const full = ref.current.getBoundingClientRect();
        // const chars = Math.floor(full.width / w.width);
        const parsed = maybeParse(env, value, contents);
        if (parsed) {
            ref.current.innerHTML = renderAttributedTextToHTML(
                env.global,
                printToAttributedText(toplevelToPretty(env, parsed), maxWidth),
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
                position: 'relative',
                backgroundColor: '#151515',
                borderRadius: 4,
            }}
        >
            <div
                ref={(node) => {
                    if (set.current || !node) {
                        return;
                    }
                    set.current = true;
                    const parsed = maybeParse(env, value, contents);
                    if (parsed) {
                        node.innerHTML = renderAttributedTextToHTML(
                            env.global,
                            printToAttributedText(
                                toplevelToPretty(env, parsed),
                                maxWidth,
                            ),
                            true,
                        );
                    } else {
                        node.innerText = value;
                    }
                    node.focus();
                }}
                spellCheck="false"
                autoCorrect="false"
                autoCapitalize="false"
                contentEditable
                onClick={(evt) => {
                    const div = evt.target as HTMLDivElement;
                    const hash = div.getAttribute('data-hash');
                    if (hash) {
                        if (div.textContent === '#') {
                            div.textContent = '#' + hash;
                        } else {
                            div.textContent = '#';
                        }
                        evt.preventDefault();
                        evt.stopPropagation();
                    }
                }}
                onMouseOver={(evt) => {
                    const div = evt.target as HTMLDivElement;
                    const box = evt.currentTarget.getBoundingClientRect();
                    const nodePos = div.getBoundingClientRect();
                    const hash = div.getAttribute('data-hash');
                    if (hash) {
                        setHover({
                            top: nodePos.bottom - box.top + 5,
                            left: nodePos.left - box.left + 20,
                            text: '#' + hash,
                            target: div,
                        });
                    }
                }}
                onMouseOut={(evt) => {
                    if (hover && evt.target === hover.target) {
                        setHover(null);
                    }
                }}
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
                        const root = evt.currentTarget;
                        handleTab(evt.shiftKey, root);
                    }
                    onKeyDown(evt);
                }}
            />
            {hover ? (
                <div
                    style={{
                        pointerEvents: 'none',
                        top: hover.top,
                        left: hover.left,
                        position: 'absolute',
                        fontSize: '80%',
                        backgroundColor: '#111',
                        color: 'white',
                        padding: 4,
                    }}
                >
                    {hover.text}
                </div>
            ) : null}
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
