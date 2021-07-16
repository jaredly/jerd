/** @jsx jsx */
import { jsx } from '@emotion/react';
// Ok
import * as React from 'react';

// const maxWidth = 80;

export type MenuItem = { name: string; action: () => void };

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
}) => {
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
                    }}
                >
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
                                            item.action();
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
