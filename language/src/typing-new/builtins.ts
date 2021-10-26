import { loadBuiltins } from '../printing/loadBuiltins';
import { bool, float, int, pureFunction, string } from '../typing/preset';
import { Type } from '../typing/types';
import { Builtins } from './Context';
import { Library } from './Library';

const same = (t: Type): { left: Type; right: Type; output: Type } => ({
    left: t,
    right: t,
    output: t,
});
const numeric = [same(int), same(float)];

const cmp = (t: Type): { left: Type; right: Type; output: Type } => ({
    left: t,
    right: t,
    output: bool,
});

export const defaultBuiltins = (): Builtins => {
    const builtins: Builtins = {
        decorators: {},
        ops: {
            binary: {
                '++': [same(string)],
                '==': [...numeric, same(string)],
                '+': [...numeric, same(string)],
                '&&': [same(bool)],
                '||': [same(bool)],
            },
            unary: {
                '-': [
                    { input: int, output: int },
                    { input: float, output: float },
                ],
            },
        },
        terms: {},
        types: {
            Array: 1,
            unit: 0,
            void: 0,
            int: 0,
            float: 0,
            bool: 0,
            string: 0,
            sampler2D: 0,
        },
    };
    '- * / ^'.split(' ').forEach((n) => (builtins.ops.binary[n] = numeric));
    '>= <= > <'
        .split(' ')
        .forEach((n) => (builtins.ops.binary[n] = [cmp(int), cmp(float)]));
    const terms = loadBuiltins();
    Object.keys(terms).forEach((k) => {
        const type = terms[k];
        if (type != null) {
            builtins.terms[k] = type;
        }
    });

    return builtins;
};
