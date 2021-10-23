// print out into my temporary syntax I guess?
// mostly for debugging
//
// Note that printing it back out doesn't currently recover
// type variable applications (of apply's), I believe.
// So that's probably some information I'll have to hang onto somehow.

import { Location } from '../parsing/parser';
import { idName, refName } from '../typing/env';
import { getOpLevel } from '../typing/terms/ops';
import {
    Case,
    EffectRef,
    Env,
    Id,
    Let,
    Reference,
    Symbol,
    Term,
    Type,
    TypeVblDecl,
    EnumDef,
    RecordDef,
    SwitchCase,
    EffectDef,
    Pattern,
    cloneGlobalEnv,
    ToplevelT,
    selfEnv,
    Apply,
    walkTerm,
    newWithGlobal,
    idsEqual,
    getAllSubTypes,
    ToplevelDecorator,
} from '../typing/types';
import {
    PP,
    items,
    args,
    block,
    atom,
    id as idPretty,
    printToString,
    id,
} from './printer';

export const toplevelToPretty = (
    env: Env,
    toplevel: ToplevelT,
    hideUnique = false,
): PP => {
    switch (toplevel.type) {
        case 'Define': {
            const glob = cloneGlobalEnv(env.global);
            glob.idNames[idName(toplevel.id)] = toplevel.name;

            return declarationToPretty(
                selfEnv(newWithGlobal(glob), {
                    type: 'Term',
                    name: toplevel.name,
                    ann: toplevel.term.is,
                }),
                toplevel.id,
                toplevel.term,
            );
        }
        case 'Decorator': {
            return decoratorToPretty(hideUnique, toplevel, env);
        }
        case 'Expression':
            return termToPretty(newWithGlobal(env.global), toplevel.term);
        case 'RecordDef': {
            const glob = cloneGlobalEnv(env.global);
            glob.idNames[idName(toplevel.id)] = toplevel.name;
            glob.recordGroups[idName(toplevel.id)] = toplevel.attrNames;
            if (!toplevel.def) {
                console.log(toplevel);
            }
            return recordToPretty(
                selfEnv(newWithGlobal(glob), {
                    type: 'Type',
                    name: idName(toplevel.id),
                    vbls: toplevel.def.typeVbls,
                }),
                toplevel.id,
                toplevel.def,
                hideUnique,
            );
        }
        case 'EnumDef': {
            const glob = cloneGlobalEnv(env.global);
            glob.idNames[idName(toplevel.id)] = toplevel.name;
            return enumToPretty(
                selfEnv(newWithGlobal(glob), {
                    type: 'Type',
                    name: idName(toplevel.id),
                    vbls: toplevel.def.typeVbls,
                }),
                toplevel.id,
                toplevel.def,
            );
        }
        case 'Effect': {
            const glob = cloneGlobalEnv(env.global);
            glob.idNames[idName(toplevel.id)] = toplevel.name;
            glob.effectConstrNames[idName(toplevel.id)] = toplevel.constrNames;

            return effectToPretty(
                newWithGlobal(glob),
                toplevel.id,
                toplevel.effect,
            );
        }
    }
};

export const effectToPretty = (env: Env, id: Id, effect: EffectDef): PP => {
    return items(
        [
            atom('effect ', ['keyword']),
            idToPretty(env, id, 'effect'),
            atom(' '),
            block(
                effect.constrs.map((constr, i) =>
                    items([
                        atom(env.global.effectConstrNames[idName(id)][i]),
                        atom(': '),
                        args(constr.args.map((t) => typeToPretty(env, t))),
                        atom(' => '),
                        typeToPretty(env, constr.ret),
                    ]),
                ),
                ',',
            ),
        ],
        undefined,
        effect.location,
    );
};

export const refToPretty = (
    env: Env | null,
    ref: Reference,
    kind: string,
    loc?: Location,
) =>
    env && ref.type === 'user' && ref.id.hash === '<self>' && env.local.self
        ? idPretty('self', 'self', kind, loc)
        : ref.type === 'builtin'
        ? id(ref.name, 'builtin', 'builtin', loc)
        : idToPretty(env, ref.id, kind, loc);

export const idToPretty = (
    env: Env | null,
    id: Id,
    kind: string,
    loc?: Location,
) => {
    const name = env ? env.global.idNames[idName(id)] : null;
    const hash = id.hash + (id.pos !== 0 ? '_' + id.pos : '');
    return idPretty(name ? name : 'unnamed', hash, kind, loc);
    // return idPretty('ahaha', hash, kind, loc);
};

