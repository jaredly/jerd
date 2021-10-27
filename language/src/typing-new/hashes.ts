import { idFromName } from '../typing/env';
import { Id } from '../typing/types';

export type IdRemap = { [k: string]: string };
export type IdOrSym =
    | { type: 'sym'; unique: number }
    | {
          type: 'id';
          id: Id;
      };

export const remap = (map: IdRemap, hash: string) => map[hash] || hash;

// All functions expect the first '#' to be stripped off
export const parseOpHash = (map: IdRemap, hash: string) => {
    const idx = hash.indexOf('#');
    if (idx === -1) {
        return null;
    }
    return {
        value: parseIdOrSym(map, hash.slice(0, idx)),
        attr: parseAttrHash(map, hash.slice(idx + 1)),
    };
};

export const parseSym = (hash: string | null | undefined): number | null => {
    if (hash?.startsWith(':')) {
        const num = +hash.slice(1);
        return isNaN(num) ? null : num;
    }
    return null;
};

export const parseIdOrSym = (map: IdRemap, hash: string): IdOrSym | null => {
    if (hash.startsWith(':')) {
        const num = +hash.slice(1);
        return isNaN(num) ? null : { type: 'sym', unique: num };
    }
    return { type: 'id', id: idFromName(remap(map, hash)) };
};

export const parseAttrHash = (map: IdRemap, hash: string) => {
    const idx = hash.indexOf('#');
    if (idx === -1) {
        return null;
    }
    const attr = +hash.slice(idx + 1);
    if (isNaN(attr)) {
        return null;
    }
    return { type: idFromName(remap(map, hash.slice(0, idx))), attr };
};
