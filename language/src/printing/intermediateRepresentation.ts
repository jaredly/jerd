// import { Location } from '../parsing/parser';
// import * as t from '../typing/types';

type Loc = Location | null;

const builtinSyms = {
    handlers: { name: 'handlers', unique: 0 },
    cond: { name: 'cond', unique: 1000 },
};
const handlerSym = { name: 'handlers', unique: 0 };

// hrm where do I put comments in life

export type Toplevel =
    | { type: 'Define'; id: Id; body: Expr; is: Type; loc: Loc }
    | { type: 'Expression'; body: Expr; loc: Loc }
    | { type: 'Enum'; id: Id } // does this even need a reified representation?
    | {
          type: 'Record';
          id: Id;
          items: Array<{ id: Id; idx: number; is: Type }>;
          loc: Loc;
      }
    | {
          type: 'Effect';
          id: Id;
          items: Array<{ args: Array<Type>; res: Type }>;
          loc: Loc;
      };

export type Stmt =
    | { type: 'Expression'; expr: Expr; loc: Loc }
    | { type: 'Define'; sym: Symbol; value: Expr; is: Type; loc: Loc }
    | { type: 'Assign'; sym: Symbol; value: Expr; is: Type; loc: Loc }
    | { type: 'if'; cond: Expr; yes: Block; no: Block | null; loc: Loc }
    | { type: 'Return'; value: Expr; loc: Loc }
    | Block;
export type Block = { type: 'Block'; items: Array<Stmt>; loc: Loc };

export const callExpression = (
    target: Expr,
    args: Array<Expr>,
    loc: Loc,
): Expr => ({
    type: 'apply',
    target,
    args,
    loc,
});
const builtin = (name: string, loc: Loc): Expr => ({
    type: 'builtin',
    name,
    loc,
});
const stringLiteral = (value: string, loc: Loc): Expr => ({
    type: 'string',
    value,
    loc,
});

// Record creation ... I'll want a second pass to bring that up to a statement level I think
// so that I can support go or python...
// also I don't support effects in record creation just yet.
// oh wait, I think go and python can create records just fine
export type Expr =
    | { type: 'string'; value: string; loc: Loc }
    | { type: 'int'; value: number; loc: Loc }
    | { type: 'float'; value: number; loc: Loc }
    | { type: 'term'; id: Id; loc: Loc }
    | { type: 'var'; sym: Symbol; loc: Loc }
    | { type: 'builtin'; name: string; loc: Loc }
    | { type: 'effectfulOrDirect'; effectful: boolean; target: Expr; loc: Loc }
    | {
          type: 'raise';
          effect: Id;
          idx: number;
          args: Array<Expr>;
          done: Expr;
          loc: Loc;
      }
    | {
          type: 'handle';
          target: Expr;
          effect: Id;
          loc: Loc;
          pure: { arg: Symbol; body: Expr | Block };
          cases: Array<{
              constr: number;
              args: Array<Symbol>;
              k: Symbol;
              body: Expr | Block;
          }>;
      }
    | {
          type: 'array';
          items: Array<Expr | { type: 'Spread'; value: Expr }>;
          elType: Type;
          loc: Loc;
      }
    // effects have been taken care of at this point
    // do we need to know the types of things? perhaps for conversions?
    | {
          type: 'apply';
          target: Expr;
          //   args: Array<{ value: Expr; type: Type; loc: Loc }>;
          args: Array<Expr>;
          loc: Loc;
      }
    | { type: 'attribute'; target: Expr; id: Id; idx: number; loc: Loc }
    | {
          type: 'effectfulOrDirectLambda';
          effectful: LambdaExpr;
          direct: LambdaExpr;
          loc: Loc;
      }
    | LambdaExpr;

type LambdaExpr = {
    type: 'lambda';
    // hrmmm how do I represent the "handlers" and such?
    // do I just have a "handlers" type? Will swift require more of me? no it has an Any
    // I could just say "builtin any"
    // but what about the sym? Do I generate new syms? probably not.
    args: Array<Arg>;
    res: Type;
    body: Expr | Block;
    loc: Loc;
};

type Arg = { sym: Symbol; type: Type; loc: Loc };
// and that's all folks

import {
    Term,
    Env,
    Type,
    getEffects,
    Symbol,
    Id,
    Reference,
    Let,
    Var,
    EffectRef,
    Lambda,
    LambdaType,
    walkTerm,
    Pattern,
    RecordDef,
    UserReference,
} from '../typing/types';
import { Location } from '../parsing/parser';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { binOps, bool, builtinType, void_ } from '../typing/preset';
import { showType } from '../typing/unify';
import { optimizeAST } from './typeScriptOptimize';
import { applyEffectVariables, getEnumReferences } from '../typing/typeExpr';
import { idName } from '../typing/env';
import { args } from './printer';

