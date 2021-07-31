import { Location } from '../../language/src/parsing/parser';
import { handlerSym } from '../../language/src/printing/ir/utils';
import { SourceItem, SourceMap } from '../../language/src/printing/printer';
import {
    ensureIdxUnique,
    getTermByIdx,
    IdxTree,
    insertAfterBindings,
    isAtomic,
    isTermLoc,
    maxLocationIdx,
    replaceAtIdx,
    transformWithBindings,
    usedLocalVariables,
} from '../../language/src/typing/analyze';
import { hashObject, idFromName, idName } from '../../language/src/typing/env';
import { transform } from '../../language/src/typing/transform';
import {
    Env,
    getEffects,
    Id,
    Lambda,
    Let,
    Sequence,
    Symbol,
    Term,
    Type,
} from '../../language/src/typing/types';
import { MenuItem } from './CellWrapper';
import { Selection } from './RenderItem';

export type LocLines = Array<Array<SourceItem>>;

export const goLeft = (
    idx: number,
    sourceMap: SourceMap,
    locLines: LocLines,
    tree: IdxTree,
): number => {
    const pos = sourceMap[idx];
    if (!pos) {
        return idx;
    }
    const line = locLines[pos.start.line];
    for (let i = line.findIndex((p) => p.idx === idx) - 1; i >= 0; i--) {
        if (
            (line[i].end.line < pos.start.line ||
                line[i].end.column < pos.start.column) &&
            isAtomic(tree.locs[line[i].idx].kind)
        ) {
            return line[i].idx;
        }
    }
    // if (i > 0) {
    //     return line[i - 1].idx;
    // }
    for (let lno = pos.start.line - 1; lno >= 0; lno--) {
        const line = locLines[lno];
        if (!line || !line.length) {
            continue;
        }
        for (let i = line.length - 1; i >= 0; i--) {
            if (!tree.locs[line[i].idx]) {
                // TODO this should error?
                continue;
            }
            if (isAtomic(tree.locs[line[i].idx].kind)) {
                return line[i].idx;
            }
        }
    }

    return idx;
};

export const goRight = (
    idx: number,
    sourceMap: SourceMap,
    locLines: LocLines,
    tree: IdxTree,
): number => {
    const pos = sourceMap[idx];
    if (!pos) {
        return idx;
    }
    const line = locLines[pos.end.line];
    if (!line) {
        return idx;
    }

    for (
        let i = line.findIndex((p) => p.idx === idx) + 1;
        i < line.length;
        i++
    ) {
        if (
            (line[i].start.line > pos.end.line ||
                line[i].start.column > pos.end.column) &&
            isAtomic(tree.locs[line[i].idx].kind)
        ) {
            return line[i].idx;
        }
    }

    for (let lno = pos.start.line + 1; lno < locLines.length; lno++) {
        const line = locLines[lno];
        if (!line || !line.length) {
            continue;
        }
        for (let i = 0; i < line.length; i++) {
            if (!tree.locs[line[i].idx]) {
                // TODO this should error?
                continue;
            }
            if (isAtomic(tree.locs[line[i].idx].kind)) {
                return line[i].idx;
            }
        }
    }

    return idx;
};

export const goDown = (
    idx: number,
    sourceMap: SourceMap,
    locLines: LocLines,
    tree: IdxTree,
): number => {
    const pos = sourceMap[idx];
    if (!pos) {
        return idx;
    }
    if (pos.start.line === locLines.length - 1) {
        return idx;
    }
    for (let lno = pos.start.line + 1; lno < locLines.length; lno++) {
        const line = locLines[lno];
        if (!line) {
            continue;
        }
        for (let i = 0; i < line.length; i++) {
            if (!tree.locs[line[i].idx]) {
                // TODO this should error?
                continue;
            }
            if (!isAtomic(tree.locs[line[i].idx].kind)) {
                continue;
            }
            if (
                i === line.length - 1 ||
                line[i + 1].start.column > pos.start.column
            ) {
                // console.log(line[i], line);
                return line[i].idx;
            }
        }
        const atomics = line.filter((l) => isAtomic(tree.locs[l.idx].kind));
        if (atomics.length > 0) {
            return atomics[atomics.length - 1].idx;
        }
    }

    return idx;
};

