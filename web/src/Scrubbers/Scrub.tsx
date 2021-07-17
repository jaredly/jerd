/** @jsx jsx */
import { jsx } from '@emotion/react';
import {
    hashObject,
    idFromName,
    idName,
    ToplevelT,
} from '@jerd/language/src/typing/env';
import { Env, Term, Float, Location } from '@jerd/language/src/typing/types';
import * as React from 'react';
import { IconButton } from '../display/OpenGLCanvas';
import { runTerm } from '../eval';
import { EvalEnv } from '../State';
import { ColorScrub, ColorScrub4 } from './Color';
import { PositionScrub } from './Position';
import { RangeScrub } from './Range';

export type FloatScrub = {
    original: Float;
    scrubbed: number;
    loc: Location;
};

export type ScrubItem =
    | {
          type: 'float';
          x: FloatScrub;
          // original: Float,
          // scrubbed: number;
      }
    | {
          type: 'Vec2';
          x: FloatScrub;
          y: FloatScrub;
      }
    | {
          type: 'color4';
          r: FloatScrub;
          g: FloatScrub;
          b: FloatScrub;
          a: FloatScrub;
      }
    | {
          type: 'color';
          r: FloatScrub;
          g: FloatScrub;
          b: FloatScrub;
      };

export type Scrub = {
    term: Term;
    returnValue: any;
    pos: { left: number; top: number };
    item: ScrubItem;
    // TODO generalize
    // loc: Location;
    // scrubbed: number;
    // original: Float;
};

export const renderScrub = (
    env: Env,
    top: ToplevelT,
    scrub: Scrub,
    setScrub: (s: Scrub | null) => void,
    onChange: (c: ToplevelT) => void,
    evalEnv: EvalEnv,
) => {
    const update = React.useCallback(
        (term: Term, item: ScrubItem) => {
            const id = idFromName(hashObject(term));
            const value = runTerm(env, term, id, evalEnv);
            setScrub({ ...scrub, term, item, returnValue: value[idName(id)] });
        },
        [setScrub, scrub],
    );
    let body = null;
    if (scrub.item.type === 'float') {
        body = (
            <RangeScrub
                fullScrub={scrub}
                env={env}
                term={scrub.term}
                scrub={scrub.item.x}
                onUpdate={update}
                // setScrub={setScrub}
            />
        );
    } else if (scrub.item.type === 'Vec2') {
        body = (
            <PositionScrub
                env={env}
                term={scrub.term}
                x={scrub.item.x}
                y={scrub.item.y}
                onUpdate={update}
                width={400}
                height={400}
            />
        );
    } else if (scrub.item.type === 'color4') {
        body = (
            <ColorScrub4
                fullScrub={scrub}
                env={env}
                term={scrub.term}
                r={scrub.item.r}
                g={scrub.item.g}
                b={scrub.item.b}
                a={scrub.item.a}
                onUpdate={update}
            />
        );
    } else if (scrub.item.type === 'color') {
        body = (
            <ColorScrub
                fullScrub={scrub}
                env={env}
                term={scrub.term}
                r={scrub.item.r}
                g={scrub.item.g}
                b={scrub.item.b}
                onUpdate={update}
            />
        );
    }
    if (!body) {
        return <div>Unknown scrub type {scrub.item.type}</div>;
    }
    return (
        <div
            css={{
                zIndex: 1000,
                position: 'absolute',
                padding: '4px 8px',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                // color: 'black',
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}
            style={{
                left: scrub.pos.left,
                top: scrub.pos.top + 4,
            }}
            onMouseDown={(evt) => evt.stopPropagation()}
            onClick={(evt) => evt.stopPropagation()}
        >
            {body}
            <IconButton
                icon="done"
                onClick={() => {
                    if (top.type !== 'Define' && top.type !== 'Expression') {
                        return;
                    }
                    onChange({
                        ...top,
                        term: scrub.term,
                    });
                    setScrub(null);
                    // change the term to be this term ...
                }}
            />
            <IconButton
                icon="cancel"
                onClick={() => {
                    setScrub(null);
                }}
            />
        </div>
    );
};
