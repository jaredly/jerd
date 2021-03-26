// For running the code

import * as t from '@babel/types';
import {
    optimizeAST,
    removeTypescriptTypes,
} from '../../src/printing/typeScriptOptimize';

import { getSortedTermDependencies } from '../../src/typing/analyze';
import generate from '@babel/generator';
import { idName } from '../../src/typing/env';
import { Env, Id, selfEnv, Term } from '../../src/typing/types';
import { printTerm } from '../../src/printing/typeScriptPrinter';
import { EvalEnv } from './Cell';

export class TimeoutError extends Error {}

const termToJS = (env: Env, term: Term, idName: string) => {
    let termAst: any = printTerm(
        env,
        { scope: 'jdScope', limitExecutionTime: true },
        term,
    );
    let ast = t.file(t.program([t.returnStatement(termAst)], [], 'script'));
    optimizeAST(ast);
    removeTypescriptTypes(ast);
    const { code, map } = generate(ast, {
        sourceMaps: true,
        sourceFileName: idName,
    });

    return code;
};

const runWithExecutionLimit = (
    code: string,
    evalEnv: EvalEnv,
    idName: string,
    executionLimit: { ticks: number; maxTime: number; enabled: boolean },
) => {
    // const start = Date.now();
    // let ticks = 0;
    // const timeLimit = 200;
    const jdScope = {
        ...evalEnv,
        terms: {
            ...evalEnv.terms,
        },
        checkExecutionLimit: () => {
            if (!executionLimit.enabled) {
                return;
            }
            executionLimit.ticks += 1;
            // if (ticks++ % 100 === 0) {
            if (Date.now() > executionLimit.maxTime) {
                throw new TimeoutError('Execution took too long');
            }
            // }
        },
    };
    console.log('code', code);
    // yay now it's safe from weird scoping things.
    const result = new Function('jdScope', code)(jdScope);
    // This is so recursive calls work
    jdScope.terms[idName] = result;
    return result;
};

export const runTerm = (env: Env, term: Term, id: Id, evalEnv: EvalEnv) => {
    const results = {};

    const deps = getSortedTermDependencies(env, term, id);
    console.log(deps);
    const idn = idName(id);
    deps.forEach((dep) => {
        if (evalEnv.terms[dep] == null) {
            console.log(dep, 'isnt there');
            const depTerm = idn === dep ? term : env.global.terms[dep];
            const self = { name: dep, type: term.is };
            const code = termToJS(selfEnv(env, self), depTerm, dep);
            const innerEnv = {
                ...evalEnv,
                terms: { ...evalEnv.terms, ...results },
            };
            evalEnv.executionLimit.enabled = true;
            evalEnv.executionLimit.maxTime = Date.now() + 200;
            evalEnv.executionLimit.ticks = 0;
            try {
                const result = runWithExecutionLimit(
                    code,
                    innerEnv,
                    dep,
                    evalEnv.executionLimit,
                );
                results[dep] = result;
                console.log('result', dep, result);
            } catch (err) {
                evalEnv.executionLimit.enabled = false;
                throw err;
            }
            evalEnv.executionLimit.enabled = false;
        } else {
            console.log('already evaluated', dep, evalEnv.terms[dep]);
        }
    });
    return results;
};
