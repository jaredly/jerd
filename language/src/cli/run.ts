import chalk from 'chalk';
import { showLocation } from '../typing/typeExpr';
import { newWithGlobal } from '../typing/types';
import { LocatedError, TypeError } from '../typing/errors';
import { Init } from '../printing/loadPrelude';
import { processFile } from '../processFile';
import { processErrors } from './processErrors';
import fs from 'fs';

export type Flags = {
    assert: boolean;
    run: boolean;
    cache: boolean;
    failFast: boolean;
    glsl: boolean;
    trace: boolean;
};

const cacheFile = '.test-cache';

export const loadCache = (files: Array<string>, self: string) => {
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

export const saveCache = (files: Array<string>, self: string) => {
    const cache = { [self]: fs.statSync(self).mtimeMs };
    files.forEach((name) => (cache[name] = fs.statSync(name).mtimeMs));
    fs.writeFileSync(cacheFile, JSON.stringify(cache), 'utf8');
};

export const main = (fnames: Array<string>, flags: Flags, init: Init) => {
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
                        newWithGlobal(initialEnv, true),
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
