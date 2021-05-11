// A basic width-aware pretty printer

// Doesn't need to be terribly fancy.

export const items = (items: Array<PP | null>): PP => ({
    type: 'items',
    items: items.filter((x) => x != null) as Array<PP>,
});
export const args = (
    contents: Array<PP>,
    left = '(',
    right = ')',
    trailing = true,
): PP => ({
    type: 'args',
    contents,
    left,
    right,
    trailing,
});
export const block = (contents: Array<PP>, sep: string = ';'): PP => ({
    type: 'block',
    contents,
    sep,
});
export const atom = (text: string, attributes?: Array<string>): PP => ({
    type: 'atom',
    text,
    attributes,
});
export const id = (text: string, id: string, kind: string): PP => ({
    type: 'id',
    text,
    id,
    kind,
});

export type PP =
    | { type: 'atom'; text: string; attributes?: Array<string> }
    | { type: 'id'; text: string; id: string; kind: string }
    | { type: 'block'; contents: Array<PP>; sep: string } // surrounded by {}
    | {
          type: 'args';
          contents: Array<PP>;
          left: string;
          right: string;
          trailing: boolean;
      } // surrounded by ()
    | { type: 'items'; items: Array<PP> };

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

export type StringOptions = { hideIds?: boolean };

export const printToStringInner = (
    pp: PP,
    maxWidth: number,
    options: StringOptions,
    current: { indent: number; pos: number } = { indent: 0, pos: 0 },
): string => {
    if (pp.type === 'atom') {
        current.pos += pp.text.length;
        return pp.text;
    }
    if (pp.type === 'id') {
        current.pos += pp.text.length + 1 + pp.id.length;
        if (options.hideIds) {
            return pp.text;
        }
        return pp.text + '#' + pp.id;
    }
    if (pp.type === 'block') {
        let res = '{';
        current.indent += 4;
        pp.contents.forEach((item) => {
            current.pos = current.indent;
            res +=
                '\n' +
                white(current.indent) +
                printToStringInner(item, maxWidth, options, current) +
                pp.sep;
        });
        current.indent -= 4;
        if (res.length > 1) {
            res += '\n' + white(current.indent);
            current.pos = current.indent;
        }
        current.pos += 1;
        res += '}';
        return res;
    }
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
                    current,
                );
                // current.pos += ctext.length;
                res += ctext;
            });
            current.pos += 1;
            return res + pp.right;
        }

        let res = pp.left;
        current.pos += 1;
        current.indent += 4;
        pp.contents.forEach((item, i) => {
            current.pos = current.indent;
            res +=
                '\n' +
                white(current.indent) +
                printToStringInner(item, maxWidth, options, current);
            if (pp.trailing || i < pp.contents.length - 1) {
                res += ',';
            }
        });
        current.indent -= 4;
        if (res.length > 1) {
            res += '\n' + white(current.indent);
            current.pos = current.indent;
        }
        current.pos += 1;
        res += pp.right;
        return res;
    }
    if (pp.type === 'items') {
        let res = '';
        pp.items.forEach((item) => {
            res += printToStringInner(item, maxWidth, options, current);
        });
        return res;
    }
    throw new Error(`unexpected pp type ${JSON.stringify(pp)}`);
};

export const printToString = (
    pp: PP,
    maxWidth: number,
    options: StringOptions = { hideIds: false },
): string => {
    return printToStringInner(pp, maxWidth, options, { indent: 0, pos: 0 });
};

export type AttributedText =
    | string
    | { text: string; attributes: Array<string> }
    | { id: string; text: string; kind: string };

export const printToAttributedText = (
    pp: PP,
    maxWidth: number,
    current: { indent: number; pos: number } = { indent: 0, pos: 0 },
): Array<AttributedText> => {
    if (pp.type === 'atom') {
        current.pos += pp.text.length;
        return pp.attributes
            ? [{ text: pp.text, attributes: pp.attributes }]
            : [pp.text];
    }
    if (pp.type === 'id') {
        current.pos += pp.text.length;
        // return pp.text + '#' + pp.id;
        return [pp];
    }
    if (pp.type === 'block') {
        const res: Array<AttributedText> = [
            { text: '{', attributes: ['brace'] },
        ];
        current.indent += 4;
        pp.contents.forEach((item) => {
            current.pos = current.indent;
            res.push(
                '\n' + white(current.indent),
                ...printToAttributedText(item, maxWidth, current),
                { text: pp.sep, attributes: ['semi'] },
            );
        });
        current.indent -= 4;
        if (res.length > 1) {
            res.push('\n' + white(current.indent));
            current.pos = current.indent;
        }
        current.pos += 1;
        res.push({ text: '}', attributes: ['brace'] });
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
                res.push(...printToAttributedText(child, maxWidth, current));
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
            current.pos = current.indent;
            res.push(
                '\n' + white(current.indent),
                ...printToAttributedText(item, maxWidth, current),
            );
            if (pp.trailing || i < pp.contents.length - 1) {
                res.push({ text: ',', attributes: ['comma'] });
            }
        });
        current.indent -= 4;
        if (res.length > 1) {
            res.push('\n' + white(current.indent));
            current.pos = current.indent;
        }
        current.pos += 1;
        res.push({ text: pp.right, attributes: ['brace'] });
        return res;
    }
    if (pp.type === 'items') {
        const res: Array<AttributedText> = [];
        pp.items.forEach((item) => {
            res.push(...printToAttributedText(item, maxWidth, current));
        });
        return res;
    }
    throw new Error(`unexpected pp type ${JSON.stringify(pp)}`);
};
