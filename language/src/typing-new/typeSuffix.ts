import { Expression, Suffix } from '../parsing/parser-new';
import { Term, Type } from '../typing/types';
import { Context } from './Context';
import { parseIdOrSym } from './hashes';
import { resolveValue } from './resolve';
import { typeApply } from './typeApply';

export const typeSuffix = (
    ctx: Context,
    suffix: Suffix,
    inner: Expression,
    expected: Array<Type>,
): Term => {
    switch (suffix.type) {
        case 'ApplySuffix': {
            return typeApply(ctx, suffix, inner, expected);
            // suffix.
        }
    }
    throw new Error(`nope suffixed ${suffix.type}`);
};

const isUntypedSym = (ctx: Context, inner: Expression) => {
    if (inner.type === 'Identifier') {
        if (inner.hash) {
            const res = parseIdOrSym(inner.hash.slice(1));
            if (res?.type === 'sym') {
                const binding = ctx.bindings.values.find(
                    (b) => b.sym.unique === res.unique,
                );
                if (binding && binding.type === null) {
                    return true;
                }
            }
        }
        const binding = ctx.bindings.values.find(
            (b) => b.sym.name === inner.text,
        );
        if (binding && binding.type === null) {
            return true;
        }
    }
    return false;
};
