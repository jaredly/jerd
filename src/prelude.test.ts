// Tests for my little linked list impl

import { LinkedList, extractItem, withoutItem, joinLinked } from './prelude';

const toLinked = <T>(list: Array<T>): LinkedList<T> => {
    if (list.length === 0) {
        return null;
    }
    let top: LinkedList<T> = [list[0], null];
    let current = top;
    list.slice(1).forEach((item) => {
        current[1] = [item, null];
        current = current[1];
    });
    return top;
};

describe('toLinked', () => {
    it('should work', () => {
        expect(toLinked([])).toEqual(null);
        expect(toLinked([1])).toEqual([1, null]);
        expect(toLinked([1, 2, 3])).toEqual([1, [2, [3, null]]]);
        expect(toLinked([1, 2, 3, 4, 5])).toEqual([
            1,
            [2, [3, [4, [5, null]]]],
        ]);
    });
});

describe('joinLinked', () => {
    it('should work', () => {
        expect(joinLinked(toLinked([1, 2, 3]), toLinked([5, 6, 7]))).toEqual(
            toLinked([1, 2, 3, 5, 6, 7]),
        );
    });

    it('should work with empty first', () => {
        const x = toLinked([2, 3, 4]);
        expect(joinLinked(null, x)).toEqual(x);
    });

    it('should work with both empty', () => {
        expect(joinLinked(null, null)).toEqual(null);
    });

    it('should work with empty second', () => {
        const x = toLinked([2, 3, 4]);
        expect(joinLinked(x, null)).toEqual(x);
    });
});

describe('withoutItem', () => {
    it('should work', () => {
        const source = [1, 2, 3, 4, 5];
        const rest = withoutItem(toLinked(source), 2);
        expect(rest).toEqual(toLinked([1, 3, 4, 5]));
    });

    it('should work for last', () => {
        const source = [1, 2, 3, 4, 5];
        const rest = withoutItem(toLinked(source), 5);
        expect(rest).toEqual(toLinked([1, 2, 3, 4]));
    });

    it('should work for first', () => {
        const source = [1, 2, 3, 4, 5];
        const rest = withoutItem(toLinked(source), 1);
        expect(rest).toEqual(toLinked([2, 3, 4, 5]));
    });
});

describe('extractItem', () => {
    it('should find and extract', () => {
        const source = [1, 2, 3, 4, 5];
        const [found, rest] = extractItem(toLinked(source), (x) => x == 2);
        expect(found).toEqual(2);
        expect(rest).toEqual(toLinked([1, 3, 4, 5]));
    });

    it('should find the first one', () => {
        const source = [1, 2, 3, 4, 5];
        const [found, rest] = extractItem(toLinked(source), (x) => x == 1);
        expect(found).toEqual(1);
        expect(rest).toEqual(toLinked([2, 3, 4, 5]));
    });

    it('should find the last one', () => {
        const source = [1, 2, 3, 4, 5];
        const [found, rest] = extractItem(toLinked(source), (x) => x == 5);
        expect(found).toEqual(5);
        expect(rest).toEqual(toLinked([1, 2, 3, 4]));
    });

    it('should work when missing', () => {
        const source = [1, 2, 3, 4, 5];
        const [found, rest] = extractItem(toLinked(source), (x) => false);
        expect(found).toEqual(null);
        expect(rest).toEqual(toLinked(source));
    });
});
