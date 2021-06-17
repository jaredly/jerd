// Ok, so we want to remove any unused variable declarations.
// and if they aren't effectful, which I think is guarenteed,
// then yeah we can just drop them.

import { Block, Expr, LambdaExpr, RecordSubType, Stmt } from './types';

// export const transformExpr = (expr: Expr, )

export type ExprVisitor = (
    value: Expr,
    level?: number,
) => Expr | null | false | [Expr];
export type Visitor = {
    expr: ExprVisitor;
    block: (value: Block) => Block | null | false;
    stmt: (value: Stmt) => Stmt | null | false | Array<Stmt>;
};

export const defaultVisitor: Visitor = {
    expr: (expr) => null,
    block: (block) => null,
    stmt: (stmt) => null,
};

// export const transformAny = (v: Expr | Stmt, visitor: Visitor) => {
//     switch (v.type) {
//         case 'Expression':
//            case 'Define':
//                case 'Assign':
//                    case 'if':
//                        case 'MatchFail':
//                            case 'Return':
//                                case 'Loop':
//                                    case 'Continue':
//                                        case 'Block':
//                                            return transformOneStmt
//     }
// }

export const transformExpr = (
    expr: Expr,
    visitor: Visitor,
    level: number = 0,
): Expr => {
    const transformed = visitor.expr(expr, level);
    if (transformed === false) {
        return expr; // don't recurse
    }
    // transform, but don't recurse
    if (Array.isArray(transformed)) {
        return transformed[0];
    }
    if (transformed != null) {
        expr = transformed;
    }
    level += 1;
    switch (expr.type) {
        case 'string':
        case 'int':
        case 'boolean':
        case 'builtin':
        case 'float':
        case 'term':
        case 'genTerm':
        case 'var':
            return expr;
        case 'unary': {
            const t = transformExpr(expr.inner, visitor, level);
            return t !== expr.inner ? { ...expr, inner: t } : expr;
        }
        case 'eqLiteral':
            const t = transformExpr(expr.value, visitor, level);
            return t !== expr.value ? { ...expr, value: t } : expr;
        case 'slice': {
            const value = transformExpr(expr.value, visitor, level);
            const start = transformExpr(expr.start, visitor, level);
            const end = expr.end
                ? transformExpr(expr.end, visitor, level)
                : null;
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
        case 'tupleAccess': {
            const target = transformExpr(expr.target, visitor, level);
            return target !== expr.target ? { ...expr, target } : expr;
        }
        case 'arrayIndex': {
            const value = transformExpr(expr.value, visitor, level);
            const idx = transformExpr(expr.idx, visitor, level);
            return value !== expr.value || idx !== expr.idx
                ? { ...expr, value, idx }
                : expr;
        }
        case 'Trace': {
            let changed = false;
            const args = expr.args.map((item) => {
                const i = transformExpr(item, visitor, level);
                changed = changed || i !== item;
                return i;
            });
            return changed ? { ...expr, args } : expr;
        }
        case 'tuple': {
            let changed = false;
            const items = expr.items.map((item) => {
                const i = transformExpr(item, visitor, level);
                changed = changed || i !== item;
                return i;
            });
            return changed ? { ...expr, items } : expr;
        }
        case 'array': {
            let changed = false;
            const items = expr.items.map((item) => {
                if (item.type === 'Spread') {
                    const value = transformExpr(item.value, visitor, level);
                    changed = changed || value !== item.value;
                    return { ...item, value };
                }
                const i = transformExpr(item, visitor, level);
                changed = changed || i !== item;
                return i;
            });
            return changed ? { ...expr, items } : expr;
        }
        case 'arrayLen':
        case 'IsRecord': {
            const value = transformExpr(expr.value, visitor, level);
            return value !== expr.value ? { ...expr, value } : expr;
        }
        case 'apply': {
            const target = transformExpr(expr.target, visitor, level);
            let changed = false;
            const args = expr.args.map((arg) => {
                const a = transformExpr(arg, visitor, level);
                changed = changed || a !== arg;
                return a;
            });
            return changed || target !== expr.target
                ? { ...expr, target, args }
                : expr;
        }
        case 'attribute':
        case 'effectfulOrDirect': {
            const target = transformExpr(expr.target, visitor, level);
            return target !== expr.target ? { ...expr, target } : expr;
        }
        case 'effectfulOrDirectLambda': {
            const effectful = transformLambdaExpr(
                expr.effectful,
                visitor,
                level,
            );
            const direct = transformLambdaExpr(expr.direct, visitor, level);
            return effectful !== expr.effectful || direct !== expr.direct
                ? { ...expr, direct, effectful }
                : expr;
        }
        case 'lambda':
            return transformLambdaExpr(expr, visitor, level);
        case 'raise': {
            let changed = false;
            const args = expr.args.map((arg) => {
                const argn = transformExpr(arg, visitor, level);
                changed = changed || argn !== arg;
                return argn;
            });
            const done = transformExpr(expr.done, visitor, level);
            return changed || done !== expr.done
                ? { ...expr, args, done }
                : expr;
        }
        case 'handle': {
            const target = transformExpr(expr.target, visitor, level);
            let changed = false;
            const cases = expr.cases.map((kase) => {
                const body = transformLambdaBody(kase.body, visitor, level);
                changed = changed || body !== kase.body;
                return body !== kase.body ? { ...kase, body } : kase;
            });
            const body = transformLambdaBody(expr.pure.body, visitor, level);
            return target !== expr.target || changed || body !== expr.pure.body
                ? { ...expr, target, cases, pure: { ...expr.pure, body } }
                : expr;
        }
        case 'record': {
            let base = expr.base;
            if (base.type === 'Variable') {
                const spread = transformExpr(base.spread, visitor, level);
                if (spread !== base.spread) {
                    base = { ...base, spread };
                }
            } else {
                const spread = base.spread
                    ? transformExpr(base.spread, visitor, level)
                    : base.spread;
                let changed = false;
                const rows = base.rows.map((row) => {
                    const r = row ? transformExpr(row, visitor, level) : row;
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
                    ? transformExpr(subType.spread, visitor, level)
                    : subType.spread;
                let subTypeChanged = false;
                const rows = subType.rows.map((row) => {
                    const r = row ? transformExpr(row, visitor, level) : row;
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
    level: number,
): LambdaExpr => {
    const body = transformLambdaBody(expr.body, visitor, level + 1);
    return body !== expr.body ? { ...expr, body } : expr;
};

export const transformLambdaBody = (
    body: Block,
    visitor: Visitor,
    level: number,
): Block => {
    return transformBlock(body, visitor, level + 1);
};

export const transformBlock = (
    block: Block,
    visitor: Visitor,
    level: number = 0,
): Block => {
    const tr = visitor.block(block);
    if (tr === false) {
        return block;
    }
    if (tr != null) {
        block = tr;
    }
    let changed = false;
    const items: Array<Stmt> = [];
    block.items.forEach((stmt) => {
        const s = transformStmt(stmt, visitor, level + 1);
        changed = changed || s !== stmt;
        if (Array.isArray(s)) {
            items.push(...s);
        } else {
            items.push(s);
        }
    });
    return changed ? { ...block, items } : block;
};

export const transformStmt = (
    stmt: Stmt,
    visitor: Visitor,
    level: number = 0,
): Stmt | Array<Stmt> => {
    const tr = visitor.stmt(stmt);
    if (tr === false) {
        return stmt;
    }
    if (tr != null) {
        if (Array.isArray(tr)) {
            return tr.map((s) => transformOneStmt(s, visitor, level + 1));
        }
        stmt = tr;
    }
    return transformOneStmt(stmt, visitor, level + 1);
};

// NOTE: Does not visit the stmt!
export const transformOneStmt = (
    stmt: Stmt,
    visitor: Visitor,
    level: number = 0,
): Stmt => {
    level += 1;
    switch (stmt.type) {
        case 'Expression': {
            const expr = transformExpr(stmt.expr, visitor, level);
            return expr !== stmt.expr ? { ...stmt, expr } : stmt;
        }
        case 'Define': {
            const value: Expr | null = stmt.value
                ? transformExpr(stmt.value, visitor, level)
                : stmt.value;
            return value !== stmt.value ? { ...stmt, value } : stmt;
        }
        case 'Return':
        case 'Assign': {
            const value: Expr = transformExpr(stmt.value, visitor, level);
            return value !== stmt.value ? { ...stmt, value } : stmt;
        }
        case 'Loop': {
            const body = transformBlock(stmt.body, visitor, level);
            return body !== stmt.body ? { ...stmt, body } : stmt;
        }
        case 'Continue':
        case 'MatchFail':
            return stmt;
        case 'if': {
            const cond = transformExpr(stmt.cond, visitor, level);
            const yes = transformBlock(stmt.yes, visitor, level);
            const no = stmt.no
                ? transformBlock(stmt.no, visitor, level)
                : stmt.no;
            return cond !== stmt.cond || yes !== stmt.yes || no !== stmt.no
                ? { ...stmt, cond, yes, no }
                : stmt;
        }
        case 'Block':
            return transformBlock(stmt, visitor, level);
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
