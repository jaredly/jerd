#!/usr/bin/env node
// um what now

// we want to parse things I guess?

import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { hashObject, idName, typeDecoratorDef } from './typing/env';
import parse, { Toplevel } from './parsing/parser';
import typeExpr, { showLocation } from './typing/typeExpr';
import typeType, { newTypeVbl } from './typing/typeType';
import {
    Env,
    GlobalEnv,
    Id,
    newWithGlobal,
    Self,
    Type,
    TypeConstraint,
    typesEqual,
    TypeError as TypeErrorTerm,
} from './typing/types';
import { printToString } from './printing/printer';
import { termToPretty, typeToPretty } from './printing/printTsLike';
import {
    typeDefine,
    typeTypeDefn,
    typeEnumDefn,
    typeEffect,
} from './typing/env';
import { typeFile } from './typing/typeFile';

import { presetEnv } from './typing/preset';

// const clone = cloner();

// ok gonna do some pegjs I think for parsin

// --------- PEG Parser Types -----------

// ummmmmmmmm
// ok, so where is the ast? and where is the typed tree? and such?
// so there's the parse tree, which we immediately turn into a typed tree, right?
// in the web UI, it would be constructed interactively
// but here
// its like
// what
// some inference necessary
// and just like guessing?
// -----

/*

What's the process here?
we've got a Typed Tree that we're constructing.
In the IDE it'll be an interactive experience where you're constructing the typed tree directly.

but, when working with text file representation,
we first do a parse tree
and then a typed tree
and thats ok






*/

// herm being able to fmap over these automagically would be super nice

// const walk = (t: Expression, visitor) => {
//     switch (t.type) {
//         case 'text':
//             visitor.type(t);
//             return;
//         case 'int':
//             visitor.int(t);
//             return;
//         case 'id':
//             visitor.id(t);
//             return;
//         case 'apply':
//             visitor.apply(t);
//             t.terms.forEach((t) => walk(t, visitor));
//             return;
//     }
// };
// const rmloc = (t: any) => (t.location = null);
// const locationRemover = { type: rmloc, int: rmloc, id: rmloc, apply: rmloc };
// const hashDefine = (d: Define) => {
//     const res = clone(d);
//     walk(res.id, locationRemover);
//     walk(res.exp, locationRemover);
//     res.location = null;
//     return hash(res);
// };

const testInference = (
    parsed: Toplevel[],
    builtins: { [key: string]: Type },
) => {
    const env = presetEnv(builtins);
    for (const item of parsed) {
        if (item.type === 'define') {
            const tmpTypeVbls: { [key: string]: Array<TypeConstraint> } = {};
            const subEnv: Env = {
                ...env,
                local: { ...env.local, tmpTypeVbls },
            };
            // TODO only do it
            const self: Self = {
                type: 'Term',
                name: item.id.text,
                ann: newTypeVbl(subEnv),
                // type: item.ann ? typeType(env, item.ann) : newTypeVbl(subEnv),
            };
            subEnv.local.self = self;
            const term = typeExpr(subEnv, item.expr);
            const err = getTypeError(subEnv, term.is, self.ann, item.location);
            if (err != null) {
                throw new TypeError(
                    `Term's type doesn't match annotation`,
                ).wrap(err);
            }
            // So for self-recursive things, the final
            // thing should be exactly the same, not just
            // larger or smaller, right?
            // const unified = unifyVariables(env, tmpTypeVbls);
            // if (Object.keys(unified).length) {
            //     unifyInTerm(unified, term);
            // }
            const hash: string = hashObject(term);
            const id: Id = { hash: hash, size: 1, pos: 0 };
            env.global.names[item.id.text] = [id];
            env.global.idNames[idName(id)] = item.id.text;
            env.global.terms[hash] = term;

            const declared = typeType(env, item.ann);
            if (!typesEqual(declared, term.is)) {
                console.log(`Inference Test failed!`);
                console.log('Expected:');
                console.log(printToString(typeToPretty(env, declared), 100));
                console.log('Inferred:');
                console.log(printToString(typeToPretty(env, term.is), 100));
            } else {
                console.log('Passed!');
                console.log(printToString(typeToPretty(env, declared), 100));
                console.log(printToString(typeToPretty(env, term.is), 100));
            }
        }
    }
};

