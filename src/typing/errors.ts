import { Identifier } from '../parsing/parser';
import { showLocation } from './typeExpr';
import { Type } from './types';

export class TypeError extends Error {}
export class UnresolvedIdentifier extends TypeError {
    id: Identifier;
    hint?: Type;
    constructor(id: Identifier, hint?: Type) {
        super(
            `Identifier "${id.text}" at ${showLocation(
                id.location,
            )} hasn't been defined anywhere`,
        );
        this.id = id;
        this.hint = hint;
    }
}
