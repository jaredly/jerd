// The bulk of stuff happens here

import {
    Env,
    Symbol,
    LambdaType,
    Handle,
    UserReference,
} from '../../typing/types';
import { OutputOptions, Type } from './types';
import { typeFromTermType } from './utils';

import { iffe, asBlock } from './utils';
import { printLambdaBody } from './lambda';
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
                    fakeInit: true,
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
                            argType: typeFromTermType(
                                (term.target.is as LambdaType).res,
                            ),
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
                            args: kase.args.map((arg) => ({
                                ...arg,
                                type: typeFromTermType(arg.type),
                            })),
                            k: {
                                ...kase.k,
                                type: typeFromTermType(kase.k.type),
                            },
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