export const symToPretty = (env: Env | null, sym: Symbol, loc?: Location) => {
    const name = (env && env.term.localNames[sym.unique]) || sym.name;
    return idPretty(name, symHash(sym), 'sym', loc);
};

export const symHash = (sym: Symbol) => `:${sym.unique}`;

export const effToPretty = (env: Env | null, eff: EffectRef, loc?: Location) =>
    eff.type === 'ref'
        ? refToPretty(env, eff.ref, 'effect', loc)
        : symToPretty(env, eff.sym, loc);

export const isRecursive = (term: Term) => {
    let found = false;
    walkTerm(term, (term) => {
        if (term.type === 'self') {
            found = true;
        }
    });
    return found;
};

export const declarationToPretty = (env: Env, id: Id, term: Term): PP => {
    // hrmmmmmm how do I get an idLoc into this....
    return items([
        atom('const ', ['keyword']),
        isRecursive(term) ? atom('rec ', ['keyword']) : null,
        idToPretty(env, id, 'term'),
        atom(' = '),
        termToPretty(env, term),
    ]);
};

export const recordToPretty = (
    env: Env,
    id: Id,
    recordDef: RecordDef,
    hideUnique = false,
) => {
    const names = env.global.recordGroups[idName(id)];
    const baseDefaults: { [idx: number]: Term } = {};
    if (recordDef.defaults) {
        Object.keys(recordDef.defaults).forEach((k) => {
            const item = recordDef.defaults![k];
            if (item.id == null) {
                baseDefaults[item.idx] = item.value;
            }
        });
    }
    return items([
        recordDef.ffi
            ? items([
                  atom('@ffi'),
                  args([atom(`"${recordDef.ffi.tag}"`)]),
                  atom(' '),
              ])
            : hideUnique
            ? null
            : items([
                  atom('@unique'),
                  args([atom(JSON.stringify(recordDef.unique))]),
                  atom(' '),
              ]),
        atom('type ', ['keyword']),
        idToPretty(env, id, 'record'),
        typeVblDeclsToPretty(env, recordDef.typeVbls),
        atom(' = '),
        block(
            recordDef.extends
                .map((ex) => {
                    const subTyeps = getAllSubTypes(env.global.types, [
                        ex.ref.id,
                    ]);
                    const defaults = recordDef.defaults
                        ? Object.keys(recordDef.defaults)
                              .map((k) => recordDef.defaults![k])
                              .filter(
                                  (item) =>
                                      item.id &&
                                      subTyeps.find((id) =>
                                          idsEqual(id, item.id!),
                                      ),
                              )
                        : [];
                    return items([
                        atom('...'),
                        typeToPretty(env, ex),
                        defaults.length
                            ? args(
                                  defaults.map((item) =>
                                      items([
                                          idPretty(
                                              env.global.recordGroups[
                                                  idName(item.id!)
                                              ][item.idx],
                                              `${idName(item.id!)}#${item.idx}`,
                                              'attribute',
                                          ),
                                          atom(': '),
                                          termToPretty(env, item.value),
                                      ]),
                                  ),
                                  '{',
                                  '}',
                              )
                            : null,
                    ]);
                })
                .concat(
                    recordDef.items.map((ex, i) =>
                        items([
                            atom(maybeQuoteAttrName(names[i])),
                            atom(': '),
                            typeToPretty(env, ex),
                            baseDefaults[i]
                                ? items([
                                      atom(' = '),
                                      termToPretty(env, baseDefaults[i]),
                                  ])
                                : null,
                        ]),
                    ),
                ),
            ',',
        ),
    ]);
};

const maybeQuoteAttrName = (name: string) => {
    if (name.match(/^[+*^/<>=-]+$/)) {
        return '"' + name + '"';
    }
    return name;
};

export const enumToPretty = (env: Env, id: Id, enumDef: EnumDef) => {
    return items([
        atom('enum ', ['keyword']),
        idToPretty(env, id, 'enum'),
        typeVblDeclsToPretty(env, enumDef.typeVbls),
        atom(' '),
        block(
            enumDef.extends
                .map((ex) => items([atom('...'), typeToPretty(env, ex)]))
                .concat(enumDef.items.map((ex) => typeToPretty(env, ex))),
            ',',
        ),
    ]);
};

const interleave = <T>(items: Array<T>, sep: T) => {
    const res: Array<T> = [];
    items.forEach((item, i) => {
        if (i !== 0) {
            res.push(sep);
        }
        res.push(item);
    });
    return res;
};

