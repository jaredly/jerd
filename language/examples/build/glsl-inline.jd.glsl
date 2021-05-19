#version 300 es

precision mediump float;

out vec4 fragColor;

const float PI = 3.14159;

uniform float u_time;

uniform vec2 u_resolution;

/* *
```
const EPSILON#ec7f8d1c: float = 0.00005
```
 */
const float Vec7f8d1c = 0.00005;

/**
```
const vec3#5808ec54: (Vec2#43802a16, float) ={}> Vec3#9f1c0644 = (v#:0: Vec2#43802a16, z#:1: float) ={}> Vec3#9f1c0644{
    ...v#:0,
    z#9f1c0644#0: z#:1,
}
```
*/
vec3 V5808ec54(
    vec2 v_0,
    float z_1
) {
    return vec3(v_0.x, v_0.y, z_1);
}

/**
```
const radians#dabe7f9c: (float) ={}> float = (degrees#:0: float) ={}> degrees#:0 / 180.0 * PI
```
*/
float Vdabe7f9c(
    float degrees_0
) {
    return ((degrees_0 / 180.00000) * PI);
}

/* *
```
const MAX_DIST#0ce717e6: float = 100.0
```
 */
const float V0ce717e6 = 100.00000;

/* *
```
const MIN_DIST#f2cd39b8: float = 0.0
```
 */
const float Vf2cd39b8 = 0.00000;

/**
```
const sceneSDF#6009ff98: (float, Vec3#9f1c0644) ={}> float = (
    iTime#:0: float,
    samplePoint#:1: Vec3#9f1c0644,
) ={}> {
    const double#:2 = iTime#:0 * 2.0;
    const p1#:3 = samplePoint#:1;
    length#1cc335a2(p1#:3) - 0.5;
}
```
*/
float V6009ff98(
    float iTime_0,
    vec3 samplePoint_1
) {
    return (length(samplePoint_1) - 0.50000);
}

/**
```
const shortestDistanceToSurface#47a027cc: (
    (float, Vec3#9f1c0644) ={}> float,
    float,
    Vec3#9f1c0644,
    Vec3#9f1c0644,
    float,
    float,
    int,
) ={}> float = (
    sceneSDF#:0: (float, Vec3#9f1c0644) ={}> float,
    iTime#:1: float,
    eye#:2: Vec3#9f1c0644,
    marchingDirection#:3: Vec3#9f1c0644,
    start#:4: float,
    end#:5: float,
    stepsLeft#:6: int,
) ={}> {
    if stepsLeft#:6 <= 0 {
        end#:5;
    } else {
        const dist#:7 = sceneSDF#:0(
            iTime#:1,
            AddSubVec3#28231a34."+"#4f27cf5e#0(
                eye#:2,
                ScaleVec3#c4a91006."*"#1de4e4c0#0(start#:4, marchingDirection#:3),
            ),
        );
        if dist#:7 < EPSILON#ec7f8d1c {
            start#:4;
        } else {
            const depth#:8 = start#:4 + dist#:7;
            if depth#:8 >= end#:5 {
                end#:5;
            } else {
                47a027cc(
                    sceneSDF#:0,
                    iTime#:1,
                    eye#:2,
                    marchingDirection#:3,
                    depth#:8,
                    end#:5,
                    stepsLeft#:6 - 1,
                );
            };
        };
    };
}
```
*/
float V47a027cc(
    invalid_lambda sceneSDF_0,
    float iTime_1,
    vec3 eye_2,
    vec3 marchingDirection_3,
    float start_4,
    float end_5,
    int stepsLeft_6
) {
    for (int i=0; i<10000; i++) {
        if ((stepsLeft_6 <= 0)) {
            return end_5;
        } else {
            float dist_7 = sceneSDF_0(iTime_1, (eye_2 + (start_4 * marchingDirection_3)));
            if ((dist_7 < Vec7f8d1c)) {
                return start_4;
            } else {
                float depth_8 = (start_4 + dist_7);
                if ((depth_8 >= end_5)) {
                    return end_5;
                } else {
                    sceneSDF_0 = sceneSDF_0;
                    iTime_1 = iTime_1;
                    eye_2 = eye_2;
                    marchingDirection_3 = marchingDirection_3;
                    start_4 = depth_8;
                    end_5 = end_5;
                    stepsLeft_6 = (stepsLeft_6 - 1);
                    continue;
                };
            };
        };
    };
}

