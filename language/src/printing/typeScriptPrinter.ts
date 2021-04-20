// Print a type to typescript

import {
    Env,
    Type,
    Symbol,
    Reference,
    EffectRef,
    Id,
    LambdaType,
} from '../typing/types';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { sortedExplicitEffects } from './ir/lambda';
import { effectHandlerType } from './ir/cps';
import { withAnnotation } from './typeScriptPrinterSimple';
import { idName, refName } from '../typing/env';

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
            const args = type.args.map((arg, i) =>
                withType<t.Identifier>(
                    env,
                    opts,
                    t.identifier('arg_' + i),
                    arg,
                ),
            );
            const tvbls = type.typeVbls.length
                ? t.tsTypeParameterDeclaration(
                      type.typeVbls.map((name) =>
                          t.tsTypeParameter(null, null, `T_${name.unique}`),
                      ),
                  )
                : null;
            const res = t.tsTypeAnnotation(typeToAst(env, opts, type.res));
            // TODO: If "had all variable effects", this should produce an inline record type.
            if (
                type.effects.length > 0 &&
                type.effects.every((t) => t.type === 'var')
            ) {
                return t.tsTypeLiteral([
                    t.tsPropertySignature(
                        t.identifier('effectful'),
                        t.tsTypeAnnotation(
                            t.tsFunctionType(
                                tvbls,
                                args.concat(effectArgs(env, opts, type, res)),
                                t.tsTypeAnnotation(t.tsVoidKeyword()),
                            ),
                        ),
                    ),
                    t.tsPropertySignature(
                        t.identifier('direct'),
                        t.tsTypeAnnotation(t.tsFunctionType(tvbls, args, res)),
                    ),
                ]);
            }

            return t.tsFunctionType(
                tvbls,
                args.concat(
                    type.effects.length ? effectArgs(env, opts, type, res) : [],
                ),
                type.effects.length
                    ? t.tsTypeAnnotation(t.tsVoidKeyword())
                    : res,
            );
        }
    }
};

const effectArgs = (
    env: Env,
    opts: OutputOptions,
    type: LambdaType,
    res: t.TSTypeAnnotation,
) => [
    ...sortedExplicitEffects(type.effects).map((eff) =>
        withAnnotation(
            env,
            opts,
            t.identifier('eff' + refName(eff.ref)),
            effectHandlerType(env, eff),
        ),
    ),
    {
        ...t.identifier('done'),
        typeAnnotation: t.tsTypeAnnotation(
            t.tsFunctionType(
                null,
                [
                    ...sortedExplicitEffects(type.effects).map((eff) =>
                        withAnnotation(
                            env,
                            opts,
                            t.identifier('eff' + refName(eff.ref)),
                            effectHandlerType(env, eff),
                        ),
                    ),
                    {
                        ...t.identifier('result'),
                        typeAnnotation: res,
                    },
                ],
                t.tsTypeAnnotation(t.tsVoidKeyword()),
            ),
        ),
    },
];

const showEffectRef = (eff: EffectRef) => {
    if (eff.type === 'var') {
        return printSym(eff.sym);
    }
    return printRef(eff.ref);
};

const printRef = (ref: Reference) =>
    ref.type === 'builtin' ? ref.name : ref.id.hash;
