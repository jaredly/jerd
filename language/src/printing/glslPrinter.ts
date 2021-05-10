// Ok

// import * as t from '@babel/types';
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
import { walkPattern, walkTerm, wrapWithAssert } from '../typing/transform';
import * as ir from './ir/intermediateRepresentation';
import {
    optimize,
    optimizeAggressive,
    optimizeDefine,
} from './ir/optimize/optimize';
import {
    Loc,
    Type as IRType,
    OutputOptions as IOutputOptions,
    Expr,
    Record,
} from './ir/types';
import { handlersType, handlerSym, typeFromTermType, void_ } from './ir/utils';
import { liftEffects } from './pre-ir/lift-effectful';
import { args, atom, block, id, items, PP, printToString } from './printer';
import * as pp from './printer';
import { declarationToPretty, enumToPretty, termToPretty } from './printTsLike';
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
import { maxUnique } from './typeScriptPrinterSimple';

export type OutputOptions = {
    // readonly scope?: string;
    // readonly noTypes?: boolean;
    // readonly limitExecutionTime?: boolean;
    // readonly discriminant?: string;
    // readonly optimize?: boolean;
    // readonly optimizeAggressive?: boolean;
    readonly showAllUniques?: boolean;
};

const builtinTypes: {
    [key: string]: {
        name: string;
        args: Array<{ sub: string | null; idx: number }>;
    };
} = {
    '629a8360': {
        name: 'vec2',
        args: [
            { idx: 0, sub: null },
            { idx: 1, sub: null },
        ],
    },
    '14d8ae44': {
        name: 'vec3',
        args: [
            { idx: 0, sub: '629a8360' },
            { idx: 1, sub: '629a8360' },
            { idx: 0, sub: null },
        ],
    },
    '5026f640': {
        name: 'vec4',
        args: [
            { idx: 0, sub: '629a8360' },
            { idx: 1, sub: '629a8360' },
            { idx: 0, sub: '14d8ae44' },
            { idx: 0, sub: null },
        ],
    },
    '54570db9': {
        name: 'mat4',
        args: [
            { idx: 0, sub: null },
            { idx: 1, sub: null },
            { idx: 2, sub: null },
            { idx: 3, sub: null },
        ],
    },
};

const glslBuiltins = {};

// Ok plan is:
// - produce a js file that `export default`s a map of `termName` to `glsl string`
// - and maybe that's all? then the harness HTML page can use https://github.com/patriciogonzalezvivo/glslCanvas
//   to make pretty pictures.
// - I would love to also validate the GLSL
//   ooh cool lets try https://github.com/alaingalvan/CrossShader
//   so I can catch errors, that would be awesome
// - https://github.com/evanw/glslx might also be interesting

export const idToGlsl = (
    env: Env,
    opts: OutputOptions,
    id: Id,
    isType: boolean,
) => {
    const name = idName(id);
    if (isType && builtinTypes[name] != null) {
        return atom(builtinTypes[name].name);
    }
    const prefix = isType ? 'T' : 'V';
    return atom(prefix + name);
};

export const refToGlsl = (
    env: Env,
    opts: OutputOptions,
    ref: Reference,
    isType: boolean,
) => {
    if (ref.type === 'builtin') {
        return atom(ref.name);
    }
    return idToGlsl(env, opts, ref.id, isType);
};

export const typeToGlsl = (
    env: Env,
    opts: OutputOptions,
    type: ir.Type,
): PP => {
    switch (type.type) {
        case 'ref':
            return refToGlsl(env, opts, type.ref, true);
        default:
            return atom(`invalid_${type.type.replace(/-/g, '_')}`);
    }
};

export const symToGlsl = (env: Env, opts: OutputOptions, sym: Symbol) => {
    return atom(`S${sym.name}_${sym.unique}`);
};

export const declarationToGlsl = (
    env: Env,
    opts: OutputOptions,
    idRaw: string,
    term: Expr,
    comment: string,
): PP => {
    if (term.type === 'lambda') {
        return items([
            atom('/*' + comment + '*/\n'),
            typeToGlsl(env, opts, term.res),
            atom(' '),
            idToGlsl(env, opts, idFromName(idRaw), false),
            args(
                term.args.map((arg) =>
                    items([
                        typeToGlsl(env, opts, arg.type),
                        atom(' '),
                        symToGlsl(env, opts, arg.sym),
                    ]),
                ),
            ),
            atom(' '),
            block(
                term.body.type === 'Block'
                    ? term.body.items.map((item) => stmtToGlsl(env, opts, item))
                    : [
                          stmtToGlsl(env, opts, {
                              type: 'Return',
                              loc: term.body.loc,
                              value: term.body,
                          }),
                      ],
            ),
        ]);
    } else {
        return items([
            atom('const '),
            typeToGlsl(env, opts, term.is),
            atom(' '),
            atom('V' + idRaw),
            atom(' = '),
            termToGlsl(env, opts, term),
        ]);
    }
};

