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
    current: { indent: number; pos: number } = { indent: 0, pos: 0 },
): string => {
    if (pp.type === 'atom') {
        current.pos += pp.text.length;
        return pp.text;
    }
    if (pp.type === 'block') {
        let res = '{';
        current.indent += 4;
        pp.contents.forEach((item) => {
            res +=
                '\n' +
                white(current.indent) +
                printToString(item, maxWidth, current) +
                ';';
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
                const ctext = printToString(child, maxWidth, current);
                // current.pos += ctext.length;
                res += ctext;
            });
            current.pos += 1;
            return res + pp.right;
        }

        let res = pp.left;
        current.pos += 1;
        current.indent += 4;
        pp.contents.forEach((item) => {
            current.pos = current.indent;
            res +=
                '\n' +
                white(current.indent) +
                printToString(item, maxWidth, current) +
                ',';
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
            res += printToString(item, maxWidth, current);
        });
        return res;
    }
    throw new Error(`unexpected pp type ${JSON.stringify(pp)}`);
};
