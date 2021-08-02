import { defaultVisitor } from '../printing/ir/transform';
import { idFromName, idName, refName, ToplevelT } from './env';
import { void_ } from './preset';
import {
    transform,
    transformToplevel,
    transformWithCtx,
    Visitor,
    walkPattern,
} from './transform';
import { applyTypeVariablesToRecord, getEnumReferences } from './typeExpr';
import {
    Env,
    Id,
    nullLocation,
    Reference,
    Term,
    Type,
    UserReference,
    Location,
    walkTerm,
    Let,
} from './types';

const idxs = (terms: Array<Term | null>) =>
    terms.filter((t) => !!t).map((t) => t!.location.idx!);

type LocKind =
    | Term['type']
    | 'arg'
    | 'switch-case'
    | 'arg-type'
    | 'res-type'
    | 'let'
    | 'attribute-id'
    | 'let-sym';

export const isTermLoc = (kind: LocKind) =>
    ![
        'arg',
        'let',
        'attribute-id',
        'let-sym',
        'arg-type',
        'switch-case',
        'res-type',
    ].includes(kind);

export type IdxTree = {
    children: { [key: number]: Array<number> };
    locs: { [key: number]: { kind: LocKind; loc: Location } };
    parents: { [key: number]: number };
};

export const makeIdxTree = (term: Term): IdxTree => {
    const children: { [key: number]: Array<number> } = {};
    const locs: { [key: number]: { kind: LocKind; loc: Location } } = {};
    const addLoc = (loc: Location, kind: LocKind) => {
        locs[loc.idx!] = { kind, loc };
        return loc.idx!;
    };
    transform(term, {
        let: (l) => {
            if (!l.idLocation) {
                l.idLocation = { ...l.location };
            }
            children[l.location.idx!] = [
                l.idLocation.idx!,
                l.value.location.idx!,
            ];
            locs[l.location.idx!] = { kind: 'let', loc: l.location };
            locs[l.idLocation.idx!] = { kind: 'let-sym', loc: l.idLocation };
            return null;
        },
        term: (term) => {
            locs[term.location.idx!] = {
                kind: term.type,
                loc: term.location,
            };
            switch (term.type) {
                case 'apply':
                    children[term.location.idx!] = idxs(
                        [term.target].concat(term.args),
                    );
                    break;
                case 'Attribute':
                    children[term.location.idx!] = [
                        term.target.location.idx!,
                        addLoc(term.idLocation, 'attribute-id'),
                    ];
                    break;
                case 'Record': {
                    const kids: Array<number> = [];
                    if (term.base.spread) {
                        kids.push(term.base.spread.location.idx!);
                    }
                    if (term.base.type === 'Concrete') {
                        term.base.rows.forEach((r) =>
                            r ? kids.push(r.location.idx!) : null,
                        );
                    }
                    Object.keys(term.subTypes).forEach((s) => {
                        const sub = term.subTypes[s];
                        if (sub.spread != null) {
                            kids.push(sub.spread.location.idx!);
                        }
                        sub.rows.forEach((r) =>
                            r ? kids.push(r.location.idx!) : null,
                        );
                    });

                    children[term.location.idx!] = kids;
                    break;
                }
                case 'if':
                    children[term.location.idx!] = idxs([
                        term.cond,
                        term.yes,
                        term.no,
                    ]);
                    break;
                case 'lambda':
                    // ok term.args really need locs
                    // TODO: get locs for the args, and for the types

                    // OK WHAT IF
                    // the locs map
                    // had the actual nodes there too
                    // then it would be easier to report on the current selection

                    children[term.location.idx!] = term.is.args
                        .map((t) => addLoc(t.location, 'arg-type'))
                        .concat(
                            term.idLocations
                                ? term.idLocations.map((l) => addLoc(l, 'arg'))
                                : [],
                        )
                        .concat([
                            addLoc(term.is.res.location, 'res-type'),
                            term.body.location.idx!,
                        ]);
                    break;
                case 'sequence':
                    children[term.location.idx!] = term.sts.map(
                        (t) => t.location.idx!,
                    );
                    break;
                case 'Tuple':
                    children[term.location.idx!] = term.items.map(
                        (t) => t.location.idx!,
                    );
                    break;
                case 'Switch':
                    children[term.location.idx!] = [
                        term.term.location.idx!,
                    ].concat(
                        term.cases.map((k) => {
                            children[k.location.idx!] = [k.body.location.idx!];
                            return addLoc(k.location, 'switch-case');
                        }),
                    );
                    break;
                case 'Enum':
                case 'unary':
                    // TODO: op should have a loc, please
                    children[term.location.idx!] = [term.inner.location.idx!];
                    break;
                case 'var':
                case 'float':
                case 'int':
                case 'boolean':
                case 'string':
                    break;
            }
            return null;
        },
    });
    const parents: { [key: number]: number } = {};
    Object.keys(children).forEach((parent: unknown) => {
        children[parent as number].forEach(
            (k: number) => (parents[k] = +(parent as string)),
        );
    });
    // const locLines: Array<Array<{ kind: LocKind; loc: Location }>> = [];
    // Object.keys(locs).forEach((idx: unknown) => {
    //     const loc = locs[idx as number];
    //     if (!isAtomic(loc.kind)) {
    //         console.log('skip', loc.kind);
    //         return;
    //     }
    //     if (locLines[loc.loc.start.line]) {
    //         locLines[loc.loc.start.line].push(loc);
    //     } else {
    //         locLines[loc.loc.start.line] = [loc];
    //     }
    // });
    // locLines.forEach((line) =>
    //     line.sort((a, b) => a.loc.start.column - b.loc.start.column),
    // );
    return { parents, children, locs };
};

