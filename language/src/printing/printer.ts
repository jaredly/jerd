// A basic width-aware pretty printer

import { isBinop } from '../typing/terms/ops';
import { Location, locToEnd, locToStart, Type } from '../typing/types';

// Doesn't need to be terribly fancy.

export type Extra = { type: 'Error'; expected: Type; found: Type };

export const items = (
    items: Array<PP | null>,
    breakable = false,
    loc?: Location,
    attributes?: Array<string | Extra>,
): PP => ({
    type: 'items',
    items: items.filter((x) => x != null) as Array<PP>,
    breakable,
    loc,
    attributes,
});
export const args = (
    contents: Array<PP>,
    left = '(',
    right = ')',
    trailing = true,
    loc?: Location,
    rest?: PP,
): PP => ({
    type: 'args',
    contents,
    left,
    right,
    trailing,
    loc,
    rest,
});
export const block = (
    contents: Array<PP>,
    sep: string = ';',
    loc?: Location,
): PP => ({
    type: 'block',
    contents,
    sep,
    loc,
});
export const atom = (
    text: string,
    attributes?: Array<string>,
    loc?: Location,
): PP => ({
    type: 'atom',
    text,
    attributes,
    loc,
});
export const id = (
    text: string,
    id: string,
    kind: string,
    loc?: Location,
): PP => {
    if (text == null) {
        throw new Error(`ID with no text`);
    }
    return {
        type: 'id',
        text,
        id,
        kind,
        loc,
    };
};

export type PP =
    | {
          type: 'atom';
          text: string;
          attributes?: Array<string>;
          loc: Location | undefined;
      }
    | { type: 'id'; text: string; id: string; kind: string; loc?: Location }
    | { type: 'block'; contents: Array<PP>; sep: string; loc?: Location } // surrounded by {}
    | {
          type: 'args';
          contents: Array<PP>;
          left: string;
          right: string;
          trailing: boolean;
          loc?: Location;
          rest?: PP;
      } // surrounded by ()
    | {
          type: 'items';
          items: Array<PP>;
          breakable: boolean;
          loc?: Location;
          attributes?: Array<string | Extra>;
      };

const white = (x: number) => new Array(x).fill(' ').join('');

const width = (x: PP): number => {
    switch (x.type) {
        case 'atom':
            return x.text.length;
        case 'id':
            return x.text.length + 1 + x.id.length;
        case 'items':
            return x.items.reduce((w, x) => width(x) + w, 0);
        default:
            if (!x.contents.length) {
                return 2;
            }
            return (
                2 +
                x.contents.reduce((w, x) => width(x) + w, 0) +
                (x.contents.length - 1) * 2
            );
    }
};

export type StringOptions = { hideIds?: boolean; hideNames?: boolean };

