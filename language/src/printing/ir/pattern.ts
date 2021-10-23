import {
    Env,
    Type,
    Pattern,
    UserTypeReference,
    UserReference,
} from '../../typing/types';
import { showType } from '../../typing/unify';
import { getEnumReferences } from '../../typing/typeExpr';
import { idName } from '../../typing/env';

import { Expr, Block, Literal, Loc, OutputOptions } from './types';

import {
    blockStatement,
    bool,
    callExpression,
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
    opts: OutputOptions,
    value: Expr,
    type: Type,
    pattern: Pattern,
    success: Block,
): Block => {
    const mapType = (t: Type) => typeFromTermType(env, opts, t);
    // console.log('printPattern', type, pattern);
    if (pattern.type === 'Binding') {
        return blockStatement(
            [
                {
                    type: 'Define',
                    sym: pattern.sym,
                    value,
                    is: mapType(type),
                    loc: pattern.location,
                },
                success,
            ],
            pattern.location,
        );
    } else if (pattern.type === 'Ignore') {
        return success;
    } else if (pattern.type === 'Enum') {
        const allReferences = getEnumReferences(
            env,
            pattern.ref,
            pattern.location,
        );
        let tests: Array<Expr> = allReferences.map((ref) => ({
            type: 'IsRecord',
            value,
            ref: ref.ref,
            loc: pattern.location,
            is: bool,
        }));
        return blockStatement(
            [
                ifStatement(
                    tests.reduce((one: Expr, two: Expr) =>
                        or(env, one, two, pattern.location),
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
            opts,
            value,
            type,
            pattern.inner,
            blockStatement(
                [
                    {
                        type: 'Define',
                        sym: pattern.name,
                        // then it's smallify this enum
                        value:
                            pattern.inner.type === 'Enum' ||
                            // STOPSHIP smallify the enum
                            //
                            pattern.inner.type === 'Record'
                                ? {
                                      type: 'SpecializeEnum',
                                      // STOPSHP: carry over the proper type variables
                                      is: {
                                          type: 'ref',
                                          ref: pattern.inner.ref.ref,
                                          typeVbls: [],
                                          loc: pattern.inner.location,
                                      },
                                      inner: value,
                                      loc: pattern.inner.location,
                                  }
                                : value,
                        is: mapType(type),
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
                opts,
                {
                    type: 'tupleAccess',
                    target: value,
                    idx: i,
                    loc: item.location,
                    is: mapType(vbls[i]),
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
                opts,
                {
                    type: 'attribute',
                    target: value,
                    ref: item.ref,
                    // TODO: hmmmmm
                    refTypeVbls: [],
                    idx: item.idx,
                    loc: item.location,
                    is: mapType(item.is),
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
                        // TODO this is a bug maybe?
                        ref: pattern.ref.ref as UserReference,
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
                            is: mapType(type),
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

        const indexFromEnd = (i: number, loc: Loc): Expr =>
            callExpression(
                env,
                {
                    type: 'builtin',
                    loc,
                    name: '-',
                    is: pureFunction([int, int], int),
                },
                [
                    ln,
                    {
                        type: 'int',
                        value: i,
                        loc,
                        is: int,
                    },
                ],
                loc,
            );

        const elType = type.typeVbls[0];
        // ok so I don't need to check that it's an array.
        // that's given by the type system.
        // So, processing in reverse order...
        // Spread last because it's expensive potentially
        if (pattern.spread) {
            success = printPattern(
                env,
                opts,
                {
                    type: 'slice',
                    value,
                    start: {
                        type: 'int',
                        value: pattern.preItems.length,
                        loc: pattern.location,
                        is: int,
                    },
                    end: pattern.postItems.length
                        ? indexFromEnd(
                              pattern.postItems.length,
                              pattern.location,
                          )
                        : null,
                    loc: pattern.location,
                    is: mapType(type),
                },
                type,
                pattern.spread,
                success,
            );
        }

        pattern.postItems.forEach((item, i) => {
            success = printPattern(
                env,
                opts,
                {
                    type: 'arrayIndex',
                    value,
                    idx: indexFromEnd(
                        pattern.postItems.length - i,
                        item.location,
                    ),
                    loc: item.location,
                    is: mapType(elType),
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
                opts,
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
                    is: mapType(elType),
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
                        callExpression(
                            env,
                            {
                                type: 'builtin',
                                loc: pattern.location,
                                name: pattern.spread ? '>=' : '==',
                                is: pureFunction([int, int], bool),
                            },
                            [
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
                            pattern.location,
                        ),
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
    switch (pattern.type) {
        case 'PTypeError':
        case 'PHole':
            throw new Error(`Error Patter, cannot print.`);
        default:
            const _v: never = pattern;
            throw new Error(
                `Pattern not yet supported ${(pattern as any).type}`,
            );
    }
};
