// For the lambda

import { Lambda } from '../../parsing/parser';
import {
    Type,
    Term,
    dedupEffects,
    getEffects,
    Symbol,
    EffectRef,
    Id,
    subEnv,
    effectsMatch,
    Env,
} from '../types';
import typeType, { newEnvWithTypeAndEffectVbls } from '../typeType';
import { fitsExpectation } from '../unify';
import { printToString } from '../../printing/printer';
import { refToPretty, symToPretty } from '../../printing/printTsLike';
import typeExpr, { showLocation } from '../typeExpr';
import { resolveEffect } from '../env';

export const typeLambda = (env: Env, expr: Lambda): Term => {
    const { typeInner, typeVbls, effectVbls } = newEnvWithTypeAndEffectVbls(
        env,
        expr.typevbls,
        expr.effvbls,
    );

    // ok here's where we do a little bit of inference?
    // or do I just say "all is specified, we can infer in the IDE"?
    const inner = subEnv(typeInner);
    const args: Array<Symbol> = [];
    const argst: Array<Type> = [];

    expr.args.forEach(({ id, type: rawType }) => {
        const type = typeType(typeInner, rawType);
        const unique = Object.keys(inner.local.locals).length;
        const sym: Symbol = { name: id.text, unique };
        inner.local.locals[id.text] = { sym, type };
        args.push(sym);
        argst.push(type);
    });
    const body = typeExpr(inner, expr.body);
    if (expr.rettype) {
        if (
            fitsExpectation(
                typeInner,
                body.is,
                typeType(typeInner, expr.rettype),
            ) !== true
        ) {
            throw new Error(
                `Return type of lambda doesn't fit type declaration`,
            );
        }
    }
    const effects = getEffects(body);
    if (expr.effects != null) {
        const declaredEffects: Array<EffectRef> = expr.effects.map((effName) =>
            resolveEffect(typeInner, effName),
        );
        if (declaredEffects.length === 0 && effects.length !== 0) {
            throw new Error(
                `Function is declared as pure, but is not. ${effects.length} effects found.`,
            );
        }
        if (!effectsMatch(declaredEffects, effects, true)) {
            throw new Error(
                `Function declared with explicit effects, but missing at least one: ${declaredEffects
                    .map((e) =>
                        e.type === 'ref'
                            ? printToString(refToPretty(env, e.ref), 100)
                            : printToString(symToPretty(e.sym), 100),
                    )
                    .join(',')}`,
            );
        }
        effects.push(...declaredEffects);
    }

    return {
        type: 'lambda',
        args,
        body,
        location: expr.location,
        is: {
            type: 'lambda',
            location: expr.location,
            typeVbls,
            effectVbls,
            effects: dedupEffects(effects),
            args: argst,
            rest: null,
            res: body.is,
        },
    };
};
