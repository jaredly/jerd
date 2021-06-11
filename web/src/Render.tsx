/** @jsx jsx */
import { jsx } from '@emotion/react';

import * as React from 'react';
import { AttributedText } from '@jerd/language/src/printing/printer';
import { idName } from '@jerd/language/src/typing/env';
import { GlobalEnv } from '@jerd/language/src/typing/types';
import { css } from '@emotion/react';

const stylesForAttributes = (attributes: Array<string>) => {
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
    if (item.kind === 'type') {
        return '#4EC9B0';
        // return '#4EC9B0';
    }
};

export const renderAttributedTextToHTML = (
    env: GlobalEnv,
    text: Array<AttributedText>,
    allIds?: boolean,
    idColors: Array<string> = colors,
    openable = (_: string, __: string) => false,
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
                    allIds ||
                    shouldShowHash(env, item.id, item.kind, item.text);
                if (!colorMap[item.id] && item.kind === 'sym') {
                    colorMap[item.id] = idColors[colorAt++ % idColors.length];
                }
                return `<span style="color:${colorForId(item, colorMap)}"${
                    openable(item.id, item.kind)
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
            return `<span style="color:${
                stylesForAttributes(item.attributes).color
            }">${escapeHTML(item.text)}</span>`;
        })
        .join('');
};

const escapeHTML = (e: string) =>
    e.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const renderAttributedText = (
    env: GlobalEnv,
    text: Array<AttributedText>,
    onClick?: ((id: string, kind: string) => boolean) | undefined | null,
    allIds?: boolean,
    idColors: Array<string> = colors,
    openable = (id: string, kind: string) => false,
) => {
    const colorMap: { [key: string]: string } = {};
    let colorAt = 0;
    return text.map((item, i) => {
        if (typeof item === 'string') {
            return <span key={i}>{item}</span>;
        }
        if ('kind' in item) {
            const showHash =
                allIds || shouldShowHash(env, item.id, item.kind, item.text);
            if (!colorMap[item.id] && item.kind === 'sym') {
                colorMap[item.id] = idColors[colorAt++ % idColors.length];
            }
            return (
                <span
                    style={{
                        color: colorForId(item, colorMap),
                        cursor: onClick ? 'pointer' : 'inherit',
                    }}
                    css={
                        openable(item.id, item.kind)
                            ? css({
                                  ':hover': {
                                      textDecoration: 'underline',
                                  },
                              })
                            : ''
                    }
                    onMouseDown={(evt) => {}}
                    onClick={(evt) => {
                        if (onClick && onClick(item.id, item.kind)) {
                            evt.preventDefault();
                            evt.stopPropagation();
                        }
                    }}
                    key={i}
                    title={item.id + ' ' + item.kind}
                >
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
        return (
            <span style={stylesForAttributes(item.attributes)} key={i}>
                {item.text}
            </span>
        );
    });
};
