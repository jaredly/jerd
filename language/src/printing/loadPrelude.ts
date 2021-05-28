// Load up prelude definitions

import { parse } from '../parsing/grammar';
import { presetEnv } from '../typing/preset';
import { typeFile } from '../typing/typeFile';
import { GlobalEnv, Type } from '../typing/types';
import { loadBuiltins } from './loadBuiltins';
// @ts-ignore
import preludeRaw from './prelude.jd';

export const loadPrelude = (builtins: { [key: string]: Type }): GlobalEnv => {
    // console.log('preludeRaw', preludeRaw.slice(0, 100));
    const parsed = parse(preludeRaw);
    // const typedBuiltins: { [key: string]: Type } = {};
    // const builtins = loadBuiltins();
    // Object.keys(builtins).forEach((k) => {
    //     const t = builtins[k];
    //     if (t != null) {
    //         typedBuiltins[k] = t;
    //     }
    // });
    return typeFile(parsed, presetEnv(builtins), 'prelude.jd').env.global;
};
