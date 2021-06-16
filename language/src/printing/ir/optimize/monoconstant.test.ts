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
              const expr0_lambda#🤱🦙👉: (int) => int = (
                  m#:1: int,
              ) => m#:1 - 23
              const expr0_lambda#🐵🕊️🚝😃: (int) => int = (
                  m#:0: int,
              ) => m#:0 + 4
              const f_specialization#🐱🎿🤼‍♂️: (int) => int = (
                  n#:1: int,
              ) => {
                  return expr0_lambda#🤱🦙👉(n#:1 / 2) + 2;
              }
              const f_specialization#🤸‍♀️🚨🌄: (int) => int = (
                  n#:1: int,
              ) => {
                  return expr0_lambda#🐵🕊️🚝😃(n#:1 / 2) + 2;
              }
              const expr0#🌯🌨️👨‍👧‍👦: int = f_specialization#🤸‍♀️🚨🌄(
                  11,
              ) - f_specialization#🐱🎿🤼‍♂️(42)
        `);
    });
});
