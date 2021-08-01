/** @jsx jsx */
import { jsx } from '@emotion/react';

import * as React from 'react';
import { AttributedText, Extra } from '@jerd/language/src/printing/printer';
import { idName } from '@jerd/language/src/typing/env';
import { GlobalEnv, Location } from '@jerd/language/src/typing/types';
import { css } from '@emotion/react';
import { Selection } from './Cell';

const kindColors: { [key: string]: string } = {
    string: '#ce9178',
    int: '#b5cea8',
    float: '#b5cea8',
    type: '#4EC9B0',
};

const stylesForAttributes = (attributes: Array<string | Extra>) => {
    if (attributes.includes('string')) {
        return { color: '#ce9178' };
    }
    if (attributes.includes('int') || attributes.includes('float')) {
        return { color: '#b5cea8' };
    }
    if (attributes.includes('bool')) {
        return { color: '#DCDCAA' };
    }
    if (attributes.includes('keyword')) {
        return { color: '#C586C0' };
    }
    if (attributes.includes('literal')) {
        return { color: '#faa' };
    }
    if (attributes.includes('argName')) {
        return { fontStyle: 'italic', color: '#888' };
    }
    if (attributes.includes('error')) {
        return { textDecoration: 'underline 4px red' };
    }
    return { color: '#aaa' };
};

const shouldShowHash = (
    env: GlobalEnv,
    id: string,
    kind: string,
    name: string,
) => {
    // I'm just gonna saw no on this for now

    // if (kind === 'term') {
    //     return !env.names[name] || idName(env.names[name][0]) !== id;
    // } else if (kind === 'type' || kind === 'record' || kind === 'enum') {
    //     return !env.typeNames[name] || idName(env.typeNames[name][0]) !== id;
    // }
    return false;
};

const colorsRaw =
    '1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf';
const colors: Array<string> = [];
for (let i = 0; i < colorsRaw.length; i += 6) {
    colors.push('#' + colorsRaw.slice(i, i + 6));
}

const colorForId = (
    item: { kind: string; id: string; text: string },
    colorMap: { [key: string]: string },
) => {
    if (item.kind === 'sym') {
        return colorMap[item.id] || '#9CDCFE';
    }
    if (item.kind === 'term') {
        return 'rgb(138,220,255)';
    }
    return kindColors[item.kind];
};

