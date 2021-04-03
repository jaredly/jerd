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
    OutputOptions,
} from './typeScriptPrinter';
import { optimizeAST, removeTypescriptTypes } from './typeScriptOptimize';
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
    // unifyVariables,
    getTypeErrorOld,
} from '../typing/unify';
import { items, printToString } from './printer';
import { declarationToPretty, termToPretty } from './printTsLike';
import {
    typeDefine,
    typeTypeDefn,
    typeEnumDefn,
    typeEffect,
} from '../typing/env';
import { typeFile } from '../typing/typeFile';

import { bool, presetEnv } from '../typing/preset';
import { wrapWithAssert } from './goPrinter';

export const typeScriptPrelude = (
    opts: OutputOptions,
    includeImport: boolean,
) => {
    const items: Array<t.Statement> = [];
    const builtinNames = [
        'raise',
        'isSquare',
        'log',
        'intToString',
        'handleSimpleShallow2',
        'assert',
        'assertEqual',
        'pureCPS',
        'pow',
        'ln',
        'PI',
        'TAU',
        // Probably want to group these...
        'sqrt',
        'max',
        'min',
        'sin',
        'cos',
        'tan',
        'asin',
        'acos',
        'atan',
        'atan2',
    ];

    if (opts.scope) {
        items.push(
            t.variableDeclaration('const', [
                t.variableDeclarator(
                    t.identifier(opts.scope),
                    t.objectExpression([
                        t.objectProperty(
                            t.identifier('builtins'),
                            t.objectExpression([]),
                        ),
                        t.objectProperty(
                            t.identifier('terms'),
                            t.objectExpression([]),
                        ),
                        // Blank execution limit
                        t.objectProperty(
                            t.identifier('checkExecutionLimit'),
                            t.arrowFunctionExpression([], t.nullLiteral()),
                        ),
                    ]),
                ),
            ]),
        );
    }

    if (includeImport) {
        items.push(
            t.importDeclaration(
                [
                    ...builtinNames.map((name) =>
                        t.importSpecifier(
                            t.identifier(name),
                            t.identifier(name),
                        ),
                    ),
                ],
                t.stringLiteral('./prelude.mjs'),
            ),
        );
        if (opts.scope != null) {
            const scope = opts.scope;
            builtinNames.forEach((name) =>
                items.push(
                    t.expressionStatement(
                        t.assignmentExpression(
                            '=',
                            t.memberExpression(
                                t.memberExpression(
                                    t.identifier(scope),
                                    t.identifier('builtins'),
                                ),
                                t.stringLiteral(name),
                                true,
                            ),
                            t.identifier(name),
                        ),
                    ),
                ),
            );
        }
    }

    return items;
};

export const fileToTypescript = (
    expressions: Array<Term>,
    env: Env,
    opts: OutputOptions,
    assert: boolean,
    includeImport: boolean,
) => {
    const items = typeScriptPrelude(opts, includeImport);

    // TODO: use the topo sort algorithm from the web editor
    // to sort these correctly
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
                opts,
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

    expressions.forEach((term) => {
        if (assert && typesEqual(term.is, bool)) {
            term = wrapWithAssert(term);
        }
        items.push(termToAST(env, opts, term, printType(env, term.is)));
    });

    const ast = t.file(t.program(items, [], 'script'));
    optimizeAST(ast);
    return ast;
};
