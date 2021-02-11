// um what now

// we want to parse things I guess?

import fs from 'fs';
import hash from 'hash-sum';
import { type } from 'os';
import cloner from 'rfdc';
import parse, { Expression, Define, Toplevel } from './parser';
import { printTerm } from './printer';
import typeExpr, { newEnv, Type } from './typer';

const clone = cloner();

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

const int: Type = { type: 'ref', ref: { type: 'builtin', name: 'int' } };

const main = (fname: string) => {
    const raw = fs.readFileSync(fname, 'utf8');
    const parsed: Array<Toplevel> = parse(raw);

    const env = newEnv();
    env.builtins['+'] = {
        type: 'lambda',
        args: [int, int],
        rest: null,
        res: int,
    };
    env.builtinTypes['int'] = 0;
    env.builtinTypes['text'] = 0;

    const out = [];
    for (const item of parsed) {
        if (item.type === 'define') {
            const t = typeExpr(env, item.exp);
            const h: string = hash(t);
            env.names[item.id.text] = { hash: h, size: 1, pos: 0 };
            env.terms[h] = t;
            // console.log(h, t);
            out.push(`const hash_${h} = ` + printTerm(env, t));
        }
    }
    fs.writeFileSync(fname + '.js', out.join('\n'));
};

main(process.argv[2]);