export const typeVblDeclsToPretty = (
    env: Env | null,
    typeVbls: Array<TypeVblDecl>,
): PP | null => {
    if (!typeVbls.length) {
        return null;
    }
    return args(
        typeVbls.map((v, i) =>
            items([
                idPretty(
                    v.sym.name,
                    ':' + v.sym.unique.toString(),
                    'sym',
                    v.location,
                ),
                // atom('T_' + v.unique.toString()),
                v.subTypes.length
                    ? items([
                          atom(': '),
                          ...interleave(
                              v.subTypes.map((id) =>
                                  idToPretty(env, id, 'record'),
                              ),
                              atom(' + '),
                          ),
                      ])
                    : null,
            ]),
        ),
        '<',
        '>',
    );
};

export const typeToPretty = (env: Env | null, type: Type): PP => {
    switch (type.type) {
        case 'ref':
            // if (
            //     type.ref.type === 'builtin' &&
            //     type.ref.name.startsWith('Tuple')
            // ) {
            //     return args(type.typeVbls.map((t) => typeToPretty(env, t)));
            // }
            if (type.typeVbls.length) {
                return items(
                    [
                        refToPretty(env, type.ref, 'type'),
                        args(
                            type.typeVbls.map((t) => typeToPretty(env, t)),
                            '<',
                            '>',
                        ),
                    ],
                    undefined,
                    type.location,
                );
            }
            return refToPretty(env, type.ref, 'type', type.location);
        case 'lambda':
            return items(
                [
                    typeVblDeclsToPretty(env, type.typeVbls),
                    type.effectVbls.length
                        ? args(
                              type.effectVbls.map((n) =>
                                  symToPretty(env, n.sym),
                              ),
                              '{',
                              '}',
                          )
                        : null,
                    args(
                        type.args.map((t, i) => {
                            const res = typeToPretty(env, t);
                            const arg = type.argNames ? type.argNames[i] : null;
                            if (arg) {
                                return items([
                                    id(arg.text, '', 'argName', arg.location),
                                    atom(': '),
                                    res,
                                ]);
                            }
                            return res;
                        }),
                    ),
                    atom(' ='),
                    args(
                        type.effects.map((t) => effToPretty(env, t)),
                        '{',
                        '}',
                    ),
                    atom('> '),
                    typeToPretty(env, type.res),
                ],
                undefined,
                type.location,
            );
        case 'var':
            return symToPretty(env, type.sym, type.location);
        case 'Ambiguous':
            return atom('[ambiguous - error!]');
        case 'TNotFound':
            return atom(`[Not Found: ${type.text}]`);
        case 'THole':
            return atom('[type hole]');
        case 'InvalidTypeApplication':
            return items([
                atom('[extra vbls '),
                typeToPretty(env, type.inner),
                atom(' '),
                args(type.typeVbls.map((t) => typeToPretty(env, t))),
                atom(']'),
            ]);
        case 'NotASubType':
            return items([
                atom('[not a subtype: '),
                typeToPretty(env, type.inner),
                atom(' of '),
                args(type.subTypes.map((id) => idToPretty(env, id, 'subType'))),
            ]);
        default:
            throw new Error(`Unexpected type ${JSON.stringify(type)}`);
    }
};

export const termOrLetToPretty = (env: Env, term: Term | Let): PP => {
    switch (term.type) {
        case 'Let':
            env.term.localNames[term.binding.sym.unique] =
                term.binding.sym.name;
            return items(
                [
                    atom('const ', ['keyword']),
                    symToPretty(env, term.binding.sym, term.binding.location),
                    atom(' = '),
                    termToPretty(env, term.value),
                ],
                undefined,
                term.location,
            );
        default:
            return termToPretty(env, term);
    }
};

// export const decoratorToPretty = (env: Env, )

export const termToPretty = (env: Env, term: Term): PP => {
    if (term.decorators) {
        return items(
            term.decorators
                .map((decorator) => {
                    const hash = idName(decorator.name.id);
                    const defn = env.global.decorators[hash];
                    const name = env.global.idNames[hash];
                    const dargs = decorator.args.length
                        ? args(
                              decorator.args.map((arg, i) => {
                                  const name =
                                      i < defn.arguments.length
                                          ? id(
                                                defn.arguments[i].argName,
                                                '',
                                                'decorator-arg',
                                                defn.arguments[i].argLocation,
                                            )
                                          : null;
                                  const t =
                                      arg.type === 'Term'
                                          ? termToPretty(env, arg.term)
                                          : atom('NOT SUPPORTED');
                                  return name
                                      ? items([name, atom(': '), t])
                                      : t;
                              }),
                          )
                        : null;
                    return items(
                        [
                            atom('@'),
                            id(
                                name,
                                hash,
                                'decorator',
                                decorator.name.location,
                            ),
                            dargs,
                            atom(' '),
                        ],
                        undefined,
                        decorator.location,
                    );
                })
                .concat([_termToPretty(env, term)]),
        );
    }

    return _termToPretty(env, term);
};

