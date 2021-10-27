import { Location, TemplateString } from '../parsing/parser-new';
import { idFromName, idName } from '../typing/env';
import { bool, float, int, string } from '../typing/preset';
import { Id, LambdaType, Term, Type, typesEqual } from '../typing/types';
import { Context } from './Context';
import { typeExpression, wrapExpected } from './typeExpression';

export const fixString = (v: string) =>
    JSON.parse(`"${v.replace(/\n/, '\\n').replace(/\t/, '\\t')}"`);

// oh ah yes. Here we run into the question of "As".
// So currently, there's a magical pseudo-define type that has the fake-hash of `As`.
// And so you implement `let myThing: As#As<int, float> = As#As<int, float>{ as: (int, float) => ... }`
// in order to get an `as` working.
// but.
// what if the rule was just
// "functions named 'as' with one argument"
// right?
// now, would that be a weird exception? idk!
// but it certainly seems less weird than the pseudo-type that we have now!
// so anyway, that's what I'll go ahead and do going forward!
// BUT
// this is a ~syntax change.
// will that bust my current dealio?
// it might require me to go into the big .jd and fix some things, but that's fine.

// ok, at this point.

export const asAs = (
    id: Id,
    t: Type,
    target: Type,
): null | { id: Id; is: LambdaType } => {
    return t.type === 'lambda' &&
        t.args.length === 1 &&
        typesEqual(t.res, target)
        ? { id, is: t }
        : null;
};

export const simpleTemplateString = (tpl: TemplateString) => {
    let res = '';
    let bad = false;
    tpl.contents.forEach((item) => {
        if (typeof item === 'string') {
            res += item;
        } else {
            bad = true;
        }
    });
    return bad ? null : res;
};

export const typeTemplateString = (
    ctx: Context,
    tpl: TemplateString,
    expected: Array<Type>,
): Term => {
    const pairs: Array<{
        contents: Term;
        location: Location;
        prefix: string;
        id: Id | null;
    }> = [];
    let prefix: null | string = null;

    const asStrings = (ctx.library.terms.names['as'] || [])
        .map((id) =>
            asAs(id, ctx.library.terms.defns[idName(id)].defn.is, string),
        )
        .filter(Boolean) as Array<{ id: Id; is: LambdaType }>;
    // TODO: oof we need to dedup these
    const convertibleTypes = asStrings.map((item) => item.is.args[0]);

    tpl.contents.forEach((item) => {
        if (typeof item === 'string') {
            if (prefix == null) {
                prefix = item;
            } else {
                prefix += item;
            }
            return;
        }
        if (item.hash) {
            const term = ctx.library.terms.defns[item.hash.slice(1)];
            if (term && term.defn.is.type === 'lambda') {
                const t = term.defn.is;
                if (t.args.length === 1 && typesEqual(t.res, string)) {
                    const contents = typeExpression(ctx, item.inner, [
                        t.args[0],
                    ]);
                    const id = idFromName(item.hash.slice(1));
                    pairs.push({
                        prefix: prefix == null ? '' : fixString(prefix),
                        contents,
                        id,
                        location: item.location,
                    });
                    prefix = null;
                    return;
                }
            }
            ctx.warnings.push({
                location: item.location,
                text: `Not an as:string #${item.hash.slice(1)}`,
            });
        }

        let id: Id | null = null;
        let contents = typeExpression(
            ctx,
            item.inner,
            [string, int, float, bool].concat(convertibleTypes),
        );
        if (!typesEqual(contents.is, string)) {
            const found = asStrings.find((one) =>
                typesEqual(one.is.args[0], contents.is),
            );
            if (found) {
                id = found.id;
            } else {
                if (
                    contents.is.type !== 'ref' ||
                    contents.is.ref.type !== 'builtin' ||
                    !['string', 'int', 'float', 'bool'].includes(
                        contents.is.ref.name,
                    )
                ) {
                    contents = wrapExpected(contents, [string]);
                }
            }
        }

        pairs.push({
            prefix: prefix == null ? '' : fixString(prefix),
            contents,
            location: item.location,
            id,
        });
        prefix = null;
    });

    if (!pairs.length) {
        return wrapExpected(
            {
                type: 'string',
                is: string,
                location: tpl.location,
                text: prefix ? fixString(prefix) : '',
            },
            expected,
        );
    }

    return wrapExpected(
        {
            type: 'TemplateString',
            is: string,
            location: tpl.location,
            pairs,
            suffix: prefix != null ? fixString(prefix) : '',
        },
        expected,
    );
};
