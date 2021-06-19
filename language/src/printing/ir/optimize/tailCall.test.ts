import { hasInvalidGLSL } from '../../glslPrinter';
import { flattenImmediateCalls } from './flattenImmediateCalls';
import { foldConstantAssignments } from './foldConstantAssignments';
import { foldSingleUseAssignments } from './foldSingleUseAssignments';
import { specializeFunctionsCalledWithLambdas } from './monoconstant';
import {
    combineOpts,
    midOpt,
    optimizeRepeatedly,
    removeUnusedVariables,
    simpleOpt,
} from './optimize';
import {
    expectValidGlsl,
    runFixture,
    snapshotSerializer,
} from './optimizeTestUtils';
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
                  for (; max#:0 > most#:2; max#:0 = max#:0 - 2) {
                      collect#:1 = collect#:1 + 10;
                      continue;
                  };
                  return collect#:1;
              }

              const expr1#🚠: int = tailMe#🤹🥐🐒(1, 0, 2)

              const expr0#😬: int = tailMe#🤹🥐🐒(20, 0, 1)
        `);
        expectValidGlsl(result);
    });
});
