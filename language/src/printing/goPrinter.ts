// Printing Go! I think

// import * as t from '@babel/types';
import { idName, idFromName } from '../typing/env';
import { isType } from '../typing/getTypeError';
import { binOps, bool, pureFunction, void_ } from '../typing/preset';
import { showLocation } from '../typing/typeExpr';
import {
    apply,
    Env,
    getAllSubTypes,
    Id,
    isBuiltin,
    LambdaType,
    RecordDef,
    Symbol,
    Term,
    Type,
} from '../typing/types';
import { walkType } from '../typing/typeType';
import * as ir from './ir/intermediateRepresentation';
import {
    goOptimizations,
    optimize,
    removeUnusedVariables,
} from './ir/optimize';
import { Record } from './ir/types';
import { callExpression, handlersType } from './ir/utils';
import { builtin } from './ir/utils';
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

export const fileToGo = (
    expressions: Array<Term>,
    env: Env,
    assert: boolean,
) => {
    // const ast = fileToTypescript(expressions, env, {}, )
    const result: Array<PP> = [];
    result.push(atom(`type handlers = []interface{}`));
    result.push(
        atom(`
    func assertEqual(one, two interface{}) {
        if one != two {
            println("Failed!")
        } else {
            println("Passed!")
        }
    }
    func assert(val bool) {
        if !val {
            println("Failed!")
        } else {
            println("Passed!")
        }
    }
    `),
    );

    Object.keys(env.global.types).forEach((hash) => {
        const defn = env.global.types[hash];
        if (defn.type === 'Record') {
            result.push(recordTypeToGo(env, {}, idFromName(hash), defn));
            result.push(recordTypeToInterface(env, {}, idFromName(hash), defn));
        }
    });

    Object.keys(env.global.terms).forEach((hash) => {
        const term = env.global.terms[hash];
        let irTerm = ir.printTerm(env, {}, term);
        irTerm = optimize(env, irTerm);
        irTerm = goOptimizations(env, irTerm);

        result.push(defnToGo(env, {}, hash, irTerm));
    });
    result.push(
        items([
            atom('func main() '),
            block(
                expressions.map((expr) => {
                    if (assert && isType(env, expr.is, bool)) {
                        expr = wrapWithAssert(expr);
                    }
                    const t = termToGo(
                        env,
                        {},
                        optimize(env, ir.printTerm(env, {}, expr)),
                    );
                    if (isType(env, expr.is, void_)) {
                        return t;
                    } else {
                        return items([atom('_ = '), t]);
                    }
                }),
                '',
            ),
        ]),
    );
    return result.map((item) => printToString(item, 100)).join('\n\n');
};

export const wrapWithAssert = (expr: Term): Term => {
    if (expr.type === 'apply' && isBuiltin(expr.target, '==')) {
        const argTypes = (expr.target.is as LambdaType).args;
        return {
            ...expr,
            target: {
                type: 'ref',
                ref: {
                    type: 'builtin',
                    name: 'assertEqual',
                },
                location: null,
                is: pureFunction(argTypes, void_),
            },
            is: void_,
        };
    } else if (expr.type === 'apply') {
        return apply(
            {
                type: 'ref',
                ref: { type: 'builtin', name: 'assertCall' },
                location: null,
                is: pureFunction(
                    [expr.target.is, ...(expr.target.is as LambdaType).args],
                    void_,
                ),
            },
            [expr.target, ...expr.args],
            null,
        );
    } else {
        return apply(
            {
                type: 'ref',
                ref: { type: 'builtin', name: 'assert' },
                location: null,
                is: pureFunction([bool], void_),
            },
            [expr],
            null,
        );
    }
};

