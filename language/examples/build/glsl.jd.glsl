#version 300 es
precision mediump float;
out vec4 fragColor;
const float PI = 3.14159;
uniform float u_time;
uniform vec2 u_mouse;
uniform int u_mousebutton;
uniform vec3 u_camera;
uniform vec2 u_resolution;
struct GLSLEnv_451d5252{
    float time;
    vec2 resolution;
    vec3 camera;
    vec2 mouse;
};
// skipping Neg_3c2a4898, contains type variables
// skipping Div_5ac12902, contains type variables
// skipping Mul_1de4e4c0, contains type variables
// skipping AddSub_b99b22d8, contains type variables
/**
```
const opRepLim#cffec7f4 = (p#:0: Vec3#9f1c0644, c#:1: float#builtin, l#:2: Vec3#9f1c0644): Vec3#9f1c0644 ={}> {
    p#:0 
        -#1c6fdd91#b99b22d8#1 c#:1 
            *#c4a91006#1de4e4c0#0 clamp#5483fdc2(
                v: round#65acfcda(v: p#:0 /#68f73ad4#5ac12902#0 c#:1),
                min: NegVec3#a5cd53ce."-"#3c2a4898#0(l#:2),
                max: l#:2,
            );
}
```
*/
/* (
    p#:0: Vec3#🐬,
    c#:1: float,
    l#:2: Vec3#🐬,
): Vec3#🐬 => p#:0 - c#:1 * clamp(round(p#:0 / c#:1), -(l#:2), l#:2) */
vec3 opRepLim_cffec7f4(vec3 p_0, float c_1, vec3 l_2) {
    return (p_0 - (c_1 * clamp(round((p_0 / c_1)), -l_2, l_2)));
}
/**
```
const sminCubic#e7c85424 = (a#:0: float#builtin, b#:1: float#builtin, k#:2: float#builtin): float#builtin ={}> {
    const h#:3 = max#builtin(k#:2 -#builtin abs#builtin(a#:0 -#builtin b#:1), 0.0) /#builtin k#:2;
    const sixth#:4 = 1.0 /#builtin 6.0;
    min#builtin(a#:0, b#:1) 
        -#builtin h#:3 *#builtin h#:3 *#builtin h#:3 *#builtin k#:2 *#builtin sixth#:4;
}
```
*/
/* (
    a#:0: float,
    b#:1: float,
    k#:2: float,
): float => {
    const h#:3: float = max(k#:2 - abs(a#:0 - b#:1), 0) / k#:2;
    return min(a#:0, b#:1) - h#:3 * h#:3 * h#:3 * k#:2 * 1 / 6;
} */
float sminCubic_e7c85424(float a_0, float b_1, float k_2) {
    float h = (max((k_2 - abs((a_0 - b_1))), 0.0) / k_2);
    return (min(a_0, b_1) - ((((h * h) * h) * k_2) * (1.0 / 6.0)));
}
/* *
```
const EPSILON#ec7f8d1c = 0.00005
```
 */
