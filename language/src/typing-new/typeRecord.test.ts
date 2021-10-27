import { idName } from '../typing/env';
import * as preset from '../typing/preset';
import { nullLocation } from '../typing/types';
import { addRecord } from './Library';
import {
    customMatchers,
    errorSerilaizer,
    newContext,
    parseExpression,
    parseToplevels,
    rawSnapshotSerializer,
    showTermErrors,
    termToString,
    warningsSerializer,
} from './test-utils';

expect.extend(customMatchers);
expect.addSnapshotSerializer(rawSnapshotSerializer);
expect.addSnapshotSerializer(errorSerilaizer);
expect.addSnapshotSerializer(warningsSerializer);

describe('typeRecord', () => {
    it(`let's try something simple`, () => {
        const ctx = newContext();

        let id;
        [ctx.library, id] = addRecord(
            ctx.library,
            preset.recordDefn([preset.int]),
            'Hello',
            ['hello'],
        );

        let res = parseExpression(ctx, `Hello{hello: 10}`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(
            `Hello#${idName(id)}{hello#${idName(id)}#0: 10}`,
        );
        expect(res.is).toEqualType(preset.refType(id), ctx);
        expect(res).toNotHaveErrors(ctx);
        res = parseExpression(ctx, `Hello#123123{"hello": 10}`);
        expect(ctx.warnings).toMatchInlineSnapshot(
            `1:1-1:26: Unknown type id #123123`,
        );

        ctx.warnings = [];
        res = parseExpression(ctx, `Hello{_: 10}`);
        expect(res).toNotHaveErrors(ctx);
        expect(ctx.warnings).toHaveLength(0);
    });

    it(`record without items!`, () => {
        const ctx = newContext();

        let id;
        [ctx.library, id] = addRecord(
            ctx.library,
            preset.recordDefn([]),
            'Hello',
            [],
        );

        const res = parseExpression(ctx, `Hello`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(`Hello#${idName(id)}`);
        expect(res.is).toEqualType(preset.refType(id), ctx);
        expect(res).toNotHaveErrors(ctx);
    });

    it(`record all defaults!`, () => {
        const ctx = newContext();

        let id;
        [ctx.library, id] = addRecord(
            ctx.library,
            {
                ...preset.recordDefn([preset.int]),
                defaults: {
                    '0': {
                        id: null,
                        idx: 0,
                        value: preset.intLiteral(10, nullLocation),
                    },
                },
            },
            'Hello',
            ['ten'],
        );

        const res = parseExpression(ctx, `Hello`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(`Hello#${idName(id)}`);
        expect(res.is).toEqualType(preset.refType(id), ctx);
        expect(res).toNotHaveErrors(ctx);
    });

    it(`record some defaults!`, () => {
        const ctx = newContext();

        let id;
        [ctx.library, id] = addRecord(
            ctx.library,
            {
                ...preset.recordDefn([preset.int, preset.float]),
                defaults: {
                    '0': {
                        id: null,
                        idx: 0,
                        value: preset.intLiteral(10, nullLocation),
                    },
                },
            },
            'Hello',
            ['ten', 'what'],
        );

        const res = parseExpression(ctx, `Hello`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(
            `Hello#${idName(id)}{what#${idName(id)}#1: _}`,
        );
        expect(res.is).toEqualType(preset.refType(id), ctx);
        expect(showTermErrors(ctx, res)).toMatchInlineSnapshot(
            `[Hole] at 1:1-1:6`,
        );
    });

    it(`more recent record gets precedence`, () => {
        const ctx = newContext();

        let id2;
        [ctx.library, id2] = addRecord(
            ctx.library,
            preset.recordDefn([preset.float]),
            'Hello',
            ['hello'],
        );

        let id;
        [ctx.library, id] = addRecord(
            ctx.library,
            preset.recordDefn([preset.int]),
            'Hello',
            ['hello'],
        );

        const res = parseExpression(ctx, `Hello{hello: 10}`);
        expect(ctx.warnings).toHaveLength(0);
        expect(res.is).toEqualType(preset.refType(id), ctx);
        expect(res).toNotHaveErrors(ctx);
        expect(termToString(ctx, res)).toEqual(
            `Hello#${idName(id)}{hello#${idName(id)}#0: 10}`,
        );
    });

    it(`record that doesn't have type errors gets precedence`, () => {
        const ctx = newContext();

        let id;
        [ctx.library, [id]] = parseToplevels(ctx, `type Hello {hello: int}`);

        let id2;
        [ctx.library, [id2]] = parseToplevels(
            ctx,
            `type Hello {hello: string}`,
        );

        const res = parseExpression(ctx, `Hello{hello: 10}`);
        expect(ctx.warnings).toHaveLength(0);
        expect(res.is).toEqualType(preset.refType(id), ctx);
        expect(res).toNotHaveErrors(ctx);
        expect(termToString(ctx, res)).toEqual(
            `Hello#${idName(id)}{hello#${idName(id)}#0: 10}`,
        );
    });

    it(`toplevel missing get holes too`, () => {
        const ctx = newContext();

        let id;
        [ctx.library, id] = addRecord(
            ctx.library,
            preset.recordDefn([preset.int, preset.float, preset.string]),
            'Hello',
            ['hello', 'other', 'whats'],
        );

        const res = parseExpression(ctx, `Hello{hello: 10.0}`);
        expect(ctx.warnings).toHaveLength(0);
        expect(res.is).toEqualType(preset.refType(id), ctx);
        expect(termToString(ctx, res)).toEqual(
            `Hello#${idName(id)}{hello#${idName(id)}#0: 10.0, other#${idName(
                id,
            )}#1: _, whats#${idName(id)}#2: _}`,
        );
    });

    it(`record with fewest errors gets precedence`, () => {
        const ctx = newContext();

        let id;
        [ctx.library, id] = addRecord(
            ctx.library,
            preset.recordDefn([preset.int, preset.float, preset.string]),
            'Hello',
            ['hello', 'other', 'whats'],
        );

        let id2;
        [ctx.library, id2] = addRecord(
            ctx.library,
            preset.recordDefn([preset.int]),
            'Hello',
            ['hello'],
        );

        const res = parseExpression(ctx, `Hello{hello: 10.0}`);
        expect(ctx.warnings).toHaveLength(0);
        expect(res.is).toEqualType(preset.refType(id2), ctx);
        expect(showTermErrors(ctx, res)).toMatchInlineSnapshot(
            `Expected int#builtin, found float#builtin : 10.0 at 1:14-1:18`,
        );
    });

    it(`ok got to do some variablesness`, () => {
        const ctx = newContext();
        const res = parseExpression(ctx, `<T>(v: T) => { T{...v} }`);
        expect(res).toNotHaveErrors(ctx);
    });

    it(`now a variable with a couple of subtypes`, () => {
        const ctx = newContext();
        let age;
        [ctx.library, age] = addRecord(
            ctx.library,
            preset.recordDefn([preset.int]),
            'HasAge',
            ['age'],
        );
        let height;
        [ctx.library, height] = addRecord(
            ctx.library,
            preset.recordDefn([preset.float]),
            'HasHeight',
            ['height'],
        );

        const res = parseExpression(
            ctx,
            `<T: HasAge + HasHeight>(v: T) => {
                T{...v, age: 2, height: 20.0}
            }`,
        );
        expect(res).toNotHaveErrors(ctx);
        expect(termToString(ctx, res)).toEqual(`\
<T#:2: HasAge#${idName(age)} + HasHeight#${idName(
            height,
        )}>(v#:3: T#:2): T#:2 ={}> {
    T#:2{...v#:3, age#${idName(age)}#0: 2, height#${idName(height)}#0: 20.0};
}\
`);
    });

    it(`record with the right name wins`, () => {
        const ctx = newContext();

        let id;
        [ctx.library, id] = addRecord(
            ctx.library,
            preset.recordDefn([preset.int]),
            'Hello',
            ['hello'],
        );

        let id2;
        [ctx.library, id2] = addRecord(
            ctx.library,
            preset.recordDefn([preset.float]),
            'Hello',
            ['what'],
        );

        const res = parseExpression(ctx, `Hello{hello: 10}`);
        expect(ctx.warnings).toHaveLength(0);
        expect(res.is).toEqualType(preset.refType(id), ctx);
        expect(res).toNotHaveErrors(ctx);
        expect(termToString(ctx, res)).toEqual(
            `Hello#${idName(id)}{hello#${idName(id)}#0: 10}`,
        );
    });

    it(`if inner attr disagrees with outer, use the name`, () => {
        const ctx = newContext();

        let id;
        [ctx.library, id] = addRecord(
            ctx.library,
            preset.recordDefn([preset.int]),
            'Hello',
            ['hello'],
        );

        let id2;
        [ctx.library, id2] = addRecord(
            ctx.library,
            preset.recordDefn([preset.float]),
            'Hello',
            ['what'],
        );

        const res = parseExpression(
            ctx,
            `Hello#${idName(id)}{hello#${idName(id2)}: 10}`,
        );
        expect(ctx.warnings).toHaveLength(0);
        expect(res.is).toEqualType(preset.refType(id), ctx);
        expect(res).toNotHaveErrors(ctx);
        expect(termToString(ctx, res)).toEqual(
            `Hello#${idName(id)}{hello#${idName(id)}#0: 10}`,
        );
    });

    it('name shadow between outer and inner', () => {
        const ctx = newContext();
        ctx.builtins.types.int = 0;
        ctx.builtins.types.float = 0;

        let vec2;
        [ctx.library, vec2] = addRecord(
            ctx.library,
            preset.recordDefn([preset.float, preset.float]),
            'Vec2',
            ['x', 'y'],
        );
        let vec3;
        [ctx.library, vec3] = addRecord(
            ctx.library,
            preset.recordDefn([preset.float], [preset.refType(vec2)]),
            'Vec3',
            ['x'],
        );

        let res = parseExpression(
            ctx,
            `Vec3{x#${idName(vec2)}#0: 1.0, y: 2.0, x#${idName(vec3)}#0: 3.0}`,
        );
        expect(ctx.warnings).toHaveLength(0);
        expect(res.is).toEqualType(preset.refType(vec3), ctx);
        expect(termToString(ctx, res)).toEqual(
            `Vec3#${idName(vec3)}{x#${idName(vec2)}#0: 1.0, y#${idName(
                vec2,
            )}#1: 2.0, x#${idName(vec3)}#0: 3.0}`,
        );
        expect(res).toNotHaveErrors(ctx);

        //         res = parseExpression(
        //             ctx,
        //             `Vec3{...Vec2{x: 1.0, y: 4.0}, y: 2.0, z: 3.0}`,
        //         );
        //         expect(ctx.warnings).toHaveLength(0);
        //         expect(res.is).toEqualType(preset.refType(vec3), ctx);
        //         expect(res).toNotHaveErrors(ctx);
        //         expect(termToString(ctx, res)).toEqual(
        //             `Vec3#${idName(vec3)}{
        //     ...Vec2#${idName(vec2)}{x#${idName(vec2)}#0: 1.0, y#${idName(vec2)}#1: 4.0},
        //     y#${idName(vec2)}#1: 2.0,
        //     z#${idName(vec3)}#0: 3.0,
        // }`,
        //         );
    });

    it('lets do a complicated record', () => {
        const ctx = newContext();
        ctx.builtins.types.int = 0;
        ctx.builtins.types.float = 0;

        let vec2;
        [ctx.library, vec2] = addRecord(
            ctx.library,
            preset.recordDefn([preset.float, preset.float]),
            'Vec2',
            ['x', 'y'],
        );
        let vec3;
        [ctx.library, vec3] = addRecord(
            ctx.library,
            preset.recordDefn([preset.float], [preset.refType(vec2)]),
            'Vec3',
            ['z'],
        );

        let res = parseExpression(ctx, `Vec3{x: 1.0, y: 2.0, z: 3.0}`);
        expect(ctx.warnings).toHaveLength(0);
        expect(res.is).toEqualType(preset.refType(vec3), ctx);
        expect(res).toNotHaveErrors(ctx);
        expect(termToString(ctx, res)).toEqual(
            `Vec3#${idName(vec3)}{x#${idName(vec2)}#0: 1.0, y#${idName(
                vec2,
            )}#1: 2.0, z#${idName(vec3)}#0: 3.0}`,
        );

        res = parseExpression(
            ctx,
            `Vec3{...Vec2{x: 1.0, y: 4.0}, y: 2.0, z: 3.0}`,
        );
        expect(ctx.warnings).toHaveLength(0);
        expect(res.is).toEqualType(preset.refType(vec3), ctx);
        expect(res).toNotHaveErrors(ctx);
        expect(termToString(ctx, res)).toEqual(
            `Vec3#${idName(vec3)}{
    ...Vec2#${idName(vec2)}{x#${idName(vec2)}#0: 1.0, y#${idName(vec2)}#1: 4.0},
    y#${idName(vec2)}#1: 2.0,
    z#${idName(vec3)}#0: 3.0,
}`,
        );

        // Missing attribute
        res = parseExpression(ctx, `Vec3{y: 2.0, z: 3.0}`);
        expect(ctx.warnings).toHaveLength(0);
        expect(res.is).toEqualType(preset.refType(vec3), ctx);
        expect(showTermErrors(ctx, res)).toMatchInlineSnapshot(
            `[Hole] at 1:1-1:21`,
        );
        expect(termToString(ctx, res)).toEqual(
            `Vec3#${idName(vec3)}{x#${idName(vec2)}#0: _, y#${idName(
                vec2,
            )}#1: 2.0, z#${idName(vec3)}#0: 3.0}`,
        );

        res = parseExpression(ctx, `Vec3{y: 2.0, z: 3.0, m: 0.2}`);
        expect(termToString(ctx, res))
            .toEqual(`INVALID_RECORD_ATTRIBUTES[Vec3#${idName(vec3)}{x#${idName(
            vec2,
        )}#0: _, y#${idName(vec2)}#1: 2.0, z#${idName(vec3)}#0: 3.0}()(
    m: 0.2,
)]`);
    });

    it('with some nested defaults', () => {
        const ctx = newContext();

        let person;
        [ctx.library, person] = addRecord(
            ctx.library,
            {
                ...preset.recordDefn([preset.int, preset.float, preset.int]),
                defaults: {
                    '0': {
                        id: null,
                        idx: 0,
                        value: preset.intLiteral(10, nullLocation),
                    },
                },
            },
            'Person',
            ['kids', 'age', 'dogs'],
        );
        let child;
        [ctx.library, child] = addRecord(
            ctx.library,
            {
                ...preset.recordDefn(
                    [preset.float, preset.int],
                    [preset.refType(person)],
                ),
                defaults: {
                    [`${idName(person)}#1`]: {
                        id: person,
                        idx: 1,
                        value: preset.floatLiteral(2.3, nullLocation),
                    },
                    '1': {
                        id: null,
                        idx: 1,
                        value: preset.floatLiteral(1, nullLocation),
                    },
                },
            },
            'Child',
            ['shoeSize', 'grade'],
        );

        let res = parseExpression(ctx, `Person{age: 1.0, dogs: 2}`);
        expect(ctx.warnings).toHaveLength(0);
        expect(res.is).toEqualType(preset.refType(person), ctx);
        expect(res).toNotHaveErrors(ctx);

        res = parseExpression(ctx, `Child{dogs: 2, shoeSize: 1.0}`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(
            `Child#02479514{dogs#${idName(person)}#2: 2, shoeSize#${idName(
                child,
            )}#0: 1.0}`,
        );
        expect(res).toNotHaveErrors(ctx);
        expect(res.is).toEqualType(preset.refType(child), ctx);
    });

    it(`spread covers subs`, () => {
        const ctx = newContext(`
        type Vec2 = { x: float, y: float }
        type Vec3 = { ...Vec2, z: float }
        `);
        let res = parseExpression(ctx, `(m: Vec3) => Vec3{...m, z: 10.0}`);
        expect(res).toNotHaveErrors(ctx);
    });

    it(`spread`, () => {
        const ctx = newContext(`
        @ffi
        type Vec2 = {
            x: float,
            y: float
        }

        @ffi
        type Vec3 = {
            ...Vec2,
            z: float
        }


        // type Vec2 {x: float, y: float};
        // const v2 = Vec2{x: 1.0, y: 2.1};
        // type Vec3 {...Vec2, z: float};

        @ffi
        const vec3 = (v: Vec2, z: float) => Vec3{...v, z: z}
        `);
        // let res = parseExpression(ctx, `Vec3{...v2, z: 10.0}`);
        // expect(res).toNotHaveErrors(ctx);
        // res = parseExpression(ctx, `(m: Vec2) => Vec3{...m, z: 10.0}`);
        // expect(res).toNotHaveErrors(ctx);
    });

    it(`defaults!`, () => {
        const ctx = newContext(`
        type Whatsit = {
            age: int = 10,
            name: string,
        }
        `);

        let res = parseExpression(ctx, `Whatsit{name: "hi"}`);
        expect(res).toNotHaveErrors(ctx);
        res = parseExpression(ctx, `Whatsit`);
        expect(showTermErrors(ctx, res)).toMatchInlineSnapshot(
            `[Hole] at 1:1-1:8`,
        );
        const whatsit = idName(ctx.library.types.names['Whatsit'][0]);
        expect(termToString(ctx, res)).toEqual(
            `Whatsit#${whatsit}{name#${whatsit}#1: _}`,
        );
    });

    // This to test:
    // - Spreads!
    // - attributes with the wrong id, but right name
    // - subTypes!
});
