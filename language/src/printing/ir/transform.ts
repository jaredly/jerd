// Ok, so we want to remove any unused variable declarations.
// and if they aren't effectful, which I think is guarenteed,
// then yeah we can just drop them.

import { Block, Expr, LambdaExpr, RecordSubType, Stmt } from './types';

// export const transformExpr = (expr: Expr, )

export type Visitor = {
    expr: (value: Expr) => Expr | null;
    block: (value: Block) => Block | null;
    stmt: (value: Stmt) => Stmt | null;
};

export const transformExpr = (expr: Expr, visitor: Visitor): Expr => {
    const transformed = visitor.expr(expr);
    if (transformed != null) {
        expr = transformed;
    }
    switch (expr.type) {
        case 'string':
        case 'int':
        case 'boolean':
        case 'builtin':
        case 'float':
        case 'term':
        case 'var':
        case 'builtin':
            return expr;
        case 'eqLiteral':
            const t = transformExpr(expr.value, visitor);
            return t !== expr.value ? { ...expr, value: t } : expr;
        case 'slice': {
            const value = transformExpr(expr.value, visitor);
            const start = transformExpr(expr.start, visitor);
            const end = expr.end ? transformExpr(expr.end, visitor) : null;
            return value !== expr.value ||
                start !== expr.start ||
                end !== expr.end
                ? {
                      ...expr,
                      value,
                      start,
                      end,
                  }
                : expr;
        }
        case 'arrayIndex': {
            const value = transformExpr(expr.value, visitor);
            const idx = transformExpr(expr.idx, visitor);
            return value !== expr.value || idx !== expr.idx
                ? { ...expr, value, idx }
                : expr;
        }
        case 'array': {
            let changed = false;
            const items = expr.items.map((item) => {
                if (item.type === 'Spread') {
                    const value = transformExpr(item.value, visitor);
                    changed = changed || value !== item.value;
                    return { ...item, value };
                }
                const i = transformExpr(item, visitor);
                changed = changed || i !== item;
                return i;
            });
            return changed ? { ...expr, items } : expr;
        }
        case 'arrayLen':
        case 'IsRecord': {
            const value = transformExpr(expr.value, visitor);
            return value !== expr.value ? { ...expr, value } : expr;
        }
        case 'or': {
            const left = transformExpr(expr.left, visitor);
            const right = transformExpr(expr.right, visitor);
            return left !== expr.left || right !== expr.right
                ? { ...expr, left, right }
                : expr;
        }
        case 'apply': {
            const target = transformExpr(expr.target, visitor);
            let changed = false;
            const args = expr.args.map((arg) => {
                const a = transformExpr(arg, visitor);
                changed = changed || a !== arg;
                return a;
            });
            return changed || target !== expr.target
                ? { ...expr, target, args }
                : expr;
        }
        case 'attribute':
        case 'effectfulOrDirect': {
            const target = transformExpr(expr.target, visitor);
            return target !== expr.target ? { ...expr, target } : expr;
        }
        case 'effectfulOrDirectLambda': {
            const effectful = transformLambdaExpr(expr.effectful, visitor);
            const direct = transformLambdaExpr(expr.direct, visitor);
            return effectful !== expr.effectful || direct !== expr.direct
                ? { ...expr, direct, effectful }
                : expr;
        }
        case 'lambda':
            return transformLambdaExpr(expr, visitor);
        case 'raise': {
            let changed = false;
            const args = expr.args.map((arg) => {
                const argn = transformExpr(arg, visitor);
                changed = changed || argn !== arg;
                return argn;
            });
            const done = transformExpr(expr.done, visitor);
            return changed || done !== expr.done
                ? { ...expr, args, done }
                : expr;
        }
        case 'handle': {
            const target = transformExpr(expr.target, visitor);
            let changed = false;
            const cases = expr.cases.map((kase) => {
                const body = transformLambdaBody(kase.body, visitor);
                changed = changed || body !== kase.body;
                return body !== kase.body ? { ...kase, body } : kase;
            });
            const body = transformLambdaBody(expr.pure.body, visitor);
            return target !== expr.target || changed || body !== expr.pure.body
                ? { ...expr, target, cases, pure: { ...expr.pure, body } }
                : expr;
        }
        case 'record': {
            let base = expr.base;
            if (base.type === 'Variable') {
                const spread = transformExpr(base.spread, visitor);
                if (spread !== base.spread) {
                    base = { ...base, spread };
                }
            } else {
                const spread = base.spread
                    ? transformExpr(base.spread, visitor)
                    : base.spread;
                let changed = false;
                const rows = base.rows.map((row) => {
                    const r = row ? transformExpr(row, visitor) : row;
                    changed = changed || r !== row;
                    return r;
                });
                if (spread !== base.spread || changed) {
                    base = { ...base, spread, rows };
                }
            }
            let changed = false;
            const s = expr.subTypes;
            const subTypes: { [key: string]: RecordSubType } = {};
            Object.keys(s).forEach((key) => {
                const subType = s[key];
                const spread = subType.spread
                    ? transformExpr(subType.spread, visitor)
                    : subType.spread;
                let subTypeChanged = false;
                const rows = subType.rows.map((row) => {
                    const r = row ? transformExpr(row, visitor) : row;
                    subTypeChanged = subTypeChanged || r !== row;
                    return r;
                });
                changed =
                    changed || subTypeChanged || spread !== subType.spread;
                subTypes[key] = {
                    ...subType,
                    rows,
                    spread,
                };
            });
            return base !== expr.base || changed
                ? { ...expr, base, subTypes }
                : expr;
        }
        default:
            let _x: never = expr;
            throw new Error(`Unhandled ${(expr as any).type}`);
    }
};

