// Printing Go! I think

import { parse } from '../parsing/grammar';
import { Location, Toplevel } from '../parsing/parser';
import {
    expressionDeps,
    populateTypeDependencyMap,
    sortAllDeps,
    sortAllDepsPlain,
} from '../typing/analyze';
import {
    addDefine,
    addEffect,
    addEnum,
    addExpr,
    addRecord,
    hashObject,
    idFromName,
    idName,
    ToplevelT,
    typeToplevelT,
} from '../typing/env';
import { LocatedError } from '../typing/errors';
import * as preset from '../typing/preset';
import { applyTypeVariablesToRecord } from '../typing/typeExpr';
// import { bool } from '../typing/preset';
import {
    GlobalEnv,
    Env as TermEnv,
    // LocalEnv,
    getAllSubTypes,
    // getAllSubTypes,
    Id,
    idsEqual,
    nullLocation,
    RecordDef as TermRecordDef,
    Reference,
    selfEnv,
    Symbol,
    Term,
    Type,
    typesEqual,
    LocalEnv,
    EnumDef,
    apply,
} from '../typing/types';
import {
    allEnumAttributes,
    assembleItemsForFile,
    debugInferredSize,
    defaultOptimizer,
    Env,
    expressionTypeDeps,
    getAllRecordAttributes,
    makeTermExpr,
    makeZeroValue,
} from './glslPrinter';
// import { GoTester } from './GoTester';
import { getTypeDependencies, uniquesReallyAreUnique } from './ir/analyze';
import * as ir from './ir/intermediateRepresentation';
import { toplevelRecordAttribute } from './ir/optimize/inline';
import {
    Context,
    Exprs,
    // GoOpts,
    isConstant,
    Optimizer,
    Optimizer2,
    optimizeRepeatedly,
    TypeDefs,
} from './ir/optimize/optimize';
import { defaultVisitor, transformExpr } from './ir/transform';
import {
    Apply,
    Expr,
    InferredSize,
    Loc,
    OutputOptions as IOutputOptions,
    Record,
    RecordDef,
    typesEqual as irTypesEqual,
} from './ir/types';
import {
    builtin,
    float,
    hasUndefinedReferences,
    int,
    pureFunction,
    recordDefFromTermType,
    showType,
    typeFromTermType,
    void_,
} from './ir/utils';
import { debugExpr, debugType, debugTypeDef } from './irDebugPrinter';
import { liftEffects } from './pre-ir/lift-effectful';
// import {
//     // GoEnv$1_id,
//     Mat4_id,
//     Vec2_id,
//     Vec3_id,
//     Vec4_id,
// } from './prelude-types';
import * as pp from './printer';
import { args, atom, block, items, PP, printToString } from './printer';
import { declarationToPretty } from './printTsLike';
import { maxUnique, recordAttributeName } from './typeScriptPrinterSimple';
import { allRecordMembers } from './typeScriptTypePrinter';

// Ok now that we have the IR, this will be much different.

export type OutputOptions = {
    // readonly scope?: string;
    // readonly noTypes?: boolean;
    // readonly limitExecutionTime?: boolean;
    // readonly discriminant?: string;
    // readonly optimize?: boolean;
    // readonly optimizeAggressive?: boolean;
    readonly includeCanonicalNames?: boolean;
    readonly showAllUniques?: boolean;
};

export const idNameToGo = (name: string, isType: boolean) => {
    const prefix = isType ? 'T' : 'V';
    return atom(prefix + name);
};

export const idToGo = (
    env: Env,
    opts: OutputOptions,
    id: Id,
    isType: boolean,
) => {
    const idRaw = idName(id);
    // if (isType && builtinTypes[idRaw] != null) {
    //     return atom(builtinTypes[idRaw].name);
    // }
    const readableName = env.global.idNames[idRaw];
    if (opts.includeCanonicalNames && readableName) {
        return atom(readableName + '_' + idRaw);
    }
    return idNameToGo(idRaw, isType);
};

