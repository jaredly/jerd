import React from 'react';
import { RgbaColorPicker } from 'react-colorful';
import {
    rgba_id,
    slider$1_id,
    slider$2_id,
    slider_id,
    Vec2_id,
    Vec3_id,
    Vec4_id,
} from '../../../language/src/printing/prelude-types';
import { idFromName, idName } from '../../../language/src/typing/env';
import {
    float,
    floatLiteral,
    int,
    refType,
} from '../../../language/src/typing/preset';
import {
    Decorator,
    nullLocation,
    Record,
    Term,
} from '../../../language/src/typing/types';

export const recordValues = (term: Record): Array<Term> | null => {
    const { base } = term;
    if (base.spread || base.type !== 'Concrete') {
        return null;
    }
    const res: Array<Term | null> = [];
    for (let sub of Object.keys(term.subTypes)) {
        if (term.subTypes[sub].spread) {
            return null;
        }
        res.push(...term.subTypes[sub].rows);
    }
    res.push(...base.rows);
    if (res.some((s) => s == null)) {
        return null;
    }
    return res as Array<Term>;
};

// export const record = ()

export const intValue = (term: Term) => {
    if (term.type === 'int') {
        return term.value;
    }
    if (term.type === 'unary' && term.op === '-' && term.inner.type === 'int') {
        return -term.inner.value;
    }
    return null;
};

export const floatValue = (term: Term) => {
    if (term.type === 'float') {
        return term.value;
    }
    if (
        term.type === 'unary' &&
        term.op === '-' &&
        term.inner.type === 'float'
    ) {
        return -term.inner.value;
    }
    return null;
};

export const recordFloats = (term: Term) => {
    if (term.type !== 'Record') {
        return null;
    }
    const values = recordValues(term);
    if (!values) {
        return null;
    }
    const asFloatsRaw = values.map(floatValue);
    if (asFloatsRaw.some((s) => s == null)) {
        return null;
    }
    return asFloatsRaw as Array<number>;
};

