import * as React from 'react';
import { AttributedText } from '../../src/printing/printer';

const stylesForAttributes = (attributes: Array<string>) => {
    if (attributes.includes('string')) {
        return { color: '#ce9178' };
    }
    if (attributes.includes('int')) {
        return { color: '#b5cea8' };
    }
    if (attributes.includes('bool')) {
        return { color: '#DCDCAA' };
    }
    if (attributes.includes('keyword')) {
        return { color: '#C586C0' };
    }
    if (attributes.includes('literal')) {
        return { color: 'red' };
    }
    return { color: '#aaa' };
};

export const renderAttributedText = (text: Array<AttributedText>) => {
    return text.map((item, i) => {
        if (typeof item === 'string') {
            return <span key={i}>{item}</span>;
        }
        if ('kind' in item) {
            return (
                <span
                    style={{
                        color: item.kind === 'sym' ? '#9CDCFE' : '#4EC9B0',
                    }}
                    key={i}
                    title={item.id + ' ' + item.kind}
                >
                    {item.text}
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