export const enumToGo = (
    env: Env,
    constr: EnumDef,
    opts: OutputOptions,
    irOpts: IOutputOptions,
    id: Id,
) => {
    if (constr.extends.length) {
        throw new Error(`no extends yet`);
    }
    const items = constr.items;

    const allAllItems = allEnumAttributes(env, constr, irOpts);

    return pp.items([
        atom('type '),
        idToGo(env, opts, id, true),
        atom(' struct '),
        block([
            atom(`int tag`),
            ...allAllItems.map(({ id, item, i }) =>
                pp.items([
                    atom(
                        recordAttributeName(
                            env,
                            { type: 'user', id },
                            i,
                            env.typeDefs,
                        ),
                    ),
                    atom(' '),
                    typeToGo(env, opts, item),
                ]),
            ),
            // ...([] as Array<PP>).concat(
            //     ...constr.items.map((tref, i) => {
            //         if (tref.ref.type !== 'user') {
            //             throw new Error(`nope builtin`);
            //         }
            //         const r = env.global.types[
            //             idName(tref.ref.id)
            //         ] as TermRecordDef;
            //         if (r.type !== 'Record') {
            //             throw new Error('nope');
            //         }
            //         return getAllRecordAttributes(
            //             env,
            //             irOpts,
            //             tref.ref.id,
            //             recordDefFromTermType(env, irOpts, r),
            //         ).map(({ id, item, i }) =>
            //         );
            //     }),
            // ),
        ]),
        atom(';'),
    ]);
    // constr.extends
};

export const typeDefToGo = (
    env: Env,
    opts: OutputOptions,
    irOpts: IOutputOptions,
    key: string,
): PP | null => {
    const constr = env.global.types[key];
    const id = idFromName(key);
    if (constr.type === 'Enum') {
        return enumToGo(env, constr, opts, irOpts, id);
        // return atom(
        //     `// skipping ${printToString(
        //         idToGo(env, opts, id, true),
        //         100,
        //     )}, enums not supported`,
        // );
    }
    if (constr.typeVbls.length) {
        // No type vbls allowed sorry
        return atom(
            `// skipping ${printToString(
                idToGo(env, opts, id, true),
                1000,
            )}, contains type variables`,
        );
    }
    if (!constr.items.length) {
        return null;
    }
    // if (builtinTypes[key]) {
    //     return null;
    // }
    const irConstr = recordDefFromTermType(env, irOpts, constr);
    return items([
        atom(
            `/* ${printToString(
                debugTypeDef(env, id, irConstr, env.typeDefs),
                100,
            )} */\n`,
        ),
        recordToGo(env, irConstr, opts, irOpts, id),
    ]);
};

export const recordToGo = (
    env: Env,
    constr: RecordDef,
    opts: OutputOptions,
    irOpts: IOutputOptions,
    id: Id,
) => {
    const subTypes = getAllSubTypes(env.global, constr.extends);

    return pp.items([
        atom('type '),
        idToGo(env, opts, id, true),
        atom(' struct '),
        block([
            ...getAllRecordAttributes(
                env,
                irOpts,
                id,
                constr,
            ).map(({ i, item, id }) =>
                pp.items([
                    atom(
                        recordAttributeName(
                            env,
                            { type: 'user', id },
                            i,
                            env.typeDefs,
                        ),
                    ),
                    atom(' '),
                    typeToGo(env, opts, item),
                ]),
            ),
        ]),
        atom(';'),
    ]);
};

export const refToGo = (
    env: Env,
    opts: OutputOptions,
    ref: Reference,
    isType: boolean,
) => {
    if (ref.type === 'builtin') {
        return atom(ref.name);
    }
    return idToGo(env, opts, ref.id, isType);
};

export const symToGo = (env: Env, opts: OutputOptions, sym: Symbol) => {
    // return atom(`${sym.name}_${sym.unique}`);
    return atom(printSym(env, opts, sym));
};

const reservedSyms = ['const', 'sample'];

