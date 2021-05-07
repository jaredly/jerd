// import { mainImage } from '../build/raymarching.jd.mjs';
console.log('ok');
let iTime = 0;
const smallResolution = { type: 'Vec2', x: 50, y: 50 };
preview.width = smallResolution.x;
preview.height = smallResolution.y;
preview.style.width = '200px';
const ctx = thec.getContext('2d');

const frames = parseInt(Math.PI * 10 * 2 * 5);

const ffmpeg = new Worker('./ffmpeg-worker-mp4.js');
const worker = new Worker('./Worker.js', { type: 'module' });
window.wor = worker;
worker.postMessage({
    type: 'resolution',
    resolution: {
        type: 'Vec2',
        x: 50,
        y: 50,
    },
    frames,
});

const fullWorker = new Worker('./Worker.js', { type: 'module' });
const fullResolution = { type: 'Vec2', x: 200, y: 200 };
fullWorker.postMessage({
    type: 'resolution',
    resolution: fullResolution,
    frames,
});
thec.width = fullResolution.x;
thec.height = fullResolution.y;

function convertDataURIToBinary(dataURI) {
    var base64 = dataURI.replace(/^data[^,]+,/, '');
    var raw = window.atob(base64);
    var rawLength = raw.length;

    var array = new Uint8Array(new ArrayBuffer(rawLength));
    for (let i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    return array;
}

const imageDatas = [];

const playPreview = () => {
    let i = 0;
    const ctx = preview.getContext('2d');
    setInterval(() => {
        if (!imageDatas.length) {
            return;
        }
        i = i % imageDatas.length;
        const data = imageDatas[i];
        if (data) {
            ctx.putImageData(data, 0, 0);
        } else {
            console.log('nope', i, imageDatas.length);
        }
        i += 1;
    }, 100);
};
playPreview();

const images = [];

function done(output) {
    const url = URL.createObjectURL(output);

    thevid.src = url;
    thevid.play();

    // var end_time = +new Date;
    // $('status').innerHTML = "Compiled Video in " + (end_time - start_time) + "ms, file size: " + Math.ceil(output.size / 1024) + "KB";
    // $('awesome').src = url; //toString converts it to a URL via Object URLs, falling back to DataURL
    // $('download').style.display = '';
    // $('download').href = url;
}

ffmpeg.onmessage = function (e) {
    var msg = e.data;
    switch (msg.type) {
        case 'stdout':
        case 'stderr':
            console.log(msg.data);
            // messages += msg.data + "\n";
            break;
        case 'exit':
            console.log('Process exited with code ' + msg.data);
            //worker.terminate();
            break;

        case 'done':
            const blob = new Blob([msg.data.MEMFS[0].data], {
                type: 'video/mp4',
            });
            done(blob);
            break;
    }
};

fullWorker.addEventListener('message', (evt) => {
    if (evt.data.type === 'frame') {
        // imageDatas.push(evt.data.data);
        ctx.putImageData(evt.data.data, 0, 0);
        const dataUrl = thec.toDataURL('image/jpeg');
        const data = convertDataURIToBinary(dataUrl);

        images.push({
            name: `img${evt.data.i.toString().padStart(3, '0')}.jpg`,
            data,
        });
    } else if (evt.data.type === 'done') {
        ffmpeg.postMessage({
            type: 'run',
            TOTAL_MEMORY: 268435456,
            //arguments: 'ffmpeg -framerate 24 -i img%03d.jpeg output.mp4'.split(' '),
            arguments: [
                '-r',
                '20',
                '-i',
                'img%03d.jpg',
                '-c:v',
                'libx264',
                '-crf',
                '1',
                '-vf',
                'scale=150:150',
                '-pix_fmt',
                'yuv420p',
                '-vb',
                '20M',
                'out.mp4',
            ],
            //arguments: '-r 60 -i img%03d.jpeg -c:v libx264 -crf 1 -vf -pix_fmt yuv420p -vb 20M out.mp4'.split(' '),
            MEMFS: images,
        });
    } else {
        console.log(evt);
    }
});

worker.addEventListener('message', (evt) => {
    if (evt.data.type === 'frame') {
        imageDatas.push(evt.data.data);
        // ctx.putImageData(evt.data.data, 0, 0);
        // const dataUrl = thec.toDataURL('image/jpeg');
        // const data = convertDataURIToBinary(dataUrl);

        // images.push({
        //     name: `img${evt.data.i.toString().padStart(3, '0')}.jpg`,
        //     data,
        // });
    } else if (evt.data.type === 'done') {
        // ffmpeg.postMessage({
        //     type: 'run',
        //     TOTAL_MEMORY: 268435456,
        //     //arguments: 'ffmpeg -framerate 24 -i img%03d.jpeg output.mp4'.split(' '),
        //     arguments: [
        //         '-r',
        //         '20',
        //         '-i',
        //         'img%03d.jpg',
        //         '-c:v',
        //         'libx264',
        //         '-crf',
        //         '1',
        //         '-vf',
        //         'scale=150:150',
        //         '-pix_fmt',
        //         'yuv420p',
        //         '-vb',
        //         '20M',
        //         'out.mp4',
        //     ],
        //     //arguments: '-r 60 -i img%03d.jpeg -c:v libx264 -crf 1 -vf -pix_fmt yuv420p -vb 20M out.mp4'.split(' '),
        //     MEMFS: images,
        // });
    } else {
        console.log(evt);
    }
});

// const render = (iTime) => {
//     for (let x = 0; x < resolution.x; x++) {
//         for (let y = 0; y < resolution.y; y++) {
//             const color = mainImage(
//                 iTime,
//                 {
//                     type: 'Vec2',
//                     x,
//                     y,
//                 },
//                 resolution,
//             );
//             ctx.fillStyle = `rgba(${color.x * 255},${color.y * 255},${
//                 color.z * 255
//             },${color.w})`;
//             ctx.fillRect(x, y, 1, 1);
//         }
//     }
// };
