// Ok plan is:
// - produce a js file that `export default`s a map of `termName` to `glsl string`
// - and maybe that's all? then the harness HTML page can use https://github.com/patriciogonzalezvivo/glslCanvas
//   to make pretty pictures.
// - I would love to also validate the GLSL
//   ooh cool lets try https://github.com/alaingalvan/CrossShader
//   so I can catch errors, that would be awesome
// - https://github.com/evanw/glslx might also be interesting

export const fileToGlsl = (
    expressions: Array<Term>,
    env: Env,
    opts: OutputOptions,
    irOpts: IOutputOptions,
    assert: boolean,
    includeImport: boolean,
    builtinNames: Array<string>,
) => {
    const items = typeScriptPrelude(opts.scope, includeImport, builtinNames);

    Object.keys(env.global.effects).forEach((r) => {
        const id = idFromName(r);
        const constrs = env.global.effects[r];
        items.push(
            t.tsTypeAliasDeclaration(
                t.identifier('handle' + r),
                null,
                t.tsTupleType(
                    constrs.map((constr) =>
                        typeToAst(
                            env,
                            opts,
                            effectConstructorType(
                                env,
                                opts,
                                { type: 'ref', ref: { type: 'user', id } },
                                constr,
                                nullLocation,
                            ),
                        ),
                    ),
                ),
            ),
        );
    });

    Object.keys(env.global.types).forEach((r) => {
        const constr = env.global.types[r];
        const id = idFromName(r);
        if (constr.type === 'Enum') {
            const comment = printToString(enumToPretty(env, id, constr), 100);
            const refs = getEnumReferences(env, {
                type: 'ref',
                ref: { type: 'user', id },
                typeVbls: constr.typeVbls.map((t, i) => ({
                    type: 'var',
                    sym: { name: 'T', unique: t.unique },
                    location: null,
                })),
                location: null,
            });
            items.push(
                t.addComment(
                    t.tsTypeAliasDeclaration(
                        t.identifier(typeIdToString(id)),
                        constr.typeVbls.length
                            ? typeVblsToParameters(env, opts, constr.typeVbls)
                            : null,
                        t.tsUnionType(
                            refs.map((ref) =>
                                typeToAst(
                                    env,
                                    opts,
                                    typeFromTermType(env, opts, ref),
                                ),
                            ),
                        ),
                    ),
                    'leading',
                    comment,
                ),
            );
            return;
        }
        const subTypes = getAllSubTypes(env.global, constr);
        items.push(
            t.tsTypeAliasDeclaration(
                t.identifier(typeIdToString(id)),
                constr.typeVbls.length
                    ? typeVblsToParameters(env, opts, constr.typeVbls)
                    : null,
                t.tsTypeLiteral([
                    t.tsPropertySignature(
                        t.identifier('type'),
                        t.tsTypeAnnotation(
                            t.tsLiteralType(
                                t.stringLiteral(
                                    recordIdName(env, { type: 'user', id }),
                                ),
                            ),
                        ),
                    ),
                    ...constr.items.map((item, i) =>
                        recordMemberSignature(
                            env,
                            opts,
                            id,
                            i,
                            typeFromTermType(env, opts, item),
                        ),
                    ),
                    ...([] as Array<t.TSPropertySignature>).concat(
                        ...subTypes.map((id) =>
                            env.global.types[
                                idName(id)
                            ].items.map((item: Type, i: number) =>
                                recordMemberSignature(
                                    env,
                                    opts,
                                    id,
                                    i,
                                    typeFromTermType(env, opts, item),
                                ),
                            ),
                        ),
                    ),
                ]),
            ),
        );
    });

    const orderedTerms = expressionDeps(
        env,
        expressions.concat(
            Object.keys(env.global.exportedTerms).map((name) => ({
                type: 'ref',
                ref: {
                    type: 'user',
                    id: env.global.exportedTerms[name],
                },
                location: nullLocation,
                is: env.global.terms[idName(env.global.exportedTerms[name])].is,
            })),
        ),
    );

    // const irOpts = {
    // limitExecutionTime: opts.limitExecutionTime,
    // };

    // let unique = { current: 1000000 };
    const irTerms: { [idName: string]: Expr } = {};

    orderedTerms.forEach((idRaw) => {
        let term = env.global.terms[idRaw];
        // console.log(idRaw, env.global.idNames[idRaw]);

        const id = idFromName(idRaw);
        const senv = selfEnv(env, { type: 'Term', name: idRaw, ann: term.is });
        const comment = printToString(declarationToPretty(senv, id, term), 100);
        senv.local.unique.current = maxUnique(term) + 1;
        term = liftEffects(senv, term);
        // TODO: This is too easy to miss. Bake it in somewhere.
        // Maybe have a toplevel `ir.printTerm` that does the check?
        let irTerm = ir.printTerm(senv, irOpts, term);
        try {
            uniquesReallyAreUnique(irTerm);
        } catch (err) {
            const outer = new LocatedError(
                term.location,
                `Failed while typing ${idRaw} : ${env.global.idNames[idRaw]}`,
            ).wrap(err);
            //     .toString();
            // // console.error( outer);
            // // console.log(showLocation(term.location));
            throw outer;
        }
        if (opts.optimizeAggressive) {
            irTerm = optimizeAggressive(senv, irTerms, irTerm, id);
        }
        if (opts.optimize) {
            irTerm = optimizeDefine(senv, irTerm, id);
        }
        // uniquesReallyAreUnique(irTerm);
        // console.log('otho');
        irTerms[idRaw] = irTerm;
        items.push(
            declarationToTs(
                senv,
                opts,
                irOpts,
                idRaw,
                irTerm,
                term.is,
                '*\n```\n' + comment + '\n```\n',
            ),
        );
    });

    expressions.forEach((term) => {
        const comment = printToString(termToPretty(env, term), 100);
        if (assert && typesEqual(term.is, bool)) {
            term = wrapWithAssert(term);
        }
        term = liftEffects(env, term);
        const irTerm = ir.printTerm(env, irOpts, term);
        items.push(
            t.addComment(
                t.expressionStatement(
                    termToTs(env, opts, optimize(env, irTerm)),
                ),
                'leading',
                '\n' + comment + '\n',
            ),
        );
    });

    Object.keys(env.global.exportedTerms).forEach((name) => {
        items.push(
            t.exportNamedDeclaration(
                t.variableDeclaration('const', [
                    t.variableDeclarator(
                        t.identifier(name),
                        t.identifier(
                            'hash_' + idName(env.global.exportedTerms[name]),
                        ),
                    ),
                ]),
            ),
        );
    });

    const ast = t.file(t.program(items, [], 'script'));
    // TODO: port all of these to the IR optimizer, so that they work
    // across targets.
    // if (opts.optimize) {
    //     optimizeAST(ast);
    // }
    return ast;
};

