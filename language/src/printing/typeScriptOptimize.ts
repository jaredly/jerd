// Various functions for optimizing the typescript AST that I produce
//
// This allows me to have a relatively unsophisticated typescript printer,
// for example that produces things like `((a) => x(a))(a)`, (which happens
// rather a lot when transforming to CPS), and have the resulting ts be
// just `x(a)`.

import * as t from '@babel/types';
import traverse from '@babel/traverse';
import { withLocation } from './typeScriptPrinterSimple';

export const optimizeAST = (ast: t.File) => {
    flattenImmediateCallsToLets(ast);
    flattenDoubleLambdas(ast);
    // Got to do this twice
    // If I combined it with flattenDoubleLambdas I might not need to?
    // but it's not like it takes a ton of time
    flattenImmediateCallsToLets(ast);
    removeBlocksWithNoDeclarations(ast);
    flattenDoubleLambdas(ast);
};

const equalIdentifiers = (a: any, b: any) =>
    a &&
    b &&
    a.type === 'Identifier' &&
    b.type === 'Identifier' &&
    a.name === b.name;

const flattenDoubleLambdas = (ast: t.File) => {
    traverse(ast, {
        CallExpression(path) {
            if (
                path.parent.type === 'ReturnStatement' &&
                path.node.callee.type === 'FunctionExpression'
            ) {
                if (path.node.callee.params.length === 0) {
                    path.parentPath.replaceWithMultiple(
                        path.node.callee.body.body,
                    );
                }
                return;
            }
            const { callee } = path.node;
            if (
                callee.type === 'FunctionExpression' &&
                callee.body.body.length === 1 &&
                callee.body.body[0].type === 'ReturnStatement' &&
                callee.body.body[0].argument != null &&
                callee.params.length === 0
            ) {
                path.replaceWith(callee.body.body[0].argument);
                return;
            }
            if (callee.type !== 'ArrowFunctionExpression') {
                return;
            }
            if (
                path.node.arguments.length <= callee.params.length &&
                path.node.arguments.every((arg, i) =>
                    equalIdentifiers(arg, callee.params[i]),
                )
            ) {
                path.replaceWith(callee.body);
            }
        },
        ArrowFunctionExpression(path) {
            const body = path.node.body;
            if (body.type !== 'CallExpression') {
                return;
            }
            // (a, b) => ((m, _ignored) => abc)(m)
            if (
                body.arguments.length <= path.node.params.length &&
                path.node.params.every((arg, i) =>
                    equalIdentifiers(arg, body.arguments[i]),
                )
            ) {
                path.replaceWith(body.callee);
            }
        },
    });
};

export const removeTypescriptTypes = (ast: t.File) => {
    traverse(ast, {
        TSTypeAnnotation(path) {
            path.remove();
        },
        TSTypeAliasDeclaration(path) {
            path.remove();
        },
        TSAsExpression(path) {
            path.replaceWith(path.node.expression);
        },
        ImportDeclaration(path) {
            // lol hack
            // this is so typescript is happy
            // but it's not valid javascript
            // and there's not really a way to tell
            if (
                path.node.specifiers.length === 1 &&
                path.node.specifiers[0].local.name === 'Handlers'
            ) {
                path.remove();
            }
        },
        TSTypeParameterDeclaration(path) {
            path.remove();
        },
    });
};

const flattenImmediateCallsToLets = (ast: t.File) => {
    traverse(ast, {
        CallExpression(path) {
            // Toplevel iffes definitely shouldn't be messed with.
            // STOPSHIP: verify that this does what I think it should
            let found = false;
            let test: any = path;
            while (test.parentPath) {
                if (test.parentPath.isFunction()) {
                    found = true;
                    break;
                }
                test = test.parentPath;
            }
            if (!found) {
                // Not in a function
                return;
            }
            if (path.parentPath.parent.type !== 'BlockStatement') {
                return;
            }
            // If we're not in tail position, don't bother?
            // I mean, maybe bother. But only if there are no 'returns'
            if (
                path.parentPath.parent.body.indexOf(
                    path.parent as t.Statement,
                ) <
                path.parentPath.parent.body.length - 1
            ) {
                // STOPSHIP: look through the body to see if there are any explicit returns.
                // if not, then we don't have to bail here.
                return;
            }

            if (
                path.node.callee.type === 'ArrowFunctionExpression' &&
                path.node.arguments.length === path.node.callee.params.length &&
                path.node.callee.body.type === 'BlockStatement' &&
                path.parent.type === 'ExpressionStatement' &&
                path.node.arguments.every((n) => t.isExpression(n))
            ) {
                const args = path.node.arguments;
                // This block statement will get collapsed if it's safe
                // to do so, by `removeBlocksWithoutDeclarations`.
                path.parentPath.replaceWith(
                    t.blockStatement([
                        ...(path.node.callee.params
                            .map((param, i) => {
                                const arg = args[i] as t.Expression;
                                const name =
                                    param.type === 'Identifier'
                                        ? param.name
                                        : 'unknown';
                                if (equalIdentifiers(param, arg)) {
                                    return null;
                                }
                                return name === '_ignored'
                                    ? t.expressionStatement(arg)
                                    : t.variableDeclaration('const', [
                                          t.variableDeclarator(
                                              //   withLocation(
                                              // param.typeAnnotation ?

                                              // t.identifier(name),
                                              param.type === 'Identifier'
                                                  ? param
                                                  : t.identifier(name),
                                              //     param.loc,
                                              //   ),
                                              arg,
                                          ),
                                      ]);
                            })
                            .filter(Boolean) as Array<t.Statement>),
                        path.node.callee.body,
                    ]),
                );
            }
        },
    });
};

const removeBlocksWithNoDeclarations = (ast: t.File) => {
    traverse(ast, {
        IfStatement(path) {
            const alt = path.get('alternate');
            if (
                alt != null &&
                alt.node != null &&
                alt.node.type === 'BlockStatement' &&
                alt.node.body.length === 1 &&
                alt.node.body[0].type === 'IfStatement'
            ) {
                alt.replaceWith(alt!.node.body[0]);
            }
        },
        BlockStatement(path) {
            const node = path.node;
            const res: Array<t.Statement> = [];
            let changed = false;
            const count = node.body.length;
            node.body.forEach((inner, i) => {
                if (inner.type !== 'BlockStatement') {
                    return res.push(inner);
                }
                const hasDeclares = inner.body.some(
                    (n) => n.type === 'VariableDeclaration',
                );
                if (hasDeclares && i < count - 1) {
                    return res.push(inner);
                }
                changed = true;
                res.push(...inner.body);
            });
            // node.body = res;
            if (changed) {
                path.replaceWith(t.blockStatement(res));
            }
        },
    });
};
