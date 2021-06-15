import { inlineCallsThatReturnFunctions } from './inlineCallsThatReturnFunctions';
import { runFixture, snapshotSerializer } from './optimizeTestUtils';

expect.addSnapshotSerializer(snapshotSerializer);

describe('inlineCallsThatReturnFunctions', () => {
    it('should work', () => {
        expect(runFixture(`2 + 3`, inlineCallsThatReturnFunctions))
            .toMatchInlineSnapshot(`
              // 23157700
              +#builtin(2, 3)
        `);
    });

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
              // 7c2fb0d1
              ((n#:1: string#builtin) => (m#:2: string#builtin) => +#builtin(
                  m#:2,
                  n#:1,
              ))("hi")("ho")
        `);
    });
});
