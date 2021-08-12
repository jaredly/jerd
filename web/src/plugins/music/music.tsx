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
    const [notes, setNotes] = React.useState([] as Array<Note | Note$1>);
    React.useEffect(() => {
        if (!playState) {
            return;
        }
        const synth = new Tone.Synth().toDestination();
        let state = value.initial;
        let tid = null as null | NodeJS.Timeout;
        const run = () => {
            const res = value.generate(state);
            state = res.next;
            setNotes(res.notes);
            res.notes.forEach((note) => {
                console.log(note);
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
            <div style={{ display: 'flex' }}>
                {notes.map((note, i) => (
                    <div style={{ padding: 8 }} key={i}>
                        {note.pitch}
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
