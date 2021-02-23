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
];

describe('Example files', () => {
    // beforeAll(() => {
    //     base = null;
    //     foundImages = [];
    //     // This makes the snapshot be put in the file corresponding to our fixture file,
    //     // not this snapshots.test.js file
    //     const updateSnapshot = (expect: any).getState().snapshotState
    //         ._updateSnapshot;
    //     const snapshotState = new SnapshotState(snapshotPath, {
    //         updateSnapshot,
    //     });
    //     (expect: any).setState({snapshotState});
    // });

    toTest.forEach((name) => {
        it(name, () => {
            // const snapshotPath = `__snapshots__/${name}.snap`;
            // const updateSnapshot = (expect as any).getState().snapshotState
            //     ._updateSnapshot;
            // // const currentState = (expect as any).getState().snapshotState;
            // // currentState._snapshotPath = snapshotPath;
            // const snapshotState = new SnapshotState(snapshotPath, {
            //     updateSnapshot,
            // } as any);
            // (expect as any).setState({ snapshotState });
            // // expect.addSnapshotSerializer(serializerRaw);

            const env = presetEnv();
            const raw = fs.readFileSync(__dirname + '/' + name, 'utf8');
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
                    const ts = declarationToString(env, hash, term);
                    expect(serializerRaw.wrap(jd)).toMatchSnapshot(`${i}-jd`);
                    expect(serializerRaw.wrap(ts)).toMatchSnapshot(`${i}-ts`);
                }
            });

            // Saving the snapshot we just took, if need be
            // (expect as any).getState().snapshotState.save();
        });
    });
});
