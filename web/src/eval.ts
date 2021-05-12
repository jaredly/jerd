// For running the code

import * as t from '@babel/types';
import {
    optimizeAST,
    removeTypescriptTypes,
} from '@jerd/language/src/printing/typeScriptOptimize';

import * as ir from '@jerd/language/src/printing/ir/term';
import { getSortedTermDependencies } from '@jerd/language/src/typing/analyze';
import generate from '@babel/generator';
import { idFromName, idName } from '@jerd/language/src/typing/env';
import { Env, Id, Self, selfEnv, Term } from '@jerd/language/src/typing/types';
import { termToTs } from '@jerd/language/src/printing/typeScriptPrinterSimple';
import { EvalEnv } from './State';
import {
    optimize,
    optimizeDefine,
} from '@jerd/language/src/printing/ir/optimize/optimize';
import { liftEffects } from '@jerd/language/src/printing/pre-ir/lift-effectful';

export class TimeoutError extends Error {}

export const termToJS = (env: Env, term: Term, id: Id, asReturn?: boolean) => {
    term = liftEffects(env, term);
    const irTerm = ir.printTerm(env, { limitExecutionTime: true }, term);
    let termAst: any = termToTs(
        env,
        { scope: 'jdScope', limitExecutionTime: true },
        optimizeDefine(
            env,
            irTerm,
            id,

            // optimize(irTerm),
        ),
    );
    let ast = t.file(
        t.program(
            [
                asReturn
                    ? t.returnStatement(termAst)
                    : t.expressionStatement(termAst),
            ],
            [],
            'script',
        ),
    );
    optimizeAST(ast);
    removeTypescriptTypes(ast);
    const { code, map } = generate(ast, {
        sourceMaps: true,
        sourceFileName: idName(id),
    });

    return code;
};

const runWithExecutionLimit = (
    code: string,
    evalEnv: EvalEnv,
    idName: string,
    executionLimit: { ticks: number; maxTime: number; enabled: boolean },
): any => {
    const jdScope = {
        ...evalEnv,
        builtins: {
            ...evalEnv.builtins,
            checkExecutionLimit: () => {
                if (!executionLimit.enabled) {
                    return;
                }
                executionLimit.ticks += 1;
                // Checking the time is probably a little expensive
                if (executionLimit.ticks % 100 === 0) {
                    if (Date.now() > executionLimit.maxTime) {
                        throw new TimeoutError('Execution took too long');
                    }
                }
            },
        },
        terms: {
            ...evalEnv.terms,
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
    const results: { [key: string]: any } = {};

    const deps = getSortedTermDependencies(env, term, id);
    console.log(deps);
    const idn = idName(id);
    deps.forEach((dep) => {
        if (evalEnv.terms[dep] == null) {
            if (dep !== idn) {
                console.log('Evaluating dependency', dep);
            }
            const depTerm = idn === dep ? term : env.global.terms[dep];
            const self: Self = { type: 'Term', name: dep, ann: term.is };
            const code = termToJS(
                selfEnv(env, self),
                depTerm,
                idFromName(dep),
                true,
            );
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
