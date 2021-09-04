import { foldSingleUseAssignments } from './foldSingleUseAssignments';
import { runFixture, snapshotSerializer } from './optimizeTestUtils';

expect.addSnapshotSerializer(snapshotSerializer);

describe('foldSingleUseAssignments', () => {
    it('should work', () => {
        expect(
            runFixture(
                `() => {
                    const variableSize#:2: float = 30.0;
                    const variableSize#:3: float = variableSize#:2;
                    const circleOne#:4: float = 2.0 - 10.0 + variableSize#:3;
                    circleOne#:4;
                }`,
                foldSingleUseAssignments,
            ),
        ).toMatchInlineSnapshot(
            `const expr0#🌝: () => float = (): float => 2 - 10 + 30`,
        );
    });
});
//
