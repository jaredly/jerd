// Ok

// import * as t from '@babel/types';
import { Location } from '../parsing/parser';
import { idName, nameForId, typeForId } from '../typing/env';
import { getOpLevel } from '../typing/terms/ops';
// import { bool } from '../typing/preset';
import {
    Env,
    Id,
    idsEqual,
    nullLocation,
    Reference,
    Symbol,
} from '../typing/types';
import { emojis } from './emojis';
import { symToGlsl } from './glslPrinter';
// import { isBinop } from './glslPrinter';
import * as ir from './ir/intermediateRepresentation';
import { TypeDefs } from './ir/optimize/optimize';
import { Expr, InferredSize, RecordDef } from './ir/types';
import { float } from './ir/utils';
import * as pp from './printer';
import { args, atom, block, id, items, PP } from './printer';
import { recordAttributeName } from './typeScriptPrinterSimple';
import { allRecordMembers } from './typeScriptTypePrinter';

const SHOW_TYPES = false as false | 'all' | 'var';

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

export const idToDebug = (
    env: Env,
    id: Id,
    isType: boolean,
    loc: Location,
): PP => {
    const idRaw = idName(id);
    const readableName = nameForId(env, idRaw);
    return pp.id(
        readableName || 'unnamed',
        hashToEmoji(idRaw),
        isType ? 'type' : 'term',
        loc,
    );
};

export const hashToEmoji = (hash: string) => {
    let num = parseInt(hash, 16);
    const base = emojis.length;
    const bits = Math.floor(Math.log(base) / Math.log(2));
    // console.log('HASHING', num, base, bits);
    const mask = (1 << bits) - 1;
    let res = '';
    while (num > 0) {
        const bit = num & mask;
        // console.log(num, mask, bit, emojis[bit]);
        res += emojis[bit];
        num = num >> bits;
    }
    return res;
};

export const refToDebug = (
    env: Env,
    ref: Reference,
    isType: boolean,
    loc: Location,
): PP => {
    return ref.type === 'user'
        ? idToDebug(env, ref.id, isType, loc)
        : atom(ref.name, undefined, loc);
    // : pp.id(ref.name, 'builtin', isType ? 'type' : 'term');
};

export const debugSym = (sym: Symbol, loc: Location) => {
    // return atom(`${sym.name}_${sym.unique}`);
    return id(sym.name, ':' + sym.unique, 'sym', loc);
};

// export const debugDefine = (env: Env, name)

