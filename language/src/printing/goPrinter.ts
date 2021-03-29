// Printing Go! I think

// import * as t from '@babel/types';
import { idName } from '../typing/env';
import { Env, Id, Symbol, Term, Type } from '../typing/types';
import {
    PP,
    items,
    args,
    block,
    atom,
    id as idPretty,
    printToString,
} from './printer';
// import { declarationToAST } from './typeScriptPrinter';

export type OutputOptions = {};

export const HashToString = (hash: string) => `Hash_${hash}`;
export const IdToString = (id: Id) => HashToString(idName(id));
const symToGo = (sym: Symbol) => atom(`${sym.name}_${sym.unique}`);

export const fileToGo = (expressions: Array<Term>, env: Env) => {
    // const ast = fileToTypescript(expressions, env, {}, )
    const result: Array<PP> = [];
    Object.keys(env.global.terms).forEach((hash) => {
        const term = env.global.terms[hash];
        result.push(defnToGo(env, {}, hash, term));
    });
    return result.map((item) => printToString(item, 100)).join('\n\n');
};

export const typeToGo = (env: Env, opts: OutputOptions, type: Type): PP => {
    switch (type.type) {
        case 'ref': {
            if (type.ref.type === 'builtin') {
                return atom(type.ref.name);
            } else {
                return atom(IdToString(type.ref.id));
            }
        }

        case 'lambda':
        case 'var':
            return atom('interface {}');
    }
};

// hrmmmmmm I'm really wanting the babel AST representation ..... so that I can do things
// like the typescriptOptimize pass.
// hrmmmmmm.
// ok, hm.
/*
so type annotations can be left alone

then we'll have arrow functions (go can deal and add a return, its fine)
call()
if
attribute



*/

const defnToGo = (env: Env, opts: OutputOptions, hash: string, term: Term) => {
    if (term.type === 'lambda') {
        return items([
            atom('func '),
            atom(HashToString(hash)),
            args(
                term.args.map((sym, i) =>
                    items([
                        symToGo(sym),
                        atom(' '),
                        typeToGo(env, opts, term.is.args[i]),
                    ]),
                ),
            ),
            atom(' '),
            typeToGo(env, opts, term.is.res),
            atom(' '),
            block([items([atom('return '), termToGo(env, opts, term.body)])]),
        ]);
    } else {
        return items([
            atom('var '),
            atom(HashToString(hash)),
            atom(' = '),
            termToGo(env, opts, term),
        ]);
    }
};

const termToGo = (env: Env, opts: OutputOptions, term: Term) => {
    switch (term.type) {
        case 'string':
            return atom(`"${term.text}"`);
        case 'int':
        case 'float':
            return atom(`${term.value}`);
        default:
            let _x: never = term;
            return atom(`panic("Nope ${term.type}")`);
    }
};

const patternToGo = (param: any) => {
    if (param.type === 'Identifier') {
        return atom(`${param.name} interface{}`);
    }
    return atom('what int');
};

// const typeToGo = (ann: t.TSTypeAnnotation) => {
//     if (!ann) {
//         return atom('');
//     }
//     if (!ann.typeAnnotation) {
//         return atom('errorz');
//     }
//     if (ann.typeAnnotation.type === 'TSStringKeyword') {
//         return atom('string');
//     }
//     // oops
//     if (ann.typeAnnotation.type === 'TSNumberKeyword') {
//         return atom('int');
//     }
//     return atom('error');
// };

// const toGoPretty = (node: t.Statement) => {
//     switch (node.type) {
//         case 'VariableDeclaration': {
//             return node.declarations.map((decl) => {
//                 if (decl.id.type !== 'Identifier') {
//                     throw new Error('decl not id');
//                 }
//                 const init = decl.init!;
//                 if (init.type === 'ArrowFunctionExpression') {
//                     return items([
//                         atom('func '),
//                         atom(decl.id.name),
//                         args(init.params.map((param) => patternToGo(param))),
//                         atom(' '),
//                         typeToGo(init.returnType as t.TSTypeAnnotation),
//                         atom(' '),
//                         block([]),
//                     ]);
//                 } else {
//                     return atom('// yes ' + (decl.id as t.Identifier).name);
//                 }
//             });
//         }
//     }

//     return [atom('// Ok folks')];
// };
