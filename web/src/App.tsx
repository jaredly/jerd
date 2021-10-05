/** @jsx jsx */
import { jsx } from '@emotion/react';
import { printToString } from '@jerd/language/src/printing/printer';
import { toplevelToPretty } from '@jerd/language/src/printing/printTsLike';
// The app
import * as React from 'react';
import { State } from './State';
import { saveState } from './persistence';
import { getTopContent } from './State';
import { getToplevel } from './toplevels';
import { Workspace } from './workspace/Workspace';

export default ({ initial }: { initial: State }) => {
    const [state, setState] = React.useState(() => initial);
    React.useEffect(() => {
        saveState(state);
    }, [state]);
    // @ts-ignore
    window.evalEnv = state.evalEnv;
    // @ts-ignore
    window.state = state;
    // @ts-ignore
    window.renderFile = () => {
        return Object.keys(state.workspaces[state.activeWorkspace].cells)
            .map((k) => {
                const c =
                    state.workspaces[state.activeWorkspace].cells[k].content;
                const topContent = getTopContent(c);
                if (topContent != null) {
                    const top = getToplevel(state.env, topContent);
                    return printToString(
                        toplevelToPretty(state.env, top),
                        100,
                        { hideIds: true },
                    );
                }
                return null;
            })
            .filter(Boolean)
            .join('\n\n');
    };

    return <Workspace state={state} setState={setState} />;
};
