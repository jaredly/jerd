import { Decorator, Type } from '../../parsing/parser';
import { idFromName, idName } from '../env';
import { LocatedError } from '../errors';
import { getTypeError } from '../getTypeError';
import typeExpr from '../typeExpr';
import {
    DecoratorArg,
    Env,
    Id,
    Term,
    Type as TermType,
    typesEqual,
} from '../types';
import { Decorator as TypedDecorator } from '../types';

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
        let args: Array<DecoratorArg> = [];
        let id: Id;
        if (dec.id.hash) {
            id = idFromName(dec.id.hash);
        } else {
            const ids = env.global.decoratorNames[dec.id.text];
            if (!ids) {
                throw new Error(`No decorators named ${dec.id.text}`);
            }
            // TODO TODO: Select based on types, not just thiseree
            id = ids[0];
            const decl = env.global.decorators[idName(id)];
            if (decl.arguments.length != null) {
                if (decl.arguments.length > dec.args.length) {
                    throw new LocatedError(dec.location, `Too few arguments`);
                }
                if (!decl.restArg && dec.args.length > decl.arguments.length) {
                    throw new LocatedError(dec.location, `Too many arguments`);
                }
                args = dec.args.map((arg, i) => {
                    if (arg.type === 'Expr') {
                        const expected = decl.arguments[i].type;
                        const term = typeExpr(
                            env,
                            arg.expr,
                            expected || undefined,
                        );
                        if (expected && !checkType(env, term, expected)) {
                            throw new LocatedError(
                                arg.location,
                                `Wrong type for decorator argument`,
                            );
                        }
                        return { type: 'Term', term: term };
                    }
                    throw new Error(`Only exprs right now`);
                });
            }
            // if (
            //     decl.arguments.length ||
            //     (decl.restArg && decl.restArg.type !== null)
            // ) {
            //     dec.args;
            //     throw new Error(`arg validation not there yet`);
            // }
            if (decl.targetType) {
                if (!checkType(env, inner, decl.targetType)) {
                    throw new LocatedError(
                        decl.location,
                        `Decorator applied to wrong type of thing`,
                    );
                }
            }
            // TODO: some validation I think
        }
        return {
            // RESOLVE IT FOLKS
            name: { id, location: dec.id.location },
            location: dec.location,
            args,
        };
    });
};
