import {
    Constructor,
    Pattern,
    Matrix,
    Row,
    Groups,
    isUseful,
    isExhaustive,
    anything,
    constructor,
    or,
    getUseless,
} from './exhaustive';

const groups = {
    // infinite sets
    int: null,
    string: null,
    option: ['some', 'none'],
    list: ['cons', 'nil'],
    three: ['one', 'two', 'three'],
};

const five = constructor('5', 'int', []);
const Some = (v) => constructor('some', 'option', [v]);
const None = constructor('none', 'option', []);
const Pair = (a, b) => constructor('pair', 'pair', [a, b]);
const Nil = constructor('nil', 'list', []);
const Cons = (a, b) => constructor('cons', 'list', [a, b]);
const List = (items) => {
    let last = items[items.length - 1];
    for (let i = items.length - 2; i >= 0; i--) {
        last = Cons(items[i], last);
    }
    return last;
};

const isNecessaryAndSufficient = (matrix) => {
    expect(isExhaustive(groups, matrix)).toBeTruthy();
    expect(getUseless(groups, matrix)).toHaveLength(0);
};

const isntExhaustive = (matrix) => {
    expect(isExhaustive(groups, matrix)).toBeFalsy();
};

describe('isExhaustive', () => {
    it('basic or', () => {
        isNecessaryAndSufficient([[Some(anything)], [None]]);
        isNecessaryAndSufficient([[or(Some(anything), None)]]);
    });
    it('ors should work', () => {
        isNecessaryAndSufficient([
            [constructor('one', 'three', [])],
            [
                or(
                    constructor('two', 'three', []),
                    constructor('three', 'three', []),
                ),
            ],
        ]);
    });
    it('anything should be exhaustive', () => {
        isNecessaryAndSufficient([[anything]]);
    });
    it('an int shouldnt be exhaustive', () => {
        isntExhaustive([[five]]);
    });
    it('an int with anything should be exhaustive', () => {
        isNecessaryAndSufficient([[five], [anything]]);
    });
    it('some/none should work', () => {
        isNecessaryAndSufficient([[Some(anything)], [None]]);
    });
    it("just some shouldn't work", () => {
        isntExhaustive([[Some(anything)]]);
    });
    it('lists folks', () => {
        isNecessaryAndSufficient([
            [List([Some(anything), anything, anything])],
            [List([None, anything, anything])],
            [List([anything, anything])],
            [Nil],
        ]);
        isntExhaustive([
            [List([Some(anything), anything, anything])],
            [List([None, anything, anything])],
            [Nil],
        ]);
    });
});