export const isAtomic = (kind: LocKind) => {
    return [
        'float',
        'int',
        'boolean',
        'string',
        'var',
        'ref',
        'let-sym',
        'arg',
        'arg-type',
        'res-type',
        'attribute-id',
    ].includes(kind);
};

export const transformLocations = (
    mapper: (loc: Location) => Location,
): Visitor<null> => {
    return {
        toplevel: (value) => {
            const location = mapper(value.location);
            return location !== value.location
                ? {
                      ...value,
                      location,
                  }
                : null;
        },
        term: (term) => {
            if (term.type === 'Switch') {
                const location = mapper(term.location);
                let changed = false;
                const cases = term.cases.map((k) => {
                    const location = mapper(k.location);
                    changed = changed || location !== k.location;
                    return { ...k, location };
                });
                return changed || location !== term.location
                    ? { ...term, location, cases }
                    : term;
            }
            if (term.type === 'Attribute') {
                const location = mapper(term.location);
                const idLocation = mapper(term.idLocation);
                return location !== term.location ||
                    idLocation !== term.idLocation
                    ? {
                          ...term,
                          location,
                          idLocation,
                      }
                    : null;
            }
            if (term.type === 'lambda') {
                let changed = false;
                const location = mapper(term.location);
                const args = term.is.args.map((arg) => {
                    const l = mapper(arg.location);
                    changed = changed || l !== arg.location;
                    return l !== arg.location ? { ...arg, location: l } : arg;
                });
                const res = mapper(term.is.res.location);
                // TODO: map the lambda type pleeease
                const is =
                    changed || res !== term.is.res.location
                        ? {
                              ...term.is,
                              args,
                              res: { ...term.is.res, location: res },
                          }
                        : term.is;
                const idLocations = term.idLocations
                    ? term.idLocations.map((l) => {
                          let lm = mapper(l);
                          changed = changed || lm !== l;
                          return lm;
                      })
                    : [];
                return changed ||
                    location !== term.location ||
                    res !== term.is.res.location
                    ? { ...term, location, idLocations, is }
                    : term;
            }
            const location = mapper(term.location);
            return location !== term.location
                ? {
                      ...term,
                      location,
                  }
                : term;
        },
        let: (l) => {
            const location = mapper(l.location);
            const idLocation = mapper(l.idLocation);
            return location !== l.location || idLocation !== l.idLocation
                ? {
                      ...l,
                      location,
                      idLocation,
                  }
                : null;
        },
    };
};

