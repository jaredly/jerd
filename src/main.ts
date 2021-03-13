// um what now

// we want to parse things I guess?

import path from 'path';
import fs from 'fs';
import { hashObject, idName, withoutLocations } from './typing/env';
import parse, { Expression, Location, Toplevel } from './parsing/parser';
import {
    declarationToAST,
    printType,
    termToAST,
    typeToString,
} from './printing/typeScriptPrinter';
import { fileToTypescript } from './printing/fileToTypeScript';
import {
    optimizeAST,
    removeTypescriptTypes,
} from './printing/typeScriptOptimize';
import typeExpr, { showLocation } from './typing/typeExpr';
import typeType, { newTypeVbl } from './typing/typeType';
import {
    EffectRef,
    Env,
    getEffects,
    Id,
    Reference,
    Term,
    Type,
    TypeConstraint,
    typesEqual,
} from './typing/types';
import {
    showType,
    unifyInTerm,
    unifyVariables,
    fitsExpectation,
} from './typing/unify';
import { items, printToString } from './printing/printer';
import { declarationToPretty, termToPretty } from './printing/printTsLike';
import {
    typeDefine,
    typeTypeDefn,
    typeEnumDefn,
    typeEffect,
} from './typing/env';
import { typeFile } from './typing/typeFile';

import { bool, presetEnv } from './typing/preset';

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

const testInference = (parsed: Toplevel[]) => {
    const env = presetEnv();
    for (const item of parsed) {
        if (item.type === 'define') {
            const tmpTypeVbls: { [key: string]: Array<TypeConstraint> } = {};
            const subEnv: Env = {
                ...env,
                local: { ...env.local, tmpTypeVbls },
            };
            // TODO only do it
            const self = {
                name: item.id.text,
                type: newTypeVbl(subEnv),
                // type: item.ann ? typeType(env, item.ann) : newTypeVbl(subEnv),
            };
            subEnv.local.self = self;
            const term = typeExpr(subEnv, item.expr);
            if (fitsExpectation(subEnv, term.is, self.type) !== true) {
                throw new Error(`Term's type doesn't match annotation`);
            }
            // So for self-recursive things, the final
            // thing should be exactly the same, not just
            // larger or smaller, right?
            const unified = unifyVariables(env, tmpTypeVbls);
            if (Object.keys(unified).length) {
                unifyInTerm(unified, term);
            }
            const hash: string = hashObject(term);
            const id: Id = { hash: hash, size: 1, pos: 0 };
            env.global.names[item.id.text] = id;
            env.global.idNames[idName(id)] = item.id.text;
            env.global.terms[hash] = term;

            const declared = typeType(env, item.ann);
            if (!typesEqual(declared, term.is)) {
                console.log(`Inference Test failed!`);
                console.log('Expected:');
                console.log(typeToString(env, declared));
                console.log('Inferred:');
                console.log(typeToString(env, term.is));
            } else {
                console.log('Passed!');
                console.log(typeToString(env, declared));
                console.log(typeToString(env, term.is));
            }
        }
    }
};

import * as t from '@babel/types';
import generate from '@babel/generator';

