import * as React from 'react';
import { AttributedText } from '../../src/printing/printer';
import { idName } from '../../src/typing/env';
import { GlobalEnv } from '../../src/typing/types';
import { Content } from './Cell';

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
    return { color: '#aaa' };
};

const shouldShowHash = (
    env: GlobalEnv,
    id: string,
    kind: string,
    name: string,
) => {
    if (kind === 'term') {
        return !env.names[name] || idName(env.names[name]) !== id;
    } else if (kind === 'type' || kind === 'record' || kind === 'enum') {
        return !env.typeNames[name] || idName(env.typeNames[name]) !== id;
    }
    return false;
};

export const renderAttributedText = (
    env: GlobalEnv,
    text: Array<AttributedText>,
    onClick?: (id: string, kind: string) => boolean | null,
) => {
    return text.map((item, i) => {
        if (typeof item === 'string') {
            return <span key={i}>{item}</span>;
        }
        if ('kind' in item) {
            const showHash = shouldShowHash(env, item.id, item.kind, item.text);
            // (env.names[item.text] ? idName(env.names[item.text]) : '') !==
            //     item.id &&
            // (env.typeNames[item.text]
            //     ? idName(env.typeNames[item.text])
            //     : '') !== item.id;
            return (
                <span
                    style={{
                        color: item.kind === 'sym' ? '#9CDCFE' : '#4EC9B0',
                        cursor: 'pointer',
                    }}
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
                    {item.text + (showHash ? '#' + item.id : '')}
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