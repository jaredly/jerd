import { idName, refName } from './env';
import { applyTypeVariablesToRecord, getEnumReferences } from './typeExpr';
import {
    Env,
    Id,
    Reference,
    Term,
    Type,
    UserReference,
    walkTerm,
} from './types';

export const allLiteral = (env: Env, type: Type): boolean => {
    switch (type.type) {
        case 'var':
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
                );
                if (
                    rec.extends.some(
                        (id) =>
                            !allLiteral(env, {
                                type: 'ref',
                                ref: { type: 'user', id },
                                location: null,
                                typeVbls: [],
                                effectVbls: [],
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

export const getDependencyMap = (env: Env, term: Term, id: Id) => {
    let toCheck = getUserDependencies(term);
    const allDeps = { [idName(id)]: toCheck.slice() };
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
    const allDeps = getDependencyMap(env, term, id);
    const allIds: { [key: string]: Array<string> } = {};
    Object.keys(allDeps).forEach((k) => (allIds[k] = allDeps[k].map(idName)));
    const lastToFirst = topoSort(allIds);
    lastToFirst.reverse();
    return lastToFirst;
};

export const termDependencies = (term: Term): Array<Reference> => {
    switch (term.type) {
        case 'ref':
            return [term.ref];
        case 'var':
        case 'raise':
        case 'if':
        case 'handle':
        case 'sequence':
        case 'apply':
        case 'lambda':
        case 'Record':
        case 'Switch':
        case 'Enum':
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
