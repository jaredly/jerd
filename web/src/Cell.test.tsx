// yo this is a fine though

import * as React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CellView } from './Cell';
import {
    addExpr,
    idFromName,
    typeToplevelT,
} from '../../language/src/typing/env';
import { newEnv } from '../../language/src/typing/types';
import { parse } from '../../language/src/parsing/grammar';
import { newEvalEnv } from './persistence';

describe('Cell', () => {
    it('should work', () => {
        // const id = idFromName('somehash');
        let env = newEnv(null);
        const raw = `const hello = () => 10`;
        const parsed = parse(raw);
        const top = typeToplevelT(env, parsed[0]);
        if (top.type !== 'Define') {
            throw new Error(`not a define`);
        }
        const { env: nenv, id } = addExpr(env, top.term, null);
        env = nenv;

        render(
            <CellView
                maxWidth={1000}
                cell={{
                    id: 'cid',
                    order: 0,
                    content: {
                        type: 'term',
                        id: id,
                    },
                }}
                env={env}
                getHistory={() => []}
                focused={null}
                onDuplicate={() => {}}
                onFocus={() => {}}
                onChange={() => {}}
                onRun={() => {}}
                onRemove={() => {}}
                onMove={() => {}}
                evalEnv={newEvalEnv({})}
                addCell={() => {}}
                plugins={{}}
                onPin={() => {}}
            />,
        );

        expect(screen.findAllByText('hello')).toBeTruthy();
        expect(screen.findAllByText('helloz')).toBeTruthy();
    });
});