export const renderAttributedTextToHTML = (
    env: GlobalEnv,
    text: Array<AttributedText>,
    allIds?: boolean,
    idColors: Array<string> = colors,
    openable = (_: string, __: string, ___?: Location) => false,
): string => {
    const colorMap: { [key: string]: string } = {};
    let colorAt = 0;
    return text
        .map((item, i) => {
            if (typeof item === 'string') {
                return escapeHTML(item);
            }
            if ('kind' in item) {
                const showHash =
                    item.id != '' &&
                    (allIds ||
                        shouldShowHash(env, item.id, item.kind, item.text));
                if (!colorMap[item.id] && item.kind === 'sym') {
                    colorMap[item.id] = idColors[colorAt++ % idColors.length];
                }
                return `<span style="color:${colorForId(item, colorMap)}"${
                    openable(item.id, item.kind, item.loc)
                        ? ` class="${css({
                              ':hover': {
                                  textDecoration: 'underline',
                              },
                          })}"`
                        : ''
                }>${escapeHTML(item.text)}${
                    showHash
                        ? `<span style="color: #777; cursor: ew-resize" contenteditable="false" data-hash="${item.id}">#</span>`
                        : ''
                }</span>`;
            }
            const style = stylesForAttributes(item.attributes);
            let styleString = '';
            if (style.color) {
                styleString = `color:${style.color}`;
            }
            if (style.fontStyle) {
                styleString += `;font-style:${style.fontStyle}`;
            }
            if (style.textDecoration) {
                styleString += `;text-decoration:${style.textDecoration}`;
            }
            if ('type' in item && item.type === 'Group') {
                return `<span
                    data-location=${
                        item.loc ? JSON.stringify(item.loc) : undefined
                    }
                    style='${styleString}'
                    key=${i}
                >${renderAttributedTextToHTML(
                    env,
                    item.contents,
                    allIds,
                    idColors,
                )}</span>`;
            }
            return `<span style="${styleString}">${escapeHTML(
                (item as any).text,
            )}</span>`;
        })
        .join('');
};

const escapeHTML = (e: string) =>
    e.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const renderAttributedText = (
    env: GlobalEnv,
    text: Array<AttributedText>,
    onClick?:
        | ((
              evt: React.MouseEvent,
              id: string,
              kind: string,
              loc?: Location,
          ) => boolean)
        | undefined
        | null,
    allIds?: boolean,
    idColors: Array<string> = colors,
    openable = (id: string, kind: string, loc?: Location) => false,
    setHover = (hover: Extra, target: HTMLDivElement | null) =>
        console.log('hover', hover, target),
    selection: null | Selection = null,
    colorMap: { map: { [key: string]: string }; colorAt: number } = {
        map: {},
        colorAt: 0,
    },
) => {
    const idx = selection ? selection.idx : null;
    const marks = selection ? selection.marks : null;
    const locStyle = (loc: Location | null | undefined) => {
        if (!loc || loc.idx == null) {
            return undefined;
        }
        if (marks && marks.includes(loc.idx)) {
            if (loc.idx === idx) {
                return markAndHlStyle;
            }
            return markStyle;
        }
        if (selection && selection.level !== 'inner') {
            return loc.idx === idx ? hlStyleLight : null;
        }
        return loc.idx === idx ? hlStyle : null;
    };

    return text.map((item, i) => {
        if (typeof item === 'string') {
            return <span key={i}>{item}</span>;
        }
        if ('kind' in item) {
            const showHash =
                item.id != '' &&
                (allIds || shouldShowHash(env, item.id, item.kind, item.text));
            if (item.kind === 'sym' && !colorMap.map[item.id]) {
                colorMap.map[item.id] =
                    idColors[colorMap.colorAt++ % idColors.length];
            }
            return (
                <span
                    style={{
                        color: colorForId(item, colorMap.map),
                        cursor: onClick ? 'pointer' : 'inherit',
                        ...locStyle(item.loc),
                    }}
                    data-kind={item.kind}
                    data-location={
                        item.loc ? JSON.stringify(item.loc) : undefined
                    }
                    data-id={item.id}
                    css={
                        openable(item.id, item.kind, item.loc)
                            ? css({
                                  ':hover': {
                                      textDecoration: 'underline',
                                  },
                              })
                            : ''
                    }
                    onMouseDown={(evt) => {}}
                    onClick={(evt) => {
                        if (
                            onClick &&
                            onClick(evt, item.id, item.kind, item.loc)
                        ) {
                            evt.preventDefault();
                            evt.stopPropagation();
                        }
                    }}
                    key={i}
                    // title={item.id + ' ' + item.kind}
                >
                    {/* {item.loc ? (
                        <span css={{ color: 'red', fontSize: '50%' }}>
                            {item.loc.idx}
                        </span>
                    ) : (
                        ''
                    )} */}
                    {item.text}
                    {showHash ? (
                        <span
                            style={{
                                color: '#777',
                                fontSize: '60%',
                            }}
                        >
                            #{item.id}
                        </span>
                    ) : null}
                </span>
            );
        }
        if ('type' in item && item.type === 'Group') {
            const first = item.attributes.find(
                (x) => typeof x !== 'string',
            ) as Extra | null;
            return (
                <span
                    data-location={
                        item.loc ? JSON.stringify(item.loc) : undefined
                    }
                    data-kind="group"
                    onMouseEnter={
                        first
                            ? (evt) => {
                                  setHover(
                                      first,
                                      evt.currentTarget as HTMLDivElement,
                                  );
                              }
                            : undefined
                    }
                    onMouseLeave={
                        first
                            ? (evt) => {
                                  setHover(first, null);
                              }
                            : undefined
                    }
                    style={{
                        ...stylesForAttributes(item.attributes),
                        ...locStyle(item.loc),
                    }}
                    key={i}
                >
                    {renderAttributedText(
                        env,
                        item.contents,
                        onClick,
                        allIds,
                        idColors,
                        openable,
                        setHover,
                        selection,
                        colorMap,
                    )}
                </span>
            );
        }
        return (
            <span
                data-location={item.loc ? JSON.stringify(item.loc) : undefined}
                data-kind={'misc'}
                style={{ ...locStyle(item.loc) }}
                key={i}
            >
                {(item as any).text}
            </span>
        );
    });
};
// const hlColor = 'rgba(255,255,255,0.1)';
const hlBorder = '2px solid #fa0';
const hlStyleLight = {
    // backgroundColor: hlColor,
    // borderLeft: hlBorder,
    // borderRight: hlBorder,
    outline: '2px solid #a60',
};
const hlStyle = {
    // backgroundColor: hlColor,
    // borderLeft: hlBorder,
    // borderRight: hlBorder,
    outline: hlBorder,
};
const markAndHlStyle = {
    outline: '2px dashed red',
};
const markStyle = {
    outline: '2px solid red',
};
