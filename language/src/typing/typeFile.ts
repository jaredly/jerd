// This only really for testing

import { Decorator, Expression, Toplevel } from '../parsing/parser';
import typeExpr, { showLocation } from '../typing/typeExpr';
import {
    Env,
    getEffects,
    newLocal,
    Term,
    TypeError as TypeErrorTerm,
} from '../typing/types';
import { showType } from '../typing/unify';
import { printToString } from '../printing/printer';
import { termToPretty } from '../printing/printTsLike';
import {
    typeDefine,
    typeTypeDefn,
    typeEnumDefn,
    typeEffect,
    idName,
    typeToplevelT,
    typeDecoratorDef,
} from '../typing/env';

import { presetEnv } from '../typing/preset';
import { LocatedError, TypeError } from './errors';
import { transform } from './transform';

export const uniqueDecorator = (
    decorators: Array<Decorator>,
): { decorators: Array<Decorator>; unique: null | number } => {
    const uniques = decorators.filter((d) => d.id.text === 'unique');
    if (uniques.length > 1) {
        throw new LocatedError(
            uniques[1].location,
            `Can't have multiple uniques`,
        );
    }
    if (!uniques.length) {
        return { decorators, unique: null };
    }
    const others = decorators.filter((d) => d.id.text !== 'unique');
    const unique = uniques[0];
    if (unique.args.length !== 1) {
        throw new LocatedError(unique.location, `Unique takes 1 argument`);
    }
    const arg = unique.args[0];
    if (
        arg.type !== 'Expr' ||
        !(arg.expr.type === 'int' || arg.expr.type === 'float')
    ) {
        throw new LocatedError(
            unique.location,
            `Unique takes 1 numeric argument`,
        );
    }
    return { unique: arg.expr.value, decorators: others };
};

