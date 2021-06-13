/** @jsx jsx */
import { jsx } from '@emotion/react';
// Ok

import * as React from 'react';
import {
    Apply,
    Env,
    Float,
    Location,
    Term,
} from '@jerd/language/src/typing/types';
import { transform, walkTerm } from '../../../language/src/typing/transform';
import { FloatScrub, Scrub, ScrubItem } from '../RenderItem';

export const findApplyWithTarget = (term: Term, idx: number): Apply | null => {
    let found: null | Apply = null;
    walkTerm(term, (t) => {
        if (t.type === 'apply' && t.target.location.idx === idx) {
            found = t;
            return false;
        }
    });
    return found;
};

export const detectVec2Scrub = (
    kind: string,
    id: string,
    term: Term,
    idx: number,
): ScrubItem | null => {
    // Vec2
    if (kind !== 'term' || id !== '54a9f2ef') {
        return null;
    }
    // ooohh hm ok maybe here is where we need paths?
    // because I don't know if this vec2 is being called
    // immediately. And I only want to match on that.
    const apply = findApplyWithTarget(term, idx);
    if (
        apply == null ||
        apply.args.length !== 2 ||
        apply.args.some((arg) => arg.type !== 'float')
    ) {
        console.error('nope', apply);
        return null;
    }

    const x = apply.args[0] as Float;
    const y = apply.args[1] as Float;

    return {
        type: 'Vec2',
        x: {
            scrubbed: x.value,
            original: x,
            loc: x.location,
        },
        y: {
            scrubbed: y.value,
            original: y,
            loc: y.location,
        },
    };
};

export const PositionScrub = ({
    env,
    fullScrub,
    term,
    x,
    y,
    width,
    height,
    setScrub,
}: {
    env: Env;
    term: Term;
    x: FloatScrub;
    y: FloatScrub;
    width: number;
    height: number;
    setScrub: (s: Scrub) => void;
    fullScrub: Scrub;
}) => {
    const [dragging, setDragging] = React.useState(false);
    return (
        <div
            css={{
                width: width / 2,
                height: height / 2,
                position: 'relative',
                backgroundColor: 'transparent',
            }}
            onMouseMove={(evt) => {
                if (!dragging) {
                    return;
                }
                const box = evt.currentTarget.getBoundingClientRect();
                const left = (evt.clientX - box.left) * 2;
                const top = height - (evt.clientY - box.top) * 2;
                const newTerm = transform(term, {
                    term: (t) => {
                        if (t.location.idx === x.original.location.idx) {
                            return {
                                ...x.original,
                                value: left,
                            };
                        }
                        if (t.location.idx === y.original.location.idx) {
                            return {
                                ...y.original,
                                value: top,
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
                        type: 'Vec2',
                        x: { ...x, scrubbed: left },
                        y: { ...y, scrubbed: top },
                    },
                });
            }}
            onMouseUp={() => setDragging(false)}
            onMouseDown={() => setDragging(true)}
        >
            <div
                css={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    border: '1px solid white',
                }}
                style={{
                    top: (height - y.scrubbed) / 2 - 4,
                    left: x.scrubbed / 2 - 4,
                }}
            />
        </div>
    );
};
