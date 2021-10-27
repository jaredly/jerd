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
    BinOp_inner,
    IFilePosition,
    Location,
    OpHash,
    WithUnary,
} from '../parsing/parser-new';
import { precedence } from '../typing/terms/ops';
import { parseOpHash } from './hashes';
import { Context } from './Context';
import { typeExpression } from './typeExpression';
import { Library, typeDef } from './Library';
import {
    ResolvedType,
    resolveType,
    resolveTypeSym,
    resolveValue,
} from './resolve';
import { idFromName, idName } from '../typing/env';
import { Type } from '../typing/types';
import { pureFunction, var_, void_ } from '../typing/preset';
import { showLocation, subtTypeVars } from '../typing/typeExpr';
import { resolveTypeVbls } from '../typing/getTypeError';
import { showType } from '../typing/unify';
import { getAllSubTypes, hasSubType } from './utils';
import { transformType } from '../typing/auto-transform';

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

export const reGroupOps = (binop: BinOp_inner): WithUnary | GroupedOp => {
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
    // TODO: expected here?
    const base = resolveValue(ctx, hash.value, location, []);
    if (!base) {
        warn(`Unable to resolve value for operator`);
        return null;
    }
    return resolveAttribute(
        ctx,
        base,
        hash.attr.type,
        hash.attr.attr,
        hashLoc,
        location,
    );
};

export const resolveAttribute = (
    ctx: Context,
    base: t.Term,
    tid: t.Id,
    attr: number,
    idLocation: Location,
    location: Location,
): t.Attribute | null => {
    const warn = (text: string) => ctx.warnings.push({ location, text });
    // OH WAIT
    // I don't think the attribute type #abc#THIS#0 part
    // will even be a :sym. Because it'll be referring to
    // the subType thing.
    let decl = ctx.library.types.defns[idName(tid)];
    if (!decl) {
        warn(`Attribute type ${idName(tid)} doesn't exist`);
        return null;
    }
    if (decl.defn.type === 'Enum') {
        warn(`Attribute type ${idName(tid)} is an enum, not a record`);
        return null;
    }
    let refTypeVbls: Array<t.Type> = [];

    const supers = ctx.library.types.superTypes[idName(tid)];
    if (base.is.type === 'var') {
        const binding = resolveTypeSym(ctx, base.is.sym.unique);
        if (!binding) {
            warn(`Unable to resolve type variable ${base.is.sym.unique}`);
            return null;
        }
        const allSubTypes = getAllSubTypes(ctx.library, binding.subTypes);

        let found = false;
        for (let sub of allSubTypes) {
            if (t.idsEqual(sub, tid)) {
                found = true;
            }
        }
        if (!found) {
            warn(
                `Attribute id ${idName(
                    tid,
                )} is not a subtype of type variable ${base.is.sym.name}#:${
                    base.is.sym.unique
                }`,
            );
            return null;
        }
    } else if (base.is.type !== 'ref' || base.is.ref.type !== 'user') {
        warn(
            `Attribute target is a ${showType(
                null,
                base.is,
            )}, not a user-defined toplevel type`,
        );
        return null;
    } else {
        refTypeVbls = base.is.typeVbls;

        if (!t.idsEqual(base.is.ref.id, tid)) {
            const bid = base.is.ref.id;
            if (!supers.some((id) => t.idsEqual(id, bid))) {
                warn(
                    `Attribute id ${idName(tid)} is not a subtype of ${idName(
                        bid,
                    )}`,
                );
                return null;
            }
            // TODO: when we allow extends with vbls, this will have
            // to be adjusted.
            refTypeVbls = [];
        }
    }

    if (attr > decl.defn.items.length) {
        warn(`Attribute index out of range ${attr}`);
        return null;
    }
    return {
        type: 'Attribute',
        idLocation,
        location,
        idx: attr,
        inferred: false,
        is: decl.defn.items[attr],
        ref: { type: 'user', id: tid },
        target: base,
        refTypeVbls,
    };
};

export type Option = {
    args: Array<t.Type>;
    // left: t.Type;
    // right: t.Type;
    term: t.Term;
    // THIS is for the `apply` type arguments.
    // typeArgs: Array<t.Type>;
};