export const goUp = (
    idx: number,
    sourceMap: SourceMap,
    locLines: LocLines,
    tree: IdxTree,
): number => {
    const pos = sourceMap[idx];
    if (!pos) {
        return idx;
    }
    if (pos.start.line === 0) {
        return idx;
    }
    // console.log(locLines[pos.start.line - 1], pos);
    for (let lno = pos.start.line - 1; lno >= 0; lno--) {
        const line = locLines[lno];
        if (!line) {
            continue;
        }
        for (let i = 0; i < line.length; i++) {
            if (!tree.locs[line[i].idx]) {
                // TODO this should error?
                continue;
            }
            if (!isAtomic(tree.locs[line[i].idx].kind)) {
                continue;
            }
            if (
                i === line.length - 1 ||
                line[i + 1].start.column > pos.start.column
            ) {
                // const ii = Math.max(0, i - 1);
                // console.log(
                //     ii,
                //     line[i].start.column,
                //     pos.start.column,
                //     line[ii],
                // );
                // console.log(line[i], line);
                return line[i].idx;
            }
        }
        // if (line.length > 0) {
        //     return line[line.length - 1].idx;
        // }
    }

    return idx;
};

export const bindKeys = (
    idxTree: IdxTree,
    sourceMap: SourceMap,
    env: Env,
    term: Term,
    setIdx: (fn: (idx: number) => number) => void,
    setSelection: (fn: (sel: Selection) => Selection) => void,
    setMenu: (items: Array<MenuItem>) => void,
    addTerm: (term: Term, name: string) => void,
    setTerm: (term: Term) => void,
) => {
    const locLines: LocLines = [];
    Object.keys(sourceMap).forEach((idx: unknown) => {
        const loc = sourceMap[idx as number];
        if (locLines[loc.start.line]) {
            locLines[loc.start.line].push(loc);
        } else {
            locLines[loc.start.line] = [loc];
        }
    });
    locLines.forEach((line) =>
        line.sort((a, b) => a.start.column - b.start.column),
    );
    // @ts-ignore
    window.ddata = { locLines, idxTree };

    return (evt: KeyboardEvent) => {
        if (evt.target !== document.body) {
            return;
        }
        const { locs, parents, children } = idxTree!;

        if (evt.key === 'm') {
            setSelection((sel) => ({
                ...sel,
                marks: sel.marks.includes(sel.idx)
                    ? sel.marks.filter((i) => i !== sel.idx)
                    : sel.marks.concat([sel.idx]),
            }));
        }
        if (evt.key === 'M') {
            setSelection((sel) => ({ ...sel, marks: [] }));
        }

        if (evt.key === 'Escape') {
            setSelection((sel) => ({ ...sel, inner: false }));
        }

        if (evt.key === 'Enter' || evt.key === 'Return') {
            evt.stopPropagation();
            evt.preventDefault();
            setSelection((selection) => {
                if (!sourceMap[selection.idx]) {
                    for (let i = 0; i < locLines.length; i++) {
                        for (let x = 0; x < locLines[i].length; x++) {
                            const idx = locLines[i][x].idx;
                            if (sourceMap[idx]) {
                                return { inner: true, idx, marks: [] };
                            }
                        }
                    }
                    return selection;
                }
                if (!selection.inner) {
                    return { ...selection, inner: true };
                }
                const { idx, marks } = selection;
                const items: Array<MenuItem> = [];
                // items.push({ name: 'Hello', action: () => console.log('hi') });
                const focused = idxTree.locs[idx];

                const focusedTerm = getTermByIdx(term, idx);

                if (focused.kind === 'ref') {
                    items.push({
                        name: 'Inline term',
                        action: () => {
                            // ok fine
                            setTerm(inlineTerm(env, term, idx));
                        },
                    });
                }

                if (focused.kind === 'apply') {
                    items.push({
                        name: 'Inline function call',
                        action: () => {
                            setTerm(inlineFunctionCall(env, term, idx));
                        },
                    });
                }

                if (focusedTerm && focusedTerm.type !== 'sequence') {
                    items.push({
                        name: 'Surround in block',
                        action: () => {
                            setTerm(
                                replaceAtIdx(term, idx, (t) => {
                                    return {
                                        type: 'sequence',
                                        location: t.location,
                                        sts: [t],
                                        is: t.is,
                                    };
                                }),
                            );
                        },
                    });
                }

                if (
                    focusedTerm &&
                    focusedTerm.type === 'sequence' &&
                    focusedTerm.sts.length === 1 &&
                    focusedTerm.sts[0].type !== 'Let'
                ) {
                    items.push({
                        name: 'Collapse block',
                        action: () => {
                            setTerm(
                                transform(term, {
                                    term: (t) => {
                                        if (
                                            t.location.idx === idx &&
                                            t.type === 'sequence' &&
                                            t.sts.length === 1 &&
                                            t.sts[0].type !== 'Let'
                                        ) {
                                            return t.sts[0];
                                        }
                                        return null;
                                    },
                                }),
                            );
                        },
                    });
                }

                if (isTermLoc(focused.kind)) {
                    items.push({
                        name: 'Extract to variable',
                        askString: 'name',
                        action: (name: string) => {
                            const newTerm = extractToVariable(term, idx, name);
                            const duplicates = ensureIdxUnique(newTerm);
                            if (duplicates.length) {
                                console.error('DUPLICATES');
                                console.log(duplicates);
                                return;
                            }
                            setTerm(newTerm);
                        },
                    });
                    items.push({
                        name: 'Extract to toplevel term',
                        askString: 'Name',
                        action: (name: string) => {
                            const [newTerm, extractedTerm] = extractToToplevel(
                                term,
                                idx,
                                marks,
                            );
                            const duplicates = ensureIdxUnique(newTerm);
                            if (duplicates.length) {
                                console.error('DUPLICATES');
                                console.log(duplicates);
                                return;
                            }
                            addTerm(extractedTerm, name);
                            setTerm(newTerm);
                        },
                    });
                }

                if (focused.kind === 'let' || focused.kind === 'let-sym') {
                    items.push({
                        name: 'Delete and inline',
                        action: () => {
                            // ok do it
                            let found: null | Let = null;
                            const newTerm = transform(term, {
                                term: (t) => {
                                    if (found != null) {
                                        if (
                                            t.type === 'var' &&
                                            t.sym.unique ===
                                                found.binding.unique
                                        ) {
                                            // STOPSHIP: re-idx this, we really need to!
                                            return found.value;
                                        }
                                        return null;
                                    }
                                    if (t.type === 'sequence') {
                                        const sts = t.sts.filter((l) => {
                                            if (
                                                l.type === 'Let' &&
                                                (l.location.idx === idx ||
                                                    l.idLocation.idx === idx)
                                            ) {
                                                found = l;
                                                return false;
                                            }
                                            return true;
                                        });
                                        return found
                                            ? sts.length === 1 &&
                                              sts[0].type !== 'Let'
                                                ? sts[0]
                                                : { ...t, sts }
                                            : null;
                                    }
                                    return null;
                                },
                            });
                            setTerm(newTerm);
                        },
                    });
                }

                if (focused.kind === 'let-sym') {
                    items.push({
                        name: 'Rename',
                        askString: 'New name',
                        action: (newName: string) => {
                            const newTerm = transform(term, {
                                let: (l) => {
                                    if (l.idLocation.idx === idx) {
                                        return {
                                            ...l,
                                            binding: {
                                                ...l.binding,
                                                name: newName,
                                            },
                                        };
                                    }
                                    return null;
                                },
                                term: (t) => null,
                            });
                            setTerm(newTerm);
                        },
                    });
                }
                setMenu(items);

                return selection;
            });
            return true;
        }

        /*
            Ok what's my deal here
            - hm maybe only show the atomic things
            - but hm
            */
        if (evt.key === 'ArrowUp' || evt.key === 'k' || evt.key === 'K') {
            if (evt.shiftKey) {
                setIdx((idx) => {
                    const parent = parents[idx];
                    if (parent != null) {
                        // console.log(parent);
                        return parent;
                    }
                    return idx;
                });
            } else {
                setIdx((idx) => goUp(idx, sourceMap, locLines, idxTree));
            }
            evt.preventDefault();
            evt.stopPropagation();
            return true;
        }

        if (evt.key === 'ArrowDown' || evt.key === 'j' || evt.key === 'J') {
            if (evt.shiftKey) {
                setIdx((idx) => {
                    const kids = children[idx];
                    if (kids != null && kids.length > 0) {
                        // console.log(parent);
                        return kids[0];
                    }
                    return idx;
                });
            } else {
                setIdx((idx) => goDown(idx, sourceMap, locLines, idxTree));
            }
            evt.preventDefault();
            evt.stopPropagation();
            return true;
        }

        if (evt.key === 'ArrowRight' || evt.key === 'l') {
            setIdx((idx) => goRight(idx, sourceMap, locLines, idxTree));
        }
        if (evt.key === 'ArrowLeft' || evt.key === 'h') {
            setIdx((idx) => goLeft(idx, sourceMap, locLines, idxTree));
        }
    };
};

