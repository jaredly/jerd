import { getLambdaError, getTypeError } from './getTypeError';
import { pureFunction } from './preset';
import { arrayType } from './typeExpr';
import { nullLocation, Symbol, Type, typesEqual } from './types';

describe(`typesEqual`, () => {
    it(`should handle different sym'd type variables`, () => {
        const a: Symbol = { unique: 0, name: 'T' };
        const ta: Type = { type: 'var', sym: a, location: nullLocation };
        const b: Symbol = { unique: 1, name: 'T' };
        const tb: Type = { type: 'var', sym: b, location: nullLocation };
        // const inner: Type = {type: 'ref', ref: {type: 'user', }}
        const aa = pureFunction([ta, arrayType(ta), arrayType(ta)], ta, [
            { sym: a, location: nullLocation, subTypes: [] },
        ]);
        const bb = pureFunction([tb, arrayType(tb), arrayType(tb)], tb, [
            { sym: b, location: nullLocation, subTypes: [] },
        ]);
        const errs = getLambdaError(null, aa, bb, nullLocation);
        expect(errs).toBeNull();
    });
});
