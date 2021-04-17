// Ok folks

import { Case, Let, Term } from './types';

export type Visitor = {
    term: (value: Term) => Term | null | false;
    let: (value: Let) => Let | null | false;
};

export const transformLet = (l: Let, visitor: Visitor): Let => {
    const transformed = visitor.let(l);
    if (transformed === false) {
        return l;
    }
    if (transformed != null) {
        l = transformed;
    }
    const value = transform(l.value, visitor);
    return value !== l.value ? { ...l, value } : l;
};

export const transform = (term: Term, visitor: Visitor): Term => {
    const transformed = visitor.term(term);
    if (transformed === false) {
        return term;
    }
    if (transformed != null) {
        term = transformed;
    }
    switch (term.type) {
        case 'raise': {
            let changed = false;
            const args = term.args.map((arg) => {
                const v = transform(arg, visitor);
                changed = changed || v !== arg;
                return v;
            });
            return changed ? { ...term, args } : term;
        }
        case 'if': {
            const cond = transform(term.cond, visitor);
            const yes = transform(term.yes, visitor);
            const no = term.no ? transform(term.no, visitor) : term.no;
            return cond !== term.cond || yes !== term.yes || no !== term.no
                ? { ...term, yes, no, cond }
                : term;
        }
        case 'handle': {
            const target = transform(term.target, visitor);
            const body = transform(term.pure.body, visitor);
            const pure =
                body !== term.pure.body ? { ...term.pure, body } : term.pure;
            let changed = false;
            const cases: Array<Case> = term.cases.map((kase) => {
                const body = transform(kase.body, visitor);
                changed = changed || body !== kase.body;
                return body !== kase.body ? { ...kase, body } : kase;
            });
            return target !== term.target || pure !== term.pure || changed
                ? { ...term, target, pure, cases }
                : term;
        }
        case 'sequence': {
            let changed = false;
            const sts = term.sts.map((t) => {
                const tr =
                    t.type === 'Let'
                        ? transformLet(t, visitor)
                        : transform(t, visitor);
                changed = changed || tr !== t;
                return tr;
            });
            return changed ? { ...term, sts } : term;
        }
        case 'apply': {
            const target = transform(term.target, visitor);
            let changed = false;
            const args = term.args.map((t) => {
                const tr = transform(t, visitor);
                changed = changed || tr !== t;
                return tr;
            });
            return target !== term.target || changed
                ? { ...term, args, target }
                : term;
        }
        case 'lambda': {
            const body = transform(term.body, visitor);
            return body !== term.body ? { ...term, body } : term;
        }
        case 'Record': {
            const subTypes = { ...term.subTypes };
            let base = term.base;
            if (term.base.spread) {
                const spread = transform(term.base.spread, visitor);
                if (spread !== term.base.spread) {
                    base = { ...term.base, spread };
                }
            }
            if (term.base.type === 'Concrete') {
                let changed = false;
                const rows = term.base.rows.map((term) => {
                    const res = term ? transform(term, visitor) : null;
                    changed = changed || res !== term;
                    return res;
                });
                if (changed) {
                    base = { ...term.base, rows };
                }
            }
            // const subTypes = term.subTypes
            let changed = false;
            Object.keys(term.subTypes).forEach((id) => {
                const subType = subTypes[id];
                const spread =
                    subType.spread != null
                        ? transform(subType.spread, visitor)
                        : subTypes.spread;
                let rchanged = false;
                const rows = subType.rows.map((row) => {
                    const r = row ? transform(row, visitor) : null;
                    rchanged = rchanged || r !== row;
                    return r;
                });
                changed = changed || spread !== subType.spread || rchanged;
                // @ts-ignore
                subTypes[id] =
                    spread !== subType.spread || rchanged
                        ? { ...subType, spread, rows }
                        : subType;
            });
            return base !== term.base || changed
                ? { ...term, subTypes, base }
                : term;
        }
        case 'Switch': {
            const t = transform(term.term, visitor);
            let changed = false;
            const cases = term.cases.map((kase) => {
                const body = transform(kase.body, visitor);
                changed = changed || body !== kase.body;
                return body !== kase.body ? { ...kase, body } : kase;
            });
            return t !== term.term || changed
                ? { ...term, term: t, cases }
                : term;
        }
        case 'Enum': {
            const inner = transform(term.inner, visitor);
            return inner !== term.inner ? { ...term, inner } : term;
        }
        case 'Tuple': {
            let changed = false;
            const items = term.items.map((item) => {
                const t = transform(item, visitor);
                changed = changed || t !== item;
                return t;
            });
            return changed ? { ...term, items } : term;
        }
        case 'Array': {
            let changed = false;
            const items = term.items.map((item) => {
                if (item.type === 'ArraySpread') {
                    const value = transform(item.value, visitor);
                    changed = changed || value !== item.value;
                    return value !== item.value ? { ...item, value } : item;
                } else {
                    const tr = transform(item, visitor);
                    changed = changed || tr !== item;
                    return tr;
                }
            });
            return changed ? { ...term, items } : term;
        }
        case 'TupleAccess':
        case 'Attribute': {
            const target = transform(term.target, visitor);
            return target !== term.target ? { ...term, target } : term;
        }
        case 'string':
        case 'int':
        case 'float':
        case 'boolean':
        case 'self':
        case 'ref':
        case 'var':
            return term;
        default:
            let _x: never = term;
            throw new Error(`Unexpected term type ${(term as any).type}`);
    }
};

