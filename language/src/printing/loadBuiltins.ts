// Get the builtins from the typescript folks

import { parseType } from '../parsing/parser';
import { presetEnv } from '../typing/preset';
import { Type } from '../typing/types';
import typeType from '../typing/typeType';
// @ts-ignore
import builtinsRaw from './builtins.ts.txt';

export const loadBuiltins = () => {
    const builtins: { [key: string]: Type | null } = {};
    const lines = builtinsRaw.split('\n');
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
        const theType = parsed ? typeType(presetEnv({}), parsed) : null;
        builtins[name] = theType;
    });
    return builtins;
};
