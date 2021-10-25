// Well first pass, we can just monomorphize types, like people usually do.
// ugh nvm that's complicated.

import { type } from 'os';
import {
    hashObject,
    idFromName,
    idName,
    nameForId,
    typeForId,
} from '../../../typing/env';
import { Env, Id, Location, UserReference } from '../../../typing/types';
import { defaultVisitor, transformExpr } from '../transform';
import {
    Expr,
    LambdaExpr,
    LambdaType,
    OutputOptions,
    RecordDef,
    Type,
    UserTypeReference,
} from '../types';
import {
    applyTypeVariables,
    applyTypeVariablesToRecord,
    makeTypeVblMapping,
    recordDefFromTermType,
    subtTypeVars,
    typeFromTermType,
} from '../utils';
// import { maxUnique } from './inline';
import { Context, TypeDefs } from './optimize';

export const specializeTuple = (
    env: Env,
    types: TypeDefs,
    vbls: Array<Type>,
    loc: Location,
): UserTypeReference => {
    const recordDef: RecordDef = {
        type: 'Record',
        extends: [],
        items: vbls,
        location: loc,
        typeVbls: [],
        unique: 0,
        ffi: null,
    };
    const hash = hashObject(recordDef);
    types[hash] = {
        typeDef: recordDef,
        source: { hash: '*tuple*', size: 1, pos: 0 },
    };
    return {
        type: 'ref',
        ref: { type: 'user', id: idFromName(hash) },
        loc,
        typeVbls: [],
    };
};

export const specializeType = (
    env: Env,
    opts: OutputOptions,
    t: UserTypeReference,
    loc: Location,
    types: TypeDefs,
) => {
    const defn = typeForId(env, t.ref.id);
    if (defn.type !== 'Record') {
        return null;
    }
    const def = recordDefFromTermType(env, opts, defn);
    const ndef = applyTypeVariablesToRecord(
        env,
        def,
        t.typeVbls,
        loc,
        idName(t.ref.id),
    );
    const hash = hashObject(ndef);
    types[hash] = {
        typeDef: ndef,
        source: t.ref.id,
    };
    const nid = idFromName(hash);
    // console.log(`Specialize ${hash} from ${t.ref.id.hash}`);
    const newType: UserTypeReference = {
        ...t,
        typeVbls: [],
        ref: {
            ...t.ref,
            id: nid,
        },
    };
    return newType;
};

export const monomorphizeTypes = (
    { env, exprs, types, opts }: Context,
    expr: Expr,
): Expr => {
    const symsToUpdate: { [unique: number]: Type } = {};
    // So how to do it:
    // - map ... types ... hmm ...... yeah I think we want a "transformExprTypes"
    return transformExpr(expr, {
        ...defaultVisitor,
        type: (type) => {
            if (
                type.type === 'ref' &&
                type.ref.type === 'builtin' &&
                type.ref.name.startsWith('Tuple')
            ) {
                return specializeTuple(env, types, type.typeVbls, type.loc);
            }
            return null;
        },
        expr: (expr) => {
            switch (expr.type) {
                case 'tupleAccess': {
                    // ugh how do I think about this. ... like,
                    // I thought all I needed to know was the idx
                    if (expr.target.is.type !== 'ref') {
                        return null;
                    }
                    // We've already monomorphized
                    if (expr.target.is.ref.type === 'user') {
                        return {
                            type: 'attribute',
                            idx: expr.idx,
                            is: expr.is,
                            loc: expr.loc,
                            ref: expr.target.is.ref,
                            refTypeVbls: [],
                            target: expr.target,
                        };
                    }
                    return null;
                }
                case 'tuple': {
                    if (
                        expr.is.type !== 'ref' ||
                        expr.is.ref.type !== 'builtin' ||
                        !expr.is.ref.name.startsWith('Tuple')
                    ) {
                        throw new Error(`Tuple thats not a tuple!`);
                    }
                    const type = specializeTuple(
                        env,
                        types,
                        expr.is.typeVbls,
                        expr.loc,
                    );
                    return {
                        type: 'record',
                        is: type,
                        base: {
                            type: 'Concrete',
                            spread: null,
                            rows: expr.items,
                            ref: type.ref,
                        },
                        loc: expr.loc,
                        subTypes: {},
                    };
                }
                case 'attribute': {
                    if (expr.refTypeVbls.length && expr.ref.type === 'user') {
                        const spec = specializeType(
                            env,
                            opts,
                            {
                                type: 'ref',
                                ref: expr.ref,
                                typeVbls: expr.refTypeVbls,
                                loc: expr.loc,
                            },
                            expr.loc,
                            types,
                        );
                        if (!spec) {
                            return null;
                        }
                        return {
                            ...expr,
                            ref: spec.ref,
                            refTypeVbls: [],
                        };
                    }
                    return null;
                }
                case 'record': {
                    if (expr.base.type === 'Variable') {
                        return null;
                    }
                    if (expr.is.type === 'ref' && expr.is.typeVbls.length > 0) {
                        // Do the replacing folks
                        // START HERE:
                        // - both for exprs, and for .. other things ..
                        // Oh, and then tupleAccess needs to be changed to account for what happened.
                        // But that should be simple to figure out

                        // Ok so currently tuples are these builtin types ... but do they really need to be?
                        // Can't they just be "brought into existence on demand, but normal otherwise"?
                        // So this would mean, as soon as you /use/ a tuple, it gets added to the global
                        // env.

                        // hmmmmmm
                        if (expr.is.ref.type === 'builtin') {
                            if (expr.is.ref.name.startsWith('Tuple')) {
                            }
                            // Ok we have a tuple
                        } else {
                            const spec = specializeType(
                                env,
                                opts,
                                expr.is as UserTypeReference,
                                expr.loc,
                                types,
                            );
                            if (!spec) {
                                return null;
                            }
                            return {
                                ...expr,
                                base: {
                                    ...expr.base,
                                    ref: spec.ref,
                                },
                                is: spec,
                            };
                        }
                    }
                    return null;
                }
                case 'var': {
                    if (symsToUpdate[expr.sym.unique]) {
                        return { ...expr, is: symsToUpdate[expr.sym.unique] };
                    }
                    return null;
                }
                case 'lambda': {
                    let changed = false;
                    // TOOO DOOOOOO
                    // This type change doesn't get propagated, and it super needs to
                    // 🤔 hmmmmm
                    // yeah so any references to this sym need to be updated.
                    // Which is a thing I know how to do!
                    // I think that should do it?
                    const args = expr.args.map((arg) => {
                        if (
                            arg.type.type === 'ref' &&
                            arg.type.ref.type === 'user' &&
                            arg.type.typeVbls.length > 0
                        ) {
                            const spec = specializeType(
                                env,
                                opts,
                                arg.type as UserTypeReference,
                                expr.loc,
                                types,
                            );
                            if (!spec) {
                                return arg;
                            }
                            changed = true;
                            symsToUpdate[arg.sym.unique] = spec;
                            return { ...arg, type: spec };
                        }
                        return arg;
                    });
                    return changed
                        ? {
                              ...expr,
                              args,
                              is: {
                                  ...(expr.is as LambdaType),
                                  args: args.map((arg) => arg.type),
                              },
                          }
                        : null;
                }
            }
            return null;
        },
        stmt: (stmt) => {
            if (stmt.type === 'Define') {
                if (
                    stmt.is.type === 'ref' &&
                    stmt.is.typeVbls.length > 0 &&
                    stmt.value &&
                    stmt.value.is.type === 'ref' &&
                    stmt.value.is.typeVbls.length === 0
                ) {
                    symsToUpdate[stmt.sym.unique] = stmt.value.is;
                    return { ...stmt, is: stmt.value.is };
                }
            }
            // TODO: define and maybe assign idk
            return null;
        },
    });
};

