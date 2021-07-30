/** @jsx jsx */
import { jsx } from '@emotion/react';
// Ok
import * as React from 'react';
import { printToAttributedText } from '../../language/src/printing/printer';
import { termToPretty } from '../../language/src/printing/printTsLike';
import { idName } from '../../language/src/typing/env';
import { Env, Id } from '../../language/src/typing/types';
import { renderAttributedText } from './Render';

// const maxWidth = 80;

export type MenuItem = {
    name: string;
    action: (value: string) => void;
    askString?: string;
};

export const CellWrapper = ({
    title,
    onRemove,
    onToggleSource,
    children,
    menuItems,
    focused,
    onFocus,
    collapsed,
    setCollapsed,
    getHistory,
}: {
    title: React.ReactNode;
    focused: number | null;
    onFocus: () => void;
    children: React.ReactNode;
    onRemove: () => void;
    onToggleSource: (() => void) | null | undefined;
    menuItems: () => Array<MenuItem>;
    collapsed: boolean;
    setCollapsed: (c: boolean) => void;
    getHistory: () => { env: Env; items: Array<Id> };
}) => {
    const [history, setHistory] = React.useState(
        null as null | { env: Env; items: Array<Id>; selected: number },
    );

    const [menu, setMenu] = React.useState(false);
    const ref = React.useRef(null as null | HTMLElement);
    React.useEffect(() => {
        if (focused != null && ref.current) {
            ref.current.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth',
            });
        }
    }, [focused]);

    return (
        <div
            ref={(node) => {
                if (node != null) {
                    ref.current = node;
                    if (focused != null) {
                        node.scrollIntoView({
                            block: 'nearest',
                            behavior: 'smooth',
                        });
                    }
                }
            }}
            css={{
                padding: 4,
                borderBottom: '2px dashed #ababab',
                marginBottom: 8,
                border: `2px solid ${
                    focused != null ? '#5d5dff' : 'transparent'
                }`,
            }}
            onClick={onFocus}
        >
            <div
                css={{
                    backgroundColor: '#151515',
                    padding: '8px 12px',
                    marginBottom: 0,
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                {title}
                <div style={{ flex: 1 }} />
                <div
                    css={{
                        position: 'relative',
                        alignSelf: 'flex-start',
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <div
                        css={{
                            padding: '0 8px',
                            cursor: 'pointer',
                            userSelect: 'none',
                            position: 'relative',
                        }}
                        onClick={() => {
                            if (history) {
                                setHistory(null);
                            } else {
                                const { env, items } = getHistory();
                                setHistory({ env, items, selected: 0 });
                            }
                        }}
                    >
                        History
                        {history ? (
                            <div
                                css={{
                                    zIndex: 1000,
                                    backgroundColor: 'rgb(30, 30, 30)',
                                    border: '1px solid #aaa',
                                    position: 'absolute',
                                    right: 0,
                                    top: '100%',
                                    width: 700,
                                    marginTop: 8,
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                            >
                                <div
                                    css={{
                                        flex: 1,
                                        padding: 8,
                                        whiteSpace: 'pre-wrap',
                                        fontFamily:
                                            '"Source Code Pro", monospace',
                                    }}
                                >
                                    {renderAttributedText(
                                        history.env.global,
                                        printToAttributedText(
                                            termToPretty(
                                                history.env,
                                                history.env.global.terms[
                                                    idName(
                                                        history.items[
                                                            history.selected
                                                        ],
                                                    )
                                                ],
                                            ),
                                            130,
                                        ),
                                    )}
                                </div>
                                <div>
                                    {history.items.map((id, i) => (
                                        <div
                                            key={idName(id) + '-' + i}
                                            css={{
                                                padding: 8,
                                                backgroundColor:
                                                    i === history.selected
                                                        ? '#aaa'
                                                        : 'transparent',
                                            }}
                                            onMouseEnter={(evt) => {
                                                setHistory((h) =>
                                                    h
                                                        ? {
                                                              ...h,
                                                              selected: i,
                                                          }
                                                        : null,
                                                );
                                            }}
                                        >
                                            #{idName(id)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div
                        css={{
                            cursor: 'pointer',
                            userSelect: 'none',
                        }}
                        onClick={() => setMenu(!menu)}
                    >
                        menü
                        {menu ? (
                            <div
                                css={{
                                    zIndex: 1000,
                                    backgroundColor: '#333',
                                    position: 'absolute',
                                    right: 0,
                                    top: '100%',
                                    width: 200,
                                    marginTop: 8,
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                }}
                            >
                                {menuItems().map((item, i) => (
                                    <div
                                        key={i}
                                        css={{
                                            padding: '4px 8px',
                                            cursor: 'pointer',
                                            ':hover': {
                                                backgroundColor: '#444',
                                            },
                                        }}
                                        onClick={() => {
                                            item.action('');
                                            setMenu(false);
                                        }}
                                    >
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>
                <button
                    onClick={onRemove}
                    css={{
                        border: '1px solid transparent',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        color: 'red',
                        marginLeft: 8,
                        borderRadius: 3,
                        ':hover': {
                            borderColor: '#500',
                        },
                    }}
                >
                    ╳
                </button>
            </div>
            {collapsed ? null : children}
        </div>
    );
};