const printSym = (sym: Symbol) => sym.name + '_' + sym.unique;
const printId = (id: Id) => 'hash_' + id.hash; // + '_' + id.pos; TODO recursives

function withLocation<
    T extends { start: number | null; end: number | null; loc: any }
>(v: T, loc: Location | null): T {
    if (loc == null) {
        return v;
    }
    v.start = loc.start.offset;
    v.end = loc.end.offset;
    v.loc = { start: loc.start, end: loc.end };
    return v;
}

export type OutputOptions = {
    readonly scope?: string;
    readonly noTypes?: boolean;
    readonly limitExecutionTime?: boolean;
};

export const handlerVar = (loc: Loc): Expr => ({
    type: 'var',
    sym: handlerSym,
    loc,
});

// const callExpression = (target: Expr, args: Array<Expr>, loc: Loc) => ({
//     type: 'apply',
//     target,
//     args,
//     loc,
// });

const returnStatement = (expr: Expr): Stmt => ({
    type: 'Return',
    value: expr,
    loc: expr.loc,
});

const ifStatement = (
    cond: Expr,
    yes: Expr | Block,
    no: Expr | Block | null,
    loc: Loc,
): Stmt => {
    return {
        type: 'if',
        cond,
        loc,
        yes: ifBlock(yes),
        no: no ? ifBlock(no) : null,
    };
};

const blockStatement = (items: Array<Stmt>, loc: Loc): Block => ({
    type: 'Block',
    items,
    loc,
});

const arrowFunctionExpression = (
    args: Array<Arg>,
    body: Expr | Block,
    res: Type,
    loc: Loc,
): LambdaExpr => {
    return {
        type: 'lambda',
        args,
        body,
        res,
        loc,
    };
};

const cpsLambda = (arg: Arg, body: Expr | Block, loc: Loc): Expr => {
    return {
        type: 'lambda',
        args: [
            {
                sym: handlerSym,
                type: builtinType('handlers'),
                loc: null,
            },
            arg,
        ],
        body,
        res: void_,
        loc,
    };
};

export const printLambdaBody = (
    env: Env,
    opts: OutputOptions,
    term: Term,
    // cps: null | { body: Expr; bind: t.Identifier },
    cps: null | Expr,
): Block | Expr => {
    if (cps == null) {
        if (term.type === 'sequence') {
            return {
                type: 'Block',
                items: term.sts.map(
                    (s, i): Stmt => {
                        if (s.type === 'Let') {
                            return {
                                type: 'Define',
                                sym: s.binding,
                                value: printTerm(env, opts, s.value),
                                loc: s.location,
                                is: s.is,
                            };
                        } else if (i === term.sts.length - 1) {
                            return {
                                type: 'Return',
                                value: printTerm(env, opts, s),
                                loc: s.location,
                            };
                        } else {
                            return {
                                type: 'Expression',
                                expr: printTerm(env, opts, s),
                                loc: s.location,
                            };
                        }
                    },
                ),
                loc: term.location,
            };
        } else {
            return printTerm(env, opts, term);
        }
    } else {
        if (term.type === 'sequence') {
            // so we start from the last
            // and we know what we want to bind to, right? or something?
            // in what case would we want to CPS something that
            // can't be CPSd?
            let inner: Expr = cps;
            for (let i = term.sts.length - 1; i >= 0; i--) {
                if (i > 0) {
                    inner = {
                        type: 'lambda',
                        args: [
                            {
                                sym: handlerSym,
                                type: builtinType('handlers'),
                                loc: null,
                            },
                            {
                                sym: { name: '_ignored', unique: 1 },
                                type: builtinType('void'),
                                loc: null,
                            },
                        ],
                        body: {
                            type: 'Block',
                            loc: term.sts[i].location,
                            items: [
                                {
                                    type: 'Expression',
                                    expr: termToAstCPS(
                                        env,
                                        opts,
                                        term.sts[i],
                                        inner,
                                    ),
                                    loc: term.sts[i].location,
                                },
                            ],
                        },
                        res: void_,
                        loc: term.sts[i].location,
                    };
                } else {
                    inner = termToAstCPS(env, opts, term.sts[i], inner);
                }
            }
            return {
                type: 'Block',
                items: [
                    { type: 'Expression', expr: inner, loc: term.location },
                ],
                loc: term.location,
            };
        } else {
            return {
                type: 'Block',
                items: [
                    {
                        type: 'Expression',
                        expr: termToAstCPS(env, opts, term, cps),
                        loc: term.location,
                    },
                ],
                loc: term.location,
            };
        }
    }
};

const isConstant = (arg: Term) => {
    switch (arg.type) {
        case 'int':
        case 'float':
        case 'string':
        case 'ref':
        case 'var':
            return true;
        default:
            return false;
    }
};

