import { runFixture, snapshotSerializer } from './optimizeTestUtils';
import {
    expectDefinedNames,
    removeUnusedVariables,
} from './removeUnusedVariables';

expect.addSnapshotSerializer(snapshotSerializer);

describe('removeUnusedVariables', () => {
    it('should work', () => {
        const result = runFixture(
            `{
				const x = 10;
				const y = 2;
				x
			}`,
            removeUnusedVariables,
        );
        expect(result).toMatchInlineSnapshot(`
            const expr0#🥘: int = (() => {
                const x#:0: int = 10;
                return x#:0;
            })()
        `);
        const expr = result.irTerms[result.inOrder[0]].expr;
        expectDefinedNames(expr, ['x'], ['y']);
    });

    it('should work in various nested places', () => {
        const result = runFixture(
            `{
				const x = 10;
				const y = 2;
				const z = 1;
				const m = () => {
					const n = 2;
					23 + z
				};
				if true {
					x + m()
				} else {
					23
				}
			}`,
            removeUnusedVariables,
        );
        expect(result).toMatchInlineSnapshot(`
            const expr0#👏🍬💆‍♀️: int = (() => {
                const x#:0: int = 10;
                const z#:2: int = 1;
                const m#:4: () => int = () => 23 + z#:2;
                return (() => {
                    if true {
                        return (() => x#:0 + m#:4())();
                    } else {
                        return (() => 23)();
                    };
                })();
            })()
        `);
        const expr = result.irTerms[result.inOrder[0]].expr;
        expectDefinedNames(expr, ['x', 'z', 'm'], ['y', 'n']);
    });
});
