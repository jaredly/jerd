import { defaultVisitor } from '../printing/ir/transform';
import { idFromName, idName, refName, ToplevelT } from './env';
import { transform, transformToplevel } from './transform';
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
} from './types';

const idxs = (terms: Array<Term | null>) =>
    terms.filter((t) => !!t).map((t) => t!.location.idx!);

type LocKind = Term['type'] | 'arg' | 'let';

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
            // TODO: the sym needs a loc
            children[l.location.idx!] = [l.value.location.idx!];
            locs[l.location.idx!] = { kind: 'let', loc: l.location };
            return null;
        },
        term: (term) => {
            locs[term.location.idx!] = { kind: term.type, loc: term.location };
            switch (term.type) {
                case 'apply':
                    children[term.location.idx!] = idxs(
                        [term.target].concat(term.args),
                    );
                    break;
                case 'Attribute':
                    children[term.location.idx!] = [
                        term.target.location.idx!,
                        term.idLocation.idx!,
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
                    children[term.location.idx!] = term.is.args
                        .map((t) => addLoc(t.location, 'arg'))
                        .concat([term.body.location.idx!]);
                    break;
                case 'sequence':
                    children[term.location.idx!] = term.sts.map(
                        (t) => t.location.idx!,
                    );
                    break;
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
    return ['float', 'int', 'boolean', 'string', 'var', 'ref'].includes(kind);
};

export const addLocationIndices = (toplevel: ToplevelT) => {
    let idx = 0;
    const addIdx = (l: Location) => ({ ...l, idx: idx++ });

    return transformToplevel(toplevel, {
        toplevel: (value) => ({
            ...value,
            location: addIdx(value.location),
        }),
        term: (term) => {
            if (term.type === 'Attribute') {
                return {
                    ...term,
                    location: addIdx(term.location),
                    idLocation: addIdx(term.idLocation),
                };
            }
            return {
                ...term,
                location: addIdx(term.location),
            };
        },
        let: (l) => ({
            ...l,
            location: addIdx(l.location),
        }),
    });
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
    return lastToFirst;
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