// TODO: this doesn't account for type variables right?
export const maxUnique = (term: Term) => {
    let max = 0;
    transform(term, {
        let: (t) => {
            max = Math.max(t.binding.unique, max);
            return null;
        },
        term: (term) => {
            if (term.type === 'var') {
                max = Math.max(max, term.sym.unique);
            }
            if (term.type === 'lambda') {
                term.args.forEach((arg) => {
                    max = Math.max(max, arg.unique);
                });
            }
            if (term.type === 'Switch') {
                // ergggggggg handle this
            }
            return null;
        },
    });
    return max;
};

export const extractToToplevel = (
    term: Term,
    idx: number,
    marks: Array<number>,
) => {
    let maxIdx = maxLocationIdx(term) + 1;
    let unique = maxUnique(term) + 1;
    const sym: Symbol = {
        unique: unique++,
        name: 'var',
    };
    let found: null | Term = null;

    term = transformWithBindings(term, {
        let: (l) => null,
        term: (t, bindings) => {
            if (t.location.idx === idx) {
                const unbound = usedLocalVariables(t);
                if (unbound.length || marks.length) {
                    const marked: Array<{ sym: Symbol; term: Term }> = [];
                    const replaced = marks.length
                        ? transform(t, {
                              term: (t) => {
                                  const at = marks.indexOf(t.location.idx!);
                                  if (at === -1) {
                                      return null;
                                  }
                                  const sym = {
                                      unique: unique++, // TODO hmm what how
                                      name: `arg${at}`,
                                  };
                                  marked[at] = {
                                      sym: sym,
                                      term: t,
                                  };
                                  return {
                                      type: 'var',
                                      sym,
                                      location: t.location,
                                      is: t.is,
                                  };
                              },
                          })
                        : t;
                    found = {
                        type: 'lambda',
                        idLocations: unbound
                            .map((u) => bindings[u].loc)
                            .concat(marked.map((m) => m.term.location)),
                        args: unbound
                            .map((u) => ({
                                unique: u,
                                name: bindings[u].name,
                            }))
                            .concat(marked.map((m) => m.sym)),
                        body: replaced,
                        location: { ...t.location, idx: maxIdx++ },
                        is: {
                            type: 'lambda',
                            location: { ...t.location, idx: maxIdx++ },
                            typeVbls: [],
                            // 🤔
                            effectVbls: [],
                            effects: getEffects(t),
                            args: unbound
                                .map((u) => bindings[u].type)
                                .concat(marked.map((m) => m.term.is)),
                            rest: null,
                            res: t.is,
                        },
                    };
                    const id = idFromName(hashObject(found));
                    return {
                        type: 'apply',
                        // TODO?
                        typeVbls: [],
                        effectVbls: null,
                        args: unbound
                            .map(
                                (u) =>
                                    ({
                                        type: 'var',
                                        sym: {
                                            unique: u,
                                            name: bindings[u].name,
                                        },
                                        location: {
                                            ...t.location,
                                            idx: maxIdx++,
                                        },
                                        is: bindings[u].type,
                                    } as Term),
                            )
                            .concat(marked.map((m) => m.term)),
                        target: {
                            type: 'ref',
                            ref: { type: 'user', id: id },
                            location: { ...t.location, idx: maxIdx++ },
                            is: found!.is,
                        },
                        location: { ...t.location, idx: maxIdx++ },
                        is: t.is,
                    };
                }
                found = t;
                const id = idFromName(hashObject(found));
                console.log('New thing', id);
                return {
                    type: 'ref',
                    ref: { type: 'user', id: id },
                    location: { ...t.location, idx: maxIdx++ },
                    is: t.is,
                };
            }
            return null;
        },
    });

    if (found == null) {
        throw new Error(`Term not found`);
    }
    return [term, found];
};

