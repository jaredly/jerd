#!/usr/bin/env node
// um what now

// we want to parse things I guess?

import fs from 'fs';
import path from 'path';
import { mainGo } from './cli/go';
import { main } from './cli/run';
import { testInference } from './cli/testInference';
import { generateTypescriptTypes } from './cli/generateTypescriptTypes';
import parse, { Toplevel } from './parsing/parser';
import { loadBuiltins } from './printing/loadBuiltins';
import { loadInit } from './printing/loadPrelude';
import { printToString } from './printing/printer';
import { termToPretty } from './printing/printTsLike';
import { typeFile } from './typing/typeFile';
import { newWithGlobal, Type } from './typing/types';
import { generateGoTypes } from './cli/generateGoTypes';

/**
 * Writes file, creating diretory path if it does not exist.
 */
export const writeFile = (filePath: string, content: string) => {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
};

const runTests = () => {
    const raw = fs.readFileSync('examples/inference-tests.jd', 'utf8');
    const parsed: Array<Toplevel> = parse(raw);
    const tsBuiltins = loadBuiltins();
    const typedBuiltins: { [key: string]: Type } = {};
    Object.keys(tsBuiltins).forEach((b) => {
        const v = tsBuiltins[b];
        if (v != null) {
            typedBuiltins[b] = v;
        }
    });
    testInference(parsed, typedBuiltins);
};

const expandDirectories = (fnames: Array<string>) => {
    const result: Array<string> = [];
    fnames.forEach((fname) => {
        if (fs.statSync(fname).isDirectory()) {
            fs.readdirSync(fname).forEach((name) => {
                if (name.endsWith('.jd')) {
                    result.push(path.join(fname, name));
                }
            });
        } else {
            result.push(fname);
        }
    });
    return result;
};

const watchFiles = (files: Array<string>, fn: () => void) => {
    if (files.length > 1) {
        console.log(files);
        throw new Error('only one file yet');
    }
    fs.watchFile(files[0], (curr, prev) => {
        if (curr.mtimeMs > prev.mtimeMs) {
            fn();
        }
    });
    fn();
};

const commands: { [key: string]: (args: Array<string>) => void } = {
    go: (args) => {
        console.log('go please');
        const fnames = args.filter((name) => !name.startsWith('-'));
        const assert = args.includes('--assert');
        const run = args.includes('--run');
        mainGo(expandDirectories(fnames), assert, run);
    },
    watch: (args) => {
        // This is just for recompiling something
        const fnames = args.filter((name) => !name.startsWith('-'));
        const assert = args.includes('--assert');
        const run = args.includes('--run');
        const cache = args.includes('--cache') && !args.includes('--no-cache');
        const failFast = args.includes('--fail-fast');
        const glsl = args.includes('--glsl');
        const trace = args.includes('--trace');

        const init = loadInit();
        watchFiles(fnames, () => {
            try {
                const failed = main(
                    expandDirectories(fnames),
                    {
                        assert,
                        run,
                        cache,
                        failFast,
                        glsl,
                        trace,
                    },
                    init,
                );
                if (failed) {
                    console.log('Failed');
                }
            } catch (err) {
                console.error(err);
            }
        });
    },
    '--test': () => runTests(),
    pretty: (args) => {
        const fnames = args.filter((name) => !name.startsWith('-'));
        const init = loadInit();
        const initialEnv = newWithGlobal(init.initialEnv);
        fnames.forEach((fname) => {
            const raw = fs.readFileSync(fname, 'utf8');
            const parsed: Array<Toplevel> = parse(raw);

            const { expressions, env } = typeFile(parsed, initialEnv, fname);
            expressions.forEach((term) => {
                const text = printToString(termToPretty(env, term), 50);
                console.log(text);
            });
            console.log('ok');
        });
    },

    'go-types': (args) => {
        const input = args[0];
        const output = args[1];
        generateGoTypes(input, output);
    },

    'prelude-types': (args) => {
        const output = args[0];
        const input = args[1];
        generateTypescriptTypes(input, output);
    },

    [':fallback:']: (args) => {
        const fnames = args.filter((name) => !name.startsWith('-'));
        const assert = args.includes('--assert');
        const run = args.includes('--run');
        const cache = args.includes('--cache') && !args.includes('--no-cache');
        const failFast = args.includes('--fail-fast');
        const glsl = args.includes('--glsl');
        const trace = args.includes('--trace');
        try {
            const failed = main(
                expandDirectories(fnames),
                {
                    assert,
                    run,
                    cache,
                    failFast,
                    glsl,
                    trace,
                },
                loadInit(),
            );
            if (failed) {
                process.exit(1);
            }
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    },
};

const command = process.argv[2];
if (commands[command]) {
    commands[command](process.argv.slice(3));
} else {
    commands[':fallback:'](process.argv.slice(2));
}
