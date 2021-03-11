// Based on
// http://moscova.inria.fr/~maranget/papers/warn/warn.pdf

/*

We turn our case arms into matricies
probably nested?

such that we can iterate (I think) through
possible instances of (v0...vn) to see if they
match any of the rows (p0...p0).


*/

type Pattern =
    | { type: 'anything' }
    | { type: 'constructor'; id: string; args: Array<Pattern> }
    | { type: 'or'; left: Pattern; right: Pattern };

type Matrix = Array<Row>;
type Row = Array<Pattern>;

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

const isUseful = (matrix: Matrix, row: Row) => {
    if (matrix.length === 0) {
        return true;
    } else if (row.length === 0) {
        return false;
    }
    switch (row[0].type) {
        case 'constructor': {
            const newRow = row[0].args.concat(row.slice(1));
            return isUseful(
                specializedMatrix(row[0].id, row[0].args.length, matrix),
                newRow,
            );
        }
        case 'anything': {
        }
    }
};