export const reUnique = (
    term: Term,
    unique: { current: number },
    extraSyms: Array<Symbol>,
): { term: Term; mapping: { [key: number]: number } } => {
    const mapping: { [orig: number]: number } = {};
    const addSym = (sym: Symbol) => {
        if (sym.unique === handlerSym.unique) {
            mapping[sym.unique] = sym.unique;
            return sym;
        }
        mapping[sym.unique] = unique.current++;
        return { ...sym, unique: mapping[sym.unique] };
    };
    extraSyms.forEach(addSym);
    const getSym = (sym: Symbol, loc: Location): Symbol => {
        if (mapping[sym.unique] == null) {
            // This is probably an upper-scope variable
            return sym;
        }
        return {
            ...sym,
            unique: mapping[sym.unique],
        };
    };

    // const max = maxUnique(term);
    console.log('reUnique', unique);
    const res = transform(term, {
        let: (l) => {
            return {
                ...l,
                binding: addSym(l.binding),
            };
        },
        term: (t) => {
            switch (t.type) {
                case 'var':
                    return {
                        ...t,
                        sym: getSym(t.sym, t.location),
                    };
                case 'lambda':
                    return {
                        ...t,
                        args: t.args.map((arg) => getSym(arg, t.location)),
                    };
            }
            // TODO: Handle; Switchhhhhh
            return null;
        },
    });
    console.log(unique, res, mapping);
    return { term: res, mapping };
};

