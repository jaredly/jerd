/*
Ok how do I model this:

[A + B + C * D * E + F * G]
A
+B
+C
*D
*E
+F
*G

switch right {
	[{op, right}, ...rest] if isInGroup(op, group) => {

	}
}

if I switched it around, would that make it easier?

A+
B+
C*
D*
E+
F*
G

lops: Array<{left, op}>,
right: Expr

let process = (lops, right, level) => {
	switch (lops) {
		[{left, op}, ...rest] => {
			if (isThisLevel(op, level)) {
				switch rest {
					[] => {lops: [], right: combine(left, op, right)},
					[next, ...rest] => 
						process([
							combine(left, op, next, op2),
							...rest,
						], right, level)
				}
			} else {
				{lops, right} = process(rest, right, level)
				{lops: [{left, op}, ...lops], right}
			}
		},
		[] => {lops: [], right}
	}
}

A
+B
+C
*D
*E
+F
*G

let process = (left, rops, level) => {
	switch (rops) {
		[{op, right}, ...rest] => {
			if (isLevel(level, op)) {
				process(
					combine(left, op, right),
					rest,
					level
				)
			} else {
				result = process(
					right,
					rest,
					level
				)
				{left, rops: [{op, result.left}, ...result.rops]}
			}
		},
		[] => {left, rops}
	}
}

A * B / C




needs to become
[A + B + [C * C * E] + [F * G]]
A
+B
+
	C
	*D
	*E
+
	F
	*G

So, each leaf needs to /either/ be a "WithUnary" OR a BinOp. And I can convert a binop to a withunary, that's fine.

Ok, actually maybe this is fine.
Go through each of our dealios, ...
What about things with equal precedence?

*/

import * as t from '../typing/types';
import {
    binop,
    BinOp,
    BinOpRight,
    binopWithHash,
    IFilePosition,
    Location,
    WithUnary,
} from '../parsing/parser-new';
import { precedence } from '../typing/terms/ops';
import { parseOpHash } from './hashes';
import { Context, Library } from './typeFile';
import {
    ResolvedType,
    resolveType,
    resolveTypeSym,
    resolveValue,
} from './resolve';
import { idName } from '../typing/env';

const opsEqual = (one: binopWithHash, two: binopWithHash) =>
    one.op === two.op && one.hash === two.hash;

// const BinOpAsUnary = (op: BinOp): WithUnary => ({
//     type: 'WithUnary',
//     op: null,
//     location: op.location,
//     inner: {
//         type: 'WithSuffix',
//         decorators: [],
//         location: op.location,
//         suffixes: [],
//         sub: {
//             type: 'TupleLiteral',
//             location: op.location,
//             items: [op],
//         },
//     },
// });

// OOOH I can now allow different associativities? Maybe?

/*
let process = (left, rops, level) => {
	switch (rops) {
		[{op, right}, ...rest] => {
			if (isLevel(level, op)) {
				process(
					combine(left, op, right),
					rest,
					level
				)
			} else {
				result = process(
					right,
					rest,
					level
				)
				{left, rops: [{op, result.left}, ...result.rops]}
			}
		},
		[] => {left, rops}
	}
}
*/

const isLevel = (op: string, level: Array<string>) =>
    level.some((s) => op.startsWith(s));

// const combine = (left: WithUnary, op: binopWithHash, right: )

type GroupedOp = {
    type: 'GroupedOp';
    location: Location;
    op: binopWithHash;
    items: Array<WithUnary | GroupedOp>;
};

type BinOpGroup = {
    type: 'BinOpRight';
    location: Location;
    op: binopWithHash;
    right: WithUnary | GroupedOp;
};

type Groups = {
    location: Location;
    left: WithUnary | GroupedOp;
    rops: Array<BinOpGroup>;
};

const reGroupOps1Level = (
    { left, rops, location }: Groups,
    isLevel: (op: string) => boolean,
): Groups => {
    if (rops.length === 0) {
        return { left, rops: [], location };
    }
    if (isLevel(rops[0].op.op)) {
        const orig = rops[0].op;
        const items: Array<WithUnary | GroupedOp> = [left, rops[0].right];
        let i = 1;
        for (; i < rops.length && opsEqual(orig, rops[i].op); i++) {
            items.push(rops[i].right);
        }
        return reGroupOps1Level(
            {
                left: {
                    type: 'GroupedOp',
                    items,
                    location: rops[0].location,
                    op: orig,
                },
                rops: rops.slice(i),
                location,
            },
            isLevel,
        );
    } else {
        const result = reGroupOps1Level(
            {
                left: rops[0].right,
                rops: rops.slice(1),
                location: rops[0].location,
            },
            isLevel,
        );
        return {
            left,
            location,
            rops: [
                {
                    ...rops[0],
                    right: result.left,
                },
                ...result.rops,
            ],
        };
    }
};

export const reGroupOps = (binop: BinOp): WithUnary | GroupedOp => {
    if (!binop.rest.length) {
        // return binop.first;
        return binop.first;
    }
    let groups: Groups = {
        left: binop.first,
        rops: binop.rest,
        location: binop.location,
    };
    precedence
        .slice()
        .reverse()
        .forEach((level) => {
            groups = reGroupOps1Level(groups, (op) => isLevel(op, level));
        });
    if (groups.rops.length) {
        groups = reGroupOps1Level(groups, (_) => true);
    }
    if (groups.rops.length) {
        throw new Error(`Ungrouped ops`);
    }
    return groups.left;
};

