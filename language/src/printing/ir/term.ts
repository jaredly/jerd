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
    UserReference,
    RecordDef,
    ConcreteBase,
    Id,
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
import { allDefaults, idFromName, idName } from '../../typing/env';
import { ArrayType, LambdaType as ILambdaType, TypeReference } from './types';

import { Loc, Expr, Stmt, OutputOptions, Type } from './types';
import {
    callExpression,
    pureFunction,
    typeFromTermType,
    string as irString,
    stringLiteral,
} from './utils';

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
import { printHandle } from './handle';
import { termToPretty } from '../printTsLike';
import { printToString } from '../printer';
import { LocatedError } from '../../typing/errors';
import { Location } from '../../parsing/parser';
import { asRecord } from '../../typing/terms/as-suffix';

// hrmmmmmmmm should I define new types for the IR?
// urhghhhhghghhggh
// like
// probably?
// I mean
// the IR doesn't have effects
// so yeah?
// like that would be the principled way to do it
// hrgggggghhhhh

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
    const mapType = (t: TermType) => typeFromTermType(env, opts, t);
    switch (term.type) {
        // these will never need effects, immediate is fine
        case 'self':
            if (!env.local.self) {
                throw new Error(`Self referenced without self set on env`);
            }
            const t = mapType(term.is);
            // console.log(
            //     'self here',
            //     showLocation(term.location),
            //     showType(env, term.is),
            //     t.type,
            // );
            // console.log(new Error().stack!.split('\n').slice(3, 11).join('\n'));
            return printTermRef(
                opts,
                {
                    type: 'user',
                    // hmmmmmmmmm should IR retain the explicit `self`?
                    // TODO think about this more
                    id: idFromName(env.local.self.name),
                },
                term.location,
                t,
            );
        // return t.identifier(`hash_${env.local.self.name}`);
        case 'boolean':
            return {
                type: 'boolean',
                value: term.value,
                loc: term.location,
                is: mapType(bool),
            };
        case 'int':
            return {
                type: 'int',
                value: term.value,
                loc: term.location,
                is: mapType(int),
            };
        case 'string':
            return {
                type: 'string',
                value: term.text,
                loc: term.location,
                is: mapType(string),
            };
        case 'float':
            return {
                type: 'float',
                value: term.value,
                loc: term.location,
                is: mapType(float),
            };
        case 'ref': {
            // Hmm do I want to include type annotation here? I guess I did at one point
            return printTermRef(
                opts,
                term.ref,
                term.location,
                mapType(term.is),
            );
        }
        case 'if': {
            return iffe(
                env,
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
                is: mapType(term.is),
            };
        case 'apply': {
            // TODO we should hang onto the arg names of the function we
            // are calling so we can use them when assigning to values.
            // oh ok so we need to do somethign else if any of the arguments
            // need CPS.

            // ughhhhhhhh I think my denormalization is biting me here.
            if (getEffects(term).length > 0) {
                throw new LocatedError(
                    term.location,
                    `This apply has effects, but isn't in a CPS context. Effects: ${getEffects(
                        term,
                    )
                        .map(showEffectRef)
                        .join(', ')} : Target: ${showType(
                        env,
                        term.target.is,
                    )}`,
                );
            }

            let target = printTerm(env, opts, term.target);

            if (target.is.type === 'effectful-or-direct') {
                target = {
                    type: 'effectfulOrDirect',
                    target,
                    effectful: false,
                    loc: target.loc,
                    // STOPSHIP is this right?
                    is: target.is.direct,
                };
            } else if (term.hadAllVariableEffects) {
                console.log(printToString(termToPretty(env, term), 100));
                console.log(printToString(termToPretty(env, term.target), 100));
                console.log(showType(env, term.target.is));
                console.log(getEffects(term.target));
                throw new LocatedError(
                    term.location,
                    `target should be effectful-or-direct folks`,
                );
            }

            const appliedTargetType =
                term.target.is.type === 'lambda' &&
                term.target.is.effectVbls.length > 0
                    ? applyEffectVariables(env, term.target.is, [])
                    : term.target.is;

            const argTypes =
                appliedTargetType.type === 'lambda'
                    ? appliedTargetType.args
                    : [];
            if (argTypes.length !== term.args.length) {
                throw new Error(
                    `Need to resolve target type: ${showType(
                        env,
                        appliedTargetType,
                    )} - ${showType(env, term.is)}`,
                );
            }
            const args = term.args.map((arg, i) => {
                return maybeWrapPureFunction(env, arg, argTypes[i]);
            });

            return callExpression(
                env,
                target,
                args.map((arg, i) => printTerm(env, opts, arg)),
                term.location,
                term.typeVbls.map(mapType),
            );
        }

        case 'raise':
            throw new Error(
                "Cannot print a 'raise' outside of CPS. Effect tracking must have messed up.",
            );

        case 'handle': {
            return printHandle(env, opts, term);
        }

        case 'sequence': {
            return callExpression(
                env,
                arrowFunctionExpression(
                    [],
                    blockStatement(
                        term.sts.map((s, i) =>
                            s.type === 'Let'
                                ? {
                                      type: 'Define',
                                      sym: s.binding.sym,
                                      value: printTerm(env, opts, s.value),
                                      is: mapType(s.is),
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
                    term.location,
                ),
                [],
                term.location,
            );
        }
        // const ref = term.base.ref
        case 'Record': {
            // console.log('MAKING RECORD', term.location, term.base.rows);
            const defaults =
                term.base.type === 'Concrete'
                    ? allDefaults(
                          env.global,
                          env.global.types[
                              idName(term.base.ref.id)
                          ] as RecordDef,
                      )
                    : null;
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
                              rows: term.base.rows.map((r, i) => {
                                  if (r) {
                                      return printTerm(env, opts, r);
                                  }
                                  if (term.base.spread) {
                                      return null;
                                  }
                                  const base = term.base as ConcreteBase<Term>;
                                  const defn = env.global.types[
                                      idName(base.ref.id)
                                  ] as RecordDef;
                                  if (defn.defaults) {
                                      const found = defn.defaults[`${i}`];
                                      if (found) {
                                          return printTerm(
                                              env,
                                              opts,
                                              found.value,
                                          );
                                      }
                                  }
                                  throw new Error(
                                      `Unspecified element ${i} of Record literal.`,
                                  );

                                  //   r ? printTerm(env, opts, r) : null,
                              }),
                              spread: term.base.spread
                                  ? printTerm(env, opts, term.base.spread)
                                  : null,
                          },
                subTypes: Object.keys(term.subTypes).reduce(
                    (
                        obj: {
                            [key: string]: {
                                spread: Expr | null;
                                rows: Array<Expr | null>;
                            };
                        },
                        k,
                    ) => {
                        const subType = term.subTypes[k];
                        obj[k] = {
                            spread: subType.spread
                                ? printTerm(env, opts, subType.spread)
                                : null,
                            rows: subType.rows.map((r, i) => {
                                if (r) {
                                    return printTerm(env, opts, r);
                                }
                                if (
                                    subType.spread ||
                                    term.base.spread ||
                                    subType.covered
                                ) {
                                    return null;
                                }
                                if (defaults) {
                                    const key = `${k}#${i}`;
                                    if (defaults[key]) {
                                        return printTerm(
                                            env,
                                            opts,
                                            defaults[key].value,
                                        );
                                    }
                                    console.log(defaults, key);
                                }
                                // Hmmm it's ok, it might be covered by a spread?
                                // Hmmmmm but in that case, I might get things wrong.
                                // STOPSHIP write a test that covers.
                                return null;
                                // throw new LocatedError(
                                //     term.location,
                                //     `No value provided for subtype ${k} index ${i}`,
                                // );
                            }),
                        };
                        return obj;
                    },
                    {},
                ),
                is: mapType(term.is),
                loc: term.location,
            };
        }
        case 'TemplateString': {
            // Ok so we don't need something special for this
            let res: Expr | null = null;
            term.pairs.forEach((pair) => {
                const contents = printTerm(env, opts, pair.contents);
                const expr = pair.id
                    ? makeAs(env, pair.id, contents)
                    : contents;
                const pexpr =
                    pair.prefix != ''
                        ? concatStrings(
                              stringLiteral(pair.prefix, pair.location),
                              expr,
                              pair.location,
                          )
                        : expr;
                if (res == null) {
                    res = pexpr;
                } else {
                    res = concatStrings(res, pexpr, pair.location);
                }
            });
            if (!res) {
                throw new Error(`template string with no pairs? illegal`);
            }
            if (term.suffix != '') {
                res = concatStrings(
                    res,
                    stringLiteral(term.suffix, term.location),
                    term.location,
                );
            }
            return res;
        }
        case 'unary':
            return {
                type: 'unary',
                inner: printTerm(env, opts, term.inner),
                is: mapType(term.is),
                loc: term.location,
                op: term.op,
            };
        case 'Enum':
            return {
                type: 'Enum',
                loc: term.location,
                is: mapType(term.is) as TypeReference,
                inner: printTerm(env, opts, term.inner),
            };
        case 'TupleAccess': {
            return {
                type: 'tupleAccess',
                target: printTerm(env, opts, term.target),
                idx: term.idx,
                loc: term.location,
                is: mapType(term.is),
            };
        }
        case 'Attribute': {
            // HACK backfilling for when we didn't track this right 🙃
            let rtv = term.refTypeVbls || [];
            if (
                term.refTypeVbls == null &&
                term.target.is.type === 'ref' &&
                term.target.is.typeVbls.length
            ) {
                rtv = term.target.is.typeVbls;
            }
            return {
                type: 'attribute',
                target: printTerm(env, opts, term.target),
                ref: term.ref,
                refTypeVbls: rtv.map(mapType),
                idx: term.idx,
                loc: term.location,
                is: mapType(term.is),
            };
        }
        // Should trace exist in the IR? idk. yeah sure why not. Pass the buck.
        case 'Trace': {
            return {
                type: 'Trace',
                args: term.args.map((item) => printTerm(env, opts, item)),
                loc: term.location,
                idx: term.idx,
                is: mapType(term.is),
            };
        }
        case 'Tuple': {
            return {
                type: 'tuple',
                items: term.items.map((item) => printTerm(env, opts, item)),
                loc: term.location,
                is: mapType(term.is),
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
                elType: mapType(elType),
                is: mapType(term.is) as ArrayType,
            };
        }
        case 'Switch': {
            const basic = isConstant(term.term);

            const id = {
                name: 'discriminant',
                unique: env.local.unique.current++,
            };

            const value: Expr = basic
                ? printTerm(env, opts, term.term)
                : {
                      type: 'var',
                      sym: id,
                      loc: term.location,
                      is: mapType(term.term.is),
                  };

            let cases = [];

            term.cases.forEach((kase, i) => {
                cases.push(
                    printPattern(
                        env,
                        opts,
                        value,
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
                    [{ type: 'MatchFail', loc: term.location }],
                    term.location,
                ),
            );

            return iffe(
                env,
                blockStatement(
                    [
                        basic
                            ? null
                            : {
                                  type: 'Define',
                                  sym: id,
                                  value: printTerm(env, opts, term.term),
                                  loc: term.location,
                                  is: term.term.is,
                              },
                        ...cases,
                    ].filter(Boolean) as Array<Stmt>,
                    term.location,
                ),
            );
        }
        case 'Ambiguous':
            console.log(term);
            throw new LocatedError(
                term.location,
                `Cannot print ambiguous term to IR. Must resolve before printing.`,
            );
        case 'Hole':
        case 'NotFound':
        case 'InvalidApplication':
        case 'InvalidRecordAttributes':
        case 'TypeError':
            console.log(term);
            throw new LocatedError(
                term.location,
                `Cannot print type error term to IR. Must resolve before printing.`,
            );
        default:
            let _x: never = term;
            throw new Error(`Cannot print ${(term as any).type} to IR`);
    }
};

const concatStrings = (one: Expr, two: Expr, loc: Location): Expr => ({
    type: 'apply',
    // 'string concat'
    target: builtin(
        'stringConcat',
        loc,
        pureFunction([irString, irString], irString),
    ),
    is: irString,
    loc,
    typeVbls: [],
    args: [one, two],
});

const makeAs = (env: Env, id: Id, expr: Expr) => {
    return callExpression(
        env,
        {
            type: 'attribute',
            idx: 0,
            is: pureFunction([expr.is], irString),
            loc: expr.loc,
            ref: asRecord,
            refTypeVbls: [expr.is, irString],
            target: {
                type: 'term',
                id,
                is: {
                    type: 'ref',
                    ref: asRecord,
                    loc: expr.loc,
                    typeVbls: [expr.is, irString],
                },
                loc: expr.loc,
            },
        },
        [expr],
        expr.loc,
    );
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
