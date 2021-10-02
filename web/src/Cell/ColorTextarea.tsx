/** @jsx jsx */
import { jsx } from '@emotion/react';
import * as React from 'react';
import { parse } from '@jerd/language/src/parsing/grammar';
import { Toplevel } from '@jerd/language/src/parsing/parser';
import { printToAttributedText } from '@jerd/language/src/printing/printer';
import { toplevelToPretty } from '@jerd/language/src/printing/printTsLike';
import { typeToplevelT } from '@jerd/language/src/typing/env';
import { renderAttributedText } from './Render';
import {
    Env,
    Location,
    newWithGlobal,
    ToplevelT,
} from '@jerd/language/src/typing/types';
import {
    addLocationIndices,
    getTermByIdx,
} from '@jerd/language/src/typing/analyze';
import { render, flushSync } from 'react-dom';
import { Global } from '@emotion/react';
import { Selection } from './Cell';
import { SelectionPos } from './Cell2';

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

const textUpToPosition = (node: HTMLElement, at: number): string | number => {
    if (at === 0) {
        return '';
    }
    const len = node.textContent!.length;
    if (at > len) {
        return at - len;
    }
    if (node.nodeName === '#text') {
        return node.textContent!.slice(0, at);
    }
    let text = '';
    for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        const res = textUpToPosition(child as HTMLElement, at);
        if (typeof res === 'number') {
            text += child.textContent!;
            at = res;
        } else {
            return text + res;
        }
    }
    throw new Error(`No position`);
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

