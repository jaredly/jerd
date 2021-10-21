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

export const resolveTypeVbl = (
    typeWithVbl: Type,
    concreteType: Type,
    vbl: number,
): null | Type => {
    switch (typeWithVbl.type) {
        case 'var':
            return typeWithVbl.sym.unique === vbl ? concreteType : null;
        case 'ref': {
            if (concreteType.type !== 'ref') {
                return null;
            }
            for (
                let i = 0;
                i < typeWithVbl.typeVbls.length &&
                i < concreteType.typeVbls.length;
                i++
            ) {
                const inner = resolveTypeVbl(
                    typeWithVbl.typeVbls[i],
                    concreteType.typeVbls[i],
                    vbl,
                );
                if (inner != null) {
                    return inner;
                }
            }
            return null;
        }
        case 'lambda': {
            if (concreteType.type !== 'lambda') {
                return null;
            }
            for (
                let i = 0;
                i < Math.min(typeWithVbl.args.length, concreteType.args.length);
                i++
            ) {
                const inner = resolveTypeVbl(
                    typeWithVbl.args[i],
                    concreteType.args[i],
                    vbl,
                );
                if (inner != null) {
                    return inner;
                }
            }
            return resolveTypeVbl(typeWithVbl.res, concreteType.res, vbl);
        }
    }
    return null;
};