export const printToStringInner = (
    pp: PP,
    maxWidth: number,
    options: StringOptions,
    sourceMap: SourceMap,
    current: { indent: number; pos: number; line: number } = {
        indent: 0,
        pos: 0,
        line: 0,
    },
): string => {
    const start = { line: current.line, column: current.pos };
    if (pp.type === 'atom') {
        current.pos += pp.text.length;
        current.line += pp.text.split(/\n/g).length - 1;
        if (pp.loc && pp.loc.idx) {
            sourceMap[pp.loc.idx] = {
                start,
                end: {
                    line: current.line,
                    column: current.pos,
                },
                idx: pp.loc.idx,
            };
        }
        return pp.text;
    }
    if (pp.type === 'id') {
        if (
            options.hideNames &&
            pp.kind === 'type'
            // pp.kind !== 'builtin' &&
            // pp.kind !== 'attribute' &&
            // !isBinop(pp.text) &&
            // pp.text !== 'as' &&
            // pp.id
        ) {
            return `anon#${pp.id}`;
        }

        if (options.hideIds || !pp.id) {
            current.pos += pp.text.length;
        } else {
            current.pos += pp.text.length + 1 + pp.id.length;
        }
        current.line += pp.text.split(/\n/g).length - 1;

        if (pp.loc && pp.loc.idx) {
            sourceMap[pp.loc.idx] = {
                start,
                end: {
                    line: current.line,
                    column: current.pos,
                },
                idx: pp.loc.idx,
            };
        }

        if (options.hideIds || !pp.id) {
            return pp.text;
        }
        return pp.text + '#' + pp.id;
    }
    // Always breaks
    if (pp.type === 'block') {
        let res = '{';
        current.indent += 4;
        pp.contents.forEach((item) => {
            current.pos = current.indent;
            current.line += 1;
            res +=
                '\n' +
                white(current.indent) +
                printToStringInner(
                    item,
                    maxWidth,
                    options,
                    sourceMap,
                    current,
                ) +
                pp.sep;
        });
        current.indent -= 4;
        if (res.length > 1) {
            res += '\n' + white(current.indent);
            current.pos = current.indent;
        }
        current.pos += 1;
        res += '}';

        if (pp.loc && pp.loc.idx) {
            sourceMap[pp.loc.idx] = {
                start,
                end: {
                    line: current.line,
                    column: current.pos,
                },
                idx: pp.loc.idx,
            };
        }

        return res;
    }
    // Sometimes breaks
    if (pp.type === 'args') {
        const full = width(pp);
        // const full = pp.contents.reduce((w, x) => w + width(x), 0)
        if (current.pos + full <= maxWidth) {
            let res = pp.left;
            current.pos += 1;
            pp.contents.forEach((child, i) => {
                if (i !== 0) {
                    res += ', ';
                    current.pos += 2;
                }
                const ctext = printToStringInner(
                    child,
                    maxWidth,
                    options,
                    sourceMap,
                    current,
                );
                // current.pos += ctext.length;
                res += ctext;
            });
            current.pos += 1;

            if (pp.loc && pp.loc.idx) {
                sourceMap[pp.loc.idx] = {
                    start,
                    end: {
                        line: current.line,
                        column: current.pos,
                    },
                    idx: pp.loc.idx,
                };
            }

            return res + pp.right;
        }

        let res = pp.left;
        current.pos += 1;
        current.indent += 4;
        pp.contents.forEach((item, i) => {
            current.pos = current.indent;
            current.line += 1;
            res +=
                '\n' +
                white(current.indent) +
                printToStringInner(item, maxWidth, options, sourceMap, current);
            if (pp.trailing || i < pp.contents.length - 1) {
                res += ',';
            }
        });
        current.indent -= 4;
        if (res.length > 1) {
            current.line += 1;
            res += '\n' + white(current.indent);
            current.pos = current.indent;
        }
        current.pos += 1;
        res += pp.right;

        if (pp.loc && pp.loc.idx) {
            sourceMap[pp.loc.idx] = {
                start,
                end: {
                    line: current.line,
                    column: current.pos,
                },
                idx: pp.loc.idx,
            };
        }

        return res;
    }
    if (pp.type === 'items') {
        if (pp.breakable && current.pos + width(pp) > maxWidth) {
            let res = '';
            current.indent += 4;
            pp.items.forEach((item, i) => {
                if (i > 0) {
                    current.pos = current.indent;
                    current.line += 1;
                    res += '\n' + white(current.indent);
                }
                res += printToStringInner(
                    item,
                    maxWidth,
                    options,
                    sourceMap,
                    current,
                );
            });
            current.indent -= 4;
            // if (res.length > 1) {
            //     res += '\n' + white(current.indent);
            //     current.pos = current.indent;
            // }

            if (pp.loc && pp.loc.idx) {
                sourceMap[pp.loc.idx] = {
                    start,
                    end: {
                        line: current.line,
                        column: current.pos,
                    },
                    idx: pp.loc.idx,
                };
            }
            return res;
        }
        let res = '';
        pp.items.forEach((item) => {
            res += printToStringInner(
                item,
                maxWidth,
                options,
                sourceMap,
                current,
            );
        });

        if (pp.loc && pp.loc.idx) {
            sourceMap[pp.loc.idx] = {
                start,
                end: {
                    line: current.line,
                    column: current.pos,
                },
                idx: pp.loc.idx,
            };
        }
        return res;
    }
    throw new Error(`unexpected pp type ${JSON.stringify(pp)}`);
};

export const printToString = (
    pp: PP,
    maxWidth: number,
    options: StringOptions = { hideIds: false, hideNames: false },
    sourceMap: SourceMap = {},
): string => {
    return printToStringInner(pp, maxWidth, options, sourceMap, {
        indent: 0,
        pos: 0,
        line: 0,
    });
};

export type AttributedText =
    | string
    | { text: string; attributes: Array<string>; loc?: Location }
    | {
          type: 'Group';
          contents: Array<AttributedText>;
          attributes: Array<string | Extra>;
          loc?: Location;
      }
    | { id: string; text: string; kind: string; loc?: Location };

export type SourceItem = {
    start: { line: number; column: number };
    end: { line: number; column: number };
    idx: number;
};
export type SourceMap = {
    [idx: number]: SourceItem;
};

