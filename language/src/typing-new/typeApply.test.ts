import { parseTyped } from '../parsing/parser-new';
import { idName } from '../typing/env';
import * as preset from '../typing/preset';
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
import { typeFile } from './typeFile';

expect.extend(customMatchers);
expect.addSnapshotSerializer(rawSnapshotSerializer);
expect.addSnapshotSerializer(errorSerilaizer);
expect.addSnapshotSerializer(warningsSerializer);

describe('typeApply', () => {
    it('should with a builtin', () => {
        const ctx = newContext();
        ctx.builtins.terms['hello'] = preset.pureFunction([], preset.int);

        const res = parseExpression(ctx, `hello()`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(`hello#builtin()`);
        expect(res.is).toEqualType(preset.int, ctx);
        expect(res).toNotHaveErrors(ctx);
    });

    it('should work with a term', () => {
        const ctx = newContext();
        ctx.builtins.terms['hello'] = preset.pureFunction([], preset.int);
        let id;
        [ctx.library, [id]] = parseToplevels(ctx, `const hello = () => 10`);

        const res = parseExpression(ctx, `hello()`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(`hello#${idName(id)}()`);
        expect(res.is).toEqualType(preset.int, ctx);
        expect(res).toNotHaveErrors(ctx);
    });

    it('should pick the best one for the args', () => {
        const ctx = newContext();
        let a, b, aid, bid;
        [ctx.library, [a, b], [aid, bid]] = typeFile(
            ctx,
            parseTyped(`
        const one = (a: float) => 2;
        const one = (b: int) => 2;
        one(2)
        // one(2.1)
        `),
        );
        expect(termToString(ctx, a)).toEqual(`one#${idName(bid)}(b: 2)`);
        expect(a).toNotHaveErrors(ctx);
        // expect(termToString(ctx, b)).toEqual(`one#${idName(bid)}(b: 2.1)`);
        // expect(b).toNotHaveErrors(ctx);
    });

    it('should preserve extra arguments', () => {
        const ctx = newContext();
        ctx.builtins.terms['hello'] = preset.pureFunction([], preset.int);
        let id;
        [ctx.library, [id]] = parseToplevels(ctx, `const hello = () => 10`);

        const res = parseExpression(ctx, `hello(2)`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(
            `INVALID_APPLICATION[hello#${idName(id)}()<>(2)]`,
        );
        expect(res.is).toEqualType(preset.int, ctx);
        expect(showTermErrors(ctx, res)).toEqual(
            `INVALID_APPLICATION[hello#${idName(id)}()<>(2)] at 1:6-1:9`,
        );
    });

    it('should flag invalid arguments', () => {
        const ctx = newContext();
        ctx.builtins.terms['hello'] = preset.pureFunction([], preset.int);
        let id;
        [ctx.library, [id]] = parseToplevels(
            ctx,
            `const hello = (v: string) => 10`,
        );

        const res = parseExpression(ctx, `hello(2)`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(`hello#${idName(id)}(v: 2)`);
        expect(res.is).toEqualType(preset.int, ctx);
        expect(showTermErrors(ctx, res)).toEqual(
            `Expected string#builtin, found int#builtin : 2 at 1:7-1:8`,
        );
    });

    it('should flag non-function target', () => {
        const ctx = newContext();
        ctx.builtins.terms['hello'] = preset.pureFunction([], preset.int);
        let id;
        [ctx.library, [id]] = parseToplevels(ctx, `const hello = 10`);

        const res = parseExpression(ctx, `hello(2)`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(
            `INVALID_APPLICATION[hello#${idName(id)}<>(2)]`,
        );
        expect(res.is).toEqualType(preset.void_, ctx);
        expect(showTermErrors(ctx, res)).toEqual(
            `INVALID_APPLICATION[hello#${idName(id)}<>(2)] at 1:6-1:9`,
        );
    });

    // ok
    it('should work with generic', () => {
        const ctx = newContext();
        ctx.builtins.types.int = 0;
        ctx.builtins.terms['hello'] = preset.pureFunction([], preset.int);
        let id;
        [ctx.library, [id]] = parseToplevels(
            ctx,
            `const hello = <T>(x: T) => x`,
        );

        const res = parseExpression(ctx, `hello<int>(2)`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(
            `hello#${idName(id)}<int#builtin>(x: 2)`,
        );
        expect(res.is).toEqualType(preset.int, ctx);
        expect(res).toNotHaveErrors(ctx);
    });

    // ok
    it('should capture extra type vbls', () => {
        const ctx = newContext();
        ctx.builtins.types.int = 0;
        ctx.builtins.types.float = 0;
        ctx.builtins.terms['hello'] = preset.pureFunction([], preset.int);
        let id;
        [ctx.library, [id]] = parseToplevels(
            ctx,
            `const hello = <T>(x: T) => x`,
        );

        const res = parseExpression(ctx, `hello<int, float>(2)`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(
            `INVALID_APPLICATION[hello#${idName(
                id,
            )}<int#builtin>(x: 2)<float#builtin>()]`,
        );
        expect(res.is).toEqualType(preset.int, ctx);
        // expect(res).toNotHaveErrors(ctx);
    });

    describe('inference', () => {
        // ok
        it('should infer type for missing type variables where possible', () => {
            const ctx = newContext();
            ctx.builtins.types.int = 0;
            ctx.builtins.types.float = 0;
            ctx.builtins.terms['hello'] = preset.pureFunction([], preset.int);
            let id;
            [ctx.library, [id]] = parseToplevels(
                ctx,
                `const hello = <T>(x: T) => x`,
            );

            const res = parseExpression(ctx, `hello(2)`);
            expect(ctx.warnings).toHaveLength(0);
            expect(termToString(ctx, res)).toEqual(
                `hello#${idName(id)}<int#builtin>(x: 2)`,
            );
            expect(res.is).toEqualType(preset.int, ctx);
        });

        // ok
        it('should infer more complex', () => {
            const ctx = newContext();
            ctx.builtins.types.int = 0;
            ctx.builtins.types.float = 0;
            ctx.builtins.types.Array = 1;
            ctx.builtins.terms['hello'] = preset.pureFunction([], preset.int);
            let id;
            [ctx.library, [id]] = parseToplevels(
                ctx,
                `const hello = <T>(x: Array<(int, float) => T>) => x`,
            );

            const res = parseExpression(
                ctx,
                `hello([(a: int, b: float) => a])`,
            );
            expect(ctx.warnings).toHaveLength(0);
            expect(termToString(ctx, res)).toEqual(`\
hello#${idName(id)}<int#builtin>(
    x: <(int#builtin, float#builtin) ={}> int#builtin>[
        (a#:4: int#builtin, b#:5: float#builtin): int#builtin ={}> a#:4,
    ],
)`);
        });

        // ok
        it('should have a type error when inferring a type that conflicts', () => {
            const ctx = newContext();
            ctx.builtins.types.int = 0;
            ctx.builtins.types.float = 0;
            ctx.builtins.terms['hello'] = preset.pureFunction([], preset.int);
            let id;
            [ctx.library, [id]] = parseToplevels(
                ctx,
                `const hello = <T>(x: T, y: T) => x`,
            );

            const res = parseExpression(ctx, `hello(2, true)`);
            expect(ctx.warnings).toHaveLength(0);
            expect(termToString(ctx, res)).toEqual(
                `hello#${idName(id)}<int#builtin>(x: 2, y: true)`,
            );
            expect(res.is).toEqualType(preset.int, ctx);
            expect(showTermErrors(ctx, res)).toEqual(
                `Expected int#builtin, found bool#builtin : true at 1:10-1:14`,
            );
        });
    });

    it('should work with effects n stuff', () => {
        const ctx = newContext();
        ctx.builtins.types.int = 0;
        ctx.builtins.terms['hello'] = preset.pureFunction([], preset.int);
        let id, what;
        [ctx.library, [id, what]] = parseToplevels(
            ctx,
            `const hello = {e}(f: () ={e}> int): int ={e}> f();
            effect What {
                what: () => int,
            };`,
        );

        const res = parseExpression(ctx, `hello{What}(() ={What}> 10)`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(
            `hello#${idName(id)}{What#${idName(
                what,
            )}}(f: (): int#builtin ={What#${idName(what)}}> 10)`,
        );
        expect(res.is).toEqualType(preset.int, ctx);
        expect(res).toNotHaveErrors(ctx);
    });

    it('should detect mismatched effects', () => {
        const ctx = newContext();
        ctx.builtins.types.int = 0;
        ctx.builtins.terms['hello'] = preset.pureFunction([], preset.int);
        let id, what;
        [ctx.library, [id, what]] = parseToplevels(
            ctx,
            `const hello = {e}(f: () ={e}> int): int ={e}> f();
            effect What {
                what: () => int,
            };`,
        );

        let res = parseExpression(ctx, `hello{What}(() ={}> 10)`);
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(
            `hello#${idName(id)}{What#${idName(
                what,
            )}}(f: (): int#builtin ={}> 10)`,
        );
        expect(res.is).toEqualType(preset.int, ctx);
        expect(showTermErrors(ctx, res)).toEqual(
            `Expected () ={What#${idName(
                what,
            )}}> int#builtin, found () ={}> int#builtin : (): int#builtin ={}> 10 at 1:13-1:23`,
        );
        res = parseExpression(ctx, `hello{}(() ={What}> 10)`);
        expect(termToString(ctx, res)).toEqual(
            `hello#${idName(id)}{}(f: (): int#builtin ={What#${idName(
                what,
            )}}> 10)`,
        );
        expect(res.is).toEqualType(preset.int, ctx);
        expect(showTermErrors(ctx, res)).toEqual(
            `Expected () ={}> int#builtin, found () ={What#${idName(
                what,
            )}}> int#builtin : (): int#builtin ={What#b54d969c}> 10 at 1:9-1:23`,
        );
    });
});