const processErrors = (fname: string) => {
    const raw = fs.readFileSync(fname, 'utf8');
    const parsed: Array<Toplevel> = parse(raw);
    const env = presetEnv();
    const errors: Array<string> = [];
    parsed.forEach((item, i) => {
        if (item.type === 'effect') {
            typeEffect(env, item);
        } else if (item.type === 'define') {
            typeDefine(env, item);
        } else if (item.type === 'StructDef') {
            typeTypeDefn(env, item);
        } else if (item.type === 'EnumDef') {
            typeEnumDefn(env, item);
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
    fs.writeFileSync(dest, errors.join('\n\n'));
};

const processFile = (
    fname: string,
    assert: boolean,
    run: boolean,
    reprint: boolean,
) => {
    const raw = fs.readFileSync(fname, 'utf8');
    const parsed: Array<Toplevel> = parse(raw);

    const { expressions, env } = typeFile(parsed);

    if (reprint) {
        let good = true;
        // Test reprint
        for (let expr of expressions) {
            const reraw = printToString(termToPretty(env, expr), 100);
            let printed;
            try {
                printed = parse(reraw);
            } catch (err) {
                console.log(reraw);
                console.log(showLocation(expr.location));
                console.warn(err.message);
                good = false;
                continue;
            }
            if (printed.length !== 1) {
                console.log(printed);
                console.warn(`Reprint generated multiple toplevels`);
                good = false;
                continue;
            }
            try {
                const retyped = typeExpr(env, printed[0] as Expression);
                if (hashObject(retyped) != hashObject(expr)) {
                    console.log('\n*************\n');
                    console.log(printToString(termToPretty(env, expr), 100));
                    console.log(printToString(termToPretty(env, retyped), 100));
                    console.log('\n---n');
                    console.log(JSON.stringify(withoutLocations(expr)));
                    console.log(JSON.stringify(withoutLocations(retyped)));
                    console.log('\n---n');
                    console.warn(
                        `Expression at ${showLocation(
                            expr.location,
                        )} failed to retype.`,
                    );
                    console.log('\n*************\n');
                    good = false;
                }
            } catch (err) {
                console.log(reraw);
                console.log(printed);
                console.log(
                    `Expression at ${showLocation(
                        expr.location,
                    )} had a type error on reprint`,
                );
                good = false;
            }
        }
        if (!good) {
            throw new Error(`Reprint failure.`);
        }
    }

    const ast = fileToTypescript(expressions, env, assert, true);
    removeTypescriptTypes(ast);
    const { code, map } = generate(ast, {
        sourceMaps: true,
        sourceFileName: '../' + path.basename(fname),
    });

    const buildDir = path.join(path.dirname(fname), 'build');

    const dest = path.join(buildDir, path.basename(fname) + '.mjs');

    const mapName = path.basename(fname) + '.mjs.map';
    fs.writeFileSync(
        path.join(buildDir, mapName),
        JSON.stringify(map, null, 2),
    );

    // This indirection is so avoid confusing source mapping
    // in the generated main.js of the compiler.
    const m = '# source';
    const text = code + '\n\n//' + m + 'MappingURL=' + mapName;

    fs.writeFileSync(dest, text);

    const preludeTS = require('fs').readFileSync(
        './src/printing/prelude.ts',
        'utf8',
    );

    execSync(
        `yarn -s esbuild --loader=ts > "${path.join(buildDir, 'prelude.mjs')}"`,
        {
            input: preludeTS,
        },
    );

    if (run) {
        const { stdout, error } = spawnSync(
            'node',
            ['--enable-source-maps', dest],
            { stdio: 'inherit' },
        );
    }
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

const main = (
    fnames: Array<string>,
    assert: boolean,
    run: boolean,
    cache: boolean,
) => {
    const { shouldSkip, successRerun } = cache
        ? loadCache(fnames, process.argv[1])
        : { shouldSkip: null, successRerun: true };
    console.log(`\n# Processing ${fnames.length} files\n`);
    const passed = [];
    let hasFailures = false;
    const reprint = false;
    for (let fname of fnames) {
        if (shouldSkip && shouldSkip[fname]) {
            passed.push(fname);
            continue; // skipping
        }
        console.log('hello', fname);
        try {
            if (fname.endsWith('type-errors.jd')) {
                processErrors(fname);
            } else {
                processFile(fname, assert, run, reprint);
            }
            console.log(`✅ processed ${fname}`);
            passed.push(fname);
        } catch (err) {
            hasFailures = true;
            console.error(`❌ Failed to process ${fname}`);
            console.error('-----------------------------');
            console.error(err);
            console.error('-----------------------------');
            if (reprint) {
                return;
            }
        }
    }

    if (!hasFailures && successRerun) {
        for (let fname of fnames) {
            if (shouldSkip && shouldSkip[fname]) {
                console.log('Rerunning successful file', fname);
                try {
                    if (fname.endsWith('type-errors.jd')) {
                        processErrors(fname);
                    } else {
                        processFile(fname, assert, run, reprint);
                    }
                    console.log(`✅ processed ${fname}`);
                    passed.push(fname);
                } catch (err) {
                    hasFailures = true;
                    console.error(`❌ Failed to process ${fname}`);
                    console.error('-----------------------------');
                    console.error(err);
                    console.error('-----------------------------');
                    if (reprint) {
                        return;
                    }
                }
            }
        }
    }

    if (cache) {
        saveCache(passed, process.argv[1]);
    }
};

import { execSync, spawnSync } from 'child_process';

const runTests = () => {
    const raw = fs.readFileSync('examples/inference-tests.jd', 'utf8');
    const parsed: Array<Toplevel> = parse(raw);
    testInference(parsed);
};

if (process.argv[2] === '--test') {
    runTests();
} else {
    const fnames = process.argv
        .slice(2)
        .filter((name) => !name.startsWith('-'));
    const assert = process.argv.includes('--assert');
    const run = process.argv.includes('--run');
    const cache = process.argv.includes('--cache');
    try {
        main(fnames, assert, run, cache);
    } catch (err) {
        console.error(err);
    }
}