const isSimple = (arg: Term) => {
    switch (arg.type) {
        case 'int':
        case 'float':
        case 'string':
        case 'ref':
        case 'var':
            return true;
        default:
            if (
                arg.type === 'apply' &&
                arg.args.every(isSimple) &&
                arg.target.type === 'ref' &&
                arg.target.ref.type === 'builtin' &&
                isSimpleBuiltin(arg.target.ref.name)
            ) {
                return true;
            }
            return false;
    }
};

const isSimpleBuiltin = (name: string) => {
    return binOps.includes(name);
};

export const termToAstCPS = (
    env: Env,
    opts: OutputOptions,
    term: Term | Let,
    done: Expr,
): Expr => {
    return _termToAstCPS(env, opts, term, done);
};

// cps: t.Identifier // is it the done fn, or the thing I want you to bind to?
const _termToAstCPS = (
    env: Env,
    opts: OutputOptions,
    term: Term | Let,
    done: Expr,
): Expr => {
    // No effects in the term
    if (!getEffects(term).length && term.type !== 'Let') {
        return {
            type: 'apply',
            target: done,
            args: [
                {
                    type: 'var',
                    sym: handlerSym,
                    loc: null,
                },
                printTerm(env, opts, term),
            ],
            loc: null,
        };
    }
    switch (term.type) {
        case 'handle': {
            if (getEffects(term.target).length > 0) {
                throw new Error(
                    `Handle target has effects! should be a lambda`,
                );
            }
            // START HERE:
            // I think this is a reasonable approach, folks.
            // this is feeling pretty good so far.
            // I'm wondering if I want to specify handler as much as this...
            // OHHHH WAIT NO I need to CPS this up still 🤔
            return {
                type: 'handle',
                target: printTerm(env, opts, term.target),
                effect: (term.effect as UserReference).id,
                loc: term.location,
                // fail boat
                pure: {
                    arg: term.pure.arg,
                    body: printLambdaBody(env, opts, term.pure.body, done),
                    // printTerm(env, opts, term.pure.body),
                },
                cases: term.cases.map((kase) => ({
                    ...kase,
                    body: printLambdaBody(env, opts, kase.body, done),
                })),
            };
        }
        case 'Let': {
            return termToAstCPS(
                env,
                opts,
                term.value,
                cpsLambda(
                    { sym: term.binding, type: term.is, loc: term.location },
                    {
                        type: 'apply',
                        target: done,
                        args: [{ type: 'var', sym: handlerSym, loc: null }],
                        loc: null,
                    },
                    term.location,
                ),
            );
        }
        case 'raise': {
            if (
                ([] as Array<EffectRef>).concat(...term.args.map(getEffects))
                    .length > 0
            ) {
                return stringLiteral('raise args effects', null);
            }
            if (term.ref.type === 'builtin') {
                throw new Error('ok');
            }
            return {
                type: 'raise',
                effect: term.ref.id,
                idx: term.idx,
                args: term.args.map((t) => printTerm(env, opts, t)),
                loc: term.location,
                done,
            };
            // const args: Array<Expr> = [
            //     { type: 'var', sym: handlerSym, loc: null },
            //     // builtin('handlers'),
            //     t.stringLiteral(term.ref.id.hash),
            //     t.numericLiteral(term.idx),
            // ];
            // if (term.args.length === 0) {
            //     args.push(t.nullLiteral());
            // } else if (term.args.length === 1) {
            //     args.push(printTerm(env, opts, term.args[0]));
            // } else {
            //     args.push(
            //         t.arrayExpression(
            //             term.args.map((a) => printTerm(env, opts, a)),
            //         ),
            //     );
            // }
            // args.push(
            //     t.arrowFunctionExpression(
            //         [t.identifier('handlers'), t.identifier('value')],
            //         t.callExpression(done, [
            //             t.identifier('handlers'),
            //             t.identifier('value'),
            //         ]),
            //     ),
            // );
            // return t.callExpression(scopedGlobal(opts, 'raise'), args);
        }
        case 'if': {
            const condEffects = getEffects(term.cond);
            if (condEffects.length) {
                return termToAstCPS(
                    env,
                    opts,
                    term.cond,
                    cpsLambda(
                        {
                            sym: { name: 'cond', unique: 1000 },
                            type: bool,
                            loc: term.cond.location,
                        },
                        {
                            type: 'Block',
                            items: [
                                ifStatement(
                                    {
                                        type: 'var',
                                        sym: { name: 'cond', unique: 1000 },
                                        loc: term.cond.location,
                                    },
                                    printLambdaBody(env, opts, term.yes, done),
                                    term.no
                                        ? printLambdaBody(
                                              env,
                                              opts,
                                              term.no,
                                              done,
                                          )
                                        : callExpression(
                                              done,
                                              [handlerVar(term.location)],
                                              term.location,
                                          ),
                                    term.location,
                                ),
                            ],
                            loc: term.location,
                        },
                        term.location,
                    ),
                );
            }

            const cond = printTerm(env, opts, term.cond);

            // return

            return iffe(
                blockStatement(
                    [
                        ifStatement(
                            cond,
                            printLambdaBody(env, opts, term.yes, done),
                            term.no
                                ? printLambdaBody(env, opts, term.no, done)
                                : callExpression(
                                      done,
                                      [handlerVar(term.location)],
                                      term.location,
                                  ),
                            term.location,
                        ),
                    ],
                    term.location,
                ),
                void_,
            );
        }
        case 'apply': {
            if (getEffects(term.target).length) {
                throw new Error(`target affects in an apply, sorry`);
                // return t.identifier('STOPSHIP target effects');
            }
            const u = env.local.unique++;

            if (term.target.is.type !== 'lambda') {
                throw new Error(`Target is not a function`);
            }
            const argTypes = term.target.is.args;
            const args = term.args.map((arg, i) => {
                return maybeWrapPureFunction(env, arg, argTypes[i]);
            });

            const argsEffects = ([] as Array<EffectRef>).concat(
                ...term.args.map(getEffects),
            );
            if (argsEffects.length > 0) {
                const argSyms = args.map((arg, i) =>
                    isSimple(arg)
                        ? null
                        : { name: `arg_${i}`, unique: env.local.unique++ },
                );
                let target = printTerm(env, opts, term.target);
                if (term.hadAllVariableEffects) {
                    target = {
                        type: 'effectfulOrDirect',
                        target,
                        effectful: true,
                        loc: target.loc,
                    };
                }
                let inner: Expr = done;
                if (term.target.is.effects.length > 0) {
                    // ok so the thing is,
                    // i only need to cps it out if the arg
                    // is an apply that does cps.
                    // but not if that arg has an arg that does cps,
                    // right?
                    inner = callExpression(
                        target,
                        (argSyms.map((sym, i) =>
                            sym
                                ? { type: 'var', sym, loc: null }
                                : printTerm(env, opts, args[i]),
                        ) as Array<Expr>).concat([
                            handlerVar(target.loc),
                            inner,
                        ]),
                        target.loc,
                    );
                } else {
                    // hm. I feel like I need to introspect `done`.
                    // and have a way to flatten out immediate calls.
                    // or I could do that post-hoc?
                    // I mean that might make things simpler tbh.
                    inner = callExpression(
                        done,
                        [
                            handlerVar(target.loc),
                            // so here is where we want to
                            // put the "body"
                            // which might include inverting it.
                            callExpression(
                                target,
                                argSyms.map((sym, i) =>
                                    sym
                                        ? { type: 'var', sym, loc: null }
                                        : printTerm(env, opts, args[i]),
                                ) as Array<Expr>,
                                target.loc,
                            ),
                        ],
                        target.loc,
                    );
                }
                for (let i = args.length - 1; i >= 0; i--) {
                    if (isSimple(args[i])) {
                        continue;
                    }
                    // TODO: follow type refs 🤔
                    // should just have a function like
                    // `resolveType(env, theType)`
                    // if (term.target.is.type === 'lambda' && )
                    inner = termToAstCPS(
                        env,
                        opts,
                        args[i],
                        arrowFunctionExpression(
                            [
                                {
                                    sym: handlerSym,
                                    loc: null,
                                    type: builtinType('handlers'),
                                },
                                {
                                    sym: argSyms[i]!,
                                    loc: args[i].location,
                                    type: args[i].is,
                                },
                            ],
                            blockStatement(
                                [
                                    {
                                        type: 'Expression',
                                        expr: inner,
                                        loc: inner.loc,
                                    },
                                ],
                                inner.loc,
                            ),
                            void_,
                            args[i].location,
                        ),
                    );
                }
                return inner;
            }
            let target = printTerm(env, opts, term.target);
            if (term.hadAllVariableEffects) {
                target = {
                    type: 'effectfulOrDirect',
                    target,
                    effectful: true,
                    loc: target.loc,
                };
                // target = memberExpression(target, t.identifier('effectful'));
            }
            return callExpression(
                target,
                args
                    .map((arg) => printTerm(env, opts, arg))
                    .concat([handlerVar(target.loc), done]),
                target.loc,
            );
        }
        case 'sequence':
            throw new Error(
                `Sequence encountered. This should probably be a lambda body?`,
            );
        default:
            console.log('ELSE', term.type);
            return callExpression(
                done,
                [handlerVar(term.location), printTerm(env, opts, term)],
                term.location,
            );
    }
};

