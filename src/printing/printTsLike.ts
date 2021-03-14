// print out into my temporary syntax I guess?
// mostly for debugging
//
// Note that printing it back out doesn't currently recover
// type variable applications (of apply's), I believe.
// So that's probably some information I'll have to hang onto somehow.

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
    Pattern,
} from '../typing/types';
import { PP, items, args, block, atom, id as idPretty } from './printer';

export const refToPretty = (env: Env, ref: Reference, kind: string) =>
    ref.type === 'builtin' ? atom(ref.name) : idToPretty(env, ref.id, kind);
export const idToPretty = (env: Env, id: Id, kind: string) => {
    const name = env.global.idNames[idName(id)];
    if (name) {
        const hash = id.hash + (id.pos !== 0 ? '#' + id.pos : '');
        return idPretty(name, hash, kind);
        // return atom(`${name}#${hash}`);
    }
    return atom('hash_' + id.hash + '_' + id.pos);
};
export const symToPretty = (sym: Symbol) =>
    idPretty(sym.name, 'sym#' + sym.unique.toString(), 'sym');
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
                            atom(names[i]),
                            atom(': '),
                            typeToPretty(env, ex),
                        ]),
                    ),
                ),
            ',',
        ),
    ]);
};

export const enumToPretty = (env: Env, id: Id, enumDef: EnumDef) => {
    return items([
        atom('enum ', ['keyword']),
        idToPretty(env, id, 'enum'),
        enumDef.typeVbls.length
            ? typeVblDeclsToPretty(env, enumDef.typeVbls)
            : null,
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
                idPretty('T', 'sym#' + v.unique.toString(), 'sym'),
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
            return atom(env.local.self.name);
        case 'sequence':
            return block(term.sts.map((t) => termToPretty(env, t)));
        case 'apply':
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
        case 'Attribute':
            const names =
                env.global.recordGroups[
                    term.ref.type === 'builtin'
                        ? term.ref.name
                        : idName(term.ref.id)
                ];
            return items([
                termToPretty(env, term.target),
                atom('.'),
                // TODO: use a name n stuff
                idPretty(
                    names[term.idx],
                    refName(term.ref) + '#' + term.idx.toString(),
                    // term.idx.toString(),
                    'attribute',
                ),

                // atom(names[term.idx]),
                // atom('#'),
                // atom(term.idx.toString()),
            ]);
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
            if (term.base.type === 'Concrete') {
                const names = env.global.recordGroups[idName(term.base.ref.id)];
                const rid = refName(term.base.ref);
                res.push(
                    ...(term.base.rows
                        .map((t, i) =>
                            t
                                ? items([
                                      idPretty(
                                          names[i],
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
            Object.keys(term.subTypes).forEach((id) => {
                const sub = term.subTypes[id];
                const names = env.global.recordGroups[id];
                const decl = env.global.types[id];
                if (sub.spread) {
                    res.push(
                        items([atom('...'), termToPretty(env, sub.spread)]),
                    );
                }
                sub.rows.forEach((row, i) => {
                    if (row != null) {
                        res.push(
                            items([
                                // atom(names[i] + '#' + i),
                                idPretty(
                                    names[i],
                                    id + '#' + i.toString(),
                                    'attribute',
                                ),
                                atom(': '),
                                termToPretty(env, row),
                            ]),
                        );
                    }
                });
                // decl.items.forEach((item, i) => {
                // })
            });
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
            const res = [];
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
        default:
            let _x: never = term;
            return atom('not yet printable: ' + JSON.stringify(term));
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
                                    env.global.recordGroups[
                                        idName(item.ref.id)
                                    ][item.idx],
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
        args(kase.args.map(symToPretty)),
        atom(' => '),
        symToPretty(kase.k),
        atom(') => '),
        termToPretty(env, kase.body),
    ]);

const isBinOp = (term: Term) =>
    term.type === 'ref' &&
    term.ref.type === 'builtin' &&
    !term.ref.name.match(/[\w_$]/);
