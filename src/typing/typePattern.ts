import { Pattern as RawPattern } from '../parsing/parser';
import { int, string } from './preset';
import { Env, Pattern } from './types';

const typePattern = (env: Env, pattern: RawPattern): Pattern => {
    switch (pattern.type) {
        case 'string':
            return {
                type: 'string',
                text: pattern.text,
                is: string,
                location: pattern.location,
            };
        case 'int':
            return {
                type: 'int',
                value: pattern.value,
                is: int,
                location: pattern.location,
            };
        case 'id': {
            const id = env.global.typeNames[pattern.text];
            if (!id) {
                throw new Error(`Unknown type ${pattern.text}`);
            }
            return {
                type: 'Record',
                ref: { type: 'user', id },
                items: [],
                location: pattern.location,
            };
        }
        default:
            throw new Error(`Not supported pattern type ${pattern.type}`);
    }
};

export default typePattern;