export const widgetForDecorator = (
    dec: Decorator,
    term: Term,
): null | React.FunctionComponent<{
    data: any;
    onUpdate: (term: Term, data: any) => void;
}> => {
    const hash = idName(dec.name.id);

    if (hash === slider$2_id) {
        const asInt = intValue(term);
        if (asInt == null || dec.args.length !== 3) {
            return null;
        }
        const min =
            dec.args[0].type === 'Term' ? intValue(dec.args[0].term) : null;
        const max =
            dec.args[1].type === 'Term' ? intValue(dec.args[1].term) : null;
        const step =
            dec.args[2].type === 'Term' ? intValue(dec.args[2].term) : null;
        if (min == null || max == null || step == null) {
            return null;
        }

        return ({ data, onUpdate }) => {
            return (
                <React.Fragment>
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={data == null ? asInt : data}
                        onChange={(evt) => {
                            const value = parseInt(evt.target.value);
                            const term: Term = {
                                type: 'int',
                                value,
                                is: int,
                                location: nullLocation,
                            };
                            onUpdate(term, value);
                        }}
                    />
                    {data == null ? asInt : data}
                </React.Fragment>
            );
        };
    }

    if (hash === slider$1_id) {
        const asFloat = floatValue(term);
        if (asFloat == null || dec.args.length !== 3) {
            return null;
        }
        const min =
            dec.args[0].type === 'Term' ? floatValue(dec.args[0].term) : null;
        const max =
            dec.args[1].type === 'Term' ? floatValue(dec.args[1].term) : null;
        const step =
            dec.args[2].type === 'Term' ? floatValue(dec.args[2].term) : null;
        if (min == null || max == null || step == null) {
            return null;
        }

        return ({ data, onUpdate }) => {
            return (
                <React.Fragment>
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={data == null ? asFloat : data}
                        onChange={(evt) => {
                            const value = +evt.target.value;
                            const term: Term = {
                                type: 'float',
                                value,
                                is: float,
                                location: nullLocation,
                            };
                            onUpdate(term, value);
                        }}
                    />
                    {data == null ? asFloat : data}
                </React.Fragment>
            );
        };
    }

    if (hash === slider_id) {
        const asFloats = recordFloats(term);
        if (!asFloats || dec.args.length !== 2) {
            return null;
        }
        const mins =
            dec.args[0].type === 'Term' ? recordFloats(dec.args[0].term) : null;
        const maxs =
            dec.args[1].type === 'Term' ? recordFloats(dec.args[1].term) : null;
        if (!mins || !maxs) {
            return null;
        }
        const height = maxs[1] - mins[1];
        const width = maxs[0] - mins[0];
        const scale = width / height;
        const fullHeight = 200;
        const fullWidth = fullHeight * scale;
        return ({ data, onUpdate }) => {
            const [moving, setMoving] = React.useState(false);
            const ref = React.useRef(null as null | HTMLDivElement);

            const onMouse = React.useCallback((cx, cy) => {
                if (!ref.current) {
                    return;
                }
                const box = ref.current.getBoundingClientRect();
                const x = cx - box.left;
                const y = fullHeight - (cy - box.top);
                const fx = (x / fullWidth) * width + mins[0];
                const fy = (y / fullHeight) * height + mins[1];

                const term: Record = {
                    type: 'Record',
                    base: {
                        type: 'Concrete',
                        ref: { type: 'user', id: idFromName(Vec2_id) },
                        location: nullLocation,
                        rows: [
                            floatLiteral(fx, nullLocation),
                            floatLiteral(fy, nullLocation),
                        ],
                        spread: null,
                    },
                    subTypes: {},
                    location: nullLocation,
                    is: refType(idFromName(Vec2_id)),
                };

                onUpdate(term, [fx, fy]);
            }, []);

            React.useEffect(() => {
                if (!moving) {
                    return;
                }
                const fn = (evt: MouseEvent) => {
                    onMouse(evt.clientX, evt.clientY);
                };
                const upfn = () => {
                    setMoving(false);
                };
                document.addEventListener('mousemove', fn);
                document.addEventListener('mouseup', upfn);
                return () => {
                    document.removeEventListener('mousemove', fn);
                    document.removeEventListener('mouseup', upfn);
                };
            }, [moving]);
            data = data || asFloats;
            const x = (data[0] - mins[0]) / width;
            const y = (data[1] - mins[1]) / height;
            return (
                <div
                    ref={(r) => (ref.current = r)}
                    style={{
                        position: 'relative',
                        height: fullHeight,
                        width: fullWidth,
                        backgroundColor: 'black',
                    }}
                    onMouseDown={(evt) => {
                        onMouse(evt.clientX, evt.clientY);
                        setMoving(true);
                        evt.stopPropagation();
                        evt.preventDefault();
                    }}
                    onMouseMove={(evt) => {}}
                >
                    <div
                        style={{
                            top: fullHeight - y * fullHeight,
                            left: x * fullWidth,
                            position: 'absolute',
                            width: 4,
                            height: 4,
                            marginLeft: -2,
                            marginTop: -2,
                            backgroundColor: 'white',
                            pointerEvents: 'none',
                        }}
                    />
                    <div
                        style={{
                            bottom: 8,
                            right: 8,
                            color: '#aaa',
                            fontSize: 10,
                        }}
                    >
                        {data[0].toFixed(2)}, {data[1].toFixed(2)}
                    </div>
                    <div
                        style={{
                            backgroundColor: '#555',
                            height: 2,
                            marginTop: -1,
                            width: fullWidth,
                            position: 'absolute',
                            left: 0,
                            top: (-mins[1] / height) * fullHeight,
                        }}
                    />
                    <div
                        style={{
                            backgroundColor: '#555',
                            width: 2,
                            height: fullHeight,
                            marginLeft: -1,
                            position: 'absolute',
                            top: 0,
                            left: (-mins[0] / width) * fullWidth,
                        }}
                    />
                </div>
            );
        };
    }
    if (hash === rgba_id) {
        const asFloats = recordFloats(term);
        if (!asFloats) {
            return null;
        }
        return ({
            data,
            onUpdate,
        }: {
            data: any;
            onUpdate: (term: Term, data: any) => void;
        }) => (
            <RgbaColorPicker
                color={
                    data
                        ? data
                        : {
                              r: asFloats[0] * 255,
                              g: asFloats[1] * 255,
                              b: asFloats[2] * 255,
                              a: asFloats[3],
                          }
                }
                onChange={(rgb) => {
                    const smaller = { ...rgb };
                    // 2 decimals
                    smaller.r /= 255;
                    smaller.g /= 255;
                    smaller.b /= 255;

                    const term: Record = {
                        type: 'Record',
                        base: {
                            type: 'Concrete',
                            ref: { type: 'user', id: idFromName(Vec4_id) },
                            rows: [floatLiteral(smaller.a, nullLocation)],
                            location: nullLocation,
                            spread: null,
                        },
                        subTypes: {
                            [Vec2_id]: {
                                covered: true,
                                spread: null,
                                rows: [
                                    floatLiteral(smaller.r, nullLocation),
                                    floatLiteral(smaller.g, nullLocation),
                                ],
                            },
                            [Vec3_id]: {
                                covered: true,
                                spread: null,
                                rows: [floatLiteral(smaller.b, nullLocation)],
                            },
                        },
                        location: nullLocation,
                        is: refType(idFromName(Vec4_id)),
                    };

                    onUpdate(term, rgb);
                }}
            />
        );
    }
    return null;
};
