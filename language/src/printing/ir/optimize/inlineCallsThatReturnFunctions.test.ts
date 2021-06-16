import { inlineCallsThatReturnFunctions } from './inlineCallsThatReturnFunctions';
import { runFixture, snapshotSerializer } from './optimizeTestUtils';

expect.addSnapshotSerializer(snapshotSerializer);

describe('serializer', () => {
    it('should work', () => {
        expect(runFixture(`2 + 3`, (env, expr) => expr)).toMatchInlineSnapshot(
            `  const expr0#23157700: int = +(2, 3)`,
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
              const expr0#7c2fb0d1: string = ((n#:1: string) => (
                  m#:2: string,
              ) => +(m#:2, n#:1))("hi")("ho")
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
              const f#48f8d2f4: (string) => string = (
                  n#:0: string,
              ) => +(n#:0, "hi")
              const expr0#16f60da6: string = f#48f8d2f4("ho")
        `);
    });
});
