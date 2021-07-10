// Print a type to typescript

import {
    Env,
    Symbol,
    Type as TermType,
    Reference,
    EffectRef,
    Id,
    RecordDef,
    TypeVblDecl,
} from '../typing/types';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { idName, refName } from '../typing/env';
import { recordAttributeName } from './typeScriptPrinterSimple';
import { Type } from './ir/types';
import {
    cpsLambdaToLambda,
    doneLambdaToLambda,
    typeFromTermType,
} from './ir/utils';

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

export const typeIdToString = (id: Id) => `t_${idName(id)}`;

export const printType = (env: Env, type: TermType): string => {
    switch (type.type) {
        case 'ref':
            if (type.ref.type === 'builtin') {
                return type.ref.name === 'int' || type.ref.name === 'float'
                    ? 'number'
                    : type.ref.name === 'bool'
                    ? 'boolean'
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
        default:
            throw new Error(`Cannot print`);
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

export const typeToAst = (
    env: Env,
    opts: OutputOptions,
    type: Type,
): t.TSType => {
    switch (type.type) {
        case 'effect-handler':
            if (type.ref.type === 'builtin') {
                return t.tsTypeReference(t.identifier(type.ref.name));
            }
            // return t.tsAnyKeyword();
            return t.tsTypeReference(
                t.identifier('handle' + refName(type.ref)),
            );
        case 'effectful-or-direct':
            return t.tsAnyKeyword();
        case 'ref':
            const tvars = type.typeVbls.length
                ? t.tsTypeParameterInstantiation(
                      type.typeVbls.map((t) => typeToAst(env, opts, t)),
                  )
                : null;
            if (type.ref.type === 'builtin') {
                if (type.ref.name.startsWith('Tuple')) {
                    return t.tsTupleType(
                        type.typeVbls.map((t) => typeToAst(env, opts, t)),
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
                    tvars,
                );
            } else {
                return t.tsTypeReference(
                    t.identifier(typeIdToString(type.ref.id)),
                    tvars,
                );
            }
        case 'var':
            return t.tsTypeReference(t.identifier(`T_${type.sym.unique}`));
        case 'cps-lambda':
            return typeToAst(env, opts, cpsLambdaToLambda(env, opts, type));
        case 'done-lambda':
            return typeToAst(env, opts, doneLambdaToLambda(env, opts, type));
        case 'lambda': {
            const res = t.tsTypeAnnotation(typeToAst(env, opts, type.res));

            const l = t.tsFunctionType(
                type.typeVbls.length
                    ? typeVblsToParameters(env, opts, type.typeVbls)
                    : null,
                type.args.map((arg, i) =>
                    withType<t.Identifier>(
                        env,
                        opts,
                        t.identifier('arg_' + i),
                        arg,
                    ),
                ),
                // .concat(
                //     type.effects.length
                //         ? [
                //               {
                //                   ...t.identifier('handlers'),
                //                   typeAnnotation: t.tsTypeAnnotation(
                //                       t.tsAnyKeyword(),
                //                   ),
                //               },
                //               {
                //                   ...t.identifier('done'),
                //                   typeAnnotation: t.tsTypeAnnotation(
                //                       t.tsFunctionType(
                //                           null,
                //                           [
                //                               {
                //                                   ...t.identifier('result'),
                //                                   typeAnnotation: res,
                //                               },
                //                           ],
                //                           t.tsTypeAnnotation(
                //                               t.tsVoidKeyword(),
                //                           ),
                //                       ),
                //                   ),
                //               },
                //           ]
                //         : [],
                // ),
                // type.effects.length
                //     ? t.tsTypeAnnotation(t.tsVoidKeyword())
                // :
                res,
            );
            if (type.note) {
                return t.addComment(l, 'leading', type.note);
            } else {
                return l;
            }
        }
    }
};
export const typeVblsToParameters = (
    env: Env,
    opts: OutputOptions,
    vbls: Array<TypeVblDecl>,
) =>
    t.tsTypeParameterDeclaration(
        vbls.map((vbl) =>
            t.tsTypeParameter(
                // Here we make a type literal
                vbl.subTypes.length
                    ? t.tsTypeLiteral(
                          ([] as Array<t.TSPropertySignature>).concat(
                              ...vbl.subTypes.map((id) =>
                                  allRecordMembers(
                                      env,
                                      id,
                                  ).map(({ item, i, id }) =>
                                      recordMemberSignature(
                                          env,
                                          opts,
                                          id,
                                          i,
                                          typeFromTermType(env, opts, item),
                                      ),
                                  ),
                              ),
                          ),
                      )
                    : null,
                null,
                `T_${vbl.unique}`,
            ),
        ),
    );

export const recordMemberSignature = (
    env: Env,
    opts: OutputOptions,
    id: Id,
    i: number,
    item: Type,
) => {
    return t.tsPropertySignature(
        t.identifier(recordAttributeName(env, { type: 'user', id }, i)),
        t.tsTypeAnnotation(typeToAst(env, opts, item)),
    );
};

export const allRecordMembers = (env: Env, id: Id) => {
    const constr = env.global.types[idName(id)] as RecordDef;
    if (constr.type !== 'Record') {
        throw new Error(`Not a record`);
    }
    return constr.items
        .map((item, i) => ({ id, item, i }))
        .concat(
            ...constr.extends.map((id) =>
                (env.global.types[idName(id)] as RecordDef).items.map(
                    (item, i) => ({
                        id,
                        item,
                        i,
                    }),
                ),
            ),
        );
};

const showEffectRef = (eff: EffectRef) => {
    if (eff.type === 'var') {
        return printSym(eff.sym);
    }
    return printRef(eff.ref);
};

const printRef = (ref: Reference) =>
    ref.type === 'builtin' ? ref.name : ref.id.hash;
