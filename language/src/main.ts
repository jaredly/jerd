#!/usr/bin/env node
// um what now

// we want to parse things I guess?

import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import {
    hashObject,
    idFromName,
    idName,
    typeEnumInner,
    typeRecordDefn,
    withoutLocations,
} from './typing/env';
import parse, {
    Define,
    Expression,
    Location,
    Toplevel,
} from './parsing/parser';
// import { fileToTypescript } from './printing/fileToTypeScript';
import { fileToTypescript as fileToTypeScriptNew } from './printing/typeScriptPrinterSimple';
import { removeTypescriptTypes } from './printing/typeScriptOptimize';
import typeExpr, { showLocation } from './typing/typeExpr';
import typeType, { newTypeVbl } from './typing/typeType';
import {
    Env,
    Id,
    newWithGlobal,
    Self,
    Term,
    Type,
    TypeConstraint,
    typesEqual,
} from './typing/types';
import { printToString } from './printing/printer';
import {
    termToPretty,
    typeToPretty,
    toplevelToPretty,
    ToplevelT,
} from './printing/printTsLike';
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
            env.global.names[item.id.text] = id;
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

import * as t from '@babel/types';
import generate from '@babel/generator';

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
        } else if (item.type === 'Decorated') {
            throw new Error(`Unexpected decorator`);
        } else {
            let term;
            try {
                term = typeExpr(env, item);
            } catch (err) {
                errors.push(err.message);
                return; // yup
            }
            console.log(item);
            throw new Error(
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

const withParseError = (text: string, location: Location) => {
    const lines = text.split('\n');
    const indent = new Array(location.start.column);
    indent.fill('');
    lines.splice(
        location.start.line,
        0,
        chalk.red(indent.join('-') + '^' + '--'),
    );
    return lines.join('\n');
};

const reprintToplevel = (
    env: Env,
    raw: string,
    toplevel: ToplevelT,
    hash: string,
) => {
    const origraw = toplevel.location
        ? raw.slice(
              toplevel.location.start.offset,
              toplevel.location.end.offset,
          )
        : '<no original text>';
    const reraw = printToString(toplevelToPretty(env, toplevel), 100);
    let printed: Array<Toplevel>;
    try {
        printed = parse(reraw);
    } catch (err) {
        console.log(chalk.green('Original'));
        console.log(origraw);
        console.log(chalk.red('Printed'));
        console.log(withParseError(reraw, err.location));
        console.log(chalk.red('Reparse error:'));
        console.log(showLocation(toplevel.location));
        console.error(err.message, showLocation(err.location));
        return false;
    }
    if (printed.length !== 1) {
        console.log(printed);
        console.warn(`Reprint generated multiple toplevels`);
        return false;
    }
    try {
        let retyped: ToplevelT;
        let nhash: string;
        if (toplevel.type === 'RecordDef' && printed[0].type === 'StructDef') {
            const defn = typeRecordDefn(env, printed[0], toplevel.def.unique);
            nhash = hashObject(defn);
            retyped = {
                ...toplevel,
                type: 'RecordDef',
                def: defn,
                id: { hash: nhash, size: 1, pos: 0 },
            };
        } else if (
            printed[0].type === 'Decorated' &&
            toplevel.type === 'RecordDef' &&
            printed[0].wrapped.type === 'StructDef'
        ) {
            const tag =
                printed[0].decorators[0].args.length === 1
                    ? typeExpr(env, printed[0].decorators[0].args[0])
                    : null;
            if (tag && tag.type !== 'string') {
                throw new Error(`ffi tag must be a string literal`);
            }
            const defn = typeRecordDefn(
                env,
                printed[0].wrapped,
                toplevel.def.unique,
                tag ? tag.text : printed[0].wrapped.id.text,
            );
            nhash = hashObject(defn);
            retyped = {
                ...toplevel,
                type: 'RecordDef',
                def: defn,
                id: { hash: nhash, size: 1, pos: 0 },
            };
        } else if (
            toplevel.type === 'EnumDef' &&
            printed[0].type === 'EnumDef'
        ) {
            const defn = typeEnumInner(env, printed[0]);
            nhash = hashObject(defn);
            retyped = {
                ...toplevel,
                type: 'EnumDef',
                def: defn,
                id: { hash: nhash, size: 1, pos: 0 },
            };
        } else if (toplevel.type === 'Define' && printed[0].type === 'define') {
            retyped = {
                ...toplevel,
                type: 'Define',
                id: toplevel.id,
                term: typeExpr(env, (printed[0] as Define).expr),
            };
            nhash = hashObject(retyped.term);
        } else {
            retyped = {
                ...toplevel,
                type: 'Expression',
                term: typeExpr(env, printed[0] as Expression),
            };
            nhash = hashObject(retyped.term);
        }
        if (nhash != hash) {
            console.log(
                chalk.red('Hash mismatch on reparse!'),
                toplevel.type,
                hash,
                nhash,
            );
            console.log(chalk.green('Original'));
            console.log(origraw);
            console.log(chalk.green('Printed'));
            console.log(reraw);
            console.log(chalk.green('Reprinted'));
            console.log(printToString(toplevelToPretty(env, retyped), 100));
            console.log('\n---n');
            console.log(JSON.stringify(withoutLocations(toplevel)));
            console.log(JSON.stringify(withoutLocations(retyped)));
            console.log('\n---n');
            console.warn(
                `Expression at ${showLocation(
                    toplevel.location,
                )} failed to retype.`,
            );
            console.log('\n*************\n');
            return false;
        }
    } catch (err) {
        console.log(chalk.green('Original'));
        console.log(origraw);
        console.log(chalk.green('Reprinted'));
        console.log(reraw);
        console.log(chalk.yellow('AST'));
        console.log(JSON.stringify(withoutLocations(printed)));
        console.error(err);
        console.log(
            `Expression at ${showLocation(
                toplevel.location,
            )} had a type error on reprint`,
        );
        return false;
    }
};

/**
 * Writes file, creating diretory path if it does not exist.
 *
 * @param filePath
 * @param content
 */
const writeFile = (filePath: string, content: string) => {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
};

const checkReprint = (raw: string, expressions: Array<Term>, env: Env) => {
    let good = true;

    // Test reprint
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

    // Test reprint
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

const processFile = (
    fname: string,
    // builtins: { [key: string]: Type | null },
    initialEnv: Env,
    builtinNames: Array<string>,
    assert: boolean,
    run: boolean,
    reprint: boolean,
): boolean => {
    const raw = fs.readFileSync(fname, 'utf8');
    const parsed: Array<Toplevel> = parse(raw);

    // const typedBuiltins: { [key: string]: Type } = {};
    // Object.keys(builtins).forEach((b) => {
    //     const v = builtins[b];
    //     if (v != null) {
    //         typedBuiltins[b] = v;
    //     }
    // });
    // let initialEnv = presetEnv(typedBuiltins);
    const { expressions, env } = typeFile(parsed, initialEnv, fname);

    if (reprint) {
        const good = checkReprint(raw, expressions, env);
        if (!good) {
            console.log(`❌ Reprint failed for ${chalk.blue(fname)}`);
            return false;
        }
    }

    const ast = fileToTypeScriptNew(
        expressions,
        env,
        {},
        assert,
        true,
        builtinNames,
    );
    // const ast = fileToTypescript(expressions, env, {}, assert, true);
    removeTypescriptTypes(ast);
    const { code, map } = generate(ast, {
        sourceMaps: true,
        sourceFileName: '../' + path.basename(fname),
    });

    const buildDir = path.join(path.dirname(fname), 'build');

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

    if (run) {
        const { stdout, error, stderr, status } = spawnSync(
            'node',
            ['--enable-source-maps', dest],
            { stdio: 'pipe', encoding: 'utf8' },
        );
        if (status !== 0) {
            console.log(`❌ Execution failed ${chalk.blue(fname)}`);
            console.log('---------------');
            console.log(stdout);
            console.log(stderr);
            console.log('---------------');
            return false;
        } else {
            console.log(`✅ all clear ${chalk.blue(fname)}`);
            return true;
        }
    }
    return true;
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

// STOPSHIP: Allow --assert to make these runnable
// with assertions! that would be great
// and I mean --run could be fun too
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
        const text = 'DISABLED'; // fileToGo(expressions, env, assert);

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
                // return true;
            }
        }
    }
};