/*0.00005*/const float EPSILON_ec7f8d1c = 0.00005;
/**
```
const sceneSDF#e602af6c = (iTime#:0: float#builtin, samplePoint#:1: Vec3#9f1c0644): float#builtin ={}> {
    const double#:2 = iTime#:0 *#builtin 2.0;
    const p2#:3 = samplePoint#:1 
        -#1c6fdd91#b99b22d8#1 Vec3#9f1c0644{
            x#43802a16#0: -sin#builtin(double#:2) /#builtin 2.0,
            y#43802a16#1: sin#builtin(iTime#:0 /#builtin 4.0) /#builtin 2.0,
            z#9f1c0644#0: cos#builtin(double#:2) /#builtin 2.0,
        };
    const p1#:4 = samplePoint#:1;
    const p2#:5 = opRepLim#cffec7f4(
        p: p2#:3,
        c: 0.1,
        l: Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0},
    );
    sminCubic#e7c85424(
        a: length#63e16b7a(v: p1#:4) -#builtin 0.5,
        b: length#63e16b7a(v: p2#:5) -#builtin 0.03,
        k: 0.1,
    );
}
```
*/
/* (
    iTime#:0: float,
    samplePoint#:1: Vec3#🐬,
): float => {
    const double#:2: float = iTime#:0 * 2;
    return sminCubic#😶(
        length(samplePoint#:1) - 0.5,
        length(opRepLim#🧿(samplePoint#:1 - Vec3#🐬{TODO SPREADs}{z: cos(double#:2) / 2, x: -sin(double#:2) / 2, y: sin(iTime#:0 / 4) / 2}, 0.1, Vec3#🐬{TODO SPREADs}{z: 1, x: 1, y: 1})) - 0.03,
        0.1,
    );
} */
float sceneSDF_e602af6c(float iTime_0, vec3 samplePoint_1) {
    float double = (iTime_0 * 2.0);
    return sminCubic_e7c85424(
        (length(samplePoint_1) - 0.50),
        (length(opRepLim_cffec7f4((samplePoint_1 - vec3((-sin(double) / 2.0), (sin((iTime_0 / 4.0)) / 2.0), (cos(double) / 2.0))), 0.10, vec3(1.0, 1.0, 1.0))) - 0.030),
        0.10
    );
}
/**
```
const estimateNormal#db522060 = (iTime#:0: float#builtin, p#:1: Vec3#9f1c0644): Vec3#9f1c0644 ={}> normalize#48e6ea27(
    v: Vec3#9f1c0644{
        x#43802a16#0: sceneSDF#e602af6c(
                iTime#:0,
                samplePoint: Vec3#9f1c0644{
                    ...p#:1,
                    x#43802a16#0: p#:1.x#43802a16#0 +#builtin EPSILON#ec7f8d1c,
                },
            ) 
            -#builtin sceneSDF#e602af6c(
                iTime#:0,
                samplePoint: Vec3#9f1c0644{
                    ...p#:1,
                    x#43802a16#0: p#:1.x#43802a16#0 -#builtin EPSILON#ec7f8d1c,
                },
            ),
        y#43802a16#1: sceneSDF#e602af6c(
                iTime#:0,
                samplePoint: Vec3#9f1c0644{
                    ...p#:1,
                    y#43802a16#1: p#:1.y#43802a16#1 +#builtin EPSILON#ec7f8d1c,
                },
            ) 
            -#builtin sceneSDF#e602af6c(
                iTime#:0,
                samplePoint: Vec3#9f1c0644{
                    ...p#:1,
                    y#43802a16#1: p#:1.y#43802a16#1 -#builtin EPSILON#ec7f8d1c,
                },
            ),
        z#9f1c0644#0: sceneSDF#e602af6c(
                iTime#:0,
                samplePoint: Vec3#9f1c0644{
                    ...p#:1,
                    z#9f1c0644#0: p#:1.z#9f1c0644#0 +#builtin EPSILON#ec7f8d1c,
                },
            ) 
            -#builtin sceneSDF#e602af6c(
                iTime#:0,
                samplePoint: Vec3#9f1c0644{
                    ...p#:1,
                    z#9f1c0644#0: p#:1.z#9f1c0644#0 -#builtin EPSILON#ec7f8d1c,
                },
            ),
    },
)
```
*/
/* (
    iTime#:0: float,
    p#:1: Vec3#🐬,
): Vec3#🐬 => normalize(
    Vec3#🐬{TODO SPREADs}{
        z: sceneSDF#⏳(iTime#:0, Vec3#🐬{TODO SPREADs}{z: p#:1.#Vec3#🐬#0 + EPSILON#🧑‍💻, x: p#:1.#Vec2#🐭😉😵😃#0, y: p#:1.#Vec2#🐭😉😵😃#1}) - sceneSDF#⏳(
            iTime#:0,
            Vec3#🐬{TODO SPREADs}{z: p#:1.#Vec3#🐬#0 - EPSILON#🧑‍💻, x: p#:1.#Vec2#🐭😉😵😃#0, y: p#:1.#Vec2#🐭😉😵😃#1},
        ),
        x: sceneSDF#⏳(iTime#:0, Vec3#🐬{TODO SPREADs}{z: p#:1.#Vec3#🐬#0, x: p#:1.#Vec2#🐭😉😵😃#0 + EPSILON#🧑‍💻, y: p#:1.#Vec2#🐭😉😵😃#1}) - sceneSDF#⏳(
            iTime#:0,
            Vec3#🐬{TODO SPREADs}{z: p#:1.#Vec3#🐬#0, x: p#:1.#Vec2#🐭😉😵😃#0 - EPSILON#🧑‍💻, y: p#:1.#Vec2#🐭😉😵😃#1},
        ),
        y: sceneSDF#⏳(iTime#:0, Vec3#🐬{TODO SPREADs}{z: p#:1.#Vec3#🐬#0, x: p#:1.#Vec2#🐭😉😵😃#0, y: p#:1.#Vec2#🐭😉😵😃#1 + EPSILON#🧑‍💻}) - sceneSDF#⏳(
            iTime#:0,
            Vec3#🐬{TODO SPREADs}{z: p#:1.#Vec3#🐬#0, x: p#:1.#Vec2#🐭😉😵😃#0, y: p#:1.#Vec2#🐭😉😵😃#1 - EPSILON#🧑‍💻},
        ),
    },
) */
vec3 estimateNormal_db522060(float iTime_0, vec3 p_1) {
    return normalize(
        vec3(
            (sceneSDF_e602af6c(iTime_0, vec3((p_1.x + EPSILON_ec7f8d1c), p_1.y, p_1.z)) - sceneSDF_e602af6c(iTime_0, vec3((p_1.x - EPSILON_ec7f8d1c), p_1.y, p_1.z))),
            (sceneSDF_e602af6c(iTime_0, vec3(p_1.x, (p_1.y + EPSILON_ec7f8d1c), p_1.z)) - sceneSDF_e602af6c(iTime_0, vec3(p_1.x, (p_1.y - EPSILON_ec7f8d1c), p_1.z))),
            (sceneSDF_e602af6c(iTime_0, vec3(p_1.x, p_1.y, (p_1.z + EPSILON_ec7f8d1c))) - sceneSDF_e602af6c(iTime_0, vec3(p_1.x, p_1.y, (p_1.z - EPSILON_ec7f8d1c))))
        )
    );
}
/**
```
const isPointingTowardLight#71966b12 = (
    iTime#:0: float#builtin,
    p#:1: Vec3#9f1c0644,
    lightPos#:2: Vec3#9f1c0644,
): bool#builtin ={}> {
    const N#:3 = estimateNormal#db522060(iTime#:0, p#:1);
    const L#:4 = normalize#48e6ea27(v: lightPos#:2 -#1c6fdd91#b99b22d8#1 p#:1);
    const dotLN#:5 = dot#255c39c3(a: L#:4, b: N#:3);
    dotLN#:5 >=#builtin 0.0;
}
```
*/
/* (
    iTime#:0: float,
    p#:1: Vec3#🐬,
    lightPos#:2: Vec3#🐬,
): bool => dot(normalize(lightPos#:2 - p#:1), estimateNormal#🤡(iTime#:0, p#:1)) >= 0 */
bool isPointingTowardLight_71966b12(float iTime_0, vec3 p_1, vec3 lightPos_2) {
    return (dot(normalize((lightPos_2 - p_1)), estimateNormal_db522060(iTime_0, p_1)) >= 0.0);
}
/* *
```
const MAX_DIST#0ce717e6 = 100.0
```
 */