const printSym = (env: Env, opts: OutputOptions, sym: Symbol) =>
    !opts.showAllUniques &&
    env.local.localNames[sym.name] === sym.unique &&
    !reservedSyms.includes(sym.name)
        ? sym.name
        : // TODO: Need to fix this to ensure we have
          // hygene
          sym.name + '_' + sym.unique;

export const typeToGo = (env: Env, opts: OutputOptions, type: ir.Type): PP => {
    switch (type.type) {
        case 'ref':
            if (type.typeVbls.length) {
                return items([
                    refToGo(env, opts, type.ref, true),
                    args(
                        type.typeVbls.map((t) => typeToGo(env, opts, t)),
                        '[',
                        ']',
                    ),
                ]);
            }
            return refToGo(env, opts, type.ref, true);
        case 'var':
            // return atom(JSON.stringify(type));
            return items([atom('invalid_var:'), symToGo(env, opts, type.sym)]);
        case 'Array':
            if (type.inferredSize === null) {
                return items([
                    atom('[]'),
                    typeToGo(env, opts, type.inner),
                    // atom('['),
                    // atom('NULL'),
                    // atom(']'),
                ]);
            }
            if (type.inferredSize.type === 'exactly') {
                return items([
                    atom('['),
                    atom(type.inferredSize.size.toString()),
                    atom(']'),
                    typeToGo(env, opts, type.inner),
                ]);
            }
            return items([
                atom('['),
                debugInferredSize(env, opts, type.inferredSize),
                atom(']'),
                typeToGo(env, opts, type.inner),
            ]);
        default:
            return atom(`invalid_${type.type.replace(/-/g, '_')}`);
    }
};

/**

// Expressions
//
//



*/