export const typePair = (
    ctx: Context,
    op: binopWithHash,
    left: WithUnary | GroupedOp,
    right: WithUnary | GroupedOp,
    location: Location,
    expectedTypes: Array<t.Type>,
): t.Term => {
    // TODO: KEEP TRACK of the return types, and compare them to the expected types.
    const options: Array<Option> = [];

    let addedBuiltins = false;

    // let target: null | t.Attribute = null;
    // Things to consider:
    // - if the op has a hash, we just believe it, ... right?
    //   we could of course not believe it, if we wanted
    //   but we can handle that later
    if (op.hash != null) {
        if (op.hash === '#builtin') {
            addedBuiltins = true;
            if (ctx.builtins.ops.binary[op.op]) {
                ctx.builtins.ops.binary[op.op].forEach(
                    ({ left, right, output }) => {
                        options.push({
                            args: [left, right],
                            // left,
                            // right,
                            term: {
                                type: 'ref',
                                ref: { type: 'builtin', name: op.op },
                                location,
                                is: pureFunction([left, right], output),
                            },
                            // typeArgs: [],
                        });
                    },
                );
            } else {
                ctx.warnings.push({
                    location,
                    text: `Unknown builtin op ${op.op}`,
                });
            }
        } else {
            const target = resolveOpHash(ctx, op.hash, op.location, location);
            if (
                target != null &&
                target.is.type === 'lambda' &&
                target.is.args.length === 2
            ) {
                options.push({
                    args: target.is.args,
                    // left: target.is.args[0],
                    // right: target.is.args[1],
                    term: target,
                    // typeArgs: [],
                });
            }
        }
    }

    const potentials = ctx.library.types.constructors.names[op.op];
    if (!potentials && !options.length && !ctx.builtins.ops.binary[op.op]) {
        ctx.warnings.push({
            location: location,
            text: `No attribute ${op.op}`,
        });
        return attributeHole(ctx, op.op, left, location, right, expectedTypes);
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

    if (potentials) {
        options.push(
            ...findBinopImplementorsForRecordTypes(
                potentials,
                ctx,
                location,
                2,
            ),
        );
    }

    if (!addedBuiltins && ctx.builtins.ops.binary[op.op]) {
        ctx.builtins.ops.binary[op.op].forEach(({ left, right, output }) => {
            options.push({
                args: [left, right],
                // left,
                // right,
                term: {
                    type: 'ref',
                    ref: { type: 'builtin', name: op.op },
                    location,
                    is: pureFunction([left, right], output),
                },
                // typeArgs: [],
            });
        });
    }

    if (!options.length) {
        ctx.warnings.push({
            location,
            text: `No values found that match the operator. I found some types though.`,
        });
        return attributeHole(ctx, op.op, left, location, right, expectedTypes);
    }

    // if (left.type === 'Int') {
    //     // I don't love the idea of hacking this up
    //     // but maybe it's fine. This is really more of a little convenience, right?
    //     // And honestly, maybe it's fine to say "the left one wins".
    //     // It's predictable.
    // }

    const lefts = options.map((opts) => opts.args[0]);

    const larg = typeUnaryOrGroup(ctx, left, lefts);
    const rights: Array<Type> = [];
    options.forEach((opt) => {
        const mapping: { [unique: number]: Type } = {};
        if (resolveTypeVbls(larg.is, opt.args[0], mapping)) {
            rights.push(subtTypeVars(opt.args[1], mapping, undefined));
        } else {
            // console.log(mapping, opt.left);
        }
    });

    const rarg = typeUnaryOrGroup(ctx, right, rights);

    const op2 = options.find((opt) => {
        const mapping: { [unique: number]: Type } = {};
        if (!resolveTypeVbls(larg.is, opt.args[0], mapping)) {
            return false;
        }
        let ris = opt.args[1];
        if (Object.keys(mapping).length !== 0) {
            ris = subtTypeVars(ris, mapping, undefined);
        }
        if (!t.typesEqual(ris, rarg.is)) {
            return false;
        }

        return true;
    });
    if (!op2) {
        console.log(potentials, options, larg.is, rarg.is);
        console.log(larg);
        console.log(rarg);
        options.forEach((option) => {
            console.log(option.args[0], option.args[1]);
        });
        throw new Error(
            `pick the first one, and fill with TypeError ${showLocation(
                larg.location,
            )}`,
        );
    }

    if (op2.term.is.type !== 'lambda') {
        console.log(op2.term);
        throw new Error(`Not lambda`);
    }

    return {
        type: 'apply',
        args: [larg, rarg],
        location,
        target: op2.term,
        effectVbls: null,
        is: op2.term.is.res,
        typeVbls: [], // op2.typeArgs,
    };
};

// const hole = (type: t.Type, location: Location): t.TermHole => ({
//     type: 'Hole',
//     is: type,
//     location,
// });

export const typeUnaryOrGroup = (
    ctx: Context,
    term: WithUnary | GroupedOp,
    expected: Array<Type>,
) => {
    if (term.type !== 'GroupedOp') {
        return typeExpression(ctx, term, expected);
    }
    return typeGroup(ctx, term, expected);
};

// hmmmmmmmm ok yeah the groupedop just really isn't right.
// hmm. because we lose location information of the other ops.
export const typeGroup = (
    ctx: Context,
    group: GroupedOp,
    expectedTypes: Array<t.Type>,
): t.Term => {
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

export const mapTypeAndEffectVariablesInType = (
    mapping: { [unique: number]: Type },
    effMapping: { [unique: number]: Array<t.EffectRef> },
    type: Type,
) =>
    transformType(
        type,
        {
            Type: (t) => {
                if (t.type === 'var' && mapping[t.sym.unique]) {
                    return mapping[t.sym.unique];
                }
                if (
                    t.type === 'lambda' &&
                    t.effects.find(
                        (e) =>
                            e.type === 'var' &&
                            effMapping[e.sym.unique] != null,
                    )
                ) {
                    const effects: Array<t.EffectRef> = [];
                    t.effects.forEach((eff) => {
                        if (eff.type === 'var' && effMapping[eff.sym.unique]) {
                            effects.push(...effMapping[eff.sym.unique]);
                        } else {
                            effects.push(eff);
                        }
                    });
                    return { ...t, effects };
                }
                return null;
            },
        },
        null,
    );

export const applyTypeVariablesToRecord = (
    ctx: Context,
    type: t.RecordDef,
    vbls: Array<Type>,
    // effectVbls: Array<t.EffectRef>,
    location: Location,
    selfHash: string,
): t.RecordDef => {
    if (type.typeVbls.length !== vbls.length) {
        return type;
    }
    const mapping = createTypeVblMapping(ctx, type.typeVbls, vbls, location);
    // const effMapping = createEffectVblMapping(ctx, type.effectVbls, effVbls, location);
    if (type.effectVbls.length > 1) {
        throw new Error(`can't handle multiple effect vbls just yet`);
    }
    const effMapping =
        // type.effectVbls.length === 1
        //     ? { [type.effectVbls[0].sym.unique]: effectVbls } :
        {};
    return {
        ...type,
        extends: type.extends.map(
            (t) =>
                mapTypeAndEffectVariablesInType(
                    mapping!,
                    effMapping,
                    t,
                ) as t.UserTypeReference,
        ),
        typeVbls: [],
        items: type.items.map((t) =>
            mapTypeAndEffectVariablesInType(mapping!, effMapping, t),
        ),
    };
};

// export const createEffectVblMapping = (ctx: Context, vbls: Array<number>, effectVbls: Array<t.EffectRef>, location: Location) => {
// }

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
        mapping[typeVbls[i].sym.unique] = typ;
    });

    return mapping;
};

