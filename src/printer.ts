import { Term, Env, Type } from './typer';
import * as t from '@babel/types';
import generate from '@babel/generator';

const printSym = (sym) => sym.name + '_' + sym.unique;
const printId = (id) => 'hash_' + id.hash; // + '_' + id.pos; TODO recursives

export const termToString = (env: Env, term: Term): string => {
    return generate(printTerm(env, term, 0)).code;
};

export const printType = (env: Env, type: Type): string => {
    switch (type.type) {
        case 'ref':
            if (type.ref.type === 'builtin') {
                return type.ref.name;
            } else {
                return type.ref.id.hash;
            }
        case 'lambda': {
            let args = type.args.map((t) => printType(env, t)).join(', ');
            if (type.rest) {
                args += ', ...' + printType(env, type.rest);
            }
            const effects = type.effects
                .map((t) => printType(env, { type: 'ref', ref: t }))
                .join(', ');
            return `(${args}) =${
                effects ? '(' + effects + ')' : ''
            }> ${printType(env, type.res)}`;
        }
    }
};

export const printTerm = (env: Env, term: Term, cps: number): t.Expression => {
    switch (term.type) {
        // these will never need effects, immediate is fine
        case 'int':
            return t.numericLiteral(term.value);
        case 'ref':
            if (term.ref.type === 'builtin') {
                return t.identifier(term.ref.name);
            } else {
                return t.identifier(printId(term.ref.id));
            }
        case 'text':
            return t.stringLiteral(term.text);
        // a lambda, I guess also doesn't need cps, but internally it does.
        case 'lambda':
            // this doesn't use effects, but it might nee
            if (term.is.effects.length > 0) {
                return t.arrowFunctionExpression(
                    term.args
                        .map((arg) => t.identifier(printSym(arg)))
                        .concat([
                            t.identifier('handlers'),
                            t.identifier('done'),
                        ]),
                    printTerm(env, term.body, 1),
                );
                // return `(${term.args.map(
                //     printSym,
                // )}, handlers, done) => ${printTerm(env, term.body, 1)}`;
            } else {
                return t.arrowFunctionExpression(
                    term.args.map((arg) => t.identifier(printSym(arg))),
                    printTerm(env, term.body, 0),
                );
                // return `(${term.args.map(printSym)}) => ${printTerm(
                //     env,
                //     term.body,
                //     0,
                // )}`;
            }
        case 'var':
            return t.identifier(printSym(term.sym));
        case 'apply': {
            // TODO we should hang onto the arg names of the function we
            // are calling so we can use them when assigning to values.
            // oh ok so we need to do somethign else if any of the arguments
            // need CPS.
            // if (term.argsEffects.length > 0) {

            // } else {

            const target = printTerm(env, term.target, 0);
            if (t.isIdentifier(target) && target.name === '+') {
                return t.binaryExpression(
                    target.name,
                    printTerm(env, term.args[0], 0),
                    printTerm(env, term.args[1], 0),
                );
            }
            // if (target === '+') {
            //     return `${printTerm(
            //         env,
            //         term.args[0],
            //         0,
            //     )} ${target} ${printTerm(env, term.args[1], 0)}`;
            // }
            return t.callExpression(
                target,
                term.args.map((arg) => printTerm(env, arg, 0)),
            );
            // return `${target}(${term.args
            //     .map((arg) => printTerm(env, arg, 0))
            //     .join(', ')})`;
        }
        case 'raise':
            return t.identifier('raise_wat');
        // return `new Error("what")`;
        case 'handle':
            return t.identifier('handle_wat');
        // return 'new Error("Handline")';
        case 'sequence':
            // if this thing is pure, um. then it's fine actually?
            // also I don't have defines yet.
            if (cps > 0) {
                // let last = printTerm(env, term.sts[term.sts.length - 1], cps);
                // term.sts
                //     .reverse()
                //     .slice(1)
                //     .forEach((term, i) => {
                //         // last = // OH
                //         // UM
                //         // the CPS needs to be actually the dest?
                //         // not just a number?
                //         // unless we want to get really funky?
                //     });
                // return 'wat';
                return t.identifier('sequence');
            } else {
                return t.blockStatement(
                    term.sts.map((s, i) =>
                        i === term.sts.length - 1
                            ? t.returnStatement(printTerm(env, s, 0))
                            : t.expressionStatement(printTerm(env, s, 0)),
                    ),
                );
                // return `{\n${term.sts
                //     .slice(0, -1)
                //     .map((s) => printTerm(env, s, 0))
                //     .join(';\n')}
                //     return ${printTerm(env, term.sts[term.sts.length - 1], 0)}
                // }`;
            }
        default:
            throw new Error(`Cannot print ${term.type}`);
    }
};