export const replaceTypeVariablesInLambda = (
    expr: LambdaExpr,
    typeVbls: Array<Type>,
): LambdaExpr => {
    if (expr.is.typeVbls.length !== typeVbls.length) {
        throw new Error(`Wrong number of type vbls`);
    }
    const mapping = makeTypeVblMapping(expr.is.typeVbls, typeVbls);
    return transformExpr(expr, {
        ...defaultVisitor,
        type: (type) => {
            const sub = subtTypeVars(type, mapping, undefined);
            // if (type.type === 'var' && mapping[type.sym.unique] != null) {
            //     return mapping[type.sym.unique]
            // }
            return sub !== type ? sub : null;
        },
        expr: (expr) => {
            const is = subtTypeVars(expr.is, mapping, undefined);
            if (expr.type === 'lambda') {
                const res = subtTypeVars(expr.res, mapping, undefined);
                let changed = false;
                const args = expr.args.map((arg) => {
                    const n = subtTypeVars(arg.type, mapping, undefined);
                    if (n !== arg.type) {
                        changed = true;
                        return { ...arg, type: n };
                    }
                    return arg;
                });
                return changed || res !== expr.res || is !== expr.is
                    ? ({
                          ...expr,
                          is: { ...is, typeVbls: [] },
                          res,
                          args,
                      } as LambdaExpr)
                    : expr;
            }
            return is !== expr.is ? ({ ...expr, is } as Expr) : expr;
        },
    }) as LambdaExpr;
};

export const monomorphize = ({ env, exprs }: Context, expr: Expr): Expr => {
    // let outerMax = maxUnique(expr);
    return transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            if (
                expr.type !== 'apply' ||
                expr.typeVbls.length === 0 ||
                expr.target.type !== 'term'
            ) {
                return null;
            }
            const newHash = hashObject({
                base: expr.target.id,
                vbls: expr.typeVbls,
            });
            const target = exprs[idName(expr.target.id)];
            if (!target) {
                console.error('no target?', expr.target.id);
                return null;
            }
            const l = target.expr as LambdaExpr;
            const newType = applyTypeVariables(env, l.is, expr.typeVbls);
            env.global.idNames[newHash] = nameForId(
                env,
                idName(expr.target.id),
            );
            exprs[newHash] = {
                inline: false,
                expr: replaceTypeVariablesInLambda(l, expr.typeVbls),
            };
            return {
                ...expr,
                typeVbls: [],
                target: {
                    ...expr.target,
                    id: { hash: newHash, size: 1, pos: 0 },
                },
            };
        },
    });
};
