import { Env, Type, Pattern } from '../../typing/types';
import { bool, int, pureFunction } from '../../typing/preset';
import { showType } from '../../typing/unify';
import { getEnumReferences } from '../../typing/typeExpr';
import { idName } from '../../typing/env';

import { Expr, Block, Literal, Loc } from './types';

import { blockStatement, ifStatement } from './utils';

// Here's how this looks.
// If you succeed, return the success branch. otherwise, do nothing.
// my post-processing pass with flatten out all useless iffes.
export const printPattern = (
    env: Env,
    value: Expr,
    type: Type,
    pattern: Pattern,
    success: Block,
): Block => {
    // console.log('printPattern', type, pattern);
    if (pattern.type === 'Binding') {
        return blockStatement(
            [
                {
                    type: 'Define',
                    sym: pattern.sym,
                    value,
                    is: type,
                    loc: pattern.location,
                },
                success,
            ],
            pattern.location,
        );
    } else if (pattern.type === 'Enum') {
        const allReferences = getEnumReferences(env, pattern.ref);
        // let typ = t.memberExpression(value, t.identifier('type'));
        let tests: Array<Expr> = allReferences.map(
            (ref) => ({
                type: 'IsRecord',
                value,
                ref: ref.ref,
                loc: pattern.location,
            }),

            // t.binaryExpression(
            //     '===',
            //     typ,
            //     t.stringLiteral(recordIdName(env, ref.ref)),
            // ),
        );
        return blockStatement(
            [
                ifStatement(
                    tests.reduce((one: Expr, two: Expr) => ({
                        type: 'or',
                        left: one,
                        right: two,
                        loc: pattern.location,
                    })),
                    success,
                    null,
                    pattern.location,
                ),
            ],
            pattern.location,
        );
    } else if (pattern.type === 'Alias') {
        return printPattern(
            env,
            value,
            type,
            pattern.inner,
            blockStatement(
                [
                    {
                        type: 'Define',
                        sym: pattern.name,
                        value,
                        is: type,
                        loc: pattern.location,
                    },
                    success,
                ],
                pattern.location,
            ),
        );
    } else if (pattern.type === 'Record') {
        // tbh this should probably be processed in reverse?
        // although it probably doesn't matter, because
        // these can't be effectful
        pattern.items.forEach((item) => {
            const decl = env.global.types[idName(item.ref.id)];
            success = printPattern(
                env,
                {
                    type: 'attribute',
                    target: value,
                    ref: item.ref,
                    idx: item.idx,
                    loc: item.location,
                },
                // t.memberExpression(
                //     value,
                //     t.identifier(recordAttributeName(env, item.ref, item.idx)),
                // ),
                decl.items[item.idx],
                item.pattern,
                success,
            );
        });
        return blockStatement(
            [
                ifStatement(
                    {
                        type: 'IsRecord',
                        value,
                        ref: pattern.ref.ref,
                        loc: pattern.location,
                    },
                    // t.binaryExpression(
                    //     '===',
                    //     t.memberExpression(value, t.identifier('type')),
                    //     t.stringLiteral(recordIdName(env, pattern.ref.ref)),
                    // ),
                    success,
                    null,
                    pattern.location,
                ),
            ],
            pattern.location,
        );
    } else if (
        pattern.type === 'int' ||
        pattern.type === 'float' ||
        pattern.type === 'string' ||
        pattern.type === 'boolean'
    ) {
        return blockStatement(
            [
                ifStatement(
                    {
                        type: 'eqLiteral',
                        value,
                        literal: {
                            type: pattern.type,
                            value:
                                pattern.type === 'string'
                                    ? pattern.text
                                    : pattern.value,
                            loc: pattern.location,
                        } as Literal,
                        loc: pattern.location,
                    },
                    success,
                    null,
                    pattern.location,
                ),
            ],
            pattern.location,
        );
        // } else if (pattern.type === 'boolean') {
        //     return t.blockStatement([
        //         t.ifStatement(
        //             t.binaryExpression(
        //                 '===',
        //                 value,
        //                 t.booleanLiteral(pattern.value),
        //             ),
        //             success,
        //         ),
        //     ]);
    } else if (pattern.type === 'Array') {
        if (
            type.type !== 'ref' ||
            type.ref.type !== 'builtin' ||
            type.ref.name !== 'Array' ||
            type.typeVbls.length !== 1
        ) {
            throw new Error(
                `Array pattern, but not array type ${showType(env, type)}`,
            );
        }

        // Then postitems, because it requires calculating length a bunch
        const ln: Expr = { type: 'arrayLen', value, loc: value.loc };

        const indexFromEnd = (i: number, loc: Loc): Expr => ({
            type: 'apply',
            targetType: pureFunction([int, int], int),
            res: int,
            target: {
                type: 'builtin',
                loc,
                name: '-',
            },
            args: [
                ln,
                {
                    type: 'int',
                    value: i,
                    loc,
                },
            ],
            loc,
        });

        const elType = type.typeVbls[0];
        // ok so I don't need to check that it's an array.
        // that's given by the type system.
        // So, processing in reverse order...
        // Spread last because it's expensive potentially
        if (pattern.spread) {
            success = printPattern(
                env,
                {
                    type: 'slice',
                    value,
                    start: {
                        type: 'int',
                        value: pattern.preItems.length,
                        loc: null,
                    },
                    end: pattern.postItems.length
                        ? indexFromEnd(
                              pattern.postItems.length,
                              pattern.location,
                          )
                        : null,
                    loc: pattern.location,
                },
                // t.callExpression(
                //     t.memberExpression(value, t.identifier('slice')),
                //     [t.numericLiteral(pattern.preItems.length)].concat(
                //         pattern.postItems.length
                //             ? [t.numericLiteral(-pattern.postItems.length)]
                //             : [],
                //     ),
                // ),
                type,
                pattern.spread,
                success,
            );
        }

        // const ln = t.memberExpression(value, t.identifier('length'));
        pattern.postItems.forEach((item, i) => {
            success = printPattern(
                env,
                {
                    type: 'arrayIndex',
                    value,
                    idx: indexFromEnd(
                        pattern.postItems.length - i,
                        item.location,
                    ),
                    loc: item.location,
                },
                // t.memberExpression(
                //     value,
                //     t.binaryExpression(
                //         '-',
                //         ln,
                //         t.numericLiteral(pattern.postItems.length - i),
                //     ),
                //     true,
                // ),
                elType,
                item,
                success,
            );
        });

        // hrmmmmmm
        pattern.preItems.forEach((item, i) => {
            success = printPattern(
                env,
                {
                    type: 'arrayIndex',
                    value,
                    idx: { type: 'int', value: i, loc: item.location },
                    loc: item.location,
                },
                // t.memberExpression(value, t.numericLiteral(i), true),
                elType,
                item,
                success,
            );
        });

        // need to limit array length
        if (
            pattern.preItems.length ||
            pattern.postItems.length ||
            !pattern.spread
        ) {
            success = blockStatement(
                [
                    ifStatement(
                        {
                            type: 'apply',
                            targetType: pureFunction([int, int], bool),
                            res: bool,
                            target: {
                                type: 'builtin',
                                loc: pattern.location,
                                name: pattern.spread ? '>=' : '==',
                            },
                            args: [
                                ln,
                                {
                                    type: 'int',
                                    value:
                                        pattern.preItems.length +
                                        pattern.postItems.length,
                                    loc: pattern.location,
                                },
                            ],
                            loc: pattern.location,
                        },
                        success,
                        null,
                        pattern.location,
                    ),
                ],
                pattern.location,
            );
        }

        return success;
    }
    const _v: never = pattern;
    throw new Error(`Pattern not yet supported ${(pattern as any).type}`);
};