const maybeWrapPureFunction = (env: Env, arg: Term, t: Type): Term => {
    // console.error(`Maybe ${showType(env, arg.is)} : ${showType(env, t)}`);
    if (t.type !== 'lambda' || t.effects.length === 0) {
        return arg;
    }
    if (arg.is.type !== 'lambda') {
        throw new Error(
            `arg not a lambda, would be cool to statically keep these in sync`,
        );
    }
    if (arg.is.effects.length !== 0) {
        return arg;
    }
    const args: Array<Var> = arg.is.args.map((t, i) => ({
        type: 'var',
        is: t,
        location: null,
        sym: {
            unique: env.local.unique++,
            name: `arg_${i}`,
        },
    }));
    return {
        type: 'lambda',
        args: args.map((a) => a.sym),
        is: {
            ...arg.is,
            effects: t.effects,
        },
        location: arg.location,
        body: {
            type: 'apply',
            location: arg.location,
            typeVbls: [],
            effectVbls: null,
            args,
            target: arg,
            is: arg.is.res,
        },
        // effects: t.effects,
    };
};

// const callOrBinop = (target: Expr, args: Array<Expr>): Expr => {
//     if (t.isIdentifier(target) && binOps.includes(target.name)) {
//         return t.binaryExpression(
//             (target.name === '++' ? '+' : target.name) as any,
//             args[0],
//             args[1],
//         );
//     }
//     return t.callExpression(target, args);
// };

