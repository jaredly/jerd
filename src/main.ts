// um what now

// we want to parse things I guess?

import fs from 'fs';
import hashObject from 'hash-sum';
import { type } from 'os';
import cloner from 'rfdc';
import parse, { Expression, Define, Toplevel } from './parser';
import {
    declarationToString,
    printType,
    termToString,
    typeToString,
} from './typeScriptPrinter';
import typeExpr, { fitsExpectation } from './typeExpr';
import typeType, { newTypeVbl } from './typeType';
import { Env, newEnv, Term, Type, TypeConstraint } from './types';
import { showType, unifyInTerm, unifyInType, unifyVariables } from './unify';
import { printToString } from './printer';
import { declarationToPretty, termToPretty } from './printTsLike';
import deepEqual from 'fast-deep-equal';
import { typeDefine, typeEffect } from './env';

import { presetEnv, prelude } from './preset';
import { execSync } from 'child_process';

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

const testInference = (parsed: Toplevel[]) => {
    const env = presetEnv();
    for (const item of parsed) {
        if (item.type === 'define') {
            const tmpTypeVbls: { [key: string]: Array<TypeConstraint> } = {};
            const subEnv: Env = {
                ...env,
                local: { ...env.local, tmpTypeVbls },
            };
            // TODO only do it
            const self = {
                name: item.id.text,
                type: newTypeVbl(subEnv),
                // type: item.ann ? typeType(env, item.ann) : newTypeVbl(subEnv),
            };
            subEnv.local.self = self;
            const term = typeExpr(subEnv, item.expr);
            if (fitsExpectation(subEnv, term.is, self.type) !== true) {
                throw new Error(`Term's type doesn't match annotation`);
            }
            // So for self-recursive things, the final
            // thing should be exactly the same, not just
            // larger or smaller, right?
            const unified = unifyVariables(tmpTypeVbls);
            if (Object.keys(unified).length) {
                unifyInTerm(unified, term);
            }
            const hash: string = hashObject(term);
            env.global.names[item.id.text] = { hash: hash, size: 1, pos: 0 };
            env.global.terms[hash] = term;

            const declared = typeType(env, item.ann);
            if (!deepEqual(declared, term.is)) {
                console.log(`Inference Test failed!`);
                console.log('Expected:');
                console.log(typeToString(env, declared));
                console.log('Inferred:');
                console.log(typeToString(env, term.is));
            } else {
                console.log('Passed!');
                console.log(typeToString(env, declared));
                console.log(typeToString(env, term.is));
            }
        }
    }
};

function typeFile(parsed: Toplevel[]) {
    const env = presetEnv();

    // const
    const expressions = [];

    // const out = prelude.slice();
    for (const item of parsed) {
        if (item.type === 'define') {
            console.log('>> A define', item.id.text);
            const { term } = typeDefine(env, item);
            console.log('< unified type', showType(term.is));
        } else if (item.type === 'effect') {
            typeEffect(env, item);
        } else {
            // A standalone expression
            const term = typeExpr(env, item);
            expressions.push(term);
        }
    }
    return { expressions, env };
}

const fileToTypescript = (expressions: Array<Term>, env: Env) => {
    const out = prelude.slice();
    Object.keys(env.global.terms).forEach((hash) => {
        const term = env.global.terms[hash];

        out.push(
            `\n/*\n${printToString(
                declarationToPretty(
                    {
                        hash: hash,
                        size: 1,
                        pos: 0,
                    },
                    term,
                ),
                100,
            )}\n*/`,
        );
        out.push(
            declarationToString(
                {
                    ...env,
                    local: {
                        ...env.local,
                        self: { name: hash, type: term.is },
                    },
                },
                hash,
                term,
            ),
        );
    });
    expressions.forEach((term) => {
        out.push(`// ${printType(env, term.is)}`);
        out.push(termToString(env, term));
    });

    return out.join('\n');
};

const main = (fname: string, dest: string) => {
    const raw = fs.readFileSync(fname, 'utf8');
    const parsed: Array<Toplevel> = parse(raw);

    const { expressions, env } = typeFile(parsed);
    const text = fileToTypescript(expressions, env);

    if (dest === '-' || !dest) {
        console.log(text);
    } else {
        fs.writeFileSync(dest, text);
        execSync(`yarn -s esbuild ${dest} > ${dest}.js`);
    }
    fs.writeFileSync('./env.json', JSON.stringify(env, null, 2));
};

const runTests = () => {
    const raw = fs.readFileSync('examples/inference-tests.jd', 'utf8');
    const parsed: Array<Toplevel> = parse(raw);
    testInference(parsed);
};

if (process.argv[2] === '--test') {
    runTests();
} else {
    main(process.argv[2], process.argv[3]);
}
// runTests();
