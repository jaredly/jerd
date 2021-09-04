import React from 'react';
import { idFromName } from '../../../../language/src/typing/env';
import { refType } from '../../../../language/src/typing/preset';
import { Env, nullLocation, Term } from '../../../../language/src/typing/types';
import { EvalEnv, RenderPlugins } from '../../State';
import {
    AudioGen,
    AudioGen$1,
    AudioGen$1_id,
    AudioGen_id,
    Note,
    Note$1,
} from './music-jd';
import * as Tone from 'tone';

export const AudioGenerator = <T,>({
    value,
    env,
    evalEnv,
    startPaused,
    term,
}: {
    value: AudioGen<T> | AudioGen$1<T>;
    evalEnv: EvalEnv;
    env: Env;
    term: Term;
    startPaused: boolean;
}) => {
    const [playState, setPlayState] = React.useState(false);
    const [recordLength, setRecordLength] = React.useState(10);
    const [notes, setNotes] = React.useState([] as Array<Note | Note$1>);
    const [url, setUrl] = React.useState('');
    const current = React.useRef(value);
    React.useEffect(() => {
        current.current = value;
    });

    React.useEffect(() => {
        if (!playState) {
            return;
        }
        const synth = new Tone.Synth().toDestination();
        let state = current.current.initial;
        let tid = null as null | NodeJS.Timeout;
        const run = () => {
            const res = current.current.generate(state);
            state = res.next;
            setNotes(res.notes);
            res.notes.forEach((note) => {
                // console.log(note);
                synth.triggerAttackRelease(
                    note.pitch,
                    note.duration,
                    synth.now() + note.start,
                );
            });
            tid = setTimeout(run, res.wait * 1000);
        };
        run();
        return () => {
            synth.dispose();
            if (tid) {
                clearTimeout(tid);
            }
        };
    }, [playState]);
    return (
        <div>
            <button
                onClick={() => {
                    setPlayState(!playState);
                }}
            >
                {playState ? 'Stop' : 'Play'}
            </button>
            <button
                onClick={() => {
                    Tone.Offline(() => {
                        // only nodes created in this callback will be recorded
                        const synth = new Tone.Synth().toDestination();
                        let state = value.initial;
                        const run = (offset: number) => {
                            const res = value.generate(state);
                            state = res.next;
                            // setNotes(res.notes);
                            res.notes.forEach((note) => {
                                // console.log(note);
                                synth.triggerAttackRelease(
                                    note.pitch,
                                    note.duration,
                                    offset + note.start,
                                );
                            });
                            if (offset + res.wait < recordLength) {
                                run(offset + res.wait);
                            }
                        };
                        run(0);
                    }, recordLength).then((buffer) => {
                        // do something with the output buffer
                        console.log(buffer);
                        buffer.toArray();
                        // const wav = bufferToWav(
                        //     buffer.toArray(0) as Float32Array,
                        //     48000,
                        //     1,
                        // );
                        const wav = encodeWAV(
                            buffer.toArray(0) as Float32Array,
                            1,
                            48000,
                        );
                        var b = new Blob([wav], { type: 'audio/wav' });
                        var url = URL.createObjectURL(b);
                        setUrl(url);
                        // document.write("<a href='"+url+"' download>play</a>");
                    });
                }}
            >
                Record
            </button>
            <input
                value={recordLength}
                onChange={(evt) => setRecordLength(+evt.target.value)}
            />
            {url ? (
                <a
                    href={url}
                    style={{
                        backgroundColor: 'white',
                        color: 'black',
                        borderRadius: 4,
                        padding: 4,
                        display: 'inline-block',
                    }}
                    download="recording.wav"
                >
                    Download
                </a>
            ) : null}
            <div
                style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 40 }}
            >
                {notes.map((note, i) => (
                    <div style={{ padding: 8 }} key={i}>
                        <div>{note.pitch}</div>
                        {'text' in note ? ' ' + note.text : ''}
                    </div>
                ))}
            </div>
        </div>
    );
};