const processErrors = (fname: string, builtins: { [key: string]: Type }) => {
    const raw = fs.readFileSync(fname, 'utf8');
    const parsed: Array<Toplevel> = parse(raw);
    let env = presetEnv(builtins);
    const errors: Array<string> = [];
    parsed.forEach((item, i) => {
        if (item.type === 'effect') {
            env = typeEffect(env, item);
        } else if (item.type === 'define') {
            env = typeDefine(env, item).env;
        } else if (item.type === 'StructDef') {
            env = typeTypeDefn(env, item);
        } else if (item.type === 'EnumDef') {
            env = typeEnumDefn(env, item).env;
        } else if (item.type === 'DecoratorDef') {
            env = typeDecoratorDef(env, item).env;
        } else if (item.type === 'Decorated') {
            throw new Error(`Unexpected decorator`);
        } else {
            let term;
            try {
                term = typeExpr(env, item);
            } catch (err) {
                if (err instanceof Error) {
                    errors.push(err.message);
                }
                return; // yup
            }
            const typeErrors: Array<TypeErrorTerm> = [];
            transform(term, {
                let: () => null,
                term: (term) => {
                    if (term.type === 'TypeError') {
                        typeErrors.push(term);
                    }
                    return null;
                },
            });
            if (typeErrors.length) {
                errors.push(
                    `expected ${showType(
                        env,
                        typeErrors[0].is,
                    )}, found ${showType(env, typeErrors[0].inner.is)}`,
                );
                return;
            }
            console.log(item);
            throw new LocatedError(
                item.location,
                `Expected a type error at ${showLocation(
                    item.location,
                )} : ${printToString(termToPretty(env, term), 100)}`,
            );
        }
    });

    const buildDir = path.join(path.dirname(fname), 'build');
    const dest = path.join(buildDir, path.basename(fname) + '.txt');
    writeFile(dest, errors.join('\n\n'));
};

/**
 * Writes file, creating diretory path if it does not exist.
 */
export const writeFile = (filePath: string, content: string) => {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
};

const cacheFile = '.test-cache';

const loadCache = (files: Array<string>, self: string) => {
    if (fs.existsSync(cacheFile)) {
        const mtimes = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
        const successRerun =
            !mtimes[self] || fs.statSync(self).mtimeMs > mtimes[self];
        // If self was modified, everything should rerun
        // if () {
        //     return {};
        // }
        const shouldSkip: { [key: string]: boolean } = {};
        files.forEach((name) => {
            if (mtimes[name] && fs.statSync(name).mtimeMs === mtimes[name]) {
                shouldSkip[name] = true;
            }
        });
        return { shouldSkip, successRerun };
    } else {
        return { shouldSkip: {}, successRerun: true };
    }
};

const saveCache = (files: Array<string>, self: string) => {
    const cache = { [self]: fs.statSync(self).mtimeMs };
    files.forEach((name) => (cache[name] = fs.statSync(name).mtimeMs));
    fs.writeFileSync(cacheFile, JSON.stringify(cache), 'utf8');
};

const mainGo = (fnames: Array<string>, assert: boolean, run: boolean) => {
    for (let fname of fnames) {
        if (fname.endsWith('type-errors.jd')) {
            continue;
        }
        console.log(fname);
        const raw = fs.readFileSync(fname, 'utf8');
        const parsed: Array<Toplevel> = parse(raw);

        let initialEnv = presetEnv({});
        const { expressions, env } = typeFile(parsed, initialEnv, fname);
        const text = printToString(fileToGo(expressions, env, assert), 100);

        const name = path.basename(fname).slice(0, -3);

        const buildDir = path.join(path.dirname(fname), 'build', 'go');
        const dest = path.join(buildDir, name, 'main.go');
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, `package main\n\n` + text);
        if (run) {
            const { stdout, error, stderr, status } = spawnSync(
                'go',
                ['run', dest],
                { stdio: 'pipe', encoding: 'utf8' },
            );
            if (status !== 0) {
                console.log(`❌ Execution failed ${chalk.blue(fname)}`);
                console.log('---------------');
                console.log(stdout);
                console.log(stderr);
                console.log('---------------');
                // return false;
            } else {
                console.log(`✅ all clear ${chalk.blue(fname)}`);
                console.log(stdout);
                console.log(stderr);
                // return true;
            }
        }
    }
};

export type Flags = {
    assert: boolean;
    run: boolean;
    cache: boolean;
    failFast: boolean;
    glsl: boolean;
    trace: boolean;
};