export const _termToPretty = (env: Env, term: Term): PP => {
    switch (term.type) {
        case 'boolean':
            return atom(
                term.value.toString(),
                ['bool', 'literal'],
                term.location,
            );
        case 'float':
            return id(
                Math.floor(term.value) === term.value
                    ? term.value.toFixed(1)
                    : term.value.toString(),
                '',
                'float',
                term.location,
            );
        case 'int':
            return id(term.value.toString(), '', 'int', term.location);
        case 'string':
            return id(JSON.stringify(term.text), '', 'string', term.location);
        case 'raise':
            return items(
                [
                    atom('raise!', ['keyword']),
                    args([
                        items([
                            refToPretty(env, term.ref, 'effect'),
                            atom('.'),
                            atom(
                                env.global.effectConstrNames[refName(term.ref)][
                                    term.idx
                                ],
                            ),
                            args(term.args.map((t) => termToPretty(env, t))),
                        ]),
                    ]),
                ],
                undefined,
                term.location,
            );
        case 'if':
            return items(
                [
                    atom('if '),
                    termToPretty(env, term.cond),
                    atom(' '),
                    termToPretty(env, term.yes),
                    ...(term.no
                        ? [
                              atom(' else '),
                              term.no.type === 'sequence' &&
                              term.no.sts.length === 1 &&
                              term.no.sts[0].type === 'if'
                                  ? termToPretty(env, term.no.sts[0])
                                  : termToPretty(env, term.no),
                          ]
                        : []),
                ],
                undefined,
                term.location,
            );
        case 'lambda':
            return items(
                [
                    term.tags
                        ? items(term.tags.map((t) => atom(`@${t} `)))
                        : null,
                    typeVblDeclsToPretty(env, term.is.typeVbls),
                    term.is.effectVbls.length
                        ? args(
                              term.is.effectVbls.map((n) =>
                                  symToPretty(env, n.sym),
                              ),
                              '{',
                              '}',
                          )
                        : null,
                    args(
                        term.args.map((arg, i) =>
                            items([
                                symToPretty(env, arg.sym, arg.location),
                                atom(': '),
                                typeToPretty(env, term.is.args[i]),
                            ]),
                        ),
                    ),
                    atom(': '),
                    typeToPretty(env, term.is.res),
                    atom(' ='),
                    args(
                        term.is.effects.map((e) => effToPretty(env, e)),
                        '{',
                        '}',
                    ),
                    atom('> '),
                    termToPretty(env, term.body),
                ],
                undefined,
                term.location,
            );
        case 'self':
            if (env.local.self && env.local.self.type === 'Term') {
                return atom(env.local.self.name + '#self');
            } else {
                throw new Error(
                    `Self reference, without a self defined on env`,
                );
            }
        case 'sequence':
            return block(
                term.sts.map((t) => termOrLetToPretty(env, t)),
                undefined,
                term.location,
            );
        case 'apply':
            const asInfo = getAsInfo(term);
            if (asInfo != null) {
                const innerBin =
                    asInfo.value.type === 'apply' &&
                    ((asInfo.value.args.length === 2 &&
                        isBinOp(env, asInfo.value.target)) ||
                        getAsInfo(asInfo.value) != null);
                return items(
                    [
                        innerBin ? atom('(') : null,
                        termToPretty(env, asInfo.value),
                        innerBin ? atom(')') : null,
                        atom(' '),
                        idPretty('as', idName(asInfo.id), 'as'),
                        atom(' '),
                        typeToPretty(env, asInfo.type),
                    ],
                    undefined,
                    term.location,
                );
            }
            if (isBinOp(env, term.target) && term.args.length === 2) {
                const myName = getBinOpName(env, term.target);
                const mine = getOpLevel(myName)!;
                let left = termToPretty(env, term.args[0]);
                if (
                    term.args[0].type === 'apply' &&
                    isBinOp(env, term.args[0].target)
                ) {
                    const leftName = getBinOpName(env, term.args[0].target);
                    const level = getOpLevel(leftName)!;
                    if (level < mine) {
                        left = items([atom('('), left, atom(')')]);
                    }
                }
                let right = termToPretty(env, term.args[1]);
                if (
                    term.args[1].type === 'apply' &&
                    isBinOp(env, term.args[1].target)
                ) {
                    const rightName = getBinOpName(env, term.args[1].target);
                    const level = getOpLevel(rightName)!;
                    if (level <= mine) {
                        right = items([atom('('), right, atom(')')]);
                    }
                }
                return items(
                    [
                        items([left, atom(' ')]),
                        items([
                            isCustomBinOp(env, term.target)
                                ? showCustomBinOp(env, term.target)
                                : termToPretty(env, term.target),
                            atom(' '),
                            right,
                        ]),
                    ],
                    true,
                    term.location,
                );
            }
            let inner = termToPretty(env, term.target);
            if (term.target.type === 'lambda') {
                inner = items([atom('('), inner, atom(')')]);
            }
            let argNames: null | Array<string> = null;
            let resolvedTarget = term.target;
            if (
                resolvedTarget.type === 'ref' &&
                resolvedTarget.ref.type === 'user'
            ) {
                resolvedTarget =
                    env.global.terms[idName(resolvedTarget.ref.id)];
            }
            if (resolvedTarget.type === 'lambda') {
                argNames = resolvedTarget.args.map((sym) => sym.sym.name);
            }
            return items(
                [
                    inner,
                    term.typeVbls.length
                        ? args(
                              term.typeVbls.map((t) => typeToPretty(env, t)),
                              '<',
                              '>',
                          )
                        : null,
                    term.effectVbls
                        ? args(
                              term.effectVbls.map((e) => effToPretty(env, e)),
                              '{',
                              '}',
                          )
                        : null,
                    args(
                        term.args.map((t, i) => {
                            const term = termToPretty(env, t);
                            if (
                                argNames &&
                                (term.type !== 'id' ||
                                    term.text !== argNames[i])
                            ) {
                                return items([
                                    atom(argNames[i], ['argName']),
                                    atom(': '),
                                    term,
                                ]);
                            }
                            return term;
                        }),
                    ),
                ],
                undefined,
                term.location,
            );
        case 'ref':
            const deprecatedBy = getDeprecatedBy(env, term.ref);
            return refToPretty(
                env,
                term.ref,
                deprecatedBy ? 'term-deprecated' : 'term',
                term.location,
            );
        case 'var':
            return symToPretty(env, term.sym, term.location);
        case 'Switch':
            return items(
                [
                    atom('switch ', ['keyword']),
                    termToPretty(env, term.term),
                    atom(' '),
                    args(
                        term.cases.map((t) => switchCaseToPretty(env, t)),
                        '{',
                        '}',
                    ),
                ],
                undefined,
                term.location,
            );
        case 'handle': {
            const names = env.global.effectConstrNames[refName(term.effect)];
            return items(
                [
                    atom('handle! ', ['keyword']),
                    termToPretty(env, term.target),
                    atom(' '),
                    args(
                        term.cases
                            .map((t) =>
                                caseToPretty(
                                    env,
                                    t,
                                    env.global.idNames[refName(term.effect)],
                                    names,
                                ),
                            )
                            .concat([
                                items([
                                    atom('pure('),
                                    symToPretty(env, term.pure.arg),
                                    atom(') => '),
                                    termToPretty(env, term.pure.body),
                                ]),
                            ]),
                        '{',
                        '}',
                    ),
                ],
                undefined,
                term.location,
            );
        }
        case 'TupleAccess': {
            return items(
                [
                    termToPretty(env, term.target),
                    atom('.'),
                    atom(term.idx.toString()),
                ],
                undefined,
                term.location,
            );
        }
        case 'Attribute': {
            const names =
                env.global.recordGroups[
                    term.ref.type === 'builtin'
                        ? term.ref.name
                        : idName(term.ref.id)
                ];
            if (!names) {
                throw new Error(
                    `No names? ${printToString(
                        refToPretty(env, term.ref, 'record'),
                        100,
                    )}`,
                );
            }
            return items(
                [
                    termToPretty(env, term.target),
                    atom('.'),
                    idPretty(
                        maybeQuoteAttrName(names[term.idx]),
                        refName(term.ref) + '#' + term.idx.toString(),
                        'attribute',
                        term.idLocation,
                    ),
                ],
                undefined,
                term.location,
            );
        }
        case 'unary': {
            let inner = termToPretty(env, term.inner);
            if (
                term.inner.type === 'apply' &&
                isBinOp(env, term.inner.target)
            ) {
                inner = items([atom('('), inner, atom(')')]);
            }

            return items([atom(term.op), inner], undefined, term.location);
        }
        case 'Enum':
            return items(
                [
                    typeToPretty(env, term.is),
                    atom(':'),
                    termToPretty(env, term.inner),
                ],
                undefined,
                term.location,
            );
        case 'Record': {
            const res = [];
            const typeVbls =
                term.is.type === 'ref' && term.is.typeVbls.length
                    ? term.is.typeVbls
                    : null;
            if (term.base.spread) {
                res.push(
                    items([atom('...'), termToPretty(env, term.base.spread)]),
                );
            }
            Object.keys(term.subTypes).forEach((id) => {
                const sub = term.subTypes[id];
                if (sub.spread) {
                    res.push(
                        items([atom('...'), termToPretty(env, sub.spread)]),
                    );
                }
            });
            Object.keys(term.subTypes).forEach((id) => {
                const sub = term.subTypes[id];
                const names = env.global.recordGroups[id];
                sub.rows.forEach((row, i) => {
                    if (row != null) {
                        res.push(
                            items([
                                idPretty(
                                    maybeQuoteAttrName(names[i]),
                                    id + '#' + i.toString(),
                                    'attribute',
                                ),
                                atom(': '),
                                termToPretty(env, row),
                            ]),
                        );
                    }
                });
            });
            if (term.base.type === 'Concrete') {
                const names = env.global.recordGroups[idName(term.base.ref.id)];
                const rid = refName(term.base.ref);
                res.push(
                    ...(term.base.rows
                        .map((t, i) =>
                            t
                                ? items([
                                      idPretty(
                                          maybeQuoteAttrName(names[i]),
                                          rid + '#' + i.toString(),
                                          'attribute',
                                      ),
                                      //   atom(names[i] + '#' + i),
                                      atom(': '),
                                      termToPretty(env, t),
                                  ])
                                : null,
                        )
                        .filter(Boolean) as Array<PP>),
                );
            }
            return items(
                [
                    term.base.type === 'Concrete'
                        ? // TODO: the term.base should have a loc
                          refToPretty(
                              env,
                              term.base.ref,
                              'record',
                              term.base.location,
                          )
                        : symToPretty(env, term.base.var, term.base.location),
                    typeVbls
                        ? args(
                              typeVbls.map((t) => typeToPretty(env, t)),
                              '<',
                              '>',
                          )
                        : null,
                    res.length ? args(res, '{', '}') : null,
                ],
                undefined,
                term.location,
            );
        }
        case 'Array':
            // const res = [];
            return items(
                [
                    atom('<'),
                    typeToPretty(env, term.is.typeVbls[0]),
                    atom('>'),
                    args(
                        term.items.map((item) =>
                            item.type === 'ArraySpread'
                                ? items([
                                      atom('...'),
                                      termToPretty(env, item.value),
                                  ])
                                : termToPretty(env, item),
                        ),
                        '[',
                        ']',
                    ),
                ],
                undefined,
                term.location,
            );
        case 'Trace':
            return items(
                [
                    atom('trace!', ['trace', 'keyword', 'trace-' + term.idx]),
                    args(
                        term.args.map((item) => termToPretty(env, item)),
                        '(',
                        ')',
                    ),
                ],
                undefined,
                term.location,
            );
        case 'Tuple':
            return items(
                [
                    args(
                        term.items.map((item) => termToPretty(env, item)),
                        '(',
                        ')',
                    ),
                ],
                undefined,
                term.location,
            );
        case 'Ambiguous':
            return atom('[ambiguous! error]', undefined, term.location);
        case 'TypeError':
            return items(
                [termToPretty(env, term.inner)],
                undefined,
                term.location,
                // ok so I feel like I want a way to pass more complicated infos
                // idk
                // maybe a type Extra? that might have `typeError`, or like `loc` or sommat
                [
                    'error',
                    { type: 'Error', expected: term.is, found: term.inner.is },
                ],
            );
        case 'TemplateString':
            return items([
                atom('"', ['string']),
                items(
                    term.pairs.map((pair) =>
                        items([
                            pair.prefix != ''
                                ? atom(
                                      JSON.stringify(pair.prefix).slice(1, -1),
                                      ['string'],
                                  )
                                : null,
                            pair.id
                                ? idPretty(
                                      '$',
                                      idName(pair.id),
                                      'template-string',
                                      pair.location,
                                  )
                                : atom('$'),
                            atom('{'),
                            termToPretty(env, pair.contents),
                            atom('}'),
                        ]),
                    ),
                ),
                term.suffix
                    ? atom(JSON.stringify(term.suffix).slice(1, -1), ['string'])
                    : null,
                atom('"', ['string']),
            ]);
        case 'Hole':
            return atom('_');
        case 'InvalidRecordAttributes':
            return items([
                atom('INVALID_RECORD_ATTRIBUTES['),
                termToPretty(env, term.inner),
                args(
                    term.extraSpreads.map((v) =>
                        items([atom('...'), termToPretty(env, v)]),
                    ),
                ),
                args(
                    term.extraAttributes.map((v) =>
                        items([
                            v.ref.type === 'unknown'
                                ? atom(v.ref.text)
                                : refToPretty(env, v.ref, 'attribute'),
                            atom(': '),
                            termToPretty(env, v.value),
                        ]),
                    ),
                ),
                atom(']'),
            ]);
        case 'InvalidApplication':
            return items([
                atom('INVALID_APPLICATION['),
                termToPretty(env, term.target),
                args(
                    term.extraTypeArgs.map((t) => typeToPretty(env, t)),
                    '<',
                    '>',
                ),
                args(term.extraArgs.map((arg) => termToPretty(env, arg))),
                atom(']'),
            ]);
        case 'NotFound':
            return atom('NOTFOND(' + term.text + ')');
        case 'InvalidAttribute':
            return items([
                termToPretty(env, term.inner),
                atom('.'),
                atom(term.text),
            ]);
        default:
            let _x: never = term;
            return atom(
                'not yet printable (reparse will of course fail): ' +
                    JSON.stringify(term),
            );
    }
};

