import { Identifier, Location } from '../parsing/parser-new';
import * as preset from '../typing/preset';
import { Symbol, Term, Type } from '../typing/types';
import { parseIdOrSym } from './hashes';
import { resolveNamedValue, resolveValue } from './resolve';
import { Context } from './Context';
import { wrapExpected } from './typeExpression';
import { idName } from '../typing/env';

// - hash (sym or term)
// - text match for bindings
// - text match for defines
// and that's it folks.
export const typeIdentifierMany = (ctx: Context, parsedId: Identifier) => {
    const options: Array<
        Term | { type: 'var'; is: null; sym: Symbol; location: Location }
    > = [];
    if (parsedId.hash) {
        const idOrSym = parseIdOrSym(parsedId.hash.slice(1));
        if (idOrSym?.type === 'id') {
            const term = ctx.library.terms.defns[idName(idOrSym.id)];
            if (term != null) {
                options.push({
                    type: 'ref',
                    is: term.defn.is,
                    location: parsedId.location,
                    ref: { type: 'user', id: idOrSym.id },
                });
            }
        } else if (idOrSym?.type === 'sym') {
            const binding = ctx.bindings.values.find(
                (b) => b.sym.unique === idOrSym.unique,
            );
            if (binding) {
                options.push({
                    type: 'var',
                    is: binding.type,
                    sym: binding.sym,
                    location: parsedId.location,
                });
            }
        }
    }
    ctx.bindings.values.forEach((binding) => {
        if (binding.sym.name === parsedId.text) {
            options.push({
                type: 'var',
                is: binding.type,
                sym: binding.sym,
                location: parsedId.location,
            });
        }
    });
    const ids = ctx.library.terms.names[parsedId.text];
    if (ids) {
        ids.forEach((id) => {
            const term = ctx.library.terms.defns[idName(id)];
            options.push({
                type: 'ref',
                ref: { type: 'user', id },
                is: term.defn.is,
                location: parsedId.location,
            });
        });
    }
    if (ctx.builtins.terms[parsedId.text]) {
        options.push({
            type: 'ref',
            ref: { type: 'builtin', name: parsedId.text },
            is: ctx.builtins.terms[parsedId.text],
            location: parsedId.location,
        });
    }
    return options;
};

export const typeIdentifier = (
    ctx: Context,
    term: Identifier,
    expected: Array<Type>,
): Term => {
    if (term.hash) {
        if (term.hash === '#builtin') {
            if (ctx.builtins.terms[term.text]) {
                return wrapExpected(
                    {
                        type: 'ref',
                        ref: { type: 'builtin', name: term.text },
                        is: ctx.builtins.terms[term.text],
                        location: term.location,
                    },
                    expected,
                );
            }
        }
        const idOrSym = parseIdOrSym(term.hash.slice(1));
        const resolved =
            idOrSym && resolveValue(ctx, idOrSym, term.location, expected);
        if (resolved) {
            return resolved;
        }
        ctx.warnings.push({
            location: term.location,
            text: `Unable to resolve term hash ${term.hash}`,
        });
    }
    const named = resolveNamedValue(ctx, term.text, term.location, expected);
    if (named) {
        return wrapExpected(named, expected);
    }
    if (expected.length) {
        // Try resolving without an expected type
        const got = resolveNamedValue(ctx, term.text, term.location, []);
        if (got) {
            return {
                type: 'TypeError',
                is: expected[0],
                inner: got,
                location: term.location,
            };
        }
    }
    return {
        type: 'NotFound',
        is: expected.length ? expected[0] : preset.void_,
        location: term.location,
        text: term.text,
    };
};
