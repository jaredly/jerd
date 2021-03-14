import * as t from '@babel/types';
import generate from '@babel/generator';
// um what now

// we want to parse things I guess?

import path from 'path';
import fs from 'fs';
import { hashObject } from '../typing/env';
import parse, { Expression, Location, Toplevel } from '../parsing/parser';
import {
    declarationToAST,
    printType,
    termToAST,
    typeToString,
} from '../printing/typeScriptPrinter';
import {
    optimizeAST,
    removeTypescriptTypes,
} from '../printing/typeScriptOptimize';
import typeExpr, { showLocation } from '../typing/typeExpr';
import typeType, { newTypeVbl } from '../typing/typeType';
import {
    EffectRef,
    Env,
    getEffects,
    Reference,
    Term,
    Type,
    TypeConstraint,
    typesEqual,
} from '../typing/types';
import {
    showType,
    unifyInTerm,
    unifyVariables,
    fitsExpectation,
} from '../typing/unify';
import { items, printToString } from '../printing/printer';
import { declarationToPretty, termToPretty } from '../printing/printTsLike';
import {
    typeDefine,
    typeTypeDefn,
    typeEnumDefn,
    typeEffect,
} from '../typing/env';
import { typeFile } from '../typing/typeFile';

import { bool, presetEnv } from '../typing/preset';

export const fileToTypescript = (
    expressions: Array<Term>,
    env: Env,
    assert: boolean,
    includeImport: boolean,
) => {
    const items: Array<t.Statement> = [];

    if (includeImport) {
        items.push(
            t.importDeclaration(
                [
                    ...[
                        'raise',
                        'isSquare',
                        'log',
                        'intToString',
                        'handleSimpleShallow2',
                        'assert',
                        'assertEqual',
                        'pureCPS',
                    ].map((name) =>
                        t.importSpecifier(
                            t.identifier(name),
                            t.identifier(name),
                        ),
                    ),
                ],
                t.stringLiteral('./prelude.mjs'),
            ),
        );
    }

    Object.keys(env.global.terms).forEach((hash) => {
        const term = env.global.terms[hash];

        items.push(
            declarationToAST(
                {
                    ...env,
                    local: {
                        ...env.local,
                        self: { name: hash, type: term.is },
                    },
                },
                hash,
                term,
                printToString(
                    declarationToPretty(
                        env,
                        {
                            hash: hash,
                            size: 1,
                            pos: 0,
                        },
                        term,
                    ),
                    100,
                ),
            ),
        );
    });

    const callBuiltin = (
        name: string,
        argTypes: Array<Type>,
        resType: Type,
        args: Array<Term>,
        location: Location | null,
    ): Term => {
        return {
            type: 'apply',
            target: {
                type: 'ref',
                ref: { type: 'builtin', name: name },
                location,
                is: {
                    type: 'lambda',
                    location,
                    args: argTypes,
                    res: resType,
                    rest: null,
                    typeVbls: [],
                    effectVbls: [],
                    effects: [],
                },
            },
            args: args,
            location,
            typeVbls: [],
            effectVbls: null,
            is: resType,
        };
    };

    expressions.forEach((term) => {
        if (assert && typesEqual(term.is, bool)) {
            if (
                term.type === 'apply' &&
                term.target.type === 'ref' &&
                term.target.ref.type === 'builtin' &&
                term.target.ref.name === '=='
            ) {
                term = callBuiltin(
                    'assertEqual',
                    (term.target.is as any).args,
                    bool,
                    term.args,
                    term.location,
                );
            } else {
                term = callBuiltin(
                    'assert',
                    [bool],
                    bool,
                    [term],
                    term.location,
                );
            }
        }
        items.push(termToAST(env, term, printType(env, term.is)));
    });

    const ast = t.file(t.program(items, [], 'script'));
    optimizeAST(ast);
    return ast;
};