export const decoratorToPretty = (
    hideUnique: boolean,
    toplevel: ToplevelDecorator,
    env: Env,
): PP => {
    return items(
        [
            hideUnique
                ? null
                : atom(`@unique(${JSON.stringify(toplevel.defn.unique)}) `),
            atom('decorator '),
            id(
                toplevel.name,
                idName(toplevel.id),
                'decorator-defn',
                toplevel.location,
            ),
            typeVblDeclsToPretty(env, toplevel.defn.typeVbls),
            toplevel.defn.arguments.length ||
            (toplevel.defn.restArg && toplevel.defn.restArg.type)
                ? args(
                      toplevel.defn.arguments.map((arg) => {
                          return items(
                              [
                                  id(
                                      arg.argName,
                                      '',
                                      'decorator-arg',
                                      arg.argLocation,
                                  ),
                                  ...(arg.type
                                      ? [
                                            atom(': '),
                                            typeToPretty(env, arg.type),
                                        ]
                                      : []),
                              ],
                              undefined,
                              arg.location,
                          );
                      }),
                      undefined,
                      undefined,
                      undefined,
                      undefined,
                      toplevel.defn.restArg
                          ? items([
                                id(
                                    toplevel.defn.restArg.argName,
                                    '',
                                    'decorator-arg',
                                    toplevel.defn.restArg.argLocation,
                                ),
                                ...(toplevel.defn.restArg.type
                                    ? [
                                          atom(': '),
                                          typeToPretty(
                                              env,
                                              toplevel.defn.restArg.type,
                                          ),
                                      ]
                                    : []),
                            ])
                          : undefined,
                  )
                : null,
            toplevel.defn.targetType
                ? items([
                      atom(' '),
                      typeToPretty(env, toplevel.defn.targetType),
                  ])
                : null,
        ],
        undefined,
        toplevel.location,
    );
};