// TODO move this to an optimize pass that converts to "{as any}" and "{as type}"
// also, attributes might want to be "variable" and "concrete"?
// alternatively, I could make all go attribute access be functions. although that would
// sacrifice some speed I imagine?
export const handleArgTypeVariables = (
    env: Env,
    opts: OutputOptions,
    arg: ir.Expr,
    origType: Type,
    type: Type,
): PP => {
    if (origType.type === 'var' && type.type !== 'var') {
        // hrmm
        // do I need a "type cast" thing for the IR? maybe?
        // like, I could get away with PP probably
        return items([
            atom('(interface{})('),
            termToGo(env, opts, arg),
            atom(')'),
        ]);
    }
    if (type.type === 'var' && origType.type !== 'var') {
        return items([
            termToGo(env, opts, arg),
            atom('.('),
            typeToGo(env, opts, origType),
            atom(')'),
        ]);
    }
    if (origType.type === 'lambda') {
        let hadVar = false;
        walkType(origType, (t) => {
            if (t.type === 'var') {
                hadVar = true;
            }
            return null;
        });
        let hasVar = false;
        walkType(type, (t) => {
            if (t.type === 'var') {
                hasVar = true;
            }
            return null;
        });
        if (hadVar && !hasVar) {
            const t = type as LambdaType;
            // Hash_73d0baf5 becomes
            // func (arg interface{}) interface{} {
            //   (interface{})(Hash_73d0baf5(arg.(int)))
            // }
            const argVbls = origType.args.map((_, i) => ({
                name: `arg_${i}`,
                unique: env.local.unique++,
            }));
            return items([
                atom('func '),
                args(
                    origType.args.map((arg, i) =>
                        items([
                            symToGo(argVbls[i]),
                            atom(' '),
                            typeToGo(env, opts, arg),
                        ]),
                    ),
                ),
                atom(' '),
                typeToGo(env, opts, origType.res),
                atom(' '),
                block(
                    [
                        items([
                            atom('return '),
                            handleArgTypeVariables(
                                env,
                                opts,
                                callExpression(
                                    arg,
                                    t,
                                    t.res,
                                    origType.args.map((_, i) => ({
                                        type: 'var',
                                        sym: argVbls[i],
                                        loc: null,
                                    })),
                                    null,
                                    origType,
                                ),
                                // arg,
                                origType.res,
                                t.res,
                            ),
                        ]),
                    ],
                    '',
                ),
            ]);

            // return atom('convert_convert');
        }
        // return atom(`ok${origType.typeVbls.length}_vs_${t.typeVbls.length}`);
        // let hadVar = false
        // origType.args.forEach((arg, i) => {
        //     hadVar
        // })
    }
    // ugh now I need to know the concrete types of things...
    // is this too much work?
    // am I going down a weird rabbit hole?
    // should I get back to javascript-land?
    // probably javascript land, ftr.

    return termToGo(env, opts, arg);
};

