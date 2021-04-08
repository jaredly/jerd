// Checking if types are equivalent

import { EffectRef, Term, Type, walkTerm } from './types';

// export type SingleVarLookup = {
//     vars: VarMapping;
//     unique: number;
// };
// export type VarMapping = { [unique: number]: number };

// export const typeMapping = (lookup: SingleVarLookup, type: Type) => {
//     if (type.type === 'lambda') {
//         type.typeVbls.forEach((vbl, i) => {
//             const id = lookup.unique++;
//             lookup.vars[vbl.unique] = id;
//         });
//         type.effectVbls.forEach((eff, i) => {
//             const id = lookup.unique++;
//             lookup.vars[eff] = id;
//         });
//         typeMapping(lookup, type.res);
//         type.args.forEach((arg) => typeMapping(lookup, arg));
//     }
// };

// export const termMapping = (lookup: SingleVarLookup, term: Term) => {
//     walkTerm(term, (term) => {
//         if (term.type === 'handle') {
//             term.cases.forEach((kase) => {
//                 kase.args.forEach((sym) => {
//                     const id = lookup.unique++;
//                     lookup.vars[sym.unique] = id;
//                 });
//                 const id = lookup.unique++;
//                 lookup.vars[kase.k.unique] = id;
//             });
//             const id = lookup.unique++;
//             lookup.vars[term.pure.arg.unique] = id;
//         }
//         if (term.type === 'lambda') {
//             term.args.forEach((sym) => {
//                 const id = lookup.unique++;
//                 lookup.vars[sym.unique] = id;
//             });
//         }
//         if (term.type === 'Let') {
//             const id = lookup.unique++;
//             lookup.vars[term.binding.unique] = id;
//         }
//     });
// };

// // export const normalizeSyms = (type: Type) => {
// //     const mapping = { unique: 0, vars: {} };
// //     typeMapping(mapping, type);
// //     return transformType(mapping.vars, type);
// // };

// export const normalizeEff = (
//     mapping: VarMapping,
//     eff: EffectRef,
// ): EffectRef => {
//     if (eff.type === 'ref') {
//         return eff; // TODO polymorphic effects
//     }
//     return { ...eff, sym: { ...eff.sym, unique: mapping[eff.sym.unique] } };
// };

// export const transformType = <T>(mapping: VarMapping, type: Type): Type => {
//     if (type.type === 'ref') {
//         if (type.effectVbls.length || type.typeVbls.length) {
//             return {
//                 ...type,
//                 effectVbls: type.effectVbls.map((e) =>
//                     normalizeEff(mapping, e),
//                 ),
//                 typeVbls: type.typeVbls.map((t) => transformType(mapping, t)),
//             };
//         }
//         return type;
//     }
//     if (type.type === 'var') {
//         return {
//             ...type,
//             sym: { ...type.sym, unique: mapping[type.sym.unique] },
//             // TODO:
//             // effectVbls: type.effectVbls.map(e => normalizeEff(mapping, e)),
//             // typeVbls: type.typeVbls.map(t => transformType(mapping, t))
//         };
//     }
//     if (type.type === 'lambda') {
//         return {
//             ...type,
//             args: type.args.map((t) => transformType(mapping, t)),
//             effectVbls: type.effectVbls.map((e) => mapping[e]),
//             // effectVbls: type.effectVbls.map((e) => normalizeEff(mapping, e)),
//             typeVbls: type.typeVbls.map((t) => ({
//                 ...t,
//                 unique: mapping[t.unique],
//             })),
//             res: transformType(mapping, type.res),
//         };
//     }

//     throw new Error(`unexpected type`);
// };