export const resolveOpHash = (
    ctx: Context,
    hashRaw: binopWithHash,
    location: Location,
): null | t.Attribute => {
    const warn = (text: string) => ctx.warnings.push({ location, text });
    const hash = parseOpHash(hashRaw.op.slice(1));
    if (hash == null) {
        warn(`Unable to parse hash "${hashRaw}"`);
        return null;
    }
    if (hash.value == null || hash.attr == null || hash.attr.type == null) {
        ctx.warnings.push({ location, text: `Invalid hash "${hashRaw}"` });
        return null;
    }
    const base = resolveValue(ctx, hash.value, location);
    if (!base) {
        warn(`Unable to resolve value for operator`);
        return null;
    }
    // SOOO what about type ... variables.
    // if (base.type === 'ref')
    const type = resolveType(ctx, hash.attr.type, location);
    if (!type) {
        warn(`Unable to resolve type for operator`);
        return null;
    }
    return resolveAttribute(
        ctx,
        base,
        type,
        hash.attr.attr,
        hashRaw.location,
        location,
    );
};

export const resolveAttribute = (
    ctx: Context,
    base: t.Term,
    type: ResolvedType,
    attr: number,
    idLocation: Location,
    location: Location,
): t.Attribute | null => {
    const warn = (text: string) => ctx.warnings.push({ location, text });
    // OH WAIT
    // I don't think the attribute type #abc#THIS#0 part
    // will even be a :sym. Because it'll be referring to
    // the subType thing.
    if (type.type !== 'id') {
        warn(`Attribute type cannot be a symbol`);
        return null;
    }

    let decl = ctx.library.types.defns[idName(type.id)];
    if (decl.type === 'Enum') {
        warn(`Attribute type ${idName(type.id)} is an enum, not a record`);
        return null;
    }
    let refTypeVbls: Array<t.Type> = [];

    if (base.is.type === 'var') {
        const binding = resolveTypeSym(ctx, base.is.sym.unique);
        if (!binding) {
            warn(`Unable to resolve type variable ${base.is.sym.unique}`);
            return null;
        }
        const allSubTypes = getAllSubTypes(ctx.library, binding.subTypes);

        let found = false;
        for (let sub of allSubTypes) {
            if (t.idsEqual(sub, type.id)) {
                found = true;
            }
        }
    } else if (base.is.type !== 'ref' || base.is.ref.type !== 'user') {
        warn(
            `Attribute target is a ${base.is.type}, not a user-defined toplevel type`,
        );
        return null;
    } else {
        refTypeVbls = base.is.typeVbls;

        if (!t.idsEqual(base.is.ref.id, type.id)) {
            const baseDecl = ctx.library.types.defns[idName(base.is.ref.id)];
            if (baseDecl.type !== 'Record') {
                warn(
                    `Attribute type ${idName(base.is.ref.id)} is not a record`,
                );
                return null;
            }
            // TODO: allow records to extend with type variables
            const allSubTypes = getAllSubTypes(ctx.library, baseDecl.extends);

            let found = false;
            for (let sub of allSubTypes) {
                if (t.idsEqual(sub, type.id)) {
                    found = true;
                }
            }
            if (!found) {
                warn(
                    `Attribute id ${idName(
                        type.id,
                    )} is not a subtype of ${idName(base.is.ref.id)}`,
                );
                return null;
            }
            // TODO: when we allow extends with vbls, this will have
            // to be adjusted.
            refTypeVbls = [];
        }
    }

    if (attr > decl.items.length) {
        warn(`Attribute index out of range ${attr}`);
        return null;
    }
    return {
        type: 'Attribute',
        idLocation,
        location,
        idx: attr,
        inferred: false,
        is: decl.items[attr],
        ref: { type: 'user', id: type.id },
        target: base,
        refTypeVbls,
    };
};

export const getAllSubTypes = (
    lib: Library,
    extend: Array<t.Id>,
): Array<t.Id> => {
    return ([] as Array<t.Id>).concat(
        ...extend.map((id) => {
            const defn = lib.types.defns[idName(id)];
            if (defn.type !== 'Record') {
                return [];
            }
            return [id].concat(getAllSubTypes(lib, defn.extends));
        }),
    );
};

export const typeGroup = (ctx: Context, group: GroupedOp) => {
    let target: null | t.Attribute = null;
    // Things to consider:
    // - if the op has a hash, we just believe it, ... right?
    //   we could of course not believe it, if we wanted
    //   but we can handle that later
    if (group.op.hash != null) {
        target = resolveOpHash(ctx, group.op, group.location);
        // TODO: show some warnings or something
        // HERE we resolve ... stuff.
        // Should I allow hashes to reference local whatsits?
        // Seems like, in order for type classes to work,
        // I should.
        // What is our hash format, for once and for all?
        // #abcdef.2 is a stringified ID.
        // #:123 is a local symbol
        // we can put hashes after it to do more things.
        // like binops, for example, are all
        // the ... an attribute of a record.
        // And so the hash here .. the first bit is the
        // value, and the second bit is the type,
        // and the third bit is the index, right?
        // yeah.
        // So #abc#def#0
        // says it's term #abc, and getting the #def#0
        // attribute from it, to be our binop.
    }
};

export const typeBinOps = (ctx: Context, binop: BinOp) => {
    const groups = reGroupOps(binop);
};
