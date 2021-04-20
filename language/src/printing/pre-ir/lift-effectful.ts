// Let's lift all effectful expressions into local variables! This will greatly simplify the translation to CPS
// We don't have to lift non-effectful expressions, though.

import { void_ } from '../../typing/preset';
import { transform, Visitor } from '../../typing/transform';
import { Env, getEffects, Let, Symbol, Term } from '../../typing/types';

// import { walkTerm } from "../../typing/types";
// import { walkType } from "../../typing/typeType";

// walkTerm
// walkType

const processArgs = (
    env: Env,
    inArgs: Array<Term>,
): { lets: Array<Let | Term>; args: Array<Term> } => {
    const lets: Array<Let | Term> = [];
    return {
        lets,
        args: inArgs.map((arg, i) => {
            // TODO: have somewhere accessible the names of variables of functions pleaaase
            if (getEffects(arg).length === 0) {
                return arg;
            }
            const sym: Symbol = {
                name: `arg_${i}`,
                unique: env.local.unique++,
            };
            lets.push({
                type: 'Let',
                binding: sym,
                is: void_,
                location: arg.location,
                value: arg,
            });
            return {
                type: 'var',
                is: arg.is,
                location: arg.location,
                sym,
            };
        }),
    };
};

export const liftEffects = (env: Env, term: Term) => {
    const visitor: Visitor = {
        term: (term: Term) => {
            if (term.type === 'apply') {
                const hasArgsEffects = term.args.some(
                    (arg) => getEffects(arg).length > 0,
                );
                if (!hasArgsEffects) {
                    return null;
                }
                const { lets, args } = processArgs(env, term.args);
                return {
                    type: 'sequence',
                    is: term.is,
                    location: term.location,
                    sts: lets.concat([{ ...term, args }]),
                };
            }
            if (term.type === 'raise') {
                const hasArgsEffects = term.args.some(
                    (arg) => getEffects(arg).length > 0,
                );
                if (!hasArgsEffects) {
                    return null;
                }
                const { lets, args } = processArgs(env, term.args);
                return {
                    type: 'sequence',
                    is: term.is,
                    location: term.location,
                    sts: lets.concat([{ ...term, args }]),
                };
            }
            return null;
        },
        let: (term: Let) => {
            return null;
        },
    };
    return transform(term, visitor);
};
