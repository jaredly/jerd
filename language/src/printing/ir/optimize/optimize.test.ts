import { hasInvalidGLSL } from '../../glslPrinter';
import {
    flattenImmediateAssigns,
    flattenImmediateCalls,
} from './flattenImmediateCalls';
import { foldConstantAssignments } from './foldConstantAssignments';
import { foldSingleUseAssignments } from './foldSingleUseAssignments';
import { inlineCallsThatReturnFunctions } from './inlineCallsThatReturnFunctions';
import { specializeFunctionsCalledWithLambdas } from './monoconstant';
import {
    combineOpts,
    optimizeRepeatedly,
    removeUnusedVariables,
} from './optimize';
import { runFixture, snapshotSerializer } from './optimizeTestUtils';

expect.addSnapshotSerializer(snapshotSerializer);

describe('removeUnusedVariable', () => {
    it('should work', () => {
        expect(
            runFixture(
                `{
                    const x = 10;
                    const y = 5;
                    y + 2
                }`,
                removeUnusedVariables,
            ),
        ).toMatchInlineSnapshot(`
              const expr0#🤓🕵️‍♀️🥬: int = (() => {
                  const y#:1: int = 5;
                  return y#:1 + 2;
              })()
        `);
    });

    it('should work', () => {
        expect(
            runFixture(
                `{
                    const x = 10;
                    const y = 11;
                    (y: int) => {
                        const z = x;
                        x + 2 + y
                    }
                }`,
                removeUnusedVariables,
            ),
        ).toMatchInlineSnapshot(`
              const expr0#🦅👀🏄: (int) => int = (() => {
                  const x#:0: int = 10;
                  return (y#:2: int) => x#:0 + 2 + y#:2;
              })()
        `);
    });

    // TODO figure out how to test an ineffectual assignment...
    // where something is Defined, and then /updated/, but never
    // accessed...
});

describe('glsl in concert', () => {
    it('should work', () => {
        const result = runFixture(
            `
            const estimateNormal = (sceneSDF: (int) ={}> float): float ={}> sceneSDF(1)
            
            const callIt = (
                sceneSDF: (int) ={}> float,
                eye: int,
            ): float ={}> {
                sceneSDF(eye);
            }
            
            const marchNormals = (sceneSDF: (int) ={}> float) ={}> (coord: float) ={}> {
                const dist = callIt(sceneSDF, 1000);
                estimateNormal(sceneSDF) + dist
            }
            
            const superSample = (sdf: (float) ={}> float) ={}> (coord: float) ={}> {
                sdf(coord)
            }
            
            superSample(
                sdf: marchNormals(
                    sceneSDF: (pos: int): float ={}> 23.0
                ),
            )
            `,
            optimizeRepeatedly(
                combineOpts([
                    specializeFunctionsCalledWithLambdas,
                    inlineCallsThatReturnFunctions,
                    flattenImmediateCalls,
                    foldConstantAssignments,
                    foldSingleUseAssignments,
                    flattenImmediateAssigns,
                    removeUnusedVariables,
                ]),
            ),
        );

        /*
        hrmmmmm

        const getIt = (v: number) => if v > 10 {
            () => 20
        } else {
            () => 30
        }

        const m = getIt(10);
        m(32) + 10


        sooo the solution here,
        is to
        backwards inline?

        like treat it as though it was

        getIt(10, v => v(32) + 10)

        oh we can make all kinds of things tail calls now? maybe?

        but yeah we want to CPS that all up.
        */

        expect(result).toMatchInlineSnapshot(`
              const expr0_lambda#🧜‍♂️🥂🏜️: (int) => float = (
                  pos#:0: int,
              ) => 23
              
              const estimateNormal_specialization#🤷‍♂️🥜😭: () => float = () => expr0_lambda#🧜‍♂️🥂🏜️(
                  1,
              )
              
              const callIt_specialization#🖤🐐🏨: (int) => float = (
                  eye#:1: int,
              ) => expr0_lambda#🧜‍♂️🥂🏜️(eye#:1)
              
              const expr0#🧃💆‍♀️😋: (float) => float = (
                  coord#:2: float,
              ) => estimateNormal_specialization#🤷‍♂️🥜😭() + callIt_specialization#🖤🐐🏨(
                  1000,
              )
        `);

        result.inOrder.forEach((id) => {
            expect(hasInvalidGLSL(result.irTerms[id].expr)).toBeFalsy();
        });
    });
});
