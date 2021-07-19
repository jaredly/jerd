import { SourceItem, SourceMap } from '../../language/src/printing/printer';
import { IdxTree, isAtomic } from '../../language/src/typing/analyze';

export type LocLines = Array<Array<SourceItem>>;

export const goLeft = (
    idx: number,
    sourceMap: SourceMap,
    locLines: LocLines,
): number => {
    const pos = sourceMap[idx];
    if (!pos) {
        return idx;
    }
    const line = locLines[pos.start.line];
    const i = line.findIndex((p) => p.idx === idx);
    if (i > 0) {
        return line[i - 1].idx;
    }
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
): number => {
    const pos = sourceMap[idx];
    if (!pos) {
        return idx;
    }
    const line = locLines[pos.start.line];
    const i = line.findIndex((p) => p.idx === idx);
    if (i < line.length - 1) {
        return line[i + 1].idx;
    }
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
    console.log(locLines[pos.start.line - 1], pos);
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
    setIdx: (fn: (idx: number) => number) => void,
) => {
    const locLines: LocLines = [];
    Object.keys(sourceMap).forEach((idx: unknown) => {
        const loc = sourceMap[idx as number];
        // if (!isAtomic(idxTree!.locs[idx as number].kind)) {
        //     // console.log(
        //     //     'skip',
        //     //     idx,
        //     //     loc,
        //     //     idxTree!.locs[idx as number].kind,
        //     // );
        //     return;
        // }
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
            setIdx((idx) => goRight(idx, sourceMap, locLines));
        }
        if (evt.key === 'ArrowLeft' || evt.key === 'h') {
            setIdx((idx) => goLeft(idx, sourceMap, locLines));
        }
    };
};
