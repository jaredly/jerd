// Print a type to typescript

import { Env, Type, Symbol, Reference, EffectRef, Id } from '../typing/types';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { sortedExplicitEffects } from './ir/lambda';
import { effectHandlerType } from './ir/cps';
import { withAnnotation } from './typeScriptPrinterSimple';
import { idName, refName } from '../typing/env';

// Can I... misuse babel's AST to produce go?
// what would get in my way?
// hm the fact that typescript type annotations might not do the trick?
// I mean, for go it might be fine.
// not sure about swift or something like that.
// can cross that bridge when we want to.

// TODO: I want to abstract this out
// Into a file that generates an intermediate representation
// that can then be turned into TypeScript, or Go, or Swift or something.
// And then the specific "turn it into typescript" bit can be much simpler.
// But for now I should probably flesh out the language a bit more.

const printSym = (sym: Symbol) => sym.name + '_' + sym.unique;

type OutputOptions = {
    readonly scope?: string;
    readonly noTypes?: boolean;
    readonly limitExecutionTime?: boolean;
};

export const printType = (env: Env, type: Type): string => {
    switch (type.type) {
        case 'ref':
            if (type.ref.type === 'builtin') {
                return type.ref.name === 'int' || type.ref.name === 'float'
                    ? 'number'
                    : type.ref.name;
            } else {
                return type.ref.id.hash;
            }
        case 'lambda': {
            let args = type.args.map((t) => printType(env, t)).join(', ');
            if (type.rest) {
                args += ', ...' + printType(env, type.rest);
            }
            const effects = type.effects
                .map((t) => showEffectRef(t))
                .join(', ');
            return `(${args}) =${
                effects ? '{' + effects + '}' : ''
            }> ${printType(env, type.res)}`;
        }
        case 'var':
            return `type-var-${type.sym.name}`;
        case 'effect-handler':
            return `[effect handler ${printRef(type.ref)}]`;
        default:
            throw new Error(`Cannot print ${(type as any).type}`);
    }
};

export const typeToString = (
    env: Env,
    opts: OutputOptions,
    type: Type,
): string => {
    return generate(typeToAst(env, opts, type)).code;
};

const withType = <T>(env: Env, opts: OutputOptions, expr: T, typ: Type): T => {
    if (opts.noTypes) {
        return expr;
    }
    return {
        ...expr,
        // @ts-ignore
        typeAnnotation: t.tsTypeAnnotation(typeToAst(env, opts, typ)),
    };
};

export const typeIdToString = (id: Id) => `t_${idName(id)}`;

export const typeToAst = (
    env: Env,
    opts: OutputOptions,
    type: Type,
): t.TSType => {
    switch (type.type) {
        case 'ref':
            const tvs = type.typeVbls.length
                ? t.tsTypeParameterInstantiation(
                      type.typeVbls.map((tv) => typeToAst(env, opts, tv)),
                  )
                : null;
            if (type.ref.type === 'builtin') {
                if (type.ref.name.startsWith('Tuple')) {
                    return t.tsTupleType(
                        type.typeVbls.map((tv) => typeToAst(env, opts, tv)),
                    );
                }
                return t.tsTypeReference(
                    t.identifier(
                        type.ref.name === 'int' || type.ref.name === 'float'
                            ? 'number'
                            : type.ref.name === 'bool'
                            ? 'boolean'
                            : type.ref.name,
                    ),
                    tvs,
                );
            } else {
                return t.tsTypeReference(
                    t.identifier(typeIdToString(type.ref.id)),
                    tvs,
                );
            }
        case 'effect-handler':
            return t.tsTypeReference(
                t.identifier('handle' + refName(type.ref)),
            );
        case 'var':
            return t.tsTypeReference(t.identifier(`T_${type.sym.unique}`));
        case 'lambda': {
            const res = t.tsTypeAnnotation(typeToAst(env, opts, type.res));

            const findTypeVariables = (type: Type): Array<Symbol> => {
                switch (type.type) {
                    case 'var':
                        return [type.sym];
                    case 'ref':
                        return [];
                    case 'lambda':
                        return ([] as Array<Symbol>)
                            .concat(...type.args.map(findTypeVariables))
                            .concat(findTypeVariables(type.res));
                    default:
                        return [];
                }
            };

            // const vbls = dedup(findTypeVariables(type).map((m) => `${m.name}`));
            // hrmmm a function type should really keep track of its own type variables.
            // like, explicitly.
            // so that we know the difference between
            // <T, R>(x: T, () => R) => T
            // and
            // <T>(x: T, <R>() => R) => T

            return t.tsFunctionType(
                type.typeVbls.length
                    ? t.tsTypeParameterDeclaration(
                          type.typeVbls.map((name) =>
                              t.tsTypeParameter(null, null, `T_${name.unique}`),
                          ),
                      )
                    : null,
                type.args
                    .map((arg, i) =>
                        withType<t.Identifier>(
                            env,
                            opts,
                            t.identifier('arg_' + i),
                            arg,
                        ),
                    )
                    .concat(
                        type.effects.length
                            ? [
                                  ...sortedExplicitEffects(
                                      type.effects,
                                  ).map((eff) =>
                                      withAnnotation(
                                          env,
                                          opts,
                                          t.identifier(
                                              'eff' + refName(eff.ref),
                                          ),
                                          effectHandlerType(env, eff),
                                      ),
                                  ),
                                  {
                                      ...t.identifier('done'),
                                      typeAnnotation: t.tsTypeAnnotation(
                                          t.tsFunctionType(
                                              null,
                                              [
                                                  ...sortedExplicitEffects(
                                                      type.effects,
                                                  ).map((eff) =>
                                                      withAnnotation(
                                                          env,
                                                          opts,
                                                          t.identifier(
                                                              'eff' +
                                                                  refName(
                                                                      eff.ref,
                                                                  ),
                                                          ),
                                                          effectHandlerType(
                                                              env,
                                                              eff,
                                                          ),
                                                      ),
                                                  ),
                                                  {
                                                      ...t.identifier('result'),
                                                      typeAnnotation: res,
                                                  },
                                              ],
                                              t.tsTypeAnnotation(
                                                  t.tsVoidKeyword(),
                                              ),
                                          ),
                                      ),
                                  },
                              ]
                            : [],
                    ),
                type.effects.length
                    ? t.tsTypeAnnotation(t.tsVoidKeyword())
                    : res,
            );
        }
    }
};

const showEffectRef = (eff: EffectRef) => {
    if (eff.type === 'var') {
        return printSym(eff.sym);
    }
    return printRef(eff.ref);
};

const printRef = (ref: Reference) =>
    ref.type === 'builtin' ? ref.name : ref.id.hash;
