import { hasInvalidGLSL } from '../../glslPrinter';
import { foldConstantAssignments } from './foldConstantAssignments';
import { specializeFunctionsCalledWithLambdas } from './monoconstant';
import {
    combineOpts,
    midOpt,
    removeUnusedVariables,
    simpleOpt,
} from './optimize';
import { runFixture, snapshotSerializer } from './optimizeTestUtils';

expect.addSnapshotSerializer(snapshotSerializer);

describe('specializeFunctionsCalledWithLambdas', () => {
    it('should work', () => {
        const result = runFixture(
            `const f = (g: (int) => int, n: int) => g(n / 2) + 2
			 f((m: int) => m + 4, 11) - f((m: int) => m - 23, 42)
		`,
            combineOpts([
                specializeFunctionsCalledWithLambdas,
                // These are needed for cleanup
                foldConstantAssignments,
                removeUnusedVariables,
            ]),
        );
        result.inOrder.forEach((id) => {
            expect(hasInvalidGLSL(result.irTerms[id].expr)).toBeFalsy();
        });

        expect(result).toMatchInlineSnapshot(`
              const expr0_lambda#0a384548: (int) => int = (
                  m#:1: int,
              ) => m#:1 - 23
              const expr0_lambda#72e8c5ec: (int) => int = (
                  m#:0: int,
              ) => m#:0 + 4
              const f_specialization#1b2fb1f8: (int) => int = (
                  n#:1: int,
              ) => {
                  return expr0_lambda#0a384548(n#:1 / 2) + 2;
              }
              const f_specialization#31ad3db0: (int) => int = (
                  n#:1: int,
              ) => {
                  return expr0_lambda#72e8c5ec(n#:1 / 2) + 2;
              }
              const expr0#1e1e9a9e: int = f_specialization#31ad3db0(
                  11,
              ) - f_specialization#1b2fb1f8(42)
        `);
    });
});
