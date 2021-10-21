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
    EffectReference,
    Location,
} from '../types';
import typeType, { newEnvWithTypeAndEffectVbls } from '../typeType';
import { printToString } from '../../printing/printer';
import { refToPretty, symToPretty } from '../../printing/printTsLike';
import typeExpr from '../typeExpr';
import { makeLocal, resolveEffect } from '../env';
import { LocatedError, TypeError } from '../errors';
import { getTypeError } from '../getTypeError';

export const typeLambda = (
    env: Env,
    expr: Lambda,
    expectedType?: Type,
): Term => {
    const { typeInner, typeVbls, effectVbls } = newEnvWithTypeAndEffectVbls(
        env,
        expr.typevbls,
        expr.effvbls,
    );

    // ok here's where we do a little bit of inference?
    // or do I just say "all is specified, we can infer in the IDE"?
    const inner = subEnv(typeInner);
    const args: Array<{ sym: Symbol; location: Location }> = [];
    const argst: Array<Type> = [];

    expr.args.forEach(({ id, type: rawType }, i) => {
        const expectedArgType =
            expectedType && expectedType.type === 'lambda'
                ? expectedType.args[i]
                : null;
        const type = typeType(typeInner, rawType, expectedArgType);
        const sym = makeLocal(inner, id, type);
        args.push({ sym, location: id.location });
        argst.push(type);
    });

    let body = typeExpr(inner, expr.body);
    if (expr.rettype) {
        const expected = typeType(typeInner, expr.rettype);
        const err = getTypeError(typeInner, body.is, expected, expr.location);
        if (err != null) {
            body = {
                type: 'TypeError',
                inner: body,
                is: expected,
                location: body.location,
                message: err.getMessage(),
            };
            // throw new TypeError(
            //     `Return type of lambda doesn't fit type declaration`,
            // ).wrap(err);
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
            throw new LocatedError(
                expr.location,
                `Function declared with explicit effects, but missing at least one: \n${declaredEffects
                    .map((e) => printEffectRef(env, e))
                    .join(', ')}\nExepcted: ${effects
                    .map((e) => printEffectRef(env, e))
                    .join(', ')}`,
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
            argNames: expr.args.map((arg) => ({
                text: arg.id.text,
                location: arg.id.location,
            })),
            args: argst,
            rest: null,
            res: body.is,
        },
    };
};

export const printEffectRef = (env: Env, e: EffectRef) =>
    e.type === 'ref'
        ? printToString(refToPretty(env, e.ref, 'effect'), 100)
        : printToString(symToPretty(env, e.sym), 100);
