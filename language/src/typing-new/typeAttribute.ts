import { AttributeSuffix, BinOp, Expectation } from '../parsing/parser-new';
import { idName } from '../typing/env';
import { void_ } from '../typing/preset';
import { Id, idsEqual, RecordDef, Term, Type } from '../typing/types';
import { Context } from './Context';
import { parseAttrHash } from './hashes';
import { typeExpression, wrapExpected } from './typeExpression';
import {
    getAllSubTypes,
    parseIdTextOrString,
    subTypesForBinding,
} from './typeRecord';

export const typeAttribute = (
    ctx: Context,
    attribute: AttributeSuffix,
    inner: BinOp,
    expected: Array<Type>,
): Term => {
    const hash = attribute.id.hash
        ? parseAttrHash(attribute.id.hash.slice(1))
        : null;
    // soooo
    // let's talk about the case
    // where the VaLUE is typed with the new type,
    // but the attribute is on the old one.
    // So the inner thing /might/ have an opinion.
    if (hash) {
        const is: Type = {
            type: 'ref',
            ref: { type: 'user', id: hash.type },
            location: attribute.location,
            typeVbls: [],
        };
        const defn = ctx.library.types.defns[idName(hash.type)]
            .defn as RecordDef;
        const typed = typeExpression(ctx, inner, [is]);
        if (typed.type === 'TypeError') {
            // OK So here, we want to
            // let's try falling back to the attr name,
            // to see if any of those options don't result in a
            // typeerror
        }
        if (hash.attr < defn.items.length) {
            return {
                type: 'Attribute',
                idLocation: attribute.id.location,
                idx: hash.attr,
                inferred: false,
                is: defn.items[hash.attr],
                location: attribute.location,
                ref: is.ref,
                target: typed,
            };
        }
    }
    const attrName = parseIdTextOrString(attribute.id.text);
    const options = ctx.library.types.constructors.names[attrName];
    if (!options) {
        // UM
        return {
            type: 'InvalidAttribute',
            is: expected.length ? expected[0] : void_,
            text: attrName,
            inner: typeExpression(ctx, inner, []),
            location: attribute.location,
        };
    }
    // TODO: um
    // need to be able to not specify the variables here again.
    const typed = typeExpression(ctx, inner, []);
    let ids: Array<Id> = [];
    if (typed.is.type === 'var') {
        const s = typed.is.sym.unique;
        const binding = ctx.bindings.types.find((t) => t.sym.unique === s);
        if (binding) {
            ids = subTypesForBinding(binding, ctx);
        } else {
            return {
                type: 'InvalidAttribute',
                is: expected.length ? expected[0] : void_,
                text: attrName,
                inner: typed,
                location: attribute.location,
            };
        }
    } else if (typed.is.type !== 'ref' || typed.is.ref.type !== 'user') {
        // OK FOLKS
        // yeah we really need an `InvalidAttribute`
        return {
            type: 'InvalidAttribute',
            is: expected.length ? expected[0] : void_,
            text: attrName,
            inner: typed,
            location: attribute.location,
        };
    } else {
        let id = typed.is.ref.id;
        ids = [id].concat(
            getAllSubTypes(
                ctx.library,
                (ctx.library.types.defns[idName(id)]
                    .defn as RecordDef).extends.map((t) => t.ref.id),
            ),
        );
    }

    // const tid = typed.is.ref.id;

    for (let option of options) {
        if (ids.some((id) => idsEqual(option.id, id))) {
            const defn = ctx.library.types.defns[idName(option.id)]
                .defn as RecordDef;
            return wrapExpected(
                {
                    type: 'Attribute',
                    idLocation: attribute.id.location,
                    idx: option.idx,
                    inferred: false,
                    is: defn.items[option.idx],
                    location: attribute.location,
                    ref: { type: 'user', id: option.id },
                    target: typed,
                },
                expected,
            );
        }
    }
    return {
        type: 'InvalidAttribute',
        is: expected.length ? expected[0] : void_,
        text: attrName,
        inner: typed,
        location: attribute.location,
    };
};