export const stmtToGlsl = (
    env: Env,
    opts: OutputOptions,
    stmt: ir.Stmt,
): PP => {
    switch (stmt.type) {
        case 'Return':
            return items([atom('return '), termToGlsl(env, opts, stmt.value)]);
        default:
            return atom(`nope_stmt_${stmt.type}`);
    }
};

// START HERE:
// - We need to /explicitify/ spreads,
//   *unless* we're spreading between valid
//   subsets, and not overriding anything.
//   But for the first pass, let's just
//   spread everything, and we can add some stuff
//   back in. But yeah, need to do that pass before
//   optimizing other stuff.
export const printRecord = (
    env: Env,
    opts: OutputOptions,
    record: Record,
): PP => {
    if (record.base.type === 'Variable') {
        throw new Error('var record');
    }
    const base = record.base;
    const idRaw = idName(record.base.ref.id);
    if (builtinTypes[idRaw]) {
        console.log(record);
        const spread = record.base.spread;
        let args: Array<ir.Expr> = [];
        if (builtinTypes[idRaw].args.length) {
            args = builtinTypes[idRaw].args.map(
                (arg): ir.Expr => {
                    if (arg.sub) {
                        const item = record.subTypes[arg.sub].rows[arg.idx];
                        if (item) {
                            return item;
                        }
                        const spread = record.subTypes[arg.sub].spread;
                        if (!spread) {
                            throw new Error(
                                `Invalid state: missing record item`,
                            );
                        }
                        return {
                            type: 'tupleAccess',
                            target: spread,
                            idx: arg.idx,
                            loc: record.loc,
                            // STOPSHIP: fix this tho
                            is: void_,
                        };
                    }
                    const item = base.rows[arg.idx];
                    if (item) {
                        return item;
                    }
                    if (!base.spread) {
                        throw new Error(`no spread`);
                    }
                    return {
                        type: 'tupleAccess',
                        target: base.spread,
                        idx: arg.idx,
                        loc: record.loc,
                        // STOPSHIP: fix this tho
                        is: void_,
                    };
                },
            );
        } else {
            throw new Error('nope olksd');
        }
        return items([
            atom(builtinTypes[idRaw].name),
            pp.args(
                args.map((arg) => termToGlsl(env, opts, arg)),
                // record.base.rows.map((row, i) =>
                //     row
                //         ? termToGlsl(env, opts, row)
                //         : spread
                //         ? items([
                //               termToGlsl(env, opts, spread),
                //               atom('['),
                //               atom(i.toString()),
                //               atom(']'),
                //           ])
                //         : atom('no_spread_or_row'),
                // ),
            ),
        ]);
    }
    return atom(`nope_record${idRaw}`);
};

export const termToGlsl = (env: Env, opts: OutputOptions, expr: Expr): PP => {
    switch (expr.type) {
        case 'record':
            return printRecord(env, opts, expr);
        case 'float':
        case 'int':
        case 'string':
            return atom(expr.value.toString());
        case 'var':
            return symToGlsl(env, opts, expr.sym);
        case 'tupleAccess':
            return items([
                termToGlsl(env, opts, expr.target),
                atom('['),
                atom(expr.idx.toString()),
                atom(']'),
            ]);
        // case 'apply':
        default:
            return atom('nope_term_' + expr.type);
    }
    // return atom(`vec4(1.0,0.0,0.0,1.0)`);
    // return atom('nope' + expr.type);
};

export const addComment = (value: PP, comment: string) =>
    items([atom(`/* ${comment} */\n`), value]);

