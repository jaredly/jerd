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
                    specializeFunctionsCalledWithLambdas,
                    foldConstantAssignments,
                ]),
            ),
        ).toMatchInlineSnapshot(`
              const expr0_lambda#0e868bd2: () => int = () => 23
              const expr0_lambda#0a732d10: () => int = () => 4
              const f_specialization#6bd04dc4: () => int = () => {
                  const g#:0: () => int = expr0_lambda#0e868bd2;
                  return +(expr0_lambda#0e868bd2(), 2);
              }
              const f_specialization#7e960666: () => int = () => {
                  const g#:0: () => int = expr0_lambda#0a732d10;
                  return +(expr0_lambda#0a732d10(), 2);
              }
              const expr0#0846ff16: int = -(
                  f_specialization#7e960666(),
                  f_specialization#6bd04dc4(),
              )
        `);
    });
});
