import { Identifier, Location } from '../parsing/parser';
import { Expr } from '../printing/ir/types';
import { printToString } from '../printing/printer';
import { effToPretty, refToPretty, symToPretty } from '../printing/printTsLike';
import { EffectRef, Env, LambdaType, Reference, Symbol, Type } from './types';
import { showType } from './unify';

export class TypeError extends Error {
    inner: TypeError | null = null;
    constructor(message?: string) {
        super(message || `Type error!`);
        if (!message) {
            this.message += this.constructor.name;
        }
    }
    wrap(inner: TypeError) {
        this.inner = inner;
        return this;
    }
    wrapped(wrapper: TypeError) {
        return wrapper.wrap(this);
    }
    getMessage() {
        return this.message;
    }
    toString(): string {
        return (
            this.getMessage() +
            (this.inner ? '\n --> ' + this.inner.toString() : '')
        );
    }
    showParents() {}
}

export class LocatedError extends TypeError {
    loc: Location | null;
    constructor(loc: Location | null, message?: string) {
        super(message);
        this.loc = loc;
    }
}

export class UniqueError extends LocatedError {
    expr: Expr;
    constructor(loc: Location, expr: Expr, num: number) {
        super(loc, `Multiple declarations for unique: ${num}`);
        this.expr = expr;
    }
}

export class UnresolvedIdentifier extends LocatedError {
    id: Identifier;
    env: Env;
    hint?: Type;
    constructor(id: Identifier, env: Env, hint?: Type) {
        super(id.location, `Identifier ${id.text} ${id.hash}`);
        this.id = id;
        this.env = env;
        this.hint = hint;
    }

    getMessage() {
        return `Unresolved identifier: ${this.id.text} hasn't been defined anywhere!`;
    }
}

export class VarMismatch extends LocatedError {
    env: Env | null;
    found: Symbol;
    expected: Symbol;
    constructor(
        env: Env | null,
        found: Symbol,
        expected: Symbol,
        location: Location,
    ) {
        super(location);
        this.env = env;
        this.found = found;
        this.expected = expected;
    }

    getMessage() {
        return `Mismatched vars! found ${printToString(
            symToPretty(null, this.found),
            100,
        )}, expected ${printToString(symToPretty(null, this.expected), 100)}`;
    }
}

export class RefMismatch extends LocatedError {
    env: Env | null;
    found: Reference;
    expected: Reference;
    constructor(
        env: Env | null,
        found: Reference,
        expected: Reference,
        location: Location,
    ) {
        super(location);
        this.env = env;
        this.found = found;
        this.expected = expected;
    }

    getMessage() {
        return `Mismatched refs! found ${printToString(
            refToPretty(this.env, this.found, 'error'),
            100,
        )}, expected ${printToString(
            refToPretty(this.env, this.expected, 'error'),
            100,
        )}`;
    }
}

export class TypeMismatch extends LocatedError {
    env: Env | null;
    found: Type;
    expected: Type;
    constructor(
        env: Env | null,
        found: Type,
        expected: Type,
        location: Location,
    ) {
        super(location);
        this.env = env;
        this.found = found;
        this.expected = expected;
    }
    getMessage() {
        return `Type Mismatch! Found ${showType(
            this.env,
            this.found,
        )}, expected ${showType(this.env, this.expected)}`;
    }
}

export class WrongEffects extends LocatedError {
    found: EffectRef[];
    expected: EffectRef[];
    env: Env | null;
    mapping: { [k: number]: number };
    constructor(
        found: EffectRef[],
        expected: EffectRef[],
        env: Env | null,
        location: Location,
        mapping: { [k: number]: number },
    ) {
        super(location);
        this.found = found;
        this.expected = expected;
        this.env = env;
        this.mapping = mapping;
    }
    getMessage() {
        return `Effects don't match!\nFound: ${this.found
            .map((e) => effToString(this.env, e))
            .join(', ')}\nExpected: ${this.expected
            .map((e) => effToString(this.env, e))
            .join(', ')}\nWhile applying the mapping: ${JSON.stringify(
            this.mapping,
        )}`;
    }
}

export const effToString = (env: Env | null, eff: EffectRef) =>
    printToString(effToPretty(env, eff), 100);

export class MismatchedArgument extends LocatedError {
    env: Env | null;
    idx: number;
    found: LambdaType;
    expected: LambdaType;
    constructor(
        env: Env | null,
        idx: number,
        found: LambdaType,
        expected: LambdaType,
    ) {
        super(found.location);
        this.env = env;
        this.idx = idx;
        this.found = found;
        this.expected = expected;
    }
    getMessage() {
        return `Mismatch at argument ${this.idx}:\n${showType(
            this.env,
            this.found,
        )}\nExpected\n${showType(this.env, this.expected)}`;
    }
}

export class MismatchedTypeVbl extends LocatedError {
    idx: number;
    env: Env | null;
    found: Type;
    expected: Type;
    constructor(
        env: Env | null,
        idx: number,
        found: Type,
        expected: Type,
        location: Location,
    ) {
        super(location);
        this.env = env;
        this.idx = idx;
        this.found = found;
        this.expected = expected;
    }
    getMessage() {
        return `Mismatch type variable ${this.idx}, in type ${showType(
            this.env,
            this.found,
        )}, expected ${showType(this.env, this.expected)}`;
    }
}
