import { AsSuffix, Expression } from '../parsing/parser-new';
import { idFromName, idName } from '../typing/env';
import { pureFunction } from '../typing/preset';
import { Id, LambdaType, Term, Type, typesEqual } from '../typing/types';
import { Context } from './Context';
import { typeExpression, wrapExpected } from './typeExpression';
import { asAs } from './typeTemplateString';
import { typeType } from './typeType';

export const typeAs = (
    ctx: Context,
    suffix: AsSuffix,
    inner: Expression,
    expected: Array<Type>,
) => {
    const type = typeType(ctx, suffix.t);
    if (suffix.hash) {
        const hash = idFromName(suffix.hash.slice(1));
        const defn = ctx.library.terms.defns[idName(hash)];
        if (
            defn &&
            defn.defn.is.type === 'lambda' &&
            defn.defn.is.args.length === 1
        ) {
            const arg = typeExpression(ctx, inner, [defn.defn.is.args[0]]);
            return wrapExpected(
                {
                    type: 'apply',
                    args: [arg],
                    is: defn.defn.is.res,
                    effectVbls: null,
                    location: suffix.location,
                    target: {
                        type: 'ref',
                        ref: { type: 'user', id: hash },
                        is: defn.defn.is,
                        location: suffix.location,
                    },
                    typeVbls: [],
                },
                expected,
            );
        }
        ctx.warnings.push({
            location: suffix.location,
            text: `Invalid hash ${suffix.hash}`,
        });
    }
    const converters: Array<{ is: LambdaType; term: Term }> = ((
        ctx.library.terms.names['as'] || []
    )
        .map((id) =>
            asAs(id, ctx.library.terms.defns[idName(id)].defn.is, type),
        )
        .filter(Boolean) as Array<{ id: Id; is: LambdaType }>).map(
        ({ is, id }) => ({
            is,
            term: {
                type: 'ref',
                ref: { type: 'user', id },
                is,
                location: suffix.location,
            },
        }),
    );
    const validTypes = converters.map((c) => c.is.args[0]);
    const arg = typeExpression(ctx, inner, validTypes);
    const found: { term: Term; is: LambdaType } = converters.find((c) =>
        typesEqual(arg.is, c.is.args[0]),
    ) || {
        term: {
            type: 'NotFound',
            text: 'as',
            location: suffix.location,
            is: pureFunction([arg.is], type),
        },
        is: pureFunction([arg.is], type),
    };

    return wrapExpected(
        {
            type: 'apply',
            args: [arg],
            is: found.is.res,
            effectVbls: null,
            location: suffix.location,
            target: found.term,
            typeVbls: [],
        },
        expected,
    );
    // const x: int = a as b // but what if there are only a to float?
    // const
};