export const printToAttributedText = (
    pp: PP,
    maxWidth: number,
    current: { indent: number; pos: number; line: number } = {
        indent: 0,
        pos: 0,
        line: 0,
    },
    sourceMap: SourceMap = {},
): Array<AttributedText> => {
    const start = { line: current.line, column: current.pos };
    if (pp.type === 'atom') {
        current.pos += pp.text.length;
        current.line += pp.text.split(/\n/g).length - 1;
        return pp.attributes || pp.loc
            ? [{ text: pp.text, attributes: pp.attributes || [], loc: pp.loc }]
            : [pp.text];
    }
    if (pp.type === 'id') {
        // ids really shouldn't contain newlines
        if (pp.loc && pp.loc.idx) {
            sourceMap[pp.loc.idx] = {
                start,
                end: {
                    line: current.line,
                    column: current.pos + pp.text.length,
                },
                idx: pp.loc.idx,
            };
        }
        current.pos += pp.text.length;
        return [pp];
    }
    if (pp.type === 'block') {
        const res: Array<AttributedText> = [
            {
                text: '{',
                attributes: ['brace'],
                // loc: pp.loc ? locToStart(pp.loc) : undefined,
            },
        ];
        current.indent += 4;
        pp.contents.forEach((item) => {
            current.line += 1;
            current.pos = current.indent;
            res.push(
                '\n' + white(current.indent),
                ...printToAttributedText(item, maxWidth, current, sourceMap),
                { text: pp.sep, attributes: ['semi'] },
            );
        });
        current.indent -= 4;
        if (res.length > 1) {
            current.line += 1;
            res.push('\n' + white(current.indent));
            current.pos = current.indent;
        }
        current.pos += 1;
        res.push({
            text: '}',
            attributes: ['brace'],
            // loc: pp.loc ? locToEnd(pp.loc) : undefined,
        });
        if (pp.loc) {
            sourceMap[pp.loc.idx!] = {
                start,
                end: { line: current.line, column: current.pos },
                idx: pp.loc.idx!,
            };

            return [
                {
                    type: 'Group',
                    contents: res,
                    attributes: [],
                    loc: pp.loc,
                },
            ];
        }
        return res;
    }
    if (pp.type === 'args') {
        const full = width(pp);
        // const full = pp.contents.reduce((w, x) => w + width(x), 0)
        if (current.pos + full <= maxWidth) {
            const res: Array<AttributedText> = [
                { text: pp.left, attributes: ['brace'] },
            ];
            current.pos += 1;
            pp.contents.forEach((child, i) => {
                if (i !== 0) {
                    res.push({ text: ', ', attributes: ['comma'] });
                    current.pos += 2;
                }
                res.push(
                    ...printToAttributedText(
                        child,
                        maxWidth,
                        current,
                        sourceMap,
                    ),
                );
            });
            current.pos += 1;
            res.push({ text: pp.right, attributes: ['brace'] });
            return res;
        }

        const res: Array<AttributedText> = [
            { text: pp.left, attributes: ['brace'] },
        ];
        current.pos += 1;
        current.indent += 4;
        pp.contents.forEach((item, i) => {
            current.line += 1;
            current.pos = current.indent;
            res.push(
                '\n' + white(current.indent),
                ...printToAttributedText(item, maxWidth, current, sourceMap),
            );
            if (pp.trailing || i < pp.contents.length - 1) {
                res.push({ text: ',', attributes: ['comma'] });
            }
        });
        current.indent -= 4;
        if (res.length > 1) {
            current.line += 1;
            res.push('\n' + white(current.indent));
            current.pos = current.indent;
        }
        current.pos += 1;
        res.push({ text: pp.right, attributes: ['brace'] });
        return res;
    }
    if (pp.type === 'items') {
        if (
            pp.breakable &&
            pp.items.length &&
            current.pos + width(pp) > maxWidth
        ) {
            const res: Array<AttributedText> = [];
            pp.items.forEach((item, i) => {
                if (i > 0) {
                    current.pos = current.indent;
                    current.line += 1;
                    res.push('\n' + white(current.indent));
                }
                res.push(
                    ...printToAttributedText(
                        item,
                        maxWidth,
                        current,
                        sourceMap,
                    ),
                );
                if (i == 0) {
                    current.indent += 4;
                }
            });
            current.indent -= 4;
            if (pp.loc) {
                sourceMap[pp.loc.idx!] = {
                    start,
                    end: { column: current.pos, line: current.line },
                    idx: pp.loc.idx!,
                };
            }
            if (pp.attributes || pp.loc) {
                return [
                    {
                        type: 'Group',
                        contents: res,
                        attributes: pp.attributes || [],
                        loc: pp.loc,
                    },
                ];
            }
            return res;
        }

        const res: Array<AttributedText> = [];
        pp.items.forEach((item) => {
            res.push(
                ...printToAttributedText(item, maxWidth, current, sourceMap),
            );
        });
        if (pp.loc) {
            sourceMap[pp.loc.idx!] = {
                start,
                end: { column: current.pos, line: current.line },
                idx: pp.loc.idx!,
            };
        }
        if (pp.attributes || pp.loc) {
            return [
                {
                    type: 'Group',
                    contents: res,
                    attributes: pp.attributes || [],
                    loc: pp.loc,
                },
            ];
        }
        return res;
    }
    throw new Error(`unexpected pp type ${JSON.stringify(pp)}`);
};