export function typeFile(
    parsed: Toplevel[],
    env: Env,
    fname: string,
): {
    env: Env;
    expressions: Array<Term>;
} {
    // const
    const expressions = [];

    // const out = prelude.slice();
    for (const item of parsed) {
        // Clear out the locals. This is definitely not the
        // right way to do this lol.
        env = { ...env, local: newLocal() };

        if (item.type === 'define') {
            // console.log('>> A define', item.id.text);
            const { term, env: nenv, id } = typeDefine(env, item);
            env = nenv;
            env.global.metaData[idName(id)] = {
                tags: [],
                createdMs: Date.now(),
            };
            // console.log('< unified type', showType(env, term.is));
        } else if (item.type === 'effect') {
            env = typeEffect(env, item);
        } else if (item.type === 'StructDef') {
            env = typeTypeDefn(env, item);
        } else if (item.type === 'EnumDef') {
            env = typeEnumDefn(env, item).env;
        } else if (item.type === 'DecoratorDef') {
            env = typeDecoratorDef(env, item).env;
        } else if (item.type === 'Decorated') {
            if (item.wrapped.type === 'define') {
                const { term, env: nenv, id } = typeDefine(env, item.wrapped);
                env = nenv;
                const tags = item.decorators.map((d) => d.id.text);
                env.global.metaData[idName(id)] = {
                    tags,
                    createdMs: Date.now(),
                };
                if (tags.includes('ffi')) {
                    env.global.exportedTerms[item.wrapped.id.text] = id;
                }
                continue;
            }

            if (item.wrapped.type === 'DecoratorDef') {
                const { unique, decorators } = uniqueDecorator(item.decorators);
                if (decorators.length) {
                    throw new Error(
                        `Decorators can only have the 'unique' decorator`,
                    );
                }
                if (unique !== null) {
                    env = typeDecoratorDef(env, item.wrapped, unique).env;
                } else {
                    throw new Error(`Impossible`);
                }
            } else if (item.wrapped.type === 'StructDef') {
                const { unique, decorators } = uniqueDecorator(item.decorators);
                const ffi = decorators.filter((d) => d.id.text === 'ffi');
                const unum = unique != null ? unique : undefined;
                let tag = undefined;
                if (ffi.length) {
                    tag = item.wrapped.id.text;
                    if (ffi[0].args.length === 1) {
                        if (
                            ffi[0].args[0].type !== 'Expr' ||
                            ffi[0].args[0].expr.type !== 'string'
                        ) {
                            throw new LocatedError(
                                item.location,
                                `ffi arg must be a string`,
                            );
                        }
                        tag = ffi[0].args[0].expr.text;
                    }
                }
                env = typeTypeDefn(env, item.wrapped, tag, unum);
            } else if (item.decorators[0].id.text === 'typeError') {
                const args = item.decorators[0].args;
                // if(item)
                // const args = item.decorators[0].args
                // .map((expr) => {
                //     if (expr.type !== 'Expr') {
                //         throw new Error(`nope`)
                //     }
                //     typeExpr(env, expr)
                // }
                // );
                if (
                    !(
                        args.length === 1 &&
                        args[0].type === 'Expr' &&
                        args[0].expr.type === 'string'
                    )
                ) {
                    throw new Error(
                        `Expected one string arg to @typeError ${showLocation(
                            item.location,
                        )}`,
                    );
                }
                const str = args[0].expr.text;
                const expr = toplevelExpr(item.wrapped);
                if (expr == null) {
                    throw new Error(
                        `Expected typeError to be on an expression ${showLocation(
                            item.location,
                        )}`,
                    );
                }
                let t;
                try {
                    t = typeExpr(env, expr);

                    const typeErrors: Array<TypeErrorTerm> = [];
                    transform(t, {
                        let: () => null,
                        term: (term) => {
                            if (term.type === 'TypeError') {
                                typeErrors.push(term);
                            }
                            return null;
                        },
                    });
                    if (typeErrors.length) {
                        const message = `Found ${showType(
                            env,
                            typeErrors[0].inner.is,
                        )}, expected ${showType(env, typeErrors[0].is)}`;
                        throw new Error(message);
                    }
                } catch (err) {
                    if (!(err instanceof TypeError)) {
                        throw err;
                    }
                    const message = err.toString();
                    if (message.includes(str)) {
                        continue; // success
                    } else {
                        console.log(err.stack);
                        throw new LocatedError(
                            item.location,
                            `Type error doesn't match expectation: "${message}" vs "${str}"`,
                        ).wrap(err);
                    }
                }

                throw new LocatedError(
                    expr.location,
                    `Expected a type error, but got ${showType(
                        env,
                        t.is,
                    )}\n${printToString(termToPretty(env, t), 100)}`,
                );
            } else if (item.wrapped.type === 'EnumDef') {
                const ffi = item.decorators.filter((d) => d.id.text === 'ffi');
                if (ffi.length) {
                    env = typeEnumDefn(env, item.wrapped, true).env;
                } else {
                    throw new LocatedError(
                        item.location,
                        `Unexpected decorator on enum definition`,
                    );
                }
            } else {
                if (
                    item.wrapped.type === 'effect' ||
                    item.wrapped.type === 'Decorated'
                ) {
                    throw new LocatedError(
                        item.location,
                        `Unhandled decorator`,
                    );
                }
                // HACK HACK
                const term = typeExpr(env, item.wrapped);
                if (getEffects(term).length > 0) {
                    throw new Error(
                        `Term at ${showLocation(
                            term.location,
                        )} has toplevel effects.`,
                    );
                }
                expressions.push(term);
            }
        } else {
            // A standalone expression
            const term = typeExpr(env, item);
            if (getEffects(term).length > 0) {
                throw new Error(
                    `Term at ${showLocation(
                        term.location,
                    )} has toplevel effects.`,
                );
            }
            expressions.push(term);
        }
    }
    return { expressions, env };
}

const toplevelExpr = (item: Toplevel): Expression | null => {
    switch (item.type) {
        case 'define':
        case 'effect':
        case 'StructDef':
        case 'EnumDef':
        case 'Decorated':
        case 'DecoratorDef':
            return null;
        default:
            return item;
    }
};
