// Ok folks

import { ToplevelT } from './env';
import { bool, pureFunction, void_ } from './preset';
import { applyEffectVariables, showLocation } from './typeExpr';
import {
    apply,
    Case,
    EffectRef,
    Env,
    isBuiltin,
    Lambda,
    LambdaType,
    Let,
    Pattern,
    SwitchCase,
    Term,
    Type,
    Var,
} from './types';

export type Visitor<Ctx> = {
    toplevel?: (value: ToplevelT, ctx: Ctx) => ToplevelT | null | false;
    term: (value: Term, ctx: Ctx) => Term | null | false | [Term | null, Ctx];
    type?: (value: Type, ctx: Ctx) => Type | null | false;
    let?: (value: Let, ctx: Ctx) => Let | null | false | [Let | null, Ctx, Ctx];
    switchCase?: (
        value: SwitchCase,
        ctx: Ctx,
    ) => SwitchCase | null | false | [SwitchCase | null, Ctx];
};

// Ok so for the moment we're just doing terms, not types.
// got it.
export const transformToplevel = <Ctx>(
    t: ToplevelT,
    visitor: Visitor<Ctx>,
    ctx: Ctx,
): ToplevelT => {
    if (visitor.toplevel) {
        const transformed = visitor.toplevel(t, ctx);
        if (transformed === false) {
            return t;
        }
        if (transformed != null) {
            t = transformed;
        }
    }
    switch (t.type) {
        // TODO when I add types, I'll need to handle this
        case 'EnumDef':
        case 'RecordDef':
        case 'Decorator':
        case 'Effect': {
            return t;
        }
        case 'Expression':
        case 'Define': {
            const term = transformWithCtx(t.term, visitor, ctx);
            return term !== t.term ? { ...t, term } : t;
        }
        default:
            const _x: never = t;
            throw new Error(`Unknown toplevel type ${(t as any).type}`);
    }
};

export const transformLet = <Ctx>(
    l: Let,
    visitor: Visitor<Ctx>,
    ctx: Ctx,
): [Let, Ctx] => {
    const transformed = visitor.let ? visitor.let(l, ctx) : null;
    let nextCtx = ctx;
    if (transformed === false) {
        return [l, nextCtx];
    }
    if (transformed != null) {
        if (Array.isArray(transformed)) {
            ctx = transformed[1];
            nextCtx = transformed[2];
            if (transformed[0] != null) {
                l = transformed[0];
            }
        } else {
            l = transformed;
        }
    }
    const value = transformWithCtx(l.value, visitor, ctx);
    return [value !== l.value ? { ...l, value } : l, nextCtx];
};

export const transform = (term: Term, visitor: Visitor<null>) =>
    transformWithCtx(term, visitor, null);

export const transformTypeWithCtx = <Ctx>(
    type: Type,
    visitor: Visitor<Ctx>,
    ctx: Ctx,
): Type => {
    if (!visitor.type) {
        return type;
    }
    const is = visitor.type(type, ctx);
    if (is === false) {
        return type;
    }
    if (is != null) {
        type = is;
    }
    switch (type.type) {
        case 'lambda': {
            const res = transformTypeWithCtx(type.res, visitor, ctx);
            let changed = false;
            const args = type.args.map((arg) => {
                const na = transformTypeWithCtx(arg, visitor, ctx);
                changed = changed || na !== arg;
                return na;
            });
            return res !== type.res || changed ? { ...type, args, res } : type;
        }
        case 'ref': {
            let changed = false;
            const typeVbls = type.typeVbls.map((vbl) => {
                const nw = transformTypeWithCtx(vbl, visitor, ctx);
                changed = changed || nw !== vbl;
                return nw;
            });
            return changed ? { ...type, typeVbls } : type;
        }
    }
    return type;
};

