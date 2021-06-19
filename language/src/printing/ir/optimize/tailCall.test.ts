import { flattenImmediateCalls } from './flattenImmediateCalls';
import { foldConstantAssignments } from './foldConstantAssignments';
import { foldSingleUseAssignments } from './foldSingleUseAssignments';
import { optimizeRepeatedly } from './optimize';
import {
    expectValidGlsl,
    runFixture,
    snapshotSerializer,
} from './optimizeTestUtils';
import { removeUnusedVariables } from './removeUnusedVariables';
import { optimizeTailCalls } from './tailCall';

expect.addSnapshotSerializer(snapshotSerializer);

describe('tailCall', () => {
    it('should work', () => {
        const result = runFixture(
            `const rec tailMe = (max: int, collect: int, most: int): int => {
				if max <= most {
					collect
				} else {
					tailMe(max - 2, collect + 10, most)
				}
			}

			tailMe(20, 0, 1)

			tailMe(1, 0, 2)
			`,
            optimizeRepeatedly([
                flattenImmediateCalls,
                // specializeFunctionsCalledWithLambdas,
                // // These are needed for cleanup
                foldConstantAssignments(true),
                foldSingleUseAssignments,
                optimizeTailCalls,
                removeUnusedVariables,
            ]),
        );
        expect(result).toMatchInlineSnapshot(`
              const tailMe#🤹🥐🐒: (int, int, int) => int = (
                  max#:0: int,
                  collect#:1: int,
                  most#:2: int,
              ) => {
                  loop {
                      if max#:0 <= most#:2 {
                          return collect#:1;
                      } else {
                          max#:0 = max#:0 - 2;
                          collect#:1 = collect#:1 + 10;
                          continue;
                      };
                  };
              }

              const expr1#🚠: int = tailMe#🤹🥐🐒(1, 0, 2)

              const expr0#😬: int = tailMe#🤹🥐🐒(20, 0, 1)
        `);
        expectValidGlsl(result);
    });
});
