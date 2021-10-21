import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import parse, { Toplevel } from '../parsing/parser';
import { Type } from '../typing/types';
import * as preset from '../typing/preset';
import { printToString } from '../printing/printer';
import { typeFile } from '../typing/typeFile';
import { presetEnv } from '../typing/preset';
import { spawnSync } from 'child_process';
import { fileToGo } from '../printing/goPrinter';

export const mainGo = (
    fnames: Array<string>,
    assert: boolean,
    run: boolean,
) => {
    for (let fname of fnames) {
        if (fname.endsWith('type-errors.jd')) {
            continue;
        }
        console.log(fname);
        const raw = fs.readFileSync(fname, 'utf8');
        const parsed: Array<Toplevel> = parse(raw);

        const math = ['sin', 'cos', 'tan'];
        const builtins: { [key: string]: Type } = {};
        math.forEach((name) => {
            builtins[name] = preset.pureFunction([preset.float], preset.float);
        });
        ['max', 'min'].forEach((name) => {
            builtins[name] = preset.pureFunction(
                [preset.float, preset.float],
                preset.float,
            );
        });
        builtins['PI'] = preset.float;
        builtins['intToFloat'] = preset.pureFunction(
            [preset.int],
            preset.float,
        );
        builtins['floatToString'] = preset.pureFunction(
            [preset.float],
            preset.string,
        );

        let initialEnv = presetEnv(builtins);
        const { expressions, env } = typeFile(parsed, initialEnv, fname);
        const { pretty, displayName } = fileToGo(expressions, env, assert);
        const text = printToString(pretty, 100);

        const name = path.basename(fname).slice(0, -3);

        const buildDir = path.join(path.dirname(fname), 'build', 'go');
        const dest = path.join(buildDir, name, 'main.go');
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, `package main\n\n` + text);
        fs.writeFileSync(
            path.join(buildDir, name, 'go.mod'),
            `module github.com/jaredly/jerd/language/example/build/go/${name}\n\ngo 1.15\n\n`,
        );
        if (displayName) {
            fs.writeFileSync(
                path.join(buildDir, name, `${displayName}.go`),
                fs.readFileSync(`./examples/go-backends/${displayName}.go`),
            );
        }
        if (run) {
            const { stdout, error, stderr, status } = spawnSync(
                'go',
                ['run', '.'],
                {
                    cwd: path.join(buildDir, name),
                    stdio: 'pipe',
                    encoding: 'utf8',
                    env: {
                        GO111MODULE: 'on',
                        ...process.env,
                    },
                },
            );
            if (status !== 0) {
                console.log(
                    `❌ Execution failed ${chalk.blue(
                        fname,
                    )}: status ${status}`,
                );
                console.log('---------------');
                console.log(stdout);
                console.log(stderr);
                console.log('---------------');
                // return false;
            } else {
                console.log(`✅ all clear ${chalk.blue(fname)}`);
                console.log(path.join(buildDir, name));
            }
        }
    }
};
