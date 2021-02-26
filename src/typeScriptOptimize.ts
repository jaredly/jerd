import * as t from '@babel/types';
import traverse from '@babel/traverse';

export const optimizeAST = (ast: t.File) => {
    flattenImmediateCallsToLets(ast);
    flattenDoubleLambdas(ast);
    unwrapIFFEs(ast);
    removeBlocksWithNoDeclarations(ast);
    removeBlocksWithNoDeclarations(ast);
    flattenImmediateCallsToLets(ast);
    removeBlocksWithNoDeclarations(ast);
};

const unwrapIFFEs = (ast: t.File) => {
    traverse(ast, {
        CallExpression(path) {
            if (
                path.node.arguments.length === 0 &&
                path.node.callee.type === 'ArrowFunctionExpression'
            ) {
                // if we're in a return statement, we can just back up
                // although need to ensure that CPS doesn't break
                if (
                    path.parent.type === 'ReturnStatement' ||
                    (path.parent.type === 'ExpressionStatement' &&
                        path.parentPath.parent.type === 'BlockStatement' &&
                        path.parentPath.parent.body.length === 1)
                ) {
                    if (path.node.callee.body.type === 'BlockStatement') {
                        path.parentPath.replaceWithMultiple(
                            path.node.callee.body.body,
                        );
                    } else {
                        path.parentPath.replaceWith(
                            t.returnStatement(path.node.callee.body),
                        );
                    }
                } else if (path.parent.type === 'ArrowFunctionExpression') {
                    path.replaceWith(path.node.callee.body);
                } else if (
                    path.node.callee.body.type === 'BlockStatement' &&
                    path.node.callee.body.body.length === 1 &&
                    path.node.callee.body.body[0].type === 'ReturnStatement'
                ) {
                    path.replaceWith(
                        path.node.callee.body.body[0].argument ||
                            t.nullLiteral(),
                    );
                }
                // if we're the body if a lambda, we can just replace with self
            }
        },
    });
};

const equalIdentifiers = (a: any, b: any) =>
    a &&
    b &&
    a.type === 'Identifier' &&
    b.type === 'Identifier' &&
    a.name === b.name;

// TODO this isn't really working yet
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
                callee.type !== 'ArrowFunctionExpression' // &&
                // callee.type !== 'FunctionExpression'
            ) {
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
        // FunctionExpression(path) {
        //     const body = path.node.body.body;
        //     if (body.type !== 'CallExpression') {
        //         return;
        //     }
        //     // (a, b) => ((m, _ignored) => abc)(m)
        //     if (
        //         // body.callee.type === 'ArrowFunctionExpression' &&
        //         body.arguments.length >= path.node.params.length &&
        //         path.node.params.every((arg, i) =>
        //             equalIdentifiers(arg, body.arguments[i]),
        //         )
        //     ) {
        //         path.replaceWith(body.callee);
        //     }
        // },
        ArrowFunctionExpression(path) {
            const body = path.node.body;
            if (body.type !== 'CallExpression') {
                return;
            }
            // (a, b) => ((m, _ignored) => abc)(m)
            if (
                // body.callee.type === 'ArrowFunctionExpression' &&
                body.arguments.length >= path.node.params.length &&
                path.node.params.every((arg, i) =>
                    equalIdentifiers(arg, body.arguments[i]),
                )
            ) {
                path.replaceWith(body.callee);
            }
        },
        // CallExpression(path) {
        //     if (
        //         path.node.arguments.length === 1 &&
        //         path.node.callee.type === 'ArrowFunctionExpression'
        //     ) {
        //         const name =
        //             path.node.callee.params[0].type === 'Identifier'
        //                 ? path.node.callee.params[0].name
        //                 : 'unknown';
        //         if (
        //             path.node.callee.body.type === 'BlockStatement' &&
        //             path.parent.type === 'ExpressionStatement' &&
        //             t.isExpression(path.node.arguments[0])
        //         ) {
        //             path.parentPath.replaceWithMultiple([
        //                 name === '_ignored'
        //                     ? t.expressionStatement(path.node.arguments[0])
        //                     : t.variableDeclaration('const', [
        //                           t.variableDeclarator(
        //                               t.identifier(name),
        //                               path.node.arguments[0],
        //                           ),
        //                       ]),
        //                 path.node.callee.body,
        //             ]);
        //         }
        //     }
        // },
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
    });
};

const flattenImmediateCallsToLets = (ast: t.File) => {
    traverse(ast, {
        CallExpression(path) {
            // Toplevel iffes definitely shouldn't be messed with.
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
                return;
            }
            // ((a, b) => {})(c, d);
            if (
                path.node.callee.type === 'ArrowFunctionExpression' &&
                path.node.arguments.length === path.node.callee.params.length &&
                path.node.callee.body.type === 'BlockStatement' &&
                path.parent.type === 'ExpressionStatement' &&
                path.node.arguments.every((n) => t.isExpression(n))
                // t.isExpression(path.node.arguments[0])
            ) {
                const args = path.node.arguments;
                // path.parentPath.replaceWithMultiple([
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
                                              t.identifier(name),
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
                    console.log(inner.body.length, i);
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
