// Ok

// import * as t from '@babel/types';
import { Location } from '../parsing/parser';
import {
    expressionDeps,
    expressionTypeDeps,
    sortAllDepsPlain,
} from '../typing/analyze';
import { idFromName, idName } from '../typing/env';
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
} from '../typing/types';
import { glslTester } from './glslTester';
import { uniquesReallyAreUnique } from './ir/analyze';
import * as ir from './ir/intermediateRepresentation';
import { toplevelRecordAttribute } from './ir/optimize/inline';
import {
    Context,
    Exprs,
    glslOpts,
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
    Loc,
    OutputOptions as IOutputOptions,
    Record,
    RecordDef,
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
import { debugExpr } from './irDebugPrinter';
import { liftEffects } from './pre-ir/lift-effectful';
import * as pp from './printer';
import { args, atom, block, items, PP, printToString } from './printer';
import { declarationToPretty } from './printTsLike';
import { maxUnique, recordAttributeName } from './typeScriptPrinterSimple';

export type Env = TermEnv & {
    typeDefs: TypeDefs;
};

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

const builtinTypes: {
    [key: string]: {
        name: string;
        args: Array<{ sub: string | null; idx: number }>;
    };
} = {
    '43802a16': {
        name: 'vec2',
        args: [
            { idx: 0, sub: null },
            { idx: 1, sub: null },
        ],
    },
    '9f1c0644': {
        name: 'vec3',
        args: [
            { idx: 0, sub: '43802a16' },
            { idx: 1, sub: '43802a16' },
            { idx: 0, sub: null },
        ],
    },
    '3b941378': {
        name: 'vec4',
        args: [
            { idx: 0, sub: '43802a16' },
            { idx: 1, sub: '43802a16' },
            { idx: 0, sub: '9f1c0644' },
            { idx: 0, sub: null },
        ],
    },
    d92781e8: {
        name: 'mat4',
        args: [
            { idx: 0, sub: null },
            { idx: 1, sub: null },
            { idx: 2, sub: null },
            { idx: 3, sub: null },
        ],
    },
};

const refType = (idRaw: string): ir.Type => ({
    type: 'ref',
    ref: {
        type: 'user',
        id: idFromName(idRaw),
    },
    typeVbls: [],
    loc: nullLocation,
});

const Vec2: ir.Type = refType('629a8360');
const Vec3: ir.Type = refType('14d8ae44');
const Vec4: ir.Type = refType('5026f640');
const Mat4: ir.Type = refType('d92781e8');

const record = (idRaw: string, rows: Array<Expr>): Expr => {
    return {
        type: 'record',
        base: {
            type: 'Concrete',
            ref: { type: 'user', id: idFromName(idRaw) },
            spread: null,
            rows: rows,
        },
        subTypes: {},
        loc: nullLocation,
        is: refType(idRaw),
    };
};

const builtinVal = (name: string, type: ir.Type): Expr => ({
    type: 'builtin',
    name: name,
    loc: nullLocation,
    is: type,
});

/*
Ok how we do want to do this override?
One way is: replace the hash (e.g. )

*/
const glslBuiltins: { [key: string]: Expr } = {
    '6f186ad1': record('As', [builtinVal('float', pureFunction([int], float))]),
    '184a69ed': record('As', [builtinVal('int', pureFunction([float], int))]),
};

// Ok plan is:
// - produce a js file that `export default`s a map of `termName` to `glsl string`
// - and maybe that's all? then the harness HTML page can use https://github.com/patriciogonzalezvivo/glslCanvas
//   to make pretty pictures.
// - I would love to also validate the GLSL
//   ooh cool lets try https://github.com/alaingalvan/CrossShader
//   so I can catch errors, that would be awesome
// - https://github.com/evanw/glslx might also be interesting

export const idNameToGlsl = (name: string, isType: boolean) => {
    const prefix = isType ? 'T' : 'V';
    return atom(prefix + name);
};

export const idToGlsl = (
    env: Env,
    opts: OutputOptions,
    id: Id,
    isType: boolean,
) => {
    const idRaw = idName(id);
    if (isType && builtinTypes[idRaw] != null) {
        return atom(builtinTypes[idRaw].name);
    }
    const readableName = env.global.idNames[idRaw];
    if (opts.includeCanonicalNames && readableName) {
        return atom(readableName + '_' + idRaw);
    }
    return idNameToGlsl(idRaw, isType);
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
            if (type.typeVbls.length) {
                return items([
                    refToGlsl(env, opts, type.ref, true),
                    args(
                        type.typeVbls.map((t) => typeToGlsl(env, opts, t)),
                        '[',
                        ']',
                    ),
                ]);
            }
            return refToGlsl(env, opts, type.ref, true);
        case 'var':
            // return atom(JSON.stringify(type));
            return atom(`invalid_var_${symToGlsl(env, opts, type.sym)}`);
        default:
            return atom(`invalid_${type.type.replace(/-/g, '_')}`);
    }
};

export const symToGlsl = (env: Env, opts: OutputOptions, sym: Symbol) => {
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

export const declarationToGlsl = (
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
                : items([atom('/*'), debugExpr(env, term), atom('*/')]),
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
                '(',
                ')',
                false,
            ),
            atom(' '),
            block(term.body.items.map((item) => stmtToGlsl(env, opts, item))),
        ]);
    } else {
        // if (!isBuiltin(term.is) || isLiteral(term)) {
        //     fail it folks
        // }
        return addComment(
            items([
                items([atom('/*'), debugExpr(env, term), atom('*/')]),
                atom('const '),
                typeToGlsl(env, opts, term.is),
                atom(' '),
                idToGlsl(env, opts, idFromName(idRaw), false),
                // atom('V' + idRaw),
                atom(' = '),
                termToGlsl(env, opts, term),
                atom(';'),
            ]),
            comment,
        );
    }
};

