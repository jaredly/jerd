import fs from 'fs';
import * as peggy from 'peggy';
import * as t from '@babel/types';
import generate from '@babel/generator';
// @ts-ignore
import plugin from 'ts-pegjs';

/*

What do I want?
- automatically generate typescript types from the grammar. Rules are /either/ a strict '/' of other rules, /or/ a rule the will be turned into a `{type: "X"}`, with attributes for all the named children.


How do I think recovery should work?
I'll need a catch-all "partial" type, which could occur just about anywhere.
buuut do I really want that?

Like, have "this is an invalid partial node" just about anywhere in the typed tree?
I guess it could be mostly fine.

Here's what we'd do:
- the last item of "expression" can be a catch-all "I don't know what to do here".
- basically, anywhere that we want "one or more of these things", we specify a delimiter

Yeah so I run into the competing goals, of "make this maximally recoverable" and "make it make sense".



annnyyyywayyyyy actually my basic want is: "make this grammar generate typescript types"
and then at some point it will be "connect comments to stuff". But for now, I'll bail on "recovery".

Ok, but so what if first I try to just parse the current grammar, and ignore the stuff inside of `{}`?
shouldn't be too bad.

I mean, I think peg exposes it already somehow

*/

// 'type: action'

/*
Ok, what is my plan here...
I will: produce code ... and types.
so,
for a choice: the type is 

*/

const orNull = (type: t.TSType) => t.tsUnionType([type, t.tsNullKeyword()]);

const typesEqual = (one: t.TSType, two: t.TSType) =>
    t.isNodesEquivalent(one, two);

const processExpression = (
    expr: peggy.ast.Expression | peggy.ast.Named,
    ctx:
        | { type: 'top'; ruleName: string }
        | { type: 'inner'; vbl: t.Expression },
    first = false,
): [t.TSType, null | t.Expression] => {
    if (ctx.type === 'top' && ctx.ruleName.match(/^_/)) {
        return [t.tsTypeReference(t.identifier('string')), null];
    }
    switch (expr.type) {
        case 'literal': {
            return [t.tsTypeReference(t.identifier('string')), null];
        }
        case 'named': {
            return processExpression(expr.expression, ctx, first);
        }
        case 'text':
            return [t.tsTypeReference(t.identifier('string')), null];
        case 'action': {
            if (ctx.type === 'inner') {
                throw new Error(`inner action`);
            }
            return processExpression(expr.expression, ctx, first);
        }
        case 'rule_ref': {
            return [t.tsTypeReference(t.identifier(expr.name)), null];
        }
        case 'choice': {
            const names = expr.alternatives.map((alt) => {
                if (alt.type === 'literal') {
                    return t.tsLiteralType(t.stringLiteral(alt.value));
                }
                if (alt.type === 'text') {
                    return t.tsTypeReference(t.identifier('string'));
                }
                if (alt.type !== 'rule_ref') {
                    throw new Error(`Choice with ${alt.type}`);
                }
                return t.tsTypeReference(t.identifier(alt.name));
            });
            return [t.tsUnionType(names), null];
        }
        case 'optional': {
            const [type, inner] = processExpression(expr.expression, ctx);
            return [
                orNull(type),
                inner == null || ctx.type === 'top'
                    ? inner
                    : t.conditionalExpression(ctx.vbl, inner, ctx.vbl),
            ];
        }
        case 'zero_or_more':
        case 'one_or_more': {
            const [type, inner] = processExpression(expr.expression, {
                type: 'inner',
                vbl: t.identifier('element'),
            });
            if (inner === null) {
                return [t.tsArrayType(type), null];
            }
            if (ctx.type === 'top') {
                throw new Error(`cant do this at tope`);
            }
            return [
                t.tsArrayType(type),
                t.callExpression(
                    t.memberExpression(ctx.vbl, t.identifier('map')),
                    [
                        t.arrowFunctionExpression(
                            [
                                {
                                    ...t.identifier('element'),
                                    typeAnnotation: t.tsTypeAnnotation(
                                        t.tsAnyKeyword(),
                                    ),
                                },
                            ],
                            inner,
                        ),
                    ],
                ),
            ];
        }
        case 'group':
            if (ctx.type === 'inner' && expr.expression.type === 'sequence') {
                let found = null as null | [t.TSType, t.Expression];
                expr.expression.elements.forEach((el, i) => {
                    // skip it
                    if (el.type === 'rule_ref' && el.name.match(/^[^A-Z]/)) {
                        return;
                    }
                    const vbl = t.memberExpression(
                        ctx.vbl,
                        t.numericLiteral(i),
                        true,
                    );
                    const [type, inner] = processExpression(el, {
                        type: 'inner',
                        vbl,
                    });
                    found = [type, inner ? inner : vbl];
                });
                if (found == null) {
                    console.log(expr.expression.elements.map((m) => m.type));
                    throw new Error(
                        `nested group, should have one capitalized ref`,
                    );
                }
                return found;
            }
            throw new Error(`toplevel group or something`);
        case 'labeled':
        case 'sequence': {
            const elements = expr.type === 'labeled' ? [expr] : expr.elements;
            if (ctx.type === 'inner') {
                throw new Error(`sequence is only toplevel`);
            }
            const attributes: Array<[string, t.TSType, t.Expression]> = [];
            elements.forEach((element) => {
                if (element.type === 'labeled' && element.label != null) {
                    const [type, expr] = processExpression(element.expression, {
                        type: 'inner',
                        vbl: t.identifier(element.label),
                    });
                    attributes.push([
                        element.label,
                        type,
                        expr ? expr : t.identifier(element.label),
                    ]);
                }
            });
            if (
                attributes.length === 2 &&
                attributes[0][0] === 'first' &&
                attributes[1][0] === 'rest' &&
                attributes[1][1].type === 'TSArrayType' &&
                typesEqual(attributes[0][1], attributes[1][1].elementType)
            ) {
                return [
                    attributes[1][1],
                    t.arrayExpression([
                        attributes[0][2],
                        t.spreadElement(attributes[1][2]),
                    ]),
                ];
            }
            const typeName = attributes.some((s) => s[0] === 'type')
                ? '$type'
                : 'type';
            return [
                t.tsTypeLiteral(
                    [
                        t.tsPropertySignature(
                            t.identifier(typeName),
                            t.tsTypeAnnotation(
                                t.tsLiteralType(t.stringLiteral(ctx.ruleName)),
                            ),
                        ),
                        t.tsPropertySignature(
                            t.identifier('location'),
                            t.tsTypeAnnotation(
                                t.tsTypeReference(t.identifier('IFileRange')),
                            ),
                        ),
                        ...(first
                            ? [
                                  t.tsPropertySignature(
                                      t.identifier('comments'),
                                      t.tsTypeAnnotation(
                                          t.tsTypeReference(
                                              t.identifier('Array'),
                                              t.tsTypeParameterInstantiation([
                                                  t.tsTupleType([
                                                      t.tsTypeReference(
                                                          t.identifier(
                                                              'Location',
                                                          ),
                                                      ),
                                                      t.tsTypeReference(
                                                          t.identifier(
                                                              'string',
                                                          ),
                                                      ),
                                                  ]),
                                              ]),
                                          ),
                                      ),
                                  ),
                              ]
                            : []),
                    ].concat(
                        attributes.map(([name, type, _]) => {
                            return t.tsPropertySignature(
                                t.identifier(name),
                                t.tsTypeAnnotation(type),
                            );
                        }),
                    ),
                ),
                t.objectExpression(
                    [
                        t.objectProperty(
                            t.identifier(typeName),
                            t.stringLiteral(ctx.ruleName),
                        ),
                        t.objectProperty(
                            t.identifier('location'),
                            t.callExpression(t.identifier('myLocation'), []),
                        ),
                        ...(first
                            ? [
                                  t.objectProperty(
                                      t.identifier('comments'),
                                      t.identifier('allComments'),
                                  ),
                              ]
                            : []),
                    ].concat(
                        attributes.map(([name, _, expr]) => {
                            return t.objectProperty(
                                t.identifier(name),
                                expr,
                                false,
                                expr.type === 'Identifier' &&
                                    expr.name === name,
                            );
                        }),
                    ),
                ),
            ];
        }
    }
    return [t.tsAnyKeyword(), t.stringLiteral(`NOT_IMPL_${expr.type}`)];
};