export const ensureIdxUnique = (term: Term) => {
    let idx = 0;
    const addIdx = (l: Location) => ({ ...l, idx: idx++ });
    const used: { [unique: number]: Location } = {};
    const duplicates: Array<[Location, Location]> = [];

    transform(
        term,
        transformLocations((loc) => {
            if (used[loc.idx!] != null) {
                duplicates.push([loc, used[loc.idx!]]);
            }
            used[loc.idx!] = loc;
            return loc;
        }),
    );

    return duplicates;
};

export const addLocationIndices = (toplevel: ToplevelT) => {
    let idx = 0;
    const addIdx = (l: Location) => ({ ...l, idx: idx++ });

    return transformToplevel(toplevel, transformLocations(addIdx), null);
};

export const maxLocationIdx = (term: Term) => {
    let idx = 0;
    transform(
        term,
        transformLocations((l) => {
            idx = Math.max(idx, l.idx!);
            return l;
        }),
    );
    return idx;
};

export const allLiteral = (env: Env, type: Type): boolean => {
    switch (type.type) {
        case 'var':
            return false;
        case 'Ambiguous':
            return false;
        case 'ref': {
            if (type.ref.type === 'builtin') {
                return !type.typeVbls.some((v) => !allLiteral(env, v));
            }
            env.global.builtins;
            const defn = env.global.types[idName(type.ref.id)];
            if (defn.type === 'Enum') {
                return !getEnumReferences(env, type).some(
                    (t) => !allLiteral(env, t),
                );
            } else {
                const rec = applyTypeVariablesToRecord(
                    env,
                    defn,
                    type.typeVbls,
                    null,
                    type.ref.id.hash,
                );
                if (
                    rec.extends.some(
                        (id) =>
                            !allLiteral(env, {
                                type: 'ref',
                                ref: { type: 'user', id },
                                location: nullLocation,
                                typeVbls: [],
                                // effectVbls: [],
                            }),
                    )
                ) {
                    return false;
                }
                return !rec.items.some((t) => !allLiteral(env, t));
            }
        }
        case 'lambda':
            return false;
    }
};

export const getTypeDependencies = (term: Term): Array<Reference> => {
    const deps: { [key: string]: Reference } = {};
    walkTerm(term, (term) => {
        if (term.is.type === 'ref') {
            deps[refName(term.is.ref)] = term.is.ref;
        }
        if (term.is.type === 'lambda') {
            term.is.args.forEach((arg) => {
                if (arg.type === 'ref') {
                    deps[refName(arg.ref)] = arg.ref;
                }
            });
            if (term.is.res.type === 'ref') {
                deps[refName(term.is.res.ref)] = term.is.res.ref;
            }
        }
    });
    return Object.keys(deps).map((k) => deps[k]);
};

export const getDependencies = (term: Term): Array<Reference> => {
    const deps: { [key: string]: Reference } = {};
    walkTerm(term, (term) => {
        if (term.type === 'ref') {
            deps[refName(term.ref)] = term.ref;
        }
    });
    return Object.keys(deps).map((k) => deps[k]);
};

export const getUserDependencies = (term: Term): Array<Id> => {
    return (getDependencies(term).filter(
        (r) => r.type === 'user',
    ) as Array<UserReference>).map((r) => r.id);
};

export const getUserTypeDependencies = (term: Term): Array<Id> => {
    return (getTypeDependencies(term).filter(
        (r) => r.type === 'user',
    ) as Array<UserReference>).map((r) => r.id);
};

export const expressionDeps = (env: Env, terms: Array<Term>): Array<string> => {
    const allDeps: { [key: string]: Array<Id> } = {};
    terms.forEach((term) =>
        getUserDependencies(term).forEach((id) =>
            populateDependencyMap(
                env,
                allDeps,
                env.global.terms[idName(id)],
                id,
            ),
        ),
    );

    return sortAllDeps(allDeps);
};