const ifBlock = (x: Block | Expr): Block => {
    if (x.type === 'Block') {
        return x;
    } else {
        return {
            type: 'Block',
            items: [{ type: 'Return', value: x, loc: x.loc }],
            loc: x.loc,
        };
    }
};

const iffe = (st: Block, res: Type): Expr => {
    return callExpression(
        arrowFunctionExpression([], st, res, st.loc),
        [],
        st.loc,
    );
};

export const printTerm = (env: Env, opts: OutputOptions, term: Term): Expr => {
    return _printTerm(env, opts, term);
};

const builtinName = (name: string) => {
    if (name === '^') {
        return 'pow';
    }
    return name;
};

const printTermRef = (opts: OutputOptions, ref: Reference, loc: Loc): Expr => {
    // if (
    //     opts.scope == null ||
    //     (ref.type === 'builtin' && binOps.includes(ref.name))
    // ) {
    return ref.type === 'builtin'
        ? { type: 'builtin', name: ref.name, loc }
        : { type: 'term', id: ref.id, loc };
    // return t.identifier(
    //     ref.type === 'builtin' ? builtinName(ref.name) : printId(ref.id),
    // );
    // } else {
    //     return t.memberExpression(
    //         t.memberExpression(
    //             t.identifier(opts.scope),
    //             t.identifier(ref.type === 'builtin' ? 'builtins' : 'terms'),
    //         ),
    //         ref.type === 'builtin'
    //             ? t.identifier(builtinName(ref.name))
    //             : t.stringLiteral(idName(ref.id)),
    //         ref.type === 'user',
    //     );
    // }
};

