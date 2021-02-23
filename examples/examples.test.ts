// Ok here we test things with fixtures I think

import { parse } from '../src/grammar';
import { typeDefine, typeEffect } from '../src/env';
import { presetEnv } from '../src/preset';
import fs from 'fs';
import { printToString } from '../src/printer';
import { declarationToPretty } from '../src/printTsLike';
import { declarationToString } from '../src/typeScriptPrinter';
import * as serializerRaw from 'jest-snapshot-serializer-raw';
import { SnapshotState } from 'jest-snapshot';

const toTest = [
    // yes
    'basic-effects.jd',
    'inference.jd',
    'generics.jd',
    'ifs.jd',
    'lets.jd',
];

describe('Example files', () => {
    toTest.forEach((name) => {
        it(name, () => {
            const env = presetEnv();
            const raw = fs.readFileSync(__dirname + '/' + name, 'utf8');

            const items: Array<string> = [];

            const parsed = parse(raw);
            parsed.forEach((item, i) => {
                if (item.type === 'effect') {
                    typeEffect(env, item);
                }
                if (item.type === 'define') {
                    const { term, hash } = typeDefine(env, item);
                    const jd = printToString(
                        declarationToPretty({ hash, size: 1, pos: 0 }, term),
                        100,
                    );
                    items.push('// .jd\n' + jd);
                    try {
                        const ts = declarationToString(env, hash, term);
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
