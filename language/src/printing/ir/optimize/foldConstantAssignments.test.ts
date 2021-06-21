import { newSym } from '../../../typing/env';
import { Env, newWithGlobal, nullLocation } from '../../../typing/types';
import { Expr } from '../types';
import {
    assign,
    block,
    boolLiteral,
    builtin,
    callExpression,
    define,
    iffe,
    ifStatement,
    int,
    intLiteral,
    pureFunction,
    returnStatement,
    var_,
} from '../utils';
import { flattenImmediateCalls2 } from './flattenImmediateCalls2';
import { foldConstantAssignments } from './foldConstantAssignments';
import { inlineFunctionsCalledWithCapturingLambdas } from './inline';
import { specializeFunctionsCalledWithLambdas } from './monoconstant';
import { optimizeRepeatedly } from './optimize';
import {
    defaultEnv,
    expectValidGlsl,
    resultForExpr,
    runFixture,
    runOpt,
    snapshotSerializer,
} from './optimizeTestUtils';
import { expectDefined, removeUnusedVariables } from './removeUnusedVariables';
import { optimizeTailCalls } from './tailCall';

expect.addSnapshotSerializer(snapshotSerializer);

const plus = (env: Env, a: Expr, b: Expr): Expr =>
    callExpression(
        env,
        builtin('+', nullLocation, pureFunction([int, int], int)),
        [a, b],
        nullLocation,
    );

