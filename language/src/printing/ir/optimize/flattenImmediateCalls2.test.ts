import { flattenImmediateCalls2 } from './flattenImmediateCalls2';
import { foldConstantAssignments } from './foldConstantAssignments';
import { foldSingleUseAssignments } from './foldSingleUseAssignments';
import {
    combineOpts,
    optimizeRepeatedly,
    removeNestedBlocksAndCodeAfterReturns,
} from './optimize';
import { runFixture, snapshotSerializer } from './optimizeTestUtils';
import { removeUnusedVariables } from './removeUnusedVariables';

expect.addSnapshotSerializer(snapshotSerializer);

describe('flattenImmediateCalls2', () => {
    it('should work', () => {
        expect(
            runFixture(`(() => 10)()`, flattenImmediateCalls2),
        ).toMatchInlineSnapshot(`const expr0#🌾🤶🦹‍♂️😃: int = 10`);
    });

    it('should work double', () => {
        expect(
            runFixture(
                `(() => (() => 10)() + 2)()`,
                optimizeRepeatedly(flattenImmediateCalls2),
            ),
        ).toMatchInlineSnapshot(`const expr0#🦦👨‍🦽😕😃: int = 10 + 2`);
    });

    it('should do ifs', () => {
        expect(
            runFixture(
                `if true { 20 } else { 30 }`,
                combineOpts([flattenImmediateCalls2, foldSingleUseAssignments]),
            ),
        ).toMatchInlineSnapshot(`
            const expr0#🌽🤰🦞: int = ((): int => {
                if true {
                    return 20;
                } else {
                    return 30;
                };
            })()
        `);
    });

    it('should do nested ifs', () => {
        expect(
            runFixture(
                `if 11 > 2 { const x = 10; if x > 1 { 23 } else {x - 1} } else { 30 }`,
                optimizeRepeatedly([
                    flattenImmediateCalls2,
                    // foldSingleUseAssignments,
                ]),
            ),
        ).toMatchInlineSnapshot(`
            const expr0#🏊‍♂️: int = ((): int => {
                if 11 > 2 {
                    const x#:0: int = 10;
                    if x#:0 > 1 {
                        return 23;
                    } else {
                        return x#:0 - 1;
                    };
                } else {
                    return 30;
                };
            })()
        `);
    });

    it('should do nested ifs to value', () => {
        expect(
            runFixture(
                `{
					const z = if 11 > 2 {
						const x = 10;
						const m = if x > 1 { 23 } else {x - 1};
						m / 2
					} else { 30 };
					z + 2
				}`,
                optimizeRepeatedly([
                    flattenImmediateCalls2,
                    // foldSingleUseAssignments,
                ]),
            ),
        ).toMatchInlineSnapshot(`
            const expr0#🍤⭐🧒: int = ((): int => {
                const z#:2: int;
                const continueBlock#:3: bool = true;
                if 11 > 2 {
                    const result#:4: int;
                    const continueBlock#:5: bool = true;
                    const x#:0: int = 10;
                    const m#:1: int;
                    const continueBlock#:6: bool = true;
                    if x#:0 > 1 {
                        m#:1 = 23;
                        continueBlock#:6 = false;
                    } else {
                        m#:1 = x#:0 - 1;
                        continueBlock#:6 = false;
                    };
                    m#:1 = m#:1;
                    result#:4 = m#:1 / 2;
                    continueBlock#:5 = false;
                    z#:2 = result#:4;
                    continueBlock#:3 = false;
                } else {
                    z#:2 = 30;
                    continueBlock#:3 = false;
                };
                z#:2 = z#:2;
                return z#:2 + 2;
            })()
        `);
    });

    it('should handle switches with all their beauty', () => {});

    it('wont work yet', () => {
        const result = runFixture(
            `() => {
                ((v: int) => if v > 10 {
					() => 20
				} else {
					() => 30
				})(10)()
            }`,
            optimizeRepeatedly([
                // specializeFunctionsCalledWithLambdas,
                // inlineCallsThatReturnFunctions,
                // foldConstantAssignments,
                flattenImmediateCalls2,
                // foldSingleUseAssignments,
                // flattenImmediateAssigns,
                // removeUnusedVariables,
            ]),
        );

        // Yeah hmmmm hm hm
        // So if we have lambda()()
        // then we can handle the inner one
        // But otherwise, if a lambda has divergent return functions
        // we don't handle it.

        // - [ ] make flattenImmediateCalls2 test for multiple returns; if so, break out
        // - [ ] make a flattenDoubleCallsToCPS; hope it works?

        // erghhh no this will fall apart with more complicated setups.
        // like if you use the function multiple times.
        // or if you've got a record that you're returning.
        //
        // Ok new plan:
        // we go all in on "function numbers", and switch off of them?
        // for multi-use things.
        // and if the thing is single-use, maybe we can re-optimize it with
        // constant folding?
        //
        // Ok yeah, I do think that's the more robust method
        // but hm
        //
        // Ok yeah, so:
        // >
        // If a function is used ... with ... hm ...

        // Ok, but how about
        // so, for compiling to zig,
        // we'll need to magic away our closures
        // yeah, because closures are definitely not supported by zig
        // on the other hand, Roc is all about the closures.

        // Ok anyway, I don't think I'm going to mess with this right now.
        // I'll say: I apply the transforms I can, and if we still
        // have lambdas, I'll say "sorry this is using fancier lambdas
        // than we can eliminate."
        // Same story with arrays, I imagine.

        expect(result).toMatchInlineSnapshot(`
            const expr0#🐻‍❄️: () => int = (): int => {
                const v#:0: int = 10;
                const result#:1: () => int;
                const continueBlock#:2: bool = true;
                if v#:0 > 10 {
                    result#:1 = (): int => 20;
                    continueBlock#:2 = false;
                } else {
                    result#:1 = (): int => 30;
                    continueBlock#:2 = false;
                };
                return result#:1();
            }
        `);
    });

    it('should do more complex', () => {
        const result = runFixture(
            `
            const length = (m: int) => m + 2
            (n: int) => length(n - {
                switch 5 {
                    4 => 3,
                    _ => 2
                }
            })`,
            optimizeRepeatedly([
                removeNestedBlocksAndCodeAfterReturns,
                // flattenImmediateCalls2
            ]),
        );
        expect(result).toMatchInlineSnapshot(`
            const length#🥈: (int) => int = (m#:0: int): int => m#:0 + 2

            const expr0#🕑: (int) => int = (n#:0: int): int => length#🥈(
                n#:0 - ((): int => ((): int => {
                    if 5 == 4 {
                        return 3;
                    };
                    const _#:1: int = 5;
                    return 2;
                })())(),
            )
        `);
    });

    it('should do more complex', () => {
        const result = runFixture(
            `
            const length = (m: int) => m + 2
            (n: int) => length(n - {
                switch 5 {
                    4 => 3,
                    _ => 2
                }
            })`,
            optimizeRepeatedly([
                removeNestedBlocksAndCodeAfterReturns,
                flattenImmediateCalls2,
            ]),
        );
        expect(result).toMatchInlineSnapshot(`
            const length#🥈: (int) => int = (m#:0: int): int => m#:0 + 2

            const expr0#🕑: (int) => int = (n#:0: int): int => {
                const result#:3: int;
                const continueBlock#:4: bool = true;
                if 5 == 4 {
                    result#:3 = 3;
                    continueBlock#:4 = false;
                };
                if continueBlock#:4 {
                    const _#:1: int = 5;
                    result#:3 = 2;
                    continueBlock#:4 = false;
                };
                return length#🥈(n#:0 - result#:3);
            }
        `);
    });
});
