/** @jsx jsx */
import { jsx } from '@emotion/react';
import {
    atom,
    id,
    items,
    printToAttributedText,
} from '@jerd/language/src/printing/printer';
import {
    typeToPretty,
    typeVblDeclsToPretty,
} from '@jerd/language/src/printing/printTsLike';
import { idName } from '@jerd/language/src/typing/env';
import { Env } from '@jerd/language/src/typing/types';
import { hashStyle } from './Cell';
import { renderAttributedText } from './Render';
import { Cell } from './State';

export const cellTitle = (
    env: Env,
    cell: Cell,
    maxWidth: number,
    collapsed?: boolean,
    clearPending?: () => void,
    acceptPending?: () => void,
) => {
    if (collapsed) {
        maxWidth = 10000;
    }
    switch (cell.content.type) {
        case 'raw':
            return <em>unevaluated</em>;
        case 'effect':
            const name = env.global.idNames[idName(cell.content.id)];
            return `effect ${name}`;
        case 'enum':
        case 'record': {
            const name = env.global.idNames[idName(cell.content.id)];
            const type = env.global.types[idName(cell.content.id)];
            return (
                <div
                    style={{
                        fontFamily: '"Source Code Pro", monospace',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    <Icon name="icons_type" />
                    <span css={hashStyle}>#{idName(cell.content.id)}</span>
                    {renderAttributedText(
                        env.global,
                        printToAttributedText(
                            items([
                                id(name, idName(cell.content.id), 'type'),
                                typeVblDeclsToPretty(env, type.typeVbls),
                            ]),
                            maxWidth,
                        ),
                        // TODO onclick
                        null,
                    )}{' '}
                </div>
            );
        }
        case 'term': {
            const term = env.global.terms[idName(cell.content.id)];
            const name = env.global.idNames[idName(cell.content.id)];
            return (
                <div
                    style={{
                        fontFamily: '"Source Code Pro", monospace',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    <Icon
                        name={
                            term.is.type === 'lambda'
                                ? 'icons_function'
                                : 'icons_value'
                        }
                    />
                    <span
                        css={{ ...hashStyle, cursor: 'pointer' }}
                        onClick={clearPending}
                    >
                        #{idName(cell.content.id)}
                    </span>
                    {cell.content.proposed ? (
                        <span>
                            {' <- '}
                            <span
                                css={{
                                    ...hashStyle,
                                    cursor: 'pointer',
                                    // backgroundColor: '#fa0',
                                    border: '2px solid #fa0',
                                }}
                                onClick={acceptPending}
                            >
                                #{idName(cell.content.proposed.id)}
                            </span>
                        </span>
                    ) : null}
                    {renderAttributedText(
                        env.global,
                        printToAttributedText(
                            name
                                ? items([
                                      id(name, idName(cell.content.id), 'term'),
                                      atom(': '),
                                      typeToPretty(env, term.is),
                                  ])
                                : typeToPretty(env, term.is),
                            maxWidth,
                        ),
                        // TODO onclick
                        null,
                    )}{' '}
                </div>
            );
        }
        default:
            const _x: never = cell.content;
            return `Unknown cell type ${(cell.content as any).type}`;
    }
};

const Icon = ({ name }: { name: string }) => (
    <img
        src={`/imgs/${name}.svg`}
        css={{
            width: 16,
            height: 16,
            color: 'inherit',
            marginBottom: -4,
            marginRight: 8,
        }}
    />
);