/*100*/const float MAX_DIST_0ce717e6 = 100.0;
/* *
```
const MIN_DIST#f2cd39b8 = 0.0
```
 */
/*0*/const float MIN_DIST_f2cd39b8 = 0.0;
/**
```
const rec shortestDistanceToSurface#8ce5f688 = (
    iTime#:0: float#builtin,
    eye#:1: Vec3#9f1c0644,
    marchingDirection#:2: Vec3#9f1c0644,
    start#:3: float#builtin,
    end#:4: float#builtin,
    stepsLeft#:5: int#builtin,
): float#builtin ={}> {
    if stepsLeft#:5 <=#builtin 0 {
        end#:4;
    } else {
        const dist#:6 = sceneSDF#e602af6c(
            iTime#:0,
            samplePoint: eye#:1 
                +#1c6fdd91#b99b22d8#0 start#:3 *#c4a91006#1de4e4c0#0 marchingDirection#:2,
        );
        if dist#:6 <#builtin EPSILON#ec7f8d1c {
            start#:3;
        } else {
            const depth#:7 = start#:3 +#builtin dist#:6;
            if depth#:7 >=#builtin end#:4 {
                end#:4;
            } else {
                8ce5f688#self(
                    iTime#:0,
                    eye#:1,
                    marchingDirection#:2,
                    depth#:7,
                    end#:4,
                    stepsLeft#:5 -#builtin 1,
                );
            };
        };
    };
}
```
*/
/* (
    iTime#:0: float,
    eye#:1: Vec3#🐬,
    marchingDirection#:2: Vec3#🐬,
    start#:3: float,
    end#:4: float,
    stepsLeft#:5: int,
): float => {
    for (; stepsLeft#:5 > 0; stepsLeft#:5 = stepsLeft#:5 - 1) {
        const dist#:6: float = sceneSDF#⏳(iTime#:0, eye#:1 + start#:3 * marchingDirection#:2);
        if dist#:6 < EPSILON#🧑‍💻 {
            return start#:3;
        } else {
            const depth#:7: float = start#:3 + dist#:6;
            if depth#:7 >= end#:4 {
                return end#:4;
            } else {
                start#:3 = depth#:7;
                continue;
            };
        };
    };
    return end#:4;
} */
float shortestDistanceToSurface_8ce5f688(float iTime_0, vec3 eye_1, vec3 marchingDirection_2, float start_3, float end_4, int stepsLeft_5) {
    for (; stepsLeft_5 > 0; stepsLeft_5 = (stepsLeft_5 - 1)) {
        float dist = sceneSDF_e602af6c(iTime_0, (eye_1 + (start_3 * marchingDirection_2)));
        if ((dist < EPSILON_ec7f8d1c)) {
            return start_3;
        } else {
            float depth = (start_3 + dist);
            if ((depth >= end_4)) {
                return end_4;
            } else {
                start_3 = depth;
                continue;
            };
        };
    };
    return end_4;
}
/**
```
const rayDirection#6258178a = (
    fieldOfView#:0: float#builtin,
    size#:1: Vec2#43802a16,
    fragCoord#:2: Vec2#43802a16,
): Vec3#9f1c0644 ={}> {
    const xy#:3 = fragCoord#:2 -#70bb2056#b99b22d8#1 size#:1 /#afc24bbe#5ac12902#0 2.0;
    const z#:4 = size#:1.y#43802a16#1 
        /#builtin tan#builtin(radians#dabe7f9c(degrees: fieldOfView#:0) /#builtin 2.0);
    normalize#48e6ea27(v: vec3#5808ec54(v: xy#:3, z: -z#:4));
}
```
*/
/* (
    fieldOfView#:0: float,
    size#:1: Vec2#🐭😉😵😃,
    fragCoord#:2: Vec2#🐭😉😵😃,
): Vec3#🐬 => normalize(vec3(fragCoord#:2 - size#:1 / 2, -size#:1.#Vec2#🐭😉😵😃#1 / tan(radians(fieldOfView#:0) / 2))) */
vec3 rayDirection_6258178a(
    float fieldOfView_0,
    vec2 size_1,
    vec2 fragCoord_2
) {
    return normalize(vec3((fragCoord_2 - (size_1 / 2.0)), -(size_1.y / tan((radians(fieldOfView_0) / 2.0)))));
}
/* *
```
const MAX_MARCHING_STEPS#62404440 = 255
```
 */
