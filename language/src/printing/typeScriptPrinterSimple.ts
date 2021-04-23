// Ok

import * as t from '@babel/types';
import { expressionDeps, sortTerms } from '../typing/analyze';
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
import { wrapWithAssert } from '../typing/transform';
import * as ir from './ir/intermediateRepresentation';
import { optimize, optimizeDefine } from './ir/optimize';
import { Loc } from './ir/types';
import { handlerSym, typeFromTermType } from './ir/utils';
import { liftEffects } from './pre-ir/lift-effectful';
import { printToString } from './printer';
import { declarationToPretty } from './printTsLike';
import { optimizeAST } from './typeScriptOptimize';
import {
    printType,
    recordMemberSignature,
    typeIdToString,
    typeToAst,
} from './typeScriptPrinter';
import { effectConstructorType } from './ir/cps';

const reservedSyms = ['default', 'async', 'await'];

const printSym = (env: Env, sym: Symbol) =>
    env.local.localNames[sym.name] === sym.unique &&
    !reservedSyms.includes(sym.name)
        ? sym.name
        : sym.name + '$' + sym.unique;
const printId = (id: Id) => 'hash_' + id.hash; // + '_' + id.pos; TODO recursives

function withLocation<
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
    readonly disciminant?: string;
};

export const withAnnotation = <T>(
    env: Env,
    opts: OutputOptions,
    e: T,
    type: Type,
): T => ({
    ...e,
    typeAnnotation: t.tsTypeAnnotation(
        typeToAst(env, opts, typeFromTermType(type)),
    ),
});

