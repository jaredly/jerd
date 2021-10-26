import { int, presetEnv } from './preset';
import { subtTypeVars } from './typeExpr';
import { nullLocation, Symbol } from './types';

const s = (unique: number): Symbol => ({ name: 's', unique });
const location = nullLocation;
describe(`subtTypeVars`, () => {
    it(`ok`, () => {
        expect(
            subtTypeVars(
                { type: 'var', location, sym: s(5) },
                {
                    [5]: int,
                },
                undefined,
            ),
        ).toEqual(int);
        // yes
    });
});
