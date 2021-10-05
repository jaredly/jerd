import {
    Expression,
    parseTyped,
    WithUnary,
    WithUnary_inner,
    Location,
} from '../parsing/parser-new';
import { idFromName, idName } from '../typing/env';
import {
    nullLocation,
    Term,
    Type,
    TypeError,
    ErrorTerm,
    Symbol,
    Id,
} from '../typing/types';
import * as preset from '../typing/preset';
import { GroupedOp, reGroupOps } from './ops';
import { Context, ctxToEnv, NamedDefns } from './typeFile';
import { typeExpression } from './typeExpression';
import { addRecord, addTerm } from './Library';
import { printToString } from '../printing/printer';
import { termToPretty } from '../printing/printTsLike';
import { showLocation } from '../typing/typeExpr';
import { transformTerm } from '../typing/auto-transform';
import { showType } from '../typing/unify';
import { newContext } from './test-utils';
import { typeType } from './typeType';

export const parseType = (ctx: Context, text: string) => {
    const parsed = parseTyped(`const x: ${text} = 1`);
    const top = parsed.tops!.items[0].top;
    if (top.type !== 'Define' || !top.ann) {
        throw new Error(`fundamental parser error on ${text}`);
    }
    return typeType(ctx, top.ann);
};

describe('typeType', () => {
    it('should work', () => {
        const ctx = newContext();
        const res = parseType(ctx, 'int');
    });
});
