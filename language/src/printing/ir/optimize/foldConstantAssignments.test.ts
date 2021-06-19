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
        expect(runFixture(`{const x = 10; x}`, foldConstantAssignments(true)))
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
                    foldConstantAssignments(true),
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

    it('should fold into if and lambda', () => {
        expect(
            runFixture(
                `{
                    const x = 10;
                    if x > 2 {
                        x + 2
                    } else {
                        x - 2
                    }
                }`,
                optimizeRepeatedly([
                    flattenImmediateCalls,
                    foldConstantAssignments(false),
                ]),
            ),
        ).toMatchInlineSnapshot(`
            const expr0#🚚: int = (() => {
                const x#:0: int = 10;
                if x#:0 > 2 {
                    return x#:0 + 2;
                } else {
                    return x#:0 - 2;
                };
            })()
        `);
    });
});
