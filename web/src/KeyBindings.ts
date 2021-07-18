import { SourceItem, SourceMap } from '../../language/src/printing/printer';
import { IdxTree, isAtomic } from '../../language/src/typing/analyze';

export const bindKeys = (
    idxTree: IdxTree,
    sourceMap: SourceMap,
    setIdx: (fn: (idx: number) => number) => void,
) => {
    const locLines: Array<Array<SourceItem>> = [];
    Object.keys(sourceMap).forEach((idx: unknown) => {
        const loc = sourceMap[idx as number];
        if (!isAtomic(idxTree!.locs[idx as number].kind)) {
            // console.log(
            //     'skip',
            //     idx,
            //     loc,
            //     idxTree!.locs[idx as number].kind,
            // );
            return;
        }
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
        console.log(evt.key);
        if (evt.key === 'ArrowUp') {
            setIdx((idx) => {
                if (!locs[idx]) {
                    console.log('wat', idx, locs);
                    return idx;
                }
                const pos = sourceMap[idx];
                if (pos.start.line === 0) {
                    return idx;
                }
                for (let lno = pos.start.line - 1; lno >= 0; lno--) {
                    const line = locLines[lno];
                    if (!line) {
                        continue;
                    }
                    for (let i = 0; i < line.length; i++) {
                        if (line[i].start.column > pos.start.column) {
                            console.log(line[i], line);
                            return line[Math.max(0, i - 1)].idx;
                        }
                    }
                    if (line.length > 0) {
                        return line[0].idx;
                    }
                }

                return idx;
            });
        }

        if (evt.key === 'ArrowDown') {
            setIdx((idx) => {
                const pchildren = children[idx];
                if (pchildren) {
                    return pchildren[0];
                }
                return idx;
            });
        }

        if (evt.key === 'ArrowRight') {
            setIdx((idx) => {
                const parent = parents[idx];
                if (parent) {
                    const pchildren = children[parent];
                    const i0 = pchildren.indexOf(idx);
                    if (i0 < pchildren.length - 1) {
                        return pchildren[i0 + 1];
                    }
                }
                return idx;
            });
        }
        if (evt.key === 'ArrowLeft') {
            setIdx((idx) => {
                const parent = parents[idx];
                if (parent) {
                    const pchildren = children[parent];
                    const i0 = pchildren.indexOf(idx);
                    if (i0 < pchildren.length - 1) {
                        return pchildren[i0 + 1];
                    }
                }
                return idx;
            });
        }
    };
};
