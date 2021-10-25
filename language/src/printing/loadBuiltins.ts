// Get the builtins from the typescript folks

import { parseType } from '../parsing/parser';
import { typeForIdRaw } from '../typing/env';
import { presetEnv } from '../typing/preset';
import { Type } from '../typing/types';
import typeType from '../typing/typeType';
// @ts-ignore
import builtinsRaw from './builtins.ts.txt';
import { Vec2_id, Vec4_id } from './prelude-types';

export const loadBuiltins = () => {
    const builtins: { [key: string]: Type | null } = {};
    const lines = builtinsRaw.split('\n');

    const env = presetEnv({});
    // lying - this is for sampler2d?
    env.global.types[Vec2_id] = {} as any;
    env.global.types[Vec4_id] = {} as any;

    lines.forEach((line: string, i: number) => {
        if (!line.startsWith('export const ')) {
            return;
        }
        const name = line.slice('export const '.length).split('=')[0].trim();
        const c = lines[i - 1];
        const parsed =
            c && c.startsWith('//: ')
                ? parseType(c.slice('//: '.length))
                : null;
        const theType = parsed ? typeType(env, parsed) : null;
        builtins[name] = theType;
    });
    return builtins;
};
