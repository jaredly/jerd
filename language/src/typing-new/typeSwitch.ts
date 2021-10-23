import { Switch } from '../parsing/parser-new';
import { SwitchCase, Term, Type } from '../typing/types';
import { Context } from './Context';
import { typeExpression } from './typeExpression';

export const typeSwitch = (
    ctx: Context,
    term: Switch,
    expected: Array<Type>,
): Term => {
    // Which do we do first?
    // The object of our affection?
    // or the cases. Probably the cases?
    // and like
    // at that point
    // do we ... just look for all enums that cover these things?
    // hmmmmmmmm

    // ok, let's go simple for the moment.

    const input = typeExpression(ctx, term.expr, []);
    let is: Type | null = null;
    // annnd for patterns, I think we'll just ignore expected types? idk
    const cases = term.cases.items.map(
        (kase): SwitchCase => {
            const pattern = typePattern(ctx, kase.pattern, [input.is]);
            kase.pattern;
            const body = typeExpression(ctx, kase.body, is ? [is] : expected);
            if (is == null) {
                is = body.is;
            }
            return {
                pattern,
                body,
                location: kase.location,
            };
        },
    );
    return {
        type: 'Switch',
        cases,
        is: is!,
        location: term.location,
        term: input,
    };
};
