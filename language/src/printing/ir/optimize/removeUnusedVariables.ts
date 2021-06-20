import { Symbol } from '../../../typing/types';
import { defaultVisitor, transformExpr, Visitor } from '../transform';
import { Expr } from '../types';
import { Context, symName } from './optimize';

export const getAllDefined = (expr: Expr) => {
    const defined: { [key: number]: true } = {};
    transformExpr(expr, {
        ...defaultVisitor,
        stmt: (stmt) => {
            if (stmt.type === 'Define') {
                defined[stmt.sym.unique] = true;
            }
            return null;
        },
    });
    return defined;
};

export const getAllDefinedNames = (expr: Expr) => {
    const defined: { [key: string]: true } = {};
    transformExpr(expr, {
        ...defaultVisitor,
        stmt: (stmt) => {
            if (stmt.type === 'Define') {
                defined[stmt.sym.name] = true;
            }
            return null;
        },
    });
    return defined;
};

export const expectDefinedNames = (
    expr: Expr,
    defined: Array<string>,
    eliminated: Array<string>,
) => {
    const allDefined = getAllDefinedNames(expr);
    defined.forEach((sym) => {
        expect(allDefined).toMatchObject({ [sym]: true });
    });
    eliminated.forEach((sym) => {
        expect(allDefined).not.toMatchObject({ [sym]: true });
    });
};

export const expectDefined = (
    expr: Expr,
    defined: Array<Symbol>,
    eliminated: Array<Symbol>,
) => {
    const allDefined = getAllDefined(expr);
    defined.forEach((sym) => {
        expect(allDefined).toMatchObject({ [sym.unique]: true });
    });
    eliminated.forEach((sym) => {
        expect(allDefined).not.toMatchObject({ [sym.unique]: true });
    });
};

export const removeUnusedVariables = (ctx: Context, expr: Expr): Expr => {
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
        stmt: (stmt) => {
            if (
                (stmt.type === 'Define' || stmt.type === 'Assign') &&
                used[symName(stmt.sym)] !== true
            ) {
                return [];
            }
            return null;
        },
        // block: (block) => {
        //     const items = block.items.filter((stmt) => {
        //         const unused =
        //             (stmt.type === 'Define' || stmt.type === 'Assign') &&
        //             used[symName(stmt.sym)] !== true;
        //         return !unused;
        //     });
        //     return items.length !== block.items.length
        //         ? { ...block, items }
        //         : null;
        // },
    };
    return transformExpr(expr, remover);
};
