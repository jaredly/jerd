// This only really for testing

import { Expression, Toplevel } from '../parsing/parser';
import typeExpr, { showLocation } from '../typing/typeExpr';
import { Env, getEffects, newLocal, Term, Type } from '../typing/types';
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
} from '../typing/env';

import { presetEnv } from '../typing/preset';
import { LocatedError, TypeError } from './errors';

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
            if (item.wrapped.type === 'StructDef') {
                const unique = item.decorators.filter(
                    (d) => d.id.text === 'unique',
                );
                const ffi = item.decorators.filter((d) => d.id.text === 'ffi');
                let unum = undefined;
                if (unique.length) {
                    if (
                        unique[0].args.length !== 1 ||
                        unique[0].args[0].type !== 'float'
                    ) {
                        throw new LocatedError(
                            item.location,
                            `@unique must have a float argument`,
                        );
                    }
                    unum = unique[0].args[0].value;
                }
                let tag = undefined;
                if (ffi.length) {
                    tag = item.wrapped.id.text;
                    if (ffi[0].args.length === 1) {
                        if (ffi[0].args[0].type !== 'string') {
                            throw new LocatedError(
                                item.location,
                                `ffi arg must be a string`,
                            );
                        }
                        tag = ffi[0].args[0].text;
                    }
                }
                env = typeTypeDefn(env, item.wrapped, tag, unum);
            } else if (item.decorators[0].id.text === 'typeError') {
                const args = item.decorators[0].args.map((expr) =>
                    typeExpr(env, expr),
                );
                if (args.length !== 1 || args[0].type !== 'string') {
                    throw new Error(
                        `Expected one string arg to @typeExpr ${showLocation(
                            item.location,
                        )}`,
                    );
                }
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
                } catch (err) {
                    const message =
                        err instanceof TypeError ? err.toString() : err.message;
                    if (message.includes(args[0].text)) {
                        continue; // success
                    } else {
                        console.log(err.stack);
                        throw new LocatedError(
                            item.location,
                            `Type error doesn't match expectation: "${message}" vs "${args[0].text}"`,
                        ).wrap(err);
                    }
                }
                throw new Error(
                    `Expected a type error, but got ${showType(
                        env,
                        t.is,
                    )} at ${showLocation(expr.location)}\n${printToString(
                        termToPretty(env, t),
                        100,
                    )}`,
                );
            } else {
                if (
                    item.wrapped.type === 'EnumDef' ||
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
            return null;
        default:
            return item;
    }
};
