import { hashObject, newSym } from '../../../typing/env';
import {
    Env,
    Id,
    newWithGlobal,
    nullLocation,
    Symbol,
} from '../../../typing/types';
import { defaultVisitor, transformExpr } from '../transform';
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
import {
    flattenImmediateAssigns,
    flattenImmediateCalls,
} from './flattenImmediateCalls';
import { foldConstantAssignments } from './foldConstantAssignments';
import { foldSingleUseAssignments } from './foldSingleUseAssignments';
import { combineOpts, Optimizer2, optimizeRepeatedly } from './optimize';
import {
    runFixture,
    snapshotSerializer,
    defaultEnv,
    Result,
    resultForExpr,
    runOpt,
} from './optimizeTestUtils';
import { expectDefined, removeUnusedVariables } from './removeUnusedVariables';

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
                    flattenImmediateCalls,
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
                    flattenImmediateCalls,
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
                return () => 10 + v#:1;
            })()
        `);
    });
});
