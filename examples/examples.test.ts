// Ok here we test things with fixtures I think

import { parse } from '../src/grammar';
import { typeDefine, typeEffect } from '../src/env';
import { bool, prelude, presetEnv } from '../src/preset';
import fs from 'fs';
import { printToString } from '../src/printer';
import { declarationToPretty, termToPretty } from '../src/printTsLike';
import { declarationToString, termToString } from '../src/typeScriptPrinter';
import * as serializerRaw from 'jest-snapshot-serializer-raw';
import { subEnv } from '../src/types';
import vm from 'vm';
import { execSync } from 'child_process';
import typeExpr, { fitsExpectation } from '../src/typeExpr';
import path from 'path';

const examples = [
    // yes
    require('./basic-effects.jd'),
    require('./inference.jd'),
    require('./generics.jd'),
    require('./ifs.jd'),
    require('./lets.jd'),
    require('./basics.jd'),
];

describe('Example files', () => {
    examples.forEach(({ src, filename }) => {
        it(path.basename(filename), () => {
            const env = presetEnv();
            // const raw = fs.readFileSync(__dirname + '/' + name, 'utf8');
            const raw = src;

            const items: Array<string> = [];

            const parsed = parse(raw);
            parsed.forEach((item, i) => {
                if (item.type === 'effect') {
                    typeEffect(env, item);
                } else if (item.type === 'define') {
                    const { term, hash } = typeDefine(env, item);
                    const jd = printToString(
                        declarationToPretty({ hash, size: 1, pos: 0 }, term),
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
                    const jd = printToString(termToPretty(term), 100);
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
    const parsed = parse(raw);

    parsed.forEach((item, i) => {
        if (item.type === 'effect') {
            typeEffect(env, item);
        } else if (item.type === 'define') {
            typeDefine(env, item);
        } else {
            const name = `Expression ${i}`;
            it(name, () => {
                expect(() => typeExpr(env, item)).toThrowErrorMatchingSnapshot(
                    name,
                );
                // try {
                //     typeExpr(env, item);
                // } catch (err) {
                //     console.error(err);
                // }
            });
        }
    });
});

const tests = ['basics.jd'];

const tsToJs = (ts) =>
    execSync('yarn -s esbuild --loader=ts', { encoding: 'utf8', input: ts });

describe('Test Files', () => {
    tests.forEach((fname) => {
        describe(fname, () => {
            let vmEnv;
            beforeAll(() => {
                vmEnv = vm.createContext({ console });
                vm.runInContext(tsToJs(prelude.join('\n\n')), vmEnv);
            });

            const env = presetEnv();
            const raw = fs.readFileSync(__dirname + '/' + fname, 'utf8');
            const parsed = parse(raw);

            parsed.forEach((item) => {
                it('should compile & run', () => {
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
