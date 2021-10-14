// Migrating stuff

import fs from 'fs';
import {
    Env,
    GlobalEnv,
    Id,
    idsEqual,
    newWithGlobal,
    Type,
} from '@jerd/language/src/typing/types';
import {
    convertMetaBack,
    ctxToGlobalEnv,
    globalEnvToCtx,
} from '@jerd/language/src/typing-new/migrate';
import {
    ctxToSyntax,
    stripMetaDecorators,
} from '@jerd/language/src/typing-new/serde';
import {
    addToplevelToEnv,
    hashObject,
    idFromName,
    idName,
    typeToplevelT,
} from '../../language/src/typing/env';
import { State } from '@jerd/web/src/State';
import { presetEnv } from '@jerd/language/src/typing/preset';
import { loadBuiltins } from '@jerd/language/src/printing/loadBuiltins';
import { parse, Toplevel } from '@jerd/language/src/parsing/parser';
import { typeFile } from '@jerd/language/src/typing/typeFile';
import { addLocationIndices } from '@jerd/language/src/typing/analyze';

const [_, __, cmd, infile, outfile] = process.argv;

const printEnv = (env: GlobalEnv) => {
    const ctx = globalEnvToCtx(env);
    return ctxToSyntax(ctx);
};

const thereAndBackAgain = (data: GlobalEnv) => {
    const back = ctxToGlobalEnv(globalEnvToCtx(data));
    const again = ctxToGlobalEnv(globalEnvToCtx(back));
    console.log(hashObject(data), hashObject(back), hashObject(again));
    // fs.writeFileSync('first.json', JSON.stringify(data), 'utf8');
    // fs.writeFileSync('second.json', JSON.stringify(back), 'utf8');

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
                find((a as any)[k], (b as any)[k], path.concat([k]), found);
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
};

if (cmd === 'json-to-jd') {
    const raw = JSON.parse(fs.readFileSync(infile, 'utf8'));
    const data: GlobalEnv = { ...raw.env.global, rng: () => 0.0 };

    fs.writeFileSync(outfile, printEnv(data));
}

const specifiedToplevelId = (top: Toplevel): Id | null => {
    switch (top.type) {
        case 'define':
        case 'StructDef':
        case 'EnumDef':
        case 'DecoratorDef':
        case 'effect':
            return top.id.hash ? idFromName(top.id.hash.slice(1)) : null;
    }
    return null;
};

if (cmd === 'jd-to-json') {
    const tsBuiltins = loadBuiltins();
    const typedBuiltins: { [key: string]: Type } = {};
    Object.keys(tsBuiltins).forEach((b) => {
        const v = tsBuiltins[b];
        if (v != null) {
            typedBuiltins[b] = v;
        }
    });

    let env = presetEnv(typedBuiltins);

    const raw = fs.readFileSync(infile, 'utf8');
    const parsed: Array<Toplevel> = parse(raw);

    parsed.forEach((top) => {
        const { meta, inner } = stripMetaDecorators(top);
        let toplevel = addLocationIndices(
            typeToplevelT(newWithGlobal(env.global), inner, null),
        );
        const res = addToplevelToEnv(env, toplevel);
        env = res.env;
        if (meta != null) {
            env.global.metaData[idName(res.id)] = convertMetaBack(meta);
        }
        const specified = specifiedToplevelId(inner);
        if (specified && !idsEqual(res.id, specified)) {
            console.log(`Different`, idName(specified), idName(toplevel.id));
        }
    });

    // const { expressions, env } = typeFile(parsed, initialEnv, infile);
    console.log('Hash of parsed global', hashObject(env.global));
    fs.writeFileSync(outfile, JSON.stringify(env, null, 2));
}

if (cmd === 'json-check') {
    const raw = JSON.parse(fs.readFileSync(infile, 'utf8'));
    const data: GlobalEnv = { ...raw.env.global, rng: () => 0.0 };
    thereAndBackAgain(data);
}
