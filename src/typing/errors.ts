import { Identifier } from '../parsing/parser';
import { showLocation } from './typeExpr';
import { Env, Type } from './types';

export class TypeError extends Error {}
export class UnresolvedIdentifier extends TypeError {
    id: Identifier;
    env: Env;
    hint?: Type;
    constructor(id: Identifier, env: Env, hint?: Type) {
        super(
            `Identifier "${id.text}" at ${showLocation(
                id.location,
            )} hasn't been defined anywhere`,
        );
        this.id = id;
        this.env = env;
        this.hint = hint;
    }
}
