import chalk from 'chalk';
import {
    hashObject,
    typeEnumInner,
    typeRecordDefn,
    withoutLocations,
    ToplevelT,
} from './typing/env';
import parse, {
    Define,
    Expression,
    Location,
    Toplevel,
} from './parsing/parser';
import typeExpr, { showLocation } from './typing/typeExpr';
import { Env, newLocal, Term } from './typing/types';
import { printToString } from './printing/printer';
import { toplevelToPretty } from './printing/printTsLike';
import { walkTerm } from './typing/transform';
import { LocatedError } from './typing/errors';
import { writeFileSync } from 'fs';

export const withParseError = (text: string, location: Location) => {
    const lines = text.split('\n');
    const indent = new Array(location.start.column);
    indent.fill('');
    lines.splice(
        location.start.line,
        0,
        chalk.red(indent.join('-') + '^' + '--'),
    );
    return lines.join('\n');
};

export const findSelfReference = (term: Term) => {
    let hasSelf = false;
    walkTerm(term, (term) => {
        if (term.type === 'self') {
            hasSelf = true;
        }
    });
    return hasSelf;
};

export const reprintToplevel = (
    env: Env,
    raw: string,
    toplevel: ToplevelT,
    hash: string,
) => {
    const origraw = toplevel.location
        ? raw.slice(
              toplevel.location.start.offset,
              toplevel.location.end.offset,
          )
        : '<no original text>';
    const reraw = printToString(toplevelToPretty(env, toplevel), 100);
    let printed: Array<Toplevel>;
    try {
        printed = parse(reraw);
    } catch (err) {
        console.log(chalk.green('Original'));
        console.log(origraw);
        console.log(chalk.red('Printed'));
        console.log(withParseError(reraw, err.location));
        console.log(chalk.red('Reparse error:'));
        console.log(showLocation(toplevel.location));
        console.error(err.message, showLocation(err.location));
        return false;
    }
    if (printed.length !== 1) {
        console.log(printed);
        console.warn(`Reprint generated multiple toplevels`);
        return false;
    }
    try {
        let retyped: ToplevelT;
        let nhash: string;
        if (toplevel.type === 'RecordDef' && printed[0].type === 'StructDef') {
            const defn = typeRecordDefn(env, printed[0], toplevel.def.unique);
            nhash = hashObject(defn);
            retyped = {
                ...toplevel,
                type: 'RecordDef',
                def: defn,
                id: { hash: nhash, size: 1, pos: 0 },
            };
        } else if (
            printed[0].type === 'Decorated' &&
            toplevel.type === 'RecordDef' &&
            printed[0].wrapped.type === 'StructDef'
        ) {
            const tag =
                printed[0].decorators[0].args.length === 1
                    ? typeExpr(env, printed[0].decorators[0].args[0])
                    : null;
            if (tag && tag.type !== 'string') {
                throw new Error(`ffi tag must be a string literal`);
            }
            const defn = typeRecordDefn(
                env,
                printed[0].wrapped,
                toplevel.def.unique,
                tag ? tag.text : printed[0].wrapped.id.text,
            );
            if (!defn) {
                throw new Error(`No record defn`);
            }
            nhash = hashObject(defn);
            retyped = {
                ...toplevel,
                type: 'RecordDef',
                def: defn,
                id: { hash: nhash, size: 1, pos: 0 },
            };
        } else if (
            toplevel.type === 'EnumDef' &&
            printed[0].type === 'EnumDef'
        ) {
            const defn = typeEnumInner(env, printed[0]);
            if (!defn) {
                throw new Error(`No enum defn`);
            }
            nhash = hashObject(defn);
            retyped = {
                ...toplevel,
                type: 'EnumDef',
                def: defn,
                id: { hash: nhash, size: 1, pos: 0 },
            };
        } else if (toplevel.type === 'Define' && printed[0].type === 'define') {
            const hasSelf = findSelfReference(toplevel.term);
            // console.log('um going again', toplevel.name);
            retyped = {
                ...toplevel,
                type: 'Define',
                id: toplevel.id,
                term: typeExpr(
                    {
                        ...env,
                        local: {
                            ...newLocal(),
                            self: hasSelf ? env.local.self : null,
                        },
                        term: { nextTraceId: 0 },
                    },
                    (printed[0] as Define).expr,
                ),
            };
            nhash = hashObject(retyped.term);
        } else {
            retyped = {
                ...toplevel,
                type: 'Expression',
                term: typeExpr(
                    {
                        ...env,
                        local: newLocal(),
                        term: { nextTraceId: 0 },
                    },
                    printed[0] as Expression,
                ),
            };
            nhash = hashObject(retyped.term);
        }
        if (nhash != hash) {
            console.log(
                chalk.red('Hash mismatch on reparse!'),
                toplevel.type,
                hash,
                nhash,
            );
            console.log(chalk.green('Original'));
            console.log(origraw);
            console.log(chalk.green('Printed'));
            console.log(reraw);
            console.log(chalk.green('Reprinted'));
            console.log(printToString(toplevelToPretty(env, retyped), 100));
            writeFileSync(
                `reprint-${hash}.json`,
                JSON.stringify(withoutLocations(toplevel)),
            );
            writeFileSync(
                `reprint-${hash}-${nhash}.json`,
                JSON.stringify(withoutLocations(retyped)),
            );
            console.log(
                `./reprint-${hash}.json`,
                `./reprint-${hash}-${nhash}.json`,
            );
            console.warn(
                `Expression at ${showLocation(
                    toplevel.location,
                )} failed to retype.`,
            );
            console.log('\n*************\n');
            return false;
        }
    } catch (err) {
        console.log(chalk.green('Original'));
        console.log(origraw);
        console.log(chalk.green('Reprinted'));
        if (err instanceof LocatedError && err.loc != null) {
            console.log(withParseError(reraw, err.loc));
        } else {
            console.log(reraw);
        }
        // console.log(chalk.yellow('AST'));
        // console.log(JSON.stringify(withoutLocations(printed)));
        console.error(err.toString());
        console.log(
            `Expression at ${showLocation(
                toplevel.location,
            )} had a type error on reprint`,
        );
        return false;
    }
};