export const typeToGo = (env: Env, opts: OutputOptions, type: Type): PP => {
    switch (type.type) {
        case 'ref': {
            if (type.ref.type === 'builtin') {
                // if it really is void (for []void{}, for example), we can pretend it's an int
                return atom(type.ref.name === 'void' ? 'int' : type.ref.name);
            } else {
                return atom(IdToString(type.ref.id));
            }
        }

        case 'lambda':
            // Is this the right place to make this adjustment?
            // We'll have to do it in a number of places, I imagine.
            return items([
                atom('func '),
                args(
                    type.args
                        .map((t) => typeToGo(env, opts, t))
                        .concat(
                            type.effects.length
                                ? [
                                      typeToGo(env, opts, handlersType),
                                      typeToGo(
                                          env,
                                          opts,
                                          pureFunction(
                                              [handlersType, type.res],
                                              void_,
                                          ),
                                      ),
                                      //   typeToGo(env, opts, type.res),
                                  ]
                                : [],
                        ),
                ),
                atom(' '),
                type.effects.length === 0 && !isVoid(type.res)
                    ? typeToGo(env, opts, type.res)
                    : null,
            ]);

        case 'var':
            return atom('interface{}');
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
            if (!stmt.value) {
                return items([
                    atom('var '),
                    symToGo(stmt.sym),
                    atom(' '),
                    typeToGo(env, opts, stmt.is),
                ]);
            }
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
        case 'Loop':
            return items([atom('for '), lambdaBodyToGo(env, opts, stmt.body)]);
        case 'Continue':
            return atom('continue');
        case 'if':
            return items([
                atom('if '),
                termToGo(env, opts, stmt.cond),
                atom(' '),
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
                isVoid(term.res) ? null : typeToGo(env, opts, term.res),
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
                        handleArgTypeVariables(
                            env,
                            opts,
                            arg,
                            // term.
                            // hrmmmmmm actually maybe I need to know what the type is
                            // currently?
                            term.targetType.args[i],
                            term.concreteType.args[i],
                        ),
                    ),
                ),
                term.targetType.res.type === 'var' &&
                term.concreteType.res.type !== 'var'
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
            // ok if this is um
            // term.
            return atom(IdToString(term.id));
        case 'arrayLen':
            return items([
                atom('len'),
                args([termToGo(env, opts, term.value)]),
            ]);
        case 'eqLiteral':
            return items([
                termToGo(env, opts, term.value),
                atom(' == '),
                termToGo(env, opts, term.literal),
            ]);
        case 'arrayIndex':
            return items([
                termToGo(env, opts, term.value),
                atom('['),
                termToGo(env, opts, term.idx),
                atom(']'),
            ]);
        case 'slice':
            return items([
                termToGo(env, opts, term.value),
                atom('['),
                termToGo(env, opts, term.start),
                atom(':'),
                term.end != null ? termToGo(env, opts, term.end) : null,
                // termToGo(env, opts, term.start)
                atom(']'),
            ]);
        case 'array':
            return items([
                atom('[]'),
                typeToGo(env, opts, term.elType),
                args(
                    term.items
                        .filter((t) => t.type !== 'Spread')
                        .map((item) => termToGo(env, opts, item as ir.Expr)),
                    '{',
                    '}',
                ),
            ]);
        case 'attribute': {
            // huh maybe I do want types all over the place
            // because I need to know whether to
            // coerce this to something...
            return items([
                termToGo(env, opts, term.target),
                atom('.'),
                // @ts-ignore
                atom(attributeId(term.ref.id, term.idx)),
            ]);
        }
        case 'record':
            if (term.base.type === 'Concrete') {
                const d = env.global.types[
                    idName(term.base.ref.id)
                ] as RecordDef;
                // eek I need to not rerun `spread` a ton of times.
                // here's where I make a lambda I think?
                // oof no its too late for that.
                // hrmmm what's the right level for this...
                // maybe I need a "expand all spreads" optimize step?
                // yeah that sounds like it might do the trick.
                // and then languages like this that don't do spreads
                // don't have to worry about it.
                // yup I think that's the right call.
                return items([
                    atom(IdToString(term.base.ref.id)),
                    args(
                        getFlattenedRecordItems(
                            env,
                            term,
                        ).map(({ id, i, value }) =>
                            items([
                                atom(attributeId(id, i)),
                                atom(': '),
                                termToGo(env, opts, value),
                            ]),
                        ),
                        '{',
                        '}',
                    ),
                ]);
            } else {
                return atom('"Nope var record"');
            }
        default:
            // let _x: never = term;
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

export const attributeId = (id: Id, idx: number) => `H${idName(id)}_${idx}`;

export const recordTypeToInterface = (
    env: Env,
    opts: OutputOptions,
    id: Id,
    defn: RecordDef,
): PP => {
    // TODO TODO TODO the things from subtypes
    return items([
        atom('type '),
        atom('I_' + IdToString(id)),
        atom(' interface '),
        block(
            defn.items.map((item, i) =>
                items([
                    atom(attributeId(id, i)),
                    atom('() '),
                    typeToGo(env, opts, item),
                ]),
            ),
        ),
    ]);
};

// hrmmmmm why are some things not populated? 🤔
const assertPresent = (v: ir.Expr | null): ir.Expr => {
    if (!v) {
        throw new Error(`Null expr`);
    }
    return v;
};

const getFlattenedRecordItems = (
    env: Env,
    record: Record,
): Array<{ id: Id; i: number; value: ir.Expr }> => {
    if (record.base.type === 'Variable') {
        throw new Error('npe');
    }
    const id = record.base.ref.id;
    const d = env.global.types[idName(id)] as RecordDef;
    return record.base.rows
        .map((value, i) => ({ id, i, value: value }))
        .concat(
            ...Object.keys(record.subTypes).map((k) =>
                record.subTypes[k].rows.map((value, i) => ({
                    id: idFromName(k),
                    i,
                    value: value,
                })),
            ),
        )
        .filter((x) => x.value != null) as Array<{
        id: Id;
        i: number;
        value: ir.Expr;
    }>;
};

const getAllRecordItems = (env: Env, id: Id) => {
    const d = env.global.types[idName(id)] as RecordDef;
    return d.items
        .map((type, i) => ({ id, i, type }))
        .concat(
            ...getAllSubTypes(env.global, d).map((sub) => {
                const d = env.global.types[idName(sub)] as RecordDef;
                return d.items.map((type, i) => ({
                    id: sub,
                    i,
                    type,
                }));
            }),
        );
};

export const recordTypeToGo = (
    env: Env,
    opts: OutputOptions,
    id: Id,
    defn: RecordDef,
): PP => {
    return items([
        atom('type '),
        atom(IdToString(id)),
        atom(' struct '),
        block(
            // TODO use getAllRecordItmes
            defn.items
                .map((item, i) =>
                    items([
                        atom(attributeId(id, i)),
                        atom(' '),
                        typeToGo(env, opts, item),
                    ]),
                )
                .concat(
                    ...getAllSubTypes(env.global, defn).map((sub) => {
                        const d = env.global.types[idName(sub)] as RecordDef;
                        return d.items.map((item, i) =>
                            items([
                                atom(attributeId(sub, i)),
                                atom(' '),
                                typeToGo(env, opts, item),
                            ]),
                        );
                    }),
                ),
        ),
    ]);
};
