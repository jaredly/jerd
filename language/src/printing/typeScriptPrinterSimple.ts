// Ok

import * as t from '@babel/types';
import {
    expressionDeps,
    expressionTypeDeps,
    sortTerms,
} from '../typing/analyze';
import { idFromName, idName, refName } from '../typing/env';
import { binOps, bool } from '../typing/preset';
import {
    EffectRef,
    Env,
    getAllSubTypes,
    Id,
    RecordDef,
    Reference,
    selfEnv,
    Symbol,
    Term,
    Type,
    typesEqual,
} from '../typing/types';
import { typeScriptPrelude } from './fileToTypeScript';
import { walkPattern, walkTerm, wrapWithAssert } from '../typing/transform';
import * as ir from './ir/intermediateRepresentation';
import {
    Exprs,
    optimize,
    optimizeDefine,
    optimizeDefineNew,
} from './ir/optimize/optimize';
import {
    Loc,
    Type as IRType,
    OutputOptions as IOutputOptions,
    Expr,
} from './ir/types';
import { handlersType, handlerSym, typeFromTermType, void_ } from './ir/utils';
import { liftEffects } from './pre-ir/lift-effectful';
import { printToString } from './printer';
import {
    declarationToPretty,
    enumToPretty,
    recordToPretty,
    termToPretty,
} from './printTsLike';
import { optimizeAST } from './typeScriptOptimize';
import {
    printType,
    recordMemberSignature,
    typeIdToString,
    typeToAst,
    typeVblsToParameters,
} from './typeScriptTypePrinter';
import { effectConstructorType } from './ir/cps';
import { getEnumReferences, showLocation } from '../typing/typeExpr';
import { nullLocation } from '../parsing/parser';
import { defaultVisitor, transformExpr } from './ir/transform';
import { uniquesReallyAreUnique } from './ir/analyze';
import { LocatedError } from '../typing/errors';

const reservedSyms = ['default', 'async', 'await'];

const printSym = (env: Env, opts: OutputOptions, sym: Symbol) =>
    !opts.showAllUniques &&
    env.local.localNames[sym.name] === sym.unique &&
    !reservedSyms.includes(sym.name)
        ? sym.name
        : sym.name + '$' + sym.unique;
const printId = (id: Id) => 'hash_' + id.hash; // + '_' + id.pos; TODO recursives

export function withLocation<
    T extends { start: number | null; end: number | null; loc: any }
>(v: T, loc: Loc): T {
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
    readonly discriminant?: string;
    readonly enableTraces?: boolean;
    readonly optimize?: boolean;
    readonly optimizeAggressive?: boolean;
    readonly showAllUniques?: boolean;
};

export const maybeWithComment = <T>(e: T, comment?: string): T => {
    if (comment) {
        // @ts-ignore
        return t.addComment(e, 'leading', comment);
    } else {
        return e;
    }
};

export const withAnnotation = <T>(
    env: Env,
    opts: OutputOptions,
    e: T,
    type: IRType,
): T => {
    if (type == null) {
        console.error(e);
        throw new Error(`no type`);
    }
    return {
        ...e,
        typeAnnotation: t.tsTypeAnnotation(typeToAst(env, opts, type)),
    };
};

export const declarationToTs = (
    env: Env,
    opts: OutputOptions,
    idRaw: string,
    term: ir.Expr,
    comment?: string,
): t.Statement => {
    const expr = termToTs(env, opts, term);
    let res =
        opts.scope == null
            ? t.exportNamedDeclaration(
                  t.variableDeclaration('const', [
                      t.variableDeclarator(
                          withAnnotation(
                              env,
                              opts,
                              t.identifier('hash_' + idRaw),
                              term.is,
                          ),
                          expr,
                      ),
                  ]),
              )
            : t.expressionStatement(
                  t.assignmentExpression(
                      '=',
                      t.memberExpression(
                          t.memberExpression(
                              t.identifier(opts.scope),
                              t.identifier('terms'),
                          ),
                          t.stringLiteral(idRaw),
                          true,
                      ),
                      expr,
                  ),
              );
    if (comment) {
        res = t.addComment(res, 'leading', comment);
    }
    return res;
};

