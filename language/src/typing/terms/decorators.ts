import { Decorator } from '../../parsing/parser';
import { idFromName, idName } from '../env';
import { Env, Id, Term } from '../types';
import { Decorator as TypedDecorator } from '../types';

export const typeDecorators = (
    env: Env,
    decorators: Array<Decorator>,
    inner: Term,
): Array<TypedDecorator> => {
    return decorators.map((dec) => {
        // hrmmmmmmmmmmmmmmmmmmmmmmmmmmm
        // should decorators be identified by hash as well?
        // I've been thinking just raw text
        // buuut
        // like why not?
        // hmm that saves us from clashes ...
        // which yeah that would be very cool....
        // hmmmm that means I need a new entry in the env, right?
        // hmmmmmmmm should/could I double-it up with macros?
        // ok so maybe macros will get registered, and also maybe
        // declare what attributes they care about
        // ok but it might be nice to have `@something#hash.raw-text`
        let id: Id;
        if (dec.id.hash) {
            id = idFromName(dec.id.hash);
        } else {
            const ids = env.global.decoratorNames[dec.id.text];
            if (!ids) {
                throw new Error(`No decorators named ${dec.id.text}`);
            }
            id = ids[0];
            const decl = env.global.decorators[idName(id)];
            if (decl.arguments) {
                throw new Error(`arg validation not there yet`);
            }
            if (decl.targetType) {
                throw new Error(`target type validation not there yet`);
            }
            // TODO: some validation I think
        }
        return {
            // RESOLVE IT FOLKS
            name: { id, location: dec.id.location },
            location: dec.location,
            args: [],
        };
    });
};
