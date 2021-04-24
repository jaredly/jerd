// print out into my temporary syntax I guess?
// mostly for debugging
//
// Note that printing it back out doesn't currently recover
// type variable applications (of apply's), I believe.
// So that's probably some information I'll have to hang onto somehow.

import { Location } from '../parsing/parser';
import { idName, refName, typeEffect } from '../typing/env';
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
} from '../typing/types';
import {
    PP,
    items,
    args,
    block,
    atom,
    id as idPretty,
    printToString,
} from './printer';

export type ToplevelT =
    // | Term
    | {
          type: 'Effect';
          id: Id;
          effect: EffectDef;
          location: Location;
          name: string;
          constrNames: Array<string>;
      }
    | { type: 'Expression'; term: Term; location: Location }
    | { type: 'Define'; id: Id; term: Term; location: Location; name: string }
    | {
          type: 'EnumDef';
          def: EnumDef;
          id: Id;
          location: Location;
          name: string;
      }
    | {
          type: 'RecordDef';
          def: RecordDef;
          id: Id;
          location: Location;
          name: string;
          attrNames: Array<string>;
      };

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
    return items([
        atom('effect '),
        idToPretty(env, id, 'effect'),
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
    ]);
};

export const refToPretty = (env: Env, ref: Reference, kind: string) =>
    ref.type === 'user' && ref.id.hash === '<self>' && env.local.self
        ? idPretty('self', 'self', kind)
        : ref.type === 'builtin'
        ? atom(ref.name)
        : idToPretty(env, ref.id, kind);
export const idToPretty = (env: Env, id: Id, kind: string) => {
    const name = env.global.idNames[idName(id)];
    const hash = id.hash + (id.pos !== 0 ? '_' + id.pos : '');
    return idPretty(name ? name : 'unnamed', hash, kind);
};
export const symToPretty = (sym: Symbol) =>
    idPretty(sym.name, ':' + sym.unique.toString(), 'sym');
export const effToPretty = (env: Env, eff: EffectRef) =>
    eff.type === 'ref'
        ? refToPretty(env, eff.ref, 'effect')
        : symToPretty(eff.sym);

export const declarationToPretty = (env: Env, id: Id, term: Term): PP => {
    return items([
        atom('const ', ['keyword']),
        idToPretty(env, id, 'term'),
        atom(': '),
        typeToPretty(env, term.is),
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
                  // args([atom(recordDef.ffi.tag)]),
                  atom(' '),
              ])
            : null,
        atom('type ', ['keyword']),
        idToPretty(env, id, 'record'),
        recordDef.typeVbls.length
            ? typeVblDeclsToPretty(env, recordDef.typeVbls)
            : null,
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
        enumDef.typeVbls.length
            ? typeVblDeclsToPretty(env, enumDef.typeVbls)
            : null,
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

const typeVblDeclsToPretty = (env: Env, typeVbls: Array<TypeVblDecl>): PP => {
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

export const typeToPretty = (env: Env, type: Type): PP => {
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
                type.typeVbls.length
                    ? typeVblDeclsToPretty(env, type.typeVbls)
                    : null,
                type.effectVbls.length
                    ? args(
                          type.effectVbls.map((n) => atom(`e_${n}`)),
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
        default:
            throw new Error(`Unexpected type ${JSON.stringify(type)}`);
    }
};

export const termToPretty = (env: Env, term: Term | Let): PP => {
    switch (term.type) {
        case 'Let':
            return items([
                atom('const ', ['keyword']),
                symToPretty(term.binding),
                atom(' = '),
                termToPretty(env, term.value),
            ]);
        case 'boolean':
            return atom(term.value.toString(), ['bool', 'literal']);
        case 'float':
            return atom(
                Math.floor(term.value) === term.value
                    ? term.value.toFixed(1)
                    : term.value.toString(),
                ['float', 'literal'],
            );
        case 'int':
            return atom(term.value.toString(), ['int', 'literal']);
        case 'string':
            return atom(JSON.stringify(term.text), ['string', 'literal']);
        case 'raise':
            return items([
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
            ]);
        case 'if':
            return items([
                atom('if '),
                termToPretty(env, term.cond),
                atom(' '),
                termToPretty(env, term.yes),
                ...(term.no
                    ? [atom(' else '), termToPretty(env, term.no)]
                    : []),
            ]);
        case 'lambda':
            return items([
                term.is.typeVbls.length
                    ? typeVblDeclsToPretty(env, term.is.typeVbls)
                    : null,
                term.is.effectVbls.length
                    ? args(
                          term.is.effectVbls.map((n) => atom(`e_${n}`)),
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
                atom(' ='),
                args(
                    term.is.effects.map((e) => effToPretty(env, e)),
                    '{',
                    '}',
                ),
                atom('> '),
                termToPretty(env, term.body),
            ]);
        case 'self':
            if (env.local.self && env.local.self.type === 'Term') {
                return atom(env.local.self.name);
            } else {
                throw new Error(
                    `Self reference, without a self defined on env`,
                );
            }
        case 'sequence':
            return block(term.sts.map((t) => termToPretty(env, t)));
        case 'apply':
            const asInfo = getAsInfo(term);
            if (asInfo != null) {
                return items([
                    termToPretty(env, asInfo.value),
                    atom(' '),
                    idPretty('as', idName(asInfo.id), 'as'),
                    atom(' '),
                    typeToPretty(env, asInfo.type),
                ]);
            }
            if (isBinOp(term.target) && term.args.length === 2) {
                return items([
                    termToPretty(env, term.args[0]),
                    atom(' '),
                    termToPretty(env, term.target),
                    atom(' '),
                    termToPretty(env, term.args[1]),
                ]);
            }
            return items([
                termToPretty(env, term.target),
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
                args(term.args.map((t) => termToPretty(env, t))),
            ]);
        case 'ref':
            return refToPretty(env, term.ref, 'term');
        case 'var':
            return symToPretty(term.sym);
        case 'Switch':
            return items([
                atom('switch ', ['keyword']),
                termToPretty(env, term.term),
                atom(' '),
                args(
                    term.cases.map((t) => switchCaseToPretty(env, t)),
                    '{',
                    '}',
                ),
            ]);
        case 'handle': {
            const names = env.global.effectConstrNames[refName(term.effect)];
            return items([
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
            ]);
        }
        case 'TupleAccess': {
            return items([
                termToPretty(env, term.target),
                atom('.'),
                atom(term.idx.toString()),
            ]);
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
            return items([
                termToPretty(env, term.target),
                atom('.'),
                // TODO: use a name n stuff
                idPretty(
                    maybeQuoteAttrName(names[term.idx]),
                    refName(term.ref) + '#' + term.idx.toString(),
                    // term.idx.toString(),
                    'attribute',
                ),

                // atom(names[term.idx]),
                // atom('#'),
                // atom(term.idx.toString()),
            ]);
        }
        case 'Enum':
            return items([
                typeToPretty(env, term.is),
                atom(':'),
                termToPretty(env, term.inner),
            ]);
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
            return items([
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
            ]);
        }
        case 'Array':
            // const res = [];
            return items([
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
            ]);
        case 'Tuple':
            return items([
                args(
                    term.items.map((item) => termToPretty(env, item)),
                    '(',
                    ')',
                ),
            ]);
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

const isBinOp = (term: Term) =>
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
