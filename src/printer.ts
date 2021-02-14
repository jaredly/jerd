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
                // t.tsTypeParameterDeclaration(
                type.args.map(
                    (arg, i) =>
                        // t.tsTypeParameter(

                        ({
                            ...t.identifier('arg_' + i),
                            typeAnnotation: t.tsTypeAnnotation(
                                typeToAst(env, arg),
                            ),
                        }),
                    // null,
                    // 'arg_' + i,
                    // ),
                ),
                // ),
                t.tsTypeAnnotation(typeToAst(env, type.res)),
            );
            // let args = type.args.map((t) => printType(env, t)).join(', ');
            // if (type.rest) {
            //     args += ', ...' + printType(env, type.rest);
            // }
            // const effects = type.effects
            //     .map((t) => printType(env, { type: 'ref', ref: t }))
            //     .join(', ');
            // return `(${args}) =${
            //     effects ? '(' + effects + ')' : ''
            // }> ${printType(env, type.res)}`;
        }
    }
};

export const printExpressionOrStatement = (
    env: Env,
    term: Term,
    cps: number,
): t.BlockStatement | t.Expression => {
    if (term.type === 'sequence') {
        return t.blockStatement(
            term.sts.map((s, i) =>
                i === term.sts.length - 1
                    ? t.returnStatement(printTerm(env, s, 0))
                    : t.expressionStatement(printTerm(env, s, 0)),
            ),
        );
    } else {
        return printTerm(env, term, cps);
    }
};

export const printStatement = (
    env: Env,
    term: Term,
    cps: number,
): t.Statement => {
    if (term.type === 'sequence') {
        return t.blockStatement(
            term.sts.map((s, i) =>
                i === term.sts.length - 1
                    ? t.returnStatement(printTerm(env, s, 0))
                    : t.expressionStatement(printTerm(env, s, 0)),
            ),
        );
    } else {
        return t.expressionStatement(printTerm(env, term, cps));
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
                printTerm(env, term, 0),
            ),
        ]),
    ).code;
};

export const printTerm = (env: Env, term: Term, cps: number): t.Expression => {
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
                    printExpressionOrStatement(env, term.body, 1),
                );
            } else {
                return t.arrowFunctionExpression(
                    term.args.map((arg) => t.identifier(printSym(arg))),
                    printExpressionOrStatement(env, term.body, 0),
                );
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
            if (
                t.isIdentifier(target) &&
                (target.name === '+' || target.name === '++')
            ) {
                return t.binaryExpression(
                    '+',
                    printTerm(env, term.args[0], 0),
                    printTerm(env, term.args[1], 0),
                );
            }
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
                // IIFE
                return t.callExpression(
                    t.arrowFunctionExpression(
                        [],
                        t.blockStatement(
                            term.sts.map((s, i) =>
                                i === term.sts.length - 1
                                    ? t.returnStatement(printTerm(env, s, 0))
                                    : t.expressionStatement(
                                          printTerm(env, s, 0),
                                      ),
                            ),
                        ),
                    ),
                    [],
                );
            }
        default:
            throw new Error(`Cannot print ${term.type}`);
    }
};
