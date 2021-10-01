import { idFromName } from '../typing/env';
import { Id } from '../typing/types';

export type IdOrSym =
    | { type: 'sym'; unique: number }
    | {
          type: 'id';
          id: Id;
      };

// All functions expect the first '#' to be stripped off
export const parseOpHash = (hash: string) => {
    const idx = hash.indexOf('#');
    if (idx === -1) {
        return null;
    }
    return {
        value: parseIdOrSym(hash.slice(0, idx)),
        attr: parseAttrHash(hash.slice(idx + 1)),
    };
};

export const parseIdOrSym = (hash: string): IdOrSym | null => {
    if (hash.startsWith(':')) {
        const num = +hash.slice(1);
        return isNaN(num) ? null : { type: 'sym', unique: num };
    }
    return { type: 'id', id: idFromName(hash) };
};

export const parseAttrHash = (hash: string) => {
    const idx = hash.indexOf('#');
    if (idx === -1) {
        return null;
    }
    const attr = +hash.slice(idx + 1);
    if (isNaN(attr)) {
        return null;
    }
    return { type: parseIdOrSym(hash.slice(0, idx)), attr };
};
