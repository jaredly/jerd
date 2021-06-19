import { hashObject, newSym } from '../../../typing/env';
import { Env, Id, newWithGlobal, nullLocation } from '../../../typing/types';
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
import {
    combineOpts,
    Optimizer2,
    optimizeRepeatedly,
    removeUnusedVariables,
} from './optimize';
import {
    runFixture,
    snapshotSerializer,
    defaultEnv,
    Result,
} from './optimizeTestUtils';

expect.addSnapshotSerializer(snapshotSerializer);

const resultForExpr = (env: Env, expr: Expr): Result => {
    const hash = hashObject(expr);
    const result: Result = {
        env,
        irTerms: { [hash]: { expr, inline: false } },
        inOrder: [hash],
    };
    return result;
};

const runOpt = (env: Env, expr: Expr, opt: Optimizer2) =>
    opt(
        {
            env,
            exprs: {},
            opts: {},
            optimize: opt,
            id: { hash: 'nope', size: 1, pos: 0 },
        },
        expr,
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

    it('should respect ifs and not fold through them', () => {
        const noloc = nullLocation;

        const env = newWithGlobal(defaultEnv.global);
        const x = newSym(env, 'x');
        const y = newSym(env, 'y');
        const z = newSym(env, 'z');
        let expr = iffe(
            env,
            block(
                [
                    define(x, intLiteral(10, noloc)),
                    define(z, callExpression(
                        env,
                        builtin('+', noloc, pureFunction([int, int], int)),
                        [var_(x, noloc, int), intLiteral(14, noloc)],
                        noloc,
                    )),
                    ifStatement(
                        boolLiteral(true, noloc),
                        block(
                            [
                                define(y, callExpression(
                                    env,
                                    builtin(
                                        '+',
                                        noloc,
                                        pureFunction([int, int], int),
                                    ),
                                    [var_(x, noloc, int), intLiteral(4, noloc)],
                                    noloc,
                                )),
                                assign(x, var_(y, noloc, int)),
                            ],
                            noloc,
                        ),
                        block([assign(x, intLiteral(4, noloc))], noloc),
                        noloc,
                    ),
                    returnStatement(var_(x, noloc, int)),
                ],
                noloc,
            ),
        );

        // Before
        expect(resultForExpr(env, expr)).toMatchInlineSnapshot(`
            const unnamed#⛄🏵️🦁: int = (() => {
                const x#:0: int = 10;
                const z#:2: int = x#:0 + 14;
                if true {
                    const y#:1: int = x#:0 + 4;
                    x#:0 = y#:1;
                } else {
                    x#:0 = 4;
                };
                return x#:0;
            })()
        `);

        expr = runOpt(env, expr, foldConstantAssignments(true));

        // After
        expect(resultForExpr(env, expr)).toMatchInlineSnapshot(`
            const unnamed#🧏‍♀️🦍🧞‍♂️: int = (() => {
                const x#:0: int = 10;
                const z#:2: int = 10 + 14;
                if true {
                    const y#:1: int = x#:0 + 4;
                    x#:0 = y#:1;
                } else {
                    x#:0 = 4;
                };
                return x#:0;
            })()
        `);
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
                const x#:0: int = 10;
                const v#:1: int;
                if x#:0 > 2 {
                    v#:1 = x#:0 + 2;
                } else {
                    v#:1 = x#:0 - 2;
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
                const x#:0: int = 10;
                const v#:1: int;
                if x#:0 > 2 {
                    v#:1 = x#:0 + 2;
                } else {
                    v#:1 = x#:0 - 2;
                };
                return () => 10 + v#:1;
            })()
        `);
    });
});
