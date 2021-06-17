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
