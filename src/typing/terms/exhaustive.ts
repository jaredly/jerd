// Based on
// http://moscova.inria.fr/~maranget/papers/warn/warn.pdf

/*

We turn our case arms into matricies
probably nested?

such that we can iterate (I think) through
possible instances of (v0...vn) to see if they
match any of the rows (p0...p0).


*/

type Constructor = {
    type: 'constructor';
    id: string;
    // If options is null, then this is a functionally "infinite" set
    // like strings or ints
    // This is used to look up all possible constructors
    groupId: string;
    // options: Array<string> | null;
    args: Array<Pattern>;
};

type Pattern =
    | { type: 'anything' }
    | Constructor
    | { type: 'or'; left: Pattern; right: Pattern };
// TODO: a "literal" type?

type Matrix = Array<Row>;
type Row = Array<Pattern>;
type Groups = { [groupId: string]: Array<string> | null };

const anything: Pattern = { type: 'anything' };

const anyList = (size) => {
    const res = new Array(size);
    res.fill(anything);
    return res;
};

const specializeRow = (constructor: string, arity: number, row: Row) => {
    switch (row[0].type) {
        case 'anything':
            return [anyList(arity).concat(row.slice(1))];
        case 'constructor':
            if (row[0].id === constructor) {
                return [row[0].args.concat(row.slice(1))];
            } else {
                return;
            }
        case 'or':
            return specializedMatrix(constructor, arity, [
                [row[0].left].concat(row.slice(1)),
                [row[0].right].concat(row.slice(1)),
            ]);
        default:
            let _x: never = row[0];
            throw new Error(`Unreachable row ${(row[0] as any).type}`);
    }
};

const specializedMatrix = (
    constructor: string,
    arity: number,
    matrix: Matrix,
) => {
    const specialized: Matrix = [];

    matrix.forEach((row) => {
        const rows = specializeRow(constructor, arity, row);
        if (rows != null) {
            specialized.push(...rows);
        }
    });

    return specialized;
};

// we're collecting constructor IDs
const isComplete = (
    groups: Groups,
    matrix: Matrix,
): { [key: string]: number } | null => {
    let gid;
    const found: { [id: string]: number } = {};
    matrix.forEach((row) => {
        if (row[0].type === 'constructor') {
            if (gid != null && row[0].groupId !== gid) {
                throw new Error(
                    `Constructors with different group IDs in the same position`,
                );
            }
            gid = row[0].groupId;
            found[row[0].id] = row[0].args.length;
        }
    });
    if (gid == null) {
        return null;
    }
    if (groups[gid] === null) {
        return null;
    }
    for (let id of groups[gid]!) {
        // At least one is missing
        if (found[id] == null) {
            return null;
        }
    }
    return found;
};

const isUseful = (groups: Groups, matrix: Matrix, row: Row) => {
    if (matrix.length === 0) {
        return true;
    } else if (row.length === 0) {
        return false;
    }
    switch (row[0].type) {
        case 'constructor': {
            const newRow = row[0].args.concat(row.slice(1));
            return isUseful(
                groups,
                specializedMatrix(row[0].id, row[0].args.length, matrix),
                newRow,
            );
        }
        case 'anything': {
            const alternatives = isComplete(groups, matrix);
            // it isn't complete
            if (alternatives == null) {
                if (matrix.some((row) => row[0].type === 'anything')) {
                    return false;
                }
                return true;
            } else {
                // it is!
                // but if there's an alternative for which
                // an array of "any"s for arguments
                // is useful, then this one is useful.
                for (let id of Object.keys(alternatives)) {
                    const newRow = anyList(alternatives[id]).concat(
                        row.slice(1),
                    );
                    if (
                        isUseful(
                            groups,
                            specializedMatrix(id, alternatives[id], matrix),
                            newRow,
                        )
                    ) {
                        return true;
                    }
                }
                return false;
            }
        }
    }
};
