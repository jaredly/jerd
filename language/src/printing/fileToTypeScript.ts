// we want to parse things I guess?

import * as t from '@babel/types';

import { idFromName } from '../typing/env';
import {
    // declarationToAST,
    printType,
    // termToAST,
    // OutputOptions,
} from './typeScriptPrinter';
import { optimizeAST } from './typeScriptOptimize';
import { Env, selfEnv, Term, typesEqual } from '../typing/types';
import { printToString } from './printer';
import { declarationToPretty } from './printTsLike';

import { bool } from '../typing/preset';
import { wrapWithAssert } from './goPrinter';

export const typeScriptPrelude = (
    // opts: OutputOptions,
    scope: string | undefined,
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
        'intToFloat',
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

    if (scope) {
        items.push(
            t.variableDeclaration('const', [
                t.variableDeclarator(
                    t.identifier(scope),
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
        if (scope != null) {
            // const scope = scope;
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

// export const fileToTypescript = (
//     expressions: Array<Term>,
//     env: Env,
//     opts: OutputOptions,
//     assert: boolean,
//     includeImport: boolean,
// ) => {
//     const items = typeScriptPrelude(opts, includeImport);

//     // TODO: use the topo sort algorithm from the web editor
//     // to sort these correctly
//     Object.keys(env.global.terms).forEach((hash) => {
//         const term = env.global.terms[hash];

//         const comment = printToString(
//             declarationToPretty(env, idFromName(hash), term),
//             100,
//         );
//         const senv = selfEnv(env, { name: hash, type: term.is });
//         items.push(declarationToAST(senv, opts, hash, term, comment));
//     });

//     expressions.forEach((term) => {
//         if (assert && typesEqual(term.is, bool)) {
//             term = wrapWithAssert(term);
//         }
//         items.push(termToAST(env, opts, term, printType(env, term.is)));
//     });

//     const ast = t.file(t.program(items, [], 'script'));
//     optimizeAST(ast);
//     return ast;
// };
