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
    Id,
    idsEqual,
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
    hashObject,
    idFromName,
} from '../typing/env';

import { presetEnv } from '../typing/preset';
import { LocatedError, TypeError } from './errors';
import { transform } from './transform';
import { addLocationIndices, addLocationIndicesToTerm } from './analyze';

export const specifiedToplevelId = (top: Toplevel): Id | null => {
    switch (top.type) {
        case 'define':
        case 'StructDef':
        case 'EnumDef':
        case 'DecoratorDef':
        case 'effect':
            return top.id.hash ? idFromName(top.id.hash.slice(1)) : null;
        case 'Decorated':
            return specifiedToplevelId(top.wrapped);
    }
    return null;
};

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
        const specified = specifiedToplevelId(item);

        if (specified && ['Some', 'None', 'As'].includes(specified.hash)) {
            continue;
        }

        if (item.type === 'Decorated' && item.wrapped.type === 'define') {
            let term = typeDefineInner(env, item.wrapped);
            term = addLocationIndicesToTerm(term);
            const res = addDefine(env, item.wrapped.id.text, term);
            env = res.env;
            const tags = item.decorators.map((d) => d.id.text);
            env.global.metaData[idName(res.id)].tags = tags;
            if (tags.includes('ffi')) {
                env.global.exportedTerms[item.wrapped.id.text] = res.id;
            }
            if (specified && !idsEqual(res.id, specified)) {
                env.global.idRemap[idName(specified)] = res.id;
                console.log(
                    `Different {define}`,
                    idName(specified),
                    idName(res.id),
                );
            }
            continue;
        }

        let toplevel = typeToplevelT(newWithGlobal(env.global), item, null);
        const added = addLocationIndices(toplevel);
        if (hashObject(added) !== hashObject(toplevel)) {
            throw new Error(`Different`);
        }
        // if (toplevel.type === 'Define' && toplevel.name === 'accurateSpiral') {
        //     // require('fs').writeFileSync('./pre.json', JSON.stringify(toplevel));
        //     // require('fs').writeFileSync('./post.json', JSON.stringify(added));
        // }
        toplevel = added;
        // WHYYYYY IS THIS BREAKING THIGNS
        // toplevel = addLocationIndices(toplevel);
        if (toplevel.type === 'Expression') {
            expressions.push(toplevel.term);
        } else {
            const res = addToplevelToEnv(env, toplevel);
            env = res.env;

            if (specified && !idsEqual(res.id, specified)) {
                env.global.idRemap[idName(specified)] = res.id;
                console.log(
                    `Different ${toplevel.type}`,
                    idName(specified),
                    ' is really ',
                    idName(res.id),
                );
            }
        }
    }
    return { expressions, env };
}

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
