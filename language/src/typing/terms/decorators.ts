import { Decorator, Location, Type } from '../../parsing/parser';
import { idFromName, idName } from '../env';
import { LocatedError } from '../errors';
import { getTypeError } from '../getTypeError';
import typeExpr, { applyTypeVariablesToDecoratorDef } from '../typeExpr';
import {
    DecoratorArg,
    DecoratorDef,
    Env,
    GlobalEnv,
    Id,
    Term,
    Type as TermType,
    typesEqual,
} from '../types';
import { Decorator as TypedDecorator } from '../types';
import typeType from '../typeType';

export const checkType = (env: Env, term: Term, type: TermType) => {
    if (
        type.type === 'ref' &&
        type.ref.type === 'builtin' &&
        type.ref.name === 'Constant'
    ) {
        const inner = type.typeVbls[0];
        if (!typesEqual(term.is, inner)) {
            return false;
        }
        return ['string', 'int', 'float', 'boolean', 'ref', 'Array'].includes(
            term.type,
        );
    } else {
        return typesEqual(term.is, type);
    }
};

export const typeDecorators = (
    env: Env,
    decorators: Array<Decorator>,
    inner: Term,
): Array<TypedDecorator> => {
    return decorators.map((dec) => {
        // hrmmmmmmmmmmmmmmmmmmmmmmmmmmm
        // should decorators be identified by hash as well?
        // I've been thinking just raw text
        // buuut
        // like why not?
        // hmm that saves us from clashes ...
        // which yeah that would be very cool....
        // hmmmm that means I need a new entry in the env, right?
        // hmmmmmmmm should/could I double-it up with macros?
        // ok so maybe macros will get registered, and also maybe
        // declare what attributes they care about
        // ok but it might be nice to have `@something#hash.raw-text`
        let args: Array<DecoratorArg> = dec.args.map((arg, i) => {
            if (arg.type === 'Expr') {
                const term = typeExpr(env, arg.expr, undefined);
                return { type: 'Term', term: term };
            }
            throw new Error(`Only exprs right now`);
        });

        const typeVbls: Array<TermType> = dec.typeVbls.map((t) =>
            typeType(env, t),
        );

        if (dec.id.hash) {
            const id = idFromName(dec.id.hash);
            const decl = getDecorator(env, id, typeVbls);
            const err = checkDecorator(env, inner, args, decl, dec.location);
            if (err) {
                throw err;
            }
            return {
                name: { id, location: dec.id.location },
                location: dec.location,
                args,
            };
        } else {
            const ids = env.global.decoratorNames[dec.id.text];
            if (!ids) {
                throw new Error(`No decorators named ${dec.id.text}`);
            }
            let id: Id | null = null;
            let lastErr = null;
            for (let i of ids) {
                const decl = getDecorator(env, i, typeVbls);
                const err = checkDecorator(
                    env,
                    inner,
                    args,
                    decl,
                    dec.location,
                );
                if (!err) {
                    id = i;
                    break;
                }
                lastErr = err;
            }
            if (id === null) {
                throw lastErr;
            }
            return {
                name: { id: id!, location: dec.id.location },
                location: dec.location,
                args,
            };
        }
    });
};

export const getDecorator = (env: Env, id: Id, typeVbls: Array<TermType>) => {
    const hash = idName(id);
    const decl = env.global.decorators[hash];
    if (typeVbls.length) {
        return applyTypeVariablesToDecoratorDef(
            env,
            decl,
            typeVbls,
            null,
            hash,
        );
    }
    return decl;
};

export const checkDecorator = (
    env: Env,
    inner: Term,
    args: Array<DecoratorArg>,
    decl: DecoratorDef,
    location: Location,
) => {
    if (decl.arguments.length != null) {
        if (decl.arguments.length > args.length) {
            return new LocatedError(location, `Too few arguments`);
        }
        if (!decl.restArg && args.length > decl.arguments.length) {
            return new LocatedError(location, `Too many arguments`);
        }
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (arg.type !== 'Term') {
                return new Error(`Decorator arg not a term, cant validate`);
            }
            const expected = decl.arguments[i].type;
            if (expected && !checkType(env, arg.term, expected)) {
                return new LocatedError(
                    arg.term.location,
                    `Wrong type for decorator argument`,
                );
            }
        }
    }
    if (decl.targetType) {
        if (!checkType(env, inner, decl.targetType)) {
            return new LocatedError(
                decl.location,
                `Decorator applied to wrong type of thing`,
            );
        }
    }
};
