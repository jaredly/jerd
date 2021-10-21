import { loadBuiltins } from '@jerd/language/src/printing/loadBuiltins';
import { loadPrelude } from '@jerd/language/src/printing/loadPrelude';
import { newWithGlobal, Type } from '@jerd/language/src/typing/types';
import rawMusic from './plugins/music/music.jd';
import rawCanvas from './plugins/canvas/canvas.jd';
import { typeFile } from '../../language/src/typing/typeFile';
import { parse } from '../../language/src/parsing/parser';

export const tryParse = (text: string) => {
    try {
        return parse(text);
    } catch (err) {
        // @ts-ignore
        const loc = err.location;
        const lines = text.split('\n');
        throw new Error(
            `Parse error at line ${loc.start.line} (${loc.start.column}): ${
                lines[loc.start.line - 1]
            }`,
        );
    }
};

export function initialEnvWithPlugins() {
    const builtinsMap = loadBuiltins();
    const typedBuiltins: { [key: string]: Type } = {};
    Object.keys(builtinsMap).forEach((b) => {
        const v = builtinsMap[b];
        if (v != null) {
            typedBuiltins[b] = v;
        }
    });
    let env = loadPrelude(typedBuiltins);
    env = typeFile(tryParse(rawMusic), newWithGlobal(env), 'music.jd').env
        .global;
    env = typeFile(tryParse(rawCanvas), newWithGlobal(env), 'canvas.jd').env
        .global;
    return env;
}
