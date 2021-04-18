// The bulk of stuff happens here

import {
    Term,
    Env,
    Type,
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
    UserReference,
    EffectReference,
    typesEqual,
} from '../../typing/types';
import {
    binOps,
    bool,
    builtinType,
    float,
    int,
    pureFunction,
    string,
    void_,
} from '../../typing/preset';
import { showType } from '../../typing/unify';
import {
    applyEffectVariables,
    getEnumReferences,
    showLocation,
    tupleType,
} from '../../typing/typeExpr';
import { idFromName, idName, refName } from '../../typing/env';

import { Loc, Expr, Stmt, callExpression, OutputOptions, Arg } from './types';

import {
    effectConstructorType,
    effectHandlerType,
    maybeWrapPureFunction,
    termToAstCPS,
} from './cps';
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

export const printTerm = (env: Env, opts: OutputOptions, term: Term): Expr => {
    return _printTerm(env, opts, term);
};

const printTermRef = (
    opts: OutputOptions,
    ref: Reference,
    loc: Loc,
    is: Type,
): Expr => {
    return ref.type === 'builtin'
        ? { type: 'builtin', name: ref.name, loc, is }
        : { type: 'term', id: ref.id, loc, is };
};

const _printTerm = (env: Env, opts: OutputOptions, term: Term): Expr => {
    switch (term.type) {
        // these will never need effects, immediate is fine
        case 'self':
            if (!env.local.self) {
                throw new Error(`Self referenced without self set on env`);
            }
            return printTermRef(
                opts,
                {
                    type: 'user',
                    // hmmmmmmmmm should IR retain the explicit `self`?
                    // TODO think about this more
                    id: idFromName(env.local.self.name),
                },
                term.location,
                term.is,
            );
        // return t.identifier(`hash_${env.local.self.name}`);
        case 'boolean':
            return {
                type: 'boolean',
                value: term.value,
                loc: term.location,
                is: bool,
            };
        case 'int':
            return {
                type: 'int',
                value: term.value,
                loc: term.location,
                is: int,
            };
        case 'string':
            return {
                type: 'string',
                value: term.text,
                loc: term.location,
                is: string,
            };
        case 'float':
            return {
                type: 'float',
                value: term.value,
                loc: term.location,
                is: float,
            };
        case 'ref': {
            // Hmm do I want to include type annotation here? I guess I did at one point
            return printTermRef(opts, term.ref, term.location, term.is);
        }
        case 'if': {
            return iffe(
                blockStatement(
                    [
                        ifStatement(
                            printTerm(env, opts, term.cond),
                            printTerm(env, opts, term.yes),
                            term.no ? printTerm(env, opts, term.no) : null,
                            term.location,
                        ),
                    ],
                    term.location,
                ),
                term.is,
            );
        }
        // a lambda, I guess also doesn't need cps, but internally it does.
        case 'lambda':
            return printLambda(env, opts, term);
        case 'var':
            return {
                type: 'var',
                sym: term.sym,
                loc: term.location,
                is: term.is,
            };
        case 'apply': {
            // TODO we should hang onto the arg names of the function we
            // are calling so we can use them when assigning to values.
            // oh ok so we need to do somethign else if any of the arguments
            // need CPS.

            // ughhhhhhhh I think my denormalization is biting me here.
            if (getEffects(term).length > 0) {
                console.error(
                    new Error(
                        `This apply has effects, but isn't in a CPS context. Effects: ${getEffects(
                            term,
                        )
                            .map(showEffectRef)
                            .join(', ')} : Target: ${showType(
                            env,
                            term.target.is,
                        )}`,
                    ),
                );
            }

            let target = printTerm(env, opts, term.target);

            if (term.hadAllVariableEffects) {
                target = {
                    type: 'effectfulOrDirect',
                    target,
                    effectful: false,
                    loc: target.loc,
                    is: void_, // STOPSHIP: fix this I think
                };
            }

            const argTypes =
                term.target.is.type === 'lambda' ? term.target.is.args : [];
            if (argTypes.length !== term.args.length) {
                throw new Error(
                    `Need to resolve target type: ${showType(
                        env,
                        term.target.is,
                    )} - ${showType(env, term.is)}`,
                );
            }
            const args = term.args.map((arg, i) => {
                return maybeWrapPureFunction(env, arg, argTypes[i]);
            });

            return callExpression(
                target,
                term.originalTargetType,
                // term.
                term.is,
                args.map((arg, i) => printTerm(env, opts, arg)),
                term.location,
                term.target.is as LambdaType,
            );
        }

        case 'raise':
            throw new Error(
                "Cannot print a 'raise' outside of CPS. Effect tracking must have messed up.",
            );

        case 'handle': {
            /*
            handle! fn {
                Write.write((v) => k) => xyz,
                pure(x) => z,
            }

            becomes


            let fnReturnPointer = {pure as a function that just takes a value}
            fn([
                (value: string, done: (handler: handle123123) => void) => {
                    const k = (handler, returnToHandler) => {
                        fnReturnPointer = returnToHandler
                        done(handler)
                    }
                    // k is now set.
                }
            ], (_handlerIThink, returnValue) => fnReturnPointer(returnValue))

            // ok worth a shot

            */
            const sym: Symbol = { name: 'result', unique: env.local.unique++ };
            const doneS: Symbol = { name: 'done', unique: env.local.unique++ };
            const doneVar: Expr = {
                type: 'var',
                sym: doneS,
                loc: null,
                is: pureFunction([term.is], void_),
            };
            const finalValue: Symbol = {
                name: 'finalValue',
                unique: env.local.unique++,
            };
            const fnReturnPointer: Symbol = {
                name: 'fnReturnPointer',
                unique: env.local.unique++,
            };
            const effRef: EffectReference = { type: 'ref', ref: term.effect };
            const effDev = env.global.effects[refName(term.effect)];
            return iffe(
                {
                    type: 'Block',
                    items: [
                        {
                            type: 'Define',
                            sym,
                            loc: term.location,
                            value: null,
                            is: term.is,
                        },
                        {
                            type: 'Define',
                            sym: doneS,
                            loc: term.location,
                            value: {
                                type: 'lambda',
                                args: [
                                    {
                                        sym: finalValue,
                                        type: term.is,
                                        loc: term.location,
                                    },
                                ],
                                res: void_,
                                loc: term.location,
                                body: {
                                    type: 'Block',
                                    loc: term.location,
                                    items: [
                                        {
                                            type: 'Assign',
                                            sym,
                                            value: {
                                                type: 'var',
                                                sym: finalValue,
                                                loc: term.location,
                                                is: term.is,
                                            },
                                            is: void_,
                                            loc: term.location,
                                        },
                                    ],
                                },
                                is: pureFunction([term.is], void_),
                            },
                            is: term.is,
                        },
                        {
                            type: 'Define',
                            sym: fnReturnPointer,
                            loc: term.location,
                            value: {
                                type: 'lambda',
                                args: [
                                    {
                                        sym: term.pure.arg,
                                        type: (term.target.is as LambdaType)
                                            .res,
                                        loc: term.pure.body.location,
                                    },
                                ],
                                res: void_,
                                loc: term.pure.body.location,
                                is: pureFunction(
                                    [(term.target.is as LambdaType).res],
                                    void_,
                                ),
                                body: printLambdaBody(
                                    env,
                                    opts,
                                    term.pure.body,
                                    // here's where we'd pass them in if they existed.
                                    {},
                                    doneVar,
                                ),
                            },
                            is: term.is,
                        },
                        {
                            type: 'Expression',
                            expr: callExpression(
                                printTerm(env, opts, term.target),
                                term.target.is as LambdaType,
                                void_,
                                [
                                    // Here's where we'd change to have a builtin handlers type probably
                                    {
                                        type: 'tuple',
                                        loc: term.location,
                                        // TODO: Delete this attribute? duplicate. oh maybe not
                                        itemTypes: term.cases.map((_, i) =>
                                            effectConstructorType(
                                                env,
                                                {
                                                    type: 'ref',
                                                    ref: term.effect,
                                                },
                                                effDev[i],
                                            ),
                                        ),
                                        items: term.cases.map((kase, i) => {
                                            return {
                                                type: 'lambda',
                                                args: [
                                                    ...kase.args.map(
                                                        (sym, si) => ({
                                                            sym,
                                                            type:
                                                                effDev[i].args[
                                                                    si
                                                                ],
                                                            loc:
                                                                kase.body
                                                                    .location,
                                                        }),
                                                    ),
                                                    {
                                                        sym: kase.k,
                                                        type: pureFunction(
                                                            [
                                                                effectHandlerType(
                                                                    env,
                                                                    effRef,
                                                                ),
                                                                ...(typesEqual(
                                                                    effDev[i]
                                                                        .ret,
                                                                    void_,
                                                                )
                                                                    ? []
                                                                    : [
                                                                          effDev[
                                                                              i
                                                                          ].ret,
                                                                      ]),
                                                            ],
                                                            void_,
                                                        ),
                                                    },
                                                    // {
                                                    //     sym: term.pure.arg,
                                                    //     type: (term.target
                                                    //         .is as LambdaType)
                                                    //         .res,
                                                    //     loc:
                                                    //         term.pure.body
                                                    //             .location,
                                                    // },
                                                ] as Array<Arg>,
                                                res: void_,
                                                loc: term.pure.body.location,
                                                is: pureFunction(
                                                    [
                                                        (term.target
                                                            .is as LambdaType)
                                                            .res,
                                                    ],
                                                    void_,
                                                ),
                                                // OKKKK so the last thing to do here
                                                // is redefine `k`
                                                // so that it sets the fnReturnPointer
                                                // I think that's it?
                                                body: printLambdaBody(
                                                    env,
                                                    opts,
                                                    kase.body,
                                                    {},
                                                    doneVar,
                                                ),
                                            };
                                        }),
                                        is: tupleType(
                                            term.cases.map((_, i) =>
                                                effectConstructorType(
                                                    env,
                                                    {
                                                        type: 'ref',
                                                        ref: term.effect,
                                                    },
                                                    effDev[i],
                                                ),
                                            ),
                                        ), // lol
                                    },
                                    {
                                        type: 'lambda',
                                        args: [
                                            {
                                                sym: {
                                                    name: '_ignored',
                                                    unique: 0,
                                                },
                                                type: effectHandlerType(env, {
                                                    type: 'ref',
                                                    ref: term.effect,
                                                }),
                                                loc: term.pure.body.location,
                                            },
                                            {
                                                sym: term.pure.arg,
                                                type: (term.target
                                                    .is as LambdaType).res,
                                                loc: term.pure.body.location,
                                            },
                                        ],
                                        res: void_,
                                        loc: term.pure.body.location,
                                        is: pureFunction(
                                            [
                                                effectHandlerType(env, {
                                                    type: 'ref',
                                                    ref: term.effect,
                                                }),
                                                (term.target.is as LambdaType)
                                                    .res,
                                            ],
                                            void_,
                                        ),
                                        body: callExpression(
                                            {
                                                type: 'var',
                                                sym: fnReturnPointer,
                                                loc: term.location,
                                                is: pureFunction(
                                                    [term.is],
                                                    void_,
                                                ),
                                            },
                                            pureFunction([term.is], void_),
                                            void_,
                                            [
                                                {
                                                    type: 'var',
                                                    sym: term.pure.arg,
                                                    is: (term.target
                                                        .is as LambdaType).res,
                                                    loc: term.location,
                                                },
                                            ],
                                            term.location,
                                        ),
                                    },
                                ],
                                term.location,
                            ),
                            /* expr: {
                                type: 'handle',
                                target: printTerm(env, opts, term.target),
                                loc: term.location,
                                effect: (term.effect as UserReference).id,
                                pure: {
                                    arg: term.pure.arg,
                                    body: {
                                        type: 'Block',
                                        loc: term.pure.body.location,
                                        items: [
                                            {
                                                type: 'Assign',
                                                sym,
                                                is: term.pure.body.is,
                                                loc: term.pure.body.location,
                                                value: iffe(
                                                    asBlock(
                                                        printLambdaBody(
                                                            env,
                                                            opts,
                                                            term.pure.body,
                                                            {},
                                                            null,
                                                        ),
                                                    ),
                                                    term.pure.body.is,
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
                                                is: kase.body.is,
                                                loc: kase.body.location,
                                                value: iffe(
                                                    asBlock(
                                                        printLambdaBody(
                                                            env,
                                                            opts,
                                                            kase.body,
                                                            {},
                                                            null,
                                                        ),
                                                    ),
                                                    kase.body.is,
                                                ),
                                            },
                                        ],
                                    },
                                })),
                                done: null,
                                is: term.pure.body.is,
                            },
                            */
                            loc: term.location,
                        },
                        {
                            type: 'Return',
                            value: {
                                type: 'var',
                                sym,
                                loc: term.location,
                                is: term.is,
                            },
                            loc: term.location,
                        },
                    ],
                    loc: term.location,
                },
                term.is,
            );
        }

        case 'sequence': {
            // IIFE
            return callExpression(
                arrowFunctionExpression(
                    [],
                    blockStatement(
                        term.sts.map((s, i) =>
                            s.type === 'Let'
                                ? {
                                      type: 'Define',
                                      sym: s.binding,
                                      value: printTerm(env, opts, s.value),
                                      is: s.is,
                                      loc: s.location,
                                  }
                                : i === term.sts.length - 1
                                ? returnStatement(printTerm(env, opts, s))
                                : {
                                      type: 'Expression',
                                      expr: printTerm(env, opts, s),
                                      loc: s.location,
                                  },
                        ),
                        term.location,
                    ),
                    term.is,
                    term.location,
                ),
                pureFunction([], term.is),
                term.is,
                [],
                term.location,
            );
        }
        case 'Record': {
            // ok whats the story here?
            // options include:
            // ['h@sh', arg1, arg2]
            // {type: 'h@sh', 0: arg1, 1: arg2, 2: arg3}
            // {type: 'h@sh', h@sh_0: arg1, h@sh_1: arg2, h@sh_2: arg3}
            // the last one requires the least record keeping, I think.
            // although serializes more.
            // yeah I think we need the last one.
            return {
                type: 'record',
                base:
                    term.base.type === 'Variable'
                        ? {
                              type: 'Variable',
                              var: term.base.var,
                              spread: printTerm(env, opts, term.base.spread),
                          }
                        : {
                              type: 'Concrete',
                              ref: term.base.ref,
                              rows: term.base.rows.map((r) =>
                                  r ? printTerm(env, opts, r) : null,
                              ),
                              spread: term.base.spread
                                  ? printTerm(env, opts, term.base.spread)
                                  : null,
                          },
                subTypes: Object.keys(term.subTypes).reduce((obj: any, k) => {
                    const subType = term.subTypes[k];
                    obj[k] = {
                        spread: subType.spread
                            ? printTerm(env, opts, subType.spread)
                            : null,
                        rows: subType.rows.map((r) =>
                            r ? printTerm(env, opts, r) : null,
                        ),
                    };
                    return obj;
                }, {}),
                is: term.is,
                loc: term.location,
            };
        }
        case 'Enum':
            return printTerm(env, opts, term.inner);
        case 'TupleAccess': {
            return {
                type: 'tupleAccess',
                target: printTerm(env, opts, term.target),
                idx: term.idx,
                loc: term.location,
                is: term.is,
            };
        }
        case 'Attribute': {
            return {
                type: 'attribute',
                target: printTerm(env, opts, term.target),
                ref: term.ref,
                idx: term.idx,
                loc: term.location,
                is: term.is,
            };
        }
        case 'Tuple': {
            return {
                type: 'tuple',
                items: term.items.map((item) => printTerm(env, opts, item)),
                itemTypes: term.is.typeVbls,
                loc: term.location,
                is: term.is,
            };
        }
        case 'Array': {
            const elType = term.is.typeVbls[0];
            return {
                type: 'array',
                items: term.items.map((item) =>
                    item.type === 'ArraySpread'
                        ? {
                              type: 'Spread',
                              value: printTerm(env, opts, item.value),
                          }
                        : printTerm(env, opts, item),
                ),
                loc: term.location,
                elType,
                is: term.is,
            };
        }
        case 'Switch': {
            // TODO: if the term is "basic", we can just pass it through
            const basic = isConstant(term.term);

            const id = { name: 'discriminant', unique: env.local.unique++ };

            const value: Expr = basic
                ? printTerm(env, opts, term.term)
                : { type: 'var', sym: id, loc: null, is: term.term.is };

            let cases = [];

            term.cases.forEach((kase, i) => {
                cases.push(
                    printPattern(
                        env,
                        value,
                        // kase.body.is,
                        term.term.is,
                        kase.pattern,
                        blockStatement(
                            [returnStatement(printTerm(env, opts, kase.body))],
                            kase.body.location,
                        ),
                    ),
                );
            });

            cases.push(
                blockStatement(
                    [
                        { type: 'MatchFail', loc: term.location },
                        //     t.throwStatement(
                        //         t.newExpression(t.identifier('Error'), [
                        //             t.stringLiteral('Invalid case analysis'),
                        //         ]),
                        //     ),
                    ],
                    term.location,
                ),
            );

            return iffe(
                blockStatement(
                    [
                        basic
                            ? null
                            : {
                                  type: 'Define',
                                  sym: id,
                                  value: printTerm(env, opts, term.term),
                                  loc: term.location,
                              },
                        ...cases,
                    ].filter(Boolean) as Array<Stmt>,
                    term.location,
                ),
                term.is,
            );
        }
        default:
            let _x: never = term;
            throw new Error(`Cannot print ${(term as any).type} to IR`);
    }
};

const showEffectRef = (eff: EffectRef) => {
    if (eff.type === 'var') {
        return printSym(eff.sym);
    }
    return printRef(eff.ref);
};

const printSym = (sym: Symbol) => sym.name + '_' + sym.unique;

const printRef = (ref: Reference) =>
    ref.type === 'builtin' ? ref.name : idName(ref.id);