export const sortedTypes = (env: Env) => {
    const allDeps: { [key: string]: Array<Id> } = {};
    Object.keys(env.global.types).forEach((id) =>
        populateTypeDependencyMap(env, allDeps, idFromName(id)),
    );
    return sortAllDeps(allDeps);
};

export const expressionTypeDeps = (env: Env, terms: Array<Term>) => {
    const allDeps: { [key: string]: Array<Id> } = {};
    terms.forEach((term) =>
        getUserTypeDependencies(term).forEach((id) =>
            populateTypeDependencyMap(env, allDeps, id),
        ),
    );

    return sortAllDeps(allDeps);
};

export const sortTerms = (env: Env, terms: Array<string>) => {
    const allDeps: { [key: string]: Array<Id> } = {};
    terms.forEach((id) =>
        populateDependencyMap(
            env,
            allDeps,
            env.global.terms[id],
            idFromName(id),
        ),
    );

    return sortAllDeps(allDeps);
};

export const sortAllDeps = (allDeps: {
    [key: string]: Array<Id>;
}): Array<string> => {
    const allIds: { [key: string]: Array<string> } = {};
    Object.keys(allDeps).forEach((k) => (allIds[k] = allDeps[k].map(idName)));
    return sortAllDepsPlain(allIds);
    // const lastToFirst = topoSort(allIds);
    // lastToFirst.reverse();
    // return lastToFirst;
};

export const sortAllDepsPlain = (allDeps: {
    [key: string]: Array<string>;
}): Array<string> => {
    const lastToFirst = topoSort(allDeps);
    lastToFirst.reverse();
    const seen: { [key: string]: boolean } = {};
    return lastToFirst.filter((s) => (seen[s] ? false : (seen[s] = true)));
};

export const populateTypeDependencyMap = (
    env: Env,
    allDeps: { [key: string]: Array<Id> },
    id: Id,
) => {
    let toCheck = [id];
    while (toCheck.length) {
        const next = toCheck.shift()!;
        const k = idName(next);
        if (allDeps[k] != null) {
            continue;
        }
        const typeDef = env.global.types[k];
        if (!typeDef) {
            console.warn(`Type dependency not found ${k}`);
            continue;
        }
        const tDeps: Array<Id> = [];
        if (typeDef.type === 'Record') {
            tDeps.push(...typeDef.extends);
            typeDef.items.forEach((item) => {
                if (item.type === 'ref' && item.ref.type === 'user') {
                    tDeps.push(item.ref.id);
                }
            });
        } else {
            typeDef.extends.forEach((ref) => {
                if (ref.ref.type === 'user') {
                    tDeps.push(ref.ref.id);
                }
            });
            typeDef.items.forEach((ref) => {
                if (ref.ref.type === 'user') {
                    tDeps.push(ref.ref.id);
                }
            });
        }

        allDeps[k] = tDeps;
        toCheck.push(...allDeps[k].filter((id) => allDeps[idName(id)] == null));
    }
    return allDeps;
};

export const populateDependencyMap = (
    env: Env,
    allDeps: { [key: string]: Array<Id> },
    term: Term,
    id: Id,
) => {
    if (allDeps[idName(id)] != null) {
        return;
    }
    let toCheck = getUserDependencies(term);
    allDeps[idName(id)] = toCheck.slice();
    while (toCheck.length) {
        const next = toCheck.shift()!;
        const k = idName(next);
        if (allDeps[k] != null) {
            continue;
        }
        const t = env.global.terms[k];
        if (!t) {
            console.warn(`Dependency not found ${k}`);
            continue;
        }
        allDeps[k] = getUserDependencies(t);
        toCheck.push(...allDeps[k].filter((id) => allDeps[idName(id)] == null));
    }
    return allDeps;
};