/**
```
const rayDirection#6e9802d2: (float, Vec2#43802a16, Vec2#43802a16) ={}> Vec3#9f1c0644 = (
    fieldOfView#:0: float,
    size#:1: Vec2#43802a16,
    fragCoord#:2: Vec2#43802a16,
) ={}> {
    const xy#:3 = AddSubVec2#7d6a3886."-"#4f27cf5e#1(
        fragCoord#:2,
        ScaleVec2Rev#afc24bbe."/"#5ac12902#0(size#:1, 2.0),
    );
    const z#:4 = size#:1.y#43802a16#1 / tan(radians#dabe7f9c(fieldOfView#:0) / 2.0);
    normalize#ce463a80(vec3#5808ec54(xy#:3, -z#:4));
}
```
*/
vec3 V6e9802d2(
    float fieldOfView_0,
    vec2 size_1,
    vec2 fragCoord_2
) {
    return normalize(
        V5808ec54(
            (fragCoord_2 - (size_1 / 2.00000)),
            -(size_1.y / tan((Vdabe7f9c(fieldOfView_0) / 2.00000)))
        )
    );
}

/* *
```
const MAX_MARCHING_STEPS#62404440: int = 255
```
 */
const int V62404440 = 255;

/**
```
const fishingBoueys#58dc15f0: (float, Vec2#43802a16, Vec2#43802a16) ={}> Vec4#3b941378 = (
    iTime#:0: float,
    fragCoord#:1: Vec2#43802a16,
    iResolution#:2: Vec2#43802a16,
) ={}> {
    const dir#:3 = rayDirection#6e9802d2(45.0, iResolution#:2, fragCoord#:1);
    const eye#:4 = Vec3#9f1c0644{x#43802a16#0: 0.0, y#43802a16#1: 0.0, z#9f1c0644#0: 5.0};
    const dist#:5 = shortestDistanceToSurface#47a027cc(
        sceneSDF#6009ff98,
        iTime#:0,
        eye#:4,
        dir#:3,
        MIN_DIST#f2cd39b8,
        MAX_DIST#0ce717e6,
        MAX_MARCHING_STEPS#62404440,
    );
    if dist#:5 > MAX_DIST#0ce717e6 - EPSILON#ec7f8d1c {
        Vec4#3b941378{z#9f1c0644#0: 0.0, x#43802a16#0: 0.0, y#43802a16#1: 0.0, w#3b941378#0: 1.0};
    } else {
        Vec4#3b941378{z#9f1c0644#0: 0.0, x#43802a16#0: 1.0, y#43802a16#1: 0.0, w#3b941378#0: 1.0};
    };
}
```
*/
vec4 V58dc15f0(
    float iTime_0,
    vec2 fragCoord_1,
    vec2 iResolution_2
) {
    if ((V47a027cc(
        V6009ff98,
        iTime_0,
        vec3(0.00000, 0.00000, 5.00000),
        V6e9802d2(45.00000, iResolution_2, fragCoord_1),
        Vf2cd39b8,
        V0ce717e6,
        V62404440
    ) > (V0ce717e6 - Vec7f8d1c))) {
        return vec4(0.00000, 0.00000, 0.00000, 1.00000);
    } else {
        return vec4(1.00000, 0.00000, 0.00000, 1.00000);
    };
}

void main() {
    fragColor = V58dc15f0(u_time, gl_FragCoord.xy, u_resolution);
}