const main = (
    fnames: Array<string>,
    assert: boolean,
    run: boolean,
    cache: boolean,
    failFast: boolean,
) => {
    const { shouldSkip, successRerun } = cache
        ? loadCache(fnames, process.argv[1])
        : { shouldSkip: null, successRerun: true };
    console.log(chalk.bold.green(`\n# Processing ${fnames.length} files\n`));
    const passed: { [key: string]: boolean } = {};
    let numFailures = 0;
    const reprint = true;
    console.log(chalk.yellow(`Reprint? ${reprint}`));

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
                        assert,
                        run,
                        reprint,
                    ) === false
                ) {
                    numFailures += 1;
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
                console.error(err.stack);
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
        if (failFast && !success) {
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
                if (failFast && !success) {
                    return true;
                }
            }
        }
    }

    console.log(`📢 Failures ${numFailures}`);

    if (cache) {
        saveCache(
            Object.keys(passed).filter((p) => passed[p]),
            process.argv[1],
        );
    }
    return numFailures > 0;
};

import { execSync, spawnSync } from 'child_process';
import { LocatedError, TypeError } from './typing/errors';
// import { fileToGo } from './printing/goPrinter';
import { getTypeError } from './typing/getTypeError';
import { loadBuiltins } from './printing/loadBuiltins';
import { loadPrelude } from './printing/loadPrelude';

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

if (process.argv[2] === 'go') {
    console.log('go please');
    const fnames = process.argv
        .slice(3)
        .filter((name) => !name.startsWith('-'));
    const assert = process.argv.includes('--assert');
    const run = process.argv.includes('--run');
    mainGo(expandDirectories(fnames), assert, run);
} else if (process.argv[2] === '--test') {
    runTests();
} else {
    const fnames = process.argv
        .slice(2)
        .filter((name) => !name.startsWith('-'));
    const assert = process.argv.includes('--assert');
    const run = process.argv.includes('--run');
    const cache = process.argv.includes('--cache');
    const failFast = process.argv.includes('--fail-fast');
    try {
        const failed = main(
            expandDirectories(fnames),
            assert,
            run,
            cache,
            failFast,
        );
        if (failed) {
            process.exit(1);
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
