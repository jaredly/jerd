// For the handle

import { Handle } from '../../parsing/parser';
import {
    Type,
    Term,
    getEffects,
    subEnv,
    Env,
    typesEqual,
    Reference,
    refsEqual,
    Case,
} from '../types';
import { showType } from '../unify';
import typeExpr from '../typeExpr';
import { makeLocal } from '../env';

export const typeHandle = (env: Env, expr: Handle): Term => {
    const target = typeExpr(env, expr.target);
    // console.log(target);
    let effName = expr.cases[0].name;
    if (expr.cases.some((c) => c.name.text !== effName.text)) {
        throw new Error(`Can't handle multiple effects in one handler.`);
    }
    const effId = env.global.effectNames[effName.text];
    if (!effId) {
        throw new Error(`No effect named ${effName.text}`);
    }
    const constrs = env.global.effects[effId];
    const effect: Reference = {
        type: 'user',
        id: { hash: effId, size: 1, pos: 0 },
    };
    const effects = getEffects(target).filter(
        (e) => e.type !== 'ref' || !refsEqual(effect, e.ref),
    );
    const otherEffects = effects.concat({ type: 'ref', ref: effect });

    if (target.is.type !== 'lambda') {
        throw new Error(`Target of a handle must be a lambda`);
    }
    if (target.is.args.length !== 0) {
        throw new Error(`Target of a handle must take 0 args`);
    }
    const targetReturn = target.is.res;

    // but then, effects found in the bodies also get added.
    // so we'll need some deduping
    const inner = subEnv(env);
    const sym = makeLocal(inner, expr.pure.arg, targetReturn);
    const pure = typeExpr(inner, expr.pure.body);

    const cases: Array<Case> = [];
    expr.cases.forEach((kase) => {
        const idx =
            env.global.effectConstructors[
                kase.name.text + '.' + kase.constr.text
            ].idx;
        const constr = constrs[idx];
        const inner = subEnv(env);
        const args = (kase.args || []).map((id, i) => {
            return makeLocal(inner, id, constr.args[i]);
        });
        const k = makeLocal(inner, kase.k, {
            type: 'lambda',
            location: kase.location,
            typeVbls: [],
            effectVbls: [],
            args: isVoid(constr.ret) ? [] : [constr.ret],
            effects: otherEffects,
            rest: null,
            res: targetReturn,
        });

        const body = typeExpr(inner, kase.body);
        if (!typesEqual(body.is, pure.is)) {
            throw new Error(
                `All case arms must have the same return type: ${showType(
                    env,
                    body.is,
                )} ${showType(env, pure.is)}`,
            );
        }

        cases.push({
            constr: idx,
            args,
            k,
            body,
        });
    });

    return {
        type: 'handle',
        target,
        effect,
        location: expr.location,
        cases,
        pure: { arg: sym, body: pure },
        is: pure.is,
    };
};

export const isVoid = (x: Type) => {
    return (
        x.type === 'ref' && x.ref.type === 'builtin' && x.ref.name === 'void'
    );
};