export const transformWithCtx = <Ctx>(
    term: Term,
    visitor: Visitor<Ctx>,
    ctx: Ctx,
): Term => {
    if (!term) {
        throw new Error(`No term provided!!`);
    }
    const transformed = visitor.term(term, ctx);
    if (transformed === false) {
        return term;
    }
    if (transformed != null) {
        if (Array.isArray(transformed)) {
            ctx = transformed[1];
            if (transformed[0] != null) {
                term = transformed[0];
            }
        } else {
            term = transformed;
        }
    }
    const is = transformTypeWithCtx(term.is, visitor, ctx);
    if (is !== term.is) {
        term = { ...term, is: is as any };
    }
    switch (term.type) {
        case 'raise': {
            let changed = false;
            const args = term.args.map((arg) => {
                const v = transformWithCtx(arg, visitor, ctx);
                changed = changed || v !== arg;
                return v;
            });
            return changed ? { ...term, args } : term;
        }
        case 'if': {
            const cond = transformWithCtx(term.cond, visitor, ctx);
            const yes = transformWithCtx(term.yes, visitor, ctx);
            const no = term.no
                ? transformWithCtx(term.no, visitor, ctx)
                : term.no;
            return cond !== term.cond || yes !== term.yes || no !== term.no
                ? { ...term, yes, no, cond }
                : term;
        }
        case 'handle': {
            const target = transformWithCtx(term.target, visitor, ctx);
            const body = transformWithCtx(term.pure.body, visitor, ctx);
            const pure =
                body !== term.pure.body ? { ...term.pure, body } : term.pure;
            let changed = false;
            const cases: Array<Case> = term.cases.map((kase) => {
                const body = transformWithCtx(kase.body, visitor, ctx);
                changed = changed || body !== kase.body;
                return body !== kase.body ? { ...kase, body } : kase;
            });
            return target !== term.target || pure !== term.pure || changed
                ? { ...term, target, pure, cases }
                : term;
        }
        case 'sequence': {
            let changed = false;
            const sts = term.sts.map((t) => {
                if (t.type === 'Let') {
                    const [tr, nextCtx] = transformLet(t, visitor, ctx);
                    ctx = nextCtx;
                    changed = changed || tr !== t;
                    return tr;
                }
                const tr = transformWithCtx(t, visitor, ctx);
                changed = changed || tr !== t;
                return tr;
            });
            return changed ? { ...term, sts } : term;
        }
        case 'apply': {
            const target = transformWithCtx(term.target, visitor, ctx);
            let changed = false;
            const args = term.args.map((t) => {
                const tr = transformWithCtx(t, visitor, ctx);
                changed = changed || tr !== t;
                return tr;
            });
            return target !== term.target || changed
                ? { ...term, args, target }
                : term;
        }
        case 'lambda': {
            const body = transformWithCtx(term.body, visitor, ctx);
            return body !== term.body ? { ...term, body } : term;
        }
        case 'Record': {
            const subTypes = { ...term.subTypes };
            let base = term.base;
            if (term.base.spread) {
                const spread = transformWithCtx(term.base.spread, visitor, ctx);
                if (spread !== term.base.spread) {
                    base = { ...term.base, spread };
                }
            }
            if (term.base.type === 'Concrete') {
                let changed = false;
                const rows = term.base.rows.map((term) => {
                    const res = term
                        ? transformWithCtx(term, visitor, ctx)
                        : null;
                    changed = changed || res !== term;
                    return res;
                });
                if (changed) {
                    base = { ...term.base, rows };
                }
            }
            // const subTypes = term.subTypes
            let changed = false;
            Object.keys(term.subTypes).forEach((id) => {
                const subType = subTypes[id];
                const spread =
                    subType.spread != null
                        ? transformWithCtx(subType.spread, visitor, ctx)
                        : subTypes.spread;
                let rchanged = false;
                const rows = subType.rows.map((row) => {
                    const r = row ? transformWithCtx(row, visitor, ctx) : null;
                    rchanged = rchanged || r !== row;
                    return r;
                });
                changed = changed || spread !== subType.spread || rchanged;
                // @ts-ignore
                subTypes[id] =
                    spread !== subType.spread || rchanged
                        ? { ...subType, spread, rows }
                        : subType;
            });
            return base !== term.base || changed
                ? { ...term, subTypes, base }
                : term;
        }
        case 'Switch': {
            const t = transformWithCtx(term.term, visitor, ctx);
            let changed = false;
            const cases = term.cases.map((kase) => {
                let k2 = visitor.switchCase
                    ? visitor.switchCase(kase, ctx)
                    : null;
                let ct2 = ctx;
                if (k2 === false) {
                    return kase;
                }
                if (k2 != null) {
                    if (Array.isArray(k2)) {
                        if (k2[0] != null) {
                            kase = k2[0];
                        }
                        ct2 = k2[1];
                    } else {
                        kase = k2;
                    }
                }
                const body = transformWithCtx(kase.body, visitor, ct2);
                changed = changed || body !== kase.body;
                return body !== kase.body ? { ...kase, body } : kase;
            });
            return t !== term.term || changed
                ? { ...term, term: t, cases }
                : term;
        }
        case 'unary':
        case 'Enum': {
            const inner = transformWithCtx(term.inner, visitor, ctx);
            return inner !== term.inner ? { ...term, inner } : term;
        }
        case 'Trace': {
            let changed = false;
            const args = term.args.map((item) => {
                const t = transformWithCtx(item, visitor, ctx);
                changed = changed || t !== item;
                return t;
            });
            return changed ? { ...term, args } : term;
        }
        case 'Tuple': {
            let changed = false;
            const items = term.items.map((item) => {
                const t = transformWithCtx(item, visitor, ctx);
                changed = changed || t !== item;
                return t;
            });
            return changed ? { ...term, items } : term;
        }
        case 'TemplateString': {
            let changed = false;
            const pairs = term.pairs.map((item) => {
                const contents = transformWithCtx(item.contents, visitor, ctx);
                changed = changed || contents !== item.contents;
                return contents !== item.contents
                    ? { ...item, contents }
                    : item;
            });
            return changed ? { ...term, pairs } : term;
        }
        case 'Array': {
            let changed = false;
            const items = term.items.map((item) => {
                if (item.type === 'ArraySpread') {
                    const value = transformWithCtx(item.value, visitor, ctx);
                    changed = changed || value !== item.value;
                    return value !== item.value ? { ...item, value } : item;
                } else {
                    const tr = transformWithCtx(item, visitor, ctx);
                    changed = changed || tr !== item;
                    return tr;
                }
            });
            return changed ? { ...term, items } : term;
        }
        case 'TupleAccess':
        case 'Attribute': {
            const target = transformWithCtx(term.target, visitor, ctx);
            return target !== term.target ? { ...term, target } : term;
        }
        case 'TypeError': {
            const inner = transformWithCtx(term.inner, visitor, ctx);
            return inner !== term.inner ? { ...term, inner } : term;
        }
        case 'Ambiguous': {
            let changed = false;
            const options = term.options.map((term) => {
                const n = transformWithCtx(term, visitor, ctx);
                changed = changed || n !== term;
                return n;
            });
            return changed ? { ...term, options } : term;
        }
        case 'string':
        case 'int':
        case 'float':
        case 'boolean':
        case 'self':
        case 'ref':
        case 'var':
            return term;
        default:
            let _x: never = term;
            throw new Error(`Unexpected term type ${(term as any).type}`);
    }
};

