import * as React from 'react';

// Our current hashing algorithm produces a 32-bit hash (b16 * 8)
// const colors = ['red', 'green', 'blue', 'white'];
const colorsRaw =
    '1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf';
const colors: Array<string> = [
    'white',
    'black',
    'red',
    'green',
    'blue',
    'orange',
    'yellow',
    'purple',
    'gray',
];
// for (let i = 0; i < colorsRaw.length / 6; i++) {
//     colors.push('#' + colorsRaw.slice(i * 6, i * 6 + 6));
// }

// const corner = (bits: string) => {
//     // 1 bits = bottom
//     // 1 bits = right
//     // 2 bits = center
//     const bottom = bits[0] === '0' ? 1 / 3 : 2 / 3;
//     const right = bits[1] === '0' ? 1 / 3 : 2 / 3;
//     const cx = bits[2] === '0' ? 1 / 3 : 2 / 3;
//     const cy = bits[3] === '0' ? 1 / 3 : 2 / 3;
//     const foreground = parseInt(bits.slice(4, 6), 2);
//     const background = parseInt(bits.slice(6, 8), 2);
//     return;
// };

export const HashIcon = ({ hash }: { hash: string }) => {
    // 32 bits
    const bits = parseInt(hash, 16).toString(2).padStart(32, '0');

    const items = [];

    const size = 8;

    for (let i = 0; i < 4; i++) {
        const x = ((i / 2) | 0) * size;
        const y = (i % 2) * size;

        const at = i * 8;

        // 1 bits = bottom
        // 1 bits = right
        // 2 bits = center
        let bottom = bits[at + 0] === '0' ? 3 : 5;
        let right = bits[at + 1] === '0' ? 3 : 5;
        let cx = bits[at + 2] === '0' ? 3 : 5;
        let cy = bits[at + 3] === '0' ? 3 : 5;
        // 2 bits = foreground color
        let foreground = parseInt(bits.slice(at + 4, at + 7), 2);
        // 2 bits = background color
        const background = parseInt(bits.slice(at + 5, at + 8), 2);
        if (foreground === background) {
            foreground = 5;
        }

        let xx = size;
        let yy = size;

        const fy = i % 2 == 1;
        const fx = i > 2;
        if (fx) {
            bottom = size - bottom;
            cx = size - cx;
            xx = size - xx;
        }
        if (fy) {
            right = size - right;
            cy = size - cy;
            yy = size - yy;
        }

        items.push(
            <rect
                x={x}
                y={y}
                width={size}
                height={size}
                fill={colors[background]}
            />,
        );

        items.push(
            <polygon
                points={`${x + xx},${y + yy} ${x + bottom},${y + yy} ${
                    x + cx
                },${y + cy} ${x + xx},${y + right}`}
                fill={colors[foreground]}
            />,
        );
    }

    // // Just blocks, doesn't look great
    // for (let i = 0; i < 16; i++) {
    //     const idx = parseInt(bits.slice(i * 2, i * 2 + 2), 2);
    //     const x = Math.floor(i / 4);
    //     const y = i % 4;
    //     items.push(
    //         <rect
    //             x={x * 4}
    //             y={y * 4}
    //             width={4}
    //             height={4}
    //             fill={colors[idx]}
    //         />,
    //     );
    // }

    return (
        <svg width={16} height={16}>
            {items}
        </svg>
    );
};

// 16 blocks w/ 12 options
// or 8 blocks w/ 16 options
// 16 colors ... 4 hue 4 saturation
// BUT what about shape?

// ok it's 32 bits
// If we have 4 sectors that each can have 2 different shapes, or 3?

// Ok we have 4 corners = 2 bits
// 16 possible configurations of foreground / background = 4 bits
// 3 bits foreground
// 3 bits background
// = 12

// x 2 for top & bottom (24)
// that's not quite enough bits

// and then (foreground color) and (background color) =
// so that means 16 colors if we only have one corner to work with
// or 10 colors with 2 corners? no maybe just 8

// 8 different blocks
// 4 different corners (it's plus if I'm )

// OR
// 4x4, and then each block only needs 2 bits... 1 of 4 colors?