// TODO: Should I wrap /everything/ in a type annotation?
// for being explicit?
// Seems like it would be nice to have the option
// um anyway, uncomment this code to show all type annotations.
export const debugExpr = (env: Env, expr: Expr): PP => {
    if (SHOW_TYPES === 'all') {
        return items([
            _debugExpr(env, expr),
            atom(' {'),
            debugType(env, expr.is),
            atom('}'),
        ]);
    } else {
        return _debugExpr(env, expr);
    }
};
export const _debugExpr = (env: Env, expr: Expr): PP => {
    switch (expr.type) {
        case 'var':
            if (SHOW_TYPES === 'var') {
                return items([
                    debugSym(expr.sym, expr.loc),
                    atom(': '),
                    debugType(env, expr.is),
                ]);
            } else {
                return debugSym(expr.sym, expr.loc);
            }
        case 'SpecializeEnum':
            return items([
                debugType(env, expr.is),
                atom(' <- '),
                debugExpr(env, expr.inner),
            ]);
        case 'Enum':
            return items([
                debugType(env, expr.is),
                atom(':'),
                debugExpr(env, expr.inner),
            ]);
        case 'unary':
            return items([atom(expr.op), debugExpr(env, expr.inner)]);
        case 'tupleAccess':
            return items([
                debugExpr(env, expr.target),
                atom('.'),
                atom(expr.idx + ''),
            ]);
        case 'tuple':
            return args(expr.items.map((e) => debugExpr(env, e)));
        case 'term':
            return idToDebug(env, expr.id, false, expr.loc);
        case 'string':
            return atom(JSON.stringify(expr.value));
        case 'slice':
            return items([
                debugExpr(env, expr.value),
                atom('['),
                debugExpr(env, expr.start),
                expr.end ? items([atom(':'), debugExpr(env, expr.end)]) : null,
                atom(']'),
            ]);
        case 'record': {
            if (expr.base.type === 'Variable') {
                throw new Error('not yet impl');
            }
            const base = expr.base;
            const id = expr.base.ref.id;
            if (!typeForId(env, id)) {
                return atom('RECORDNOTFOUND');
            }
            const rows = allRecordMembers(env, expr.base.ref.id);
            return items(
                [
                    idToDebug(env, expr.base.ref.id, true, expr.loc),
                    atom('{TODO SPREADs}'),
                    // TODO SPREADS
                    args(
                        rows.map(({ id, i, item }) =>
                            items([
                                atom(
                                    recordAttributeName(
                                        env,
                                        { type: 'user', id },
                                        i,
                                    ),
                                ),
                                atom(': '),
                                debugExpr(
                                    env,
                                    (idsEqual(id, base.ref.id)
                                        ? base.rows[i]
                                        : expr.subTypes[idName(id)].rows[
                                              i
                                          ]) || {
                                        type: 'var',
                                        sym: { name: '_', unique: 0 },
                                        loc: nullLocation,
                                        is: float,
                                    },
                                ),
                            ]),
                        ),
                        '{',
                        '}',
                    ),
                ],
                undefined,
                expr.loc,
            );
        }
        case 'raise':
            return atom('TODO raise');
        case 'lambda':
            let body: PP;
            if (
                expr.body.items.length === 1 &&
                expr.body.items[0].type === 'Return'
            ) {
                body = debugExpr(env, expr.body.items[0].value);
            } else {
                body = debugBody(env, expr.body);
            }
            return items(
                [
                    expr.is.typeVbls.length
                        ? args(
                              expr.is.typeVbls.map((v, i) => atom(v.sym.name)),
                              '<',
                              '>',
                          )
                        : null,
                    args(
                        expr.args.map((arg) =>
                            items([
                                debugSym(arg.sym, arg.loc),
                                atom(': '),
                                debugType(env, arg.type),
                            ]),
                        ),
                    ),
                    atom(': '),
                    debugType(env, expr.res),
                    atom(' => '),
                    body,
                ],
                undefined,
                expr.loc,
            );
        case 'int':
        case 'float':
        case 'boolean':
            return atom(expr.value + '', undefined, expr.loc);
        case 'handle':
            return atom('TODO Handle', undefined, expr.loc);
        case 'genTerm':
            return id('generated', expr.id, 'genTerm', expr.loc);
        case 'eqLiteral':
            return items(
                [
                    debugExpr(env, expr.value),
                    atom(' == '),
                    debugExpr(env, expr.literal),
                ],
                undefined,
                expr.loc,
            );
        case 'effectfulOrDirectLambda':
            return atom('TODO effectful or direct lambda');
        case 'effectfulOrDirect':
            return atom('get effectful or direct TODO');
        case 'builtin':
            return atom(expr.name);
        // return id(expr.name, 'builtin', 'builtin');
        case 'attribute':
            return items(
                [
                    debugExpr(env, expr.target),
                    atom('.#'),
                    refToDebug(env, expr.ref, true, expr.loc),
                    atom('#' + expr.idx + ''),
                ],
                undefined,
                expr.loc,
            );
        case 'arrayLen':
            return items(
                [atom('len'), args([debugExpr(env, expr.value)])],
                undefined,
                expr.loc,
            );
        case 'arrayIndex':
            return items(
                [
                    debugExpr(env, expr.value),
                    atom('['),
                    debugExpr(env, expr.idx),
                    atom(']'),
                ],
                undefined,
                expr.loc,
            );
        case 'array':
            return args(
                expr.items.map((e) =>
                    e.type === 'Spread'
                        ? items([atom('...'), debugExpr(env, e.value)])
                        : debugExpr(env, e),
                ),
                '[',
                ']',
                true,
                expr.loc,
            );
        case 'apply':
            let inner = debugExpr(env, expr.target);
            if (expr.target.type === 'lambda') {
                inner = items([atom('('), inner, atom(')')]);
            }
            if (
                expr.target.type === 'builtin' &&
                isBinop(expr.target.name) &&
                expr.args.length === 2
            ) {
                const level = getOpLevel(expr.target.name)!;
                const left = maybeParen(
                    getBinopName(expr.args[0]),
                    debugExpr(env, expr.args[0]),
                    level,
                );
                const right = maybeParen(
                    getBinopName(expr.args[0]),
                    debugExpr(env, expr.args[1]),
                    level,
                );
                return items(
                    [left, atom(' '), inner, atom(' '), right],
                    undefined,
                    expr.loc,
                );
            }
            return items(
                [
                    inner,
                    expr.typeVbls.length
                        ? args(
                              expr.typeVbls.map((t) => debugType(env, t)),
                              '<',
                              '>',
                          )
                        : null,
                    args(expr.args.map((arg) => debugExpr(env, arg))),
                ],
                undefined,
                expr.loc,
            );
        case 'Trace':
            return items(
                [atom('trace!'), args(expr.args.map((e) => debugExpr(env, e)))],
                undefined,
                expr.loc,
            );
        case 'IsRecord':
            return items(
                [
                    atom('isRecord!'),
                    args([
                        debugExpr(env, expr.value),
                        refToDebug(env, expr.ref, true, expr.loc),
                    ]),
                ],
                undefined,
                expr.loc,
            );
        case 'arrayAppend':
            return items([
                debugExpr(env, expr.value),
                atom('.*push*'),
                args(expr.items.map((item) => debugExpr(env, item))),
            ]);
        case 'arrayCopy':
            return items([
                atom('*arrayCopy*('),
                debugExpr(env, expr.value),
                atom(')'),
            ]);
    }
};

