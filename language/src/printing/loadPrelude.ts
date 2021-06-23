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

export type Init = {
    typedBuiltins: { [key: string]: Type };
    initialEnv: GlobalEnv;
    builtinNames: Array<string>;
};

export const loadInit = (): Init => {
    const tsBuiltins = loadBuiltins();
    console.log('loaded builtins');
    const typedBuiltins: { [key: string]: Type } = {};
    Object.keys(tsBuiltins).forEach((b) => {
        const v = tsBuiltins[b];
        if (v != null) {
            typedBuiltins[b] = v;
        }
    });
    const builtinNames = Object.keys(tsBuiltins);
    const initialEnv = loadPrelude(typedBuiltins);
    console.log('loaded prelude');

    return { typedBuiltins, initialEnv, builtinNames };
};