export const transformLambdaExpr = (
    expr: LambdaExpr,
    visitor: Visitor,
): LambdaExpr => {
    const body = transformLambdaBody(expr.body, visitor);
    return body !== expr.body ? { ...expr, body } : expr;
};

export const transformLambdaBody = (
    body: Expr | Block,
    visitor: Visitor,
): Expr | Block => {
    if (body.type === 'Block') {
        return transformBlock(body, visitor);
    }
    return transformExpr(body, visitor);
};

export const transformBlock = (block: Block, visitor: Visitor): Block => {
    const tr = visitor.block(block);
    if (tr != null) {
        block = tr;
    }
    let changed = false;
    const items = block.items.map((stmt) => {
        const s = transformStmt(stmt, visitor);
        changed = changed || s !== stmt;
        return s;
    });
    return changed ? { ...block, items } : block;
};

export const transformStmt = (stmt: Stmt, visitor: Visitor): Stmt => {
    const tr = visitor.stmt(stmt);
    if (tr) {
        stmt = tr;
    }
    switch (stmt.type) {
        case 'Expression': {
            const expr = transformExpr(stmt.expr, visitor);
            return expr !== stmt.expr ? { ...stmt, expr } : stmt;
        }
        case 'Define':
        case 'Return':
        case 'Assign': {
            const value = transformExpr(stmt.value, visitor);
            return value !== stmt.value ? { ...stmt, value } : stmt;
        }
        case 'MatchFail':
            return stmt;
        case 'if': {
            const cond = transformExpr(stmt.cond, visitor);
            const yes = transformBlock(stmt.yes, visitor);
            const no = stmt.no ? transformBlock(stmt.no, visitor) : stmt.no;
            return cond !== stmt.cond || yes !== stmt.yes || no !== stmt.no
                ? { ...stmt, cond, yes, no }
                : stmt;
        }
        case 'Block':
            return transformBlock(stmt, visitor);
        default:
            let _x: never = stmt;
            throw new Error(`Unhandled stmt ${(stmt as any).type}`);
    }
};

// export const walk = (
//     expr: Expr | Stmt,
//     visitor: (value: Expr | Stmt) => boolean,
// ) => {
//     const recurse = visitor(expr);
//     if (!recurse) {
//         return;
//     }
//     switch (expr.type) {
//         case 'string':
//         case 'int':
//         case 'boolean':
//         case 'builtin':
//         case 'float':
//             return;
//         case 'eqLiteral':
//             walk(expr.value, visitor);
//             return;
//         case 'slice':
//             walk(expr.value, visitor);
//             walk(expr.start, visitor);
//             if (expr.end) {
//                 walk(expr.end, visitor);
//             }
//             return;
//         case 'arrayIndex':
//             walk(expr.value, visitor);
//             walk(expr.idx, visitor);
//             return;
//         case 'arrayLen':
//             walk(expr.value, visitor);
//             return;
//         case 'IsRecord':
//             walk(expr.value, visitor);
//             return;
//         case 'or':
//             walk(expr.left, visitor);
//             walk(expr.right, visitor);
//             return;
//         case 'effectfulOrDirect':
//             walk(expr.target, visitor);
//             return;
//         case 'raise':
//             expr.args.forEach((arg) => walk(arg, visitor));
//             walk(expr.done, visitor);
//             return;
//         case 'handle':
//             walk(expr.target, visitor);
//             expr.cases.forEach((kase) => walk(kase.body, visitor));
//             walk(expr.pure.body, visitor);
//             return;
//         case 'Block':
//             expr.items.forEach((stmt) => walk(stmt, visitor));
//             return;
//         case 'record':
//             Object.keys();
//         // PICK UP HERE
//         default:
//             let _x: never = expr;
//             throw new Error(`Unhandled ${(expr as any).type}`);
//     }
// };
