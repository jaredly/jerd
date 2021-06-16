import { inlineCallsThatReturnFunctions } from './inlineCallsThatReturnFunctions';
import { runFixture, snapshotSerializer } from './optimizeTestUtils';

expect.addSnapshotSerializer(snapshotSerializer);

describe('serializer', () => {
    it('should work', () => {
        expect(runFixture(`2 + 3`, (env, expr) => expr)).toMatchInlineSnapshot(
            `  const expr0#🏣🧛‍♂️🕊️: int = 2 + 3`,
        );
    });
});

describe('inlineCallsThatReturnFunctions', () => {
    it('should inline a function call.', () => {
        expect(
            runFixture(
                `
		const f = (n: string) => (m: string) => m + n
		f("hi")("ho")
		`,
                inlineCallsThatReturnFunctions,
            ),
        ).toMatchInlineSnapshot(`
              const expr0#👨‍🦲🎿🎋😃: string = ((n#:1: string) => {
                  return (m#:2: string) => {
                      return m#:2 + n#:1;
                  };
              })("hi")("ho")
        `);
    });

    it('should not inline a function call that doesnt return a function.', () => {
        expect(
            runFixture(
                `
		const f = (n: string) => n + "hi"
		f("ho")
		`,
                inlineCallsThatReturnFunctions,
            ),
        ).toMatchInlineSnapshot(`
              const f#🏜️🦢💣😃: (string) => string = (
                  n#:0: string,
              ) => {
                  return n#:0 + "hi";
              }
              const expr0#🏋️‍♂️🏃💇‍♂️: string = f#🏜️🦢💣😃(
                  "ho",
              )
        `);
    });
});