export const getSortedTermDependencies = (env: Env, term: Term, id: Id) => {
    const allDeps: { [key: string]: Array<Id> } = {};
    populateDependencyMap(env, allDeps, term, id);
    return sortAllDeps(allDeps);
};

export const termDependencies = (term: Term): Array<Reference> => {
    switch (term.type) {
        case 'ref':
            return [term.ref];
        case 'Ambiguous':
        case 'TypeError':
        case 'var':
        case 'raise':
        case 'if':
        case 'handle':
        case 'sequence':
        case 'apply':
        case 'lambda':
        case 'Trace':
        case 'Record':
        case 'Switch':
        case 'TupleAccess':
        case 'Tuple':
        case 'Enum':
        case 'unary':
        case 'Array':
        case 'Attribute':
        case 'string':
        case 'int':
        case 'float':
        case 'boolean':
        case 'self':
            return [];
        default:
            let _x: never = term;
            throw new Error(`Unexpected term type ${(term as any).type}`);
    }
};

// Kahn's algorithm
// https://en.wikipedia.org/wiki/Topological_sorting#Kahn's_algorithm
export const topoSort = (mapping: { [source: string]: Array<string> }) => {
    const sorted = [];
    // the keys are depended on by the values
    const reverseMapping: { [sink: string]: Array<string> } = {};
    Object.keys(mapping).forEach((source) => {
        mapping[source].forEach((d) => {
            reverseMapping[d] = (reverseMapping[d] || []).concat([source]);
        });
    });
    const noIncomingEdge = Object.keys(mapping).filter(
        (sink) => !reverseMapping[sink],
    );
    while (noIncomingEdge.length) {
        const next = noIncomingEdge.shift()!;
        sorted.push(next);
        if (!mapping[next]) {
            throw new Error(
                `Something was referenced that isn't in mapping: ${next}`,
            );
        }
        mapping[next].forEach((sink) => {
            reverseMapping[sink] = reverseMapping[sink].filter(
                (k) => k !== next,
            );
            if (!reverseMapping[sink].length) {
                noIncomingEdge.push(sink);
            }
        });
    }
    return sorted;
};

// L ← Empty list that will contain the sorted elements
// S ← Set of all nodes with no incoming edge

// while S is not empty do
//     remove a node n from S
//     add n to L
//     for each node m with an edge e from n to m do
//         remove edge e from the graph
//         if m has no other incoming edges then
//             insert m into S

// if graph has edges then
//     return error   (graph has at least one cycle)
// else
//     return L   (a topologically sorted order)

export const replaceAtIdx = (
    term: Term,
    idx: number,
    fn: (t: Term) => Term | null,
): Term => {
    let replaced = false;
    return transform(term, {
        term: (t) => {
            if (replaced) {
                return false;
            }
            if (t.location.idx === idx) {
                replaced = true;
                return fn(t);
            }
            return null;
        },
    });
};

export const getTermByIdx = (term: Term, idx: number): Term | null => {
    let found: Term | null = null;
    transform(term, {
        term: (t) => {
            if (t.location.idx === idx) {
                found = t;
            }
            if (found != null) {
                return false;
            }
            return null;
        },
    });
    return found;
};

