// Get the builtins from the typescript folks

import * as core from '@babel/core';
import { parseType } from '../parsing/parser';
import { presetEnv } from '../typing/preset';
import { Type } from '../typing/types';
import typeType from '../typing/typeType';
// @ts-ignore
import builtinsRaw from './builtins.ts.txt';

export const loadBuiltins = () => {
    const res = core.parseSync(builtinsRaw, {
        filename: 'builtins.ts',
        comments: true,
        sourceType: 'module',
    });
    if (!res || res.type !== 'File') {
        throw new Error('failed to load');
    }

    const commentsByLine: { [line: number]: string } = {};
    res.comments!.forEach((c) => {
        if (c.value.startsWith(': ')) {
            commentsByLine[c.loc.start.line] = c.value;
        }
    });

    const builtins: { [key: string]: Type | null } = {};

    res.program.body.forEach((item) => {
        if (
            item.type === 'ExportNamedDeclaration' &&
            item.declaration &&
            item.declaration.type === 'VariableDeclaration'
        ) {
            const typeComment = commentsByLine[item.loc!.start.line - 1];
            const parsed = typeComment ? parseType(typeComment.slice(2)) : null;
            const theType = parsed ? typeType(presetEnv({}), parsed) : null;

            item.declaration.declarations.forEach((decl) => {
                if (decl.id.type !== 'Identifier' || !decl.init) {
                    return;
                }
                builtins[decl.id.name] = theType;
            });
        }
    });
    return builtins;
};
