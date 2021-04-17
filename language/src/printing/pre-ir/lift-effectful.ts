// Let's lift all effectful expressions into local variables! This will greatly simplify the translation to CPS
// We don't have to lift non-effectful expressions, though.

import { transform, Visitor } from '../../typing/transform';
import { Env, getEffects, Let, Symbol, Term } from '../../typing/types';

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
        is: arg.is,
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

const subSequence = (lets: Array<Let | Term>, modified: Term): Term => ({
    type: 'sequence',
    is: modified.is,
    location: modified.location,
    sts: lets.concat([modified]),
});

/**
 * The fact the effects can occur just about anywhere makes the transform to
 * continuation-passing-style quite complicated.
 * We can dramatically simplify things by pulling all nested effects into `let`s.
 * This will introduce a lot of intermediate IIFEs, but we remove those later in
 * the IR optimization pass.
 */
export const liftEffects = (env: Env, term: Term) => {
    const visitor: Visitor = {
        term: (term: Term) => {
            switch (term.type) {
                case 'Attribute':
                case 'TupleAccess': {
                    if (getEffects(term.target).length === 0) {
                        return null;
                    }
                    const lets: Array<Let | Term> = [];
                    const target = processArg(env, term.target, 0, lets);
                    return subSequence(lets, { ...term, target });
                }
                case 'Tuple': {
                    if (
                        !term.items.some((term) => getEffects(term).length > 0)
                    ) {
                        return null;
                    }
                    const lets: Array<Let | Term> = [];
                    const items = term.items.map((arg, i) =>
                        processArg(env, arg, i, lets),
                    );
                    return subSequence(lets, {
                        ...term,
                        items,
                    });
                }
                case 'Array': {
                    if (
                        !term.items.some((term) =>
                            term.type === 'ArraySpread'
                                ? getEffects(term.value).length > 0
                                : getEffects(term).length > 0,
                        )
                    ) {
                        return null;
                    }
                    const lets: Array<Let | Term> = [];
                    const items = term.items.map((arg, i) =>
                        arg.type === 'ArraySpread'
                            ? {
                                  ...arg,
                                  value: processArg(env, arg.value, i, lets),
                              }
                            : processArg(env, arg, i, lets),
                    );
                    return subSequence(lets, {
                        ...term,
                        items,
                    });
                }
                case 'Switch': {
                    if (getEffects(term.term).length > 0) {
                        const lets: Array<Let | Term> = [];
                        const sub = processArg(env, term.term, 0, lets);
                        return subSequence(lets, { ...term, term: sub });
                    }
                    return null;
                }
                case 'Record': {
                    let spread = term.base.spread;
                    if (spread && getEffects(spread).length > 0) {
                        const lets: Array<Let | Term> = [];
                        spread = processArg(env, spread, 0, lets);
                        return subSequence(lets, {
                            ...term,
                            base: { ...term.base, spread },
                        });
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
                            return subSequence(lets, {
                                ...term,
                                base: { ...term.base, rows },
                            });
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
                            return subSequence(lets, { ...term, target });
                        }
                        return null;
                    }
                    const { lets, args } = processArgs(env, term.args);
                    return subSequence(lets, { ...term, args });
                }
                case 'if': {
                    if (getEffects(term.cond).length === 0) {
                        return null;
                    }
                    const lets: Array<Let | Term> = [];
                    const cond = processArg(env, term.cond, 0, lets);
                    return subSequence(lets, { ...term, cond });
                }
                case 'raise': {
                    const hasArgsEffects = term.args.some(
                        (arg) => getEffects(arg).length > 0,
                    );
                    if (!hasArgsEffects) {
                        return null;
                    }
                    const { lets, args } = processArgs(env, term.args);
                    return subSequence(lets, { ...term, args });
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
