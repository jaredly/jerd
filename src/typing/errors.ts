import { Identifier, Location } from '../parsing/parser';
import { printToString } from '../printing/printer';
import { effToPretty } from '../printing/printTsLike';
import { EffectRef, Env, LambdaType, Type } from './types';

export class TypeError extends Error {
    inner: TypeError | null = null;
    constructor(message?: string) {
        super(message || `Type error!`);
    }
    wrap(inner: TypeError) {
        this.inner = inner;
        return this;
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
}

export class TypeMismatch extends LocatedError {
    found: Type;
    expected: Type;
    constructor(found: Type, expected: Type) {
        super(found.location);
        this.found = found;
        this.expected = expected;
    }
}

export class WrongEffects extends LocatedError {
    found: LambdaType;
    expected: LambdaType;
    env: Env;
    constructor(found: LambdaType, expected: LambdaType, env: Env) {
        super(found.location);
        this.found = found;
        this.expected = expected;
        this.env = env;
    }
    toString() {
        return `Effects don't match!\nFound: ${this.found.effects
            .map((e) => effToString(this.env, e))
            .join(', ')}\nExpected: ${this.expected.effects
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
