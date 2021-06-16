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
              const expr0_lambda#🧱⛰️🦙😃: (int) => int = (
                  m#:1: int,
              ) => m#:1 - 23

              const expr0_lambda#🎎🌫️🐺😃: (int) => int = (
                  m#:0: int,
              ) => m#:0 + 4

              const f_specialization#🧿⛅👨‍✈️: (int) => int = (
                  n#:1: int,
              ) => expr0_lambda#🧱⛰️🦙😃(n#:1 / 2) + 2

              const f_specialization#😟🕦🌠😃: (int) => int = (
                  n#:1: int,
              ) => expr0_lambda#🎎🌫️🐺😃(n#:1 / 2) + 2

              const expr0#🌯🌨️👨‍👧‍👦: int = f_specialization#😟🕦🌠😃(
                  11,
              ) - f_specialization#🧿⛅👨‍✈️(42)
        `);
    });

    it('should work base case', () =>
        expect(
            runFixture(
                `const f = (g: (int) => int) => g(1) + 2
			
				f((n: int) => n + 1)`,
                specializeFunctionsCalledWithLambdas,
            ),
        ).toMatchInlineSnapshot(`
              const expr0_lambda#🏕️🤬⛈️😃: (int) => int = (
                  n#:0: int,
              ) => n#:0 + 1

              const f_specialization#👨‍👩‍👧: () => int = () => {
                  const g#:0: (int) => int = expr0_lambda#🏕️🤬⛈️😃;
                  return g#:0(1) + 2;
              }

              const expr0#⛷️👨‍👧‍👧👵😃: int = f_specialization#👨‍👩‍👧()
        `));

    it('should not inline when scope variables are in play', () => {
        const result = runFixture(
            `const f = (g: (int) => int) => g(1) + 2
			{
				const v = 10;
				f((n: int) => n + v)
			}`,
            specializeFunctionsCalledWithLambdas,
        );
        expect(result).toMatchInlineSnapshot(`
              const f#😪: ((int) => int) => int = (
                  g#:0: (int) => int,
              ) => g#:0(1) + 2

              const expr0#🐾🧏🎎: int = (() => {
                  const v#:0: int = 10;
                  return f#😪((n#:1: int) => n#:1 + v#:0);
              })()
        `);
    });

    it('should work pass through', () => {
        const result = runFixture(
            `const f = (g: (int) => int) => g(1) + 2
			const m = (g: (int) => int) => g(3) + 4 + f(g)
		
			m((n: int) => n + 5)`,
            optimizeRepeatedly([
                specializeFunctionsCalledWithLambdas,
                foldConstantAssignments,
                removeUnusedVariables,
            ]),
        );
        expect(result).toMatchInlineSnapshot(`
              const expr0_lambda#🌄😌👾😃: (int) => int = (
                  n#:0: int,
              ) => n#:0 + 5

              const f_specialization#🌞🍀🎄😃: () => int = () => expr0_lambda#🌄😌👾😃(
                  1,
              ) + 2

              const m_specialization#🚠🏗️🕋😃: () => int = () => expr0_lambda#🌄😌👾😃(
                  3,
              ) + 4 + f_specialization#🌞🍀🎄😃()

              const expr0#🐲: int = m_specialization#🚠🏗️🕋😃()
        `);
        expectValidGlsl(result);
    });
});
