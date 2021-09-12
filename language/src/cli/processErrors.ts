import path from 'path';
import fs from 'fs';
import { typeDecoratorDef } from '../typing/env';
import parse, { Toplevel } from '../parsing/parser';
import typeExpr, { showLocation } from '../typing/typeExpr';
import { Type, TypeError as TypeErrorTerm } from '../typing/types';
import { printToString } from '../printing/printer';
import { termToPretty } from '../printing/printTsLike';
import {
    typeDefine,
    typeTypeDefn,
    typeEnumDefn,
    typeEffect,
} from '../typing/env';
import { presetEnv } from '../typing/preset';
import { LocatedError } from '../typing/errors';
import { transform } from '../typing/transform';
import { showType } from '../typing/unify';
import { writeFile } from '../main';

export const processErrors = (
    fname: string,
    builtins: { [key: string]: Type },
) => {
    const raw = fs.readFileSync(fname, 'utf8');
    const parsed: Array<Toplevel> = parse(raw);
    let env = presetEnv(builtins);
    const errors: Array<string> = [];
    parsed.forEach((item, i) => {
        if (item.type === 'effect') {
            env = typeEffect(env, item);
        } else if (item.type === 'define') {
            env = typeDefine(env, item).env;
        } else if (item.type === 'StructDef') {
            env = typeTypeDefn(env, item);
        } else if (item.type === 'EnumDef') {
            env = typeEnumDefn(env, item).env;
        } else if (item.type === 'DecoratorDef') {
            env = typeDecoratorDef(env, item).env;
        } else if (item.type === 'Decorated') {
            throw new Error(`Unexpected decorator`);
        } else {
            let term;
            try {
                term = typeExpr(env, item);
            } catch (err) {
                if (err instanceof Error) {
                    errors.push(err.message);
                }
                return; // yup
            }
            const typeErrors: Array<TypeErrorTerm> = [];
            transform(term, {
                let: () => null,
                term: (term) => {
                    if (term.type === 'TypeError') {
                        typeErrors.push(term);
                    }
                    return null;
                },
            });
            if (typeErrors.length) {
                errors.push(
                    `expected ${showType(
                        env,
                        typeErrors[0].is,
                    )}, found ${showType(env, typeErrors[0].inner.is)}`,
                );
                return;
            }
            console.log(item);
            throw new LocatedError(
                item.location,
                `Expected a type error at ${showLocation(
                    item.location,
                )} : ${printToString(termToPretty(env, term), 100)}`,
            );
        }
    });

    const buildDir = path.join(path.dirname(fname), 'build');
    const dest = path.join(buildDir, path.basename(fname) + '.txt');
    writeFile(dest, errors.join('\n\n'));
};