// sequence, action, choice, literal

const raw = fs.readFileSync('./src/parsing/grammar.pegjs', 'utf8');
const ast = peggy.parser.parse(raw);

const alls: Array<[peggy.ast.Rule, t.TSType, t.Expression | null]> = [];
ast.rules.forEach((rule, i) => {
    try {
        const [type, expr] = processExpression(
            rule.expression,
            {
                type: 'top',
                ruleName: rule.name,
            },
            i === 0,
        );
        // console.log(`- - - ${rule.name}`);
        // console.log(
        //     raw.slice(
        //         rule.expression.location.start.offset,
        //         rule.expression.location.end.offset,
        //     ),
        // );
        // if (expr) {
        //     console.log(
        //         generate(t.blockStatement([t.returnStatement(expr)])).code,
        //     );
        // }
        alls.push([rule, type, expr]);
    } catch (err) {
        console.log(`### ${rule.name} ###`);
        console.log(
            raw.slice(
                rule.expression.location.start.offset,
                rule.expression.location.end.offset,
            ),
        );
        console.error(`Failed to process ${rule.name}`);
        console.error(err instanceof Error ? err.message : err);
        console.log();
    }
});

const getBasic = (
    rule: peggy.ast.Expression | peggy.ast.Named,
): peggy.ast.Expression => {
    if (rule.type === 'action' || rule.type === 'named') {
        return getBasic(rule.expression);
    }
    return rule;
};

const typesFile: Array<string> = [];
const grammarFile: Array<string> = [];

if (ast.initializer) {
    grammarFile.push('{\n' + ast.initializer.code + '\n}');
}
alls.map(([rule, type, expr]) => {
    typesFile.push(
        generate(
            t.exportNamedDeclaration(
                t.tsTypeAliasDeclaration(t.identifier(rule.name), null, type),
            ),
        ).code,
    );

    const ruleSource = getBasic(rule.expression);
    grammarFile.push(
        `${rule.name} = ${raw.slice(
            ruleSource.location.start.offset,
            ruleSource.location.end.offset,
        )}` +
            (expr
                ? generate(t.blockStatement([t.returnStatement(expr)])).code
                : rule.name === 'comment'
                ? '{ allComments.push([location(), text()]); }'
                : ''),
    );
});

// fs.writeFileSync('./src/parsing/grammar-new.pegjs', grammarFile.join('\n\n'));
const jsOut = peggy.generate(grammarFile.join('\n\n'), {
    output: 'source',
    plugins: [plugin],
});
fs.writeFileSync(
    './src/parsing/parser-new.ts',
    jsOut +
        '\n\n// TYPES\n\n' +
        typesFile.join('\n\n') +
        `\n\nexport const parseTyped = (input: string): File => parse(input)\n`,
);
