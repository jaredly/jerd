// At some point, it would be cool to have FixedArray implemented,
// and I can make this much simpler.

import { Location } from '../parsing/parser';
import { idName, newSym } from '../typing/env';
import {
    and,
    applyBuiltin,
    bool,
    builtin,
    builtinLocation,
    builtinType,
    float,
    floatLiteral,
    if_,
    int,
    intLiteral,
    or,
    pureFunction,
    refType,
    var_,
} from '../typing/preset';
// import * as preset from '../typing/preset';
import {
    Env,
    Lambda,
    Term,
    typesEqual,
    Sequence,
    Let,
    Symbol,
    Type,
} from '../typing/types';

const Vec2: Type = builtinType('vec2');
const Vec3: Type = builtinType('vec3');
const Vec4: Type = builtinType('vec4');
const Mat4: Type = builtinType('mat4');

// const Vec2: Type = refType('629a8360');
// const Vec3: Type = refType('14d8ae44');
// const Vec4: Type = refType('5026f640');
// const Mat4: Type = refType('d92781e8');

// const vec2 = (x: number, y: number, loc: Location) =>
//     applyBuiltin(
//         'vec4',
//         [floatLiteral(x, loc), floatLiteral(y, loc)],
//         Vec4,
//         loc,
//     );

const vec4 = (x: number, y: number, z: number, w: number, loc: Location) =>
    applyBuiltin(
        'vec4',
        [
            floatLiteral(x, loc),
            floatLiteral(y, loc),
            floatLiteral(z, loc),
            floatLiteral(w, loc),
        ],
        Vec4,
        loc,
    );

/*
Basic shape:

we want to add or multiply things such that we know if we're
(inside) a circle that (passed)
So we can say "distance to center of circle"

(t1 && (length(fragCoord - p1center) < circleSize)) ||
(t2 && (length(fragCoord - p2center) < circleSize)) ||
(t3 && (length(fragCoord - p3center) < circleSize)) ||
(t4 && (length(fragCoord - p4center) < circleSize)) ||

Vec2{x: (n % 20), y: int(n / 20)}

sooo should I just gen some plain text & parse it? Might be easiest.
*/
export const glslTester = (env: Env, tests: Array<Term>): Lambda => {
    const envSym = newSym(env, 'env');
    const fragCoord = newSym(env, 'fragCoord');
    const sizeSym = newSym(env, 'size');
    const rad = newSym(env, 'size');
    const syms: Array<Symbol> = [];
    const sts: Array<Term | Let> = tests.map((term, i) => {
        const sym = newSym(env, `t${i}`);
        const l: Let = {
            type: 'Let',
            location: builtinLocation,
            is: bool,
            binding: sym,
            value: term,
        };
        syms.push(sym);
        return l;
    });
    const loc = builtinLocation;
    sts.push({
        type: 'Let',
        location: loc,
        is: float,
        binding: sizeSym,
        value: applyBuiltin(
            '/',
            [
                {
                    type: 'Attribute',
                    idx: env.global.attributeNames['x'][0].idx,
                    location: loc,
                    inferred: false,
                    is: float,
                    ref: { type: 'user', id: env.global.typeNames['Vec2'][0] },
                    target: {
                        type: 'Attribute',
                        target: var_(
                            envSym,
                            refType(idName(env.global.typeNames['GLSLEnv'][0])),
                            loc,
                        ),
                        idx: env.global.attributeNames['resolution'][0].idx,
                        location: loc,
                        inferred: false,
                        is: Vec2,
                        ref: {
                            type: 'user',
                            id: env.global.typeNames['GLSLEnv'][0],
                        },
                    },
                },
                floatLiteral(20, loc),
            ],
            float,
            loc,
        ),
    });
    sts.push({
        type: 'Let',
        location: loc,
        is: float,
        binding: rad,
        value: applyBuiltin(
            '*',
            [var_(sizeSym, float, loc), floatLiteral(0.4, loc)],
            float,
            loc,
        ),
    });
    const posI = (i: number): Term =>
        applyBuiltin(
            '*',
            [
                applyBuiltin(
                    'vec2',
                    [
                        floatLiteral((i % 18) + 1, loc),
                        floatLiteral(Math.floor(i / 18) + 1, loc),
                    ],
                    Vec2,
                    loc,
                ),
                var_(sizeSym, float, loc),
            ],
            Vec2,
            loc,
        );

    const circles = syms.map((_, i) =>
        applyBuiltin(
            '<',
            [
                applyBuiltin(
                    'length',
                    [
                        applyBuiltin(
                            '-',
                            [var_(fragCoord, Vec2, loc), posI(i)],
                            Vec2,
                            loc,
                        ),
                    ],
                    int,
                    loc,
                ),
                var_(rad, float, loc),
            ],
            bool,
            loc,
        ),
    );

    const passing = syms
        .map((sym, i) => and(var_(sym, bool, loc), circles[i], loc))
        .reduce((one, two) => or(one, two, loc));

    const failing = syms
        .map((sym, i) =>
            and(
                applyBuiltin('!', [var_(sym, bool, loc)], bool, loc),
                circles[i],
                loc,
            ),
        )
        .reduce((one, two) => or(one, two, loc));

    sts.push(
        if_(
            passing,
            vec4(0.0, 1.0, 0.0, 1.0, loc),
            if_(
                failing,
                vec4(1.0, 0.0, 0.0, 1.0, loc),
                vec4(1.0, 1.0, 1.0, 1.0, loc),
                loc,
            ),
            loc,
        ),
    );
    const block: Sequence = {
        type: 'sequence',
        sts,
        location: builtinLocation,
        is: Vec4,
    };

    // const text = `
    // @main
    // const main = (env: GLSLEnv, coord: Vec2) => {
    //     int passing = ${};
    //     if passing
    //     int failing = ${};
    // }
    // `
    return {
        type: 'lambda',
        args: [envSym, fragCoord],
        body: block,
        location: builtinLocation,
        is: pureFunction(
            [refType(idName(env.global.typeNames['GLSLEnv'][0])), Vec2],
            Vec4,
        ),
    };
};

/*

const t1 = int(....);
const t2 = ....;

const passed =
    t1 * (length(fragCoord - t1pos) < circleSize)

const passed = min(
    t1 * (length(fragCoord - t1pos) - circleSize),
    min(
        t2 * (length(fragCoord - t2pos) - circleSize)
        ...
    )
);

// How do I "delete" something that is off vs on?
// Or I could just have a ton of ifs.
const failed = min(
    t1 * (length(fragCoord - t1pos) - circleSize),
    min(
        t2 * (length(fragCoord - t2pos) - circleSize)
        ...
    )
);



*/
