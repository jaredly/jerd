import { idName } from '../typing/env';
import * as preset from '../typing/preset';
import { constructor, Groups, isExhaustive } from '../typing/terms/exhaustive';
import { Lambda, LambdaType, nullLocation, Switch } from '../typing/types';
import {
    addEffect,
    addEnum,
    addRecord,
    addTerm,
    typesForName,
} from './Library';
import {
    customMatchers,
    errorSerilaizer,
    fakeOp,
    newContext,
    parseExpression,
    rawSnapshotSerializer,
    showTermErrors,
    showTypeErrors,
    termToString,
    warningsSerializer,
} from './test-utils';
import { patternToExPattern, recordToExPattern } from './typeSwitch';

expect.extend(customMatchers);
expect.addSnapshotSerializer(rawSnapshotSerializer);
expect.addSnapshotSerializer(errorSerilaizer);
expect.addSnapshotSerializer(warningsSerializer);

describe(`recordToExPattern`, () => {
    it(`lets go`, () => {
        const ctx = newContext(`
		enum Option {
			Some{contents: int},
			None{}
		}
		`);
        const option = typesForName(ctx.library, 'Option')[0];
        const some = typesForName(ctx.library, 'Some')[0];
        const none = typesForName(ctx.library, 'None')[0];
        let ex = recordToExPattern(
            preset.userTypeReference(none),
            {
                type: 'Record',
                ref: preset.userTypeReference(none),
                items: [],
                location: nullLocation,
            },
            {},
            ctx,
        );
        expect(ex).toEqual(constructor(idName(none), idName(none), []));
        ex = recordToExPattern(
            preset.userTypeReference(option),
            {
                type: 'Record',
                ref: preset.userTypeReference(some),
                items: [
                    {
                        idx: 0,
                        is: preset.int,
                        location: nullLocation,
                        pattern: {
                            type: 'int',
                            value: 10,
                            is: preset.int,
                            location: nullLocation,
                        },
                        ref: { type: 'user', id: some },
                    },
                ],
                location: nullLocation,
            },
            {},
            ctx,
        );
        expect(ex).toEqual(
            constructor(idName(some), idName(option), [
                constructor('10', 'int', []),
            ]),
        );
    });
});

