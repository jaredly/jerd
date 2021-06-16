import { foldConstantAssignments } from './foldConstantAssignments';
import { specializeFunctionsCalledWithLambdas } from './monoconstant';
import { combineOpts, midOpt, simpleOpt } from './optimize';
import { runFixture, snapshotSerializer } from './optimizeTestUtils';

expect.addSnapshotSerializer(snapshotSerializer);

describe('specializeFunctionsCalledWithLambdas', () => {
    it('should work', () => {
        expect(
            runFixture(
                `
			const f = (g: () => int) => g() + 2
			f(() => 4) - f(() => 23)
			`,
                combineOpts([
                    midOpt(specializeFunctionsCalledWithLambdas),
                    simpleOpt(foldConstantAssignments),
                ]),
            ),
        ).toMatchInlineSnapshot(`
              const expr0_lambda#0e868bd2 = () => 23
              const expr0_lambda#0a732d10 = () => 4
              const f#6bd04dc4 = () => {
                  const g#:0: () => int#builtin = expr0_lambda#0e868bd2;
                  return +#builtin(g#:0(), 2);
              }
              const f#7e960666 = () => {
                  const g#:0: () => int#builtin = expr0_lambda#0a732d10;
                  return +#builtin(g#:0(), 2);
              }
              const expr0#0846ff16 = -#builtin(
                  f#7e960666(),
                  f#6bd04dc4(),
              )
        `);
    });
});
