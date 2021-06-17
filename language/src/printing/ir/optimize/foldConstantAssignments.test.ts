import {
    flattenImmediateAssigns,
    flattenImmediateCalls,
} from './flattenImmediateCalls';
import { foldConstantAssignments } from './foldConstantAssignments';
import { foldSingleUseAssignments } from './foldSingleUseAssignments';
import {
    combineOpts,
    optimizeRepeatedly,
    removeUnusedVariables,
} from './optimize';
import { runFixture, snapshotSerializer } from './optimizeTestUtils';

expect.addSnapshotSerializer(snapshotSerializer);

describe('flattenImmediateCalls', () => {
    it('should work', () => {
        expect(runFixture(`{const x = 10; x}`, foldConstantAssignments))
            .toMatchInlineSnapshot(`
              const expr0#🐮👩‍🦰👶: int = (() => {
                  const x#:0: int = 10;
                  return 10;
              })()
        `);
    });

    it('should handle ifs', () => {
        expect(
            runFixture(
                `if true {
					const x = 12;
					const y = 2;
					(if x > 1 { 3 } else { y }) + 2
				} else {
					const y = 10;
					y + 1
				}`,
                combineOpts([
                    foldConstantAssignments,
                    flattenImmediateCalls,
                    removeUnusedVariables,
                ]),
            ),
        ).toMatchInlineSnapshot(`
              const expr0#👩‍🎨👩‍👩‍👧‍👦👨‍🦯😃: int = (() => {
                  if true {
                      return (() => {
                          if 12 > 1 {
                              return 3;
                          } else {
                              return 2;
                          };
                      })() + 2;
                  } else {
                      return 10 + 1;
                  };
              })()
        `);
    });
});
