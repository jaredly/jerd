// Ok here we test things with fixtures I think

import { parse } from '../src/parsing/grammar';
import { typeDefine, typeEffect } from '../src/typing/env';
import { bool, presetEnv } from '../src/typing/preset';
import fs from 'fs';
import { printToString } from '../src/printing/printer';
import { declarationToPretty, termToPretty } from '../src/printing/printTsLike';
import {
    declarationToString,
    termToString,
} from '../src/printing/typeScriptPrinter';
import * as serializerRaw from 'jest-snapshot-serializer-raw';
import { subEnv } from '../src/typing/types';
import vm from 'vm';
import { execSync } from 'child_process';
import typeExpr from '../src/typing/typeExpr';
import path from 'path';
import { Location, Toplevel } from '../src/parsing/parser';
import { fitsExpectation } from '../src/typing/unify';

const examples = [
    // yes
    require('./basic-effects.jd'),
    require('./inference.jd'),
    require('./generics.jd'),
    require('./conditionals.jd'),
    require('./lets.jd'),
    require('./basics.jd'),
    require('./eff-paper.jd'),
];

const prelude = require('fs')
    .readFileSync(__dirname + '/../src/printing/prelude.ts', 'utf8')
    .trim()
    .split('\n')
    // Remove the "export" lines
    .filter((x: string) => x.startsWith('export {'))
    .join('\n');

const getText = (raw: string, location: Location) => {
    return raw.slice(location.start.offset, location.end.offset);
};

describe('Example files', () => {
    examples.forEach(({ src, filename }) => {
        it(path.basename(filename), () => {
            const env = presetEnv();
            const raw = src;

            const items: Array<string> = [];

            const parsed = parse(raw);
            parsed.forEach((item: Toplevel, i: number) => {
                if (item.type === 'effect') {
                    typeEffect(env, item);
                } else if (item.type === 'define') {
                    const { term, hash } = typeDefine(env, item);
                    const jd = printToString(
                        declarationToPretty(
                            env,
                            { hash, size: 1, pos: 0 },
                            term,
                        ),
                        100,
                    );
                    items.push(`// ${item.id.text}.jd\n` + jd);
                    try {
                        const prettyEnv = subEnv(env);
                        prettyEnv.local.self = {
                            name: hash,
                            type: term.is,
                        };
                        const ts = declarationToString(prettyEnv, hash, term);
                        items.push('// .ts\n' + ts);
                    } catch (err) {
                        items.push(`// ERROR ${err}`);
                    }
                } else {
                    const term = typeExpr(env, item);
                    const jd = printToString(termToPretty(env, term), 100);
                    items.push(`// .jd\n` + jd);
                    try {
                        const ts = termToString(env, term);
                        items.push('// .ts\n' + ts);
                    } catch (err) {
                        items.push(`// ERROR ${err}`);
                    }
                }
            });

            expect(serializerRaw.wrap(items.join('\n\n'))).toMatchSnapshot();
        });
    });
});

const typeErrors = require('./type-errors.jd');

describe('Type errors', () => {
    const env = presetEnv();
    const raw = typeErrors.src;
    const parsed: Array<Toplevel> = parse(raw);

    parsed.forEach((item, i) => {
        if (item.type === 'effect') {
            typeEffect(env, item);
        } else if (item.type === 'define') {
            typeDefine(env, item);
        } else {
            const name = item.location
                ? getText(raw, item.location)
                : `(no location)`;
            // const name = `Expression ${i}`;
            it(`Expression ${i} ` + name, () => {
                expect(() =>
                    typeExpr(env, item),
                ).toThrowErrorMatchingSnapshot();
                // try {
                //     typeExpr(env, item);
                // } catch (err) {
                //     console.error(err);
                // }
            });
        }
    });
});

const tests = ['basics.jd', 'eff-paper.jd'];

const tsToJs = (ts: string) =>
    execSync('yarn -s esbuild --loader=ts', { encoding: 'utf8', input: ts });

describe('Test Files', () => {
    tests.forEach((fname) => {
        describe(fname, () => {
            let vmEnv: any;
            beforeAll(() => {
                vmEnv = vm.createContext({ console });
                vm.runInContext(tsToJs(prelude), vmEnv);
            });

            const env = presetEnv();
            const raw = fs.readFileSync(__dirname + '/' + fname, 'utf8');
            const parsed: Array<Toplevel> = parse(raw);

            parsed.forEach((item) => {
                const name = item.location
                    ? getText(raw, item.location)
                    : 'should compile (no location)';
                it(name, () => {
                    if (item.type === 'effect') {
                        typeEffect(env, item);
                    } else if (item.type === 'define') {
                        const { term, hash } = typeDefine(env, item);
                        // const jd = printToString(
                        //     declarationToPretty({ hash, size: 1, pos: 0 }, term),
                        //     100,
                        // );
                        // items.push(`// ${item.id.text}.jd\n` + jd);
                        // try {
                        const prettyEnv = subEnv(env);
                        prettyEnv.local.self = {
                            name: hash,
                            type: term.is,
                        };
                        const ts = declarationToString(prettyEnv, hash, term);
                        vm.runInContext(tsToJs(ts), vmEnv);
                        // items.push('// .ts\n' + ts);
                        // } catch (err) {
                        //     items.push(`// ERROR ${err}`);
                        // }
                    } else {
                        // expression
                        const term = typeExpr(env, item);
                        if (fitsExpectation(null, term.is, bool) === true) {
                            const ts = termToString(env, term);
                            const result = vm.runInContext(tsToJs(ts), vmEnv);
                            if (result === true) {
                                expect(result).toBeTruthy();
                            } else {
                                console.error('Generated typescript:', ts);
                                expect(result).toBe(true);
                            }
                        }
                    }
                });
            });
        });
    });
});
