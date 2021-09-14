import { parse } from '../parsing/parser';
import { printToString } from '../printing/printer';
import { toplevelToPretty } from '../printing/printTsLike';
import { addToplevelToEnv, typeToplevelT } from './env';
import { presetEnv } from './preset';
import { transformToplevel } from './transform';
import { showLocation } from './typeExpr';
import { TypeError } from './types';

export const rawSnapshotSerializer: jest.SnapshotSerializerPlugin = {
    test(value) {
        return value && typeof value === 'string';
    },
    print(value, _, __) {
        return value as string;
    },
};

expect.addSnapshotSerializer(rawSnapshotSerializer);

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
    const errors: Array<TypeError> = [];
    toplevels.forEach((rawTop) => {
        const top = typeToplevelT(env, rawTop);
        transformToplevel(
            top,
            {
                term: (term, _) => {
                    if (term.type === 'TypeError') {
                        errors.push(term);
                    }
                    return null;
                },
            },
            null,
        );
        env = addToplevelToEnv(env, top).env;
        result.push(printToString(toplevelToPretty(env, top), 100));
    });
    return (
        result.join(';\n') +
        (errors.length
            ? `\n// TYPE ERRORS\n - ` +
              errors.map((err) => showLocation(err.location)).join('\n - ')
            : '')
    );
};

describe('template strings', () => {
    it('should parse a normal string', () => {
        expect(
            process(`const x = "hello";
            const y = ""`),
        ).toMatchInlineSnapshot(`
            const x#4fbd99d4 = "hello";
            const y#99874370 = ""
        `);
    });

    it('should handle escapes and newlines correctly', () => {
        expect(process(`const x = "Yes\\nFo\tlk\ns"`)).toMatchInlineSnapshot(
            `const x#7b1224d0 = "Yes\\\\nFo\\tlk\\ns"`,
        );
    });

    it('should parse a template string', () => {
        expect(
            process(`
        const intAsString = As<int, string>{as: (i: int) => "an int"};
        const x = "hello \${10}"
        `),
        ).toMatchInlineSnapshot(`
            const intAsString#a9eb4f54 = As#As<int#builtin, string#builtin>{
                as#As#0: (i#:0: int#builtin): string#builtin ={}> "an int",
            };
            const x#348f5e90 = "hello $#a9eb4f54{10}"
        `);
    });
});