export const inlineFunctionCall = (env: Env, term: Term, idx: number): Term => {
    return transform(term, {
        term: (t) => {
            if (t.location.idx === idx && t.type === 'apply') {
                let lambda: Lambda | null = null;
                if (t.target.type === 'ref' && t.target.ref.type === 'user') {
                    lambda = env.global.terms[
                        idName(t.target.ref.id)
                    ] as Lambda;
                } else if (t.target.type === 'lambda') {
                    lambda = t.target;
                }
                if (lambda == null || lambda.type !== 'lambda') {
                    return null;
                }
                const { term: body, mapping } = reUnique(
                    lambda.body,
                    {
                        current: maxUnique(term) + 1,
                    },
                    lambda.args,
                );
                if (t.args.length === 0) {
                    return body;
                }
                const args = lambda.args.map((arg) => ({
                    ...arg,
                    unique: mapping[arg.unique],
                }));
                console.log(args, mapping);
                return {
                    type: 'sequence',
                    is: lambda.body.is,
                    location: t.location,
                    sts: t.args
                        .map(
                            (arg, i) =>
                                ({
                                    type: 'Let',
                                    binding: args[i],
                                    value: arg,
                                    location: arg.location,
                                    idLocation: arg.location,
                                    is: arg.is,
                                } as Let | Term),
                        )
                        .concat([body]),
                };
            }
            return null;

            // if (
            //     t.location.idx === idx &&
            //     t.type === 'ref' &&
            //     t.ref.type === 'user'
            // ) {
            //     return env.global.terms[idName(t.ref.id)];
            // }
            // return null;
        },
    });
};

export const inlineTerm = (env: Env, term: Term, idx: number): Term => {
    return transform(term, {
        term: (t) => {
            if (
                t.location.idx === idx &&
                t.type === 'ref' &&
                t.ref.type === 'user'
            ) {
                return env.global.terms[idName(t.ref.id)];
            }
            return null;
        },
    });
};

export const extractToVariable = (
    term: Term,
    idx: number,
    name: string,
): Term => {
    let maxIdx = maxLocationIdx(term) + 1;
    const sym: Symbol = {
        unique: maxUnique(term) + 1,
        name,
    };
    let found: null | Term = null;
    term = transform(term, {
        term: (t) => {
            if (t.location.idx === idx) {
                found = t;
                return {
                    type: 'var',
                    sym,
                    location: { ...t.location, idx: maxIdx++ },
                    is: t.is,
                };
            }
            return null;
        },
    });
    if (found == null) {
        throw new Error(`Term not found`);
    }
    const unbound = usedLocalVariables(found);
    return insertAfterBindings(
        term,
        unbound,
        {
            type: 'Let',
            location: { ...(found as Term).location, idx: maxIdx++ },
            idLocation: { ...(found as Term).location, idx: maxIdx++ },
            binding: sym,
            value: found,
            is: (found as Term).is,
        },
        maxIdx,
    );
};
