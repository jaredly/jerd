// Load up prelude definitions

import { parse } from '../parsing/grammar';
import { presetEnv } from '../typing/preset';
import { typeFile } from '../typing/typeFile';
import { GlobalEnv, Type } from '../typing/types';
import { loadBuiltins } from './loadBuiltins';
// @ts-ignore
import preludeRaw from './prelude.jd';
export { preludeRaw };

export const loadPrelude = (
    builtins: { [key: string]: Type },
    raw?: string,
): GlobalEnv => {
    const parsed = parse(raw || preludeRaw);
    return typeFile(parsed, presetEnv(builtins), 'prelude.jd').env.global;
};

export type Init = {
    typedBuiltins: { [key: string]: Type };
    initialEnv: GlobalEnv;
    builtinNames: Array<string>;
};

export const loadInit = (raw?: string): Init => {
    const tsBuiltins = loadBuiltins();
    const typedBuiltins: { [key: string]: Type } = {};
    Object.keys(tsBuiltins).forEach((b) => {
        const v = tsBuiltins[b];
        if (v != null) {
            typedBuiltins[b] = v;
        }
    });
    const builtinNames = Object.keys(tsBuiltins);
    const initialEnv = loadPrelude(typedBuiltins, raw);

    return { typedBuiltins, initialEnv, builtinNames };
};