const getBinopName = (expr: Expr) => {
    if (
        expr.type === 'apply' &&
        expr.target.type === 'builtin' &&
        isBinop(expr.target.name)
    ) {
        return expr.target.name;
    }
    return null;
};

const maybeParen = (name: string | null, v: PP, mine: number): PP => {
    if (!name) {
        return v;
    }
    const level = getOpLevel(name)!;
    if (level < mine) {
        return items([atom('('), v, atom(')')]);
    }
    return v;
};

export const debugTypeDef = (
    env: Env,
    id: Id,
    constr: RecordDef,
    types?: TypeDefs,
): PP => {
    const groups = env.global.recordGroups[idName(id)]
        ? env.global.recordGroups[idName(id)]
        : types &&
          types[idName(id)] &&
          env.global.recordGroups[idName(types[idName(id)].source)];
    return items([
        atom('struct '),
        idToDebug(env, id, true, constr.location),
        atom(' '),
        block(
            constr.extends
                .map((ref) => items([atom('...'), debugType(env, ref)]))
                .concat(
                    constr.items.map((t, i) =>
                        items([
                            atom(groups ? groups[i] : '[no names]'),
                            atom(': '),
                            debugType(env, t),
                        ]),
                    ),
                ),
        ),
    ]);
};

export const debugType = (env: Env, type: ir.Type): PP => {
    switch (type.type) {
        case 'var':
            return items([atom(`[var]`), debugSym(type.sym, type.loc)]);
        case 'ref':
            return items([
                refToDebug(env, type.ref, true, type.loc),
                type.typeVbls.length
                    ? args(
                          type.typeVbls.map((t) => debugType(env, t)),
                          '<',
                          '>',
                      )
                    : null,
            ]);
        case 'lambda':
            return items(
                [
                    args(type.args.map((t) => debugType(env, t))),
                    atom(' => '),
                    debugType(env, type.res),
                ],
                undefined,
                type.loc,
            );
        case 'Array':
            return items([
                atom('Array<'),
                debugType(env, type.inner),
                type.inferredSize
                    ? items([atom('; '), debugInferredSize(type.inferredSize)])
                    : null,
                atom('>'),
            ]);
    }
    return atom('nope type: ' + type.type, undefined, type.loc);
};