function getDeprecatedBy(env: Env, ref: Reference) {
    if (ref.type !== 'user') {
        return null;
    }

    const meta = env.global.metaData[idName(ref.id)];
    if (meta) {
        return meta.supersededBy;
    }
    return null;
}

const switchCaseToPretty = (env: Env, kase: SwitchCase): PP =>
    items(
        [
            patternToPretty(env, kase.pattern),
            atom(' => '),
            termToPretty(env, kase.body),
        ],
        undefined,
        kase.location,
    );

export const patternToPretty = (env: Env, pattern: Pattern): PP => {
    switch (pattern.type) {
        case 'string':
        case 'int':
        case 'float':
        case 'boolean':
            return termToPretty(env, pattern as Term);
        case 'Alias':
            return items([
                patternToPretty(env, pattern.inner),
                atom(' as '),
                symToPretty(env, pattern.name),
            ]);
        case 'Binding':
            return symToPretty(env, pattern.sym);
        case 'Enum':
            return refToPretty(env, pattern.ref.ref, 'enum');
        case 'Record':
            if (pattern.items.length) {
                return items([
                    refToPretty(env, pattern.ref.ref, 'record'),
                    args(
                        pattern.items.map((item) =>
                            items([
                                atom(
                                    maybeQuoteAttrName(
                                        env.global.recordGroups[
                                            idName(item.ref.id)
                                        ][item.idx],
                                    ),
                                ),
                                atom(': '),
                                patternToPretty(env, item.pattern),
                            ]),
                        ),
                        '{',
                        '}',
                    ),
                ]);
            } else {
                return refToPretty(env, pattern.ref.ref, 'record');
            }
        case 'Tuple':
            return args(
                pattern.items.map((p) => patternToPretty(env, p)),
                '(',
                ')',
            );
        case 'Array':
            return args(
                pattern.preItems
                    .map((p) => patternToPretty(env, p))
                    .concat(
                        pattern.spread
                            ? [
                                  items([
                                      atom('...'),
                                      pattern.spread.type === 'Ignore'
                                          ? null
                                          : patternToPretty(
                                                env,
                                                pattern.spread,
                                            ),
                                  ]),
                              ]
                            : [],
                    )
                    .concat(
                        pattern.postItems.map((p) => patternToPretty(env, p)),
                    ),
                '[',
                ']',
            );
        case 'Ignore':
            return atom('_', [], pattern.location);
        case 'PHole':
            return atom('HOLE');
        case 'PTypeError':
            return patternToPretty(env, pattern.inner);
        case 'PNotFound':
            return atom(pattern.text);
        case 'DuplicateSpread':
            return items([atom('...'), patternToPretty(env, pattern.inner)]);
        default:
            let _x: never = pattern;
            throw new Error(`Unknown pattern ${(pattern as any).type}`);
    }
};