const plugins: RenderPlugins = {
    audioGen2: {
        id: 'audioGen2',
        name: 'Audio Generator',
        type: refType(idFromName(AudioGen$1_id), [
            {
                type: 'var',
                sym: { name: 'T', unique: 0 },
                location: nullLocation,
            },
        ]),
        render: <T,>(
            value: AudioGen$1<T>,
            evalEnv: EvalEnv,
            env: Env,
            term: Term,
            startPaused: boolean,
        ) => {
            return (
                <AudioGenerator
                    value={value}
                    env={env}
                    evalEnv={evalEnv}
                    term={term}
                    startPaused={startPaused}
                />
            );
        },
    },
    audioGen: {
        id: 'audioGen',
        name: 'Audio Generator',
        type: refType(idFromName(AudioGen_id), [
            {
                type: 'var',
                sym: { name: 'T', unique: 0 },
                location: nullLocation,
            },
        ]),
        render: <T,>(
            value: AudioGen<T>,
            evalEnv: EvalEnv,
            env: Env,
            term: Term,
            startPaused: boolean,
        ) => {
            return (
                <AudioGenerator
                    value={value}
                    env={env}
                    evalEnv={evalEnv}
                    term={term}
                    startPaused={startPaused}
                />
            );
        },
    },
};
export default plugins;

const bufferToWav = function (
    buffer: Float32Array,
    channels: number,
    sampleRate: number,
) {
    var intBuffer = new Int16Array(buffer.length + 23),
        tmp;

    intBuffer[0] = 0x4952; // "RI"
    intBuffer[1] = 0x4646; // "FF"

    intBuffer[2] = (2 * buffer.length + 15) & 0x0000ffff; // RIFF size
    intBuffer[3] = ((2 * buffer.length + 15) & 0xffff0000) >> 16; // RIFF size

    intBuffer[4] = 0x4157; // "WA"
    intBuffer[5] = 0x4556; // "VE"

    intBuffer[6] = 0x6d66; // "fm"
    intBuffer[7] = 0x2074; // "t "

    intBuffer[8] = 0x0012; // fmt chunksize: 18
    intBuffer[9] = 0x0000; //

    intBuffer[10] = 0x0001; // format tag : 1
    intBuffer[11] = channels; // channels: 2

    intBuffer[12] = sampleRate & 0x0000ffff; // sample per sec
    intBuffer[13] = (sampleRate & 0xffff0000) >> 16; // sample per sec

    intBuffer[14] = (2 * channels * sampleRate) & 0x0000ffff; // byte per sec
    intBuffer[15] = ((2 * channels * sampleRate) & 0xffff0000) >> 16; // byte per sec

    intBuffer[16] = 0x0004; // block align
    intBuffer[17] = 0x0010; // bit per sample
    intBuffer[18] = 0x0000; // cb size
    intBuffer[19] = 0x6164; // "da"
    intBuffer[20] = 0x6174; // "ta"
    intBuffer[21] = (2 * buffer.length) & 0x0000ffff; // data size[byte]
    intBuffer[22] = ((2 * buffer.length) & 0xffff0000) >> 16; // data size[byte]

    for (var i = 0; i < buffer.length; i++) {
        tmp = buffer[i];
        if (tmp >= 1) {
            intBuffer[i + 23] = (1 << 15) - 1;
        } else if (tmp <= -1) {
            intBuffer[i + 23] = -(1 << 15);
        } else {
            intBuffer[i + 23] = Math.round(tmp * (1 << 15));
        }
    }

    return intBuffer;
};

function floatTo16BitPCM(
    output: DataView,
    offset: number,
    input: Float32Array,
) {
    for (var i = 0; i < input.length; i++, offset += 2) {
        var s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
}
function encodeWAV(
    samples: Float32Array,
    numChannels: number,
    sampleRate: number,
) {
    var buffer = new ArrayBuffer(44 + samples.length * 2);
    var view = new DataView(buffer);

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* RIFF chunk length */
    view.setUint32(4, 36 + samples.length * 2, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, numChannels, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 4, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, numChannels * 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * 2, true);

    floatTo16BitPCM(view, 44, samples);

    return view;
}
function writeString(view: DataView, offset: number, string: string) {
    for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}
