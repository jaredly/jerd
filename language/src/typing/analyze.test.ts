import { parse } from '../parsing/grammar';
import { getSortedTermDependencies, getUserDependencies } from './analyze';
import { hashObject, idFromName, idName, withoutLocations } from './env';
import { presetEnv } from './preset';
import { typeFile } from './typeFile';
import { newWithGlobal } from './types';

const init = presetEnv({});

const testDependencies = (text: string, deps: Array<string>) => {
    const initialEnv = newWithGlobal(init.global);
    const { env, expressions } = typeFile(parse(text), initialEnv, 'test');
    const hash = hashObject(expressions[0]);
    const actualDeps = getSortedTermDependencies(
        env,
        expressions[0],
        idFromName(hash),
    );
    expect(actualDeps).toEqual(
        deps.map((d) => idName(env.global.names[d][0])).concat([hash]),
    );
};

it(`hash should be right TRUCK`, () => {
    const initialEnv = newWithGlobal(init.global);
    const { env, expressions } = typeFile(
        parse(
            `
        @ffi
        type Vec2 = {
            x: float,
            y: float
        }

        @ffi
        type Vec3 = {
            ...Vec2,
            z: float
        }

        @ffi
        type Vec4 = {
            ...Vec3,
            w: float,
        }
    `,
        ),
        initialEnv,
        'test',
    );

    expect(env.global.typeNames['Vec4']).toEqual([idFromName('38dc9122')]);
    // writeFileSync(
    //     '/Users/jared/tmp/old.json',
    //     JSON.stringify(
    //         withoutLocations(
    //             env.global.types[idName(env.global.typeNames['Vec2'][0])],
    //         ),
    //     ),
    // );
    // console.log(env.global.types[idName(env.global.typeNames['Vec2'][0])]);
    // fail;
});

describe('getUserDependencies', () => {
    it('should work', () => {
        testDependencies(
            `const a = 2
			const b = 2 + a
			b * 2`,
            ['a', 'b'],
        );
    });

    it('should work with multiple deps', () => {
        testDependencies(
            `const a = 2
			const b = 2 + a
			const c = a + a
			b * 2 + c`,
            ['a', 'c', 'b'],
        );
    });

    it('should work with recursive', () => {
        testDependencies(
            `const rec a = (): int => a()
			const b = 2 + a()
			b * 2`,
            ['a', 'b'],
        );
    });

    it('should work with recursive again', () => {
        testDependencies(
            `const rec tailMe = (max: int, collect: int): int => {
				tailMe(max - 1, collect + 10)
			}

			tailMe(20, 0)
			`,
            ['tailMe'],
        );
    });
});
