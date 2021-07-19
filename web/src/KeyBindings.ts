import { SourceItem, SourceMap } from '../../language/src/printing/printer';
import {
    IdxTree,
    isAtomic,
    maxLocationIdx,
} from '../../language/src/typing/analyze';
import { transform } from '../../language/src/typing/transform';
import { Let, Sequence, Symbol, Term } from '../../language/src/typing/types';
import { MenuItem } from './CellWrapper';

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
        return line[line.length - 1].idx;
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

    // const i = line.findIndex((p) => p.idx === idx);
    // if (i < line.length - 1) {
    //     return line[i + 1].idx;
    // }
    for (let lno = pos.start.line + 1; lno < locLines.length; lno++) {
        const line = locLines[lno];
        if (!line || !line.length) {
            continue;
        }
        return line[0].idx;
    }

    return idx;
};

export const goDown = (
    idx: number,
    sourceMap: SourceMap,
    locLines: LocLines,
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
            if (line[i].start.column > pos.start.column) {
                // console.log(line[i], line);
                return line[Math.max(0, i - 1)].idx;
            }
        }
        if (line.length > 0) {
            return line[line.length - 1].idx;
        }
    }

    return idx;
};

export const goUp = (
    idx: number,
    sourceMap: SourceMap,
    locLines: LocLines,
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
            if (line[i].start.column > pos.start.column) {
                const ii = Math.max(0, i - 1);
                // console.log(
                //     ii,
                //     line[i].start.column,
                //     pos.start.column,
                //     line[ii],
                // );
                // console.log(line[i], line);
                return line[ii].idx;
            }
        }
        if (line.length > 0) {
            return line[line.length - 1].idx;
        }
    }

    return idx;
};

export const bindKeys = (
    idxTree: IdxTree,
    sourceMap: SourceMap,
    term: Term,
    setIdx: (fn: (idx: number) => number) => void,
    setMenu: (items: Array<MenuItem>) => void,
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
        const { locs, parents, children } = idxTree!;

        if (evt.key === 'Enter' || evt.key === 'Return') {
            evt.stopPropagation();
            evt.preventDefault();
            const items: Array<MenuItem> = [];
            items.push({ name: 'Hello', action: () => console.log('hi') });
            setIdx((idx) => {
                const focused = idxTree.locs[idx];
                if (focused.kind !== 'attribute-id') {
                    // expr lol
                    items.push({
                        name: 'Extract to variable',
                        action: () => {
                            // STOPSHIP: start here please
                            setTerm(extractToVariable(term, idx));
                        },
                    });
                }
                setMenu(items);

                return idx;
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
                setIdx((idx) => goUp(idx, sourceMap, locLines));
            }
            evt.preventDefault();
            evt.stopPropagation();
            return true;
        }

        if (evt.key === 'ArrowDown' || evt.key === 'j') {
            setIdx((idx) => goDown(idx, sourceMap, locLines));
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

export const extractToVariable = (term: Term, idx: number) => {
    let maxIdx = maxLocationIdx(term) + 1;
    const sym: Symbol = {
        unique: maxUnique(term) + 1,
        name: 'var',
    };
    let found: null | Term = null;
    term = transform(term, {
        let: (l) => null,
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
    if (!found) {
        return term;
    }
    let bound = false;
    return transform(term, {
        let: (l) => null,
        term: (t) => {
            if (bound) {
                return null;
            }
            if (t.type === 'lambda') {
                bound = true;
                let seq: Sequence =
                    t.body.type === 'sequence'
                        ? t.body
                        : {
                              type: 'sequence',
                              is: t.body.is,
                              sts: [t.body],
                              location: { ...t.body.location, idx: maxIdx++ },
                          };

                return {
                    ...t,
                    body: {
                        ...seq,
                        sts: [
                            {
                                type: 'Let',
                                binding: sym,
                                value: found!,
                                location: { ...t.body.location, idx: maxIdx++ },
                                is: found!.is,
                            } as Term | Let,
                        ].concat(seq.sts),
                    },
                };
            } else if (t.type === 'sequence') {
                bound = true;
                return {
                    ...t,
                    sts: [
                        {
                            type: 'Let',
                            binding: sym,
                            value: found!,
                            location: { ...t.location, idx: maxIdx++ },
                            is: found!.is,
                        } as Let | Term,
                    ].concat(t.sts),
                };
            }
            return null;
        },
    });
};
