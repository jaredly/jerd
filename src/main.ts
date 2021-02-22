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
import { unifyInTerm, unifyInType, unifyVariables } from './unify';
import { printToString } from './printer';
import { declarationToPretty, termToPretty } from './printTsLike';
import deepEqual from 'fast-deep-equal';

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
const string: Type = { type: 'ref', ref: { type: 'builtin', name: 'string' } };
const void_: Type = { type: 'ref', ref: { type: 'builtin', name: 'void' } };

const prelude = [
    `export {}`,
    'const log = console.log',
    `const raise = (handlers, hash, idx, args, done) => {
            handlers[hash](idx, args, done)
        }`,
    `type ShallowHandler<Get, Set> = (
            idx: number,
            args: Set,
            returnIntoFn: (newHandler: {[hash: string]: ShallowHandler<Get, Set>}, value: Get) => void,
        ) => void;`,
    `const handleSimpleShallow2 = <Get, Set, R>(
            hash: string,
            fn: (handler: {[hash: string]: ShallowHandler<Get, Set>}, cb: (fnReturnValue: R) => void) => void,
            handleEffect: Array<(
                value: Set,
                cb: (
                    gotten: Get,
                    newHandler: {[hash: string]: ShallowHandler<Get, Set>},
                    returnIntoHandler: (fnReturnValue: R) => void,
                ) => void,
            ) => void>,
            handlePure: (fnReturnValue: R) => void,
        ) => {
            let fnsReturnPointer = handlePure;
            fn(
                {[hash]: (idx, args, returnIntoFn) => {
                    handleEffect[idx](
                        args,
                        (handlersValueToSend, newHandler, returnIntoHandler) => {
                            if (returnIntoHandler === undefined) {
                                /// @ts-ignore
                                returnIntoHandler = newHandler
                                /// @ts-ignore
                                newHandler = handlersValueToSend
                                /// @ts-ignore
                                handlersValueToSend = null
                            }
                            fnsReturnPointer = returnIntoHandler;
                            returnIntoFn(newHandler, handlersValueToSend);
                        },
                    );
                }},
                (fnsReturnValue) => fnsReturnPointer(fnsReturnValue),
            );
        };`,
];

function presetEnv() {
    const env = newEnv({
        name: 'global',
        type: { type: 'ref', ref: { type: 'builtin', name: 'never' } },
    });
    env.global.builtins['++'] = {
        type: 'lambda',
        args: [string, string],
        effects: [],
        rest: null,
        res: string,
    };
    env.global.builtins['+'] = {
        type: 'lambda',
        args: [int, int],
        effects: [],
        rest: null,
        res: int,
    };
    env.global.builtins['log'] = {
        type: 'lambda',
        args: [string],
        effects: [],
        rest: null,
        res: void_,
    };
    env.global.builtinTypes['unit'] = 0;
    env.global.builtinTypes['void'] = 0;
    env.global.builtinTypes['int'] = 0;
    env.global.builtinTypes['string'] = 0;

    return env;
}

const testInference = (parsed: Toplevel[]) => {
    const env = presetEnv();
    for (const item of parsed) {
        if (item.type === 'define') {
            const typeVbls: { [key: string]: Array<TypeConstraint> } = {};
            const subEnv = { ...env, local: { ...env.local, typeVbls } };
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
            const unified = unifyVariables(typeVbls);
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
            // ugh.
            // I really just need type inference? right?
            // or I mean
            // I could just shallowly check
            const typeVbls: { [key: string]: Array<TypeConstraint> } = {};
            const subEnv = { ...env, local: { ...env.local, typeVbls } };
            const self = {
                name: item.id.text,
                type: item.ann ? typeType(env, item.ann) : newTypeVbl(subEnv),
            };
            subEnv.local.self = self;
            const term = typeExpr(subEnv, item.expr);
            if (fitsExpectation(subEnv, term.is, self.type) !== true) {
                throw new Error(`Term's type doesn't match annotation`);
            }
            // Ok so we need to be able to handle second- and nth-level
            // indirection I imagine.
            // hmm
            // is this where things get undecidable?
            // I mean, how bad could it get?
            // for (let key of Object.keys(typeVbls)) {
            //     unified[key] = typeVbls[key].reduce(unify, null);
            // }
            const unified = unifyVariables(typeVbls);
            // let didChange = true;
            // let iter = 0;
            // while (didChange) {
            //     if (iter++ > 100) {
            //         throw new Error(
            //             `Something is a miss in the state of unification.`,
            //         );
            //     }
            //     didChange = false;
            //     Object.keys(unified).forEach((id) => {
            //         const t = unified[id];
            //         if (t != null) {
            //             const changed = unifyInType(unified, t);
            //             if (changed != null) {
            //                 // console.log(
            //                 //     `${JSON.stringify(
            //                 //         unified[id],
            //                 //         null,
            //                 //         2,
            //                 //     )}\n==>\n${JSON.stringify(changed, null, 2)}`,
            //                 // );
            //                 didChange = true;
            //                 unified[id] = changed;
            //             }
            //         }
            //     });
            // }
            if (Object.keys(unified).length) {
                unifyInTerm(unified, term);
                // self.type = unifyInType(unified, self.type) || self.type;
            }
            // console.log('vbls', JSON.stringify(typeVbls, null, 2));
            // console.log('unified', JSON.stringify(unified, null, 2));
            const hash: string = hashObject(term);
            env.global.names[item.id.text] = { hash: hash, size: 1, pos: 0 };
            env.global.terms[hash] = term;
            // out.push(`// ${printType(env, t.is)}`);

            // out.push(`const hash_${h} = ` + termToString(env, t));
            // } else if (item.type === 'deffect') {
            //     const h: string = hash(item);
            //     const constrs = [];
            //     item.constrs.forEach((constr, i) => {
            //         env.effectNames[constr.id.text] = { hash: h, idx: i };
            //         constrs.push(typeType(env, constr.type));
            //     });
            //     env.effects[h] = constrs;
        } else if (item.type === 'effect') {
            // console.log(item.constrs);
            // throw new Error('TODO');
            const constrs = item.constrs.map(({ type }) => {
                return {
                    args: type.args
                        ? type.args.map((a) => typeType(env, a))
                        : [],
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
                {
                    indent: 0,
                    pos: 0,
                },
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
    }
    fs.writeFileSync('./env.json', JSON.stringify(env, null, 2));
};

const runTests = () => {
    const raw = fs.readFileSync('inference-tests.jd', 'utf8');
    const parsed: Array<Toplevel> = parse(raw);
    testInference(parsed);
};

main(process.argv[2], process.argv[3]);
// runTests();
