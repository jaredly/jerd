// A basic width-aware pretty printer

export const items = (items: Array<PP | null>): PP => ({
    type: 'items',
    items: items.filter((x) => x != null) as Array<PP>,
});
export const args = (contents: Array<PP>, left = '(', right = ')'): PP => ({
    type: 'args',
    contents,
    left,
    right,
});
export const block = (contents: Array<PP>): PP => ({ type: 'block', contents });
export const atom = (text: string): PP => ({ type: 'atom', text });

export type PP =
    | { type: 'atom'; text: string }
    | { type: 'block'; contents: Array<PP> } // surrounded by {}
    | { type: 'args'; contents: Array<PP>; left: string; right: string } // surrounded by ()
    | { type: 'items'; items: Array<PP> };

const white = (x: number) => new Array(x).fill(' ').join('');

const width = (x: PP): number => {
    switch (x.type) {
        case 'atom':
            return x.text.length;
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

export const printToString = (
    pp: PP,
    maxWidth: number,
    current: { indent: number; pos: number },
): string => {
    if (pp.type === 'atom') {
        return pp.text;
    }
    if (pp.type === 'block') {
        let res = '{';
        const indent = current.indent + 4;
        pp.contents.forEach((item) => {
            res +=
                '\n' +
                white(indent) +
                printToString(item, maxWidth, { indent, pos: indent }) +
                ';';
        });
        if (res.length > 1) {
            res += '\n' + white(current.indent);
        }
        res += '}';
        return res;
    }
    if (pp.type === 'args') {
        const full = width(pp);
        // const full = pp.contents.reduce((w, x) => w + width(x), 0)
        if (current.pos + full <= maxWidth) {
            let res = pp.left;
            let at = current.pos + 1;
            pp.contents.forEach((child, i) => {
                if (i !== 0) {
                    res += ', ';
                    at += 2;
                }
                const ctext = printToString(child, maxWidth, {
                    indent: current.indent,
                    pos: at,
                });
                at += ctext.length;
                res += ctext;
            });
            return res + pp.right;
        }

        let res = pp.left;
        const indent = current.indent + 4;
        pp.contents.forEach((item) => {
            res +=
                '\n' +
                white(indent) +
                printToString(item, maxWidth, { indent, pos: indent }) +
                ',';
        });
        if (res.length > 1) {
            res += '\n' + white(current.indent);
        }
        res += pp.right;
        return res;
    }
    if (pp.type === 'items') {
        let res = '';
        let at = current.pos;
        pp.items.forEach((item) => {
            const text = printToString(item, maxWidth, {
                indent: current.indent,
                pos: at,
            });
            at += text.length;
            res += text;
        });
        return res;
    }
    throw new Error(`unexpected pp type ${JSON.stringify(pp)}`);
};
