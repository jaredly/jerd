/** @jsx jsx */
import { jsx } from '@emotion/react';
// Ok

import * as React from 'react';
import { Env, Term } from '@jerd/language/src/typing/types';
import { transform } from '../../../language/src/typing/transform';
import { FloatScrub, Scrub } from '../RenderItem';

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
