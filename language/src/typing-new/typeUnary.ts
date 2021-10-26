import { WithUnary_inner } from '../parsing/parser-new';
import { idName } from '../typing/env';
import { presetEnv, pureFunction, void_ } from '../typing/preset';
import {
    Id,
    idsEqual,
    RecordDef,
    Term,
    Type,
    typesEqual,
} from '../typing/types';
import { Context } from './Context';
import { parseAttrHash, parseOpHash } from './hashes';
import { countErrors, typeDef } from './Library';
import { findBinopImplementorsForRecordTypes, resolveOpHash } from './ops';
import { applyToTarget } from './typeApply';
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
    const options: Array<{
        term: Term;
        // typeArgs: Array<Type>;
        // args: Array<Type>;
    }> = [];

    let addedBuiltins = false;
    if (unary.op.hash) {
        if (unary.op.hash === '#builtin') {
            for (let { input, output } of ctx.builtins.ops.unary[unary.op.op] ||
                []) {
                options.push({
                    term: {
                        type: 'ref',
                        ref: { type: 'builtin', name: unary.op.op },
                        is: pureFunction([input], output),
                        location: unary.op.location,
                    },
                    // typeArgs: [],
                    // args: [input],
                });
            }
            addedBuiltins = true;
        } else {
            const resolved = resolveOpHash(
                ctx,
                unary.op.hash,
                unary.op.location,
                unary.location,
            );
            if (resolved) {
                options.push({ term: resolved });
            }
        }
    }

    options.push(
        ...findBinopImplementorsForRecordTypes(
            ctx.library.types.constructors.names[unary.op.op] || [],
            ctx,
            unary.location,
            1,
        ),
    );

    if (!addedBuiltins) {
        for (let { input, output } of ctx.builtins.ops.unary[unary.op.op] ||
            []) {
            options.push({
                term: {
                    type: 'ref',
                    ref: { type: 'builtin', name: unary.op.op },
                    is: pureFunction([input], output),
                    location: unary.op.location,
                },
                // typeArgs: [],
                // args: [input],
            });
        }
    }

    const results: Array<{
        term: Term;
        errors: number;
    }> = [];

    if (!options.length) {
        const inner = typeExpression(ctx, unary.inner, []);
        const out = expected.length ? expected[0] : void_;
        return {
            type: 'apply',
            target: {
                type: 'NotFound',
                text: unary.op.op,
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

    for (let { term } of options) {
        const result = wrapExpected(
            applyToTarget(ctx, term, {
                args: {
                    type: 'LabeledCommaExpr',
                    items: [
                        {
                            label: null,
                            location: unary.location,
                            type: 'LabeledExpr',
                            value: unary.inner,
                        },
                    ],
                    location: unary.location,
                },
                effectVbls: null,
                location: unary.location,
                type: 'ApplySuffix',
                typevbls: null,
            }),
            expected,
        );
        const errors = countErrors(result);
        if (errors === 0) {
            return result;
        }
        results.push({ term: result, errors });
    }
    results.sort((a, b) => a.errors - b.errors);
    return results[0].term;
};

export const typeUnary_old = (
    ctx: Context,
    unary: WithUnary_inner,
    expected: Array<Type>,
): Term => {
    // const old = (ctx: Context, unary: WithUnary_inner, expected: Array<Type>) => {
    const options = ctx.builtins.ops.unary[unary.op.op];

    if (!options || !options.length) {
        const inner = typeExpression(ctx, unary.inner, []);
        const out = expected.length ? expected[0] : void_;
        return {
            type: 'apply',
            target: {
                type: 'NotFound',
                text: unary.op.op,
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

    // START HERE PLEASE:
    // ok now re-use the stuff from the `typeApply`, which is generic over the
    // number of arguments.

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
                op: unary.op.op,
            };
        }
    }
    return wrapExpected(
        {
            type: 'unary',
            inner: wrapExpected(inner, [options[0].input]),
            is: options[0].output,
            location: unary.location,
            op: unary.op.op,
        },
        expected,
    );
};
