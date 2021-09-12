import { flattenImmediateCalls2 } from './flattenImmediateCalls2';
import { foldConstantAssignments } from './foldConstantAssignments';
import { foldSingleUseAssignments } from './foldSingleUseAssignments';
import { optimizeRepeatedly } from './optimize';
import {
    expectValidGlsl,
    runFixture,
    snapshotSerializer,
} from './optimizeTestUtils';
import { removeUnusedVariables } from './removeUnusedVariables';
import { spreadLoopToAppend } from './spreadLoopToAppend';
import { optimizeTailCalls, tailCallRecursion } from './tailCall';

expect.addSnapshotSerializer(snapshotSerializer);

describe('tailCall', () => {
    it('should work', () => {
        const result = runFixture(
            `
            const rec tailMe = (num: int, collect: Array<int>): Array<int> => {
				if num <= 0 {
					collect
				} else {
					tailMe(num - 1, [...collect, num])
				}
			}

			tailMe(20, <int>[])

			tailMe(1, <int>[])
			`,
            optimizeRepeatedly([
                flattenImmediateCalls2,
                // // specializeFunctionsCalledWithLambdas,
                // // // These are needed for cleanup
                foldConstantAssignments(true),
                foldSingleUseAssignments,
                optimizeTailCalls,
                spreadLoopToAppend,
                // removeUnusedVariables,
            ]),
        );
        expect(result).toMatchInlineSnapshot(`
const tailMe#🦽🖐️🕕😃: (int, Array<int>) => Array<int> = (
    num#:0: int,
    collect#:1: Array<int>,
): Array<int> => {
    const collect#:4: Array<int> = *arrayCopy*(collect#:1);
    for (; num#:0 > 0; num#:0 = num#:0 - 1) {
        const recur#:2: int = num#:0 - 1;
        collect#:4.*push*(num#:0);
        continue;
    };
    return collect#:4;
}

const expr1#🤗: Array<int> = tailMe#🦽🖐️🕕😃(
    1,
    [],
)

const expr0#🍔👨‍🦽👫😃: Array<int> = tailMe#🦽🖐️🕕😃(
    20,
    [],
)
`);
        // expectValidGlsl(result);
    });
});