export const stmtToGlsl = (
    env: Env,
    opts: OutputOptions,
    stmt: ir.Stmt,
): PP => {
    switch (stmt.type) {
        case 'Loop':
            if (stmt.bounds) {
                return items([
                    atom('for '),
                    items([
                        atom('(; '),
                        symToGlsl(env, opts, stmt.bounds.sym),
                        atom(' '),
                        atom(stmt.bounds.op),
                        atom(' '),
                        termToGlsl(env, opts, stmt.bounds.end),
                        atom('; '),
                        symToGlsl(env, opts, stmt.bounds.sym),
                        atom(' = '),
                        termToGlsl(env, opts, stmt.bounds.step),
                        atom(')'),
                    ]),
                    atom(' '),
                    stmtToGlsl(env, opts, stmt.body),
                ]);
            }
            return items([
                atom('for '),
                atom('(int i=0; i<10000; i++) '),
                stmtToGlsl(env, opts, stmt.body),
            ]);
        // return items([
        //     atom('while '),
        //     atom('(true) '),
        //     stmtToGlsl(env, opts, stmt.body),
        // ]);
        case 'Continue':
            return atom('continue');
        case 'Break':
            return atom('break');
        case 'if':
            return items([
                atom('if ('),
                termToGlsl(env, opts, stmt.cond),
                atom(') '),
                stmtToGlsl(env, opts, stmt.yes),
                ...(stmt.no
                    ? [atom(' else '), stmtToGlsl(env, opts, stmt.no)]
                    : []),
            ]);
        case 'Block':
            return block(stmt.items.map((s) => stmtToGlsl(env, opts, s)));
        case 'Return':
            return items([atom('return '), termToGlsl(env, opts, stmt.value)]);
        case 'Define':
            if (env.local.localNames[stmt.sym.name] == null) {
                env.local.localNames[stmt.sym.name] = stmt.sym.unique;
            }
            if (!stmt.value) {
                return items([
                    typeToGlsl(env, opts, stmt.is),
                    atom(' '),
                    symToGlsl(env, opts, stmt.sym),
                ]);
            }
            return items([
                typeToGlsl(env, opts, stmt.is),
                atom(' '),
                symToGlsl(env, opts, stmt.sym),
                atom(' = '),
                termToGlsl(env, opts, stmt.value),
            ]);
        case 'Assign':
            return items([
                symToGlsl(env, opts, stmt.sym),
                atom(' = '),
                termToGlsl(env, opts, stmt.value),
            ]);
        case 'MatchFail':
            return atom('// match fail');
        default:
            return atom(`nope_stmt_${stmt.type}`);
    }
};

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
                args.map((arg) => termToGlsl(env, opts, arg)),
                '(',
                ')',
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
        return termToGlsl(env, opts, row);
    });
    if (Object.keys(record.subTypes).length) {
        throw new Error(`subtypes not yet supported`);
    }

    return items([
        idToGlsl(env, opts, idFromName(idRaw), true),
        pp.args(args, '(', ')', false),
    ]);
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
                termToGlsl(env, opts, apply.args[0]),
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
            termToGlsl(env, opts, apply.args[0]),
            atom(' '),
            atom(asBinop(apply.target.name)),
            atom(' '),
            termToGlsl(env, opts, apply.args[1]),
            atom(')'),
        ]);
    }
    return items([
        termToGlsl(env, opts, apply.target),
        args(
            apply.args.map((arg) => termToGlsl(env, opts, arg)),
            '(',
            ')',
            false,
        ),
    ]);
};