export const maybeParse = (
    env: Env,
    value: string,
    unique: null | number,
): ToplevelT | null => {
    try {
        const parsed: Array<Toplevel> = parse(value);
        if (parsed.length > 1) {
            return null;
        }
        return addLocationIndices(
            typeToplevelT(newWithGlobal(env.global), parsed[0], unique),
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
    if (root.nodeName === 'BR') {
        return '\n';
    }
    let res = '';
    root.childNodes.forEach((node) => {
        if (node.nodeName === '#text') {
            res += node.textContent;
        } else {
            res += getCode(node);
        }
    });
    const id = (root as HTMLElement).getAttribute('data-id');
    if (id) {
        let last = res.match(/\s*$/);
        const ln = last ? last[0].length : 0;
        res = res.slice(0, res.length - ln);
        res += '#' + id;
        res += last;
    }
    if (root.nodeName === 'DIV') {
        res += '\n';
    }
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

const updateSelectionFromHTML = (
    ref: { current: HTMLDivElement | null },
    updateSelection: (
        selection: null | { idx: number; node: HTMLElement },
    ) => void,
) => {
    if (!ref.current || document.activeElement !== ref.current) {
        return;
    }
    const sel = document.getSelection();
    if (!sel || !sel.focusNode || sel.focusNode !== sel.anchorNode) {
        return;
    }
    let node = sel.focusNode as HTMLElement;
    if (sel.focusNode.nodeName === '#text') {
        node = node.parentElement!;
    }
    const current = ref.current.getElementsByClassName('selected-id');
    for (let i = 0; i < current.length; i++) {
        current[i].classList.remove('selected-id');
    }

    if (!node || !node.hasAttribute('data-id')) {
        updateSelection(null);
        return;
    }

    node.classList.add('selected-id');
    const loc = node.getAttribute('data-location');
    if (loc) {
        const location: Location = JSON.parse(loc);
        updateSelection({ idx: location.idx!, node });
    }
};

export default ({
    env,
    unique,
    value,
    onChange,
    onKeyDown,
    maxWidth,
    selection,
    // setSelection,
    updateSelection,
}: {
    env: Env;
    unique: number | null;
    value: any;
    onChange: (value: string) => void;
    onKeyDown: (evt: React.KeyboardEvent) => void;
    maxWidth: number;
    selection: {
        idx: number;
        node: HTMLElement | null | undefined;
        pos: SelectionPos;
    } | null;
    // setSelection: (fn: (s: Selection) => Selection) => void;
    updateSelection: (
        newSel: null | { idx: number; node: HTMLElement },
    ) => void;
}) => {
    const ref = React.useRef(null as HTMLDivElement | null);
    const set = React.useRef(false);

    const [hover, setHover] = React.useState(
        null as null | { top: number; left: number; text: string; target: any },
    );

    React.useEffect(() => {
        const fn = () => {
            updateSelectionFromHTML(ref, updateSelection);
        };
        document.addEventListener('selectionchange', fn);
        return () => document.removeEventListener('selectionchange', fn);
    });

    return (
        <div
            style={{
                padding: 8,
                position: 'relative',
                backgroundColor: '#151515',

                borderRadius: 4,
            }}
            css={{}}
        >
            <Global
                styles={{
                    '.selected-id': {
                        textDecoration: 'underline',
                    },
                    '::selection': {
                        backgroundColor: 'rgb(50, 50, 50)',
                    },
                }}
            />
            <div
                ref={(node) => {
                    if (set.current || !node) {
                        return;
                    }
                    ref.current = node;
                    set.current = true;
                    const parsed = maybeParse(env, value, unique);
                    if (parsed) {
                        renderTheCode(env, parsed, maxWidth, node, selection);
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
                    const hash = div.getAttribute('data-id');
                    if (hash) {
                        setHover({
                            top: nodePos.bottom - box.top + 10,
                            left: nodePos.left - box.left,
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
                    if (evt.key === ' ' && evt.ctrlKey) {
                        console.log('SPACE');
                    }
                    // if (evt.key === '#') {
                    //     // TODO: Autocomplete folks
                    //     const sel = (window.sel = document.getSelection()!);
                    //     console.log(sel, sel!.getRangeAt(0));
                    //     const root = evt.currentTarget;
                    //     const pos = getPosition(
                    //         root,
                    //         sel.anchorNode as HTMLElement,
                    //         getOffset(
                    //             sel.anchorNode as HTMLElement,
                    //             sel.anchorOffset,
                    //         ),
                    //     );
                    //     console.log('POS', pos);
                    //     const lasts = textUpToPosition(root, pos);
                    //     if (typeof lasts === 'string') {
                    //         const suffix = lasts.match(/\w*$/);
                    //         if (!suffix) {
                    //             console.log('no suffix, sorry');
                    //             return;
                    //         }
                    //         console.log('ok folks', suffix[0]);
                    //     }
                    // }
                    if (
                        // TODO: Should I just say anything other
                        // than alphanumeric?
                        ' +-/*<>=()[]{}^%$#@!,.;:\'"'.includes(evt.key) &&
                        !evt.metaKey &&
                        !evt.ctrlKey
                    ) {
                        removeIdSpan(evt);
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
                        border: '1px solid white',
                        padding: 4,
                    }}
                >
                    {hover.text}
                </div>
            ) : null}
            {selection ? (
                <SelectionId
                    selection={selection.node}
                    clearNode={() => updateSelection(null)}
                />
            ) : null}
        </div>
    );
};

const SelectionId = React.memo(
    ({
        selection,
        clearNode,
    }: {
        selection: HTMLElement | null | undefined;
        clearNode: () => void;
    }) => {
        if (!selection || !selection.offsetParent) {
            return null;
        }
        const id = selection.getAttribute('data-id');
        if (!id) {
            return null;
        }

        const box = selection.getBoundingClientRect();
        const pbox = selection.offsetParent.getBoundingClientRect();
        return (
            <div
                css={{
                    top: box.bottom - pbox.top + 4,
                    left: box.left - pbox.left,
                    position: 'absolute',
                    backgroundColor: 'black',
                    padding: 4,
                    boxShadow: '0 0 3px white',
                    cursor: 'pointer',
                }}
                onClick={() => {
                    selection.removeAttribute('data-id');
                    selection.classList.remove('selected-id');
                    selection.style.color = 'inherit';
                    clearNode();
                }}
            >
                {id.startsWith(':') ? 'Symbol ' + id.slice(1) : '#' + id}
            </div>
        );
    },
);

function renderTheCode(
    env: Env,
    parsed: any,
    maxWidth: number,
    node: HTMLDivElement,
    selection: {
        idx: number;
        node: HTMLElement | null | undefined;
        pos: SelectionPos;
    } | null,
) {
    const sourceMap = {};
    const div = document.createElement('div');
    render(
        renderAttributedText(
            env.global,
            printToAttributedText(
                toplevelToPretty(env, parsed, true),
                maxWidth,
                undefined,
                sourceMap,
            ),
        ),
        div,
        () => {
            node.innerHTML = div.innerHTML;
            // Select it y'all
            const nodes = node.querySelectorAll('[data-location]');
            if (selection) {
                console.log(
                    `Looking for selection ${JSON.stringify(selection)}`,
                );

                for (let i = 0; i < nodes.length; i++) {
                    const l = JSON.parse(
                        nodes[i].getAttribute('data-location')!,
                    );
                    if (l.idx === selection.idx) {
                        nodes[i].classList.add('selected-id');
                        const sel = document.getSelection()!;
                        sel.removeAllRanges();
                        const r = document.createRange();
                        r.selectNodeContents(nodes[i]);
                        if (selection.pos === 'end') {
                            r.collapse(false);
                        } else if (selection.pos === 'start') {
                            r.collapse(true);
                        }
                        sel.addRange(r);
                        return;
                    }
                }
            } else {
                console.log(`No sleection?`);
            }
        },
    );
}

function removeIdSpan(evt: React.KeyboardEvent<HTMLDivElement>) {
    const sel = document.getSelection();
    if (sel && sel.focusNode) {
        const parent = sel.focusNode.parentElement!;
        if (parent.hasAttribute('data-id')) {
            // how do I ... make a new text dealio
            // after hthe current one?
            // ok, so if we say
            // that this is the last item
            const idx = [...(parent.childNodes as any)].indexOf(sel.focusNode);
            if (idx === parent.childNodes.length - 1) {
                console.log(idx);
                if (sel.focusOffset === sel.focusNode.nodeValue?.length) {
                    console.log('LAST');
                    const next = document.createElement('span');
                    parent.insertAdjacentElement('afterend', next);
                    // oh ok, so I can fill it with dummy,
                    // and then the key event replaces it!
                    // But what's the issue with the space?
                    // Does it auto-collapse, or some mess?
                    // ZERO_WIDTH_SPACE FOLKS
                    next.textContent = evt.key; // ZERO_WIDTH_SPACE; // evt.key;

                    sel.removeAllRanges();
                    const range = document.createRange();
                    range.selectNode(next);
                    range.collapse(false);
                    sel.addRange(range);

                    // const r = sel.getRangeAt(0);
                    // r.selectNode(next);
                    // r.collapse(false);
                    // sel.collapse(next, 1);
                    // hrmmmm does this prevent calling the whatsit?
                    evt.preventDefault();
                    evt.stopPropagation();

                    var event = new Event('input', {
                        bubbles: true,
                        cancelable: true,
                    });

                    evt.target.dispatchEvent(event);

                    // sel.selectAllChildren(next);
                }
            }
        }
    }
}