describe('typeSwitch', () => {
    it('should work', () => {
        const ctx = newContext();

        const res = parseExpression(
            ctx,
            `switch 10 {
			0 => true,
			1 => false,
			10 => true,
			_ => false
		}`,
        );
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(
            `switch 10 {0 => true, 1 => false, 10 => true, _ => false}`,
        );
        expect(res.is).toEqualType(preset.bool, ctx);
        expect(res).toNotHaveErrors(ctx);
    });

    it(`should do exhaustive right in like a bunch of ways`, () => {
        const ctx = newContext(`
		enum Option {
			Some{contents: int},
			None{more: int}
		}
		`);
        let res = parseExpression(
            ctx,
            `
		(m: Option) => switch m {
			Some{contents: 10} => true,
			None => false
		}
		`,
        );
        expect(showTermErrors(ctx, res)).toEqual(`[Hole] at 2:18-5:4`);
        // const sw = (res as Lambda).body as Switch;
        // const groups: Groups = { int: null };
        // const matrix = sw.cases.map((k) => [
        //     patternToExPattern(ctx, sw.term.is, groups, k.pattern),
        // ]);
        // console.log(matrix);
        // expect(JSON.stringify(sw.cases)).toMatchInlineSnapshot(
        //     `[{"pattern":{"type":"Record","ref":{"type":"ref","ref":{"type":"user","id":{"hash":"16dc417a","size":1,"pos":0}},"location":{"start":{"offset":20,"line":3,"column":4},"end":{"offset":39,"line":3,"column":23},"idx":7},"typeVbls":[]},"items":[{"ref":{"type":"user","id":{"hash":"16dc417a","size":1,"pos":0}},"idx":0,"location":{"start":{"offset":37,"line":3,"column":9},"end":{"offset":49,"line":3,"column":21},"idx":12},"pattern":{"type":"int","is":{"type":"ref","ref":{"type":"builtin","name":"int"},"location":{"source":"<builtin>"},"typeVbls":[]},"location":{"start":{"offset":47,"line":3,"column":19},"end":{"offset":49,"line":3,"column":21},"idx":11},"value":10},"is":{"type":"ref","typeVbls":[],"ref":{"type":"builtin","name":"int"},"location":{"start":{"offset":35,"line":3,"column":19},"end":{"offset":38,"line":3,"column":22},"idx":3}}}],"location":{"start":{"offset":32,"line":3,"column":4},"end":{"offset":50,"line":3,"column":22},"idx":14}},"body":{"type":"boolean","is":{"type":"ref","ref":{"type":"builtin","name":"bool"},"location":{"source":"<builtin>"},"typeVbls":[]},"location":{"start":{"offset":54,"line":3,"column":26},"end":{"offset":58,"line":3,"column":30},"idx":15},"value":true},"location":{"start":{"offset":32,"line":3,"column":4},"end":{"offset":58,"line":3,"column":30},"idx":16}},{"pattern":{"type":"Binding","sym":{"unique":2,"name":"None"},"location":{"start":{"offset":63,"line":4,"column":4},"end":{"offset":67,"line":4,"column":8},"idx":18}},"body":{"type":"boolean","is":{"type":"ref","ref":{"type":"builtin","name":"bool"},"location":{"source":"<builtin>"},"typeVbls":[]},"location":{"start":{"offset":71,"line":4,"column":12},"end":{"offset":76,"line":4,"column":17},"idx":19},"value":false},"location":{"start":{"offset":63,"line":4,"column":4},"end":{"offset":76,"line":4,"column":17},"idx":20}}]`,
        // );
        // expect(JSON.stringify(matrix)).toMatchInlineSnapshot(
        //     `[[{"type":"constructor","id":"16dc417a","groupId":"bcf89d7e","args":[{"type":"constructor","id":"10","groupId":"int","args":[]}]}],[{"type":"anything"}]]`,
        // );
        // expect(isExhaustive(groups, matrix)).toBeFalsy();
        // expect(showTermErrors(ctx, res)).toMatchInlineSnapshot('HOLE');
    });

    it('should insert catchall if not exhaustive', () => {
        const ctx = newContext();

        const res = parseExpression(
            ctx,
            `switch 10 {
			0 => true,
			1 => false,
			10 => true,
		}`,
        );
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(
            `switch 10 {0 => true, 1 => false, 10 => true, _ => _}`,
        );
        expect(res.is).toEqualType(preset.bool, ctx);
        expect(showTermErrors(ctx, res)).toEqual(`[Hole] at 1:1-5:4`);
    });

    it('basic stuff', () => {
        const ctx = newContext();
        let id;
        [ctx.library, id] = addRecord(
            ctx.library,
            preset.recordDefn([preset.string]),
            'HasName',
            ['name'],
        );
        let id2;
        [ctx.library, id2] = addRecord(
            ctx.library,
            preset.recordDefn([preset.int, preset.float], [preset.refType(id)]),
            'Person',
            ['age', 'money'],
        );

        let enu;
        [ctx.library, enu] = addEnum(
            ctx.library,
            preset.enumDefn([preset.refType(id2)]),
            'Enum',
        );

        let res = parseExpression(
            ctx,
            `(m: Enum) => switch m {
				Person{age} => age,
			}`,
        );
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(
            `(m#:1: Enum#${idName(
                enu,
            )}): int#builtin ={}> switch m#:1 {Person#${idName(
                id2,
            )}{age#:2} => age#:2}`,
        );
        // expect(res.is).toEqualType(preset.bool, ctx);
        expect(res).toNotHaveErrors(ctx);

        res = parseExpression(
            ctx,
            `(m: Enum) => switch m {
				Person{age: 10} => 20,
			}`,
        );
        expect(ctx.warnings).toHaveLength(0);
        expect(termToString(ctx, res)).toEqual(
            `(m#:3: Enum#${idName(
                enu,
            )}): int#builtin ={}> switch m#:3 {Person#${idName(
                id2,
            )}{age: 10} => 20, _ => _}`,
        );
        expect(showTermErrors(ctx, res)).toMatchInlineSnapshot(
            `[Hole] at 1:14-3:5`,
        );
    });

    // TODO TODO: test array, tuple, exhaustiveness stuff.
});
