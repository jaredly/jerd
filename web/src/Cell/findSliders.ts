// import * as React from 'react';
import { idName, idFromName, hashObject } from '@jerd/language/src/typing/env';
import {
    Env,
    Id,
    Term,
    Location,
    Decorator,
} from '@jerd/language/src/typing/types';
import {
    hsla_id,
    hsl_id,
    rgba_id,
    rgb_id,
    slider$1_id,
    slider$2_id,
    slider_id,
    title_id,
} from '@jerd/language/src/printing/prelude-types';
// import { widgetForDecorator } from '../display/Decorators';
import { transform } from '@jerd/language/src/typing/transform';

export function findSliders(env: Env, term: Term) {
    const topId = idFromName(hashObject(term));
    const termDeps: { [source: string]: Array<string> } = {};
    const found: {
        [termId: string]: {
            [idx: number]: {
                title: string | null;
                // widget: React.FunctionComponent<{
                //     data: any;
                //     onUpdate: (term: Term, data: any) => void;
                // }>;
                term: Term;
                decorator: Decorator;
            };
        };
    } = {};

    const crawlTerm = (term: Term, id: Id) => {
        const hash = idName(id);
        if (found[hash]) {
            return; // already traversed
        }
        found[hash] = {};
        termDeps[hash] = [];
        transform(term, {
            term: (t) => {
                if (t.decorators) {
                    const widgetIds = [
                        slider$2_id,
                        slider$1_id,
                        slider_id,
                        rgba_id,
                        rgb_id,
                        hsl_id,
                        hsla_id,
                    ];
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
                    crawlTerm(env.global.terms[otherHash], t.ref.id);
                }

                return null;
            },
        });
    };
    crawlTerm(term, topId);
    return { termDeps, found };
}
