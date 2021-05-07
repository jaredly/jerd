import { mainImage } from '../build/raymarching.jd.mjs';

// import { PNG } from './pngjs.js';
// console.log('hello');

const render = (iTime, resolution) => {
    const output = new Uint8ClampedArray(resolution.x * resolution.y * 4);
    for (let x = 0; x < resolution.x; x++) {
        for (let y = 0; y < resolution.y; y++) {
            const idx = (y * resolution.x + x) * 4;
            const color = mainImage(
                iTime,
                {
                    type: 'Vec2',
                    x,
                    y,
                },
                resolution,
            );
            output[idx + 0] = color.x * 255;
            output[idx + 1] = color.y * 255;
            output[idx + 2] = color.z * 255;
            output[idx + 3] = color.w * 255;
        }
    }
    return new ImageData(output, resolution.x, resolution.y);
};

const run = (frames, resolution) => {
    for (let i = 0; i < frames; i++) {
        // console.log('rendeirng', i);
        const data = render(i / 10, resolution);
        postMessage({ type: 'frame', i, data });
    }
    postMessage({ type: 'done' });
};

addEventListener('message', (e) => {
    if (e.data.type === 'resolution') {
        run(e.data.frames, e.data.resolution);
        // runFrame(0, e.data.resolution);
    } else {
        console.log('nope');
    }
});
