import { parseTyped } from '../parsing/parser-new';
import { idName } from '../typing/env';
import * as preset from '../typing/preset';
import { nullLocation, RecordDef } from '../typing/types';
import { addRecord, addTerm } from './Library';
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

describe('typeFile', () => {
    it(`expr`, () => {
        const ctx = newContext();
        let exprs;
        [ctx.library, exprs] = typeFile(ctx, parseTyped(`23`));
        expect(exprs).toHaveLength(1);
        expect(exprs[0].is).toEqualType(preset.int, ctx);
    });

    it(`defn`, () => {
        const ctx = newContext();
        let expr, id;
        [ctx.library, [expr], [id]] = typeFile(
            ctx,
            parseTyped(`const x = 10\nx`),
        );
        expect(ctx.library.terms.names.x).toEqual([id]);
        if (expr.type !== 'ref') {
            throw new Error('not a ref');
        }
        expect(expr).toNotHaveErrors(ctx);
        expect(expr.ref).toEqual({ type: 'user', id: id });
    });

    it(`recursive defn`, () => {
        const ctx = newContext();
        ctx.builtins.ops.binary['<'] = [
            { left: preset.int, right: preset.int, output: preset.bool },
        ];
        ctx.builtins.ops.binary['-'] = [
            { left: preset.int, right: preset.int, output: preset.int },
        ];
        [ctx.library] = typeFile(
            ctx,
            parseTyped(`
			const rec range: (int) => int = (v: int): int => if v < 0 { 10 } else { range(v - 1)}
			`),
        );
        [ctx.library] = typeFile(
            ctx,
            parseTyped(`
			const rec rangeT: <T>(int, T) => T = <T>(v: int, d: T): T => if v < 0 { d } else { rangeT<T>(v - 1, d)}
			`),
        );
    });

    it(`why isnt as working`, () => {
        const ctx = newContext();
        [ctx.library] = parseToplevels(
            ctx,
            `
			type Eq<T#:4> = {
					"==": (T, T) => bool,
				}
			`,
        );
        // const text = fs.readFileSync(path.join(base, name), 'utf8');
        const text = `

                const rec arrayEq: <T#:10,>(Array<T>, Array<T>, Eq<T>) => bool
                = <T#:15,>(one: Array<T>, two: Array<T>, eq: Eq<T>): bool => {
                    switch (one, two) {
                        ([], []) => true,
                        ([one, ...rone], [two, ...rtwo]) => if eq."=="(one, two) {
							true
                        } else {
                            false
                        },
                        _ => false
                    }
                };
                arrayEq
            `;
        let exprs;
        [ctx.library, exprs] = typeFile(ctx, parseTyped(text));
        exprs.forEach((expr) => {
            expect(expr).toNotHaveErrors(ctx);
        });
    });

    it(`supercedes`, () => {
        const ctx = newContext();
        let exprs, id1, id2;
        [ctx.library, , [id1, id2]] = typeFile(
            ctx,
            parseTyped(
                `@createdAt(500)
				@deprecated(200) const x = 10;
				@basedOn(x)
				@supercedes#builtin(x) const x = 20`,
            ),
        );
        expect(ctx.library.terms.names.x).toEqual([id2, id1]);
        expect(ctx.library.terms.defns[idName(id2)].meta.supercedes).toEqual(
            id1,
        );
        expect(ctx.library.terms.defns[idName(id1)].meta.deprecated).toEqual(
            200,
        );
        expect(ctx.library.terms.defns[idName(id1)].meta.created).toEqual(500);
        let id3;
        [ctx.library, , [id3]] = typeFile(
            ctx,
            parseTyped(
                `
				@basedOn(what#${idName(id2)})
				const what = 2000`,
            ),
        );
        expect(ctx.library.terms.defns[idName(id3)].meta.basedOn).toEqual(id2);
    });

    it(`effect`, () => {
        const ctx = newContext();
        let id, expr;
        [ctx.library, [expr], [id]] = typeFile(
            ctx,
            parseTyped(`
			@unique#builtin(100.0)
			effect Stdio {
				Read: () => string,
				Write: (string) => void,
			};
			() ={Stdio}> raise!(Stdio.Read());
			`),
        );
        expect(expr).toNotHaveErrors(ctx);
        expect(termToString(ctx, expr)).toEqual(
            `(): string#builtin ={Stdio#${idName(id)}}> raise!(Stdio#${idName(
                id,
            )}.Read())`,
        );
        expect(ctx.library.effects.names.Stdio).toEqual([id]);
        // TODO: support uniques for effects
        // expect(ctx.library.effects.defns[idName(id)].defn.unique).toEqual(100);
    });

    it(`decorator`, () => {
        const ctx = newContext();
        let id, expr;
        [ctx.library, [expr], [id]] = typeFile(
            ctx,
            parseTyped(`
			@unique#builtin(100)
			decorator Slider(min: int, max: int) float;
			(@Slider(10, 20) 45.0)
		`),
        );
        expect(ctx.library.decorators.defns[idName(id)].defn.unique).toEqual(
            100,
        );
        expect(termToString(ctx, expr)).toEqual(
            `(@Slider#${idName(id)}(min: 10, max: 20) 45.0)`,
        );
        expect(expr.decorators![0].name.id).toEqual(id);
    });

    it(`record`, () => {
        const ctx = newContext();
        let awesome, other, expr;
        [ctx.library, [expr], [awesome, other]] = typeFile(
            ctx,
            parseTyped(`
			@unique#builtin(12)
			type Awesome {
				what: string,
			};
			type Other {
				...Awesome,
				thing: int,
			};
			Other{what: "what", thing: 20}
			`),
        );
        expect(expr).toNotHaveErrors(ctx);
        expect(
            (ctx.library.types.defns[idName(awesome)].defn as RecordDef).unique,
        ).toEqual(12);
        expect(termToString(ctx, expr)).toEqual(
            `Other#${idName(other)}{what#${idName(
                awesome,
            )}#0: "what", thing#${idName(other)}#0: 20}`,
        );
    });

    it(`enum`, () => {
        const ctx = newContext();
        let expr, one, two;
        [ctx.library, [expr], [, one, two]] = typeFile(
            ctx,
            parseTyped(`
			type OneOld {};
			@supercedes(: OneOld)
			type One {what: int};
			enum Two {
				One,
				Three{four: float},
			};
			(Two:One{what: 2}, Two:Three{four: 1.1})
			`),
        );
        expect(expr).toNotHaveErrors(ctx);
        const three = ctx.library.types.names['Three'][0];
        expect(termToString(ctx, expr)).toEqual(
            `(Two#${idName(two)}:One#${idName(one)}{what#${idName(
                one,
            )}#0: 2}, Two#${idName(two)}:Three#${idName(three)}{four#${idName(
                three,
            )}#0: 1.1})`,
        );
    });

    it(`enum with type variables`, () => {
        const ctx = newContext();
        [ctx.library] = typeFile(
            ctx,
            parseTyped(`
		type One<T> {name: T, age: int};
		type Two {};
		enum Hello<Thing> {
			One<Thing>,
			Two,
		}
		`),
        );
    });
});
