#!/usr/bin/env node
// um what now

// we want to parse things I guess?

import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { hashObject, idFromName, idName } from './typing/env';
import parse, { Toplevel } from './parsing/parser';
import {
    fileToTypescript,
    OutputOptions,
} from './printing/typeScriptPrinterSimple';
import { removeTypescriptTypes } from './printing/typeScriptOptimize';
import typeExpr, { showLocation } from './typing/typeExpr';
import typeType, { newTypeVbl } from './typing/typeType';
import { Env, Term } from './typing/types';
import { ToplevelT } from './typing/env';
import { typeFile } from './typing/typeFile';

import { presetEnv } from './typing/preset';

import * as t from '@babel/types';
import generate from '@babel/generator';

import { execSync, spawnSync } from 'child_process';
import { LocatedError, TypeError } from './typing/errors';
// import { fileToGo } from './printing/goPrinter';
import { getTypeError } from './typing/getTypeError';
import { loadBuiltins } from './printing/loadBuiltins';
import { loadPrelude } from './printing/loadPrelude';
import { OutputOptions as IOutputOptions } from './printing/ir/types';
import { reprintToplevel } from './reprint';
import { writeFile } from './main';
import { fileToGlsl } from './printing/glslPrinter';

// const clone = cloner();

export const processFile = (
    fname: string,
    initialEnv: Env,
    builtinNames: Array<string>,
    assert: boolean,
    run: boolean,
    reprint: boolean,
    glsl: boolean,
    trace: boolean,
): boolean => {
    const raw = fs.readFileSync(fname, 'utf8');
    const parsed: Array<Toplevel> = parse(raw);

    const { expressions, env } = typeFile(parsed, initialEnv, fname);

    if (reprint) {
        const good = checkReprint(raw, expressions, env);
        if (!good) {
            console.log(`❌ Reprint failed for ${chalk.blue(fname)}`);
            return false;
        }
    }

    const irOpts: IOutputOptions = {
        explicitHandlerFns: false,
    };
    const oopts: OutputOptions = {
        optimize: true,
        enableTraces: trace,
        optimizeAggressive: true,
    };

    const buildDir = path.join(path.dirname(fname), 'build');

    if (glsl) {
        const pp = fileToGlsl(
            expressions,
            env,
            { includeCanonicalNames: true },
            irOpts,
            // assert,
            // true,
            // builtinNames,
        );

        const glslDest = path.join(buildDir, path.basename(fname) + '.glsl');
        writeFile(glslDest, pp.text);
        console.log('Wrote glsl to', chalk.green.bold(glslDest));
        if (pp.invalidLocs.length) {
            pp.invalidLocs.forEach((loc) => {
                console.error(
                    `Invalid GLSL (compiler bug) at: ${chalk.blue(
                        `${fname}:${showLocation(loc, true)}`,
                    )}`,
                );
            });
            return false;
        }
        return true;
    }

    const ast = fileToTypescript(
        expressions,
        env,
        oopts,
        irOpts,
        assert,
        true,
        builtinNames,
    );
    let { code: tsCode } = generate(ast, {
        sourceMaps: false,
        sourceFileName: '../' + path.basename(fname),
    });
    // Fixing the weird bug with babel's typescript generation
    tsCode = tsCode.replace(/ as : /g, ' as ');
    const tsDest = path.join(buildDir, path.basename(fname) + '.ts');
    writeFile(tsDest, tsCode);
    removeTypescriptTypes(ast);
    const { code, map } = generate(ast, {
        sourceMaps: true,
        sourceFileName: '../' + path.basename(fname),
    });

    const dest = path.join(buildDir, path.basename(fname) + '.mjs');

    const mapName = path.basename(fname) + '.mjs.map';
    writeFile(path.join(buildDir, mapName), JSON.stringify(map, null, 2));

    // This indirection is so avoid confusing source mapping
    // in the generated main.js of the compiler.
    const m = '# source';
    const text = code + '\n\n//' + m + 'MappingURL=' + mapName;

    writeFile(dest, text);

    const preludeTS = require('fs').readFileSync(
        './src/printing/builtins.ts.txt',
        'utf8',
    );

    execSync(
        `yarn -s esbuild --loader=ts > "${path.join(buildDir, 'prelude.mjs')}"`,
        {
            input: preludeTS,
        },
    );
    writeFile(path.join(buildDir, 'prelude.mjs.ts'), preludeTS);

    if (run) {
        console.log(`🏃 Running ${chalk.yellow(fname)}`);
        const { stdout, error, stderr, status } = spawnSync(
            'node',
            ['--enable-source-maps', dest],
            { stdio: 'pipe', encoding: 'utf8' },
        );
        if (status !== 0) {
            console.log(`❌ Execution failed ${chalk.yellow(fname)}`);
            console.log('---------------');
            console.log(stdout);
            console.log(stderr);
            console.log('---------------');
            return false;
        } else {
            stdout.split('\n').forEach((line) => {
                if (line.startsWith('[trace:')) {
                    console.log(line);
                }
            });
            console.log(`✅ all clear ${chalk.yellow(fname)}`);
            return true;
        }
    }
    return true;
};

const checkReprint = (raw: string, expressions: Array<Term>, env: Env) => {
    let good = true;

    // Test expressions reprint
    for (let expr of expressions) {
        if (
            reprintToplevel(
                env,
                raw,
                {
                    type: 'Expression',
                    term: expr,
                    location: expr.location!,
                },
                hashObject(expr),
            ) === false
        ) {
            good = false;
            break;
        }
    }

    // Test terms reprint
    for (let id of Object.keys(env.global.terms)) {
        const tenv: Env = {
            ...env,
            local: {
                ...env.local,
                self: {
                    type: 'Term',
                    name: env.global.idNames[id],
                    ann: env.global.terms[id].is,
                },
            },
        };
        if (
            reprintToplevel(
                tenv,
                raw,
                {
                    type: 'Define',
                    id: idFromName(id),
                    term: env.global.terms[id],
                    location: env.global.terms[id].location!,
                    name: env.global.idNames[id],
                },
                id,
            ) === false
        ) {
            good = false;
            break;
        }
    }

    // Type declarations
    for (let tid of Object.keys(env.global.types)) {
        const t = env.global.types[tid];
        // ermm fix this hack
        if (tid === 'Some' || tid === 'None' || tid === 'As') {
            continue;
        }
        let top: ToplevelT;
        if (t.type === 'Record') {
            const id = idFromName(tid);
            top = {
                type: 'RecordDef',
                id: id,
                def: t,
                location: t.location!,
                name: env.global.idNames[idName(id)],
                attrNames: env.global.recordGroups[idName(id)],
            };
        } else {
            const id = idFromName(tid);
            top = {
                type: 'EnumDef',
                id,
                def: t,
                location: t.location!,
                name: env.global.idNames[idName(id)],
            };
        }
        if (reprintToplevel(env, raw, top, tid) === false) {
            good = false;
            break;
        }
    }

    return good;
};