export const termToTs = (
    env: Env,
    opts: OutputOptions,
    term: ir.Expr,
): t.Expression =>
    withAnnotation(
        env,
        opts,
        withLocation(_termToTs(env, opts, term), term.loc),
        term.is,
    );

export const _termToTs = (
    env: Env,
    opts: OutputOptions,
    term: ir.Expr,
): t.Expression => {
    switch (term.type) {
        case 'string':
            return t.stringLiteral(term.value);
        case 'int':
        case 'float':
            return t.numericLiteral(term.value);
        case 'boolean':
            return t.booleanLiteral(term.value);
        case 'lambda':
            term.args.forEach((arg) => {
                if (env.local.localNames[arg.sym.name] == null) {
                    env.local.localNames[arg.sym.name] = arg.sym.unique;
                }
            });
            let res = t.arrowFunctionExpression(
                term.args.map((arg) =>
                    withAnnotation(
                        env,
                        opts,
                        t.identifier(printSym(env, opts, arg.sym)),
                        arg.type,
                    ),
                ),
                lambdaBodyToTs(env, opts, term.body),
            );
            if (term.tags != null) {
                res = t.addComment(
                    res,
                    'leading',
                    ' tags: ' + term.tags.join(', ') + ' ',
                );
            }
            if (term.is.typeVbls.length) {
                return {
                    ...res,
                    typeParameters: typeVblsToParameters(
                        env,
                        opts,
                        term.is.typeVbls,
                    ),
                };
            }
            return res;
        case 'term':
            if (opts.scope) {
                return t.memberExpression(
                    t.memberExpression(
                        t.identifier(opts.scope),
                        t.identifier('terms'),
                    ),
                    t.stringLiteral(term.id.hash),
                    true,
                );
            } else {
                return t.identifier(printId(term.id));
            }
        case 'var':
            return t.identifier(printSym(env, opts, term.sym));
        case 'IsRecord':
            return t.binaryExpression(
                '===',
                t.memberExpression(
                    termToTs(env, opts, term.value),
                    t.identifier(opts.discriminant || 'type'),
                ),
                t.stringLiteral(recordIdName(env, term.ref)),
            );
        case 'apply':
            if (
                term.target.type === 'builtin' &&
                binOps.includes(term.target.name) &&
                term.target.name !== '^' &&
                term.args.length === 2
            ) {
                if (['||', '&&', '??'].includes(term.target.name)) {
                    return t.logicalExpression(
                        // @ts-ignore
                        term.target.name,
                        termToTs(env, opts, term.args[0]),
                        termToTs(env, opts, term.args[1]),
                    );
                }
                return t.binaryExpression(
                    // @ts-ignore
                    term.target.name === '++' ? '+' : term.target.name,
                    termToTs(env, opts, term.args[0]),
                    termToTs(env, opts, term.args[1]),
                    // termToTs(env, opts, term.target),
                    // term.args.map((arg) => termToTs(env, opts, arg)),
                );
            }
            return maybeWithComment(
                t.callExpression(
                    termToTs(env, opts, term.target),
                    term.args.map((arg) => termToTs(env, opts, arg)),
                ),
                term.note,
            );
        case 'tuple':
            return t.arrayExpression(
                term.items.map((item) => termToTs(env, opts, item)),
            );
        case 'array':
            return t.arrayExpression(
                term.items.map((item) =>
                    item.type === 'Spread'
                        ? withLocation(
                              t.spreadElement(termToTs(env, opts, item.value)),
                              item.value.loc,
                          )
                        : termToTs(env, opts, item),
                ),
            );
        case 'arrayIndex':
            return t.memberExpression(
                termToTs(env, opts, term.value),
                termToTs(env, opts, term.idx),
                true,
            );
        case 'arrayLen':
            return t.memberExpression(
                termToTs(env, opts, term.value),
                t.identifier('length'),
            );
        case 'builtin':
            if (opts.scope) {
                return t.memberExpression(
                    t.memberExpression(
                        t.identifier(opts.scope),
                        t.identifier('builtins'),
                    ),
                    t.identifier(term.name === '^' ? 'pow' : term.name),
                );
            } else {
                return t.identifier(term.name === '^' ? 'pow' : term.name);
            }
        case 'effectfulOrDirect':
            return t.memberExpression(
                termToTs(env, opts, term.target),
                t.identifier(term.effectful ? 'effectful' : 'direct'),
            );
        case 'effectfulOrDirectLambda':
            return t.objectExpression([
                t.objectProperty(
                    t.identifier('effectful'),
                    termToTs(env, opts, term.effectful),
                ),
                t.objectProperty(
                    t.identifier('direct'),
                    termToTs(env, opts, term.direct),
                ),
            ]);
        case 'eqLiteral':
            return t.binaryExpression(
                '===',
                termToTs(env, opts, term.value),
                termToTs(env, opts, term.literal),
            );
        case 'handle': {
            // term.hermmmmmm there's different behavior if it's
            // in the direct case ... hmmm ....
            const expr = t.callExpression(
                t.identifier('handleSimpleShallow2'),
                [
                    t.stringLiteral(term.effect.hash),
                    termToTs(env, opts, term.target),
                    t.arrayExpression(
                        term.cases
                            .sort((a, b) => a.constr - b.constr)
                            .map(({ args, k, body }) => {
                                return t.arrowFunctionExpression(
                                    [
                                        t.identifier(
                                            printSym(env, opts, handlerSym),
                                        ),
                                        args.length === 0
                                            ? t.identifier('_')
                                            : args.length === 1
                                            ? withAnnotation(
                                                  env,
                                                  opts,
                                                  t.identifier(
                                                      printSym(
                                                          env,
                                                          opts,
                                                          args[0].sym,
                                                      ),
                                                  ),
                                                  args[0].type,
                                              )
                                            : t.arrayPattern(
                                                  args.map((s) =>
                                                      t.identifier(
                                                          printSym(
                                                              env,
                                                              opts,
                                                              s.sym,
                                                          ),
                                                      ),
                                                  ),
                                              ),
                                        withAnnotation(
                                            env,
                                            opts,
                                            t.identifier(
                                                printSym(env, opts, k.sym),
                                            ),
                                            k.type,
                                        ),
                                    ],
                                    lambdaBodyToTs(env, opts, body),
                                );
                            }),
                    ),
                    t.arrowFunctionExpression(
                        [
                            withAnnotation(
                                env,
                                opts,
                                t.identifier(printSym(env, opts, handlerSym)),
                                handlersType,
                            ),
                            withAnnotation(
                                env,
                                opts,
                                // STOPSHIP: Pure needs the type folks.
                                t.identifier(
                                    printSym(env, opts, term.pure.arg),
                                ),
                                term.pure.argType,
                                // term.target as LambdaType
                            ),
                        ],
                        lambdaBodyToTs(env, opts, term.pure.body),
                    ),
                    ...(term.done
                        ? [t.identifier(printSym(env, opts, handlerSym))]
                        : []),
                ],
            );
            return {
                ...expr,
                typeParameters: t.tsTypeParameterInstantiation([
                    t.tsAnyKeyword(),
                    t.tsAnyKeyword(),
                    t.tsAnyKeyword(),
                    // typeToAst(env, opts, term.is),
                ]),
            };
        }

        case 'raise':
            // TODO: The IR should probably be doing more work here....
            const args: Array<t.Expression> = [
                t.identifier(printSym(env, opts, handlerSym)),
                t.stringLiteral(term.effect.hash),
                t.numericLiteral(term.idx),
            ];
            if (term.args.length === 0) {
                args.push(t.nullLiteral());
            } else if (term.args.length === 1) {
                args.push(termToTs(env, opts, term.args[0]));
            } else {
                args.push(
                    t.arrayExpression(
                        term.args.map((a) => termToTs(env, opts, a)),
                    ),
                );
            }
            args.push(
                t.arrowFunctionExpression(
                    [
                        t.identifier(printSym(env, opts, handlerSym)),
                        t.identifier('value'),
                    ],
                    t.callExpression(termToTs(env, opts, term.done), [
                        t.identifier(printSym(env, opts, handlerSym)),
                        t.identifier('value'),
                    ]),
                ),
            );
            return t.callExpression(scopedGlobal(opts, 'raise'), args);
        case 'record': {
            const result = t.objectExpression(
                ((term.base.spread != null
                    ? [t.spreadElement(termToTs(env, opts, term.base.spread))]
                    : []) as Array<t.ObjectProperty | t.SpreadElement>)
                    .concat(
                        ...Object.keys(term.subTypes).map(
                            (id) =>
                                (term.subTypes[id].spread
                                    ? [
                                          t.spreadElement(
                                              termToTs(
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
                                                  termToTs(env, opts, row),
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
                                                termToTs(env, opts, row),
                                            )
                                          : null,
                                  )
                                  .filter(Boolean) as Array<t.ObjectProperty>)
                            : [],
                    ) as Array<any>,
            );
            // STOPSHIP: What the heck is going on here.
            // When I try to use tsAsExpression
            // Firstly: it ignores the type I try to give it,
            // which is weird.
            // But also, it prints them as invalid syntax.
            // `x as : thetype`
            // I wonder if I upgrade babel or something?
            // Nope, still happening.
            // Ok so its a bug, which is quite annoying.
            // I mean I could post-process the js....
            // ugh so weird.
            // but ` as : ` will never be what I want, right?
            // Ok so that's how I fixed it.

            return t.tsAsExpression(result, typeToAst(env, opts, term.is));
        }
        case 'unary':
            return t.unaryExpression(
                // @ts-ignore
                term.op,
                termToTs(env, opts, term.inner),
                // t.identifier(recordAttributeName(env, term.ref, term.idx)),
            );
        case 'attribute':
            return t.memberExpression(
                termToTs(env, opts, term.target),
                t.identifier(recordAttributeName(env, term.ref, term.idx)),
            );
        case 'tupleAccess':
            return t.memberExpression(
                termToTs(env, opts, term.target),
                t.numericLiteral(term.idx),
                true,
            );
        case 'Trace':
            if (opts.enableTraces) {
                const target = opts.scope
                    ? t.memberExpression(
                          t.identifier(opts.scope),
                          t.identifier('trace'),
                      )
                    : t.identifier('$trace');
                return t.callExpression(target, [
                    // TODO TODO:
                    // refactor `local.self`
                    // and `unique` probably
                    // I really want a "term-level" env,
                    // and a "scope-level" env. So split them up.
                    // and the "term-level" on gets shared between scopes in a term.
                    // yeah.
                    // and then make the `self` better so that it's clear whether
                    // this term has been defined as recursive.
                    // anyway, do I absolutely need this refactor yet?
                    // I could just move the `self` type to be optional, and also
                    // make sure to include the hash explicitly. Right?
                    // ORR also make a PrintingEnv that includes a different `self`.
                    // hmm maybe that's the simplest and most appropriate change.
                    // START HERE PLEASE
                    t.stringLiteral(
                        env.local.self ? env.local.self.name : '[no self]',
                    ),
                    t.numericLiteral(term.idx),
                    ...term.args.map((arg) => termToTs(env, opts, arg)),
                ]);
            } else {
                return termToTs(env, opts, term.args[0]);
            }
        case 'slice': {
            const start = termToTs(env, opts, term.start);
            const end = term.end ? termToTs(env, opts, term.end) : null;
            return t.callExpression(
                t.memberExpression(
                    termToTs(env, opts, term.value),
                    t.identifier('slice'),
                ),
                [start].concat(end ? [end] : []),
            );
        }
        case 'genTerm':
            throw new Error(`No genTerms in typescript yet`);
        default:
            let _v: never = term;
            throw new Error(`Cannot print ${(term as any).type} to TypeScript`);
    }
};

const scopedGlobal = (opts: OutputOptions, id: string) =>
    opts.scope
        ? t.memberExpression(
              t.memberExpression(
                  t.identifier(opts.scope),
                  t.identifier('builtins'),
              ),
              t.identifier(id),
          )
        : t.identifier(id);

export const recordIdName = (env: Env, ref: Reference) => {
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

export const recordAttributeName = (
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
    return `h${idName(ref.id)}_${idx}`;
};

export const stmtToTs = (
    env: Env,
    opts: OutputOptions,
    stmt: ir.Stmt,
): t.Statement => {
    switch (stmt.type) {
        case 'Continue':
            return withLocation(t.continueStatement(), stmt.loc);
        case 'Loop':
            return withLocation(
                t.whileStatement(
                    withLocation(t.booleanLiteral(true), stmt.loc),
                    blockToTs(env, opts, stmt.body),
                ),
                stmt.loc,
            );
        case 'Block':
            return withLocation(
                t.blockStatement(
                    stmt.items.map((stmt) => stmtToTs(env, opts, stmt)),
                ),
                stmt.loc,
            );
        case 'Define':
            if (env.local.localNames[stmt.sym.name] == null) {
                env.local.localNames[stmt.sym.name] = stmt.sym.unique;
            }
            return withLocation(
                t.variableDeclaration('let', [
                    t.variableDeclarator(
                        withAnnotation(
                            env,
                            opts,
                            withLocation(
                                t.identifier(printSym(env, opts, stmt.sym)),
                                stmt.loc,
                            ),
                            stmt.is,
                        ),
                        stmt.value
                            ? termToTs(env, opts, stmt.value)
                            : stmt.fakeInit
                            ? t.tsAsExpression(
                                  t.nullLiteral(),
                                  t.tsAnyKeyword(),
                              )
                            : null,
                    ),
                ]),
                stmt.loc,
            );
        case 'Assign':
            return withLocation(
                t.expressionStatement(
                    t.assignmentExpression(
                        '=',
                        t.identifier(printSym(env, opts, stmt.sym)),
                        termToTs(env, opts, stmt.value),
                    ),
                ),
                stmt.loc,
            );
        case 'Expression':
            return withLocation(
                t.expressionStatement(termToTs(env, opts, stmt.expr)),
                stmt.loc,
            );
        case 'Return':
            return withLocation(
                t.returnStatement(termToTs(env, opts, stmt.value)),
                stmt.loc,
            );
        case 'MatchFail':
            return t.throwStatement(t.stringLiteral(`Math failed`));
        case 'if':
            return withLocation(
                t.ifStatement(
                    termToTs(env, opts, stmt.cond),
                    blockToTs(env, opts, stmt.yes),
                    stmt.no ? blockToTs(env, opts, stmt.no) : null,
                ),
                stmt.loc,
            );
    }
};

export const blockToTs = (
    env: Env,
    opts: OutputOptions,
    term: ir.Block,
): t.BlockStatement =>
    withLocation(
        t.blockStatement(term.items.map((stmt) => stmtToTs(env, opts, stmt))),
        term.loc,
    );

export const lambdaBodyToTs = (
    env: Env,
    opts: OutputOptions,
    term: ir.Expr | ir.Block,
): t.BlockStatement | t.Expression => {
    if (term.type === 'Block') {
        return blockToTs(env, opts, term);
    } else {
        return termToTs(env, opts, term);
    }
};

// const showEffectRef = (env: Env, eff: EffectRef) => {
//     if (eff.type === 'var') {
//         return printSym(env, opts, eff.sym);
//     }
//     return printRef(eff.ref);
// };

const printRef = (ref: Reference) =>
    ref.type === 'builtin' ? ref.name : ref.id.hash;

export const fileToTypescript = (
    expressions: Array<Term>,
    env: Env,
    opts: OutputOptions,
    irOpts: IOutputOptions,
    assert: boolean,
    includeImport: boolean,
    builtinNames: Array<string>,
) => {
    const items = typeScriptPrelude(opts.scope, includeImport, builtinNames);

    Object.keys(env.global.effects).forEach((r) => {
        const id = idFromName(r);
        const constrs = env.global.effects[r];
        items.push(
            t.tsTypeAliasDeclaration(
                t.identifier('handle' + r),
                null,
                t.tsTupleType(
                    constrs.map((constr) =>
                        typeToAst(
                            env,
                            opts,
                            effectConstructorType(
                                env,
                                opts,
                                { type: 'ref', ref: { type: 'user', id } },
                                constr,
                                nullLocation,
                            ),
                        ),
                    ),
                ),
            ),
        );
    });

    const orderedTerms = expressionDeps(
        env,
        expressions.concat(
            Object.keys(env.global.exportedTerms).map((name) => ({
                type: 'ref',
                ref: {
                    type: 'user',
                    id: env.global.exportedTerms[name],
                },
                location: nullLocation,
                is: env.global.terms[idName(env.global.exportedTerms[name])].is,
            })),
        ),
    );

    const allTypes = expressionTypeDeps(
        env,
        orderedTerms.map((t) => env.global.terms[t]),
    );

    allTypes.forEach((r) => {
        const constr = env.global.types[r];
        const id = idFromName(r);
        if (constr.type === 'Enum') {
            const comment = printToString(enumToPretty(env, id, constr), 100);
            const refs = getEnumReferences(env, {
                type: 'ref',
                ref: { type: 'user', id },
                typeVbls: constr.typeVbls.map((t, i) => ({
                    type: 'var',
                    sym: { name: 'T', unique: t.unique },
                    location: null,
                })),
                location: null,
            });
            items.push(
                t.addComment(
                    t.tsTypeAliasDeclaration(
                        t.identifier(typeIdToString(id)),
                        constr.typeVbls.length
                            ? typeVblsToParameters(env, opts, constr.typeVbls)
                            : null,
                        t.tsUnionType(
                            refs.map((ref) =>
                                typeToAst(
                                    env,
                                    opts,
                                    typeFromTermType(env, opts, ref),
                                ),
                            ),
                        ),
                    ),
                    'leading',
                    comment,
                ),
            );
            return;
        }
        const comment = printToString(recordToPretty(env, id, constr), 100);
        const subTypes = getAllSubTypes(env.global, constr);
        items.push(
            t.addComment(
                t.tsTypeAliasDeclaration(
                    t.identifier(typeIdToString(id)),
                    constr.typeVbls.length
                        ? typeVblsToParameters(env, opts, constr.typeVbls)
                        : null,
                    t.tsTypeLiteral([
                        t.tsPropertySignature(
                            t.identifier('type'),
                            t.tsTypeAnnotation(
                                t.tsLiteralType(
                                    t.stringLiteral(
                                        recordIdName(env, { type: 'user', id }),
                                    ),
                                ),
                            ),
                        ),
                        ...constr.items.map((item, i) =>
                            recordMemberSignature(
                                env,
                                opts,
                                id,
                                i,
                                typeFromTermType(env, opts, item),
                            ),
                        ),
                        ...([] as Array<t.TSPropertySignature>).concat(
                            ...subTypes.map((id) =>
                                env.global.types[
                                    idName(id)
                                ].items.map((item: Type, i: number) =>
                                    recordMemberSignature(
                                        env,
                                        opts,
                                        id,
                                        i,
                                        typeFromTermType(env, opts, item),
                                    ),
                                ),
                            ),
                        ),
                    ]),
                ),
                'leading',
                '*\n```\n' + comment + '\n```\n',
            ),
        );
    });

    // const irOpts = {
    // limitExecutionTime: opts.limitExecutionTime,
    // };

    // let unique = { current: 1000000 };
    const irTerms: Exprs = {};

    orderedTerms.forEach((idRaw) => {
        let term = env.global.terms[idRaw];
        // console.log(idRaw, env.global.idNames[idRaw]);

        const id = idFromName(idRaw);
        const senv = selfEnv(env, { type: 'Term', name: idRaw, ann: term.is });
        const comment = printToString(declarationToPretty(senv, id, term), 100);
        senv.local.unique.current = maxUnique(term) + 1;
        term = liftEffects(senv, term);
        // TODO: This is too easy to miss. Bake it in somewhere.
        // Maybe have a toplevel `ir.printTerm` that does the check?
        let irTerm = ir.printTerm(senv, irOpts, term);
        try {
            uniquesReallyAreUnique(irTerm);
        } catch (err) {
            const outer = new LocatedError(
                term.location,
                `Failed while typing ${idRaw} : ${env.global.idNames[idRaw]}`,
            ).wrap(err);
            //     .toString();
            // // console.error( outer);
            // // console.log(showLocation(term.location));
            throw outer;
        }
        // STOPSHIP: Turn this back on
        // if (opts.optimizeAggressive) {
        //     irTerm = optimizeAggressive(senv, irTerms, irTerm, id);
        // }
        if (opts.optimize) {
            irTerm = optimizeDefineNew(senv, irTerm, id, null);
        }
        // then pop over to glslPrinter and start making things work.
        uniquesReallyAreUnique(irTerm);
        // console.log('otho');
        irTerms[idRaw] = { expr: irTerm, inline: false };
        items.push(
            declarationToTs(
                senv,
                opts,
                idRaw,
                irTerm,
                '*\n```\n' + comment + '\n```\n',
            ),
        );
    });

    expressions.forEach((term) => {
        const comment = printToString(termToPretty(env, term), 100);
        if (assert && typesEqual(term.is, bool)) {
            term = wrapWithAssert(term);
        }
        term = liftEffects(env, term);
        const irTerm = ir.printTerm(env, irOpts, term);
        items.push(
            t.addComment(
                t.expressionStatement(
                    termToTs(env, opts, optimize(env, irTerm)),
                ),
                'leading',
                '\n' + comment + '\n',
            ),
        );
    });

    Object.keys(env.global.exportedTerms).forEach((name) => {
        items.push(
            t.exportNamedDeclaration(
                t.variableDeclaration('const', [
                    t.variableDeclarator(
                        t.identifier(name),
                        t.identifier(
                            'hash_' + idName(env.global.exportedTerms[name]),
                        ),
                    ),
                ]),
            ),
        );
    });

    const ast = t.file(t.program(items, [], 'script'));
    // TODO: port all of these to the IR optimizer, so that they work
    // across targets.
    // if (opts.optimize) {
    //     optimizeAST(ast);
    // }
    return ast;
};

export const maxUnique = (term: Term) => {
    let max = 0;
    walkTerm(term, (term) => {
        // hmm this just gets usages
        // which doesn't quite cut it
        if (term.type === 'var') {
            max = Math.max(max, term.sym.unique);
        }
        if (term.type === 'lambda') {
            term.args.forEach((arg) => {
                max = Math.max(max, arg.unique);
            });
        }
        if (term.type === 'Switch') {
            term.cases.forEach((kase) => {
                walkPattern(kase.pattern, (pattern) => {
                    if (pattern.type === 'Binding') {
                        max = Math.max(max, pattern.sym.unique);
                    }
                    if (pattern.type === 'Alias') {
                        max = Math.max(max, pattern.name.unique);
                    }
                });
            });
        }
    });
    return max;
};

export const reUnique = (unique: { current: number }, expr: Expr) => {
    const mapping: { [orig: number]: number } = {};
    const addSym = (sym: Symbol) => {
        if (sym.unique === handlerSym.unique) {
            mapping[sym.unique] = sym.unique;
            return sym;
        }
        mapping[sym.unique] = unique.current++;
        return { ...sym, unique: mapping[sym.unique] };
    };
    const getSym = (sym: Symbol): Symbol => ({
        ...sym,
        unique: mapping[sym.unique],
    });
    return transformExpr(expr, {
        ...defaultVisitor,
        stmt: (value) => {
            if (value.type === 'Define') {
                return { ...value, sym: addSym(value.sym) };
            }
            if (value.type === 'Assign') {
                return { ...value, sym: getSym(value.sym) };
            }
            return null;
        },
        expr: (value) => {
            switch (value.type) {
                case 'handle':
                    return {
                        ...value,
                        cases: value.cases.map((kase) => ({
                            ...kase,
                            args: kase.args.map((arg) => ({
                                ...arg,
                                sym: addSym(arg.sym),
                            })),
                            k: { ...kase.k, sym: addSym(kase.k.sym) },
                        })),
                        pure: { ...value.pure, arg: addSym(value.pure.arg) },
                    };
                case 'lambda':
                    return {
                        ...value,
                        args: value.args.map((arg) => ({
                            ...arg,
                            sym: addSym(arg.sym),
                        })),
                    };
                case 'var':
                    return { ...value, sym: getSym(value.sym) };
            }
            return null;
        },
    });
};
