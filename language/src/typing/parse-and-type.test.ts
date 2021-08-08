import { parse } from '../parsing/parser';
import { printToString } from '../printing/printer';
import { toplevelToPretty } from '../printing/printTsLike';
import { addToplevelToEnv, typeToplevelT } from './env';
import { presetEnv } from './preset';

const process = (raw: string) => {
    let env = presetEnv({});
    let toplevels;
    try {
        toplevels = parse(raw);
    } catch (err) {
        console.log(err);
        throw err;
    }
    const result: Array<string> = [];
    toplevels.forEach((rawTop) => {
        const top = typeToplevelT(env, rawTop);
        env = addToplevelToEnv(env, top).env;
        result.push(printToString(toplevelToPretty(env, top), 100));
    });
    return result.join(';\n');
};

describe('basic toplevels', () => {
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
                @ffi
                type M = {n: float}
				type Z = {...X, a: int, b: string} `),
        ).toMatchInlineSnapshot(`
            "type X#450d3cd6 = {
                y: int#builtin,
                z: float#builtin,
            };
            @ffi(\\"M\\") type M#a68a0a20 = {
                n: float#builtin,
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

    it('math expr', () =>
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
});

describe('type descriptions', () => {
    it('type variables', () => {
        expect(
            process(`
            type Something<A, B> = {
                one: A,
                two: B,
            }
        `),
        ).toMatchInlineSnapshot();
    });
});

