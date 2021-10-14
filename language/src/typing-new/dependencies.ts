import { Visitor } from '../typing/auto-transform';
import { refName } from '../typing/env';
import { Reference, Term, Type, UserReference } from '../typing/types';

export type Ctx =
    | ['Term', Term['type']]
    | ['Type', Type['type']]
    | 'Effect'
    | null;

export const dependenciesVisitor = (collection: {
    [key: string]: [Ctx, Reference];
}): Visitor<Ctx> => ({
    Term: (t, __) => [null, ['Term', t.type]],
    Type: (t, __) => [null, ['Type', t.type]],
    EffectRef: (t, __) => [null, 'Effect'],
    // andddd so we're ignoring effects.
    Reference: (ref, ctx) => {
        collection[refName(ref)] = [ctx, ref];

        return null;
    },
});
