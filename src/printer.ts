import { Term, Env, Type, getEffects, CPSAble } from './typer';
import * as t from '@babel/types';
import generate from '@babel/generator';

const printSym = (sym) => sym.name + '_' + sym.unique;
const printId = (id) => 'hash_' + id.hash; // + '_' + id.pos; TODO recursives

export const termToString = (env: Env, term: Term): string => {
    return generate(printTerm(env, term)).code;
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

export const typeToString = (env: Env, type: Type): string => {
    return generate(typeToAst(env, type)).code;
};

export const typeToAst = (env: Env, type: Type): t.TSType => {
    switch (type.type) {
        case 'ref':
            if (type.ref.type === 'builtin') {
                return t.tsTypeReference(t.identifier(type.ref.name));
            } else {
                return t.tsTypeReference(t.identifier('t_' + type.ref.id.hash));
            }
        case 'lambda': {
            return t.tsFunctionType(
                null,
                type.args.map((arg, i) => ({
                    ...t.identifier('arg_' + i),
                    typeAnnotation: t.tsTypeAnnotation(typeToAst(env, arg)),
                })),
                t.tsTypeAnnotation(typeToAst(env, type.res)),
            );
        }
    }
};

// use an IIFE to bind. There are much smarter ways.
const bind = (
    id: t.Identifier,
    v: t.Expression,
    body: t.Expression,
): t.Expression => {
    return t.callExpression(t.arrowFunctionExpression([id], body), [v]);
};

export const printLambdaBody = (
    env: Env,
    term: Term,
    // cps: null | { body: t.Expression; bind: t.Identifier },
    cps: null | t.Identifier,
): t.BlockStatement | t.Expression => {
    if (cps == null) {
        if (term.type === 'sequence') {
            return t.blockStatement(
                term.sts.map((s, i) =>
                    i === term.sts.length - 1
                        ? t.returnStatement(printTerm(env, s))
                        : t.expressionStatement(printTerm(env, s)),
                ),
            );
        } else {
            return printTerm(env, term);
        }
    } else {
        // return t.identifier('cps');
        if (term.type === 'sequence') {
            // so we start from the last
            // and we know what we want to bind to, right? or something?
            // in what case would we want to CPS something that
            // can't be CPSd?
            let pre = [];
            for (let s of term.sts) {
                if (getEffects(s).length === 0) {
                    console.log('ok', s);
                    pre.push(t.expressionStatement(printTerm(env, s)));
                } else {
                    pre.push(t.expressionStatement(termToAstCPS(env, s, cps)));
                }
            }
            return t.blockStatement(pre);
        } else {
            return termToAstCPS(env, term, cps);
        }
        // return t.identifier(term.type);
    }
};

export const declarationToString = (
    env: Env,
    hash: string,
    term: Term,
): string => {
    return generate(
        t.variableDeclaration('const', [
            t.variableDeclarator(
                {
                    ...t.identifier('hash_' + hash),
                    typeAnnotation: t.tsTypeAnnotation(typeToAst(env, term.is)),
                },
                printTerm(env, term),
            ),
        ]),
    ).code;
};

export const termToAstCPS = (
    env: Env,
    term: Term,
    done: t.Identifier,
): t.Expression => {
    if (!getEffects(term).length) {
        return t.callExpression(done, [
            t.identifier('handlers'),
            printTerm(env, term),
        ]);
    }
    switch (term.type) {
        case 'raise': {
            if (term.argsEffects.length > 0) {
                return t.identifier('raise args effects');
            }
            if (term.ref.type === 'builtin') {
                throw new Error('ok');
            }
            const args: Array<t.Expression> = [
                t.identifier('handlers'),
                t.stringLiteral(term.ref.id.hash),
            ];
            if (term.args.length === 0) {
                args.push(t.nullLiteral());
            } else if (term.args.length === 1) {
                args.push(printTerm(env, term.args[0]));
            } else {
                args.push(
                    t.arrayExpression(term.args.map((a) => printTerm(env, a))),
                );
            }
            args.push(
                t.arrowFunctionExpression(
                    [t.identifier('handlers'), t.identifier('value')],
                    t.callExpression(done, [t.identifier('value')]),
                ),
            );
            return t.callExpression(t.identifier('raise'), args);
        }
        case 'apply': {
            if (term.argsEffects.length > 0) {
                return t.identifier('args effects');
            }
            if (getEffects(term.target).length) {
                return t.identifier('target effects');
            }
            const target = printTerm(env, term.target);
            return t.callExpression(
                target,
                term.args
                    .map((arg) => printTerm(env, arg))
                    .concat([t.identifier('handlers'), done]),
            );
        }
        default:
            // return t.identifier(term.type);
            return t.callExpression(done, [
                t.identifier('handlers'),
                printTerm(env, term),
            ]);
    }
};

export const printTerm = (env: Env, term: Term): t.Expression => {
    switch (term.type) {
        // these will never need effects, immediate is fine
        case 'int':
            return t.numericLiteral(term.value);
        case 'ref':
            if (term.ref.type === 'builtin') {
                return {
                    ...t.identifier(term.ref.name),
                    typeAnnotation: t.tsTypeAnnotation(typeToAst(env, term.is)),
                };
            } else {
                return t.identifier(printId(term.ref.id));
            }
        case 'string':
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
                    // why not pass in "thing to call"?
                    // like, that's better right?
                    printLambdaBody(
                        env,
                        term.body,
                        t.identifier('done'),
                        //     {
                        //     body: t.callExpression(t.identifier('done'), [
                        //         t.identifier('finalValue'),
                        //     ]),
                        //     bind: t.identifier('finalValue'),
                        // }
                    ),
                );
            } else {
                return t.arrowFunctionExpression(
                    term.args.map((arg) => t.identifier(printSym(arg))),
                    printLambdaBody(env, term.body, null),
                );
            }
        case 'var':
            return t.identifier(printSym(term.sym));
        case 'apply': {
            // TODO we should hang onto the arg names of the function we
            // are calling so we can use them when assigning to values.
            // oh ok so we need to do somethign else if any of the arguments
            // need CPS.

            // Ok, this function is CPSing it up! what's the deal
            // do we know what the body is, and what the arg should be?
            // I'm saying, cps should be ?{body: Expression, name: Identifier}
            // let's try that.

            // Pure, love it.
            const target = printTerm(env, term.target);
            if (
                t.isIdentifier(target) &&
                (target.name === '+' || target.name === '++')
            ) {
                return t.binaryExpression(
                    '+',
                    printTerm(env, term.args[0]),
                    printTerm(env, term.args[1]),
                );
            }
            return t.callExpression(
                target,
                term.args.map((arg) => printTerm(env, arg)),
            );
            // let b = body;
            // const args = term.args.map((arg) => {
            //     if (getEffects(arg).length > 0) {
            //         // ok this is a one.
            //     }
            // });
            // if (term.effects.length > 0) {
            //     // ok, so this is "I'm calling a function that needs handlers & a done function"
            //     // but first, let's take care of the args?
            //     // well the
            //     // hm what if instead of body & bind, body was just a function?
            //     // that you call with yourself?
            //     // erm
            // }
            // if (term.argsEffects.length > 0) {

            // } else {

            // return `${target}(${term.args
            //     .map((arg) => printTerm(env, arg, null))
            //     .join(', ')})`;
        }
        case 'raise':
            return t.identifier('raise_wat');
        // return `new Error("what")`;
        case 'handle':
            return t.identifier('handle_wat');
        // return 'new Error("Handline")';
        case 'sequence':
            // IIFE
            return t.callExpression(
                t.arrowFunctionExpression(
                    [],
                    t.blockStatement(
                        term.sts.map((s, i) =>
                            i === term.sts.length - 1
                                ? t.returnStatement(printTerm(env, s))
                                : t.expressionStatement(printTerm(env, s)),
                        ),
                    ),
                ),
                [],
            );
        default:
            let _x: never = term;
            throw new Error(`Cannot print ${(term as any).type}`);
    }
};
