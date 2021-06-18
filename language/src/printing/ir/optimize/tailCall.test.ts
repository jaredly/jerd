import { hasInvalidGLSL } from '../../glslPrinter';
import { foldConstantAssignments } from './foldConstantAssignments';
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

describe('specializeFunctionsCalledWithLambdas', () => {
    it('should work', () => {
        const result = runFixture(
            `
			const rec tailMe = (max: int, collect: int): int => {
				if max <= 0 {
					collect
				} else {
					tailMe(max - 1, collect + 10)
				}
			}

			tailMe(20, 0)

			tailMe(1, 0)
			`,
            combineOpts([
                // specializeFunctionsCalledWithLambdas,
                // // These are needed for cleanup
                // foldConstantAssignments(true),
                // removeUnusedVariables,
                // optimizeTailCalls,
            ]),
        );
        expect(result).toMatchInlineSnapshot(`
              const expr1#💇: int = tailMe#🪐(1, 0)

              const expr0#😛👩‍👩‍👧‍👧👨‍👨‍👧‍👦😃: int = tailMe#🪐(
                  20,
                  0,
              )
        `);
        expectValidGlsl(result);
    });
});
