import { Term, Env, Type } from './typer';

const printSym = (sym) => sym.name + '_' + sym.unique;
const printId = (id) => 'hash_' + id.hash; // + '_' + id.pos; TODO recursives

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

export const printTerm = (env: Env, term: Term, cps: number): string => {
    switch (term.type) {
        // these will never need effects, immediate is fine
        case 'int':
            return term.value.toString();
        case 'ref':
            if (term.ref.type === 'builtin') {
                return term.ref.name;
            } else {
                return printId(term.ref.id);
            }
        case 'text':
            return JSON.stringify(term.text);
        // a lambda, I guess also doesn't need cps, but internally it does.
        case 'lambda':
            if (term.is.effects.length > 0) {
                return `(${term.args.map(printSym)}, handlers, done) => ${printTerm(
                    env,
                    term.body,
                    1
                )}`;
            } else {
                return `(${term.args.map(printSym)}) => ${printTerm(
                    env,
                    term.body,
                    0
                )}`;
            }
        case 'var':
            return printSym(term.sym);
        case 'apply': {
            // TODO we should hang onto the arg names of the function we
            // are calling so we can use them when assigning to values.
            // oh ok so we need to do somethign else if any of the arguments
            // need CPS.
            if (term.argsEffects.length > 0) {

            } else {

            const target = printTerm(env, term.target);
            if (target === '+') {
                return `${printTerm(env, term.args[0])} ${target} ${printTerm(
                    env,
                    term.args[1],
                )}`;
            }
            return `${target}(${term.args
                .map((arg) => printTerm(env, arg))
                .join(', ')})`;
        }
        case 'raise':
            return `new Error("what")`;
        case 'handle':
            return 'new Error("Handline")';
        case 'sequence':
            // if this thing is pure, um. then it's fine actually?
            // also I don't have defines yet.
            if (cps > 0) {
                let last = printTerm(env, term.sts[term.sts.length - 1], cps)
                term.sts.reverse().slice(1).forEach((term, i) => {
                    last = // OH
                    // UM
                    // the CPS needs to be actually the dest?
                    // not just a number?
                    // unless we want to get really funky?
                })
            } else {
                return `{\n${term.sts
                    .slice(0, -1)
                    .map((s) => printTerm(env, s, 0))
                    .join(';\n')}
                    return ${printTerm(env, term.sts[term.sts.length - 1], 0)}
                }`;
            }
        default:
            throw new Error(`Cannot print ${term.type}`);
    }
};