export const termToGlsl = (env: Env, opts: OutputOptions, expr: Expr): PP => {
    switch (expr.type) {
        case 'record':
            return printRecord(env, opts, expr);
        case 'term':
            return idToGlsl(env, opts, expr.id, false);
        case 'genTerm':
            return idNameToGlsl(expr.id, false);
        case 'unary':
            return items([atom(expr.op), termToGlsl(env, opts, expr.inner)]);
        case 'float':
            return atom(expr.value.toFixed(5).replace(/0+$/, '0'));
        case 'boolean':
            return atom(expr.value + '');
        case 'int':
        case 'string':
            return atom(expr.value.toString());
        case 'var':
            return symToGlsl(env, opts, expr.sym);
        case 'apply':
            return printApply(env, opts, expr);
        case 'builtin':
            // fixup ln vs log
            if (expr.name === 'ln') {
                return atom('log');
            }
            return atom(expr.name);
        case 'attribute':
            // hrm special-case matrices I guess
            // unless ... I pretend that `mat4` is just `Tuple<Vec4, Vec4, Vec4, Vec4>`?
            // That would be ideal actually....
            // TODO: Please refactor this!
            if (ir.typesEqual(expr.target.is, Mat4)) {
                return items([
                    termToGlsl(env, opts, expr.target),
                    atom('['),
                    atom(expr.idx.toString()),
                    atom(']'),
                ]);
            }
            return items([
                termToGlsl(env, opts, expr.target),
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
                termToGlsl(env, opts, expr.target),
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
                args(expr.args.map((arg) => symToGlsl(env, opts, arg.sym))),
                stmtToGlsl(env, opts, expr.body),
            ]);
        case 'eqLiteral':
            return items([
                termToGlsl(env, opts, expr.value),
                atom(' == '),
                termToGlsl(env, opts, expr.literal),
            ]);
        // Traces aren't supported in glsl, they just pass through.
        case 'Trace':
            return termToGlsl(env, opts, expr.args[0]);
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
                termToGlsl(env, opts, expr.value),
                atom('.tag'),
                atom(' == '),
                atom(`${idx}`),
            ]);
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
                const name = idToGlsl(env, opts, expr.is.ref.id, true);
                const rows = expr.inner.base.rows;
                return items([
                    name,
                    args(
                        [atom(idx.toString())].concat(
                            attrs.map(({ i, id, item }) =>
                                termToGlsl(
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
                // This is a 'constant', so we can just do things
                return atom('nope_enum_varterm');
            } else {
                return atom('nope_enum_upgrade');
            }
        }
        default:
            return atom('nope_term_' + expr.type);
    }
    // return atom(`vec4(1.0,0.0,0.0,1.0)`);
    // return atom('nope' + expr.type);
};

export const makeZeroValue = (
    env: TermEnv,
    opts: IOutputOptions,
    item: ir.Type,
    loc: Location,
): ir.Expr => {
    switch (item.type) {
        case 'var':
            throw new Error(`STOPSHIP can't zero value a var`);
        case 'ref':
            if (item.ref.type === 'builtin') {
                switch (item.ref.name) {
                    case 'float':
                        return { type: 'float', loc, is: float, value: 0 };
                    case 'int':
                        return { type: 'int', loc, is: int, value: 0 };
                }
            } else {
                const constr = env.global.types[idName(item.ref.id)];
                if (constr.type === 'Enum') {
                    const id = typeFromTermType(env, opts, constr.items[0]);
                    return {
                        type: 'Enum',
                        is: item,
                        loc,
                        inner: makeZeroValue(env, opts, id, loc),
                    };
                }
                if (constr.extends.length) {
                    throw new Error('STOPSHIP extends');
                }
                return {
                    type: 'record',
                    is: item,
                    loc,
                    subTypes: {},
                    base: {
                        type: 'Concrete',
                        ref: item.ref,
                        spread: null,
                        rows: constr.items.map((t) =>
                            makeZeroValue(
                                env,
                                opts,
                                typeFromTermType(env, opts, t),
                                loc,
                            ),
                        ),
                    },
                };
            }
    }
    throw new Error(`Can't make zero value for ${showType(env, item)}`);
};

export const addComment = (value: PP, comment: string | null) =>
    comment ? items([atom(`/* ${comment} */\n`), value]) : value;

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

const maybeAddRecordInlines = (irTerms: Exprs, id: Id, irTerm: ir.Expr) => {
    if (irTerm.type === 'record' && irTerm.base.type === 'Concrete') {
        if (builtinTypes[idName(irTerm.base.ref.id)]) {
            return irTerm;
        }
        const base = irTerm.base;
        const rows: Array<Expr | null> = irTerm.base.rows.map((item, i) => {
            if (!item) {
                return item;
            }
            if (isConstant(item) && item.type !== 'builtin') {
                return item;
            }
            const name = toplevelRecordAttribute(id, base.ref, i);
            irTerms[name] = {
                expr: item,
                inline: item.type !== 'lambda',
            };

            return {
                type: 'genTerm',
                loc: item.loc,
                is: item.is,
                id: name,
            };
        });
        return { ...irTerm, base: { ...irTerm.base, rows } };
    }
    return irTerm;
};

// export const defaultOptimizer: Optimizer2 = (ctx: Context, expr: Expr) => {
//     // irTerm = explicitSpreads(senv, irOpts, irTerm);
//     // irTerm = optimizeAggressive(senv, irTerms, irTerm, id);
//     // irTerm = optimizeDefineNew(senv, irTerm, id, irTerms);
//     const opt = optimizeRepeatedly(glslOpts);
//     // irTerm = optimizeAggressive(senv, irTerms, irTerm, id);
//     return opt({ ...ctx, optimize: opt }, expr);
// };

export const defaultOptimizer: Optimizer2 = optimizeRepeatedly(glslOpts);

export const assembleItemsForFile = (
    env: Env,
    required: Array<Term>,
    requiredIds: Array<string>,
    irOpts: IOutputOptions,
    builtins: { [key: string]: ir.Expr },
    optimization = defaultOptimizer,
) => {
    const orderedTerms = expressionDeps(env, required);

    // TODO: do this for the post-processed IRTerms
    // const allTypes = expressionTypeDeps(
    //     env,
    //     orderedTerms.map((t) => env.global.terms[t]),
    // );

    const irTerms: Exprs = {};
    // const typeDefs: TypeDefs = {};
    // const printed: { [id: string]: PP } = {};

    orderedTerms.forEach((idRaw) => {
        const id = idFromName(idRaw);
        let term = env.global.terms[idRaw];
        const senv = selfEnv(env, { type: 'Term', name: idRaw, ann: term.is });

        // // Don't output anything that I'm overriding with builtins
        if (builtins[idRaw]) {
            let irTerm = builtins[idRaw];

            irTerm = maybeAddRecordInlines(irTerms, id, irTerm);

            irTerms[idRaw] = { expr: irTerm, inline: true };
            return;
        }

        const comment = printToString(declarationToPretty(senv, id, term), 100);
        senv.local.unique.current = maxUnique(term) + 1;
        term = liftEffects(senv, term);
        let irTerm = ir.printTerm(senv, irOpts, term);
        try {
            const undefinedUses = uniquesReallyAreUnique(irTerm);
            if (undefinedUses.length > 0) {
                throw new Error(`Undefined var!`);
            }
        } catch (err) {
            const outer = new LocatedError(
                term.location,
                `Failed while typing ${idRaw} : ${env.global.idNames[idRaw]}`,
            ).wrap(err);
            throw outer;
        }
        // irTerm = explicitSpreads(senv, irOpts, irTerm);
        // irTerm = optimizeDefine(senv, irTerm, id, irTerms);
        irTerm = optimization(
            {
                env: senv,
                opts: irOpts,
                exprs: irTerms,
                id,
                types: env.typeDefs,
                optimize: optimization,
            },
            irTerm,
        );

        irTerm = maybeAddRecordInlines(irTerms, id, irTerm);

        try {
            const undefinedUses = uniquesReallyAreUnique(irTerm);
            if (undefinedUses.length > 0) {
                throw new Error(`Undefined var!`);
            }
        } catch (err) {
            const outer = new LocatedError(
                term.location,
                `Failed while typing ${idRaw} : ${env.global.idNames[idRaw]}`,
            ).wrap(err);
            throw outer;
        }

        const unrefs = hasUndefinedReferences(irTerm);
        // if (unrefs.length) {
        //     throw new Error(`bad news bears`);
        // }

        const shouldInline =
            !['bool', 'float', 'int', 'ref', 'lambda'].includes(irTerm.type) ||
            // If it's a function that returns a function, we must inline
            (irTerm.is.type === 'lambda' && irTerm.is.res.type === 'lambda');
        irTerms[idRaw] = { expr: irTerm, inline: shouldInline, comment };
    });

    const usedAfterOpt: { [key: string]: true } = {};
    const toWalk = requiredIds.slice();
    const irDeps: { [key: string]: Array<string> } = {};
    while (toWalk.length) {
        const next = toWalk.shift();
        if (!next) {
            break;
        }
        // already processed
        if (usedAfterOpt[next]) {
            continue;
        }
        usedAfterOpt[next] = true;
        const deps: { [key: string]: true } = {};
        if (!irTerms[next]) {
            throw new Error(`Not found in irTerms: ${next}`);
        }
        transformExpr(irTerms[next].expr, {
            ...defaultVisitor,
            expr: (expr) => {
                if (expr.type === 'term') {
                    const raw = idName(expr.id);
                    // Recursion, ignore
                    if (raw === next) {
                        return null;
                    }
                    deps[raw] = true;
                    toWalk.push(raw);
                }
                if (expr.type === 'genTerm') {
                    // Recursion, ignore
                    if (expr.id === next) {
                        return null;
                    }
                    deps[expr.id] = true;
                    toWalk.push(expr.id);
                }
                return null;
            },
        });
        irDeps[next] = Object.keys(deps);
    }

    const inOrder = sortAllDepsPlain(irDeps).filter((id) => usedAfterOpt[id]);

    // const extraIdNames: { [id: string]: string } = {};
    inOrder.forEach((id) => {
        if (irTerms[id].source) {
            env.global.idNames[id] = `${
                env.global.idNames[idName(irTerms[id].source!.id)]
            }_${irTerms[id].source!.kind}`;
        }
    });
    // const envWithNames = {
    //     ...env,
    //     global: {
    //         ...env.global,
    //         idNames: { ...env.global.idNames, ...extraIdNames },
    //     },
    // };

    return { inOrder, irTerms };
};

export const GLSLEnvId = idFromName('451d5252');

const makeEnvRecord = (env: Env, id: Id, mainType?: ir.Type): Record => {
    let arg0: ir.Type | null = null;
    if (mainType) {
        if (mainType.type !== 'lambda') {
            throw new Error(`not lambda`);
        }
        arg0 = mainType.args[0];
    } else {
        const t = env.global.terms[idName(id)];
        if (t.is.type !== 'lambda') {
            throw new Error(`Main fn not a lambda`);
        }
        arg0 = typeFromTermType(env, {}, t.is.args[0]);
    }
    if (arg0.type !== 'ref' || arg0.ref.type === 'builtin') {
        throw new Error(`Unexpected arg 0 for main fn`);
    }
    if (idsEqual(arg0.ref.id, GLSLEnvId)) {
        return {
            type: 'record',
            base: {
                type: 'Concrete',
                ref: { type: 'user', id: GLSLEnvId },
                spread: null,
                rows: [
                    builtin('u_time', nullLocation, float),
                    builtin('u_resolution', nullLocation, Vec2),
                    builtin('u_camera', nullLocation, Vec3),
                    builtin('u_mouse', nullLocation, Vec2),
                ],
            },
            is: {
                type: 'ref',
                ref: { type: 'user', id: GLSLEnvId },
                loc: nullLocation,
                typeVbls: [],
            },
            subTypes: {},
            loc: nullLocation,
        };
        // assume it's a monomorphized version of GLSLEnv<T>
    } else {
        return {
            type: 'record',
            base: {
                type: 'Concrete',
                ref: { type: 'user', id: arg0.ref.id },
                spread: null,
                rows: [
                    builtin('u_state', nullLocation, void_), // TODO: do we need the real one here?
                    builtin('u_time', nullLocation, float),
                    builtin('u_resolution', nullLocation, Vec2),
                    builtin('u_camera', nullLocation, Vec3),
                    builtin('u_mouse', nullLocation, Vec2),
                    builtin('u_mousebutton', nullLocation, int),
                ],
            },
            is: {
                type: 'ref',
                ref: { type: 'user', id: GLSLEnvId },
                loc: nullLocation,
                typeVbls: [],
            },
            subTypes: {},
            loc: nullLocation,
        };
    }
};

const shaderTop = (buffers: number) => {
    const b: Array<PP> = [];
    for (let i = 0; i < buffers; i++) {
        b.push(atom(`uniform sampler2D u_buffer${i};`));
    }
    return [
        pp.items([atom('#version 300 es')]),
        pp.items([atom('precision mediump float;')]),
        pp.items([atom('out vec4 fragColor;')]),
        pp.items([atom('const float PI = 3.14159;')]),
        // atom('uniform sampler2D u_buffer0;'),
        ...b,
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
            atom('u_mouse'),
            atom(';'),
        ]),
        pp.atom('uniform int u_mousebutton;'),
        pp.items([
            atom('uniform '),
            atom('vec3'),
            atom(' '),
            atom('u_camera'),
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
};

export const typeDefToGLSL = (
    env: Env,
    opts: OutputOptions,
    irOpts: IOutputOptions,
    key: string,
): PP | null => {
    const constr = env.global.types[key];
    const id = idFromName(key);
    if (constr.type === 'Enum') {
        return enumToGLSL(env, constr, opts, irOpts, id);
        // return atom(
        //     `// skipping ${printToString(
        //         idToGlsl(env, opts, id, true),
        //         100,
        //     )}, enums not supported`,
        // );
    }
    if (constr.typeVbls.length) {
        // No type vbls allowed sorry
        return atom(
            `// skipping ${printToString(
                idToGlsl(env, opts, id, true),
                100,
            )}, contains type variables`,
        );
        return null;
    }
    if (!constr.items.length) {
        return null;
    }
    if (builtinTypes[key]) {
        return null;
    }
    return recordToGLSL(
        env,
        recordDefFromTermType(env, irOpts, constr),
        opts,
        irOpts,
        id,
    );
};

export const allEnumAttributes = (
    env: TermEnv,
    constr: EnumDef,
    opts: IOutputOptions,
) => {
    // TODO: Dedup! If there are duplicates, things will break
    return ([] as Array<RecordAttribute>).concat(
        ...constr.items.map((tref, i) => {
            if (tref.ref.type !== 'user') {
                throw new Error(`nope builtin`);
            }
            let r = env.global.types[idName(tref.ref.id)] as TermRecordDef;

            if (r.type !== 'Record') {
                throw new Error('nope');
            }

            if (tref.typeVbls.length) {
                r = applyTypeVariablesToRecord(
                    env,
                    r,
                    tref.typeVbls,
                    tref.location,
                    tref.ref.id.hash,
                );
            }

            return getAllRecordAttributes(
                env,
                opts,
                tref.ref.id,
                recordDefFromTermType(env, opts, r),
            );
        }),
    );
};

export const enumToGLSL = (
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
        atom('struct '),
        idToGlsl(env, opts, id, true),
        block([
            atom(`int tag`),
            ...allAllItems.map(({ id, item, i }) =>
                pp.items([
                    typeToGlsl(env, opts, item),
                    atom(' '),
                    atom(
                        recordAttributeName(
                            env,
                            { type: 'user', id },
                            i,
                            env.typeDefs,
                        ),
                    ),
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

type RecordAttribute = { item: ir.Type; i: number; id: Id };
const getAllRecordAttributes = (
    env: TermEnv,
    opts: IOutputOptions,
    id: Id,
    constr: RecordDef,
): Array<RecordAttribute> => {
    const subTypes = getAllSubTypes(env.global, constr.extends);
    return [
        ...constr.items.map((item, i) => ({ id, item, i })),
        ...([] as Array<RecordAttribute>).concat(
            ...subTypes.map((id) =>
                env.global.types[idName(id)].items.map(
                    (item: Type, i: number) => ({
                        id,
                        item: typeFromTermType(env, opts, item),
                        i,
                    }),
                ),
            ),
        ),
    ];
};

export const recordToGLSL = (
    env: Env,
    constr: RecordDef,
    opts: OutputOptions,
    irOpts: IOutputOptions,
    id: Id,
) => {
    const subTypes = getAllSubTypes(env.global, constr.extends);

    return pp.items([
        atom('struct '),
        idToGlsl(env, opts, id, true),
        block([
            ...getAllRecordAttributes(
                env,
                irOpts,
                id,
                constr,
            ).map(({ i, item, id }) =>
                pp.items([
                    typeToGlsl(env, opts, item),
                    atom(' '),
                    atom(
                        recordAttributeName(
                            env,
                            { type: 'user', id },
                            i,
                            env.typeDefs,
                        ),
                    ),
                ]),
            ),
        ]),
        atom(';'),
    ]);
};

export const populateBuiltins = (env: TermEnv) => {
    const builtins = { ...glslBuiltins };
    Object.keys(env.global.metaData).forEach((idRaw) => {
        const tags = env.global.metaData[idRaw].tags;
        if (tags.includes('glsl_builtin')) {
            const term = env.global.terms[idRaw];
            if (term.is.type === 'lambda') {
                const name = env.global.idNames[idRaw];
                builtins[idRaw] = builtin(
                    name,
                    term.location,
                    typeFromTermType(env, {}, term.is),
                );
            } else if (
                term.type === 'Record' &&
                term.base.type === 'Concrete'
            ) {
                // throw new Error('aa');
                const refId = idName(term.base.ref.id);
                const decl = env.global.types[refId] as TermRecordDef;
                const names = env.global.recordGroups[refId];
                builtins[idRaw] = record(
                    refId,
                    decl.items.map((type, i) =>
                        builtin(
                            names[i],
                            term.location,
                            typeFromTermType(env, {}, type),
                        ),
                    ),
                );
            }
        }
    });

    return builtins;
};

export const makeTermExpr = (id: Id, env: TermEnv): Term => ({
    type: 'ref',
    ref: {
        type: 'user',
        id,
    },
    location: nullLocation,
    is: env.global.terms[idName(id)].is,
});

export const shaderAllButMains = (
    env: Env,
    opts: OutputOptions,
    irOpts: IOutputOptions,
    mainTerm: Id,
    buffers: Array<Id>,
    includeComments = true,
    bufferCount = buffers.length,
    optimizer = defaultOptimizer,
    stateUniform?: Reference,
): { items: Array<PP>; invalidLocs: Array<Location>; mainType: ir.Type } => {
    const items: Array<PP> = shaderTop(bufferCount);

    const required = [mainTerm]
        .concat(buffers)
        .map((id) => makeTermExpr(id, env));

    const builtins = populateBuiltins(env);

    const { inOrder, irTerms } = assembleItemsForFile(
        env,
        required,
        [mainTerm].concat(buffers).map(idName),
        irOpts,
        builtins,
        optimizer,
    );

    const allTypes = expressionTypeDeps(
        env,
        inOrder.map((t) => env.global.terms[t]).filter(Boolean),
    );

    allTypes.forEach((r) => {
        const printed = typeDefToGLSL(env, opts, irOpts, r);
        if (printed) {
            items.push(printed);
        } else {
            // console.log('NO', r);
        }
    });
    Object.keys(env.typeDefs).forEach((id) => {
        const printed = recordToGLSL(
            env,
            env.typeDefs[id].typeDef,
            opts,
            irOpts,
            idFromName(id),
        );
        items.push(printed);
        // typeDefToGLSL(env, opts, irOpts, typeDefs[id].typeDef);
    });

    if (stateUniform) {
        items.push(
            atom(
                `uniform ${printToString(
                    refToGlsl(env, opts, stateUniform, true),
                    100,
                )} u_state;`,
            ),
        );
    }

    const invalidLocs: Array<Location> = [];

    inOrder.forEach((name) => {
        const loc = hasInvalidGLSL(irTerms[name].expr);
        if (loc) {
            invalidLocs.push(loc);
        }

        const senv = env.global.terms[name]
            ? selfEnv(env, {
                  type: 'Term',
                  name,
                  ann: env.global.terms[name].is,
              })
            : env;
        items.push(
            declarationToGlsl(
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
    return { items, invalidLocs, mainType: irTerms[idName(mainTerm)].expr.is };
};

// This will generate a single shader, which might be used
// for writing to a texture buffer, or writing to the screen.
export const generateSingleShader = (
    termEnv: TermEnv,
    opts: OutputOptions,
    irOpts: IOutputOptions,
    mainTerm: Id,
    buffers: number,
    includeComments = true,
    optimizer = defaultOptimizer,
    stateUniform?: Reference,
): { text: string; invalidLocs: Array<Location> } => {
    const env: Env = { ...termEnv, typeDefs: {} };
    const { items, invalidLocs, mainType } = shaderAllButMains(
        env,
        opts,
        irOpts,
        mainTerm,
        [],
        includeComments,
        buffers,
        optimizer,
        stateUniform,
    );

    // console.log('main', mainTerm);
    items.push(glslMain(env, opts, mainTerm, buffers, mainType));

    return {
        invalidLocs,
        text: items.map((item) => printToString(item, 100)).join('\n\n'),
    };
};

// This is for generating a shader with #if defined(BUFFER0)
// preprocessor lines, which the vscode glslCanvas extension
// expects.
export const generateShader = (
    env: Env,
    opts: OutputOptions,
    irOpts: IOutputOptions,
    mainTerm: Id,
    buffers: Array<Id>,
): { text: string; invalidLocs: Array<Location> } => {
    const { items, invalidLocs } = shaderAllButMains(
        env,
        opts,
        irOpts,
        mainTerm,
        buffers,
    );

    if (buffers.length > 1) {
        throw new Error('multi buffer not impl');
    }
    if (buffers.length) {
        items.push(atom('#if defined(BUFFER_0)'));
        items.push(glslMain(env, opts, buffers[0], buffers.length));
        items.push(atom('#else'));
    }

    items.push(glslMain(env, opts, mainTerm, buffers.length));

    if (buffers.length) {
        items.push(atom('#endif\n'));
    }

    return {
        invalidLocs,
        text: items.map((item) => printToString(item, 100)).join('\n\n'),
    };
};

const glslMain = (
    env: Env,
    opts: OutputOptions,
    id: Id,
    numBuffers: number,
    mainType?: ir.Type,
) => {
    const glslEnv = makeEnvRecord(env, id, mainType);
    let mainArgs = [termToGlsl(env, opts, glslEnv), atom('gl_FragCoord.xy')];
    for (let i = 0; i < numBuffers; i++) {
        mainArgs.push(atom(`u_buffer${i}`));
    }
    return pp.items([
        atom('void main() '),
        block([
            pp.items([
                atom('fragColor'),
                atom(' = '),
                idToGlsl(env, opts, id, false),
                args(mainArgs, '(', ')', false),
            ]),
        ]),
    ]);
};

export const fileToGlsl = (
    expressions: Array<Term>,
    env: TermEnv,
    opts: OutputOptions,
    irOpts: IOutputOptions,
    assert: boolean,
    includeImport: boolean,
    builtinNames: Array<string>,
): { text: string; invalidLocs: Array<Location> } => {
    const buffers: Array<string> = [];
    Object.keys(env.global.metaData).forEach((k) => {
        const b = env.global.metaData[k].tags.filter((t) =>
            t.startsWith('buffer'),
        );
        if (!b.length) {
            return;
        }
        if (b.length > 1) {
            throw new Error(`multiple buffer tags`);
        }
        const num = parseInt(b[0].slice('buffer'.length));
        if (isNaN(num)) {
            throw new Error(`Invalid buffer tag ${b[0]}`);
        }
        buffers[num] = k;
    });
    for (let i = 0; i < buffers.length; i++) {
        if (!buffers[i]) {
            throw new Error(
                `No buffer ${i} defined. Must have all buffers in a row.`,
            );
        }
    }

    let mains = Object.keys(env.global.metaData).filter((k) =>
        env.global.metaData[k].tags.includes('main'),
    );
    if (mains.length > 1) {
        console.warn(`Only one main allowed; ignoring the others`);
    }

    // If there's no main, then:
    // We generate one that does the test cases!
    // green and red dots to indicate pass or fail

    if (!mains.length) {
        // Ok what's the wait to manufactor a main for us ...
        const tests = expressions.filter((e) => typesEqual(e.is, preset.bool));
        if (tests.length) {
            // env.local.unique.current = 1000000;
            mains = ['test_main'];
            env.global.terms['test_main'] = glslTester(env, tests);
            env.global.metaData[mains[0]] = {
                tags: ['main'],
                createdMs: Date.now(),
            };
        } else {
            console.error(`No @main or tests defined!`);
            return {
                text: '// Error: No @main or tests defined',
                invalidLocs: [],
            };
        }
    }

    const mainId = idFromName(mains[0]);
    const mainTerm: Term = {
        type: 'ref',
        ref: {
            type: 'user',
            id: mainId,
        },
        location: nullLocation,
        is: env.global.terms[idName(mainId)].is,
    };

    // What kinds of things do we want on here?
    // - @inline stuff, got to inline it
    // - things that take a lambda, might have to inline it or specialize it
    // - hmm how do I distinquish. Maybe "have a list of things to always inline,
    //   and then some things that you might want to inline, if the lambda uses in-scope variables?"

    // const irTerms: Exprs = {};

    // const irEnv: {
    //     inline: {
    //         [idName: string]: {
    //             expr: Expr;
    //             // in the one case, you always inline
    //             // in the other case, you only inline
    //             mode: 'always' | 'closure';
    //         };
    //     };
    //     // These are specializations of a function
    //     specialized: {};
    // } = { inline: {}, specialized: {} };
    // let irEnv: {
    //     terms: {
    //         // sooo we have ""
    //         [idName: string]: Expr;
    //     };
    //     // for constant records
    //     // maybe we don't need to track this separately?
    //     // We just know that records can be inlined...
    //     // records: {
    //     //     [idName: string]: Array<Expr>,
    //     // }
    // };

    // So I'm again wondering if there's a way, at the type level,
    // to express whether a term will be valid GLSL.
    // And I'm thinking about Koka's effects, where one of them is
    // "Diverges" (e.g. might not halt)
    // BUT some of this stuff doesn't come into play until IR-generation
    // time.
    // Although I guess I could verify it when typing stuff
    // I would just have to nail down IR options.
    // Anyway
    // Yeah, so I could have a pseudo-effect called "uses heap"
    // for things that require a dynamic array (as opposed to a fixed one)
    // or call a function that allocates
    // hmm, like what would be allocated?
    // ok, so Roc only allocates for things that don't have a fixed size
    // e.g. Lists, Dicts, recursive data types, and Str
    // Yeah, so I could have a `alloc` trait? Or something
    // What was the other pseudo-effect I wanted? "ffi"? though
    // I think I'm going to ditch that... we'll see.
    // Ok, so `unbounded` and `allocates` are the two pseudo-traits
    // that I would need to guard against?
    // Oh also `recursive`? Yeah I guess so.
    //
    // Looking at koka's non-handlable effects
    // - alloc (hey cool) hmmm but I think it's for mutable allocations, not "any" allocations.
    // - div (unbounded)

    // Ok folks, might need some more syntax. Which is annoying.
    // Or it could be the same syntax as effects, but they're just
    // handled different? Sounds reasonable.
    // Ok, so {:bounded, :noalloc, :norecursion} would be what you
    // need to ensure that it's valid for glsl.
    // Right?
    // And so using strings is `alloc` already, right?
    //
    // Hm so also, I want record types to keep track if they contain
    // functions ... that would be have those pseudo-effects ...
    // right? I mean it'd be inconvenient to have to drill down all the time
    // although maybe I can just cache it? yeah maybe that's fine?
    // because it's only terms that can be roots for a glsl gen job.
    //
    // - bounded
    // - norecursion
    // - noalloc
    // - noclosures
    // - nofnpointesr
    // - noenums
    //
    // hrm that's a lot
    // well let's just take it one step at a time.
    // We can wait to statically guarentee all that stuff until later.
    // For now, let's work on having a nice experience
    // for generating these dealios.
    //
    // I mean I guess I could just have one pseudo-thing that's like
    // glsl-compatible? kinda like nostd or something idk
    // Are there other targets that will have similar constraints?

    // Ok, so things to do here:
    /*
    - [ ] only generate type definitions for things that get used
    - [ ] go back through and prune things that didn't end up getting used
    - [ ] break out top-level records into their individual members
    - [ ] uhhhh is this where I do module naming?
        oh wait, I just need to allow multiple things with the same
        name, and also indicate when editing something that the new
        version replaces the old one.
    */

    // const printed: { [id: string]: PP } = {};

    // orderedTerms.forEach((idRaw) => {
    //     const id = idFromName(idRaw);
    //     let term = env.global.terms[idRaw];
    //     const senv = selfEnv(env, { type: 'Term', name: idRaw, ann: term.is });

    //     const maybeAddRecordInlines = (irTerm: ir.Expr) => {
    //         if (irTerm.type === 'record' && irTerm.base.type === 'Concrete') {
    //             if (builtinTypes[idName(irTerm.base.ref.id)]) {
    //                 return irTerm;
    //             }
    //             const base = irTerm.base;
    //             const rows: Array<Expr | null> = irTerm.base.rows.map(
    //                 (item, i) => {
    //                     if (!item) {
    //                         return item;
    //                     }
    //                     if (isConstant(item) && item.type !== 'builtin') {
    //                         return item;
    //                     }
    //                     const name = toplevelRecordAttribute(id, base.ref, i);
    //                     irTerms[name] = {
    //                         expr: item,
    //                         inline: item.type !== 'lambda',
    //                     };

    //                     printed[name] = declarationToGlsl(
    //                         senv,
    //                         opts,
    //                         name,
    //                         item,
    //                         '',
    //                     );

    //                     return {
    //                         type: 'genTerm',
    //                         loc: item.loc,
    //                         is: item.is,
    //                         id: name,
    //                     };
    //                 },
    //             );
    //             return { ...irTerm, base: { ...irTerm.base, rows } };
    //         }
    //         return irTerm;
    //     };

    //     // Don't output anything that I'm overriding with builtins
    //     if (glslBuiltins[idRaw]) {
    //         let irTerm = glslBuiltins[idRaw];

    //         irTerm = maybeAddRecordInlines(irTerm);

    //         irTerms[idRaw] = { expr: irTerm, inline: true };
    //         return;
    //     }

    //     const comment = printToString(declarationToPretty(senv, id, term), 100);
    //     senv.local.unique.current = maxUnique(term) + 1;
    //     term = liftEffects(senv, term);
    //     let irTerm = ir.printTerm(senv, irOpts, term);
    //     try {
    //         uniquesReallyAreUnique(irTerm);
    //     } catch (err) {
    //         const outer = new LocatedError(
    //             term.location,
    //             `Failed while typing ${idRaw} : ${env.global.idNames[idRaw]}`,
    //         ).wrap(err);
    //         throw outer;
    //     }
    //     irTerm = explicitSpreads(senv, irOpts, irTerm);
    //     irTerm = optimizeAggressive(senv, irTerms, irTerm, id);
    //     irTerm = optimizeDefine(senv, irTerm, id);
    //     uniquesReallyAreUnique(irTerm);

    //     irTerm = maybeAddRecordInlines(irTerm);

    //     const shouldInline = ![
    //         'bool',
    //         'float',
    //         'int',
    //         'ref',
    //         'lambda',
    //     ].includes(irTerm.type);
    //     irTerms[idRaw] = { expr: irTerm, inline: shouldInline, comment };

    //     printed[idRaw] = declarationToGlsl(
    //         senv,
    //         opts,
    //         idRaw,
    //         irTerm,
    //         '*\n```\n' + comment + '\n```\n',
    //     );
    // });

    // const usedAfterOpt: { [key: string]: true } = {};
    // const toWalk = [idName(mainId), ...buffers];
    // const irDeps: { [key: string]: Array<string> } = {};
    // while (toWalk.length) {
    //     const next = toWalk.shift();
    //     if (!next) {
    //         break;
    //     }
    //     // already processed
    //     if (usedAfterOpt[next]) {
    //         continue;
    //     }
    //     usedAfterOpt[next] = true;
    //     const deps: { [key: string]: true } = {};
    //     transformExpr(irTerms[next].expr, {
    //         ...defaultVisitor,
    //         expr: (expr) => {
    //             if (expr.type === 'term') {
    //                 deps[idName(expr.id)] = true;
    //                 toWalk.push(idName(expr.id));
    //             }
    //             if (expr.type === 'genTerm') {
    //                 deps[expr.id] = true;
    //                 toWalk.push(expr.id);
    //             }
    //             return null;
    //         },
    //     });
    //     irDeps[next] = Object.keys(deps);
    // }

    // const inOrder = sortAllDepsPlain(irDeps);
    return generateShader(
        { ...env, typeDefs: {} },
        opts,
        irOpts,
        mainId,
        buffers.map(idFromName),
    );
};

export const hasInvalidGLSL = (expr: Expr) => {
    let found: Loc | null = null;
    // Toplevel record not allowed
    if (
        expr.type === 'record' &&
        expr.base.type === 'Concrete' &&
        !builtinTypes[idName(expr.base.ref.id)]
    ) {
        return expr.loc;
    }
    // Functions can't have a lambda as an argument
    if (expr.type === 'lambda') {
        if (expr.args.some((arg) => arg.type.type === 'lambda')) {
            return expr.loc;
        }
    }
    if (
        expr.type === 'lambda' &&
        expr.is.type === 'lambda' &&
        expr.is.res.type === 'lambda'
    ) {
        return expr.loc;
    }
    if (expr.is.type === 'lambda' && expr.type !== 'lambda') {
        return expr.loc;
    }
    const top = expr;
    transformExpr(expr, {
        ...defaultVisitor,
        stmt: (stmt) => {
            if (stmt.type === 'Define' && stmt.is.type === 'lambda') {
                found = stmt.loc;
            }
            return null;
        },
        expr: (expr) => {
            if (expr === top) {
                return null;
            }
            if (expr.type === 'lambda') {
                found = expr.loc;
            }
            return null;
        },
    });
    return found;
};