describe('basic toplevels', () => {
    it('basic define', () => {
        expect(process(`const x = 10`)).toMatchInlineSnapshot(
            `const x#6e9352f2 = 10`,
        );
    });
    it('basic record', () =>
        expect(process(`type X = { y: int, z: float }`)).toMatchInlineSnapshot(`
            @unique(0.5661807692527293) type X#0cf8aa06 = {
                y: int#builtin,
                z: float#builtin,
            }
        `));

    it('record inherit', () =>
        expect(
            process(`
				type X = {y: int, z: float}
                @ffi
                type M = {n: float}
				type Z = {...X, a: int, b: string} `),
        ).toMatchInlineSnapshot(`
            @unique(0.5661807692527293) type X#0cf8aa06 = {
                y: int#builtin,
                z: float#builtin,
            };
            @ffi("M") type M#bf02d0e8 = {
                n: float#builtin,
            };
            @unique(0.8408403012585762) type Z#0f2e3ee8 = {
                ...X#0cf8aa06,
                a: int#builtin,
                b: string#builtin,
            }
        `));

    it('enum', () =>
        expect(
            process(`
				type X = {}
				type Y = {name: string}
				type Z = {...Y, age: int}
				enum All { X, Y, Z }`),
        ).toMatchInlineSnapshot(`
            @unique(0.5661807692527293) type X#740adea4 = {};
            @unique(0.8408403012585762) type Y#74d8e7f1 = {
                name: string#builtin,
            };
            @unique(0.14972816008023876) type Z#00ec7168 = {
                ...Y#74d8e7f1,
                age: int#builtin,
            };
            enum All#5e2b21e8 {
                X#740adea4,
                Y#74d8e7f1,
                Z#00ec7168,
            }
        `));

    it('math expr', () =>
        expect(process(`10 + 21 * -(32 / 11) - 34`)).toMatchInlineSnapshot(
            `10 +#builtin 21 *#builtin -(32 /#builtin 11) -#builtin 34`,
        ));

    it('effect', () =>
        expect(
            process(`
                effect SetGet {
                    Get: () => string,
                    Set: (string) => void, // TODO: Remove the need for this final comma
                }`),
        ).toMatchInlineSnapshot(`
            effect SetGet#1da337a2 {
                Get: () => string#builtin,
                Set: (string#builtin) => void#builtin,
            }
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
            @unique(0.5661807692527293) type Something#c8389130<A#:0, B#:1> = {
                one: A#:0,
                two: B#:1,
                three: <C#:2, D#:3>(name: C#:2, age: D#:3) ={}> Tuple2#builtin<C#:2, D#:3>,
            }
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
            const x#6e9352f2 = 10;
            const z#636c02a6 = -x#6e9352f2
        `));

    it('binOp', () =>
        expect(process(`const res = 2 +#builtin 3`)).toMatchInlineSnapshot(
            `const res#23157700 = 2 +#builtin 3`,
        ));

    it('decorator', () =>
        expect(
            process(`
            decorator what;
            const res = (2 + @what () => 20)`),
        ).toMatchInlineSnapshot(`
            @unique(0.5661807692527293) decorator what#6f08788e;
            const res#6c004d82 = 2 +#builtin @what#6f08788e (): int#builtin ={}> 20
            // TYPE ERRORS
             - 3:36-3:44
        `));

    it('apply suffix', () =>
        expect(
            process(`
            const x = (m: int) => 2 + 3 * m;
            const n = x(23)
    `),
        ).toMatchInlineSnapshot(`
            const x#7bdaefe0 = (m#:0: int#builtin): int#builtin ={}> 2 +#builtin 3 *#builtin m#:0;
            const n#56070c14 = x#7bdaefe0(m: 23)
        `));

    it('attribute suffix', () =>
        expect(
            process(`
            type Person = {name: string, age: int};
            const m = (p: Person) => (p.name, p.age);
    `),
        ).toMatchInlineSnapshot(`
            @unique(0.5661807692527293) type Person#69e137a8 = {
                name: string#builtin,
                age: int#builtin,
            };
            const m#6ef797af = (p#:0: Person#69e137a8): Tuple2#builtin<string#builtin, int#builtin> ={}> (
                p#:0.name#69e137a8#0,
                p#:0.age#69e137a8#1,
            )
        `));

    it('index suffix attr', () =>
        expect(process(`const res = (1, 2).0 == 1`)).toMatchInlineSnapshot(
            `const res#5a1f2ea3 = (1, 2).0 ==#builtin 1`,
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
            const IntAsFloat#16da6c1c = As#As<int#builtin, float#builtin>{
                as#As#0: (v#:0: int#builtin): float#builtin ={}> 1.0,
            };
            const m#7364b376 = 1 as#16da6c1c float#builtin
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
            const a#675b665e = 1;
            const b#7cff9872 = 2.3;
            const c#4fbd99d4 = "hello";
            const d#2ad7b724 = true
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
            const a#9dacbedc = (): int#builtin ={}> 23;
            const b#7ca0aaf8 = (): int#builtin ={}> {
                const m#:0 = 2;
                m#:0 /#builtin 1;
            };
            const c#bdfd33b0 = (a#:0: int#builtin, b#:1: float#builtin): Tuple2#builtin<
                int#builtin,
                float#builtin,
            > ={}> (a#:0, b#:1);
            const m#4fb5f0cc = (fn#:0: (one: int#builtin, two: float#builtin) ={}> string#builtin): int#builtin ={}> 10
        `));

    it(`blocks with just a const should ... have a void type?`, () =>
        expect(process(`const n = (): void => {const x = 10 }`))
            .toMatchInlineSnapshot(`
            const n#36351150 = (): void#builtin ={}> {
                const x#:0 = 10;
            }
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
            const n#8b0ae7d4 = {
                const m#:0 = 23;
                2;
                {
                    const m#:1 = 2;
                    3;
                };
                m#:0 ==#builtin 23;
            }
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
            effect Stdio#1da337a2 {
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
                        raise!(Stdio#1da337a2.read()) ++#builtin " and " 
                            ++#builtin raise!(Stdio#1da337a2.read()),
                    ),
                );
                raise!(Stdio#1da337a2.read());
            };
            const test1#6d63aeba = (): string#builtin ={}> {
                respondWith#1fb7cba0(responseValue: "<read>")<string#builtin>{}(
                    "what",
                    (): string#builtin ={Stdio#1da337a2}> inner#0320c524(name: "Yes"),
                );
            }
        `));

    it('trace', () =>
        expect(
            process(`const m = trace!(34, 43, "what")`),
        ).toMatchInlineSnapshot(`const m#240f45d4 = trace!(34, 43, "what")`));

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
            const m#dedddefc = if 2 >#builtin 1 {
                34;
            } else {
                12;
            };
            const n#3dde6200 = {
                if 2 >#builtin 1 {};
                43;
            }
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
            const a#007742f3 = switch 23 {1 => false, 2 => false, 23 => true, _ => false};
            @unique(0.5661807692527293) type Person#69e137a8 = {
                name: string#builtin,
                age: int#builtin,
            };
            @unique(0.8408403012585762) type Company#503a4e65 = {
                name: string#builtin,
                people: Array#builtin<Person#69e137a8>,
                ages: Tuple2#builtin<int#builtin, float#builtin>,
            };
            enum Companies#7c2cbdce {
                Company#503a4e65,
            };
            const b#3778db64 = (m#:0: Companies#779076b4): bool#builtin ={}> switch m#:0 {
                Company#503a4e65{name: "hello", ages: (_, 23.0)} => false,
                Company#503a4e65{name: "things", people: []} => true,
                Company#503a4e65{people: [Person#69e137a8{name: "yes"}, ..._]} => true,
                Company#503a4e65{people: [..._, Person#69e137a8{name: _, age: 23}]} => false,
                Company#503a4e65{people: [Person#69e137a8{name: "start"}, ..._, Person#69e137a8{name: "end"}]} => true,
                _ => true,
            }
        `));
});

describe('Decorators', () => {
    // describe('Slider depend on other slider', () => {
    //     // ok but so I also want to test the logic that gets me to a slider, right?
    //     // like, verifying that the arguments of the slider are parsed correctly.
    //     // Which means I need to bring some logic from web over into language.
    //     // expect(process(`
    //     // `))
    // })

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

        decorator alternates<T>(options: Constant#builtin<Array<(string, T)>>) T;
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
        const oneThing = @alternates<int>(options: [("hello", 2), ("sadness", -2)]) 23;
        const oneThing = @alternates<float>([("hello", 2.0), ("sadness", -2.0)]) 23.0;
        `),
        ).toMatchInlineSnapshot(`
            @unique(0.5661807692527293) type Vec2#4284214c = {
                x: float#builtin,
                y: float#builtin,
            };
            @unique(0.8408403012585762) type Vec3#53b2e6a0 = {
                x: float#builtin,
                y: float#builtin,
                z: float#builtin,
            };
            @unique(0.14972816008023876) type Vec4#ad03f718 = {
                ...Vec3#53b2e6a0,
                w: float#builtin,
            };
            @unique(0.5383562320075749) decorator alternates#2d1ef174<T#:0>(
                options: Constant#builtin<Array#builtin<Tuple2#builtin<string#builtin, T#:0>>>,
            ) T#:0;
            @unique(0.969424254802974) decorator slider#1d9fcfd2(
                min: Constant#builtin<float#builtin>,
                max: Constant#builtin<float#builtin>,
                step: Constant#builtin<float#builtin>,
            ) Constant#builtin<float#builtin>;
            @unique(0.17852990309013597) decorator slider#4e421b50(
                min: Constant#builtin<int#builtin>,
                max: Constant#builtin<int#builtin>,
                step: Constant#builtin<int#builtin>,
            ) Constant#builtin<int#builtin>;
            @unique(0.5425139598776044) decorator slider#6478682c(
                min: Constant#builtin<Vec2#4284214c>,
                max: Constant#builtin<Vec2#4284214c>,
            ) Constant#builtin<Vec2#4284214c>;
            @unique(0.02344979974183657) decorator rgb#0ef62c04 Constant#builtin<Vec3#53b2e6a0>;
            @unique(0.7119657471718334) decorator rgba#560a8e78 Constant#builtin<Vec4#ad03f718>;
            @unique(0.8926787556192042) decorator hsl#374c649c Constant#builtin<Vec3#53b2e6a0>;
            @unique(0.3140197780427882) decorator hsla#86c652ec Constant#builtin<Vec4#ad03f718>;
            @unique(0.04992760107696806) decorator something#bee55956;
            @unique(0.6800506892126144) decorator hello#677e1867;
            @unique(0.053905825369221054) type Person#73c36f7c = {
                name: string#builtin,
                age: int#builtin,
            };
            const m#2629f072 = @something#bee55956 10.0;
            const n#19984ade = @hello#677e1867 Person#73c36f7c{name#73c36f7c#0: "hi", age#73c36f7c#1: 10};
            const goForIt#98cdba02 = (pos#:0: Vec2#4284214c): float#builtin ={}> {
                pos#:0.x#4284214c#0 *#builtin @slider#1d9fcfd2(min: 0.0, max: 10.0, step: 0.1) 2.3;
            };
            const oneThing#b1904fe4 = @alternates#2d1ef174(
                options: <Tuple2#builtin<string#builtin, int#builtin>>[("hello", 2), ("sadness", -2)],
            ) 23;
            const oneThing#243d9adb = @alternates#2d1ef174(
                options: <Tuple2#builtin<string#builtin, float#builtin>>[("hello", 2.0), ("sadness", -2.0)],
            ) 23.0
        `);
    });
});
