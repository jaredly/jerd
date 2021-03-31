import { showLocation } from '../../typing/typeExpr';
import { Symbol } from '../../typing/types';
import { defaultVisitor, transformExpr, Visitor } from './transform';
import { Expr, Stmt } from './types';
import { and } from './utils';

const symName = (sym: Symbol) => `${sym.name}$${sym.unique}`;

export const optimize = (expr: Expr): Expr => {
    const transformers: Array<(e: Expr) => Expr> = [
        removeUnusedVariables,
        removeNestedBlocksWithoutDefines,
        flattenNestedIfs,
    ];
    transformers.forEach((t) => (expr = t(expr)));
    return expr;
};

// TODO: need an `&&` logicOp type. Or just a general binOp type?
// or something. Maybe have && be a builtin, binop.
export const flattenNestedIfs = (expr: Expr): Expr => {
    return transformRepeatedly(expr, {
        ...defaultVisitor,
        stmt: (stmt) => {
            if (stmt.type !== 'if') {
                return null;
            }
            if (stmt.no != null) {
                return null;
            }
            if (stmt.yes.items.length !== 1) {
                return null;
            }
            if (stmt.yes.items[0].type !== 'if') {
                return null;
            }
            if (stmt.yes.items[0].no !== null) {
                return null;
            }
            return {
                ...stmt,
                cond: and(stmt.cond, stmt.yes.items[0].cond, stmt.loc),
                yes: stmt.yes.items[0].yes,
            };
        },
    });
};

export const transformRepeatedly = (expr: Expr, visitor: Visitor): Expr => {
    while (true) {
        const nexp = transformExpr(expr, visitor);
        if (nexp === expr) {
            break;
        }
        expr = nexp;
    }
    return expr;
};

export const removeNestedBlocksWithoutDefines = (expr: Expr): Expr => {
    return transformRepeatedly(expr, {
        ...defaultVisitor,
        block: (block) => {
            const items: Array<Stmt> = [];
            let changed = false;
            block.items.forEach((item) => {
                if (
                    item.type === 'Block' &&
                    !item.items.some((item) => item.type === 'Define')
                ) {
                    changed = true;
                    items.push(...item.items);
                } else {
                    items.push(item);
                }
            });
            return changed ? { ...block, items } : block;
        },
    });
};

export const removeUnusedVariables = (expr: Expr): Expr => {
    const used: { [key: string]: boolean } = {};
    const visitor: Visitor = {
        ...defaultVisitor,
        expr: (value: Expr) => {
            switch (value.type) {
                case 'var':
                    used[symName(value.sym)] = true;
            }
            return null;
        },
    };
    if (transformExpr(expr, visitor) !== expr) {
        throw new Error(`Noop visitor somehow mutated`);
    }
    const remover: Visitor = {
        ...defaultVisitor,
        block: (block) => {
            const items = block.items.filter((stmt) => {
                const unused =
                    (stmt.type === 'Define' || stmt.type === 'Assign') &&
                    used[symName(stmt.sym)] !== true;
                return !unused;
            });
            return items.length !== block.items.length
                ? { ...block, items }
                : null;
        },
    };
    return transformExpr(expr, remover);
};
