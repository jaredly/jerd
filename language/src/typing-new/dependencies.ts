import { Visitor } from '../typing/auto-transform';
import { idName, refName } from '../typing/env';
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
    Decorator: (d, ctx) => {
        collection[refName({ type: 'user', id: d.name.id })] = [
            ctx,
            { type: 'user', id: d.name.id },
        ];
        return null;
    },
    UserTypeReference: (t, __) => [null, ['Type', 'ref']],
    UserReference: (ref, ctx) => {
        collection[refName(ref)] = [ctx, ref];

        return null;
    },
    // ToplevelT: (t, __) => {
    //     if (t.type === 'RecordDef') {
    //         t.def.extends.forEach((id) => {
    //             collection[refName({ type: 'user', id })] = [
    //                 ['Type', 'ref'],
    //                 { type: 'user', id },
    //             ];
    //         });
    //     }
    //     if (t.type === 'EnumDef') {
    //         t.def.extends.forEach(({ ref: { id } }) => {
    //             collection[refName({ type: 'user', id })] = [
    //                 ['Type', 'ref'],
    //                 { type: 'user', id },
    //             ];
    //         });
    //     }
    //     return null;
    // },
    // andddd so we're ignoring effects.
    Reference: (ref, ctx) => {
        collection[refName(ref)] = [ctx, ref];

        return null;
    },
});