export const walkPattern = (
    pattern: Pattern,
    handle: (pat: Pattern) => void | false,
): void => {
    if (handle(pattern) === false) {
        return;
    }
    switch (pattern.type) {
        case 'Binding':
        case 'Enum':
        case 'string':
        case 'float':
        case 'int':
        case 'boolean':
        case 'Ignore':
            return;
        case 'Alias':
            walkPattern(pattern.inner, handle);
            return;
        case 'Array':
            pattern.preItems.forEach((p) => walkPattern(p, handle));
            if (pattern.spread) {
                walkPattern(pattern.spread, handle);
            }
            pattern.postItems.forEach((p) => walkPattern(p, handle));
            return;
        case 'Tuple':
            pattern.items.forEach((p) => walkPattern(p, handle));
            return;
        case 'Record':
            pattern.items.forEach((item) => walkPattern(item.pattern, handle));
            return;
        default:
            let _x: never = pattern;
            throw new Error(`Unhandled pattern ${(pattern as any).type}`);
    }
};

export const walkTerm = (
    term: Term | Let,
    handle: (term: Term | Let) => void | false,
): void => {
    if (handle(term) === false) {
        return; // no recursion
    }
    switch (term.type) {
        case 'Let':
            return walkTerm(term.value, handle);
        case 'raise':
            return term.args.forEach((t) => walkTerm(t, handle));
        case 'if':
            walkTerm(term.cond, handle);
            walkTerm(term.yes, handle);
            if (term.no) {
                walkTerm(term.no, handle);
            }
            return;
        case 'handle':
            walkTerm(term.target, handle);
            walkTerm(term.pure.body, handle);
            term.cases.forEach((kase) => walkTerm(kase.body, handle));
            return;
        case 'sequence':
            return term.sts.forEach((t) => walkTerm(t, handle));
        case 'apply':
            walkTerm(term.target, handle);
            return term.args.forEach((t) => walkTerm(t, handle));
        case 'lambda':
            return walkTerm(term.body, handle);
        case 'Record':
            if (term.base.spread) {
                walkTerm(term.base.spread, handle);
            }
            if (term.base.type === 'Concrete') {
                term.base.rows.forEach((term) =>
                    term ? walkTerm(term, handle) : null,
                );
            }
            Object.keys(term.subTypes).forEach((id) => {
                const subType = term.subTypes[id];
                if (subType.spread != null) {
                    walkTerm(subType.spread, handle);
                }
                subType.rows.forEach((row) =>
                    row ? walkTerm(row, handle) : null,
                );
            });
            return;
        case 'Switch':
            walkTerm(term.term, handle);
            term.cases.forEach((kase) => {
                walkTerm(kase.body, handle);
            });
            return;
        case 'unary':
        case 'Enum':
            return walkTerm(term.inner, handle);
        case 'Trace':
            term.args.forEach((item) => {
                walkTerm(item, handle);
            });
            return;
        case 'Tuple':
            term.items.forEach((item) => {
                walkTerm(item, handle);
            });
            return;
        case 'Array':
            term.items.forEach((item) => {
                if (item.type === 'ArraySpread') {
                    walkTerm(item.value, handle);
                } else {
                    walkTerm(item, handle);
                }
            });
            return;
        case 'Ambiguous':
            term.options.forEach((opt) => walkTerm(opt, handle));
            return;
        case 'TypeError':
            walkTerm(term.inner, handle);
            return;
        case 'TupleAccess':
        case 'Attribute':
            walkTerm(term.target, handle);
            return;
        case 'TemplateString':
            term.pairs.forEach((item) => walkTerm(item.contents, handle));
            return;
        case 'string':
        case 'int':
        case 'float':
        case 'boolean':
        case 'self':
        case 'ref':
        case 'var':
            return;
        default:
            let _x: never = term;
            throw new Error(`Unexpected term type ${(term as any).type}`);
    }
};

