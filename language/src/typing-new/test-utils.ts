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
    typesEqual,
    Pattern,
    ErrorPattern,
} from '../typing/types';
import * as preset from '../typing/preset';
import { GroupedOp, reGroupOps } from './ops';
import { ctxToEnv } from './migrate';
import { Context, NamedDefns } from './Context';
import { typeExpression } from './typeExpression';
import {
    addRecord,
    addTerm,
    addToplevel,
    ErrorTracker,
    errorTracker,
    errorVisitor,
    Library,
} from './Library';
import { printToString } from '../printing/printer';
import {
    patternToPretty,
    termToPretty,
    typeToPretty,
} from '../printing/printTsLike';
import { showLocation } from '../typing/typeExpr';
import {
    isErrorPattern,
    isErrorTerm,
    isErrorType,
    transformPattern,
    transformTerm,
    transformType,
    Visitor,
} from '../typing/auto-transform';
import { showType } from '../typing/unify';
import { typeToplevel } from './typeFile';
import { findErrors } from './typeRecord';
import { patternIs } from '../typing/typePattern';

declare global {
    namespace jest {
        interface Matchers<R> {
            toNotHaveErrorsP(ctx: Context): CustomMatcherResult;
            toNotHaveErrors(ctx: Context): CustomMatcherResult;
            toNotHaveErrorsT(ctx: Context): CustomMatcherResult;
            toEqualType(t: Type, ctx: Context): CustomMatcherResult;
        }
    }
}

export const fakeOp = (t: Type) =>
    preset.lambdaLiteral(
        [
            { sym: { unique: 0, name: 'left' }, is: t, location: nullLocation },
            {
                sym: { name: 'right', unique: 1 },
                is: t,
                location: nullLocation,
            },
        ],
        {
            type: 'Hole',
            is: t,
            location: nullLocation,
        },
    );

export const showTermErrors = (ctx: Context, res: Term) => {
    return findErrors(res)
        .map(
            (err) =>
                `${showErrorTerm(ctx, err)} at ${showLocation(err.location)}`,
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

export const parseToplevels = (
    ctx: Context,
    raw: string,
): [Library, Array<Id>] => {
    let library = ctx.library;
    const parsed = parseTyped(raw);
    const ids: Array<Id> = [];
    parsed.tops!.items.forEach(({ top }) => {
        const typed = typeToplevel({ ...ctx, library }, top);
        if (typed) {
            let id;
            [library, id] = addToplevel(library, typed, {
                created: Date.now(),
            });
            ids.push(id);
        }
    });
    return [library, ids];
};

export const parseExpression = (
    ctx: Context,
    raw: string,
    expected: Array<Type> = [],
) => {
    const parsed = parseTyped(raw);
    const top = parsed.tops!.items[0].top;
    if (top.type !== 'ToplevelExpression') {
        expect(false).toBe(true);
        throw new Error(`nope`);
    }
    return typeExpression(ctx, top.expr, expected);
};

export const showErrorTerm = (ctx: Context, t: ErrorTerm) => {
    switch (t.type) {
        case 'TypeError':
            return `Expected ${typeToString(ctx, t.is)}, found ${typeToString(
                ctx,
                t.inner.is,
            )} : ${termToString(ctx, t.inner)}`;
        case 'Hole':
            return `[Hole]`;
        default:
            return termToString(ctx, t);
    }
};

export const customMatchers: jest.ExpectExtendMap = {
    toEqualType(value, otherValue, ctx) {
        if (typesEqual(value, otherValue)) {
            return { pass: true, message: () => 'ok' };
        }
        return {
            pass: false,
            message: () =>
                `Expected ${typeToString(ctx, value)} to equal ${typeToString(
                    ctx,
                    otherValue,
                )}`,
        };
    },
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
    toNotHaveErrorsP(value, ctx) {
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
        const errors = findPatternErrors(value);
        if (errors.length === 0) {
            return { pass: true, message: () => 'ok' };
        }
        return {
            pass: false,
            message: () =>
                errors
                    .map((pattern) => patternErrorToString(ctx, pattern))
                    .join('\n'),
        };
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

        const tracker = errorTracker();
        transformTerm(value, errorVisitor(tracker), null);

        if (
            tracker.terms.length ||
            tracker.types.length ||
            tracker.patterns.length
        ) {
            return {
                pass: false,
                message: () => {
                    return (
                        tracker.terms
                            .map(
                                (t: ErrorTerm) =>
                                    `${t.type}: ${showErrorTerm(
                                        ctx,
                                        t,
                                    )} at ${showLocation(t.location)}`,
                            )
                            .join('\n') +
                        tracker.types.map(
                            (t: ErrorType) =>
                                `${t.type}: ${typeToString(
                                    ctx,
                                    t,
                                )} at ${showLocation(t.location)}`,
                        ) +
                        tracker.patterns.map((t: ErrorPattern) =>
                            patternErrorToString(ctx, t),
                        )
                    );
                },
            };
        }

        return { pass: true, message: () => 'ok' };
    },
};

export const patternErrorToString = (ctx: Context, pattern: ErrorPattern) => {
    if (pattern.type === 'PTypeError') {
        return `Expected ${typeToString(ctx, pattern.is)}, found ${typeToString(
            ctx,
            patternIs(pattern.inner, pattern.is),
        )} : ${patternToString(ctx, pattern)} ${showLocation(
            pattern.location,
        )}`;
    }
    return (
        `${pattern.type}: ` +
        patternToString(ctx, pattern) +
        ' ' +
        showLocation(pattern.location)
    );
};

export const findPatternErrors = (pattern: Pattern): Array<ErrorPattern> => {
    const errors: Array<ErrorPattern> = [];
    transformPattern(
        pattern,
        {
            Pattern: (node) => {
                if (isErrorPattern(node)) {
                    errors.push(node);
                }
                return null;
            },
        },
        null,
    );
    return errors;
};

export const typeErrorVisitor = (errors: Array<ErrorType>): Visitor<null> => ({
    Type(node: Type, _) {
        if (isErrorType(node)) {
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

export const namedDefns = <T>(): NamedDefns<T> => ({ defns: {}, names: {} });
export const newContext = (): Context => {
    let num = 0;
    return {
        rng: () => num++,
        warnings: [],
        idRemap: {},
        builtins: {
            terms: {},
            types: { int: 0, float: 0, string: 0, void: 0 },
            decorators: {},
            ops: { unary: {}, binary: {} },
        },
        bindings: {
            unique: { current: 0 },
            self: null,
            types: [],
            delayedTypes: [],
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
    };
};

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

export const patternToString = (ctx: Context, term: Pattern | null | void) =>
    term == null
        ? '[null pattern]'
        : printToString(patternToPretty(ctxToEnv(ctx), term), 100);

export const termToString = (ctx: Context, term: Term | null | void) => {
    if (term == null) {
        return '[null term]';
    }
    const res = printToString(termToPretty(ctxToEnv(ctx), term), 100);
    // Wrap toplevel terms with decorators in parens.
    return term.decorators?.length ? `(${res})` : res;
};

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