export const maxUnique = (term: Term) => {
    let max = 0;
    walkTerm(term, (term) => {
        // hmm this just gets usages
        // which doesn't quite cut it
        if (term.type === 'var') {
            max = Math.max(max, term.sym.unique);
        }
        if (term.type === 'lambda') {
            term.args.forEach((arg) => {
                max = Math.max(max, arg.unique);
            });
        }
        if (term.type === 'Switch') {
            term.cases.forEach((kase) => {
                walkPattern(kase.pattern, (pattern) => {
                    if (pattern.type === 'Binding') {
                        max = Math.max(max, pattern.sym.unique);
                    }
                    if (pattern.type === 'Alias') {
                        max = Math.max(max, pattern.name.unique);
                    }
                });
            });
        }
    });
    return max;
};

export const reUnique = (unique: { current: number }, expr: Expr) => {
    const mapping: { [orig: number]: number } = {};
    const addSym = (sym: Symbol) => {
        if (sym.unique === handlerSym.unique) {
            mapping[sym.unique] = sym.unique;
            return sym;
        }
        mapping[sym.unique] = unique.current++;
        return { ...sym, unique: mapping[sym.unique] };
    };
    const getSym = (sym: Symbol): Symbol => ({
        ...sym,
        unique: mapping[sym.unique],
    });
    return transformExpr(expr, {
        ...defaultVisitor,
        stmt: (value) => {
            if (value.type === 'Define') {
                return { ...value, sym: addSym(value.sym) };
            }
            if (value.type === 'Assign') {
                return { ...value, sym: getSym(value.sym) };
            }
            return null;
        },
        expr: (value) => {
            switch (value.type) {
                case 'handle':
                    return {
                        ...value,
                        cases: value.cases.map((kase) => ({
                            ...kase,
                            args: kase.args.map((arg) => ({
                                ...arg,
                                sym: addSym(arg.sym),
                            })),
                            k: { ...kase.k, sym: addSym(kase.k.sym) },
                        })),
                        pure: { ...value.pure, arg: addSym(value.pure.arg) },
                    };
                case 'lambda':
                    return {
                        ...value,
                        args: value.args.map((arg) => ({
                            ...arg,
                            sym: addSym(arg.sym),
                        })),
                    };
                case 'var':
                    return { ...value, sym: getSym(value.sym) };
            }
            return null;
        },
    });
};
