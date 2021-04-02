// Ok

import * as t from '@babel/types';
import { idName, refName } from '../typing/env';
import { Env, Id, RecordDef, Reference, Symbol } from '../typing/types';
import * as ir from './ir/intermediateRepresentation';
import { Loc } from './ir/types';

const printSym = (sym: Symbol) => sym.name + '_' + sym.unique;
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
            return t.arrowFunctionExpression(
                term.args.map((arg) => t.identifier(printSym(arg.sym))),
                lambdaBodyToTs(env, opts, term.body),
            );
        // TODO: fix for scoping
        case 'term':
            return t.identifier(printId(term.id));
        case 'var':
            return t.identifier(printSym(term.sym));
        case 'IsRecord':
            return t.memberExpression(
                termToTs(env, opts, term.value),
                t.identifier(opts.disciminant || 'type'),
            );
        case 'apply':
            return t.callExpression(
                termToTs(env, opts, term.target),
                term.args.map((arg) => termToTs(env, opts, arg)),
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
            return t.identifier(term.name);
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
        case 'handle':
        case 'raise':
        case 'record':
            return t.identifier('NOPE');
        case 'attribute':
            return t.memberExpression(
                termToTs(env, opts, term.target),
                t.identifier(recordAttributeName(env, term.ref, term.idx)),
            );
        case 'slice':
            return t.identifier('not_impl');
        default:
            let _v: never = term;
            throw new Error(`Not impl ${(term as any).type}`);
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
    return `h${idName(ref.id)}_${idx}`;
};

export const stmtToTs = (
    env: Env,
    opts: OutputOptions,
    stmt: ir.Stmt,
): t.Statement => {
    switch (stmt.type) {
        case 'Block':
            return withLocation(
                t.blockStatement(
                    stmt.items.map((stmt) => stmtToTs(env, opts, stmt)),
                ),
                stmt.loc,
            );
        case 'Define':
            return withLocation(
                t.variableDeclaration('let', [
                    t.variableDeclarator(
                        t.identifier(printSym(stmt.sym)),
                        termToTs(env, opts, stmt.value),
                    ),
                ]),
                stmt.loc,
            );
        case 'Assign':
            return withLocation(
                t.expressionStatement(
                    t.assignmentExpression(
                        '=',
                        t.identifier(printSym(stmt.sym)),
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