function attributeHole(
    ctx: Context,
    text: string,
    left: WithUnary | GroupedOp,
    location: Location,
    right: WithUnary | GroupedOp,
    expectedTypes: t.Type[],
): t.Term {
    const larg = typeUnaryOrGroup(ctx, left, []);
    const rarg = typeUnaryOrGroup(ctx, right, []);

    const res = expectedTypes.length ? expectedTypes[0] : void_;

    return {
        type: 'apply',
        args: [larg, rarg],
        location,
        target: {
            type: 'NotFound',
            is: pureFunction([larg.is, rarg.is], res),
            location,
            text,
        },
        effectVbls: [],
        is: res,
        typeVbls: [],
    };
}

export function findBinopImplementorsForRecordTypes(
    potentials: { id: t.Id; idx: number }[],
    ctx: Context,
    location: Location,
    numArgs: number,
): Array<Option> {
    const options: Array<Option> = [];
    potentials.forEach(({ idx, id }) => {
        const { defn: decl } = ctx.library.types.defns[idName(id)];
        if (decl.type !== 'Record' || idx >= decl.items.length) {
            return;
        }
        const row = decl.items[idx];
        // TODO: allow rest args?
        if (row.type !== 'lambda' || row.args.length !== numArgs) {
            return;
        }
        ctx.bindings.values.forEach(({ sym, type }) => {
            if (!type) {
                return;
            }
            // reffff hmm hmmmmm hm hmmm
            // or a var that has the right subtype
            if (type.type === 'ref' && type.ref.type === 'user') {
                const option = optionForValue(
                    ctx,
                    type as t.UserTypeReference,
                    id,
                    idx,
                    row,
                    location,
                    var_(sym, type, location),
                );
                if (option != null) {
                    options.push(option);
                }
            } else if (type.type === 'var') {
                const b = ctx.bindings.types.find(
                    (b) => b.sym.unique === type.sym.unique,
                );
                if (b && b.subTypes.find((s) => t.idsEqual(s, id))) {
                    options.push({
                        // left: row.args[0],
                        // right: row.args[1],
                        args: row.args,
                        // term: var_(sym, type, op.location),
                        term: {
                            type: 'Attribute',
                            idx,
                            ref: { type: 'user', id },
                            idLocation: location,
                            inferred: false,
                            is: row,
                            location,
                            refTypeVbls: [],
                            target: var_(sym, type, location),
                        },
                        // typeArgs: [],
                    });
                }
            }
        });
        const supers = ctx.library.types.superTypes[idName(id)];
        Object.keys(ctx.library.terms.defns).forEach((idRaw) => {
            const is = ctx.library.terms.defns[idRaw].defn.is;
            if (is.type === 'ref' && is.ref.type === 'user') {
                const option = optionForValue(
                    ctx,
                    is as t.UserTypeReference,
                    id,
                    idx,
                    row,
                    location,
                    {
                        type: 'ref',
                        ref: { type: 'user', id: idFromName(idRaw) },
                        location,
                        is,
                    },
                );
                if (option != null) {
                    options.push(option);
                }
            }
        });
    });
    return options;
}

