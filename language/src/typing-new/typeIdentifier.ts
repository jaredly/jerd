import { Identifier, Location } from '../parsing/parser-new';
import * as preset from '../typing/preset';
import { Id, RecordDef, Symbol, Term, Type, typesEqual } from '../typing/types';
import { parseIdOrSym } from './hashes';
import { emptyRecord, resolveNamedValue, resolveValue } from './resolve';
import { Context, ValueBinding } from './Context';
import { wrapExpected } from './typeExpression';
import { idName } from '../typing/env';

// // - hash (sym or term)
// // - text match for bindings
// // - text match for defines
// // and that's it folks.
export const typeIdentifierMany = (ctx: Context, parsedId: Identifier) => {
    const options: Array<
        Term | { type: 'unbound'; binding: ValueBinding }
    > = [];
    if (parsedId.hash) {
        if (parsedId.hash === '#builtin') {
            if (ctx.builtins.terms[parsedId.text]) {
                options.push({
                    type: 'ref',
                    ref: { type: 'builtin', name: parsedId.text },
                    is: ctx.builtins.terms[parsedId.text],
                    location: parsedId.location,
                });
            } else {
                ctx.warnings.push({
                    location: parsedId.location,
                    text: `Unknown builtin ${parsedId.text}`,
                });
            }
        } else {
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
                const defn = ctx.library.types.defns[idName(idOrSym.id)];
                if (defn && defn.defn.type === 'Record') {
                    options.push(
                        emptyRecord(
                            ctx.library,
                            idOrSym.id,
                            defn.defn,
                            parsedId.location,
                        ),
                    );
                }
                if (!term && !defn) {
                    ctx.warnings.push({
                        location: parsedId.location,
                        text: `Unable to resolve term hash ${parsedId.hash}`,
                    });
                }
            } else if (idOrSym?.type === 'sym') {
                const binding = ctx.bindings.values.find(
                    (b) => b.sym.unique === idOrSym.unique,
                );
                if (binding) {
                    if (!binding.type) {
                        options.push({
                            type: 'unbound',
                            binding,
                        });
                    } else {
                        options.push({
                            type: 'var',
                            is: binding.type,
                            sym: binding.sym,
                            location: parsedId.location,
                        });
                    }
                } else {
                    ctx.warnings.push({
                        location: parsedId.location,
                        text: `Unable to resolve term hash ${parsedId.hash}`,
                    });
                }
            }
        }
    }
    if (ctx.bindings.self && ctx.bindings.self.name === parsedId.text) {
        options.push({
            type: 'self',
            is: ctx.bindings.self.type,
            location: parsedId.location,
        });
    }
    ctx.bindings.values.forEach((binding) => {
        if (binding.sym.name === parsedId.text) {
            if (!binding.type) {
                options.push({
                    type: 'unbound',
                    binding,
                });
            } else {
                options.push({
                    type: 'var',
                    is: binding.type,
                    sym: binding.sym,
                    location: parsedId.location,
                });
            }
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
    for (let id of ctx.library.types.names[parsedId.text] || []) {
        const defn = ctx.library.types.defns[idName(id)];
        if (defn && defn.defn.type === 'Record') {
            const record = emptyRecord(
                ctx.library,
                id,
                defn.defn,
                parsedId.location,
            );
            if (record) {
                options.push(record);
            }
        }
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
    const options = typeIdentifierMany(ctx, term);
    if (!options.length) {
        return {
            type: 'NotFound',
            is: expected.length ? expected[0] : preset.void_,
            location: term.location,
            text: term.text,
        };
    }

    if (expected.length) {
        for (let option of options) {
            // Not interested in not-yet-bound args? I think?
            if (option.type === 'unbound') {
                option.binding.type = expected[0];
                return {
                    type: 'var',
                    sym: option.binding.sym,
                    location: term.location,
                    is: expected[0],
                };
            }
            if (expected.some((t) => typesEqual(t, (option as Term).is))) {
                return option;
            }
        }
    }

    const option = options[0];
    if (option.type === 'unbound') {
        option.binding.type = expected[0] || {
            type: 'THole',
            location: term.location,
        };
        return {
            type: 'var',
            sym: option.binding.sym,
            location: term.location,
            is: option.binding.type!,
        };
    }
    return wrapExpected(option, expected);
};
