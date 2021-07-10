// print out into my temporary syntax I guess?
// mostly for debugging
//
// Note that printing it back out doesn't currently recover
// type variable applications (of apply's), I believe.
// So that's probably some information I'll have to hang onto somehow.

import { Location } from '../parsing/parser';
import { idName, refName, ToplevelT } from '../typing/env';
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
    selfEnv,
    Apply,
    walkTerm,
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

export const toplevelToPretty = (env: Env, toplevel: ToplevelT): PP => {
    switch (toplevel.type) {
        case 'Define': {
            const glob = cloneGlobalEnv(env.global);
            glob.idNames[idName(toplevel.id)] = toplevel.name;

            return declarationToPretty(
                selfEnv(
                    { ...env, global: glob },
                    {
                        type: 'Term',
                        name: toplevel.name,
                        ann: toplevel.term.is,
                    },
                ),
                toplevel.id,
                toplevel.term,
            );
        }
        case 'Expression':
            return termToPretty(env, toplevel.term);
        case 'RecordDef': {
            const glob = cloneGlobalEnv(env.global);
            glob.idNames[idName(toplevel.id)] = toplevel.name;
            glob.recordGroups[idName(toplevel.id)] = toplevel.attrNames;
            if (!toplevel.def) {
                console.log(toplevel);
            }
            return recordToPretty(
                {
                    ...selfEnv(env, {
                        type: 'Type',
                        name: idName(toplevel.id),
                        vbls: toplevel.def.typeVbls,
                    }),
                    global: glob,
                },
                toplevel.id,
                toplevel.def,
            );
        }
        case 'EnumDef': {
            const glob = cloneGlobalEnv(env.global);
            glob.idNames[idName(toplevel.id)] = toplevel.name;
            return enumToPretty(
                {
                    ...selfEnv(env, {
                        type: 'Type',
                        name: idName(toplevel.id),
                        vbls: toplevel.def.typeVbls,
                    }),
                    global: glob,
                },
                toplevel.id,
                toplevel.def,
            );
        }
        case 'Effect': {
            const glob = cloneGlobalEnv(env.global);
            glob.idNames[idName(toplevel.id)] = toplevel.name;
            glob.effectConstrNames[idName(toplevel.id)] = toplevel.constrNames;

            return effectToPretty(
                { ...env, global: glob },
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

export const symToPretty = (sym: Symbol, loc?: Location) =>
    idPretty(sym.name, ':' + sym.unique.toString(), 'sym', loc);

export const effToPretty = (env: Env | null, eff: EffectRef, loc?: Location) =>
    eff.type === 'ref'
        ? refToPretty(env, eff.ref, 'effect', loc)
        : symToPretty(eff.sym, loc);

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
    return items([
        atom('const ', ['keyword']),
        isRecursive(term) ? atom('rec ', ['keyword']) : null,
        idToPretty(env, id, 'term'),
        atom(' = '),
        termToPretty(env, term),
    ]);
};

export const recordToPretty = (env: Env, id: Id, recordDef: RecordDef) => {
    const names = env.global.recordGroups[idName(id)];
    return items([
        recordDef.ffi
            ? items([
                  atom('@ffi'),
                  args([atom(`"${recordDef.ffi.tag}"`)]),
                  atom(' '),
              ])
            : null,
        atom('type ', ['keyword']),
        idToPretty(env, id, 'record'),
        typeVblDeclsToPretty(env, recordDef.typeVbls),
        atom(' = '),
        block(
            recordDef.extends
                .map((ex) =>
                    items([atom('...'), idToPretty(env, ex, 'record')]),
                )
                .concat(
                    recordDef.items.map((ex, i) =>
                        items([
                            atom(maybeQuoteAttrName(names[i])),
                            atom(': '),
                            typeToPretty(env, ex),
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
        typeVbls.map((v) =>
            items([
                idPretty('T', ':' + v.unique.toString(), 'sym'),
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
            if (type.typeVbls.length) {
                return items([
                    refToPretty(env, type.ref, 'type'),
                    args(
                        type.typeVbls.map((t) => typeToPretty(env, t)),
                        '<',
                        '>',
                    ),
                ]);
            }
            return refToPretty(env, type.ref, 'type');
        case 'lambda':
            return items([
                typeVblDeclsToPretty(env, type.typeVbls),
                type.effectVbls.length
                    ? args(
                          type.effectVbls.map((n) =>
                              symToPretty({ name: 'e', unique: n }),
                          ),
                          '{',
                          '}',
                      )
                    : null,
                args(type.args.map((t) => typeToPretty(env, t))),
                atom(' ='),
                args(
                    type.effects.map((t) => effToPretty(env, t)),
                    '{',
                    '}',
                ),
                atom('> '),
                typeToPretty(env, type.res),
            ]);
        case 'var':
            return symToPretty(type.sym);
        case 'Ambiguous':
            return atom('[ambiguous - error!]');
        default:
            throw new Error(`Unexpected type ${JSON.stringify(type)}`);
    }
};

export const termOrLetToPretty = (env: Env, term: Term | Let): PP => {
    switch (term.type) {
        case 'Let':
            return items([
                atom('const ', ['keyword']),
                symToPretty(term.binding),
                atom(' = '),
                termToPretty(env, term.value),
            ]);
        default:
            return termToPretty(env, term);
    }
};

export const termToPretty = (env: Env, term: Term): PP => {
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
                        ? items(term.tags.map((t) => atom(`@${t}`)))
                        : null,
                    typeVblDeclsToPretty(env, term.is.typeVbls),
                    term.is.effectVbls.length
                        ? args(
                              term.is.effectVbls.map((n) =>
                                  symToPretty({ name: 'e', unique: n }),
                              ),
                              '{',
                              '}',
                          )
                        : null,
                    args(
                        term.args.map((arg, i) =>
                            items([
                                symToPretty(arg),
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
            return block(term.sts.map((t) => termOrLetToPretty(env, t)));
        case 'apply':
            const asInfo = getAsInfo(term);
            if (asInfo != null) {
                return items(
                    [
                        termToPretty(env, asInfo.value),
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
                argNames = resolvedTarget.args.map((sym) => sym.name);
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
            return refToPretty(env, term.ref, 'term', term.location);
        case 'var':
            return symToPretty(term.sym, term.location);
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
                                    symToPretty(term.pure.arg),
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
                    ),
                ],
                undefined,
                term.location,
            );
        }
        case 'unary':
            return items(
                [atom(term.op), termToPretty(env, term.inner)],
                undefined,
                term.location,
            );
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
                        ? refToPretty(env, term.base.ref, 'record')
                        : symToPretty(term.base.var),
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
                [
                    // atom('[type error!'),
                    termToPretty(env, term.inner),
                    // atom(']'),
                ],
                undefined,
                term.location,
                ['error'],
            );
        default:
            let _x: never = term;
            return atom(
                'not yet printable (reparse will of course fail): ' +
                    JSON.stringify(term),
            );
    }
};

const switchCaseToPretty = (env: Env, kase: SwitchCase): PP =>
    items([
        patternToPretty(env, kase.pattern),
        atom(' => '),
        termToPretty(env, kase.body),
    ]);

const patternToPretty = (env: Env, pattern: Pattern): PP => {
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
                symToPretty(pattern.name),
            ]);
        case 'Binding':
            return symToPretty(pattern.sym);
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
                                      patternToPretty(env, pattern.spread),
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
        args(kase.args.map((arg) => symToPretty(arg.sym))),
        atom(' => '),
        symToPretty(kase.k.sym),
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
        term.target.type !== 'ref'
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
        term.target.type !== 'ref'
    ) {
        throw new Error(`Not an attribute`);
    }
    const name = env.global.recordGroups[idName(term.ref.id)][term.idx];
    // return !name.match(/[\w_$]/);
    return idPretty(
        name,
        refName(term.target.ref) +
            '#' +
            refName(term.ref) +
            '#' +
            term.idx.toString(),
        'custom-binop',
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
