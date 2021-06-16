import { defaultVisitor } from '../transform';
import {
    Expr,
    OutputOptions,
    Record,
    RecordSubType,
    Stmt,
    Tuple,
    Type,
} from '../types';
import { and, asBlock, builtin, iffe } from '../utils';
import { optimizer } from './utils';

// This flattens IFFEs that are the bodies of a lambda expr, or
// the value of a return statement.
export const flattenIffe = optimizer({
    ...defaultVisitor,
    block: (block) => {
        const items: Array<Stmt> = [];
        let changed = false;
        block.items.forEach((stmt) => {
            if (
                stmt.type === 'Return' &&
                stmt.value.type === 'apply' &&
                stmt.value.args.length === 0 &&
                stmt.value.target.type === 'lambda'
            ) {
                items.push(...asBlock(stmt.value.target.body).items);
                changed = true;
            } else {
                items.push(stmt);
            }
        });
        return changed ? { ...block, items } : block;
    },
    expr: (expr) => {
        // STOPSHIP: Do we still need this?
        // if (
        //     expr.type === 'lambda' &&
        //     expr.body.type === 'apply' &&
        //     expr.body.args.length === 0 &&
        //     expr.body.target.type === 'lambda'
        // ) {
        //     return {
        //         ...expr,
        //         body: expr.body.target.body,
        //     };
        // }
        if (
            expr.type === 'lambda' &&
            // expr.body.type === 'Block' &&
            expr.body.items.length === 1 &&
            expr.body.items[0].type === 'Expression' &&
            expr.body.items[0].expr.type === 'apply' &&
            expr.body.items[0].expr.target.type === 'lambda' &&
            expr.body.items[0].expr.args.length === 0
        ) {
            return {
                ...expr,
                body: expr.body.items[0].expr.target.body,
            };
        }
        return null;
    },
});
