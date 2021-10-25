import {
    hsla_id,
    hsl_id,
    rgba_id,
    rgb_id,
    slider$1_id,
    slider$2_id,
    slider_id,
    title_id,
} from '../printing/prelude-types';
import { hashObject, idFromName, idName, termForIdRaw } from './env';
import { transform } from './transform';
import { Decorator, Env, Id, Term } from './types';

const defaultWidgetIds = [
    slider$2_id,
    slider$1_id,
    slider_id,
    rgba_id,
    rgb_id,
    hsl_id,
    hsla_id,
];

export function findSliders(
    env: Env,
    term: Term,
    widgetIds: Array<string> = defaultWidgetIds,
) {
    const topId = idFromName(hashObject(term));
    const termDeps: { [source: string]: Array<string> } = {};
    const found: {
        [termId: string]: {
            [idx: number]: {
                title: string | null;
                term: Term;
                decorator: Decorator;
            };
        };
    } = {};

    const crawlTerm = (term: Term, id: Id) => {
        const hash = idName(id);
        if (found[hash]) {
            return;
        }
        found[hash] = {};
        termDeps[hash] = [];
        transform(term, {
            term: (t) => {
                if (t.decorators) {
                    const widget = t.decorators.filter((d) =>
                        widgetIds.includes(idName(d.name.id)),
                    );
                    if (widget.length > 1) {
                        console.error(`Too many widgets on a term`);
                        console.error(widget);
                        return null;
                    }
                    const titleDec = t.decorators.filter(
                        (d) => idName(d.name.id) === title_id,
                    );
                    const title = titleDec.length
                        ? (titleDec[0].args[0] as any).term.text
                        : null;
                    // console.log(title, widget);
                    if (widget.length) {
                        const decorator = widget[0];
                        found[hash][t.location.idx!] = {
                            title,
                            decorator: decorator,
                            term: t,
                        };
                    }
                }
                if (t.type === 'ref' && t.ref.type === 'user') {
                    const otherHash = idName(t.ref.id);
                    if (!termDeps[hash].includes(otherHash)) {
                        termDeps[hash].push(otherHash);
                    }
                    crawlTerm(termForIdRaw(env, otherHash), t.ref.id);
                }

                return null;
            },
        });
    };
    crawlTerm(term, topId);
    return { termDeps, found };
}
