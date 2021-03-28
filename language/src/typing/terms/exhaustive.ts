// Based on
// http://moscova.inria.fr/~maranget/papers/warn/warn.pdf

/*

We turn our case arms into matricies
probably nested?

such that we can iterate (I think) through
possible instances of (v0...vn) to see if they
match any of the rows (p0...p0).



ok, so how to arrays look

[x, y, ...z]
is "an array of at least two elements, with a wildcard at the end"
oh yeah I guess I don't want to allow anything but a wildcard in the spread. that makes sense.
[...a, b, c]
is "an array of at least two elements, matching on the last two"
and
[x, y, ...a, b, c]
is "an array of at least 4 elements, matching on the first and last two"

ahhh so what if instead I conceptualized it as:
List(heads, tails)
where heads and tails are ConsLists?
yeah that would totally work.

So
[x, y, ...z]
becomes
List(Cons(x, Cons(y, z)), _)

and
[x, y]
=
List(Cons(x, Cons(y, nil)), nil)

yeah I think that should actually work just fine.
love it!

yeah and the rule is: only one spread per pattern
it can be beginning, middle, or end, it's fine.

*/

// Records, Enums, ints/strings/etc.
export type Constructor = {
    type: 'constructor';
    // For records, this is the type hash
    // for Enums, this is the record hash
    // for ints/strings/etc., this is the literal value
    //
    id: string;
    // This is used to look up all possible constructors
    // for records, there's only one. For enums, there's a finite number.
    // for strings or ints or such, there's an infinite number.
    groupId: string;
    args: Array<Pattern>;
};

export type Pattern =
    // _ or an id
    | { type: 'anything' }
    | Constructor
    // X | Y
    | { type: 'or'; left: Pattern; right: Pattern };

export type Matrix = Array<Row>;
export type Row = Array<Pattern>;
export type Groups = { [groupId: string]: Array<string> | null };

export const anything: Pattern = { type: 'anything' };
export const constructor = (
    id: string,
    groupId: string,
    args: Array<Pattern>,
): Constructor => ({
    type: 'constructor',
    id,
    groupId,
    args,
});
export const or = (left: Pattern, right: Pattern): Pattern => ({
    type: 'or',
    left,
    right,
});

const anyList = (size: number) => {
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
    let gid: string | null = null;
    const found: { [id: string]: number } = {};
    const checkRow = (row: Pattern) => {
        if (row.type === 'constructor') {
            if (gid != null && row.groupId !== gid) {
                throw new Error(
                    `Constructors with different group IDs in the same position`,
                );
            }
            gid = row.groupId;
            found[row.id] = row.args.length;
        } else if (row.type === 'or') {
            checkRow(row.left);
            checkRow(row.right);
        }
    };
    matrix.forEach((row) => checkRow(row[0]));
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

const defaultMatrix = (matrix: Matrix): Matrix => {
    const result: Matrix = [];
    matrix.forEach((row) => {
        if (row[0].type === 'anything') {
            result.push(row.slice(1));
        } else if (row[0].type === 'or') {
            result.push(
                ...defaultMatrix([
                    [row[0].left].concat(row.slice(1)),
                    [row[0].right].concat(row.slice(1)),
                ]),
            );
        }
    });
    return result;
};

export const isExhaustive = (groups: Groups, matrix: Matrix) => {
    return !isUseful(groups, matrix, anyList(matrix[0].length));
};

export const getUseless = (groups: Groups, matrix: Matrix) => {
    const current: Matrix = [];
    const useless: Matrix = [];
    matrix.forEach((row) => {
        if (isUseful(groups, current, row)) {
            current.push(row);
        } else {
            useless.push(row);
        }
    });
    return useless;
};

export const isUseful = (groups: Groups, matrix: Matrix, row: Row): boolean => {
    // No cases left! the current case is useful
    if (matrix.length === 0) {
        return true;
        // No items left! the current case is useless
    } else if (row.length === 0) {
        return false;
    }
    if (matrix[0].length === 0) {
        return false;
    }
    const pattern = row[0];
    const rest = row.slice(1);
    switch (pattern.type) {
        case 'constructor': {
            const newRow = pattern.args.concat(rest);
            return isUseful(
                groups,
                specializedMatrix(pattern.id, pattern.args.length, matrix),
                newRow,
            );
        }
        case 'anything': {
            const alternatives = isComplete(groups, matrix);
            // it isn't complete
            if (alternatives == null) {
                // get our anys, and check them
                const defaults = defaultMatrix(matrix);
                // No other defaults, we're good
                if (!defaults.length) {
                    return true;
                }
                return isUseful(groups, defaults, rest);
                // if (matrix.some((row) => pattern.type === 'anything')) {
                //     return false;
                // }
                // return true;
            } else {
                // it is!
                // but if there's an alternative for which
                // an array of "any"s for arguments
                // is useful, then this one is useful.
                for (let id of Object.keys(alternatives)) {
                    const newRow = anyList(alternatives[id]).concat(rest);
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
        case 'or': {
            return (
                isUseful(groups, matrix, [pattern.left].concat(rest)) ||
                isUseful(groups, matrix, [pattern.right].concat(rest))
            );
        }
    }
};
