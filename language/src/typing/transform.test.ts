import { parse } from '../parsing/grammar';
import { loadInit } from '../printing/loadPrelude';
import { getSortedTermDependencies, getUserDependencies } from './analyze';
import { hashObject, idFromName, idName } from './env';
import { presetEnv } from './preset';
import { transform } from './transform';
import { typeFile } from './typeFile';
import { newWithGlobal } from './types';

// const init = presetEnv({}).global;
const init = loadInit().initialEnv;

const typeExpr = (text: string) => {
    const initialEnv = newWithGlobal(init);
    return typeFile(parse(text), initialEnv, 'test');
};

describe('getUserDependencies', () => {
    it('should not change with a no-op visitor', () => {
        const {
            expressions: [term],
        } = typeExpr(`23`);
        expect(transform(term, { term: () => null })).toBe(term);
    });
    it('should not change a complex thing with a no-op visitor', () => {
        const {
            expressions: [term],
        } = typeExpr(`
		@ffi("Vec2") type Vec2 = {
			x: float,
			y: float,
		}
		
		@ffi("Vec3") type Vec3 = {
			...Vec2,
			z: float,
		}
		
		type Mul<A, B, C> = {
			"*": (A, B) ={}> C,
		}
		
		type Div<A, B, C> = {
			"/": (A, B) ={}> C,
		}
		
		type AddSub<A, B, C> = {
			"+": (A, B) ={}> C,
			"-": (A, B) ={}> C,
		}
		
		@ffi("Vec4") type Vec4 = {
			...Vec3,
			w: float,
		}
		
		@ffi("GLSLEnv") type GLSLEnv = {
			time: float,
			resolution: Vec2,
			camera: Vec3,
			mouse: Vec2,
		}
		
		const lerp = (a: float, b: float, c: float): float ={}> c 
				* (b - a) 
			+ a
		
		const mix = (a: Vec4, b: Vec4, c: float): Vec4 ={}> {
			Vec4{
				z: lerp(a: a.z, b: b.z, c),
				x: lerp(a: a.x, b: b.x, c),
				y: lerp(a: a.y, b: b.y, c),
				w: lerp(a: a.w, b: b.w, c),
			};
		}
		
		const AddSubVec2 = AddSub<Vec2, Vec2, Vec2>{
			"+": (one: Vec2, two: Vec2): Vec2 ={}> Vec2{
				x: one.x + two.x,
				y: one.y + two.y,
			},
			"-": (one: Vec2, two: Vec2): Vec2 ={}> Vec2{
				x: one.x - two.x,
				y: one.y - two.y,
			},
		}
		
		const length = (v: Vec2): float ={}> sqrt(
			v.x * v.x 
				+ v.y * v.y,
		)
		
		const dot = (a: Vec2, b: Vec2): float ={}> {
			a.x * b.x 
				+ a.y * b.y;
		}
		
		const vec2 = (x: float, y: float): Vec2 ={}> Vec2{
			x: x,
			y: y,
		}
		
		const vec4 = (x: float): Vec4 ={}> Vec4{
			z: x,
			x: x,
			y: x,
			w: x,
		}
		
		const color2DSDF = (
			fn: (GLSLEnv, Vec2) ={}> float,
			inner: Vec4,
			close: Vec4,
			far: Vec4,
			size: float,
		): (GLSLEnv, Vec2) ={}> Vec4 ={}> {
			(env: GLSLEnv, pos: Vec2): Vec4 ={}> {
				const dist = fn(env, pos);
				if dist < 0.0 {
					inner;
				} else {
					const amount = mod(dist, size) / size;
					mix(a: close, b: far, c: amount);
				};
			};
		}
		
		const ScaleVec2 = Mul<Vec2, Vec2, Vec2>{
			"*": (v: Vec2, scale: Vec2): Vec2 ={}> Vec2{
				x: v.x * scale.x,
				y: v.y * scale.y,
			},
		}
		
		const sdUnevenCapsule = (
			p: Vec2,
			r1: float,
			r2: float,
			h: float,
		): float ={}> {
			const p = vec2(x: abs(p.x), y: p.y);
			const b = (r1 - r2) / h;
			const a = sqrt(1.0 - b * b);
			const k = dot(a: p, b: vec2(x: -b, y: a));
			if k < 0.0 {
				length(v: p) - r1;
			} else if k > a * h {
				length(v: p - vec2(x: 0.0, y: h)) 
					- r2;
			} else {
				dot(a: p, b: vec2(x: a, y: b)) - r1;
			};
		}
		
		const ScaleVec2Rev = Div<Vec2, float, Vec2>{
			"/": (v: Vec2, scale: float): Vec2 ={}> Vec2{
				x: v.x / scale,
				y: v.y / scale,
			},
		}
		
		const color2DSDF = (fn: (GLSLEnv, Vec2) ={}> float): (
			GLSLEnv,
			Vec2,
		) ={}> Vec4 ={}> color2DSDF(
			fn,
			inner: @rgba @title(title: "ring color") Vec4{
				z: 1.0,
				x: 1.0,
				y: 1.0,
				w: 1.0,
			},
			close: vec4(x: 1.0),
			far: vec4(x: 0.0),
			size: @slider(min: 0.0, max: 100.0, step: 1.0) @title(
				title: "ring size",
			) 20.0,
		)
		
		color2DSDF(
			fn: (env: GLSLEnv, pos: Vec2): float ={}> {
				const t = env.time * PI / 3.0;
				const p = pos 
					- env.resolution / 2.0;
				const p = vec2(x: p.x, y: p.y * 1.0);
				const res = sdUnevenCapsule(
					p: p + vec2(x: 0.0, y: 100.0),
					r1: 0.0,
					r2: @slider(min: 0.0, max: 200.0, step: 0.0) 60.0,
					h: 200.0,
				);
				res 
					+ (length(
							v: pos 
									- env.resolution 
										/ 2.0 
								+ vec2(
										x: sin(env.time),
										y: sin(env.time * 2.0),
									) 
									* @slider(
										min: Vec2{x: 0.0, y: 0.0},
										max: Vec2{x: 500.0, y: 500.0},
									) Vec2{x: 50.0, y: 100.0},
						) 
						- 40.0);
			},
		)
		`);
        const newItem = transform(term, { term: () => null });
        expect(hashObject(newItem)).toBe(hashObject(term));
    });
});
