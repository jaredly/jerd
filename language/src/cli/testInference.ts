import { hashObject, idName } from '../typing/env';
import { Toplevel } from '../parsing/parser';
import typeExpr from '../typing/typeExpr';
import typeType, { newTypeVbl } from '../typing/typeType';
import {
    Env,
    Id,
    Self,
    Type,
    TypeConstraint,
    typesEqual,
} from '../typing/types';
import { printToString } from '../printing/printer';
import { typeToPretty } from '../printing/printTsLike';
import { presetEnv } from '../typing/preset';
import { TypeError } from '../typing/errors';
import { getTypeError } from '../typing/getTypeError';

// const clone = cloner();
// ok gonna do some pegjs I think for parsin
// --------- PEG Parser Types -----------
// ummmmmmmmm
// ok, so where is the ast? and where is the typed tree? and such?
// so there's the parse tree, which we immediately turn into a typed tree, right?
// in the web UI, it would be constructed interactively
// but here
// its like
// what
// some inference necessary
// and just like guessing?
// -----
/*

What's the process here?
we've got a Typed Tree that we're constructing.
In the IDE it'll be an interactive experience where you're constructing the typed tree directly.

but, when working with text file representation,
we first do a parse tree
and then a typed tree
and thats ok






*/
// herm being able to fmap over these automagically would be super nice
// const walk = (t: Expression, visitor) => {
//     switch (t.type) {
//         case 'text':
//             visitor.type(t);
//             return;
//         case 'int':
//             visitor.int(t);
//             return;
//         case 'id':
//             visitor.id(t);
//             return;
//         case 'apply':
//             visitor.apply(t);
//             t.terms.forEach((t) => walk(t, visitor));
//             return;
//     }
// };
// const rmloc = (t: any) => (t.location = null);
// const locationRemover = { type: rmloc, int: rmloc, id: rmloc, apply: rmloc };
// const hashDefine = (d: Define) => {
//     const res = clone(d);
//     walk(res.id, locationRemover);
//     walk(res.exp, locationRemover);
//     res.location = null;
//     return hash(res);
// };
export const testInference = (
    parsed: Toplevel[],
    builtins: { [key: string]: Type },
) => {
    const env = presetEnv(builtins);
    for (const item of parsed) {
        if (item.type === 'define') {
            const tmpTypeVbls: { [key: string]: Array<TypeConstraint> } = {};
            const subEnv: Env = {
                ...env,
                local: { ...env.local, tmpTypeVbls },
            };
            // TODO only do it
            const self: Self = {
                type: 'Term',
                name: item.id.text,
                ann: newTypeVbl(subEnv),
                // type: item.ann ? typeType(env, item.ann) : newTypeVbl(subEnv),
            };
            subEnv.local.self = self;
            const term = typeExpr(subEnv, item.expr);
            const err = getTypeError(subEnv, term.is, self.ann, item.location);
            if (err != null) {
                throw new TypeError(
                    `Term's type doesn't match annotation`,
                ).wrap(err);
            }
            // So for self-recursive things, the final
            // thing should be exactly the same, not just
            // larger or smaller, right?
            // const unified = unifyVariables(env, tmpTypeVbls);
            // if (Object.keys(unified).length) {
            //     unifyInTerm(unified, term);
            // }
            const hash: string = hashObject(term);
            const id: Id = { hash: hash, size: 1, pos: 0 };
            env.global.names[item.id.text] = [id];
            env.global.idNames[idName(id)] = item.id.text;
            env.global.terms[hash] = term;

            const declared = typeType(env, item.ann);
            if (!typesEqual(declared, term.is)) {
                console.log(`Inference Test failed!`);
                console.log('Expected:');
                console.log(printToString(typeToPretty(env, declared), 100));
                console.log('Inferred:');
                console.log(printToString(typeToPretty(env, term.is), 100));
            } else {
                console.log('Passed!');
                console.log(printToString(typeToPretty(env, declared), 100));
                console.log(printToString(typeToPretty(env, term.is), 100));
            }
        }
    }
};
