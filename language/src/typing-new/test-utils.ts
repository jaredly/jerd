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

export const findErrors = (term: Term | null | void) => {
    if (!term) {
        return [];
    }
    const errors: Array<ErrorTerm> = [];
    transformTerm(
        term,
        {
            Term(node: Term, _) {
                if (
                    node.type === 'TypeError' ||
                    node.type === 'Hole' ||
                    node.type === 'Ambiguous' ||
                    node.type === 'NotFound'
                ) {
                    errors.push(node);
                }
                return null;
            },
        },
        null,
    );
    return errors;
};

export const namedDefns = <T>(): NamedDefns<T> => ({ defns: {}, names: {} });
export const newContext = (): Context => ({
    warnings: [],
    builtins: { terms: {}, types: {} },
    bindings: {
        unique: { current: 0 },
        self: null,
        types: [],
        values: [],
        effects: [],
    },
    library: {
        terms: namedDefns(),
        decorators: namedDefns(),
        types: {
            ...namedDefns(),
            constructors: { names: {}, idToNames: {} },
            superTypes: {},
        },
        effects: {
            ...namedDefns(),
            constructors: { names: {}, idToNames: {} },
        },
    },
});

export const rawSnapshotSerializer: jest.SnapshotSerializerPlugin = {
    test(value) {
        return value && typeof value === 'string';
    },
    print(value, _, __) {
        return value as string;
    },
};

export const errorSerilaizer: jest.SnapshotSerializerPlugin = {
    test(value) {
        return (
            value &&
            typeof value === 'object' &&
            typeof value.ctx === 'object' &&
            Array.isArray(value.errors)
        );
    },
    print(value, _, __) {
        const v = value as { ctx: Context; errors: Array<ErrorTerm> };
        return v.errors
            .map(
                (t: ErrorTerm) =>
                    `${termToString(v.ctx, t)} at ${showLocation(t.location)}`,
            )
            .join('\n');
    },
};

const termToString = (ctx: Context, term: Term | null | void) =>
    term == null
        ? '[null term]'
        : printToString(termToPretty(ctxToEnv(ctx), term), 100);

export const warningsSerializer: jest.SnapshotSerializerPlugin = {
    test(value) {
        return (
            Array.isArray(value) &&
            value.every(
                (v) =>
                    v &&
                    typeof v.text === 'string' &&
                    typeof v.location === 'object',
            )
        );
    },
    print(value, _, __) {
        return (value as Array<{ location: Location; text: string }>)
            .map((item) => `${showLocation(item.location)}: ${item.text}`)
            .join('\n');
    },
};
