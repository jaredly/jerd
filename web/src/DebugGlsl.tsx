/** @jsx jsx */
import { jsx } from '@emotion/react';
import * as React from 'react';
import {
    assembleItemsForFile,
    defaultOptimizer,
    generateSingleShader,
    makeTermExpr,
    populateBuiltins,
} from '../../language/src/printing/glslPrinter';
import {
    Exprs,
    glslOpts,
    glslOptsNamed,
    optimizeRepeatedly,
    toOldOptimize,
} from '../../language/src/printing/ir/optimize/optimize';
import {
    defaultVisitor,
    transformExpr,
} from '../../language/src/printing/ir/transform';
import { Expr, OutputOptions } from '../../language/src/printing/ir/types';
import { debugExpr } from '../../language/src/printing/irDebugPrinter';
import { printToAttributedText } from '../../language/src/printing/printer';
import { idName } from '../../language/src/typing/env';
import { Env, Id } from '../../language/src/typing/types';
import { State } from './App';
import { compileGLSL } from './display/OpenGL';
import { renderAttributedText } from './Render';

const getName = (opt: any) => {
    return (
        Object.keys(glslOptsNamed).find(
            (k: string) => opt === (glslOptsNamed as any)[k],
        ) || opt.name
    );
};

const opts = glslOpts;

export const addLocationIndices = (expr: Expr): Expr => {
    let idx = 0;
    return transformExpr(expr, {
        ...defaultVisitor,
        expr: (expr) => {
            return {
                ...expr,
                loc: {
                    ...expr.loc,
                    idx: idx++,
                },
            };
        },
        stmt: (stmt) => {
            return {
                ...stmt,
                loc: {
                    ...stmt.loc,
                    idx: idx++,
                },
            };
        },
    });
};

export const DebugGlsl = ({ state, id }: { state: State; id: Id }) => {
    const [enabled, setEnabled] = React.useState(opts.map((o) => false));
    const [selected, setSelected] = React.useState(null);
    const glsl = React.useMemo(() => {
        const opt = optimizeRepeatedly(opts.filter((_, i) => enabled[i]));

        const builtins = populateBuiltins(state.env);

        const { inOrder, irTerms } = assembleItemsForFile(
            state.env,
            [makeTermExpr(id, state.env)],
            [idName(id)],
            {},
            builtins,
            toOldOptimize(opt),
        );

        const exprs = inOrder
            .map((k) => irTerms[k])
            .map((e) => ({
                ...e,
                expr: addLocationIndices(e.expr),
            }));

        return exprs;
    }, [enabled]);
    return (
        <div
            css={{
                color: 'white',
                padding: 50,
            }}
        >
            {enabled.map((e, i) => {
                return (
                    <div>
                        <input
                            type="checkbox"
                            checked={e}
                            onChange={(evt) => {
                                const v = enabled.slice();
                                v[i] = !e;
                                setEnabled(v);
                            }}
                        />
                        {getName(opts[i])}
                    </div>
                );
            })}
            <div>
                {glsl.map((expr, i) => (
                    <div
                        key={i}
                        css={{
                            fontFamily: '"Source Code Pro", monospace',
                            whiteSpace: 'pre-wrap',
                            position: 'relative',
                            cursor: 'pointer',
                            padding: 8,
                        }}
                    >
                        {renderAttributedText(
                            state.env.global,
                            printToAttributedText(
                                debugExpr(state.env, expr.expr),
                                100,
                            ),
                            (evt, id_, kind, loc) => {
                                if (!loc) {
                                    return false;
                                }
                                console.log(loc.idx);
                                // TODO
                                // setSelected()
                                return true;
                            },
                            undefined,
                            undefined,
                            () => true,
                        )}
                    </div>
                ))}
            </div>
            {/* <div>
				{glsl.}
			</div> */}
        </div>
    );
};
