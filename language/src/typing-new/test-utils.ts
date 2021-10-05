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
    ErrorType,
} from '../typing/types';
import * as preset from '../typing/preset';
import { GroupedOp, reGroupOps } from './ops';
import { Context, ctxToEnv, NamedDefns } from './typeFile';
import { typeExpression } from './typeExpression';
import { addRecord, addTerm } from './Library';
import { printToString } from '../printing/printer';
import { termToPretty, typeToPretty } from '../printing/printTsLike';
import { showLocation } from '../typing/typeExpr';
import {
    transformTerm,
    transformType,
    Visitor,
} from '../typing/auto-transform';
import { showType } from '../typing/unify';

declare global {
    namespace jest {
        interface Matchers<R> {
            toNotHaveErrors(ctx: Context): CustomMatcherResult;
            toNotHaveErrorsT(ctx: Context): CustomMatcherResult;
        }
    }
}

export const showTermErrors = (ctx: Context, res: Term) => {
    return findErrors(res)
        .map(
            (err) =>
                `${termToString(ctx, err)} at ${showLocation(err.location)}`,
        )
        .join('\n');
};

export const showTypeErrors = (ctx: Context, res: Type) => {
    return findTypeErrors(res)
        .map(
            (err) =>
                `${showType(ctxToEnv(ctx), err)} at ${showLocation(
                    err.location,
                )}`,
        )
        .join('\n');
};

export const parseExpression = (ctx: Context, raw: string) => {
    const parsed = parseTyped(raw);
    const top = parsed.tops!.items[0].top;
    if (top.type !== 'ToplevelExpression') {
        expect(false).toBe(true);
        throw new Error(`nope`);
    }
    return typeExpression(ctx, top.expr, []);
};

export const customMatchers: jest.ExpectExtendMap = {
    toNotHaveErrorsT(value, ctx) {
        if (
            !value ||
            typeof value !== 'object' ||
            typeof value.type !== 'string'
        ) {
            return {
                pass: false,
                message: () => 'invalid object. must be a term or type',
            };
        }

        const errors = findTypeErrors(value);
        if (errors.length) {
            return {
                pass: false,
                message: () => {
                    return errors
                        .map(
                            (t: ErrorType) =>
                                `${typeToString(ctx, t)} at ${showLocation(
                                    t.location,
                                )}`,
                        )
                        .join('\n');
                },
            };
        }

        return { pass: true, message: () => 'ok' };
    },
    toNotHaveErrors(value, ctx) {
        if (
            !value ||
            typeof value !== 'object' ||
            typeof value.type !== 'string'
        ) {
            return {
                pass: false,
                message: () => 'invalid object. must be a term or type',
            };
        }

        const errors = findErrors(value);
        const terrors = findTermTypeErrors(value);
        if (errors.length || terrors.length) {
            return {
                pass: false,
                message: () => {
                    return (
                        errors
                            .map(
                                (t: ErrorTerm) =>
                                    `${termToString(ctx, t)} at ${showLocation(
                                        t.location,
                                    )}`,
                            )
                            .join('\n') +
                        terrors.map(
                            (t: ErrorType) =>
                                `${typeToString(ctx, t)} at ${showLocation(
                                    t.location,
                                )}`,
                        )
                    );
                },
            };
        }

        return { pass: true, message: () => 'ok' };
    },
};

export const typeErrorVisitor = (errors: Array<ErrorType>): Visitor<null> => ({
    Type(node: Type, _) {
        if (
            node.type === 'NotASubType' ||
            node.type === 'InvalidTypeApplication' ||
            node.type === 'THole' ||
            node.type === 'Ambiguous' ||
            node.type === 'TNotFound'
        ) {
            errors.push(node);
        }
        return null;
    },
});

export const findTypeErrors = (type: Type | null | void) => {
    if (!type) {
        return [];
    }
    const errors: Array<ErrorType> = [];
    transformType(type, typeErrorVisitor(errors), null);
    return errors;
};

export const findTermTypeErrors = (term: Term | null | void) => {
    if (!term) {
        return [];
    }
    const errors: Array<ErrorType> = [];
    transformTerm(term, typeErrorVisitor(errors), null);
    return errors;
};

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

export const errorTypeSerilaizer: jest.SnapshotSerializerPlugin = {
    test(value) {
        return (
            value &&
            typeof value === 'object' &&
            typeof value.ctx === 'object' &&
            Array.isArray(value.errorTypes)
        );
    },
    print(value, _, __) {
        const v = value as { ctx: Context; errorTypes: Array<ErrorType> };
        return v.errorTypes
            .map(
                (t: ErrorType) =>
                    `${typeToString(v.ctx, t)} at ${showLocation(t.location)}`,
            )
            .join('\n');
    },
};

export const typeToString = (ctx: Context, term: Type | null | void) =>
    term == null
        ? '[null term]'
        : printToString(typeToPretty(ctxToEnv(ctx), term), 100);

export const termToString = (ctx: Context, term: Term | null | void) =>
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