// TODO: Do we give symbols idxs?
// I don't think so. Maybe we make a "binding" object?
// although that would break hashes.....
// I should probably switch to explicit hashing of terms and such
// so that I can more easily change things
export const insertAfterBindings = (
    term: Term,
    bindings: Array<number>,
    let_: Let,
    maxIdx: number,
) => {
    // ctxxxx
    // so I ... want a local context var
    // yay I have one.
    // ok, so as I go through, I want ... to know what parentage is?
    // ctx.bindingParent?
    type Bindings = {};
    let found = false;
    return transformWithBindings(term, {
        term: (t, ctx) => {
            if (found) {
                return null;
            }
            // So, if it's a "let" that puts us over the edge
            // thennnn
            if (bindings.every((u) => ctx[u] != null)) {
                found = true;
                if (t.type === 'sequence') {
                    return {
                        ...t,
                        sts: [let_ as Let | Term].concat(t.sts),
                    };
                } else {
                    return {
                        type: 'sequence',
                        // TODO: new idx!!
                        location: { ...t.location, idx: maxIdx++ },
                        sts: [let_, t],
                        is: t.is,
                    };
                }
            }
            if (t.type === 'sequence') {
                ctx = { ...ctx };
                let res: Array<Let | Term> = [];
                t.sts.forEach((st) => {
                    res.push(st);
                    if (found) {
                        return;
                    }
                    if (st.type === 'Let') {
                        ctx[st.binding.unique] = {
                            type: st.is,
                            loc: st.location,
                            name: st.binding.name,
                        };
                        if (bindings.every((u) => ctx[u] != null)) {
                            found = true;
                            res.push(let_);
                        }
                    }
                });
                if (found) {
                    return { ...t, sts: res };
                }
            }
            return null;
        },
    });
};

export const usedLocalVariables = (term: Term) => {
    const unbound: { [unique: number]: boolean } = {};
    const bound: { [unique: number]: boolean } = {};
    transform(term, {
        let: (l) => {
            bound[l.binding.unique] = true;
            return null;
        },
        switchCase: (k) => {
            walkPattern(k.pattern, (p) => {
                if (p.type === 'Binding') {
                    bound[p.sym.unique] = true;
                }
                if (p.type === 'Alias') {
                    bound[p.name.unique] = true;
                }
            });
            return null;
        },
        term: (t) => {
            if (t.type === 'lambda') {
                t.args.forEach((s) => (bound[s.unique] = true));
            }
            if (t.type === 'var') {
                if (bound[t.sym.unique] !== true) {
                    unbound[t.sym.unique] = true;
                }
            }
            return null;
        },
    });
    return Object.keys(unbound).map((u) => +u);
};

export type Bindings = {
    [unique: number]: { loc: Location; type: Type; name: string };
};

export const transformWithBindings = (
    term: Term,
    visitor: Visitor<Bindings>,
) => {
    const vinner: Visitor<Bindings> = {
        let: (l, ctx) => {
            const res = visitor.let ? visitor.let(l, ctx) : null;
            if (res === false) {
                return false;
            }
            let ll = null;
            if (res != null) {
                if (Array.isArray(res)) {
                    if (res[0] != null) {
                        ll = res[0];
                    }
                } else {
                    ll = res;
                }
            }
            return [
                ll,
                ctx,
                {
                    ...ctx,
                    [l.binding.unique]: {
                        loc: l.location,
                        type: l.is,
                        name: l.binding.name,
                    },
                },
            ];
        },
        switchCase: (kase, ctx) => {
            let changed = false;
            walkPattern(kase.pattern, (pat) => {
                if (pat.type === 'Binding') {
                    // hmm TODO it owuld be nice for pats to hang onto what type they are
                    if (!changed) {
                        ctx = { ...ctx };
                        changed = true;
                    }
                    ctx[pat.sym.unique] = {
                        loc: pat.location,
                        type: void_,
                        name: pat.sym.name,
                    };
                }
            });
            if (changed) {
                return [null, ctx];
            } else {
                return null;
            }
        },
        term: (t, ctx) => {
            const res = visitor.term(t, ctx);
            if (res === false) {
                return false;
            }
            let ll = null;
            if (res != null) {
                if (Array.isArray(res)) {
                    if (res[0] != null) {
                        ll = res[0];
                    }
                    ctx = res[1];
                } else {
                    ll = res;
                }
            }
            if (t.type === 'lambda') {
                const c2 = { ...ctx };
                t.args.forEach(
                    (s, i) =>
                        (c2[s.unique] = {
                            loc: t.is.args[i].location,
                            type: t.is.args[i],
                            name: s.name,
                        }),
                );
                return [ll, c2];
            }
            return res;
        },
    };
    return transformWithCtx<Bindings>(term, vinner, {});
};
