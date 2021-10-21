import { WithUnary_inner } from '../parsing/parser-new';
import { presetEnv, pureFunction, void_ } from '../typing/preset';
import { Term, Type, typesEqual } from '../typing/types';
import { Context } from './Context';
import { typeExpression, wrapExpected } from './typeExpression';

// Ok, so for the moment, should we only allow ... builtins?
// Yeah we won't mess with this for now.
// It would probably be nice to make `ops.ts` just generalize over the number of args,
// so we can re-use all that here.
export const typeUnary = (
    ctx: Context,
    unary: WithUnary_inner,
    expected: Array<Type>,
): Term => {
    const options = ctx.builtins.ops.unary[unary.op];
    if (!options || !options.length) {
        const inner = typeExpression(ctx, unary.inner, []);
        const out = expected.length ? expected[0] : void_;
        return {
            type: 'apply',
            target: {
                type: 'NotFound',
                text: unary.op,
                is: pureFunction([inner.is], out),
                location: unary.location,
            },
            is: out,
            args: [inner],
            effectVbls: null,
            location: unary.location,
            typeVbls: [],
        };
    }

    const valid = expected.length
        ? options.filter((option) =>
              expected.some((ex) => typesEqual(ex, option.output)),
          )
        : options;

    const inner = typeExpression(
        ctx,
        unary.inner,
        valid.map((v) => v.input),
    );

    for (let { input, output } of valid) {
        if (typesEqual(input, inner.is)) {
            return {
                type: 'unary',
                inner,
                is: output,
                location: unary.location,
                op: unary.op,
            };
        }
    }
    return wrapExpected(
        {
            type: 'unary',
            inner: wrapExpected(inner, [options[0].input]),
            is: options[0].output,
            location: unary.location,
            op: unary.op,
        },
        expected,
    );
};
