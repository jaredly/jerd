import { Location, Switch } from '../../parsing/parser';
import typeExpr, { showLocation } from '../typeExpr';
import typePattern from '../typePattern';
import { Env, Pattern, subEnv, Term, Type } from '../types';
import { fitsExpectation, showType } from '../unify';

export const exhaustivenessCheck = (
    env: Env,
    t: Type,
    cases: Array<Pattern>,
    location: Location,
) => {
    if (cases.find((c) => c.type === 'Binding') != null) {
        return true;
    }

    if (t.type === 'lambda') {
        throw new Error(
            `Cannot match on a lambda ${showType(t)} ${showLocation(location)}`,
        );
    }

    if (t.type === 'var') {
        throw new Error(`Umm can't match on vbls yet I don't think`);
    }

    if (t.ref.type === 'builtin') {
        if (['string', 'int'].includes(t.ref.name)) {
            throw new Error(
                `${t.ref.name} must have a catchall case to be exhaustive.`,
            );
        }
        if (t.ref.name === 'bool') {
            const tr = cases.find(
                (c) => c.type === 'boolean' && c.value === true,
            );
            const f = cases.find(
                (c) => c.type === 'boolean' && c.value === false,
            );
            if (tr == null) {
                throw new Error(
                    `"true" case not handled ${showLocation(location)}`,
                );
            }
            if (f == null) {
                throw new Error(
                    `"false" case not handled ${showLocation(location)}`,
                );
            }
        }
    }

    const paths = [];
};

export const typeSwitch = (env: Env, expr: Switch): Term => {
    const term = typeExpr(env, expr.expr);
    const cases: Array<{ pattern: Pattern; body: Term }> = [];
    let is: Type | null = null;
    expr.cases.forEach((c) => {
        const inner = subEnv(env);
        const pattern = typePattern(inner, c.pattern, term.is);
        const body = typeExpr(inner, c.body);
        if (is == null) {
            is = body.is;
        } else {
            if (fitsExpectation(env, body.is, is) !== true) {
                throw new Error(
                    `Bodies of case arms don't agree! ${showType(
                        body.is,
                    )} vs ${showType(is)} at ${showLocation(c.location)}`,
                );
            }
        }
        cases.push({
            pattern,
            body,
        });
    });

    exhaustivenessCheck(
        env,
        term.is,
        cases.map((c) => c.pattern),
        expr.location,
    );

    // STOPSHIP: gotta ensure exhaustivity here folks!
    // hrmmm this could be tricky
    // ok, so maybe we can have paths?
    // [idName, attr, etc.]
    // and if [idName] => true, then that record is covered
    // and if [] => true, then we have a wildcard coverage.
    return {
        type: 'Switch',
        term,
        cases,
        location: expr.location,
        is: is!,
    };
};