const caseToPretty = (
    env: Env,
    kase: Case,
    topname: string,
    names: Array<string>,
): PP =>
    items([
        idPretty(
            topname + '.' + names[kase.constr],
            kase.constr.toString(),
            'effect',
        ),
        // atom(kase.constr.toString()),
        atom('('),
        args(kase.args.map((arg) => symToPretty(env, arg.sym))),
        atom(' => '),
        symToPretty(env, kase.k.sym),
        atom(') => '),
        termToPretty(env, kase.body),
    ]);

const getBinOpName = (env: Env, term: Term): string | null => {
    if (
        term.type !== 'Attribute' ||
        term.ref.type !== 'user' ||
        term.target.type !== 'ref'
    ) {
        if (term.type === 'ref' && term.ref.type === 'builtin') {
            return term.ref.name;
        }
        return null;
    }
    const name = env.global.recordGroups[idName(term.ref.id)][term.idx];
    return name;
};

const isCustomBinOp = (env: Env, term: Term) => {
    if (
        term.type !== 'Attribute' ||
        term.ref.type !== 'user' ||
        (term.target.type !== 'ref' && term.target.type !== 'var')
    ) {
        return false;
    }
    const name = env.global.recordGroups[idName(term.ref.id)][term.idx];
    return !name.match(/[\w_$]/);
};

