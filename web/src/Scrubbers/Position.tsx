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
    term,
    x,
    y,
    width,
    height,
    onUpdate,
}: {
    env: Env;
    term: Term;
    x: FloatScrub;
    y: FloatScrub;
    width: number;
    height: number;
    onUpdate: (term: Term, item: ScrubItem) => void;
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

            onUpdate(newTerm, {
                type: 'Vec2',
                x: { ...x, scrubbed: xn },
                y: { ...y, scrubbed: yn },
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
    }, [dragging, onUpdate]);

    // START HERE:
    // Add buttons for variable bounds.

    const boundsOptions = [
        {
            title: '-1 - 1',
            center: true,
            size: 1,
        },
        {
            title: '0 - 10',
            center: false,
            size: 10,
        },
        {
            title: '-10 - 10',
            center: true,
            size: 10,
        },
        {
            title: '0 - 100',
            center: false,
            size: 100,
        },
        {
            title: '-100 - 100',
            center: true,
            size: 100,
        },
        {
            title: 'screen',
            center: false,
            size: width,
        },
    ];

    return (
        <div>
            <div
                css={{
                    display: 'flex',
                }}
            >
                {boundsOptions.map((option, i) => {
                    const isSelected =
                        option.center === bounds.center &&
                        option.size === bounds.size;
                    return (
                        <button
                            key={i}
                            css={{
                                background: isSelected ? '#fff' : '#ccc',
                                border: 'none',
                                color: '#000',
                            }}
                            onClick={() => {
                                setBounds({
                                    center: option.center,
                                    size: option.size,
                                });
                            }}
                        >
                            {option.title}
                        </button>
                    );
                })}
            </div>

            <div
                css={{
                    width: width / 2,
                    height: height / 2,
                    position: 'relative',
                    backgroundColor: 'transparent',
                    border: '1px solid #555',
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
                        pointerEvents: 'none',
                        width: 2,
                        height: 12,
                        position: 'absolute',
                        marginLeft: -1,
                        marginTop: -6,
                        backgroundColor: 'yellow',
                        // border: '1px solid white',
                    }}
                    style={{
                        ...withinBounds(0, 0, width / 2, height / 2, bounds),
                    }}
                />
                <div
                    css={{
                        pointerEvents: 'none',
                        width: 12,
                        height: 2,
                        position: 'absolute',
                        marginLeft: -6,
                        marginTop: -1,
                        backgroundColor: 'yellow',
                        // border: '1px solid white',
                    }}
                    style={{
                        ...withinBounds(0, 0, width / 2, height / 2, bounds),
                    }}
                />
                <div
                    css={{
                        width: 8,
                        height: 8,
                        marginLeft: -4,
                        marginTop: -4,
                        borderRadius: '50%',
                        position: 'absolute',
                        backgroundColor: 'transparent',
                        border: '1px solid white',
                    }}
                    style={{
                        ...withinBounds(
                            x.scrubbed,
                            y.scrubbed,
                            width / 2,
                            height / 2,
                            bounds,
                        ),
                    }}
                />
            </div>
        </div>
    );
};

// Ok so x is -1 to 1
// output is 0 to 100
// box is -1 to 1
const withinBounds = (
    x: number,
    y: number,
    width: number,
    height: number,
    bounds: { center: boolean; size: number },
) => {
    const box = calcBounds(bounds);
    const leftPercent = (x - box.x) / box.width;
    const topPercent = (y - box.y) / box.height;
    return { left: leftPercent * width, top: height - topPercent * height };
};
