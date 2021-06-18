import { flattenImmediateCalls } from './flattenImmediateCalls';
import { foldConstantAssignments } from './foldConstantAssignments';
import { foldSingleUseAssignments } from './foldSingleUseAssignments';
import { combineOpts } from './optimize';
import { runFixture, snapshotSerializer } from './optimizeTestUtils';

expect.addSnapshotSerializer(snapshotSerializer);

describe('flattenImmediateCalls', () => {
    it('should work', () => {
        expect(
            runFixture(`(() => 10)()`, flattenImmediateCalls),
        ).toMatchInlineSnapshot(`  const expr0#🌾🤶🦹‍♂️😃: int = 10`);
    });

    it('should work double', () => {
        expect(
            runFixture(`(() => (() => 10)())()`, flattenImmediateCalls),
        ).toMatchInlineSnapshot(`  const expr0#☂️🧸🙆‍♀️😃: int = (() => 10)()`);
    });

    it('should do ifs', () => {
        expect(
            runFixture(
                `if true { 20 } else { 30 }`,
                combineOpts([flattenImmediateCalls, foldSingleUseAssignments]),
            ),
        ).toMatchInlineSnapshot(`
              const expr0#🌽🤰🦞: int = (() => {
                  if true {
                      return 20;
                  } else {
                      return 30;
                  };
              })()
        `);
    });

    it('wont work yet', () => {
        const result = runFixture(
            `() => {
                ((v: int) => if v > 10 {
					() => 20
				} else {
					() => 30
				})(10)()
            }`,
            combineOpts([
                // specializeFunctionsCalledWithLambdas,
                // inlineCallsThatReturnFunctions,
                // foldConstantAssignments,
                flattenImmediateCalls,
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

        // - [ ] make flattenImmediateCalls test for multiple returns; if so, break out
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
              const expr0#🐻‍❄️: () => int = () => {
                  const lambdaBlockResult#:1: () => int;
                  const v#:0: int = 10;
                  lambdaBlockResult#:1 = (() => {
                      if v#:0 > 10 {
                          return () => 20;
                      } else {
                          return () => 30;
                      };
                  })();
                  return lambdaBlockResult#:1();
              }
        `);
    });
});