const showCustomBinOp = (env: Env, term: Term) => {
    if (
        term.type !== 'Attribute' ||
        term.ref.type !== 'user' ||
        (term.target.type !== 'ref' && term.target.type !== 'var')
    ) {
        throw new Error(`Not an attribute`);
    }
    const name = env.global.recordGroups[idName(term.ref.id)][term.idx];
    // return !name.match(/[\w_$]/);
    return idPretty(
        name,
        (term.target.type === 'ref'
            ? refName(term.target.ref)
            : symHash(term.target.sym)) +
            '#' +
            refName(term.ref) +
            '#' +
            term.idx.toString(),
        'custom-binop',
        // Use the location of the base, which is an atomic
        // term, as opposed to the attribute.
        term.location,
    );
    // return items([
    //     termToPretty(env, term.target),
    //     atom('.'),
    //     idPretty(
    //         name,
    //         refName(term.ref) + '#' + term.idx.toString(),
    //         'attribute',
    //     ),
    // ]);
};

const isBinOp = (env: Env, term: Term) =>
    isBuiltinBinOp(term) || isCustomBinOp(env, term);

const isBuiltinBinOp = (term: Term) =>
    term.type === 'ref' &&
    term.ref.type === 'builtin' &&
    !term.ref.name.match(/[\w_$]/);

const getAsInfo = (term: Apply): { type: Type; value: Term; id: Id } | null => {
    if (
        term.args.length === 1 &&
        term.target.type === 'Attribute' &&
        term.target.target.type === 'ref' &&
        term.target.target.is.type === 'ref' &&
        term.target.target.is.ref.type === 'user' &&
        term.target.target.is.ref.id.hash === 'As' &&
        term.target.target.ref.type === 'user'
    ) {
        return {
            type: term.target.target.is.typeVbls[1],
            value: term.args[0],
            id: term.target.target.ref.id,
        };
    }
    return null;
};