export const declarationToTs = (
    env: Env,
    opts: OutputOptions,
    idRaw: string,
    term: ir.Expr,
    type: Type,
    comment?: string,
): t.Statement => {
    const expr = termToTs(env, opts, term);
    let res =
        opts.scope == null
            ? t.variableDeclaration('const', [
                  t.variableDeclarator(
                      withAnnotation(
                          env,
                          opts,
                          t.identifier('hash_' + idRaw),
                          type,
                      ),
                      expr,
                  ),
              ])
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
): t.Expression => withLocation(_termToTs(env, opts, term), term.loc);

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
            return t.arrowFunctionExpression(
                term.args.map((arg) => t.identifier(printSym(env, arg.sym))),
                lambdaBodyToTs(env, opts, term.body),
            );
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
            return t.identifier(printSym(env, term.sym));
        case 'IsRecord':
            return t.binaryExpression(
                '===',
                t.memberExpression(
                    termToTs(env, opts, term.value),
                    t.identifier(opts.disciminant || 'type'),
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
            return t.callExpression(
                termToTs(env, opts, term.target),
                term.args.map((arg) => termToTs(env, opts, arg)),
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
            return t.callExpression(t.identifier('handleSimpleShallow2'), [
                t.stringLiteral(term.effect.hash),
                termToTs(env, opts, term.target),
                t.arrayExpression(
                    term.cases
                        .sort((a, b) => a.constr - b.constr)
                        .map(({ args, k, body }) => {
                            return t.arrowFunctionExpression(
                                [
                                    t.identifier(printSym(env, handlerSym)),
                                    args.length === 0
                                        ? t.identifier('_')
                                        : args.length === 1
                                        ? t.identifier(printSym(env, args[0]))
                                        : t.arrayPattern(
                                              args.map((s) =>
                                                  t.identifier(
                                                      printSym(env, s),
                                                  ),
                                              ),
                                          ),
                                    t.identifier(printSym(env, k)),
                                ],
                                lambdaBodyToTs(env, opts, body),
                            );
                        }),
                ),
                t.arrowFunctionExpression(
                    [
                        t.identifier(printSym(env, handlerSym)),
                        t.identifier(printSym(env, term.pure.arg)),
                    ],
                    lambdaBodyToTs(env, opts, term.pure.body),
                ),
                ...(term.done ? [t.identifier(printSym(env, handlerSym))] : []),
            ]);
        }

        case 'raise':
            // TODO: The IR should probably be doing more work here....
            const args: Array<t.Expression> = [
                t.identifier(printSym(env, handlerSym)),
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
                        t.identifier(printSym(env, handlerSym)),
                        t.identifier('value'),
                    ],
                    t.callExpression(termToTs(env, opts, term.done), [
                        t.identifier(printSym(env, handlerSym)),
                        t.identifier('value'),
                    ]),
                ),
            );
            return t.callExpression(scopedGlobal(opts, 'raise'), args);
        case 'record': {
            return t.objectExpression(
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
        }
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
                        t.identifier(printSym(env, stmt.sym)),
                        stmt.value ? termToTs(env, opts, stmt.value) : null,
                    ),
                ]),
                stmt.loc,
            );
        case 'Assign':
            return withLocation(
                t.expressionStatement(
                    t.assignmentExpression(
                        '=',
                        t.identifier(printSym(env, stmt.sym)),
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

const showEffectRef = (env: Env, eff: EffectRef) => {
    if (eff.type === 'var') {
        return printSym(env, eff.sym);
    }
    return printRef(eff.ref);
};

const printRef = (ref: Reference) =>
    ref.type === 'builtin' ? ref.name : ref.id.hash;

export const fileToTypescript = (
    expressions: Array<Term>,
    env: Env,
    opts: OutputOptions,
    assert: boolean,
    includeImport: boolean,
    builtinNames: Array<string>,
) => {
    const items = typeScriptPrelude(opts.scope, includeImport, builtinNames);

    // Object.keys(env.global.effects).forEach((r) => {
    //     const id = idFromName(r);
    //     const constrs = env.global.effects[r];
    //     items.push(
    //         t.tsTypeAliasDeclaration(
    //             t.identifier('handle' + r),
    //             null,
    //             t.tsTupleType(
    //                 constrs.map((constr) =>
    //                     typeToAst(
    //                         env,
    //                         opts,
    //                         effectConstructorType(
    //                             env,
    //                             { type: 'ref', ref: { type: 'user', id } },
    //                             constr,
    //                         ),
    //                     ),
    //                 ),
    //             ),
    //         ),
    //     );
    // });

    Object.keys(env.global.types).forEach((r) => {
        const constr = env.global.types[r];
        if (constr.type !== 'Record') {
            return;
        }
        const id = idFromName(r);
        const subTypes = getAllSubTypes(env.global, constr);
        items.push(
            t.tsTypeAliasDeclaration(
                t.identifier(typeIdToString(id)),
                constr.typeVbls.length
                    ? t.tsTypeParameterDeclaration(
                          constr.typeVbls.map((td) =>
                              t.tSTypeParameter(null, null, 'T_' + td.unique),
                          ),
                      )
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
                            typeFromTermType(item),
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
                                    typeFromTermType(item),
                                ),
                            ),
                        ),
                    ),
                ]),
            ),
        );
    });

    const orderedTerms = expressionDeps(env, expressions);

    orderedTerms.forEach((idRaw) => {
        let term = env.global.terms[idRaw];

        const id = idFromName(idRaw);
        const senv = selfEnv(env, { type: 'Term', name: idRaw, ann: term.is });
        const comment = printToString(declarationToPretty(senv, id, term), 100);
        term = liftEffects(env, term);
        const irTerm = ir.printTerm(senv, {}, term);
        items.push(
            declarationToTs(
                senv,
                opts,
                idRaw,
                optimizeDefine(env, irTerm, id),
                term.is,
                '\n' + comment + '\n',
            ),
        );
    });

    expressions.forEach((term) => {
        if (assert && typesEqual(term.is, bool)) {
            term = wrapWithAssert(term);
        }
        term = liftEffects(env, term);
        const irTerm = ir.printTerm(env, {}, term);
        items.push(
            t.expressionStatement(termToTs(env, opts, optimize(env, irTerm))),
        );
    });

    const ast = t.file(t.program(items, [], 'script'));
    // TODO: port all of these to the IR optimizer, so that they work
    // across targets.
    optimizeAST(ast);
    return ast;
};
