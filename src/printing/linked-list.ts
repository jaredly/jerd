// I made this to try to improve handler performance, but I don't think
// it was worth it. Keeping it around in case I decide I want it or something.

type LinkedList<T> = null | [T, LinkedList<T>];

const extractItem = <T>(
    head: LinkedList<T>,
    find: (item: T) => boolean,
): [T | null, LinkedList<T>] => {
    if (head == null) {
        return [null, null];
    }
    if (find(head[0])) {
        return head;
    }
    const top: LinkedList<T> = [head[0], null];
    let current: LinkedList<T> = top;
    let found: T | null = null;
    while (head[1] != null) {
        if (found == null && find(head[1][0])) {
            found = head[1][0];
        } else {
            current[1] = [head[1][0], null];
            current = current[1];
        }
        head = head[1];
    }
    return [found, top];
};

const withoutItem = <T>(head: LinkedList<T>, item: T) => {
    if (head == null) {
        return null;
    }
    if (head[0] === item) {
        return head[1];
    }
    const top: LinkedList<T> = [head[0], null];
    let current: LinkedList<T> = top;
    while (head[1] != null) {
        if (head[1][0] !== item) {
            current[1] = [head[1][0], null];
            current = current[1];
        }
        head = head[1];
    }
    return top;
};

const joinLinked = <T>(
    head: LinkedList<T>,
    tail: LinkedList<T>,
): LinkedList<T> => {
    if (head == null) {
        return tail;
    }
    if (tail == null) {
        return head;
    }
    const top: LinkedList<T> = [head[0], null];
    let current: LinkedList<T> = top;
    while (head[1] != null) {
        current[1] = [head[1][0], null];
        current = current[1];
        head = head[1];
    }
    current[1] = tail;
    return top;
};

export { joinLinked, withoutItem, extractItem, LinkedList };
