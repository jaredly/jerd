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
    OpHash,
    WithUnary,
} from '../parsing/parser-new';
import { precedence } from '../typing/terms/ops';
import { parseOpHash } from './hashes';
import { Context, Library, typeWithUnary } from './typeFile';
import {
    ResolvedType,
    resolveType,
    resolveTypeSym,
    resolveValue,
} from './resolve';
import { idName } from '../typing/env';
import { Type } from '../typing/types';
import { var_ } from '../typing/preset';
import { subtTypeVars } from '../typing/typeExpr';

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

export type GroupedOp = {
    type: 'GroupedOp';
    left: WithUnary | GroupedOp;
    items: Array<BinOpGroup>;
};

export type BinOpGroup = {
    type: 'BinOpRight';
    location: Location;
    op: binopWithHash;
    right: WithUnary | GroupedOp;
};

export type Groups = {
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
        const items: Array<BinOpGroup> = [rops[0]];
        let i = 1;
        for (; i < rops.length && opsEqual(orig, rops[i].op); i++) {
            items.push(rops[i]);
        }
        return reGroupOps1Level(
            {
                left: {
                    type: 'GroupedOp',
                    left,
                    items,
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
    hashRaw: string,
    hashLoc: Location,
    location: Location,
): null | t.Attribute => {
    const warn = (text: string) => ctx.warnings.push({ location, text });
    const hash = parseOpHash(hashRaw.slice(1));
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
    return resolveAttribute(ctx, base, type, hash.attr.attr, hashLoc, location);
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

export type Option = {
    left: t.Type;
    right: t.Type;
    term: t.Term;
    // THIS is for the `apply` type arguments.
    typeArgs: Array<t.Type>;
};

export const typePair = (
    ctx: Context,
    op: binopWithHash,
    left: WithUnary | GroupedOp,
    right: WithUnary | GroupedOp,
    location: Location,
    expectedTypes: Array<t.Type>,
): null | t.Term => {
    const options: Array<Option> = [];

    // let target: null | t.Attribute = null;
    // Things to consider:
    // - if the op has a hash, we just believe it, ... right?
    //   we could of course not believe it, if we wanted
    //   but we can handle that later
    if (op.hash != null) {
        const target = resolveOpHash(ctx, op.hash, op.location, location);
        if (
            target != null &&
            target.is.type === 'lambda' &&
            target.is.args.length === 2
        ) {
            options.push({
                left: target.is.args[0],
                right: target.is.args[1],
                term: target,
                typeArgs: [],
            });
        }
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

    if (options.length === 0) {
        const potentials = ctx.library.types.constructors.names[op.op];
        if (!potentials) {
            ctx.warnings.push({
                location: location,
                text: `No attribute ${op.op}`,
            });
            return null;
        }
        // Ok, so this is where some things get interesting,
        // because we want to resolve an implementor.
        // And if there are multiple options, then we need
        // to first resolve the arguments, so we know which
        // one to pick.
        // BUT that might get dicey? Or like, I like being
        // able to provide an "expectedType"...
        // So do I just try /each one/ ... that could get
        // quite expensive.

        // I think I'll evaluate without an expected type,
        // and then go from there.

        // OH yeah even more, there might be multiple attributes,
        // and multiple implementors for each.

        // Hmmmmmmmm when I'm searching around, I think I want
        // to cache ... binary ... operators.
        // like, "what are the ... "
        // Here are the Supertypes
        // of the given type.
        // Yeah, the library should cache the supertypes.
        // So I can just say "I'm looking for values that are
        // one of these supertypes".

        potentials.forEach(({ idx, id }) => {
            const decl = ctx.library.types.defns[idName(id)];
            if (decl.type !== 'Record' || idx >= decl.items.length) {
                return;
            }
            const row = decl.items[idx];
            // TODO: allow rest args?
            if (row.type !== 'lambda' || row.args.length !== 2) {
                return;
            }
            // const terms: Array<t.Term> = []
            ctx.bindings.values.forEach(({ sym, type }) => {
                // reffff hmm hmmmmm hm hmmm
                // or a var that has the right subtype
                if (type.type === 'ref' && type.ref.type === 'user') {
                    const decl = ctx.library.types.defns[idName(type.ref.id)];
                    if (decl.type === 'Record') {
                        if (decl.typeVbls.length) {
                            if (t.idsEqual(type.ref.id, id)) {
                                const applied = applyTypeVariablesToRecord(
                                    ctx,
                                    decl,
                                    type.typeVbls,
                                    location,
                                    idName(type.ref.id),
                                );
                                if (applied == null) {
                                    return;
                                }
                                const row = applied.items[idx];
                                if (row.type !== 'lambda') {
                                    return;
                                }
                                options.push({
                                    left: row.args[0],
                                    right: row.args[1],
                                    term: {
                                        type: 'Attribute',
                                        idx,
                                        ref: { type: 'user', id },
                                        idLocation: location, // STOPSHIP
                                        inferred: false,
                                        is: row.res,
                                        location,
                                        refTypeVbls: type.typeVbls,
                                        target: var_(sym, type, location),
                                    },
                                    typeArgs: [],
                                });
                            } else {
                                // Can't handle type variables
                                return;
                            }
                        }
                        const subs = getAllSubTypes(ctx.library, decl.extends);
                        if (subs.find((s) => t.idsEqual(s, id))) {
                            // options.push(var_(sym, type, op.location))
                            options.push({
                                left: row.args[0],
                                right: row.args[1],
                                // term: var_(sym, type, op.location),
                                term: {
                                    type: 'Attribute',
                                    idx,
                                    ref: { type: 'user', id },
                                    idLocation: location, // STOPSHIP
                                    inferred: false,
                                    is: row.res,
                                    location,
                                    refTypeVbls: [],
                                    target: var_(sym, type, location),
                                },
                                typeArgs: [],
                            });
                        }
                    }
                } else if (type.type === 'var') {
                    const b = ctx.bindings.types.find(
                        (b) => b.sym.unique === type.sym.unique,
                    );
                    if (b && b.subTypes.find((s) => t.idsEqual(s, id))) {
                        options.push({
                            left: row.args[0],
                            right: row.args[1],
                            // term: var_(sym, type, op.location),
                            term: {
                                type: 'Attribute',
                                idx,
                                ref: { type: 'user', id },
                                idLocation: location, // STOPSHIP
                                inferred: false,
                                is: row.res,
                                location,
                                refTypeVbls: [],
                                target: var_(sym, type, location),
                            },
                            typeArgs: [],
                        });
                    }
                }
            });
        });

        if (!options.length) {
            ctx.warnings.push({
                location,
                text: `No values found that match the operator. I found some types though.`,
            });
            return null;
        }

        const lefts = options.map((opts) => opts.left);

        const larg = typeUnaryOrGroup(ctx, left, lefts);
        // if (larg == null) {
        //     // TODO: put a hole here
        //     throw new Error('n');
        // }

        const rights = options
            .filter((opt) => (larg ? t.typesEqual(opt.left, larg.is) : true))
            .map((opts) => opts.right);

        const rarg = typeUnaryOrGroup(ctx, right, rights);

        // if (rarg == null) {
        //     throw new Error('fill with hole');
        // }

        // const op2 = selectOp(ctx, options, larg.is, rarg.is);
        const op2 = options.find(
            (opt) =>
                (!larg || t.typesEqual(larg.is, opt.left)) &&
                (!rarg || t.typesEqual(rarg.is, opt.right)),
        );
        if (!op2) {
            console.log(potentials, options, larg?.is, rarg?.is);
            throw new Error(`pick the first one, and fill with TypeError`);
        }

        return {
            type: 'apply',
            args: [
                larg || hole(op2.left, location),
                rarg || hole(op2.right, location),
            ],
            location,
            target: op2.term,
            effectVbls: [],
            is: (op2.term.is as t.LambdaType).res,
            typeVbls: op2.typeArgs,
        };
    }

    return null;
};

const hole = (type: t.Type, location: Location): t.TermHole => ({
    type: 'Hole',
    is: type,
    location,
});

export const typeUnaryOrGroup = (
    ctx: Context,
    term: WithUnary | GroupedOp,
    expected: Array<Type>,
) => {
    if (term.type === 'WithUnary') {
        return typeWithUnary(ctx, term, expected);
    }
    return typeGroup(ctx, term, expected);
};

// hmmmmmmmm ok yeah the groupedop just really isn't right.
// hmm. because we lose location information of the other ops.
export const typeGroup = (
    ctx: Context,
    group: GroupedOp,
    expectedTypes: Array<t.Type>,
): null | t.Term => {
    if (group.items.length === 1) {
        return typePair(
            ctx,
            group.items[0].op,
            group.left,
            group.items[0].right,
            group.items[0].location,
            expectedTypes,
        );
    }
    let left = group.left;
    group.items.forEach((item) => {
        left = { type: 'GroupedOp', left, items: [item] };
    });
    return typeGroup(ctx, left as GroupedOp, expectedTypes);
};

export const applyTypeVariablesToRecord = (
    ctx: Context,
    type: t.RecordDef,
    vbls: Array<Type>,
    location: Location | null,
    selfHash: string,
): t.RecordDef | null => {
    if (type.typeVbls.length !== vbls.length) {
        return null;
    }
    const mapping = createTypeVblMapping(ctx, type.typeVbls, vbls, location!);
    if (mapping == null) {
        return null;
    }
    return {
        ...type,
        typeVbls: [],
        items: type.items.map((t) => subtTypeVars(t, mapping, selfHash)),
    };
};

export const createTypeVblMapping = (
    ctx: Context,
    typeVbls: Array<t.TypeVblDecl>,
    vbls: Array<Type>,
    location: Location,
): { [unique: number]: Type } | null => {
    // console.log('create mapping', vbls);
    const mapping: { [unique: number]: Type } = {};
    if (vbls.length !== typeVbls.length) {
        // console.log('the ones', typeVbls);
        return null;
    }

    vbls.forEach((typ, i) => {
        const subs = typeVbls[i].subTypes;
        // console.log(i, typ, subs);
        for (let sub of subs) {
            if (!hasSubType(ctx, typ, sub)) {
                throw new Error(`Expected a subtype of ${idName(sub)}`);
            }
        }
        mapping[typeVbls[i].unique] = typ;
    });

    return mapping;
};

export const hasSubType = (ctx: Context, type: Type, id: t.Id) => {
    if (type.type === 'var') {
        const found = ctx.bindings.types.find(
            (b) => b.sym.unique === type.sym.unique,
        );
        if (!found) {
            return false;
        }
        for (let sid of found.subTypes) {
            if (t.idsEqual(id, sid)) {
                return true;
            }
            const decl = ctx.library.types.defns[idName(sid)];
            if (decl.type !== 'Record') {
                return false;
            }
            const allSubTypes = getAllSubTypes(ctx.library, decl.extends);
            if (allSubTypes.find((x) => t.idsEqual(id, x)) != null) {
                return true;
            }
        }
    }
    if (type.type !== 'ref' || type.ref.type === 'builtin') {
        return false;
    }
    if (t.idsEqual(type.ref.id, id)) {
        return true;
    }
    const decl = ctx.library.types.defns[idName(type.ref.id)];
    if (decl.type === 'Enum') {
        return false;
    }
    const allSubTypes = getAllSubTypes(ctx.library, decl.extends);
    return allSubTypes.find((x) => t.idsEqual(id, x)) != null;
};
