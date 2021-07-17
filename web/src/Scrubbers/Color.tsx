/** @jsx jsx */
import { jsx } from '@emotion/react';
// Ok

import * as React from 'react';
import { Env, Float, Term } from '@jerd/language/src/typing/types';
import { transform } from '../../../language/src/typing/transform';
import { FloatScrub, Scrub, ScrubItem } from './Scrub';

import { RgbColorPicker, RgbaColorPicker } from 'react-colorful';
import { findApplyWithTarget } from './Position';

export const detectColor4Scrub = (
    kind: string,
    id: string,
    term: Term,
    idx: number,
): ScrubItem | null => {
    // Vec2
    if (kind !== 'term' || id !== '4d4983bb') {
        return null;
    }

    const apply = findApplyWithTarget(term, idx);
    if (
        apply == null ||
        apply.args.length !== 4 ||
        apply.args.some((arg) => arg.type !== 'float')
    ) {
        // console.error('nope', apply);
        return null;
    }

    const r = apply.args[0] as Float;
    const g = apply.args[1] as Float;
    const b = apply.args[2] as Float;
    const a = apply.args[3] as Float;

    return {
        type: 'color4',
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
        a: {
            scrubbed: a.value,
            original: a,
            loc: a.location,
        },
    };
};

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
    onUpdate,
}: {
    env: Env;
    term: Term;
    r: FloatScrub;
    g: FloatScrub;
    b: FloatScrub;
    fullScrub: Scrub;
    onUpdate: (term: Term, item: ScrubItem) => void;
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

                onUpdate(newTerm, {
                    type: 'color',
                    r: { ...r, scrubbed: rgb.r },
                    g: { ...g, scrubbed: rgb.g },
                    b: { ...b, scrubbed: rgb.b },
                });
            }}
        />
    );
};

export const ColorScrub4 = ({
    env,
    fullScrub,
    term,
    r,
    g,
    b,
    a,
    // setScrub,
    onUpdate,
}: {
    env: Env;
    term: Term;
    r: FloatScrub;
    g: FloatScrub;
    b: FloatScrub;
    a: FloatScrub;
    // setScrub: (s: Scrub) => void;
    onUpdate: (term: Term, item: ScrubItem) => void;
    fullScrub: Scrub;
}) => {
    return (
        <RgbaColorPicker
            color={{
                r: r.scrubbed * 255,
                g: g.scrubbed * 255,
                b: b.scrubbed * 255,
                a: a.scrubbed,
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
                        if (t.location.idx === a.original.location.idx) {
                            return {
                                ...a.original,
                                value: round(rgb.a),
                            };
                        }
                        return null;
                    },
                    let: (l) => null,
                });

                onUpdate(newTerm, {
                    type: 'color4',
                    r: { ...r, scrubbed: rgb.r },
                    g: { ...g, scrubbed: rgb.g },
                    b: { ...b, scrubbed: rgb.b },
                    a: { ...a, scrubbed: rgb.a },
                });
            }}
        />
    );
};
