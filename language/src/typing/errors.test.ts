import { parse } from '../parsing/grammar';
import { items, printToString } from '../printing/printer';
import { declarationToPretty, termToPretty } from '../printing/printTsLike';
import { getUserDependencies } from './analyze';
import { allTermIdsRaw, idFromName, termForIdRaw } from './env';
import { presetEnv } from './preset';
import { typeFile } from './typeFile';
import { Env, newWithGlobal } from './types';

export const snapshotSerializer: jest.SnapshotSerializerPlugin = {
    test(value) {
        return value && value.env != null && value.inOrder != null;
    },
    print(value, _, indent) {
        const { env, inOrder } = value as {
            env: Env;
            inOrder: Array<string>;
        };
        return inOrder
            .map((id) =>
                printToString(
                    declarationToPretty(
                        env,
                        idFromName(id),
                        termForIdRaw(env, id),
                    ),
                    50,
                ),
            )
            .join('\n\n');
    },
};

export const defaultEnv = presetEnv({});

const runFixture = (text: string) => {
    const initialEnv = newWithGlobal(defaultEnv.global);
    let res;
    try {
        res = typeFile(parse(text), initialEnv, 'test-fixture');
    } catch (err) {
        throw new Error(err.toString());
    }
    const { env, expressions } = res;
    const newTerms: Array<string> = [];
    allTermIdsRaw(env).forEach((t) => {
        if (!initialEnv.global.terms[t]) {
            newTerms.push(t);
        }
    });
    return { env, inOrder: newTerms };
};

expect.addSnapshotSerializer(snapshotSerializer);

describe('without a type error, just normal stuff', () => {
    it('should work', () => {
        const result = runFixture(`const x = 10 + 2`);
        expect(result).toMatchInlineSnapshot(
            `const x#f618209c = 10 +#builtin 2`,
        );
    });
});

describe('with a type error, we should get an error term', () => {
    it('should work', () => {
        expect(
            runFixture(`
			const x = 10
			const y = x + 1.0
		`),
        ).toMatchInlineSnapshot(`
            const x#6e9352f2 = 10

            const y#1ecd45b1 = x#6e9352f2 +#builtin 1.0
        `);
    });
});
