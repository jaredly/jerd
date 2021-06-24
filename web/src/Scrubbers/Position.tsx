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

export type Bounds = { x0: number; y0: number; x1: number; y1: number };

// Ok better: size & origin
// size: 1, 10, 100, {dims}
// origin: center | corner

// const bounds = [
//     {x: 0, y: 0, width, height},
//     {x: -100, y: -100, width: 200, height: 200},
//     {x: -1, y: -1, width: 2, height: 2},
//     {x: -10, y: -10, width: 20, height: 20},
// ]

const calcBounds = ({ center, size }: { center: boolean; size: number }) => {
    if (center) {
        return { x: -size, y: -size, width: size * 2, height: size * 2 };
    }
    return { x: 0, y: 0, width: size, height: size };
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
    const [bounds, setBounds] = React.useState({
        center: false,
        size: width,
    });
    const [dragging, setDragging] = React.useState(null as null | HTMLElement);

    React.useEffect(() => {
        if (!dragging) {
            return;
        }
        const fn = (evt: MouseEvent) => {
            const box = dragging.getBoundingClientRect();
            const left = (evt.clientX - box.left) / (width / 2);
            const top = 1.0 - (evt.clientY - box.top) / (height / 2);

            const boundBox = calcBounds(bounds);
            const xn = left * boundBox.width + boundBox.x;
            const yn = top * boundBox.height + boundBox.y;

            const newTerm = transform(term, {
                term: (t) => {
                    if (t.location.idx === x.original.location.idx) {
                        return {
                            ...x.original,
                            value: xn,
                        };
                    }
                    if (t.location.idx === y.original.location.idx) {
                        return {
                            ...y.original,
                            value: yn,
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
                    x: { ...x, scrubbed: xn },
                    y: { ...y, scrubbed: yn },
                },
            });
        };
        const off = () => {
            setDragging(null);
        };
        window.addEventListener('mousemove', fn, true);
        window.addEventListener('mouseup', off, true);
        return () => {
            window.removeEventListener('mousemove', fn, true);
            window.removeEventListener('mouseup', off, true);
        };
    }, [dragging, setScrub]);

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
                evt.preventDefault();
                evt.stopPropagation();
            }}
            onMouseDown={(evt) => {
                evt.preventDefault();
                evt.stopPropagation();
                setDragging(evt.currentTarget);
            }}
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
