// Migrating stuff

import fs from 'fs';
import { GlobalEnv } from '@jerd/language/src/typing/types';
import {
    ctxToGlobalEnv,
    globalEnvToCtx,
} from '@jerd/language/src/typing-new/migrate';
import { hashObject } from '../../language/src/typing/env';

const [_, __, infile] = process.argv;

const raw = fs.readFileSync(infile, 'utf8');
const data: GlobalEnv = { ...JSON.parse(raw).env.global, rng: () => 0.0 };
const back = ctxToGlobalEnv(globalEnvToCtx(data));
const again = ctxToGlobalEnv(globalEnvToCtx(back));
console.log(hashObject(data), hashObject(back), hashObject(again));
fs.writeFileSync('first.json', JSON.stringify(data), 'utf8');
fs.writeFileSync('second.json', JSON.stringify(back), 'utf8');

const find = <T>(
    a: T,
    b: T,
    path: Array<string>,
    found: Array<[Array<string>, string]>,
) => {
    if (hashObject(a) === hashObject(b)) {
        return;
    }
    if (!a || !b) {
        return found.push([path, `${typeof a} ${typeof b} ${!!a} ${!!b}`]);
    }
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return found.push([
                path,
                `length ${a.length} != ${b.length} ${JSON.stringify(a)}`,
            ]);
        }
        a.forEach((v, i) => {
            find(v, b[i], path.concat([i.toString()]), found);
        });
    } else if (typeof a === 'object' && typeof b === 'object') {
        const ka = Object.keys(a).sort();
        const kb = Object.keys(b).sort();
        if (hashObject(ka) !== hashObject(kb)) {
            return found.push([
                path,
                `keys\n${ka.join(', ')} !==\n${kb.join(', ')}`,
            ]);
        }
        Object.keys(a).forEach((k) => {
            find(a[k], b[k], path.concat([k]), found);
        });
    }
    return found.push([path, `differ I guess ${typeof a} ${typeof b}`]);
};

// oooohk, how do I represent "glsl_builtin"?
// ugh ok for now I'll add back tags

const found: [string[], string][] = [];
find(data, back, [], found);
found.forEach(([path, message]) => {
    console.log(`${path.join(':')}         ===>          ${message}`);
});
