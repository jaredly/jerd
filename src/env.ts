// Ok

import hashObject from 'hash-sum';
import parse, { Expression, Define, Toplevel, Effect } from './parser';
import typeExpr, { fitsExpectation } from './typeExpr';
import typeType, { newTypeVbl } from './typeType';
import { Env, Term, Type, TypeConstraint } from './types';
import { showType, unifyInTerm, unifyInType, unifyVariables } from './unify';

export const typeEffect = (env: Env, item: Effect) => {
    const constrs = item.constrs.map(({ type }) => {
        return {
            args: type.args ? type.args.map((a) => typeType(env, a)) : [],
            ret: typeType(env, type.res),
        };
    });
    const hash: string = hashObject(constrs);
    env.global.effectNames[item.id.text] = hash;
    item.constrs.forEach((c, i) => {
        env.global.effectConstructors[c.id.text] = {
            idx: i,
            hash: hash,
        };
    });
    env.global.effects[hash] = constrs;
};

export const typeDefine = (env: Env, item: Define) => {
    const tmpTypeVbls: { [key: string]: Array<TypeConstraint> } = {};
    const subEnv: Env = {
        ...env,
        local: { ...env.local, tmpTypeVbls },
    };
    const self = {
        name: item.id.text,
        type: item.ann ? typeType(env, item.ann) : newTypeVbl(subEnv),
    };
    subEnv.local.self = self;
    const term = typeExpr(subEnv, item.expr);
    // console.log('< type', showType(term.is));
    if (fitsExpectation(subEnv, term.is, self.type) !== true) {
        throw new Error(`Term's type doesn't match annotation`);
    }
    // // Ok so we need to be able to handle second- and nth-level
    // // indirection I imagine.
    // // hmm
    // // is this where things get undecidable?
    // // I mean, how bad could it get?
    // // for (let key of Object.keys(typeVbls)) {
    // //     unified[key] = typeVbls[key].reduce(unify, null);
    // // }
    // const unified = unifyVariables(tmpTypeVbls);
    // // let didChange = true;
    // // let iter = 0;
    // // while (didChange) {
    // //     if (iter++ > 100) {
    // //         throw new Error(
    // //             `Something is a miss in the state of unification.`,
    // //         );
    // //     }
    // //     didChange = false;
    // //     Object.keys(unified).forEach((id) => {
    // //         const t = unified[id];
    // //         if (t != null) {
    // //             const changed = unifyInType(unified, t);
    // //             if (changed != null) {
    // //                 // console.log(
    // //                 //     `${JSON.stringify(
    // //                 //         unified[id],
    // //                 //         null,
    // //                 //         2,
    // //                 //     )}\n==>\n${JSON.stringify(changed, null, 2)}`,
    // //                 // );
    // //                 didChange = true;
    // //                 unified[id] = changed;
    // //             }
    // //         }
    // //     });
    // // }
    // if (Object.keys(unified).length) {
    //     console.log(unified);
    //     unifyInTerm(unified, term);
    //     // self.type = unifyInType(unified, self.type) || self.type;
    // }
    const hash: string = hashObject(term);
    env.global.names[item.id.text] = { hash: hash, size: 1, pos: 0 };
    env.global.terms[hash] = term;
    return { hash, term };
};
