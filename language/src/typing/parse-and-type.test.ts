import { parse } from '../parsing/parser';
import { printToString } from '../printing/printer';
import { toplevelToPretty } from '../printing/printTsLike';
import { addToplevelToEnv, typeToplevelT } from './env';
import { presetEnv } from './preset';

const process = (raw: string) => {
    let env = presetEnv({});
    const toplevels = parse(raw);
    const result: Array<string> = [];
    toplevels.forEach((rawTop) => {
        const top = typeToplevelT(env, rawTop);
        env = addToplevelToEnv(env, top).env;
        result.push(printToString(toplevelToPretty(env, top), 100));
    });
    return result.join(';\n\n');
};

describe('It should all work', () => {
    it('basic define', () => {
        expect(process(`const x = 10`)).toMatchInlineSnapshot(
            `"const x#6e9352f2 = 10"`,
        );
    });
    it('basic record', () =>
        expect(process(`type X = { y: int, z: float }`)).toMatchInlineSnapshot(`
            "type X#450d3cd6 = {
                y: int#builtin,
                z: float#builtin,
            }"
        `));

    it('record inherit', () =>
        expect(
            process(`
				type X = {y: int, z: float}
				type Z = {...X, a: int, b: string} `),
        ).toMatchInlineSnapshot(`
            "type X#450d3cd6 = {
                y: int#builtin,
                z: float#builtin,
            };

            type Z#39b05154 = {
                ...X#450d3cd6,
                a: int#builtin,
                b: string#builtin,
            }"
        `));

    it('enum', () =>
        expect(
            process(`
				type X = {}
				type Y = {name: string}
				type Z = {...Y, age: int}
				enum All { X, Y, Z }`),
        ).toMatchInlineSnapshot(`
            "type X#f713161c = {};

            type Y#1de5e9d2 = {
                name: string#builtin,
            };

            type Z#ec09fc50 = {
                ...Y#1de5e9d2,
                age: int#builtin,
            };

            enum All#635a2c46 {
                X#f713161c,
                Y#1de5e9d2,
                Z#ec09fc50,
            }"
        `));

    it('math', () =>
        expect(process(`10 + 21 * -(32 / 11) - 34`)).toMatchInlineSnapshot(
            `"10 +#builtin 21 *#builtin -(32 /#builtin 11) -#builtin 34"`,
        ));

    it('effect', () =>
        expect(
            process(`
                effect SetGet {
                    Get: () => string,
                    Set: (string) => void, // TODO: Remove the need for this final comma
                }`),
        ).toMatchInlineSnapshot(`
            "effect SetGet#1da337a2 {
                Get: () => string#builtin,
                Set: (string#builtin) => void#builtin,
            }"
        `));

    it('unary', () =>
        expect(
            process(`
            const x = 10;
            -x
    `),
        ).toMatchInlineSnapshot(`
            "const x#6e9352f2 = 10;

            -x#6e9352f2"
        `));
});