describe('expression types', () => {
    it('unary expr', () =>
        expect(
            process(`
            const x = 10;
            const z = -x
    `),
        ).toMatchInlineSnapshot(`
            "const x#6e9352f2 = 10;
            const z#636c02a6 = -x#6e9352f2"
        `));

    it('binOp', () =>
        expect(process(`const res = 2 +#builtin 3`)).toMatchInlineSnapshot(
            `"const res#23157700 = 2 +#builtin 3"`,
        ));

    it('decorator', () =>
        // what the heck
        // what the heck
        expect(
            process(`const res = (2 + @what () => 20)`),
        ).toMatchInlineSnapshot(
            `"const res#351a0a77 = 2 +#builtin @what(): int#builtin ={}> 20"`,
        ));

    it('apply suffix', () =>
        expect(
            process(`
            const x = (m: int) => 2 + 3 * m;
            const n = x(23)
    `),
        ).toMatchInlineSnapshot(`
            "const x#7bdaefe0 = (m#:0: int#builtin): int#builtin ={}> 2 +#builtin 3 *#builtin m#:0;
            const n#56070c14 = x#7bdaefe0(m: 23)"
        `));

    it('attribute suffix', () =>
        expect(
            process(`
            type Person = {name: string, age: int};
            const m = (p: Person) => (p.name, p.age);
    `),
        ).toMatchInlineSnapshot(`
            "type Person#28ac4660 = {
                name: string#builtin,
                age: int#builtin,
            };
            const m#a0bf5b6c = (p#:0: Person#28ac4660): Tuple2#builtin<string#builtin, int#builtin> ={}> (
                p#:0.name#28ac4660#0,
                p#:0.age#28ac4660#1,
            )"
        `));

    it('index suffix attr', () =>
        expect(process(`const res = (1, 2).0 == 1`)).toMatchInlineSnapshot(
            `"const res#5a1f2ea3 = (1, 2).0 ==#builtin 1"`,
        ));

    // Ok we don't handle indexes yet
    // it('index suffix', () =>
    //     expect(process(`const res = [0, 1, 2][0] == 1`)).toMatchInlineSnapshot(
    //         `"const res#5a1f2ea3 = (1, 2).0 ==#builtin 1"`,
    //     ));

    it('asSuffix', () =>
        expect(
            process(`
        const IntAsFloat = As<int, float>{as: (v: int) => 1.0};
        const m = 1 as float`),
        ).toMatchInlineSnapshot(`
            "const IntAsFloat#16da6c1c = As#As<int#builtin, float#builtin>{
                as#As#0: (v#:0: int#builtin): float#builtin ={}> 1.0,
            };
            const m#49bbeeec = 1 as#16da6c1c float#builtin"
        `));

    it('literals', () =>
        expect(
            process(`
    const a = 1;
    const b = 2.3;
    const c = "hello";
    const d = true;
    `),
        ).toMatchInlineSnapshot(`
            "const a#675b665e = 1;
            const b#7cff9872 = 2.3;
            const c#4fbd99d4 = \\"hello\\";
            const d#2ad7b724 = true"
        `));

    it('lambdas', () =>
        expect(
            process(`
            const a = () => 23;
            const b = () => {
                const m = 2;
                m / 1
            };
            const c = (a: int, b: float) => (a, b);
            const m = (fn: (one: int, two: float) => string) => 10;
    `),
        ).toMatchInlineSnapshot(`
            "const a#9dacbedc = (): int#builtin ={}> 23;
            const b#7ca0aaf8 = (): int#builtin ={}> {
                const m#:0 = 2;
                m#:0 /#builtin 1;
            };
            const c#bdfd33b0 = (a#:0: int#builtin, b#:1: float#builtin): Tuple2#builtin<
                int#builtin,
                float#builtin,
            > ={}> (a#:0, b#:1);
            const m#4fb5f0cc = (fn#:0: (one: int#builtin, two: float#builtin) ={}> string#builtin): int#builtin ={}> 10"
        `));

    it('blocks', () =>
        expect(
            process(`
            const n = {
                const m = 23;
                2;
                {
                    const m = 2;
                    3
                };
                m == 23
            }
    `),
        ).toMatchInlineSnapshot(`
            "const n#8b0ae7d4 = {
                const m#:0 = 23;
                2;
                {
                    const m#:1 = 2;
                    3;
                };
                m#:0 ==#builtin 23;
            }"
        `));

    it('handle n stuff', () =>
        expect(
            process(`
        effect Stdio {
            read: () => string,
            write: (string) => void,
        }
        const respondWith
        = (responseValue: string) => <T,>{e}(default: T, fn: () ={Stdio, e}> T) ={e}> {
            handle! fn {
                Stdio.read(() => k) => handle! () => k(responseValue) {
                    Stdio.read(() => k) => default,
                    Stdio.write((v) => k) => default,
                    pure(a) => a
                },
                Stdio.write((v) => k) => {
                    default
                },
                pure(a) => a
            }
        };

        const inner = (name: string): string => {
            raise!(Stdio.write(
                raise!(Stdio.read()) ++ " and " ++ raise!(Stdio.read())
            ));
            raise!(Stdio.read());
        };

        const test1 = () => {
            respondWith("<read>")<string>{}("what", () => inner("Yes"))
        }
    `),
        ).toMatchInlineSnapshot(`
            "effect Stdio#1da337a2 {
                read: () => string#builtin,
                write: (string#builtin) => void#builtin,
            };
            const respondWith#1fb7cba0 = (responseValue#:0: string#builtin): <T#:0>{e#:0}(
                default: T#:0,
                fn: () ={Stdio#1da337a2, e#:0}> T#:0,
            ) ={e#:0}> T#:0 ={}> <T#:0>{e#:0}(default#:1: T#:0, fn#:2: () ={Stdio#1da337a2, e#:0}> T#:0): T#:0 ={
                e#:0,
            }> {
                handle! fn#:2 {
                    Stdio.read#0(() => k#:4) => handle! (): T#:0 ={Stdio#1da337a2}> k#:4(responseValue#:0) {
                        Stdio.read#0(() => k#:6) => default#:1,
                        Stdio.write#1((v#:7) => k#:8) => default#:1,
                        pure(a#:5) => a#:5,
                    },
                    Stdio.write#1((v#:9) => k#:10) => {
                        default#:1;
                    },
                    pure(a#:3) => a#:3,
                };
            };
            const inner#0320c524 = (name#:0: string#builtin): string#builtin ={Stdio#1da337a2}> {
                raise!(
                    Stdio#1da337a2.write(
                        raise!(Stdio#1da337a2.read()) ++#builtin \\" and \\" 
                            ++#builtin raise!(Stdio#1da337a2.read()),
                    ),
                );
                raise!(Stdio#1da337a2.read());
            };
            const test1#6d63aeba = (): string#builtin ={}> {
                respondWith#1fb7cba0(responseValue: \\"<read>\\")<string#builtin>{}(
                    \\"what\\",
                    (): string#builtin ={Stdio#1da337a2}> inner#0320c524(name: \\"Yes\\"),
                );
            }"
        `));

    it('trace', () =>
        expect(
            process(`const m = trace!(34, 43, "what")`),
        ).toMatchInlineSnapshot(
            `"const m#240f45d4 = trace!(34, 43, \\"what\\")"`,
        ));

    it('if', () =>
        expect(
            process(`
            const m = if 2 > 1 { 34 } else { 12 };
            const n = {
                if 2 > 1 { };
                43
            }
    `),
        ).toMatchInlineSnapshot(`
            "const m#dedddefc = if 2 >#builtin 1 {
                34;
            } else {
                12;
            };
            const n#3dde6200 = {
                if 2 >#builtin 1 {};
                43;
            }"
        `));

    it('switch', () =>
        expect(
            process(`
            const a = switch 23 {
                1 => false,
                2 => false,
                23 => true,
                _ => false
            };
            type Person = {name: string, age: int};
            type Company = {name: string, people: Array<Person>, ages: (int, float)};
            enum Companies { Company }
            const b = (m: Companies) => switch m {
                Company{name: "hello", ages: (_, 23.0)} => false,
                Company{name: "things", people: []} => true,
                Company{people: [Person{name: "yes"}, ..._]} => true,
                Company{people: [..._, Person{name: _, age: 23}]} => false,
                Company{people: [Person{name: "start"}, ..._, Person{name: "end"}]} => true,
                _ => true
            }
    `),
        ).toMatchInlineSnapshot(`
            "const a#046caf0f = switch 23 {1 => false, 2 => false, 23 => true, _#:0 => false};
            type Person#28ac4660 = {
                name: string#builtin,
                age: int#builtin,
            };
            type Company#33117eac = {
                name: string#builtin,
                people: Array#builtin<Person#28ac4660>,
                ages: Tuple2#builtin<int#builtin, float#builtin>,
            };
            enum Companies#5e7cafb2 {
                Company#33117eac,
            };
            const b#36e0d6ad = (m#:0: Companies#5e7cafb2): bool#builtin ={}> switch m#:0 {
                Company#33117eac{name: \\"hello\\", ages: (_#:1, 23.0)} => false,
                Company#33117eac{name: \\"things\\", people: []} => true,
                Company#33117eac{people: [Person#28ac4660{name: \\"yes\\"}, ..._#:2]} => true,
                Company#33117eac{people: [..._#:3, Person#28ac4660{name: _#:4, age: 23}]} => false,
                Company#33117eac{
                    people: [Person#28ac4660{name: \\"start\\"}, ..._#:5, Person#28ac4660{name: \\"end\\"}],
                } => true,
                _#:6 => true,
            }"
        `));
});