// yeah we need to go in, and
// apply the effect variables all over
export const withNoEffects = (env: Env, term: Lambda): Lambda => {
    const vbls = term.is.effectVbls;
    const is = applyEffectVariables(
        env,
        term.is,
        [],
        term.location,
    ) as LambdaType;
    // lol clone
    term = JSON.parse(JSON.stringify(term)) as Lambda;
    walkTerm(term, (t) => {
        if (t.type === 'apply') {
            if (t.effectVbls) {
                t.effectVbls = t.effectVbls.filter(
                    (e) => e.type !== 'var' || e.sym.unique !== vbls[0],
                );
            }
            // t.effectVbls;
            const is = t.target.is as LambdaType;
            if (is.effects && !is.effectVbls.length) {
                is.effects = clearEffects(vbls, is.effects);
            }
        }
        if (t.is.type === 'lambda' && t !== term) {
            if (t.is.effectVbls.length) {
                // console.log('dropout', showLocation(t.location));
                return false;
            }
        }
        if (t.type === 'lambda' && t.is.effects.length) {
            t.is.effects = clearEffects(vbls, t.is.effects);
        }
    });
    return { ...term, is };
};

const clearEffects = (
    vbls: Array<number>,
    effects: Array<EffectRef>,
): Array<EffectRef> => {
    return effects.filter(
        (e) => e.type !== 'var' || !vbls.includes(e.sym.unique),
    );
};

export const maybeWrapPureFunction = (env: Env, arg: Term, t: Type): Term => {
    // console.error(`Maybe ${showType(env, arg.is)} : ${showType(env, t)}`);
    if (t.type !== 'lambda' || t.effects.length === 0) {
        return arg;
    }
    if (arg.is.type !== 'lambda') {
        throw new Error(
            `arg not a lambda, would be cool to statically keep these in sync`,
        );
    }
    if (arg.is.effects.length !== 0) {
        return arg;
    }
    const args: Array<Var> = arg.is.args.map((t, i) => ({
        type: 'var',
        is: t,
        location: t.location,
        sym: {
            unique: env.local.unique.current++,
            name: `arg_${i}`,
        },
    }));
    return {
        type: 'lambda',
        args: args.map((a) => a.sym),
        idLocations: args.map((a) => a.location),
        is: {
            ...arg.is,
            effects: t.effects,
        },
        location: arg.location,
        body: {
            type: 'apply',
            location: arg.location,
            typeVbls: [],
            effectVbls: null,
            args,
            target: arg,
            is: arg.is.res,
        },
        // effects: t.effects,
    };
};

export const wrapWithAssert = (expr: Term): Term => {
    if (expr.type === 'apply' && isBuiltin(expr.target, '==')) {
        const argTypes = (expr.target.is as LambdaType).args;
        return {
            ...expr,
            target: {
                type: 'ref',
                ref: {
                    type: 'builtin',
                    name: 'assertEqual',
                },
                location: expr.location,
                is: pureFunction(argTypes, void_),
            },
            is: void_,
        };
    } else if (expr.type === 'apply') {
        return apply(
            {
                type: 'ref',
                ref: { type: 'builtin', name: 'assertCall' },
                location: expr.location,
                is: pureFunction(
                    [expr.target.is, ...(expr.target.is as LambdaType).args],
                    void_,
                ),
            },
            [expr.target, ...expr.args],
            expr.location,
        );
    } else {
        return apply(
            {
                type: 'ref',
                ref: { type: 'builtin', name: 'assert' },
                location: expr.location,
                is: pureFunction([bool], void_),
            },
            [expr],
            expr.location,
        );
    }
};
