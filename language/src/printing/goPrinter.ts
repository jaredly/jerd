// Printing Go! I think

// import * as t from '@babel/types';
import { idName } from '../typing/env';
import { binOps } from '../typing/preset';
import { showLocation } from '../typing/typeExpr';
import { Env, Id, Symbol, Term, Type } from '../typing/types';
import * as ir from './intermediateRepresentation';
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
    result.push(atom(`type handlers = []interface{}`));
    Object.keys(env.global.terms).forEach((hash) => {
        const term = env.global.terms[hash];
        const irTerm = ir.printTerm(env, {}, term);
        result.push(defnToGo(env, {}, hash, irTerm));
    });
    result.push(
        items([
            atom('func main() '),
            block(
                expressions.map((expr) =>
                    items([
                        atom('_ = '),
                        termToGo(env, {}, ir.printTerm(env, {}, expr)),
                    ]),
                ),
                '',
            ),
        ]),
    );
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
            return items([
                atom('func '),
                args(type.args.map((t) => typeToGo(env, opts, t))),
                atom(' '),
                type.res.type !== 'ref' ||
                type.res.ref.type !== 'builtin' ||
                type.res.ref.name !== 'void'
                    ? typeToGo(env, opts, type.res)
                    : null,
            ]);

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

const isVoid = (t: Type) =>
    t.type === 'ref' && t.ref.type === 'builtin' && t.ref.name === 'void';

const defnToGo = (
    env: Env,
    opts: OutputOptions,
    hash: string,
    term: ir.Expr,
) => {
    if (term.type === 'lambda') {
        return items([
            atom('func '),
            atom(HashToString(hash)),
            args(
                term.args.map((arg) =>
                    items([
                        symToGo(arg.sym),
                        atom(' '),
                        typeToGo(env, opts, arg.type),
                    ]),
                ),
            ),
            atom(' '),
            isVoid(term.res) ? null : typeToGo(env, opts, term.res),
            atom(' '),
            lambdaBodyToGo(env, opts, term.body),
            // term.body.type === 'Block'
            // block([items([atom('return '), termToGo(env, opts, term.body)])]),
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

const lambdaBodyToGo = (
    env: Env,
    opts: OutputOptions,
    body: ir.Block | ir.Expr,
): PP => {
    if (body.type === 'Block') {
        return block(
            body.items.map((s) => stmtToGo(env, opts, s)),
            '',
        );
    } else {
        return block([items([atom('return '), termToGo(env, opts, body)])], '');
    }
};

const stmtToGo = (env: Env, opts: OutputOptions, stmt: ir.Stmt): PP => {
    switch (stmt.type) {
        case 'Block':
            return lambdaBodyToGo(env, opts, stmt);
        case 'MatchFail':
            return items([atom('panic'), args([atom('"Match fail"')])]);
        case 'Return':
            return items([atom('return '), termToGo(env, opts, stmt.value)]);
        // TODO include type here? could be good
        case 'Define':
            return items([
                symToGo(stmt.sym),
                atom(' := '),
                termToGo(env, opts, stmt.value),
            ]);
        case 'Expression':
            return termToGo(env, opts, stmt.expr);
        case 'Assign':
            return items([
                symToGo(stmt.sym),
                atom(' = '),
                termToGo(env, opts, stmt.value),
            ]);
        case 'if':
            return items([
                atom('if '),
                termToGo(env, opts, stmt.cond),
                lambdaBodyToGo(env, opts, stmt.yes),
                ...(stmt.no
                    ? [atom(' else '), lambdaBodyToGo(env, opts, stmt.no)]
                    : []),
            ]);
        default:
            let _x: never = stmt;
            throw new Error(`Unknown stmt ${(stmt as any).type}`);
    }
};

const termToGo = (env: Env, opts: OutputOptions, term: ir.Expr): PP => {
    switch (term.type) {
        case 'string':
            return atom(`"${term.value}"`);
        case 'int':
        case 'float':
        case 'boolean':
            return atom(`${term.value}`);
        case 'lambda':
            return items([
                atom('func '),
                args(
                    term.args.map((arg) =>
                        items([
                            symToGo(arg.sym),
                            atom(' '),
                            typeToGo(env, opts, arg.type),
                        ]),
                    ),
                ),
                atom(' '),
                typeToGo(env, opts, term.res),
                atom(' '),
                lambdaBodyToGo(env, opts, term.body),
            ]);
        case 'apply':
            if (
                term.target.type === 'builtin' &&
                binOps.includes(term.target.name)
            ) {
                return items([
                    termToGo(env, opts, term.args[0]),
                    atom(' '),
                    atom(term.target.name === '++' ? '+' : term.target.name),
                    atom(' '),
                    termToGo(env, opts, term.args[1]),
                ]);
            }
            if (term.args.length !== term.targetType.args.length) {
                throw new Error(
                    `Wrong function args length in 'apply', found ${
                        term.args.length
                    } but targetType only has ${
                        term.targetType.args.length
                    } at ${showLocation(term.loc)}`,
                );
            }
            return items([
                termToGo(env, opts, term.target),
                args(
                    term.args.map((arg, i) =>
                        // hrmmmmm I need to know the types that are expected
                        // so I can know whether to transform them into interface{}
                        items([
                            term.targetType.args[i].type === 'var'
                                ? atom('(interface{})(')
                                : null,
                            termToGo(env, opts, arg),
                            term.targetType.args[i].type === 'var'
                                ? atom(')')
                                : null,
                        ]),
                    ),
                ),
                term.targetType.res.type === 'var'
                    ? // TODO pipe through the ids of things
                      items([
                          atom('.('),
                          typeToGo(env, opts, term.res),
                          atom(')'),
                      ])
                    : null,
            ]);
        case 'var':
            return symToGo(term.sym);
        case 'builtin':
            return atom(term.name);
        case 'term':
            return atom(IdToString(term.id));
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
