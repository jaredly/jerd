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

import {
    Loc,
    Expr,
    Stmt,
    callExpression,
    OutputOptions,
    Arg,
    Block,
} from './types';

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
import { printHandle } from './handle';
import { LocatedError } from '../../typing/errors';

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
                    new LocatedError(
                        term.location,
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
            throw new LocatedError(
                term.location,
                "Cannot print a 'raise' outside of CPS. Effect tracking must have messed up.",
            );

        case 'handle':
            return printHandle(env, opts, term, {}, null);

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
