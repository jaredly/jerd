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
                three: <C, D>(name: C, age: D) => (C, D)
            }
        `),
        ).toMatchInlineSnapshot(`
            "type Something#bdf2c414<A#:0, B#:1> = {
                one: A#:0,
                two: B#:1,
                three: <C#:2, D#:3>(name: C#:2, age: D#:3) ={}> Tuple2#builtin<C#:2, D#:3>,
            }"
        `);
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
        expect(
            process(`
            decorator what;
            const res = (2 + @what () => 20)`),
        ).toMatchInlineSnapshot(`
            "decorator what#278a99f3;
            const res#61cd7569 = 2 +#builtin @what#278a99f3 (): int#builtin ={}> 20"
        `));

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

describe('Decorators', () => {
    // ooh fun we can do type checking! That is cool
    // like yeah why not
    // ok
    // but you can also do like "anything its fine"
    // ok yeah backing up
    // What will a macro have access to?
    // - arguments are fully typed, part of the typed tree, not the ast
    // - but it could be a Term
    // it'll be literally the type DecArg I think
    // ok but when I have macros, I'll need a full method
    // to verify a typedtree, make sure nothing got weird.
    // hmmmmmmm it might be nice to be able to specify
    // the kind of thing that the decorator should decorate
    // like RecordAttribute or Expr
    // hmm

    it('a bunch of them', () => {
        expect(
            process(`
        type Vec2 = {x: float, y: float};
        type Vec3 = {x: float, y: float, z: float};
        type Vec4 = {...Vec3, w: float};

        // decorator alternates<T>(options: Array<(Constant#builtin<string>, T)>) T;
        decorator slider(min: Constant#builtin<float>, max: Constant#builtin<float>, step: Constant#builtin<float>) Constant#builtin<float>
        decorator slider(min: Constant#builtin<int>, max: Constant#builtin<int>, step: Constant#builtin<int>) Constant#builtin<int>
        decorator slider(min: Constant#builtin<Vec2>, max: Constant#builtin<Vec2>) Constant#builtin<Vec2>
        decorator rgb Constant#builtin<Vec3>
        decorator rgba Constant#builtin<Vec4>
        decorator hsl Constant#builtin<Vec3>
        decorator hsla Constant#builtin<Vec4>

        // decorator some(string, :, ?) int;
        decorator something;
        decorator hello;
        type Person = {
            name: string, age: int}
        // const decorator = @some(
        //     "hello",
        //     : int,
        //     ? Person{name: "hi", age: age}
        // ) 200;
        const m = @something 10.0;
        const n = @hello Person{name: "hi", age: 10};

        const goForIt = (pos: Vec2) => {
            pos.x * @slider(0.0, 10.0, 0.1) 2.3
        }
        `),
        ).toMatchInlineSnapshot(`
            "type Vec2#34115300 = {
                x: float#builtin,
                y: float#builtin,
            };
            type Vec3#1277eca0 = {
                x: float#builtin,
                y: float#builtin,
                z: float#builtin,
            };
            type Vec4#ad52e0c4 = {
                ...Vec3#1277eca0,
                w: float#builtin,
            };
            decorator slider#a8d63d48(
                min: Constant#builtin<float#builtin>,
                max: Constant#builtin<float#builtin>,
                step: Constant#builtin<float#builtin>,
            ) Constant#builtin<float#builtin>;
            decorator slider#3436c37f(
                min: Constant#builtin<int#builtin>,
                max: Constant#builtin<int#builtin>,
                step: Constant#builtin<int#builtin>,
            ) Constant#builtin<int#builtin>;
            decorator slider#2ebbd9ae(
                min: Constant#builtin<Vec2#34115300>,
                max: Constant#builtin<Vec2#34115300>,
            ) Constant#builtin<Vec2#34115300>;
            decorator rgb#041dfbf0 Constant#builtin<Vec3#1277eca0>;
            decorator rgba#ce9542d8 Constant#builtin<Vec4#ad52e0c4>;
            decorator hsl#041dfbf0 Constant#builtin<Vec3#1277eca0>;
            decorator hsla#ce9542d8 Constant#builtin<Vec4#ad52e0c4>;
            decorator something#278a99f3;
            decorator hello#278a99f3;
            type Person#522b71da = {
                name: string#builtin,
                age: int#builtin,
            };
            const m#2609a0ef = @hello#278a99f3 10.0;
            const n#2c0261e8 = @hello#278a99f3 Person#522b71da{name#522b71da#0: \\"hi\\", age#522b71da#1: 10};
            const goForIt#f115ac4a = (pos#:0: Vec2#34115300): float#builtin ={}> {
                pos#:0.x#34115300#0 *#builtin @slider#a8d63d48(min: 0.0, max: 10.0, step: 0.1) 2.3;
            }"
        `);
    });
});
