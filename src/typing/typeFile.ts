// This only really for testing

import path from 'path';
import fs from 'fs';
import { hashObject } from '../typing/env';
import parse, { Expression, Location, Toplevel } from '../parsing/parser';
// import {
//     declarationToAST,
//     printType,
//     termToAST,
//     typeToString,
// } from '../printing/typeScriptPrinter';
// import {
//     optimizeAST,
//     removeTypescriptTypes,
// } from '../printing/typeScriptOptimize';
import typeExpr, { showLocation } from '../typing/typeExpr';
import typeType, { newTypeVbl } from '../typing/typeType';
import {
    // EffectRef,
    Env,
    getEffects,
    // Reference,
    Term,
    // Type,
    // TypeConstraint,
    // typesEqual,
} from '../typing/types';
import {
    showType,
    // unifyInTerm,
    // unifyVariables,
    // getTypeErrorOld,
} from '../typing/unify';
import { items, printToString } from '../printing/printer';
import { declarationToPretty, termToPretty } from '../printing/printTsLike';
import {
    typeDefine,
    typeTypeDefn,
    typeEnumDefn,
    typeEffect,
} from '../typing/env';

import { bool, presetEnv } from '../typing/preset';
import { LocatedError, TypeError } from './errors';

export function typeFile(
    parsed: Toplevel[],
    fname: string,
): {
    env: Env;
    expressions: Array<Term>;
} {
    let env = presetEnv();

    // const
    const expressions = [];

    // const out = prelude.slice();
    for (const item of parsed) {
        if (item.type === 'define') {
            // console.log('>> A define', item.id.text);
            const { term, env: nenv } = typeDefine(env, item);
            env = nenv;
            // console.log('< unified type', showType(env, term.is));
        } else if (item.type === 'effect') {
            env = typeEffect(env, item);
        } else if (item.type === 'StructDef') {
            env = typeTypeDefn(env, item);
        } else if (item.type === 'EnumDef') {
            env = typeEnumDefn(env, item).env;
        } else if (item.type === 'Decorated') {
            if (item.decorators[0].id.text === 'typeError') {
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
                throw new Error(`Unhandled decorator`);
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
