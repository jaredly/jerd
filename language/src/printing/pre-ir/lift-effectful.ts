// Let's lift all effectful expressions into local variables! This will greatly simplify the translation to CPS
// We don't have to lift non-effectful expressions, though.

import { void_ } from '../../typing/preset';
import { transform, Visitor } from '../../typing/transform';
import { Env, getEffects, Let, Symbol, Term } from '../../typing/types';

// import { walkTerm } from "../../typing/types";
// import { walkType } from "../../typing/typeType";

// walkTerm
// walkType

const processArg = (
    env: Env,
    arg: Term,
    i: number,
    lets: Array<Let | Term>,
): Term => {
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
};

const processArgs = (
    env: Env,
    inArgs: Array<Term>,
): { lets: Array<Let | Term>; args: Array<Term> } => {
    const lets: Array<Let | Term> = [];
    return {
        lets,
        args: inArgs.map((arg, i) => processArg(env, arg, i, lets)),
    };
};

export const liftEffects = (env: Env, term: Term) => {
    const visitor: Visitor = {
        term: (term: Term) => {
            switch (term.type) {
                case 'Record': {
                    let spread = term.base.spread;
                    if (spread && getEffects(spread).length > 0) {
                        const lets: Array<Let | Term> = [];
                        spread = processArg(env, spread, 0, lets);
                        return {
                            type: 'sequence',
                            is: term.is,
                            location: term.location,
                            sts: lets.concat([
                                { ...term, base: { ...term.base, spread } },
                            ]),
                        };
                    }
                    if (term.base.type === 'Concrete') {
                        if (
                            term.base.rows.some(
                                (row) => row && getEffects(row).length > 0,
                            )
                        ) {
                            const lets: Array<Let | Term> = [];
                            const rows = term.base.rows.map((arg, i) =>
                                arg ? processArg(env, arg, i, lets) : arg,
                            );
                            return {
                                type: 'sequence',
                                is: term.is,
                                location: term.location,
                                sts: lets.concat([
                                    { ...term, base: { ...term.base, rows } },
                                ]),
                            };
                        }
                    }
                    return null;
                }
                case 'apply': {
                    const hasArgsEffects = term.args.some(
                        (arg) => getEffects(arg).length > 0,
                    );
                    if (!hasArgsEffects) {
                        if (getEffects(term.target).length > 0) {
                            const lets: Array<Let | Term> = [];
                            const target = processArg(
                                env,
                                term.target,
                                0,
                                lets,
                            );
                            return {
                                type: 'sequence',
                                is: term.is,
                                location: term.location,
                                sts: lets.concat([{ ...term, target }]),
                            };
                        }
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
                case 'if': {
                    if (getEffects(term.cond).length === 0) {
                        return null;
                    }
                    const lets: Array<Let | Term> = [];
                    const cond = processArg(env, term.cond, 0, lets);
                    return {
                        type: 'sequence',
                        is: term.is,
                        location: term.location,
                        sts: lets.concat([{ ...term, cond }]),
                    };
                }
                case 'raise': {
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
            }
            return null;
        },
        let: (term: Let) => {
            return null;
        },
    };
    return transform(term, visitor);
};
