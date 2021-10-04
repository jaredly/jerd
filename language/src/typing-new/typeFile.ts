// Ok

import {
    BinOp,
    BinOpRight,
    binopWithHash,
    File,
    Toplevel,
    WithUnary,
    Location,
    WithSuffix,
    Apsub,
    BinOp_inner,
    Identifier,
} from '../parsing/parser-new';
import { hashObject, idFromName } from '../typing/env';
import { getOpLevel, organizeDeep } from '../typing/terms/ops';
import * as typed from '../typing/types';
import * as preset from '../typing/preset';
import { Term, Type } from '../typing/types';
import { reGroupOps, typeGroup } from './ops';
import { Library } from './Library';
import { parseIdOrSym } from './hashes';
import { resolveNamedValue, resolveValue } from './resolve';
import { typeExpression } from './typeExpression';

export type Context = {
    unique: { current: number };
    library: Library;
    builtins: {
        terms: {
            [key: string]: typed.Type;
        };
        types: {
            [key: string]: number; // number of type variables accepted.
        };
    };
    bindings: {
        self: null | { type: typed.Type; name: string };
        values: Array<{
            location: Location;
            sym: typed.Symbol;
            type: typed.Type;
        }>;
        types: Array<{
            location: Location;
            sym: typed.Symbol;
            subTypes: Array<typed.Id>;
        }>;
    };
    warnings: Array<{ location: Location; text: string }>;
};

export type ConstructorNames = {
    names: { [key: string]: Array<{ id: typed.Id; idx: number }> };
    idToNames: { [key: string]: Array<string> };
};

export type NamedDefns<Defn> = {
    // this is a cache of the other?
    // let's just keep one around. we can reconstruct the other.
    names: { [key: string]: Array<typed.Id> };
    defns: { [key: string]: Defn };
    // MetaData, is attached to ... a single hash. right.
    // And the things it keeps track of are:
    // - like commit info? author + date, makes sense
    // - but also things that the user wants to associate
    //   like documentation maybe? probably.
    // - `docs?: Id`
    // - and unit tests, I think? unless we want to point the
    //   arrow from the other side, and say "this term is a test"
    //   of this other thing
    //   and anyway, only terms can have tests, right? so
    //   it wouldn't make sense to pop it in here.
    // buuut
    // what if we just have `docs` be flexible enough that
    // it can represent unit tests?
    // ok, so what are we going to say is our documentation format?
    // some kind of extended markdown is popular. but I'd want
    // it to be a much simplified version of markdown
    // because we can do nice things like produce documentation
    // with a pure expression.
};

/*
Ok, clean slate. How does this database work?

Let's lean into `toplevel`s.

types: {
	nameToId: {[key: string]: Array<Id>},
	idToType: {
		[key: string]: TypeDefn,
	}
}


*/

export const ctxToEnv = (ctx: Context): typed.Env => {
    return {
        depth: 0,
        term: {
            localNames: {},
            nextTraceId: 0,
        },
        global: {
            attributeNames: ctx.library.types.constructors.names,
            builtinTypes: {},
            builtins: {},
            decoratorNames: ctx.library.decorators.names,
            decorators: ctx.library.decorators.defns,
            effectConstrNames: ctx.library.effects.constructors.idToNames,
            effectConstructors: {}, // ctx.library.effects.constructors.names,
            effectNames: {}, // ctx.library.effects.names,
            effects: {}, // ctx.library.effects.defns,
            exportedTerms: {},
            idNames: {},
            metaData: {},
            names: {},
            recordGroups: ctx.library.types.constructors.idToNames,
            rng: () => 0.0,
            terms: ctx.library.terms.defns,
            typeNames: ctx.library.types.names,
            types: ctx.library.types.defns,
        },
        local: typed.newLocal(),
    };
};

export const typeToplevel = (
    ctx: Context,
    top: Toplevel,
): null | typed.ToplevelT => {
    switch (top.type) {
        case 'ToplevelExpression': {
            const term = typeExpression(ctx, top.expr, []);
            if (!term) {
                return null;
            }
            return {
                type: 'Expression',
                id: idFromName(hashObject(term)),
                location: top.location,
                term,
            };
        }
        // case 'Define': {
        //     const t = top.ann ? typeType(ctx, )
        //     const term = typeExpression(ctx, top.expr,)
        // }
        // case 'DecoratorDef':
        // 	const defn = typeDecoratorDef(ctx, top.id, top.args, top.targetType)
        // 	return {
        // 		type: 'Decorator',
        // 		id: top.id,
        // 		location: top.location,
        // 		name: top.id.text,
        // 		defn: {
        // 			unique
        // 		}
        // 	}
    }
    throw new Error(`nope`);
};

export const typeFile = (ctx: Context, file: File) => {
    if (file.tops) {
        file.tops.items.forEach((top) => {
            if (top.decorators) {
                throw new Error(`not yet`);
            }
            const ttop = typeToplevel(ctx, top.top);
        });
    }
};
