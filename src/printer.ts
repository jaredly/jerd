import { Term, Env } from './typer';

const printSym = (sym) => sym.name + '_' + sym.unique;
const printId = (id) => 'hash_' + id.hash; // + '_' + id.pos; TODO recursives

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
        default:
            throw new Error(`Cannot print ${term.type}`);
    }
};