describe('flattenImmediateCalls', () => {
    it('should work', () => {
        expect(runFixture(`{const x = 10; x}`, foldConstantAssignments(true)))
            .toMatchInlineSnapshot(`
            const expr0#🐮👩‍🦰👶: int = (() => {
                const x#:0: int = 10;
                return 10;
            })()
        `);
    });

    it('should fold lmabdas if directed', () => {
        expect(
            runFixture(
                `{
                    const t = () => 4;
                    const m = 2;
                    const n = 3 + 4 + m;
                    t() + m + n
                }`,
                foldConstantAssignments(true),
            ),
        ).toMatchInlineSnapshot(`
            const expr0#🐃🖤🎖️😃: int = (() => {
                const t#:0: () => int = () => 4;
                const m#:1: int = 2;
                const n#:2: int = 3 + 4 + 2;
                return (() => 4)() + 2 + n#:2;
            })()
        `);
    });

    it('should leave lambdas alone lmabdas if directed', () => {
        expect(
            runFixture(
                `{
            const t = () => 4;
            t()
        }`,
                foldConstantAssignments(false),
            ),
        ).toMatchInlineSnapshot(`
            const expr0#👮‍♀️♠️👱: int = (() => {
                const t#:0: () => int = () => 4;
                return t#:0();
            })()
        `);
    });

    it('should respect ifs and not fold through them', () => {
        const noloc = nullLocation;

        const env = newWithGlobal(defaultEnv.global);
        const x = newSym(env, 'x');
        const y = newSym(env, 'y');
        const z = newSym(env, 'z');
        const a = newSym(env, 'a');
        const xv = var_(x, noloc, int);
        const yv = var_(y, noloc, int);
        const zv = var_(z, noloc, int);
        let expr = iffe(
            env,
            block(
                [
                    define(x, intLiteral(10, noloc)),
                    define(z, plus(env, xv, intLiteral(14, noloc))),
                    ifStatement(
                        boolLiteral(true, noloc),
                        block(
                            [
                                define(y, intLiteral(42, noloc)),
                                define(a, plus(env, xv, zv)),
                                assign(x, yv),
                            ],
                            noloc,
                        ),
                        block([assign(x, intLiteral(4, noloc))], noloc),
                        noloc,
                    ),
                    returnStatement(plus(env, xv, zv)),
                ],
                noloc,
            ),
        );

        // Before
        expect(resultForExpr(env, expr)).toMatchInlineSnapshot(`
            const unnamed#😥💇🔪: int = (() => {
                const x#:0: int = 10;
                const z#:2: int = x#:0 + 14;
                if true {
                    const y#:1: int = 42;
                    const a#:3: int = x#:0 + z#:2;
                    x#:0 = y#:1;
                } else {
                    x#:0 = 4;
                };
                return x#:0 + z#:2;
            })()
        `);

        expectDefined(expr, [x, y, z], []);

        expr = runOpt(env, expr, foldConstantAssignments(true));

        // After
        expect(resultForExpr(env, expr)).toMatchInlineSnapshot(`
            const unnamed#😙😪🏣: int = (() => {
                const x#:0: int = 10;
                const z#:2: int = 10 + 14;
                if true {
                    const y#:1: int = 42;
                    const a#:3: int = 10 + z#:2;
                    x#:0 = 42;
                } else {
                    x#:0 = 4;
                };
                return x#:0 + z#:2;
            })()
        `);

        expr = runOpt(env, expr, removeUnusedVariables);

        // After
        expect(resultForExpr(env, expr)).toMatchInlineSnapshot(`
            const unnamed#🥊: int = (() => {
                const x#:0: int = 10;
                const z#:2: int = 10 + 14;
                if true {
                    x#:0 = 42;
                } else {
                    x#:0 = 4;
                };
                return x#:0 + z#:2;
            })()
        `);

        expr = runOpt(
            env,
            expr,
            optimizeRepeatedly([
                foldConstantAssignments(true),
                removeUnusedVariables,
            ]),
        );

        // After
        expect(resultForExpr(env, expr)).toMatchInlineSnapshot(`
            const unnamed#🥊: int = (() => {
                const x#:0: int = 10;
                const z#:2: int = 10 + 14;
                if true {
                    x#:0 = 42;
                } else {
                    x#:0 = 4;
                };
                return x#:0 + z#:2;
            })()
        `);

        expectDefined(expr, [x, z], [y]);
    });

    it('should fold into if and lambda', () => {
        expect(
            runFixture(
                `{
                    const x = 10;
                    const v = if x > 2 {
                        x + 2
                    } else {
                        x - 2
                    };
                    () => x + v
                }`,
                optimizeRepeatedly([
                    flattenImmediateCalls2,
                    foldConstantAssignments(false),
                    removeUnusedVariables,
                ]),
            ),
        ).toMatchInlineSnapshot(`
            const expr0#💏🎂🚔: () => int = (() => {
                const v#:1: int;
                if 10 > 2 {
                    v#:1 = 10 + 2;
                } else {
                    v#:1 = 10 - 2;
                };
                v#:1 = v#:1;
                return () => 10 + v#:1;
            })()
        `);
    });

    it('should understand that assigns in ifs break it', () => {
        expect(
            runFixture(
                `{
                    const x = 10;
                    const v = if x > 2 {
                        x
                    } else {
                        x
                    };
                    () => x + v
                }`,
                optimizeRepeatedly([
                    flattenImmediateCalls2,
                    foldConstantAssignments(false),
                    removeUnusedVariables,
                ]),
            ),
        ).toMatchInlineSnapshot(`
            const expr0#⛽🚌🤾‍♂️😃: () => int = (() => {
                const v#:1: int;
                if 10 > 2 {
                    v#:1 = 10;
                } else {
                    v#:1 = 10;
                };
                v#:1 = v#:1;
                return () => 10 + v#:1;
            })()
        `);
    });

    it('should hold off from loops entirely', () => {
        const result = runFixture(
            `
            const rec repeatedly = (m: int, x: int, init: int, y: (int, int) => int): int => {
                if x <= 0 {
                    init + m
                } else {
                    repeatedly(m, x - 1, y(init, x), y)
                }
            }

            {
                const x = 10;
                const z = 12 + 1;
                repeatedly(23, x, 4, (init: int, i: int): int => init + i + z)
            }`,
            optimizeRepeatedly([
                flattenImmediateCalls2,
                // foldConstantAssignments(true),
                inlineFunctionsCalledWithCapturingLambdas,
                // removeUnusedVariables,
                optimizeTailCalls,
                // specializeFunctionsCalledWithLambdas,
            ]),
        );
        expect(result).toMatchInlineSnapshot(`
            const expr0#🚴‍♀️😽🥝: int = (() => {
                const x#:0: int = 10;
                const z#:1: int = 12 + 1;
                const m#:4: int = 23;
                const x#:5: int = x#:0;
                const init#:6: int = 4;
                const y#:7: (int, int) => int = (
                    init#:2: int,
                    i#:3: int,
                ) => init#:2 + i#:3 + z#:1;
                for (; x#:1 > 0; x#:1 = x#:5 - 1) {
                    const recur#:8: int = m#:4;
                    const recur#:9: int = x#:5 - 1;
                    const recur#:10: int = y#:7(init#:6, x#:5);
                    const recur#:11: (int, int) => int = y#:7;
                    m#:4 = recur#:8;
                    init#:6 = recur#:10;
                    y#:7 = recur#:11;
                    continue;
                };
                return init#:6 + m#:4;
            })()
        `);

        expectValidGlsl(result);
    });
});
