// This only really for testing

import {
    Decorated,
    DecoratedExpression,
    Decorator,
    Expression,
    Toplevel,
} from '../parsing/parser';
import typeExpr, { showLocation } from '../typing/typeExpr';
import {
    Env,
    getEffects,
    newLocal,
    newWithGlobal,
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
    addToplevelToEnv,
    typeDefineInner,
    addDefine,
} from '../typing/env';

import { presetEnv } from '../typing/preset';
import { LocatedError, TypeError } from './errors';
import { transform } from './transform';
import { addLocationIndices, addLocationIndicesToTerm } from './analyze';

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
        if (
            item.type === 'Decorated' &&
            item.decorators.length > 0 &&
            item.decorators[0].id.text === 'typeError'
        ) {
            handleTypeError(env, item);
            continue;
        }
        if (item.type === 'Decorated' && item.wrapped.type === 'define') {
            const term = typeDefineInner(env, item.wrapped);
            const res = addDefine(env, item.wrapped.id.text, term);
            env = res.env;
            const tags = item.decorators.map((d) => d.id.text);
            env.global.metaData[idName(res.id)].tags = tags;
            if (tags.includes('ffi')) {
                env.global.exportedTerms[item.wrapped.id.text] = res.id;
            }
            continue;
        }

        const toplevel = typeToplevelT(newWithGlobal(env.global), item, null);
        if (toplevel.type === 'Expression') {
            expressions.push(toplevel.term);
        } else {
            env = addToplevelToEnv(env, toplevel).env;
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
        case 'Expression':
            return item.expr;
    }
};

const handleTypeError = (env: Env, item: Decorated) => {
    const args = item.decorators[0].args;
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
    if (item.wrapped.type !== 'Expression') {
        throw new Error(
            `Expected typeError to be on an expression ${showLocation(
                item.location,
            )}`,
        );
    }
    const expr = item.wrapped.expr;
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
        if (!(err instanceof Error)) {
            throw err;
        }
        const message = err.toString();
        if (message.includes(str)) {
            return;
        } else {
            console.log(err.stack);
            if (!(err instanceof TypeError)) {
                throw err;
            }
            throw new LocatedError(
                item.location,
                `Type error doesn't match expectation: "${message}" vs "${str}"`,
            ).wrap(err);
        }
    }

    throw new LocatedError(
        expr.location,
        `Expected a type error, but got ${showType(env, t.is)}\n${printToString(
            termToPretty(env, t),
            100,
        )}`,
    );
};