export const debugInferredSize = (iz: InferredSize): PP => {
    switch (iz.type) {
        case 'exactly':
            return atom(iz.size.toString());
        case 'variable':
            return debugSym(iz.sym, nullLocation);
        case 'constant':
            return debugSym(iz.sym, nullLocation);
        case 'relative':
            return items([
                debugInferredSize(iz.to),
                atom(' + '),
                debugInferredSize(iz.offset),
            ]);
        default:
            return atom(JSON.stringify(iz));
    }
};

export const debugStmt = (env: Env, stmt: ir.Stmt): PP => {
    switch (stmt.type) {
        case 'Break':
            return atom('break');
        case 'Block':
            return block(stmt.items.map((s) => debugStmt(env, s)));
        case 'Assign':
            return items(
                [
                    debugSym(stmt.sym, stmt.loc),
                    atom(' = '),
                    debugExpr(env, stmt.value),
                ],
                undefined,
                stmt.loc,
            );
        case 'Continue':
            return atom('continue');
        case 'Define':
            return items(
                [
                    atom('const '),
                    debugSym(stmt.sym, stmt.loc),
                    atom(': '),
                    debugType(env, stmt.is),
                    ...(stmt.value != null
                        ? [atom(' = '), debugExpr(env, stmt.value)]
                        : []),
                ],
                undefined,
                stmt.loc,
            );
        case 'Expression':
            return debugExpr(env, stmt.expr);
        case 'Loop':
            if (stmt.bounds) {
                return items(
                    [
                        atom('for '),
                        items([
                            atom('(; '),
                            debugSym(stmt.bounds.sym, stmt.loc),
                            atom(' '),
                            atom(stmt.bounds.op),
                            atom(' '),
                            debugExpr(env, stmt.bounds.end),
                            atom('; '),
                            debugSym(stmt.bounds.sym, stmt.loc),
                            atom(' = '),
                            debugExpr(env, stmt.bounds.step),
                            atom(')'),
                        ]),
                        atom(' '),
                        debugBody(env, stmt.body),
                    ],
                    undefined,
                    stmt.loc,
                );
            }
            return items(
                [atom('loop(unbounded) '), debugBody(env, stmt.body)],
                undefined,
                stmt.loc,
            );
        case 'MatchFail':
            return atom('match_fail!()', undefined, stmt.loc);
        case 'Return':
            return items(
                [atom('return '), debugExpr(env, stmt.value)],
                undefined,
                stmt.loc,
            );
        case 'if':
            return items(
                [
                    atom('if '),
                    debugExpr(env, stmt.cond),
                    atom(' '),
                    debugBody(env, stmt.yes),
                    ...(stmt.no != null
                        ? [atom(' else '), debugBody(env, stmt.no)]
                        : []),
                ],
                undefined,
                stmt.loc,
            );
        case 'ArraySet':
            return items(
                [
                    debugSym(stmt.sym, nullLocation),
                    atom('['),
                    debugExpr(env, stmt.idx),
                    atom('] = '),
                    debugExpr(env, stmt.value),
                ],
                undefined,
                stmt.loc,
            );
        default:
            throw new Error('Unhandled stmt');
    }
};

export const debugBody = (env: Env, body: ir.Block) => {
    return debugStmt(env, body);
};