export const fileToGlsl = (
    expressions: Array<Term>,
    env: Env,
    opts: OutputOptions,
    irOpts: IOutputOptions,
    assert: boolean,
    includeImport: boolean,
    builtinNames: Array<string>,
): string => {
    // const items = typeScriptPrelude(opts.scope, includeImport, builtinNames);
    const items: Array<PP> = [
        // pp.items([atom('#version 300 es')]),
        pp.items([atom('precision mediump float;')]),
        pp.items([
            atom('uniform '),
            atom('float'),
            atom(' '),
            atom('u_time'),
            atom(';'),
        ]),
        pp.items([
            atom('uniform '),
            atom('vec2'),
            atom(' '),
            atom('u_resolution'),
            atom(';'),
        ]),
    ];

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
    //                             opts,
    //                             { type: 'ref', ref: { type: 'user', id } },
    //                             constr,
    //                             nullLocation,
    //                         ),
    //                     ),
    //                 ),
    //             ),
    //         ),
    //     );
    // });

    // Object.keys(env.global.types).forEach((r) => {
    //     const constr = env.global.types[r];
    //     const id = idFromName(r);
    //     if (constr.type === 'Enum') {
    //         const comment = printToString(enumToPretty(env, id, constr), 100);
    //         const refs = getEnumReferences(env, {
    //             type: 'ref',
    //             ref: { type: 'user', id },
    //             typeVbls: constr.typeVbls.map((t, i) => ({
    //                 type: 'var',
    //                 sym: { name: 'T', unique: t.unique },
    //                 location: null,
    //             })),
    //             location: null,
    //         });
    //         items.push(
    //             t.addComment(
    //                 t.tsTypeAliasDeclaration(
    //                     t.identifier(typeIdToString(id)),
    //                     constr.typeVbls.length
    //                         ? typeVblsToParameters(env, opts, constr.typeVbls)
    //                         : null,
    //                     t.tsUnionType(
    //                         refs.map((ref) =>
    //                             typeToAst(
    //                                 env,
    //                                 opts,
    //                                 typeFromTermType(env, opts, ref),
    //                             ),
    //                         ),
    //                     ),
    //                 ),
    //                 'leading',
    //                 comment,
    //             ),
    //         );
    //         return;
    //     }
    //     const subTypes = getAllSubTypes(env.global, constr);
    //     items.push(
    //         t.tsTypeAliasDeclaration(
    //             t.identifier(typeIdToString(id)),
    //             constr.typeVbls.length
    //                 ? typeVblsToParameters(env, opts, constr.typeVbls)
    //                 : null,
    //             t.tsTypeLiteral([
    //                 t.tsPropertySignature(
    //                     t.identifier('type'),
    //                     t.tsTypeAnnotation(
    //                         t.tsLiteralType(
    //                             t.stringLiteral(
    //                                 recordIdName(env, { type: 'user', id }),
    //                             ),
    //                         ),
    //                     ),
    //                 ),
    //                 ...constr.items.map((item, i) =>
    //                     recordMemberSignature(
    //                         env,
    //                         opts,
    //                         id,
    //                         i,
    //                         typeFromTermType(env, opts, item),
    //                     ),
    //                 ),
    //                 ...([] as Array<t.TSPropertySignature>).concat(
    //                     ...subTypes.map((id) =>
    //                         env.global.types[
    //                             idName(id)
    //                         ].items.map((item: Type, i: number) =>
    //                             recordMemberSignature(
    //                                 env,
    //                                 opts,
    //                                 id,
    //                                 i,
    //                                 typeFromTermType(env, opts, item),
    //                             ),
    //                         ),
    //                     ),
    //                 ),
    //             ]),
    //         ),
    //     );
    // });

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

    const irTerms: { [idName: string]: Expr } = {};

    orderedTerms.forEach((idRaw) => {
        // TODO: dedup w/ typescript here
        let term = env.global.terms[idRaw];

        const id = idFromName(idRaw);
        const senv = selfEnv(env, { type: 'Term', name: idRaw, ann: term.is });
        const comment = printToString(declarationToPretty(senv, id, term), 100);
        senv.local.unique.current = maxUnique(term) + 1;
        term = liftEffects(senv, term);
        let irTerm = ir.printTerm(senv, irOpts, term);
        try {
            uniquesReallyAreUnique(irTerm);
        } catch (err) {
            const outer = new LocatedError(
                term.location,
                `Failed while typing ${idRaw} : ${env.global.idNames[idRaw]}`,
            ).wrap(err);
            throw outer;
        }
        irTerm = optimizeAggressive(senv, irTerms, irTerm, id);
        irTerm = optimizeDefine(senv, irTerm, id);
        uniquesReallyAreUnique(irTerm);
        irTerms[idRaw] = irTerm;
        items.push(
            declarationToGlsl(
                senv,
                opts,
                // irOpts,
                idRaw,
                irTerm,
                // term.is,
                '*\n```\n' + comment + '\n```\n',
            ),
        );
    });

    // expressions.forEach((term) => {
    //     const comment = printToString(termToPretty(env, term), 100);
    //     if (assert && typesEqual(term.is, bool)) {
    //         term = wrapWithAssert(term);
    //     }
    //     term = liftEffects(env, term);
    //     const irTerm = ir.printTerm(env, irOpts, term);
    //     items.push(
    //         addComment(
    //             termToGlsl(env, opts, optimize(env, irTerm)),
    //             '\n' + comment + '\n',
    //         ),
    //     );
    // });

    Object.keys(env.global.exportedTerms).forEach((name) => {
        const id = env.global.exportedTerms[name];
        items.push(
            pp.items([
                atom('void main() '),
                block([
                    pp.items([
                        atom('gl_FragColor'),
                        atom(' = '),
                        idToGlsl(env, opts, id, false),
                        args([
                            atom('u_time'),
                            atom('gl_FragCoord.xy'),
                            atom('u_resolution'),
                        ]),
                    ]),
                ]),
            ]),
            // t.exportNamedDeclaration(
            //     t.variableDeclaration('const', [
            //         t.variableDeclarator(
            //             t.identifier(name),
            //             t.identifier(
            //                 'hash_' + idName(env.global.exportedTerms[name]),
            //             ),
            //         ),
            //     ]),
            // ),
        );
    });

    // const ast = t.file(t.program(items, [], 'script'));
    // TODO: port all of these to the IR optimizer, so that they work
    // across targets.
    // if (opts.optimize) {
    //     optimizeAST(ast);
    // }
    return items.map((item) => printToString(item, 1000)).join('\n\n');
};
