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

export const printTerm = (env: Env, term: Term): string => {
    switch (term.type) {
        case 'int':
            return term.value.toString();
        case 'ref':
            if (term.ref.type === 'builtin') {
                return term.ref.name;
            } else {
                return printId(term.ref.id);
            }
        case 'lambda':
            return `(${term.args.map(printSym)}) => ${printTerm(
                env,
                term.body,
            )}`;
        case 'text':
            return JSON.stringify(term.text);
        case 'sequence':
            let res = '{';
            return `{${term.sts
                .slice(0, -1)
                .map((s) => printTerm(env, s))
                .join(';\n')}
                return ${printTerm(env, term.sts[term.sts.length - 1])}
            }`;
        case 'var':
            return printSym(term.sym);
        case 'apply':
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
        case 'raise':
            return `throw new Error("what")`;
        default:
            throw new Error(`Cannot print ${term.type}`);
    }
};
