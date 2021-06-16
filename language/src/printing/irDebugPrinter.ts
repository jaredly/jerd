// Ok

// import * as t from '@babel/types';
import {
    expressionDeps,
    expressionTypeDeps,
    sortAllDeps,
    sortAllDepsPlain,
    sortTerms,
} from '../typing/analyze';
import { idFromName, idName, refName } from '../typing/env';
// import { bool } from '../typing/preset';
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
    nullLocation,
} from '../typing/types';
import * as preset from '../typing/preset';
import { typeScriptPrelude } from './fileToTypeScript';
import { walkPattern, walkTerm, wrapWithAssert } from '../typing/transform';
import * as ir from './ir/intermediateRepresentation';
import {
    Exprs,
    isConstant,
    optimizeAggressive,
    optimizeDefine,
    optimizeDefineNew,
} from './ir/optimize/optimize';
import {
    Loc,
    Type as IRType,
    OutputOptions as IOutputOptions,
    Expr,
    Record,
    Apply,
} from './ir/types';
import {
    bool,
    builtin,
    float,
    handlersType,
    handlerSym,
    int,
    pureFunction,
    typeFromTermType,
    void_,
} from './ir/utils';
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
import { Location } from '../parsing/parser';
import { defaultVisitor, transformExpr } from './ir/transform';
import { uniquesReallyAreUnique } from './ir/analyze';
import { LocatedError } from '../typing/errors';
import {
    maxUnique,
    recordAttributeName,
    termToTs,
} from './typeScriptPrinterSimple';
import { explicitSpreads } from './ir/optimize/explicitSpreads';
import { toplevelRecordAttribute } from './ir/optimize/inline';
import { glslTester } from './glslTester';
import { isBinop } from './glslPrinter';
import { getOpLevel } from '../typing/terms/ops';
import { emojis } from './emojis';

export const idToDebug = (env: Env, id: Id, isType: boolean): PP => {
    const idRaw = idName(id);
    const readableName = env.global.idNames[idRaw];
    return pp.id(
        readableName || 'unnamed',
        hashToEmoji(idRaw),
        isType ? 'type' : 'term',
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

export const refToDebug = (env: Env, ref: Reference, isType: boolean): PP => {
    return ref.type === 'user'
        ? idToDebug(env, ref.id, isType)
        : atom(ref.name);
    // : pp.id(ref.name, 'builtin', isType ? 'type' : 'term');
};

export const debugSym = (sym: Symbol) => {
    // return atom(`${sym.name}_${sym.unique}`);
    return id(sym.name, ':' + sym.unique, 'sym');
};

// TODO: Should I wrap /everything/ in a type annotation?
// for being explicit?
// Seems like it would be nice to have the option
export const debugExpr = (env: Env, expr: Expr): PP => {
    switch (expr.type) {
        case 'var':
            return debugSym(expr.sym);
        case 'unary':
            return items([atom(expr.op), debugExpr(env, expr.inner)]);
        case 'tupleAccess':
            return items([
                debugExpr(env, expr.target),
                atom('['),
                atom(expr.idx + ''),
                atom(']'),
            ]);
        case 'tuple':
            return args(expr.items.map((e) => debugExpr(env, e)));
        case 'term':
            return idToDebug(env, expr.id, false);
        case 'string':
            return atom(JSON.stringify(expr.value));
        case 'slice':
            return atom('nop');
        case 'record':
            if (expr.base.type === 'Variable') {
                throw new Error('not yet impl');
            }
            return items([
                idToDebug(env, expr.base.ref.id, true),
                atom('TODO TODO'),
            ]);
        case 'raise':
            return atom('TODO raise');
        case 'lambda':
            return items([
                args(
                    expr.args.map((arg) =>
                        items([
                            debugSym(arg.sym),
                            atom(': '),
                            debugType(env, arg.type),
                        ]),
                    ),
                ),
                atom(' => '),
                debugBody(env, expr.body),
            ]);
        case 'int':
        case 'float':
        case 'boolean':
            return atom(expr.value + '');
        case 'handle':
            return atom('TODO Handle');
        case 'genTerm':
            return id('generated', expr.id, 'genTerm');
        case 'eqLiteral':
            return items([
                debugExpr(env, expr.value),
                atom(' == '),
                debugExpr(env, expr.literal),
            ]);
        case 'effectfulOrDirectLambda':
            return atom('TODO effectful or direct lambda');
        case 'effectfulOrDirect':
            return atom('get effectful or direct TODO');
        case 'builtin':
            return atom(expr.name);
        // return id(expr.name, 'builtin', 'builtin');
        case 'attribute':
            return items([
                debugExpr(env, expr.target),
                atom('.#'),
                refToDebug(env, expr.ref, true),
                atom('#' + expr.idx + ''),
            ]);
        case 'arrayLen':
            return items([atom('len'), args([debugExpr(env, expr.value)])]);
        case 'arrayIndex':
            return items([
                debugExpr(env, expr.value),
                atom('['),
                debugExpr(env, expr.idx),
                atom(']'),
            ]);
        case 'array':
            return args(
                expr.items.map((e) =>
                    e.type === 'Spread'
                        ? items([atom('...'), debugExpr(env, e.value)])
                        : debugExpr(env, e),
                ),
                '[',
                ']',
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
                return items([left, atom(' '), inner, atom(' '), right]);
            }
            return items([
                inner,
                args(expr.args.map((arg) => debugExpr(env, arg))),
            ]);
        case 'Trace':
            return items([
                atom('trace!'),
                args(expr.args.map((e) => debugExpr(env, e))),
            ]);
        case 'IsRecord':
            return items([
                atom('isRecord!'),
                args([
                    debugExpr(env, expr.value),
                    refToDebug(env, expr.ref, true),
                ]),
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

export const debugType = (env: Env, type: ir.Type): PP => {
    switch (type.type) {
        case 'var':
            return atom('variable type here');
        case 'ref':
            return refToDebug(env, type.ref, true);
        case 'lambda':
            return items([
                args(type.args.map((t) => debugType(env, t))),
                atom(' => '),
                debugType(env, type.res),
            ]);
    }
    return atom('nope type: ' + type.type);
};

export const debugStmt = (env: Env, stmt: ir.Stmt): PP => {
    switch (stmt.type) {
        case 'Block':
            return block(stmt.items.map((s) => debugStmt(env, s)));
        case 'Assign':
            return items([
                debugSym(stmt.sym),
                atom(' = '),
                debugExpr(env, stmt.value),
            ]);
        case 'Continue':
            return atom('continue');
        case 'Define':
            return items([
                atom('const '),
                debugSym(stmt.sym),
                atom(': '),
                debugType(env, stmt.is),
                ...(stmt.value != null
                    ? [atom(' = '), debugExpr(env, stmt.value)]
                    : []),
            ]);
        case 'Expression':
            return debugExpr(env, stmt.expr);
        case 'Loop':
            return items([atom('loop '), debugBody(env, stmt.body)]);
        case 'MatchFail':
            return atom('match_fail!()');
        case 'Return':
            return items([atom('return '), debugExpr(env, stmt.value)]);
        case 'if':
            return items([
                atom('if '),
                debugExpr(env, stmt.cond),
                debugBody(env, stmt.yes),
                ...(stmt.no != null
                    ? [atom(' else '), debugBody(env, stmt.no)]
                    : []),
            ]);
    }
};

export const debugBody = (env: Env, body: ir.Block) => {
    return debugStmt(env, body);
};
