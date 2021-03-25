import { Identifier, Location } from '../parsing/parser';
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
    toString() {
        return this.message;
    }
}

export class LocatedError extends TypeError {
    loc: Location | null;
    constructor(loc: Location | null, message?: string) {
        super(message);
        this.loc = loc;
    }
}

export class UnresolvedIdentifier extends LocatedError {
    id: Identifier;
    env: Env;
    hint?: Type;
    constructor(id: Identifier, env: Env, hint?: Type) {
        super(id.location);
        this.id = id;
        this.env = env;
        this.hint = hint;
    }

    toString() {
        return `Unresolved identifier: ${this.id.text} hasn't been defined anywhere!`;
    }
}

export class VarMismatch extends LocatedError {
    env: Env;
    found: Symbol;
    expected: Symbol;
    constructor(env: Env, found: Symbol, expected: Symbol, location: Location) {
        super(location);
        this.env = env;
        this.found = found;
        this.expected = expected;
    }

    toString() {
        return `Mismatched refs! found ${printToString(
            symToPretty(this.found),
            100,
        )}, expected ${printToString(symToPretty(this.expected), 100)}`;
    }
}

export class RefMismatch extends LocatedError {
    env: Env;
    found: Reference;
    expected: Reference;
    constructor(
        env: Env,
        found: Reference,
        expected: Reference,
        location: Location,
    ) {
        super(location);
        this.env = env;
        this.found = found;
        this.expected = expected;
    }

    toString() {
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
    env: Env;
    found: Type;
    expected: Type;
    constructor(env: Env, found: Type, expected: Type, location: Location) {
        super(location);
        this.env = env;
        this.found = found;
        this.expected = expected;
    }
    toString() {
        return `Type Mismatch! Found ${showType(
            this.env,
            this.found,
        )}, expected ${showType(this.env, this.expected)}`;
    }
}

export class WrongEffects extends LocatedError {
    found: EffectRef[];
    expected: EffectRef[];
    env: Env;
    constructor(
        found: EffectRef[],
        expected: EffectRef[],
        env: Env,
        location: Location,
    ) {
        super(location);
        this.found = found;
        this.expected = expected;
        this.env = env;
    }
    toString() {
        return `Effects don't match!\nFound: ${this.found
            .map((e) => effToString(this.env, e))
            .join(', ')}\nExpected: ${this.expected
            .map((e) => effToString(this.env, e))
            .join(', ')}`;
    }
}

export const effToString = (env: Env, eff: EffectRef) =>
    printToString(effToPretty(env, eff), 100);

export class MismatchedArgument extends LocatedError {
    idx: number;
    found: LambdaType;
    expected: LambdaType;
    constructor(idx: number, found: LambdaType, expected: LambdaType) {
        super(found.location);
        this.idx = idx;
        this.found = found;
        this.expected = expected;
    }
}

export class MismatchedTypeVbl extends LocatedError {
    idx: number;
    env: Env;
    found: Type;
    expected: Type;
    constructor(
        env: Env,
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
    toString() {
        return `Mismatch type variable ${this.idx}, in type ${showType(
            this.env,
            this.found,
        )}, expected ${showType(this.env, this.expected)}`;
    }
}