export const walkTerm = (
    term: Term | Let,
    handle: (term: Term | Let) => void,
): void => {
    handle(term);
    switch (term.type) {
        case 'Let':
            return walkTerm(term.value, handle);
        case 'raise':
            return term.args.forEach((t) => walkTerm(t, handle));
        case 'if':
            walkTerm(term.cond, handle);
            walkTerm(term.yes, handle);
            if (term.no) {
                walkTerm(term.no, handle);
            }
            return;
        case 'handle':
            walkTerm(term.target, handle);
            walkTerm(term.pure.body, handle);
            term.cases.forEach((kase) => walkTerm(kase.body, handle));
            return;
        case 'sequence':
            return term.sts.forEach((t) => walkTerm(t, handle));
        case 'apply':
            walkTerm(term.target, handle);
            return term.args.forEach((t) => walkTerm(t, handle));
        case 'lambda':
            return walkTerm(term.body, handle);
        case 'Record':
            if (term.base.spread) {
                walkTerm(term.base.spread, handle);
            }
            if (term.base.type === 'Concrete') {
                term.base.rows.forEach((term) =>
                    term ? walkTerm(term, handle) : null,
                );
            }
            Object.keys(term.subTypes).forEach((id) => {
                const subType = term.subTypes[id];
                if (subType.spread != null) {
                    walkTerm(subType.spread, handle);
                }
                subType.rows.forEach((row) =>
                    row ? walkTerm(row, handle) : null,
                );
            });
            return;
        case 'Switch':
            walkTerm(term.term, handle);
            term.cases.forEach((kase) => {
                walkTerm(kase.body, handle);
            });
            return;
        case 'Enum':
            return walkTerm(term.inner, handle);
        case 'Tuple':
            term.items.forEach((item) => {
                walkTerm(item, handle);
            });
            return;
        case 'Array':
            term.items.forEach((item) => {
                if (item.type === 'ArraySpread') {
                    walkTerm(item.value, handle);
                } else {
                    walkTerm(item, handle);
                }
            });
            return;
        case 'TupleAccess':
        case 'Attribute':
            walkTerm(term.target, handle);
            return;
        case 'string':
        case 'int':
        case 'float':
        case 'boolean':
        case 'self':
        case 'ref':
        case 'var':
            return;
        default:
            let _x: never = term;
            throw new Error(`Unexpected term type ${(term as any).type}`);
    }
};
