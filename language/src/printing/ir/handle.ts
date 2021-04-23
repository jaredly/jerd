// The bulk of stuff happens here

import {
    Term,
    Env,
    Type as TermType,
    getEffects,
    Symbol,
    Reference,
    Let,
    Var,
    EffectRef,
    Lambda,
    LambdaType,
    walkTerm,
    Pattern,
    Handle,
    UserReference,
} from '../../typing/types';
import {
    binOps,
    bool,
    builtinType,
    float,
    int,
    // pureFunction,
    string,
    void_,
} from '../../typing/preset';
import { showType } from '../../typing/unify';
import {
    applyEffectVariables,
    getEnumReferences,
    showLocation,
} from '../../typing/typeExpr';
import { idFromName, idName } from '../../typing/env';
import { LambdaType as ILambdaType } from './types';

import { Loc, Expr, Stmt, OutputOptions, Type } from './types';
import { callExpression, pureFunction, typeFromTermType } from './utils';

import { maybeWrapPureFunction } from '../../typing/transform';
import {
    iffe,
    arrowFunctionExpression,
    blockStatement,
    ifStatement,
    returnStatement,
    isConstant,
    builtin,
    asBlock,
} from './utils';
import { printPattern } from './pattern';
import { printLambda, printLambdaBody } from './lambda';
import { printTerm } from './term';

export const printHandle = (env: Env, opts: OutputOptions, term: Handle) => {
    const sym: Symbol = { name: 'result', unique: env.local.unique++ };
    return iffe(
        {
            type: 'Block',
            items: [
                {
                    type: 'Define',
                    sym,
                    loc: term.location,
                    value: null,
                    is: typeFromTermType(term.is),
                },
                {
                    type: 'Expression',
                    expr: {
                        type: 'handle',
                        is: typeFromTermType(term.is),
                        target: printTerm(env, opts, term.target),
                        loc: term.location,
                        effect: (term.effect as UserReference).id,
                        pure: {
                            arg: term.pure.arg,
                            // body: printLambdaBody(
                            //     env,
                            //     opts,
                            //     term.pure.body,
                            //     null,
                            // ),
                            body: {
                                type: 'Block',
                                loc: term.pure.body.location,
                                items: [
                                    {
                                        type: 'Assign',
                                        sym,
                                        is: typeFromTermType(term.pure.body.is),
                                        loc: term.pure.body.location,
                                        value: iffe(
                                            asBlock(
                                                printLambdaBody(
                                                    env,
                                                    opts,
                                                    term.pure.body,
                                                    null,
                                                ),
                                            ),
                                            typeFromTermType(term.pure.body.is),
                                        ),
                                    },
                                ],
                            },
                        },
                        cases: term.cases.map((kase) => ({
                            ...kase,
                            body: {
                                type: 'Block',
                                loc: kase.body.location,
                                items: [
                                    {
                                        type: 'Assign',
                                        sym,
                                        is: typeFromTermType(kase.body.is),
                                        loc: kase.body.location,
                                        value: iffe(
                                            asBlock(
                                                printLambdaBody(
                                                    env,
                                                    opts,
                                                    kase.body,
                                                    null,
                                                ),
                                            ),
                                            typeFromTermType(kase.body.is),
                                        ),
                                    },
                                ],
                            },
                        })),
                        done: null,
                    },
                    loc: term.location,
                },
                {
                    type: 'Return',
                    value: {
                        type: 'var',
                        sym,
                        loc: term.location,
                        is: typeFromTermType(term.is),
                    },
                    loc: term.location,
                },
            ],
            loc: term.location,
        },
        typeFromTermType(term.is),
    );
};
