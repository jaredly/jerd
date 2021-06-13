/** @jsx jsx */
import { jsx } from '@emotion/react';
// Ok

import * as React from 'react';
import { Env, Float, Term } from '@jerd/language/src/typing/types';
import { transform } from '../../../language/src/typing/transform';
import { FloatScrub, Scrub, ScrubItem } from '../RenderItem';

import { RgbColorPicker } from 'react-colorful';
import { findApplyWithTarget } from './Position';

export const detectColorScrub = (
    kind: string,
    id: string,
    term: Term,
    idx: number,
): ScrubItem | null => {
    // Vec2
    if (kind !== 'term' || id !== '18cdf03e') {
        return null;
    }

    const apply = findApplyWithTarget(term, idx);
    if (
        apply == null ||
        apply.args.length !== 3 ||
        apply.args.some((arg) => arg.type !== 'float')
    ) {
        // console.error('nope', apply);
        return null;
    }

    const r = apply.args[0] as Float;
    const g = apply.args[1] as Float;
    const b = apply.args[2] as Float;

    return {
        type: 'color',
        r: {
            scrubbed: r.value,
            original: r,
            loc: r.location,
        },
        g: {
            scrubbed: g.value,
            original: g,
            loc: g.location,
        },
        b: {
            scrubbed: b.value,
            original: b,
            loc: b.location,
        },
    };
};

const round = (v: number) => Math.floor(v * 100) / 100;

export const ColorScrub = ({
    env,
    fullScrub,
    term,
    r,
    g,
    b,
    setScrub,
}: {
    env: Env;
    term: Term;
    r: FloatScrub;
    g: FloatScrub;
    b: FloatScrub;
    setScrub: (s: Scrub) => void;
    fullScrub: Scrub;
}) => {
    return (
        <RgbColorPicker
            color={{
                r: r.scrubbed * 255,
                g: g.scrubbed * 255,
                b: b.scrubbed * 255,
            }}
            onChange={(rgb) => {
                rgb = { ...rgb };
                // // 2 decimals
                rgb.r /= 255;
                rgb.g /= 255;
                rgb.b /= 255;
                const newTerm = transform(term, {
                    term: (t) => {
                        if (t.location.idx === r.original.location.idx) {
                            return {
                                ...r.original,
                                value: round(rgb.r),
                            };
                        }
                        if (t.location.idx === g.original.location.idx) {
                            return {
                                ...g.original,
                                value: round(rgb.g),
                            };
                        }
                        if (t.location.idx === b.original.location.idx) {
                            return {
                                ...b.original,
                                value: round(rgb.b),
                            };
                        }
                        return null;
                    },
                    let: (l) => null,
                });

                setScrub({
                    ...fullScrub,
                    term: newTerm,
                    item: {
                        type: 'color',
                        r: { ...r, scrubbed: rgb.r },
                        g: { ...g, scrubbed: rgb.g },
                        b: { ...b, scrubbed: rgb.b },
                    },
                });
            }}
        />
    );
};