const optionForValue = (
    ctx: Context,
    type: t.UserTypeReference,
    id: t.Id,
    idx: number,
    row: t.LambdaType,
    location: Location,
    target: t.Term,
): undefined | Option => {
    const myDecl = typeDef(ctx.library, type.ref);
    // const { defn: myDecl } = ctx.library.types.defns[idName(type.ref.id)];
    if (!myDecl || myDecl.type !== 'Record') {
        return;
    }
    if (myDecl.typeVbls.length) {
        if (t.idsEqual(type.ref.id, id)) {
            const applied = applyTypeVariablesToRecord(
                ctx,
                myDecl,
                type.typeVbls,
                // [],
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
            return {
                // left: row.args[0],
                // right: row.args[1],
                args: row.args,
                term: {
                    type: 'Attribute',
                    idx,
                    ref: { type: 'user', id },
                    idLocation: location,
                    inferred: false,
                    is: row,
                    location,
                    refTypeVbls: type.typeVbls,
                    target: target,
                },
                // typeArgs: [],
            };
        } else {
            // Can't handle type variables
            return;
        }
    }
    if (
        t.idsEqual(id, type.ref.id) ||
        ctx.library.types.superTypes[idName(id)].find((s) =>
            t.idsEqual(s, type.ref.id),
        )
    ) {
        return {
            // left: row.args[0],
            // right: row.args[1],
            args: row.args,
            term: {
                type: 'Attribute',
                idx,
                ref: { type: 'user', id },
                idLocation: location,
                inferred: false,
                is: row,
                location,
                refTypeVbls: [],
                target,
            },
            // typeArgs: [],
        };
    }
};
