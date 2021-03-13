// print out into my temporary syntax I guess?
// mostly for debugging
//
// Note that printing it back out doesn't currently recover
// type variable applications (of apply's), I believe.
// So that's probably some information I'll have to hang onto somehow.

import { idName } from '../typing/env';
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
import { PP, items, args, block, atom } from './printer';

export const refToPretty = (env: Env, ref: Reference) =>
    ref.type === 'builtin' ? atom(ref.name) : idToPretty(env, ref.id);
export const idToPretty = (env: Env, id: Id) => {
    const name = env.global.idNames[idName(id)];
    if (name) {
        return atom(`${name}#${id.hash}${id.pos !== 0 ? '#' + id.pos : ''}`);
    }
    return atom('hash_' + id.hash + '_' + id.pos);
};
export const symToPretty = (sym: Symbol) => atom(`${sym.name}_${sym.unique}`);
export const effToPretty = (env: Env, eff: EffectRef) =>
    eff.type === 'ref' ? refToPretty(env, eff.ref) : symToPretty(eff.sym);

export const declarationToPretty = (env: Env, id: Id, term: Term): PP => {
    return items([
        atom('const '),
        idToPretty(env, id),
        atom(': '),
        typeToPretty(env, term.is),
        atom(' = '),
        termToPretty(env, term),
    ]);
};

export const recordToPretty = (env: Env, id: Id, recordDef: RecordDef) => {
    const names = env.global.recordGroups[idName(id)];
    return items([
        atom('type '),
        idToPretty(env, id),
        recordDef.typeVbls.length
            ? typeVblDeclsToPretty(env, recordDef.typeVbls)
            : null,
        atom(' = '),
        block(
            recordDef.extends
                .map((ex) => items([atom('...'), idToPretty(env, ex)]))
                .concat(
                    recordDef.items.map((ex, i) =>
                        items([
                            atom(names[i]),
                            atom(': '),
                            typeToPretty(env, ex),
                        ]),
                    ),
                ),
        ),
    ]);
};

export const enumToPretty = (env: Env, id: Id, enumDef: EnumDef) => {
    return items([
        atom('enum '),
        idToPretty(env, id),
        enumDef.typeVbls.length
            ? typeVblDeclsToPretty(env, enumDef.typeVbls)
            : null,
        block(
            enumDef.extends
                .map((ex) => items([atom('...'), typeToPretty(env, ex)]))
                .concat(enumDef.items.map((ex) => typeToPretty(env, ex))),
        ),
    ]);
};

const typeVblDeclsToPretty = (env: Env, typeVbls: Array<TypeVblDecl>): PP => {
    return args(
        typeVbls.map((v) =>
            items([
                atom('T_' + v.unique.toString()),
                v.subTypes.length
                    ? items([
                          atom(': '),
                          ...v.subTypes.map((id) => idToPretty(env, id)),
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
                    refToPretty(env, type.ref),
                    args(
                        type.typeVbls.map((t) => typeToPretty(env, t)),
                        '<',
                        '>',
                    ),
                ]);
            }
            return refToPretty(env, type.ref);
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
                atom('const '),
                symToPretty(term.binding),
                atom(' = '),
                termToPretty(env, term.value),
            ]);
        case 'boolean':
            return atom(term.value.toString());
        case 'int':
            return atom(term.value.toString());
        case 'string':
            return atom(JSON.stringify(term.text));
        case 'raise':
            return items([
                atom('raise!'),
                args([
                    items([
                        refToPretty(env, term.ref),
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
                args(
                    term.args.map((arg, i) =>
                        items([
                            symToPretty(arg),
                            atom(': '),
                            typeToPretty(env, term.is.args[i]),
                        ]),
                    ),
                ),
                atom(' => '),
                termToPretty(env, term.body),
            ]);
        case 'self':
            return atom('<self>');
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
                args(term.args.map((t) => termToPretty(env, t))),
            ]);
        case 'ref':
            return refToPretty(env, term.ref);
        case 'var':
            return symToPretty(term.sym);
        case 'Switch':
            return items([
                atom('switch '),
                termToPretty(env, term.term),
                atom(' '),
                args(
                    term.cases.map((t) => switchCaseToPretty(env, t)),
                    '{',
                    '}',
                ),
            ]);
        case 'handle':
            return items([
                atom('handle! '),
                termToPretty(env, term.target),
                atom(' '),
                args(
                    term.cases
                        .map((t) => caseToPretty(env, t))
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
        case 'Attribute':
            return items([
                termToPretty(env, term.target),
                atom('.'),
                // TODO: use a name n stuff
                atom(term.idx.toString()),
            ]);
        case 'Enum':
            return items([
                typeToPretty(env, term.is),
                atom(':'),
                termToPretty(env, term.inner),
            ]);
        case 'Record': {
            const res = [];
            const typeVbls = term.is.type === 'ref' ? term.is.typeVbls : null;
            if (term.base.type === 'Concrete') {
                const names = env.global.recordGroups[idName(term.base.ref.id)];
                res.push(
                    ...(term.base.rows
                        .map((t, i) =>
                            t
                                ? items([
                                      atom(names[i] + '#' + i),
                                      atom(': '),
                                      termToPretty(env, t),
                                  ])
                                : null,
                        )
                        .filter(Boolean) as Array<PP>),
                );
            }
            // Object.keys(term.subTypes).forEach((id) => {
            //     const decl;
            // });
            return items([
                term.base.type === 'Concrete'
                    ? refToPretty(env, term.base.ref)
                    : symToPretty(term.base.var),
                typeVbls
                    ? args(
                          typeVbls.map((t) => typeToPretty(env, t)),
                          '<',
                          '>',
                      )
                    : null,
                args(res, '{', '}'),
            ]);
        }
        case 'Array':
            const res = [];
            return items([
                atom('<'),
                typeToPretty(env, term.is.typeVbls[0]),
                atom('>'),
                atom('['),
                ...term.items.map((item) =>
                    item.type === 'ArraySpread'
                        ? items([atom('...'), termToPretty(env, item.value)])
                        : termToPretty(env, item),
                ),
                atom(']'),
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
            return typeToPretty(env, pattern.ref);
        case 'Record':
            if (pattern.items.length) {
                return items([
                    typeToPretty(env, pattern.ref),
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
                return typeToPretty(env, pattern.ref);
            }
    }
};

const caseToPretty = (env: Env, kase: Case): PP =>
    items([
        atom(kase.constr.toString()),
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