const builtinTypes: {
    [key: string]: {
        name: string;
        args: Array<{ sub: string | null; idx: number }>;
    };
} = {};

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
        let args: Array<ir.Expr> = [];
        if (!builtinTypes[idRaw].args.length) {
            throw new Error('nope custom record atm');
        }
        args = builtinTypes[idRaw].args.map(
            (arg): ir.Expr => {
                if (arg.sub) {
                    const item = record.subTypes[arg.sub].rows[arg.idx];
                    if (item) {
                        return item;
                    }
                    // const spread = findSpreadForSub(record, arg.sub)
                    const spread =
                        record.subTypes[arg.sub].spread || record.base.spread;
                    // OOOOOH BUG BUG
                    // Turns out we need spreads to be ordered
                    // because if we spread multiple things
                    // that have some overlap
                    // then we have a consistency error
                    // Ok so yeah need to walk through spreads
                    // Seeing if any of them will provide the thing I'm missing.
                    if (!spread) {
                        console.log(record.base);
                        throw new LocatedError(
                            record.loc,
                            `Invalid state: missing spread for record item ${idRaw} ${arg.sub} ${arg.idx}`,
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
        return items([
            atom(builtinTypes[idRaw].name),
            pp.args(
                args.map((arg) => termToGo(env, opts, arg)),
                '{',
                '}',
                false,
            ),
        ]);
    }
    // hmm so I need a canonical ordering for these items
    // if (record.subTypes)
    // return atom(`nope_record${idRaw}`);
    if (record.base.spread) {
        throw new Error(`Unexpected spread`);
    }
    const args = record.base.rows.map((row) => {
        if (!row) {
            throw new Error(`empty row for record`);
        }
        return termToGo(env, opts, row);
    });
    if (Object.keys(record.subTypes).length) {
        throw new Error(`subtypes not yet supported`);
    }

    return items([
        idToGo(env, opts, idFromName(idRaw), true),
        pp.args(args, '{', '}', false),
    ]);
};

export const termToGo = (env: Env, opts: OutputOptions, expr: Expr): PP => {
    switch (expr.type) {
        case 'record':
            return printRecord(env, opts, expr);
        case 'term':
            return idToGo(env, opts, expr.id, false);
        case 'genTerm':
            return idNameToGo(expr.id, false);
        case 'unary':
            return items([atom(expr.op), termToGo(env, opts, expr.inner)]);
        case 'float':
            return atom(expr.value.toFixed(5).replace(/0+$/, '0'));
        case 'boolean':
            return atom(expr.value + '');
        case 'int':
            return atom(expr.value.toString());
        case 'string':
            return atom(JSON.stringify(expr.value.toString()));
        case 'var':
            return symToGo(env, opts, expr.sym);
        case 'apply':
            return printApply(env, opts, expr);
        case 'builtin':
            // fixup ln vs log
            if (expr.name === 'ln') {
                return atom('log');
            }
            if (expr.name === 'atan2') {
                return atom('atan');
            }
            return atom(expr.name);
        case 'attribute':
            // hrm special-case matrices I guess
            // unless ... I pretend that `mat4` is just `Tuple<Vec4, Vec4, Vec4, Vec4>`?
            // That would be ideal actually....
            // TODO: Please refactor this!
            // if (ir.typesEqual(expr.target.is, Mat4)) {
            //     return items([
            //         termToGo(env, opts, expr.target),
            //         atom('['),
            //         atom(expr.idx.toString()),
            //         atom(']'),
            //     ]);
            // }
            const target =
                expr.target.type === 'SpecializeEnum'
                    ? expr.target.inner
                    : expr.target;
            return items([
                termToGo(env, opts, target),
                atom('.'),
                atom(
                    recordAttributeName(env, expr.ref, expr.idx, env.typeDefs),
                ),
            ]);
        case 'tuple': {
            // hrmmm
            // ok, turn tuples into something else.
            // and then tuple access turns into normal record access and stuff
            return atom('tuples_not_supported');
        }
        case 'tupleAccess':
            return items([
                termToGo(env, opts, expr.target),
                atom('['),
                atom(expr.idx.toString()),
                atom(']'),
            ]);
        case 'lambda':
            expr.args.forEach((arg) => {
                if (env.local.localNames[arg.sym.name] == null) {
                    env.local.localNames[arg.sym.name] = arg.sym.unique;
                }
            });
            return items([
                atom('lambda-woops'),
                args(expr.args.map((arg) => symToGo(env, opts, arg.sym))),
                stmtToGo(env, opts, expr.body),
            ]);
        case 'eqLiteral':
            return items([
                termToGo(env, opts, expr.value),
                atom(' == '),
                termToGo(env, opts, expr.literal),
            ]);
        // Traces aren't supported in glsl, they just pass through.
        case 'Trace':
            return termToGo(env, opts, expr.args[0]);
        case 'IsRecord': {
            if (
                expr.value.is.type !== 'ref' ||
                expr.value.is.ref.type !== 'user'
            ) {
                throw new Error(`isRecord only for user refs`);
            }
            const constr = env.global.types[idName(expr.value.is.ref.id)];
            if (constr.type !== 'Enum') {
                throw new Error(`expected enum`);
            }
            if (constr.extends.length) {
                throw new Error(`extends enum not supported`);
            }
            const idNames = constr.items.map((i) => idName(i.ref.id));
            const idx = idNames.indexOf(idName(expr.ref.id));
            if (idx === -1) {
                throw new Error(`isRecord but record isnt in enum`);
            }
            return items([
                termToGo(env, opts, expr.value),
                atom('.tag'),
                atom(' == '),
                atom(`${idx}`),
            ]);
        }
        case 'SpecializeEnum': {
            if (expr.is.ref.type === 'builtin') {
                throw new Error('nope folks');
            }
            const constr = env.global.types[idName(expr.is.ref.id)];
            if (constr.type === 'Record') {
                const attrs = allRecordMembers(env, expr.is.ref.id);
                return items([
                    idToGo(env, opts, expr.is.ref.id, true),
                    args(
                        attrs.map(({ id, item, i }) =>
                            termToGo(env, opts, {
                                type: 'attribute',
                                target: expr.inner,
                                // STOPSHIP: pass opts here
                                is: typeFromTermType(env, {}, item),
                                loc: expr.loc,
                                ref: { type: 'user', id },
                                refTypeVbls: [],
                                idx: i,
                            }),
                        ),
                    ),
                ]);
            } else {
                throw new Error('NOT IMPL');
            }
        }
        case 'Enum': {
            if (expr.is.ref.type === 'builtin') {
                throw new Error(`no builtin enums`);
            }
            const constr = env.global.types[idName(expr.is.ref.id)] as EnumDef;
            if (constr.type !== 'Enum') {
                throw new Error(`Not an enum`);
            }
            const attrs = allEnumAttributes(env, constr, {});
            // We're upgrading to an enum.
            if (
                expr.inner.type === 'record' &&
                expr.inner.base.type === 'Concrete' &&
                expr.inner.is.type === 'ref' &&
                expr.inner.is.ref.type === 'user'
            ) {
                const idNames = constr.items.map((i) => idName(i.ref.id));
                const idx = idNames.indexOf(idName(expr.inner.is.ref.id));
                if (idx === -1) {
                    throw new Error(`isRecord but record isnt in enum`);
                }

                const iid = expr.inner.is.ref.id;
                const name = idToGo(env, opts, expr.is.ref.id, true);
                const rows = expr.inner.base.rows;
                return items([
                    name,
                    args(
                        [atom(idx.toString())].concat(
                            attrs.map(({ i, id, item }) =>
                                termToGo(
                                    env,
                                    opts,
                                    idsEqual(id, iid)
                                        ? rows[i]!
                                        : // STOPSHIP: irOpts here????
                                          makeZeroValue(
                                              env,
                                              {},
                                              item,
                                              expr.loc,
                                          ),
                                ),
                            ),
                        ),
                    ),
                ]);
            } else if (
                expr.inner.type === 'var' ||
                expr.inner.type === 'term'
            ) {
                if (
                    expr.inner.is.type !== 'ref' ||
                    expr.inner.is.ref.type !== 'user'
                ) {
                    throw new Error(`Not a user erf`);
                }
                const idNames = constr.items.map((i) => idName(i.ref.id));
                const idx = idNames.indexOf(idName(expr.inner.is.ref.id));
                if (idx === -1) {
                    throw new Error(`isRecord but record isnt in enum`);
                }

                const iid = expr.inner.is.ref.id;
                const name = idToGo(env, opts, expr.is.ref.id, true);
                return items([
                    name,
                    args(
                        [atom(idx.toString())].concat(
                            attrs.map(({ i, id, item }) =>
                                termToGo(
                                    env,
                                    opts,
                                    idsEqual(id, iid)
                                        ? {
                                              type: 'attribute',
                                              target: expr.inner,
                                              ref: { type: 'user', id },
                                              refTypeVbls: [],
                                              idx: i,
                                              loc: expr.inner.loc,
                                              is: item,
                                          }
                                        : // STOPSHIP: irOpts here????
                                          makeZeroValue(
                                              env,
                                              {},
                                              item,
                                              expr.loc,
                                          ),
                                ),
                            ),
                        ),
                    ),
                ]);
            } else {
                return atom('nope_enum_upgrade');
            }
        }
        case 'array':
            const elems = expr.items.filter(
                (s) => s.type !== 'Spread',
            ) as Array<Expr>;
            if (elems.length < expr.items.length) {
                if (
                    expr.items[0].type === 'Spread' &&
                    elems.length === expr.items.length - 1
                ) {
                    return items([
                        atom('append'),
                        args(
                            [expr.items[0].value]
                                .concat(expr.items.slice(1) as Array<Expr>)
                                .map((item) => termToGo(env, opts, item)),
                        ),
                    ]);
                }
                return items([
                    atom('ArrayWithSpreads'),
                    args(
                        [atom(JSON.stringify(expr.is.inferredSize))],
                        '<',
                        '>',
                    ),
                    args(
                        expr.items.map((i) =>
                            i.type === 'Spread'
                                ? items([
                                      atom('...'),
                                      termToGo(env, opts, i.value),
                                  ])
                                : termToGo(env, opts, i),
                        ),
                        '[',
                        ']',
                    ),
                ]);
                // throw new Error(`Array spread not supported in glsl`);
            }
            return items([
                atom('[]'),
                typeToGo(env, opts, expr.is.inner),
                args(
                    elems.map((item) => termToGo(env, opts, item)),
                    '{',
                    '}',
                ),
            ]);
        case 'arrayIndex':
            return items([
                termToGo(env, opts, expr.value),
                atom('['),
                termToGo(env, opts, expr.idx),
                atom(']'),
            ]);
        case 'arrayLen':
            // if (
            //     expr.value.is.type === 'Array' &&
            //     expr.value.is.inferredSize &&
            //     expr.value.is.inferredSize.type === 'exactly'
            // ) {
            //     return atom(expr.value.is.inferredSize.size.toString());
            // }
            return items([termToGo(env, opts, expr.value), atom('.length()')]);
        default:
            return atom('nope_term_' + expr.type);
    }
    // return atom(`vec4(1.0,0.0,0.0,1.0)`);
    // return atom('nope' + expr.type);
};

export const declarationToGo = (
    env: Env,
    opts: OutputOptions,
    idRaw: string,
    term: Expr,
    comment: string | null,
): PP => {
    if (term.type === 'lambda') {
        return items([
            comment ? atom('/*' + comment + '*/\n') : null,
            term.note
                ? atom(`/* ${term.note} */\n`)
                : items([atom('/* '), debugExpr(env, term), atom(' */\n')]),
            atom('func'),
            atom(' '),
            idToGo(env, opts, idFromName(idRaw), false),
            term.is.typeVbls.length
                ? args(
                      term.is.typeVbls.map((t) =>
                          atom(t.name ? t.name : `T${t.unique}`),
                      ),
                      '<',
                      '>',
                  )
                : null,
            args(
                term.args.map((arg) =>
                    items([
                        symToGo(env, opts, arg.sym),
                        atom(' '),
                        typeToGo(env, opts, arg.type),
                    ]),
                ),
                '(',
                ')',
                false,
            ),
            atom(' '),
            irTypesEqual(term.res, void_)
                ? null
                : typeToGo(env, opts, term.res),
            atom(' '),
            block(term.body.items.map((item) => stmtToGo(env, opts, item))),
        ]);
    } else {
        // if (!isBuiltin(term.is) || isLiteral(term)) {
        //     fail it folks
        // }
        return addComment(
            items([
                items([atom('/*'), debugExpr(env, term), atom('*/')]),
                atom('const '),
                typeToGo(env, opts, term.is),
                atom(' '),
                idToGo(env, opts, idFromName(idRaw), false),
                // atom('V' + idRaw),
                atom(' = '),
                termToGo(env, opts, term),
                atom(';'),
            ]),
            comment,
        );
    }
};

export const addComment = (value: PP, comment: string | null) =>
    comment ? items([atom(`/* ${comment} */\n`), value]) : value;

export const stmtToGo = (env: Env, opts: OutputOptions, stmt: ir.Stmt): PP => {
    switch (stmt.type) {
        case 'Loop':
            if (stmt.bounds) {
                return items([
                    atom('for '),
                    items([
                        atom('(; '),
                        symToGo(env, opts, stmt.bounds.sym),
                        atom(' '),
                        atom(stmt.bounds.op),
                        atom(' '),
                        termToGo(env, opts, stmt.bounds.end),
                        atom('; '),
                        stmtToGo(env, opts, {
                            type: 'Assign',
                            sym: stmt.bounds.sym,
                            is: int,
                            loc: stmt.loc,
                            value: stmt.bounds.step,
                        }),
                        // symToGo(env, opts, stmt.bounds.sym),
                        // atom(' = '),
                        // termToGo(env, opts, stmt.bounds.step),
                        atom(')'),
                    ]),
                    atom(' '),
                    stmtToGo(env, opts, stmt.body),
                ]);
            }
            return items([
                atom('for '),
                atom('(int i=0; i<10000; i++) '),
                stmtToGo(env, opts, stmt.body),
            ]);
        // return items([
        //     atom('while '),
        //     atom('(true) '),
        //     stmtToGo(env, opts, stmt.body),
        // ]);
        case 'Continue':
            return atom('continue');
        case 'Break':
            return atom('break');
        case 'if':
            return items([
                atom('if ('),
                termToGo(env, opts, stmt.cond),
                atom(') '),
                stmtToGo(env, opts, stmt.yes),
                ...(stmt.no
                    ? [atom(' else '), stmtToGo(env, opts, stmt.no)]
                    : []),
            ]);
        case 'Block':
            return block(stmt.items.map((s) => stmtToGo(env, opts, s)));
        case 'Return':
            if (irTypesEqual(stmt.value.is, void_)) {
                return items([
                    termToGo(env, opts, stmt.value),
                    atom('\n'),
                    atom('return'),
                ]);
            }
            return items([atom('return '), termToGo(env, opts, stmt.value)]);
        case 'Define':
            if (env.local.localNames[stmt.sym.name] == null) {
                env.local.localNames[stmt.sym.name] = stmt.sym.unique;
            }
            if (!stmt.value) {
                return items([
                    typeToGo(env, opts, stmt.is),
                    atom(' '),
                    symToGo(env, opts, stmt.sym),
                ]);
            }
            return items([
                typeToGo(env, opts, stmt.is),
                atom(' '),
                symToGo(env, opts, stmt.sym),
                atom(' = '),
                termToGo(env, opts, stmt.value),
            ]);
        case 'Assign': {
            if (
                stmt.value.type === 'apply' &&
                stmt.value.target.type === 'builtin' &&
                ['+', '-'].includes(stmt.value.target.name) &&
                stmt.value.args.length === 2 &&
                stmt.value.args[0].type === 'var' &&
                stmt.value.args[0].sym.unique === stmt.sym.unique
            ) {
                const op = stmt.value.target.name;
                if (
                    stmt.value.args[1].type === 'int' &&
                    stmt.value.args[1].value === 1
                ) {
                    return items([
                        symToGo(env, opts, stmt.sym),
                        atom(`${op}${op}`),
                    ]);
                }
                return items([
                    symToGo(env, opts, stmt.sym),
                    atom(` ${op}= `),
                    termToGo(env, opts, stmt.value.args[1]),
                ]);
            }

            return items([
                symToGo(env, opts, stmt.sym),
                atom(' = '),
                termToGo(env, opts, stmt.value),
            ]);
        }
        case 'MatchFail':
            return atom('// match fail');
        case 'Expression':
            return termToGo(env, opts, stmt.expr);
        // return atom('// no-op expression');
        case 'ArraySet':
            return items([
                symToGo(env, opts, stmt.sym),
                atom('['),
                termToGo(env, opts, stmt.idx),
                atom('] = '),
                termToGo(env, opts, stmt.value),
            ]);
        default:
            const _x: never = stmt;
            return atom(`nope_stmt_${(_x as any).type}`);
    }
};

export const binops = [
    // 'mod',
    'modInt',
    '>',
    '<',
    '>=',
    '<=',
    '+',
    '-',
    '/',
    '*',
    '==',
    '|',
    '||',
    '&&',
    '^',
];
export const isBinop = (op: string) => binops.includes(op);

// op === 'mod' ||
const asBinop = (op: string) => (op === 'modInt' ? '%' : op);

export const printApply = (env: Env, opts: OutputOptions, apply: Apply): PP => {
    if (apply.target.type === 'builtin' && isBinop(apply.target.name)) {
        if (apply.args.length === 1) {
            return items([
                atom(apply.target.name),
                termToGo(env, opts, apply.args[0]),
            ]);
        }
        if (apply.args.length !== 2) {
            throw new LocatedError(
                apply.loc,
                `Call to binop ${apply.target.name} needs 2 args, not ${apply.args.length}`,
            );
        }
        return items([
            atom('('),
            termToGo(env, opts, apply.args[0]),
            atom(' '),
            atom(asBinop(apply.target.name)),
            atom(' '),
            termToGo(env, opts, apply.args[1]),
            atom(')'),
        ]);
    }
    return items([
        termToGo(env, opts, apply.target),
        args(
            apply.args.map((arg) => termToGo(env, opts, arg)),
            '(',
            ')',
            false,
        ),
    ]);
};

export const fileToGo = (
    expressions: Array<Term>,
    tenv: TermEnv,
    assert: boolean,
) => {
    const env: Env = { ...tenv, typeDefs: {} };
    const items: Array<PP> = []; // shaderTop(bufferCount);
    const opts: OutputOptions = {};
    const irOpts: IOutputOptions = {};
    const includeComments = true;

    const mainTerm: Term = {
        type: 'lambda',
        args: [],
        body: {
            type: 'sequence',
            is: preset.void_,
            location: nullLocation,
            sts: expressions.map((expr) =>
                apply(
                    preset.builtin(
                        'fmt.Printf',
                        preset.pureFunction(
                            [preset.string, preset.string],
                            preset.void_,
                        ),
                        nullLocation,
                    ),
                    [preset.stringLiteral('%#v\n', nullLocation), expr],
                    nullLocation,
                ),
            ),
        },
        idLocations: [],
        is: {
            type: 'lambda',
            args: [],
            res: preset.void_,
            effectVbls: [],
            effects: [],
            location: nullLocation,
            rest: null,
            typeVbls: [],
        },
        location: nullLocation,
    };

    const mainHash = hashObject(mainTerm);
    env.global.terms[mainHash] = mainTerm;
    env.global.idNames[mainHash] = `main`;
    // return idFromName(hash);

    // const expressionIds: Array<Id> = expressions.map((term, i) => {
    //     const hash = hashObject(term);
    //     env.global.terms[hash] = term;
    //     env.global.idNames[hash] = `toplevel_${i}`;
    //     return idFromName(hash);
    // });

    const { inOrder, irTerms } = assembleItemsForFile(
        env,
        [makeTermExpr(idFromName(mainHash), env)],
        [mainHash],
        {},
        {},
        defaultOptimizer,
    );

    const allTypes = expressionTypeDeps(
        env,
        inOrder
            .map((t) => (irTerms[t] ? irTerms[t].expr : null))
            .filter(Boolean) as Array<Expr>,
    );

    allTypes.forEach((r) => {
        if (env.global.types[r]) {
            const printed = typeDefToGo(env, opts, irOpts, r);
            if (printed) {
                items.push(printed);
            }
        } else if (env.typeDefs[r]) {
            const printed = recordToGo(
                env,
                env.typeDefs[r].typeDef,
                opts,
                irOpts,
                idFromName(r),
            );
            items.push(printed);
        }
    });

    const invalidLocs: Array<Location> = [];

    inOrder.forEach((name) => {
        // const loc = hasInvalidGLSL(irTerms[name].expr, name);
        // if (loc) {
        //     invalidLocs.push(loc);
        // }

        const senv = env.global.terms[name]
            ? selfEnv(env, {
                  type: 'Term',
                  name,
                  ann: env.global.terms[name].is,
              })
            : env;
        items.push(
            declarationToGo(
                // Empty out the localNames
                // { ...senv, local: { ...senv.local, localNames: {} } },
                { ...senv, typeDefs: env.typeDefs },
                opts,
                name,
                irTerms[name].expr,
                includeComments
                    ? irTerms[name].comment
                        ? '*\n```\n' + irTerms[name].comment + '\n```\n'
                        : ' -- generated -- '
                    : null,
            ),
        );
    });
    // console.log('MAIN IR', irTerms[idName(mainTerm)]);
    return pp.items(
        [atom('import (\n"fmt"\n)\n')].concat(
            items.concat([atom(`\nfunc main() { V${mainHash}(); }`)]),
        ),
    );
    //, mainType: irTerms[idName(mainTerm)].expr.is };
};
