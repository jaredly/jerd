import { Decorated, Decorated_inner, Location } from '../parsing/parser-new';
import { idFromName, idName } from '../typing/env';
import { void_ } from '../typing/preset';
import { subtTypeVars } from '../typing/typeExpr';
import {
    Decorator,
    DecoratorArg,
    DecoratorDef,
    DecoratorDefArg,
    Id,
    Term,
    Type,
    typesEqual,
} from '../typing/types';
import { Context } from './Context';
import { createTypeVblMapping } from './ops';
import { typeExpression } from './typeExpression';
import { typeType } from './typeType';

export const typeDecorated = (
    ctx: Context,
    term: Decorated_inner,
    expected: Array<Type>,
): Term => {
    const inner = typeExpression(ctx, term.wrapped, expected);
    const decorators: Array<Decorator> = term.decorators
        .map((dec): Decorator | null => {
            let args: Array<DecoratorArg> =
                dec.args?.items.map(({ arg }, i) => {
                    switch (arg.type) {
                        case 'DecExpr':
                            return {
                                type: 'Term',
                                term: typeExpression(ctx, arg.expr, []),
                            };
                        case 'DecPat':
                        case 'DecType':
                            throw new Error('decorator pattern, folks');
                        default:
                            let _x: never = arg;
                            throw new Error('nope');
                    }
                }) || [];
            const typeVbls: Array<Type> =
                dec.typeVbls?.inner.items.map((t) => typeType(ctx, t)) || [];

            if (dec.id.hash) {
                const id = idFromName(dec.id.hash.slice(1));
                const decl: DecoratorDef | null = getDecorator(
                    ctx,
                    id,
                    typeVbls,
                    dec.location,
                );
                if (!decl) {
                    // TODO: preserve this please!
                    ctx.warnings.push({
                        location: dec.location,
                        text: `No decorator with id ${dec.id.hash}`,
                    });
                    return null;
                }
                if (decl.targetType && !typesEqual(decl.targetType, inner.is)) {
                    ctx.warnings.push({
                        location: dec.location,
                        text: `ugh target type is wrong, need a custom node for this too`,
                    });
                    return null;
                }
                return {
                    name: { id, location: dec.id.location },
                    args: decl.arguments.map((t, i) => {
                        return argWithFallback(t, args[i], dec.location);
                    }),
                    location: dec.location,
                };
            } else {
                const ids = ctx.library.decorators.names[dec.id.text];
                if (!ids) {
                    // TODO: Not found decorator!
                    ctx.warnings.push({
                        location: dec.location,
                        text: `No decorators named ${dec.id.text}`,
                    });
                    return null;
                }
                let first: DecoratorDef | null = null;
                for (let id of ids) {
                    const decl = getDecorator(ctx, id, typeVbls, dec.location);
                    if (decl && !first) {
                        first = decl;
                    }
                    if (!decl || decl.arguments.length !== args.length) {
                        continue;
                    }
                    if (
                        decl.targetType &&
                        !typesEqual(decl.targetType, inner.is)
                    ) {
                        continue;
                    }
                    const matches = decl.arguments.every((arg, i) => {
                        return argMatch(arg, args[i]);
                        // return !arg.type || typesEqual(arg.type, (args[i] as {type: 'Term', term: Term}).term.is)
                    });
                    if (matches) {
                        return {
                            name: { id, location: dec.id.location },
                            location: dec.location,
                            args,
                        };
                    }
                }
                if (!first) {
                    ctx.warnings.push({
                        location: dec.location,
                        text: `No for type vbls or something`,
                    });
                    return null;
                }
                return {
                    name: { id: ids[0], location: dec.id.location },
                    location: dec.location,
                    args: first.arguments.map(
                        (t, i): DecoratorArg => {
                            if (i < args.length) {
                                return argWithFallback(
                                    t,
                                    args[i],
                                    dec.location,
                                );
                            }
                            return termHole(term.location, t.type);
                        },
                    ),
                };
            }
        })
        .filter(Boolean) as Array<Decorator>;
    return { ...inner, decorators };
};

const argWithFallback = (
    arg: DecoratorDefArg,
    found: DecoratorArg | undefined,
    location: Location,
): DecoratorArg => {
    const expected: Type = arg.type || void_;
    if (!found || found.type !== 'Term') {
        return { type: 'Term', term: { type: 'Hole', location, is: expected } };
    }
    if (!arg.type || typesEqual(found.term.is, arg.type)) {
        return found;
    }
    return {
        type: 'Term',
        term: {
            type: 'TypeError',
            inner: found.term,
            is: expected,
            location,
            otherOptions: [],
        },
    };
};

const argMatch = (arg: DecoratorDefArg, found: DecoratorArg) => {
    return (
        found.type === 'Term' &&
        (!arg.type || typesEqual(found.term.is, arg.type))
    );
};

export const getDecorator = (
    ctx: Context,
    id: Id,
    typeVbls: Array<Type>,
    location: Location,
): DecoratorDef | null => {
    const hash = idName(id);
    const decl = ctx.library.decorators.defns[hash];
    if (!decl) {
        return null;
    }
    if (decl.defn.typeVbls.length) {
        return applyTypeVariablesToDecoratorDef(
            ctx,
            decl.defn,
            decl.defn.typeVbls.map((_, i) =>
                i < typeVbls.length ? typeVbls[i] : { type: 'THole', location },
            ),
            null,
            hash,
        );
    }
    return decl.defn;
};

export const applyTypeVariablesToDecoratorDef = (
    ctx: Context,
    defn: DecoratorDef,
    vbls: Array<Type>,
    location: Location | null,
    selfHash: string,
): DecoratorDef | null => {
    if (defn.typeVbls.length !== vbls.length) {
        return null;
    }
    const mapping = createTypeVblMapping(ctx, defn.typeVbls, vbls, location!)!;
    return {
        ...defn,
        typeVbls: [],
        arguments: defn.arguments.map((arg) =>
            arg.type
                ? { ...arg, type: subtTypeVars(arg.type, mapping, selfHash) }
                : arg,
        ),
        restArg:
            defn.restArg && defn.restArg.type
                ? {
                      ...defn.restArg,
                      type: subtTypeVars(defn.restArg.type, mapping, selfHash),
                  }
                : defn.restArg,
        targetType: defn.targetType
            ? subtTypeVars(defn.targetType, mapping, selfHash)
            : defn.targetType,
    };
};

function termHole(
    location: Location,
    type: Type | null,
): { type: 'Term'; term: Term } {
    return {
        type: 'Term',
        term: {
            type: 'Hole',
            location,
            is: type || void_,
        },
    };
}
