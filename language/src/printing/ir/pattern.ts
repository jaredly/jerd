import { Env, Type, Pattern } from '../../typing/types';
import { showType } from '../../typing/unify';
import { getEnumReferences } from '../../typing/typeExpr';
import { idName } from '../../typing/env';

import { Expr, Block, Literal, Loc } from './types';

import {
    blockStatement,
    bool,
    ifStatement,
    int,
    or,
    pureFunction,
    typeFromTermType,
} from './utils';

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
                    is: typeFromTermType(type),
                    loc: pattern.location,
                },
                success,
            ],
            pattern.location,
        );
    } else if (pattern.type === 'Enum') {
        const allReferences = getEnumReferences(env, pattern.ref);
        let tests: Array<Expr> = allReferences.map((ref) => ({
            type: 'IsRecord',
            value,
            ref: ref.ref,
            loc: pattern.location,
        }));
        return blockStatement(
            [
                ifStatement(
                    tests.reduce((one: Expr, two: Expr) =>
                        or(one, two, pattern.location),
                    ),
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
                        is: typeFromTermType(type),
                        loc: pattern.location,
                    },
                    success,
                ],
                pattern.location,
            ),
        );
    } else if (pattern.type === 'Tuple') {
        // tbh this should probably be processed in reverse?
        // although it probably doesn't matter, because
        // these can't be effectful
        const vbls = type.type === 'ref' ? type.typeVbls : [];
        pattern.items.forEach((item, i) => {
            success = printPattern(
                env,
                {
                    type: 'tupleAccess',
                    target: value,
                    idx: i,
                    loc: item.location,
                },
                vbls[i],
                item,
                success,
            );
        });
        // Do I need an IF here? I don't think so,
        // because I ensure that the type is tuple and
        // it's incompatible with normal record types
        return success;
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
                        is: bool,
                    },
                    success,
                    null,
                    pattern.location,
                ),
            ],
            pattern.location,
        );
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
        const ln: Expr = { type: 'arrayLen', value, loc: value.loc, is: int };

        const indexFromEnd = (i: number, loc: Loc): Expr => ({
            type: 'apply',
            targetType: pureFunction([int, int], int),
            concreteType: pureFunction([int, int], int),
            res: int,
            target: {
                type: 'builtin',
                loc,
                name: '-',
                is: pureFunction([int, int], int),
            },
            args: [
                ln,
                {
                    type: 'int',
                    value: i,
                    loc,
                    is: int,
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
                        is: int,
                    },
                    end: pattern.postItems.length
                        ? indexFromEnd(
                              pattern.postItems.length,
                              pattern.location,
                          )
                        : null,
                    loc: pattern.location,
                    is: typeFromTermType(type),
                },
                type,
                pattern.spread,
                success,
            );
        }

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
                    is: typeFromTermType(elType),
                },
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
                    idx: {
                        type: 'int',
                        value: i,
                        loc: item.location,
                        is: int,
                    },
                    loc: item.location,
                    is: typeFromTermType(elType),
                },
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
                            concreteType: pureFunction([int, int], bool),
                            res: bool,
                            target: {
                                type: 'builtin',
                                loc: pattern.location,
                                name: pattern.spread ? '>=' : '==',
                                is: pureFunction([int, int], bool),
                            },
                            args: [
                                ln,
                                {
                                    type: 'int',
                                    value:
                                        pattern.preItems.length +
                                        pattern.postItems.length,
                                    loc: pattern.location,
                                    is: int,
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
