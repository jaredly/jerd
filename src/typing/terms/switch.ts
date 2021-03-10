import { Switch } from '../../parsing/parser';
import typeExpr, { showLocation } from '../typeExpr';
import typePattern from '../typePattern';
import { Env, Pattern, subEnv, Term, Type } from '../types';
import { fitsExpectation, showType } from '../unify';

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
