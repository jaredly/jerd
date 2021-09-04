/** @jsx jsx */
import { jsx } from '@emotion/react';
// Ok

import * as React from 'react';
import { Env, Term } from '@jerd/language/src/typing/types';
import { transform } from '../../../language/src/typing/transform';
import { FloatScrub, Scrub, ScrubItem } from './Scrub';

export const RangeScrub = ({
    env,
    fullScrub,
    term,
    scrub,
    // setScrub,
    onUpdate,
}: {
    env: Env;
    term: Term;
    scrub: FloatScrub;
    // setScrub: (s: Scrub) => void;
    onUpdate: (t: Term, s: ScrubItem) => void;
    fullScrub: Scrub;
}) => {
    return (
        <React.Fragment>
            <input
                type="range"
                min={scrub.original.value < 10 ? 0 : scrub.original.value / 2.0}
                max={scrub.original.value < 1 ? 1 : scrub.original.value * 2.0}
                step={Math.max(0.01, scrub.original.value / 50)}
                value={scrub.scrubbed}
                onChange={(evt) => {
                    const value = +evt.target.value;
                    const newTerm = transform(term, {
                        term: (t) => {
                            if (
                                t.location.idx === scrub.original.location.idx
                            ) {
                                return {
                                    ...scrub.original,
                                    value,
                                };
                            }
                            return null;
                        },
                        let: (l) => null,
                    });
                    onUpdate(newTerm, {
                        type: 'float',
                        x: {
                            ...scrub,
                            scrubbed: value,
                        },
                    });
                }}
            />
            {scrub.scrubbed}
        </React.Fragment>
    );
};