/*255*/const int MAX_MARCHING_STEPS_62404440 = 255;
/**
```
const fishingBoueys#4713c0cc = (
    iTime#:0: float#builtin,
    fragCoord#:1: Vec2#43802a16,
    iResolution#:2: Vec2#43802a16,
): Vec4#3b941378 ={}> {
    const dir#:3 = rayDirection#6258178a(fieldOfView: 45.0, size: iResolution#:2, fragCoord#:1);
    const eye#:4 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 5.0};
    const dist#:5 = shortestDistanceToSurface#8ce5f688(
        iTime#:0,
        eye#:4,
        marchingDirection: dir#:3,
        start: MIN_DIST#f2cd39b8,
        end: MAX_DIST#0ce717e6,
        stepsLeft: MAX_MARCHING_STEPS#62404440,
    );
    const light#:6 = 0.2;
    if dist#:5 >#builtin MAX_DIST#0ce717e6 -#builtin EPSILON#ec7f8d1c {
        Vec4#3b941378{
            z#9f1c0644#0: 0.0,
            x#43802a16#0: 0.0,
            y#43802a16#1: 0.0,
            w#3b941378#0: 1.0,
        };
    } else {
        const worldPosForPixel#:7 = eye#:4 
            +#1c6fdd91#b99b22d8#0 dist#:5 *#c4a91006#1de4e4c0#0 dir#:3;
        const K_a#:8 = Vec3#9f1c0644{x#43802a16#0: 0.9, y#43802a16#1: 0.2, z#9f1c0644#0: 0.3};
        const K_d#:9 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.2, z#9f1c0644#0: 0.7};
        const K_s#:10 = Vec3#9f1c0644{x#43802a16#0: 1.0, y#43802a16#1: 1.0, z#9f1c0644#0: 1.0};
        const shininess#:11 = 10.0;
        const light1Pos#:12 = Vec3#9f1c0644{
            x#43802a16#0: 10.0 *#builtin sin#builtin(iTime#:0),
            y#43802a16#1: 10.0 *#builtin cos#builtin(iTime#:0),
            z#9f1c0644#0: 5.0,
        };
        const toLight#:13 = light1Pos#:12 -#1c6fdd91#b99b22d8#1 worldPosForPixel#:7;
        if isPointingTowardLight#71966b12(iTime#:0, p: worldPosForPixel#:7, lightPos: light1Pos#:12) {
            const marchToLight#:14 = shortestDistanceToSurface#8ce5f688(
                iTime#:0,
                eye: light1Pos#:12,
                marchingDirection: -1.0 *#c4a91006#1de4e4c0#0 normalize#48e6ea27(v: toLight#:13),
                start: MIN_DIST#f2cd39b8,
                end: MAX_DIST#0ce717e6,
                stepsLeft: MAX_MARCHING_STEPS#62404440,
            );
            if marchToLight#:14 
                >#builtin MAX_DIST#0ce717e6 -#builtin EPSILON#ec7f8d1c *#builtin 10.0 {
                Vec4#3b941378{...white#0678f03c *#1d31aa6e#1de4e4c0#0 light#:6, w#3b941378#0: 1.0};
            } else {
                const offset#:15 = marchToLight#:14 -#builtin length#63e16b7a(v: toLight#:13);
                const penumbra#:16 = 0.1;
                if offset#:15 <#builtin -EPSILON#ec7f8d1c *#builtin 1000.0 {
                    Vec4#3b941378{
                        ...white#0678f03c *#1d31aa6e#1de4e4c0#0 light#:6,
                        w#3b941378#0: 1.0,
                    };
                } else {
                    Vec4#3b941378{...white#0678f03c, w#3b941378#0: 1.0};
                };
            };
        } else {
            Vec4#3b941378{...white#0678f03c *#1d31aa6e#1de4e4c0#0 light#:6, w#3b941378#0: 1.0};
        };
    };
}
```
*/
/* (
    iTime#:0: float,
    fragCoord#:1: Vec2#🐭😉😵😃,
    iResolution#:2: Vec2#🐭😉😵😃,
): Vec4#🕒🧑‍🏫🎃 => {
    const dir#:3: Vec3#🐬 = rayDirection#🌑🐂🦨😃(45, iResolution#:2, fragCoord#:1);
    const eye#:4: Vec3#🐬 = Vec3#🐬{TODO SPREADs}{z: 5, x: 0, y: 0};
    const dist#:5: float = shortestDistanceToSurface#🧅(iTime#:0, eye#:4, dir#:3, MIN_DIST#🤾‍♂️, MAX_DIST#🥅👬👨‍🦰, MAX_MARCHING_STEPS#😟😗🦦😃);
    if dist#:5 > MAX_DIST#🥅👬👨‍🦰 - EPSILON#🧑‍💻 {
        return Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: 1, z: 0};
    } else {
        const worldPosForPixel#:7: Vec3#🐬 = eye#:4 + dist#:5 * dir#:3;
        const light1Pos#:12: Vec3#🐬 = Vec3#🐬{TODO SPREADs}{z: 5, x: 10 * sin(iTime#:0), y: 10 * cos(iTime#:0)};
        const toLight#:13: Vec3#🐬 = light1Pos#:12 - worldPosForPixel#:7;
        if isPointingTowardLight#🕍🏄‍♂️🏙️😃(iTime#:0, worldPosForPixel#:7, light1Pos#:12) {
            const marchToLight#:14: float = shortestDistanceToSurface#🧅(iTime#:0, light1Pos#:12, -1 * normalize(toLight#:13), MIN_DIST#🤾‍♂️, MAX_DIST#🥅👬👨‍🦰, MAX_MARCHING_STEPS#😟😗🦦😃);
            if marchToLight#:14 > MAX_DIST#🥅👬👨‍🦰 - EPSILON#🧑‍💻 * 10 {
                const spread#:16: Vec3#🐬 = Vec3#🐬{TODO SPREADs}{z: 1, x: 1, y: 1} * 0.2;
                return Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: 1, z: spread#:16.#Vec3#🐬#0};
            } else {
                if marchToLight#:14 - length(toLight#:13) < -EPSILON#🧑‍💻 * 1000 {
                    const spread#:17: Vec3#🐬 = Vec3#🐬{TODO SPREADs}{z: 1, x: 1, y: 1} * 0.2;
                    return Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: 1, z: spread#:17.#Vec3#🐬#0};
                } else {
                    return Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: 1, z: 1};
                };
            };
        } else {
            const spread#:18: Vec3#🐬 = Vec3#🐬{TODO SPREADs}{z: 1, x: 1, y: 1} * 0.2;
            return Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: 1, z: spread#:18.#Vec3#🐬#0};
        };
    };
} */
vec4 fishingBoueys_4713c0cc(float iTime_0, vec2 fragCoord_1, vec2 iResolution_2) {
    vec3 dir = rayDirection_6258178a(45.0, iResolution_2, fragCoord_1);
    vec3 eye = vec3(0.0, 0.0, 5.0);
    float dist_5 = shortestDistanceToSurface_8ce5f688(iTime_0, eye, dir, MIN_DIST_f2cd39b8, MAX_DIST_0ce717e6, MAX_MARCHING_STEPS_62404440);
    if ((dist_5 > (MAX_DIST_0ce717e6 - EPSILON_ec7f8d1c))) {
        return vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        vec3 worldPosForPixel = (eye + (dist_5 * dir));
        vec3 light1Pos = vec3((10.0 * sin(iTime_0)), (10.0 * cos(iTime_0)), 5.0);
        vec3 toLight = (light1Pos - worldPosForPixel);
        if (isPointingTowardLight_71966b12(iTime_0, worldPosForPixel, light1Pos)) {
            float marchToLight = shortestDistanceToSurface_8ce5f688(iTime_0, light1Pos, (-1.0 * normalize(toLight)), MIN_DIST_f2cd39b8, MAX_DIST_0ce717e6, MAX_MARCHING_STEPS_62404440);
            if ((marchToLight > (MAX_DIST_0ce717e6 - (EPSILON_ec7f8d1c * 10.0)))) {
                vec3 spread = (vec3(1.0, 1.0, 1.0) * 0.20);
                return vec4(spread.x, spread.y, spread.z, 1.0);
            } else {
                if (((marchToLight - length(toLight)) < (-EPSILON_ec7f8d1c * 1000.0))) {
                    vec3 spread_17 = (vec3(1.0, 1.0, 1.0) * 0.20);
                    return vec4(spread_17.x, spread_17.y, spread_17.z, 1.0);
                } else {
                    return vec4(1.0, 1.0, 1.0, 1.0);
                };
            };
        } else {
            vec3 spread_18 = (vec3(1.0, 1.0, 1.0) * 0.20);
            return vec4(spread_18.x, spread_18.y, spread_18.z, 1.0);
        };
    };
}
/**
```
const random#347089ef = (st#:0: Vec2#43802a16): float#builtin ={}> {
    fract#495c4d22(
        v: sin#builtin(
                dot#369652bb(
                    a: st#:0,
                    b: Vec2#43802a16{x#43802a16#0: 12.9898, y#43802a16#1: 78.233},
                ),
            ) 
            *#builtin 43758.5453123,
    );
}
```
*/
/* (
    st#:0: Vec2#🐭😉😵😃,
): float => fract(sin(dot(st#:0, Vec2#🐭😉😵😃{TODO SPREADs}{x: 12.9898, y: 78.233})) * 43758.5453123) */
float random_347089ef(vec2 st_0) {
    return fract((sin(dot(st_0, vec2(12.98980, 78.2330))) * 43758.54531));
}
/**
```
const randFolks#50e82492 = (env#:0: GLSLEnv#451d5252, fragCoord#:1: Vec2#43802a16): Vec4#3b941378 ={}> {
    const scale#:2 = 14.0;
    const small#:3 = round#b9171b62(v: fragCoord#:1 /#afc24bbe#5ac12902#0 scale#:2) 
        *#28569bc0#1de4e4c0#0 scale#:2;
    const small#:4 = Vec2#43802a16{
        x#43802a16#0: small#:3.x#43802a16#0,
        y#43802a16#1: small#:3.y#43802a16#1 +#builtin env#:0.time#451d5252#0,
    };
    const v#:5 = random#347089ef(st: small#:4 /#090f77e7#5ac12902#0 env#:0.resolution#451d5252#1) 
            /#builtin 10.0 
        +#builtin 0.9;
    const two#:6 = Vec4#3b941378{...red#7d188c3c *#1d31aa6e#1de4e4c0#0 v#:5, w#3b941378#0: 1.0} 
        +#0555d260#b99b22d8#0 fishingBoueys#4713c0cc(
            iTime: env#:0.time#451d5252#0,
            fragCoord#:1,
            iResolution: env#:0.resolution#451d5252#1,
        );
    two#:6 /#56d43c0e#5ac12902#0 2.0;
}
```
*/
/* (
    env#:0: GLSLEnv#🕷️⚓😣😃,
    fragCoord#:1: Vec2#🐭😉😵😃,
): Vec4#🕒🧑‍🏫🎃 => {
    const small#:3: Vec2#🐭😉😵😃 = round(fragCoord#:1 / 14) * 14;
    const spread#:7: Vec3#🐬 = Vec3#🐬{TODO SPREADs}{z: 0, x: 1, y: 0} * random#🦧😐🚲(
        Vec2#🐭😉😵😃{TODO SPREADs}{x: small#:3.#Vec2#🐭😉😵😃#0, y: small#:3.#Vec2#🐭😉😵😃#1 + env#:0.#GLSLEnv#🕷️⚓😣😃#0} / env#:0.#GLSLEnv#🕷️⚓😣😃#1,
    ) / 10 + 0.9;
    return (Vec4#🕒🧑‍🏫🎃{TODO SPREADs}{w: 1, z: spread#:7.#Vec3#🐬#0} + fishingBoueys#👨🙋‍♂️🙉😃(env#:0.#GLSLEnv#🕷️⚓😣😃#0, fragCoord#:1, env#:0.#GLSLEnv#🕷️⚓😣😃#1)) / (2);
} */
vec4 randFolks_50e82492(GLSLEnv_451d5252 env_0, vec2 fragCoord_1) {
    vec2 small = (round((fragCoord_1 / 14.0)) * 14.0);
    vec3 spread_7 = (vec3(1.0, 0.0, 0.0) * ((random_347089ef((vec2(small.x, (small.y + env_0.time)) / env_0.resolution)) / 10.0) + 0.90));
    return ((vec4(spread_7.x, spread_7.y, spread_7.z, 1.0) + fishingBoueys_4713c0cc(env_0.time, fragCoord_1, env_0.resolution)) / 2.0);
}
void main() {
    fragColor = randFolks_50e82492(GLSLEnv_451d5252(u_time, u_resolution, u_camera, u_mouse), gl_FragCoord.xy);
}