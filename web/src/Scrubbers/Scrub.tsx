/** @jsx jsx */
import { jsx } from '@emotion/react';
import { hashObject, idFromName, idName } from '@jerd/language/src/typing/env';
import {
    Env,
    Term,
    Float,
    Location,
    walkTerm,
    ToplevelT,
} from '@jerd/language/src/typing/types';
import * as React from 'react';
import { IconButton } from '../display/OpenGLCanvas';
import { runTerm } from '../eval';
import {
    ColorScrub,
    ColorScrub4,
    detectColor4Scrub,
    detectColorScrub,
} from './Color';
import { detectVec2Scrub, PositionScrub } from './Position';
import { RangeScrub } from './Range';
import {
    Cell,
    Content,
    Display,
    EvalEnv,
    RenderPlugins,
    TopContent,
} from '../State';
import { Position } from '../workspace/Cells';

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

const detectors = [detectVec2Scrub, detectColorScrub, detectColor4Scrub];

export const onClick = (
    env: Env,
    cell: Cell,
    addCell: (c: Content, p: Position) => void,
    setScrub: (s: null | Scrub) => void,
    term: Term | null,
    value: any,
    // setIdx: (idx: number) => void,
) => (evt: React.MouseEvent, id: string, kind: string, loc?: Location) => {
    // console.log(kind, id, loc);
    const position: Position = { type: 'after', id: cell.id };

    if (term != null && loc != null && loc.idx != null) {
        for (let detector of detectors) {
            const item = detector(kind, id, term, loc.idx);
            if (item != null) {
                const parent = (evt.target as HTMLElement).offsetParent!;
                const box = parent.getBoundingClientRect();
                const thisBox = (evt.target as HTMLElement).getBoundingClientRect();

                setScrub({
                    term,
                    returnValue: value,
                    item,
                    pos: {
                        left: thisBox.left - box.left,
                        top: thisBox.bottom - box.top,
                    },
                });
                return true;
            }
        }
    }

    if (kind === 'term' || kind === 'as') {
        addCell(
            {
                type: 'term',
                id: idFromName(id),
            },
            position,
        );
        return true;
    } else if (kind === 'type') {
        if (typeForId(env, id).type === 'Record') {
            addCell(recordContent(env, id), position);
            return true;
        } else {
            addCell(enumContent(env, id), position);
            return true;
        }
    } else if (kind === 'record') {
        addCell(recordContent(env, id), position);
        return true;
    } else if (kind === 'custom-binop') {
        const [term, type, idx] = id.split('#');
        if (!termForIdRaw(env, term)) {
            return false;
        }
        addCell(
            {
                type: 'term',
                id: idFromName(term),
            },
            position,
        );
        return true;
    } else if (kind === 'float' && term != null && loc && loc.idx != null) {
        const literal = findByIndex(term, loc.idx);
        if (!literal) {
            console.log('notfound by index');
            return false;
        }
        if (literal.type !== 'float') {
            console.error('found not a float');
            return false;
        }
        const parent = (evt.target as HTMLElement).offsetParent!;
        const box = parent.getBoundingClientRect();
        const thisBox = (evt.target as HTMLElement).getBoundingClientRect();

        setScrub({
            term,
            returnValue: value,
            item: {
                type: 'float',
                x: {
                    scrubbed: literal.value,
                    original: literal,
                    loc,
                },
            },
            pos: {
                left: thisBox.left - box.left,
                top: thisBox.bottom - box.top,
            },
        });
        return true;
    }
    return false;
};

const findByIndex = (term: Term, idx: number): Term | null => {
    let found: null | Term = null;
    walkTerm(term, (t) => {
        if (t.type !== 'Let' && t.location.idx === idx) {
            found = t;
            return false;
        }
    });
    return found;
};

const enumContent = (env: Env, rawId: string): Content => {
    return {
        type: 'enum',
        id: idFromName(rawId),
    };
};

const recordContent = (env: Env, rawId: string): Content => {
    return {
        type: 'record',
        id: idFromName(rawId),
    };
};

export const renderScrub = (
    env: Env,
    top: ToplevelT,
    scrub: Scrub,
    update: (term: Term, item: ScrubItem) => void,
    setScrub: (s: null | Scrub) => void,
    onPending: (c: Term) => void,
    evalEnv: EvalEnv,
) => {
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
                    onPending(scrub.term);
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
