/** @jsx jsx */
import { jsx } from '@emotion/react';
import { LocatedError } from '@jerd/language/src/typing/errors';
import { typeFile } from '@jerd/language/src/typing/typeFile';
import * as React from 'react';
import { State } from '../App';
import { tryParse } from '../initialEnvWithPlugins';
import { stateToString } from '../persistence';

export const ImportExport = ({
    state,
    setState,
}: {
    state: State;
    setState: (s: State) => void;
}) => {
    const [url, setUrl] = React.useState(null as string | null);
    const [err, setError] = React.useState(null as string | null);
    return (
        <div
            css={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'white',
            }}
        >
            {err ? <div style={{ fontSize: '140%' }}>{err}</div> : null}
            <div>
                <button
                    onClick={() => {
                        const blob = new Blob([stateToString(state)]);
                        const url = URL.createObjectURL(blob);
                        setUrl(url);
                    }}
                >
                    Export
                </button>
                {url ? (
                    <a
                        href={url}
                        download={`jerd-ide-dump-${new Date().toISOString()}.json`}
                    >
                        Download dump
                    </a>
                ) : null}
            </div>
            <div>
                Import:{' '}
                <input
                    type="file"
                    onChange={(evt) => {
                        if (
                            !evt.target.files ||
                            evt.target.files.length !== 1
                        ) {
                            console.log('no files! or wrong', evt.target.files);
                            return;
                        }
                        const file = evt.target.files[0];
                        const reader = new FileReader();
                        reader.onload = () => {
                            // const data = JSON.parse(reader.result as string);
                            try {
                                const newState = processImport(
                                    file,
                                    reader.result as string,
                                    state,
                                );
                                setState(newState);
                            } catch (err) {
                                if (!(err instanceof Error)) {
                                    console.log(err);
                                    setError('Unknown error');
                                } else {
                                    setError(err.message);
                                }
                            }
                        };
                        reader.readAsText(file, 'utf8');
                    }}
                />
            </div>
        </div>
    );
};

const processImport = (file: File, contents: string, state: State) => {
    if (file.name.endsWith('.json')) {
        try {
            const data = JSON.parse(contents);
            return data;
        } catch (err) {
            if (!(err instanceof Error)) {
                throw err;
            }
            throw new Error(`Unable to parse JSON contents: ${err.message}`);
        }
    } else if (file.name.endsWith('.jd')) {
        // let's party folks
        try {
            const env = typeFile(tryParse(contents), state.env, file.name).env;
            return { ...state, env };
        } catch (err) {
            console.log(err);
            if (!(err instanceof LocatedError)) {
                throw err;
            }
            throw new Error(`Unable to parse & type .jd ${err.getMessage()}`);
        }
    }
    throw new Error(`Unknown file type ${file.name}`);
};
