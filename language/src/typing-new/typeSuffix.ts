import { Expression, Suffix } from '../parsing/parser-new';
import { idFromName, idName } from '../typing/env';
import { bool, void_ } from '../typing/preset';
import { Id, LambdaType, Term, Type, typesEqual } from '../typing/types';
import { Context } from './Context';
import { parseIdOrSym } from './hashes';
import { resolveValue } from './resolve';
import { typeApply } from './typeApply';
import { typeAs } from './typeAs';
import { typeAttribute } from './typeAttribute';
import { typeExpression, wrapExpected } from './typeExpression';
import { asAs } from './typeTemplateString';
import { typeType } from './typeType';

export const typeSuffix = (
    ctx: Context,
    suffix: Suffix,
    inner: Expression,
    expected: Array<Type>,
): Term => {
    switch (suffix.type) {
        case 'ApplySuffix': {
            return typeApply(ctx, suffix, inner, expected);
        }
        case 'AsSuffix': {
            return typeAs(ctx, suffix, inner, expected);
        }
        case 'AttributeSuffix': {
            return typeAttribute(ctx, suffix, inner, expected);
        }
        // ok I'll wait on this until I do the new array dealios? maybe?
        // I mean we can index into tuples, it's fine.
        case 'IndexSuffix': {
            return {
                type: 'Hole',
                is: expected.length ? expected[0] : void_,
                location: suffix.location,
            };
        }
    }
};

// const isUntypedSym = (ctx: Context, inner: Expression) => {
//     if (inner.type === 'Identifier') {
//         if (inner.hash) {
//             const res = parseIdOrSym(inner.hash.slice(1));
//             if (res?.type === 'sym') {
//                 const binding = ctx.bindings.values.find(
//                     (b) => b.sym.unique === res.unique,
//                 );
//                 if (binding && binding.type === null) {
//                     return true;
//                 }
//             }
//         }
//         const binding = ctx.bindings.values.find(
//             (b) => b.sym.name === inner.text,
//         );
//         if (binding && binding.type === null) {
//             return true;
//         }
//     }
//     return false;
// };