const _printTerm = (env: Env, opts: OutputOptions, term: Term): Expr => {
    switch (term.type) {
        // these will never need effects, immediate is fine
        case 'self':
            return printTermRef(
                opts,
                {
                    type: 'user',
                    id: { hash: env.local.self.name, size: 1, pos: 0 },
                },
                term.location,
            );
        // return t.identifier(`hash_${env.local.self.name}`);
        case 'int':
            return { type: 'int', value: term.value, loc: term.location };
        case 'string':
            return { type: 'string', value: term.text, loc: term.location };
        case 'float':
            return { type: 'float', value: term.value, loc: term.location };
        case 'ref': {
            // Hmm do I want to include type annotation here? I guess I did at one point
            return printTermRef(opts, term.ref, term.location);
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
            if (term.is.effects.length > 0) {
                if (term.is.effects.every((x) => x.type === 'var')) {
                    const directVersion = withNoEffects(env, term);
                    return {
                        type: 'effectfulOrDirectLambda',
                        loc: term.location,
                        effectful: effectfulLambda(env, opts, term),
                        direct: arrowFunctionExpression(
                            directVersion.args.map(
                                (sym, i) => ({
                                    sym,
                                    type: directVersion.is.args[i],
                                    loc: null,
                                }), // TODO(sourcemap): hang on to location for lambda args?
                                // t.identifier(printSym(arg)),
                            ),
                            // withExecutionLimit(
                            //     env,
                            //     opts,
                            printLambdaBody(
                                env,
                                opts,
                                directVersion.body,
                                null,
                            ),
                            // ),
                            directVersion.is.res,
                            term.location,
                        ),
                    };
                    // return t.objectExpression([
                    //     t.objectProperty(
                    //         t.identifier('direct'),
                    //         ,
                    //     ),
                    //     t.objectProperty(
                    //         t.identifier('effectful'),
                    //         effectfulLambda(env, opts, term),
                    //     ),
                    // ]);
                }
                return effectfulLambda(env, opts, term);
            } else {
                return arrowFunctionExpression(
                    term.args.map((sym, i) => ({
                        sym,
                        type: term.is.args[i],
                        loc: null,
                    })),
                    // withExecutionLimit(
                    //     env,
                    //     opts,
                    printLambdaBody(env, opts, term.body, null),
                    term.is.res,
                    // ),
                    term.location,
                );
            }
        case 'var':
            return { type: 'var', sym: term.sym, loc: term.location };
        // return t.identifier(printSym(term.sym));
        case 'apply': {
            // TODO we should hang onto the arg names of the function we
            // are calling so we can use them when assigning to values.
            // oh ok so we need to do somethign else if any of the arguments
            // need CPS.

            // ughhhhhhhh I think my denormalization is biting me here.
            if (getEffects(term).length > 0) {
                throw new Error(
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

            if (term.hadAllVariableEffects) {
                // target = t.memberExpression(target, t.identifier('direct'));
                target = {
                    type: 'effectfulOrDirect',
                    target,
                    effectful: false,
                    loc: target.loc,
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
                args.map((arg) => printTerm(env, opts, arg)),
                term.location,
            );
        }

        case 'raise':
            throw new Error(
                "Cannot print a 'raise' outside of CPS. Effect tracking must have messed up.",
            );

        case 'handle': {
            return {
                type: 'handle',
                target: printTerm(env, opts, term.target),
                loc: term.location,
                effect: (term.effect as UserReference).id,
                pure: {
                    arg: term.pure.arg,
                    body: printLambdaBody(env, opts, term.pure.body, null),
                },
                cases: term.cases.map((kase) => ({
                    ...kase,
                    body: printLambdaBody(env, opts, kase.body, null),
                })),
            };
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
                                i === term.sts.length - 1
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
            return t.objectExpression(
                ((term.base.spread != null
                    ? [t.spreadElement(printTerm(env, opts, term.base.spread))]
                    : []) as Array<t.ObjectProperty | t.SpreadElement>)
                    .concat(
                        ...Object.keys(term.subTypes).map(
                            (id) =>
                                (term.subTypes[id].spread
                                    ? [
                                          t.spreadElement(
                                              printTerm(
                                                  env,
                                                  opts,
                                                  term.subTypes[id].spread!,
                                              ),
                                          ),
                                      ]
                                    : []) as Array<
                                    t.ObjectProperty | t.SpreadElement
                                >,
                        ),
                    )
                    .concat(
                        term.base.type === 'Concrete'
                            ? [
                                  t.objectProperty(
                                      t.identifier('type'),
                                      t.stringLiteral(
                                          recordIdName(
                                              env,
                                              (term.base as any).ref,
                                          ),
                                      ),
                                  ),
                              ]
                            : [],
                    )
                    .concat(
                        ...Object.keys(term.subTypes).map(
                            (id) =>
                                term.subTypes[id].rows
                                    .map((row, i) =>
                                        row != null
                                            ? t.objectProperty(
                                                  t.identifier(
                                                      recordAttributeName(
                                                          env,
                                                          id,
                                                          i,
                                                      ),
                                                  ),
                                                  printTerm(env, opts, row),
                                              )
                                            : null,
                                    )
                                    .filter(Boolean) as Array<t.ObjectProperty>,
                        ),
                    )
                    .concat(
                        term.base.type === 'Concrete'
                            ? (term.base.rows
                                  .map((row, i) =>
                                      row != null
                                          ? t.objectProperty(
                                                t.identifier(
                                                    recordAttributeName(
                                                        env,
                                                        (term.base as any).ref,
                                                        i,
                                                    ),
                                                ),
                                                printTerm(env, opts, row),
                                            )
                                          : null,
                                  )
                                  .filter(Boolean) as Array<t.ObjectProperty>)
                            : [],
                    ) as Array<any>,
            );
        }
        case 'Enum':
            return printTerm(env, opts, term.inner);
        case 'Attribute': {
            return t.memberExpression(
                printTerm(env, opts, term.target),
                t.identifier(recordAttributeName(env, term.ref, term.idx)),
            );
        }
        case 'Array':
            return t.arrayExpression(
                term.items.map((item) =>
                    item.type === 'ArraySpread'
                        ? t.spreadElement(printTerm(env, opts, item.value))
                        : printTerm(env, opts, item),
                ),
            );
        case 'Switch': {
            // const raspies
            // return
            /*
            switch x {
                Some => true,
                None => false,
            }

            =>

            () => {
                if (x.type === 'some') {
                    return true
                } else if (x.type === 'none') {
                    return false
                } else {
                    throw new Error('Invalid case analysis!')
                }
            }()
            */
            // TODO: if the term is "basic", we can just pass it through
            const basic = isConstant(term.term);

            const id = '$discriminant';

            const value = basic
                ? printTerm(env, opts, term.term)
                : t.identifier(id);

            let cases = [];

            term.cases.forEach((kase, i) => {
                cases.push(
                    printPattern(
                        env,
                        value,
                        kase.pattern,
                        t.blockStatement([
                            t.returnStatement(printTerm(env, opts, kase.body)),
                        ]),
                    ),
                );
            });

            cases.push(
                t.blockStatement([
                    t.throwStatement(
                        t.newExpression(t.identifier('Error'), [
                            t.stringLiteral('Invalid case analysis'),
                        ]),
                    ),
                ]),
            );

            return iffe(
                t.blockStatement(
                    [
                        basic
                            ? null
                            : t.variableDeclaration('const', [
                                  t.variableDeclarator(
                                      t.identifier(id),
                                      printTerm(env, opts, term.term),
                                  ),
                              ]),
                        ...cases,
                    ].filter(Boolean) as Array<t.Statement>,
                ),
            );
        }
        case 'boolean':
            return t.booleanLiteral(term.value);
        default:
            let _x: never = term;
            throw new Error(`Cannot print ${(term as any).type} to TypeScript`);
    }
};

// Here's how this looks.
// If you succeed, return the success branch. otherwise, do nothing.
// my post-processing pass with flatten out all useless iffes.
const printPattern = (
    env: Env,
    value: Expr,
    pattern: Pattern,
    success: t.BlockStatement,
): t.BlockStatement => {
    if (pattern.type === 'Binding') {
        return t.blockStatement([
            t.variableDeclaration('const', [
                t.variableDeclarator(
                    t.identifier(printSym(pattern.sym)),
                    value,
                ),
            ]),
            success,
        ]);
    } else if (pattern.type === 'Enum') {
        const allReferences = getEnumReferences(env, pattern.ref);
        let typ = t.memberExpression(value, t.identifier('type'));
        let tests: Array<Expr> = allReferences.map((ref) =>
            t.binaryExpression(
                '===',
                typ,
                t.stringLiteral(recordIdName(env, ref.ref)),
            ),
        );
        return t.blockStatement([
            t.ifStatement(
                tests.reduce((one: Expr, two: Expr) =>
                    t.logicalExpression('||', one, two),
                ),
                success,
            ),
        ]);
    } else if (pattern.type === 'Alias') {
        return printPattern(
            env,
            value,
            pattern.inner,
            t.blockStatement([
                t.variableDeclaration('const', [
                    t.variableDeclarator(
                        t.identifier(printSym(pattern.name)),
                        value,
                    ),
                ]),
                success,
            ]),
        );
    } else if (pattern.type === 'Record') {
        // tbh this should probably be processed in reverse?
        // although it probably doesn't matter, because
        // these can't be effectful
        pattern.items.forEach((item) => {
            success = printPattern(
                env,
                t.memberExpression(
                    value,
                    t.identifier(recordAttributeName(env, item.ref, item.idx)),
                ),
                item.pattern,
                success,
            );
        });
        return t.blockStatement([
            t.ifStatement(
                t.binaryExpression(
                    '===',
                    t.memberExpression(value, t.identifier('type')),
                    t.stringLiteral(recordIdName(env, pattern.ref.ref)),
                ),
                success,
            ),
        ]);
    } else if (pattern.type === 'int' || pattern.type === 'float') {
        return t.blockStatement([
            t.ifStatement(
                t.binaryExpression(
                    '===',
                    value,
                    t.numericLiteral(pattern.value),
                ),
                success,
            ),
        ]);
    } else if (pattern.type === 'string') {
        return t.blockStatement([
            t.ifStatement(
                t.binaryExpression('===', value, t.stringLiteral(pattern.text)),
                success,
            ),
        ]);
    } else if (pattern.type === 'boolean') {
        return t.blockStatement([
            t.ifStatement(
                t.binaryExpression(
                    '===',
                    value,
                    t.booleanLiteral(pattern.value),
                ),
                success,
            ),
        ]);
    } else if (pattern.type === 'Array') {
        // ok so I don't need to check that it's an array.
        // that's given by the type system.
        // So, processing in reverse order...
        // Spread last because it's expensive potentially
        if (pattern.spread) {
            success = printPattern(
                env,
                t.callExpression(
                    t.memberExpression(value, t.identifier('slice')),
                    [t.numericLiteral(pattern.preItems.length)].concat(
                        pattern.postItems.length
                            ? [t.numericLiteral(-pattern.postItems.length)]
                            : [],
                    ),
                ),
                pattern.spread,
                success,
            );
        }

        // Then postitems, because it requires calculating length a bunch
        const ln = t.memberExpression(value, t.identifier('length'));
        pattern.postItems.forEach((item, i) => {
            success = printPattern(
                env,
                t.memberExpression(
                    value,
                    t.binaryExpression(
                        '-',
                        ln,
                        t.numericLiteral(pattern.postItems.length - i),
                    ),
                    true,
                ),
                item,
                success,
            );
        });

        // hrmmmmmm
        pattern.preItems.forEach((item, i) => {
            success = printPattern(
                env,
                t.memberExpression(value, t.numericLiteral(i), true),
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
            success = t.blockStatement([
                t.ifStatement(
                    t.binaryExpression(
                        pattern.spread ? '>=' : '===',
                        ln,
                        t.numericLiteral(
                            pattern.preItems.length + pattern.postItems.length,
                        ),
                    ),
                    success,
                ),
            ]);
        }

        return success;
    }
    const _v: never = pattern;
    throw new Error(`Pattern not yet supported ${(pattern as any).type}`);
};

const recordIdName = (env: Env, ref: Reference) => {
    if (ref.type === 'builtin') {
        return ref.name;
    } else {
        const t = env.global.types[idName(ref.id)] as RecordDef;
        if (t.ffi != null) {
            return t.ffi.tag;
        }
        return idName(ref.id);
    }
};

const recordAttributeName = (
    env: Env,
    ref: Reference | string,
    idx: number,
) => {
    if (typeof ref !== 'string' && ref.type === 'builtin') {
        return `${ref.name}_${idx}`;
    }
    const id = typeof ref === 'string' ? ref : idName(ref.id);
    const t = env.global.types[id] as RecordDef;
    if (t.ffi) {
        return t.ffi.names[idx];
    }
    if (typeof ref === 'string') {
        return `h${ref}_${idx}`;
    }
    // if (ref.type === 'builtin') {
    //     return `${ref.name}_${idx}`;
    // }
    return `h${idName(ref.id)}_${idx}`;
};

const clearEffects = (
    vbls: Array<number>,
    effects: Array<EffectRef>,
): Array<EffectRef> => {
    return effects.filter(
        (e) => e.type !== 'var' || !vbls.includes(e.sym.unique),
    );
};

// yeah we need to go in, and
// apply the effect variables all over
const withNoEffects = (env: Env, term: Lambda): Lambda => {
    const vbls = term.is.effectVbls;
    const is = applyEffectVariables(env, term.is, []) as LambdaType;
    // lol clone
    term = JSON.parse(JSON.stringify(term)) as Lambda;
    walkTerm(term, (t) => {
        if (t.type === 'apply') {
            const is = t.target.is as LambdaType;
            if (is.effects) {
                is.effects = clearEffects(vbls, is.effects);
            }
        }
    });
    return { ...term, is };
};

const effectfulLambda = (
    env: Env,
    opts: OutputOptions,
    term: Lambda,
): LambdaExpr => {
    const done: Symbol = { name: 'done', unique: env.local.unique++ };
    const doneT: LambdaType = {
        type: 'lambda',
        args: [term.is.res],
        typeVbls: [],
        effectVbls: [],
        effects: [],
        rest: null,
        location: null,
        res: {
            location: null,
            type: 'ref',
            ref: {
                type: 'builtin',
                name: 'void',
            },
            typeVbls: [],
            effectVbls: [],
        },
    };
    return arrowFunctionExpression(
        term.args
            .map((sym, i) => ({
                sym,
                type: term.is.args[i],
                loc: null,
            }))
            // .map((arg) => t.identifier(printSym(arg)))
            .concat([
                { type: builtinType('handlers'), sym: handlerSym, loc: null },
                // handlerVar(term.location),
                // {
                //     ...t.identifier('handlers'),
                //     typeAnnotation: t.tsTypeAnnotation(
                //         // STOPSHIP: Actually type this
                //         t.tsAnyKeyword(),
                //     ),
                // },
                { sym: done, type: doneT, loc: null },
                // {
                //     ...t.identifier('done'),
                //     typeAnnotation: t.tsTypeAnnotation(
                //         typeToAst(env, opts, {
                //             type: 'lambda',
                //             args: [term.is.res],
                //             typeVbls: [],
                //             effectVbls: [],
                //             effects: [],
                //             rest: null,
                //             location: null,
                //             res: {
                //                 location: null,
                //                 type: 'ref',
                //                 ref: {
                //                     type: 'builtin',
                //                     name: 'void',
                //                 },
                //                 typeVbls: [],
                //                 effectVbls: [],
                //             },
                //         }),
                //     ),
                // },
            ]),
        // withExecutionLimit(
        //     env,
        //     opts,
        printLambdaBody(env, opts, term.body, {
            type: 'var',
            sym: done,
            loc: null,
        }),
        // ),
        term.is.res,
        term.location,
    );
};

const showEffectRef = (eff: EffectRef) => {
    if (eff.type === 'var') {
        return printSym(eff.sym);
    }
    return printRef(eff.ref);
};

const printRef = (ref: Reference) =>
    ref.type === 'builtin' ? ref.name : ref.id.hash;

const dedup = (items: Array<string>): Array<string> => {
    const used: { [key: string]: boolean } = {};
    return items.filter((r) => (used[r] ? false : ((used[r] = true), true)));
};