const main = (fnames: Array<string>, flags: Flags, init: Init) => {
    const { shouldSkip, successRerun } = flags.cache
        ? loadCache(fnames, 'main.js')
        : { shouldSkip: null, successRerun: true };
    console.log(chalk.bold.green(`\n# Processing ${fnames.length} files\n`));
    const passed: { [key: string]: boolean } = {};
    let numFailures = 0;
    const reprint = true;
    console.log(chalk.yellow(`Reprint? ${reprint}`));

    const { typedBuiltins, initialEnv, builtinNames } = init;

    const runFile = (fname: string) => {
        try {
            if (fname.endsWith('type-errors.jd')) {
                processErrors(fname, typedBuiltins);
            } else {
                if (
                    processFile(
                        fname,
                        newWithGlobal(initialEnv),
                        builtinNames,
                        flags.assert,
                        flags.run,
                        reprint,
                        flags.glsl,
                        flags.trace,
                    ) === false
                ) {
                    numFailures += 1;
                    console.error(`❌ Failed to process ${chalk.blue(fname)}`);
                    return false;
                }
            }
        } catch (err) {
            numFailures += 1;
            console.error(`❌ Failed to process ${chalk.blue(fname)}`);
            console.error('-----------------------------');
            if (err instanceof LocatedError) {
                console.error(
                    `Error location: ${chalk.blue(
                        `${fname}:${showLocation(err.loc, true)}`,
                    )}`,
                );
            }
            if (err instanceof TypeError) {
                console.error(err.toString());
                console.error(
                    err.stack!.slice(err.message.length + 'Error: '.length),
                );
            } else {
                console.error(err);
            }
            console.error('-----------------------------');
            return false;
        }
        return true;
    };

    for (let fname of fnames) {
        if (shouldSkip && shouldSkip[fname]) {
            passed[fname] = true;
            continue; // skipping
        }
        const success = runFile(fname);
        passed[fname] = success;
        if (flags.failFast && !success) {
            return true;
        }
    }

    if (!numFailures && successRerun) {
        console.error('==================');
        console.log('Rerunning successful files');
        console.error('==================');
        for (let fname of fnames) {
            if (shouldSkip && shouldSkip[fname]) {
                const success = runFile(fname);
                passed[fname] = success;
                if (flags.failFast && !success) {
                    return true;
                }
            }
        }
    }

    console.log(`📢 Failures ${numFailures}`);

    if (flags.cache) {
        saveCache(
            Object.keys(passed).filter((p) => passed[p]),
            'main.js',
        );
    }
    return numFailures > 0;
};

import { execSync, spawnSync } from 'child_process';
import { LocatedError, TypeError } from './typing/errors';
import { fileToGo } from './printing/goPrinter';
import { getTypeError } from './typing/getTypeError';
import { loadBuiltins } from './printing/loadBuiltins';
import { Init, loadInit, loadPrelude } from './printing/loadPrelude';
import { OutputOptions as IOutputOptions } from './printing/ir/types';
import { reprintToplevel } from './reprint';
import { processFile } from './processFile';
import { transform } from './typing/transform';
import { showType } from './typing/unify';
import {
    decoratorExports,
    typeDeclarations,
    typeExports,
} from './printing/typeScriptPrinterSimple';
import { sortedTypes } from './typing/analyze';

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

import * as t from '@babel/types';
import generate from '@babel/generator';

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

    'prelude-types': (args) => {
        const output = args[0];
        const input = args[1];
        const init = loadInit(
            input ? fs.readFileSync(input, 'utf8') : undefined,
        );
        const env = newWithGlobal(init.initialEnv);
        const items = typeDeclarations(
            env,
            {},
            Object.keys(env.global.effects),
            sortedTypes(env),
        );
        items.push(...typeExports(env));
        items.push(...decoratorExports(env));
        const ast = t.file(t.program(items, [], 'script'));
        const { code } = generate(ast, {
            sourceMaps: false,
            sourceFileName: 'prelude.jd',
        });
        const preamble = input
            ? `// AUTOGENERATED by 'node bootstrap.js prelude-types'\n`
            : `// AUTOGENERATED by 'node bootstrap.js prelude-types'
        export type sampler2D = {[y: number]: {[x: number]: Vec4}};

        `.replace(/^\s+/gm, '');
        fs.writeFileSync(output, preamble + code, 'utf8');
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
