import * as t from '@babel/types';
import babel from '@babel/core';
import fs from 'fs';

const [_, __, inFile, outFile] = process.argv;
const ast = babel.parse(fs.readFileSync(inFile, 'utf8'), {
    filename: inFile,
    presets: ['@babel/preset-typescript'],
});
if (!ast) {
    throw new Error(`unable to parse`);
}
const body = ast.type === 'File' ? ast.program.body : ast.body;

const types: { [key: string]: t.TSType } = {};

body.forEach((stmt) => {
    if (
        stmt.type === 'ExportNamedDeclaration' &&
        stmt.declaration &&
        stmt.declaration.type === 'TSTypeAliasDeclaration'
    ) {
        // console.log(stmt.declaration.id.name);
        types[stmt.declaration.id.name] = stmt.declaration.typeAnnotation;
    }
});

const visitorTypes = ['Term', 'Pattern', 'Let', 'ToplevelT', 'Type'];
/*
Ok, so general plan:
make a `transform{X}` function, that does `(value: X, visitor: Visitor<Ctx>, ctx: Ctx) => X`
I'll deal with X => Array<X> later.
Interally, this does
{
    const transformed = visitor.${x}(value, ctx)
    if (transformed === false) {
        return value
    }
    if (transformed != null) {
        if (Array.isArray(transformed)) {
            ctx = transformed[1]
            if (transformed[0] != null) {
                value = transformed[0]
            }
        } else {
            value = transformed
        }
    }
}
yeah I should just do string concat
*/

const getAllUnionTypeMembers = (
    allTypes: Array<[string, t.TSTypeLiteral]>,
    t: t.TSType,
) => {
    if (t.type === 'TSTypeLiteral') {
        const names = t.members
            .map((t) =>
                t.type === 'TSPropertySignature' &&
                t.key.type === 'Identifier' &&
                t.key.name === 'type' &&
                t.typeAnnotation &&
                t.typeAnnotation.typeAnnotation.type === 'TSLiteralType' &&
                t.typeAnnotation.typeAnnotation.literal.type === 'StringLiteral'
                    ? t.typeAnnotation.typeAnnotation.literal.value
                    : null,
            )
            .filter(Boolean) as Array<string>;
        if (names.length === 1) {
            allTypes.push([names[0], t]);
        } else {
            console.log(JSON.stringify(t));
            throw new Error(`no 'type' for type`);
        }
        return;
    }
    if (t.type === 'TSUnionType') {
        t.types.forEach((t) => getAllUnionTypeMembers(allTypes, t));
        return;
    }
    if (t.type === 'TSTypeReference' && t.typeName.type === 'Identifier') {
        if (types[t.typeName.name]) {
            getAllUnionTypeMembers(allTypes, types[t.typeName.name]);
            return;
        }
    }
    console.log(JSON.stringify(t));
    throw new Error(`Unexpected type ${t.type}`);
};

const makeIndividualTransformer = (
    vbl: string,
    newName: string,
    type: t.TSType,
    optional?: null | boolean,
): string | null => {
    if (optional) {
        const inner = makeIndividualTransformer(
            vbl,
            newName + '$$',
            type,
            false,
        );
        if (!inner) {
            return null;
        }
        return `
        let ${newName} = undefined;
        if (${vbl} != null) {
            ${inner}
            ${newName} = ${newName}$$;
        }
        `;
    }
    if (type.type === 'TSTypeReference') {
        if (type.typeName.type !== 'Identifier') {
            throw new Error(`qualified?`);
        }
        if (visitorTypes.includes(type.typeName.name)) {
            return `
                const ${newName} = transform${type.typeName.name}(${vbl}, visitor, ctx);
                changed = changed || ${newName} !== ${vbl}`;
        }
        if (type.typeName.name === 'Array') {
            const inner = makeIndividualTransformer(
                `${newName}$item`,
                'result',
                type.typeParameters!.params[0],
            );
            if (inner) {
                return `
                    const ${newName} = ${vbl}.map((${newName}$item) => {
                        ${inner}
                        return result
                    })
                `;
            }
        }
        // OTHERWISE: if this type eventually includes a thing that needs changing,
        // it'll be quite a hassle.
    }
    if (type.type === 'TSArrayType') {
        const inner = makeIndividualTransformer(
            `${newName}$item`,
            'result',
            type.elementType,
        );
        if (inner) {
            return `
                const ${newName} = ${vbl}.map((${newName}$item) => {
                    ${inner}
                    return result
                })
            `;
        }
    }
    return null;
};

const makeTransformer = (name: string) => {
    const defn = types[name];
    if (!defn) {
        throw new Error(`Not a type ${name}`);
    }
    const allTypes: Array<[string, t.TSTypeLiteral]> = [];
    getAllUnionTypeMembers(allTypes, defn);
    const individualCases = allTypes.map(([name, defn]) => {
        const transformers: Array<string> = [];
        const sliders: Array<string> = [];
        defn.members.forEach((member) => {
            if (member.type !== 'TSPropertySignature') {
                throw new Error(`Can't process a ${member.type}`);
            }
            if (member.key.type !== 'Identifier') {
                throw new Error(`unexpected key ${member.key.type}`);
            }
            if (!member.typeAnnotation) {
                throw new Error(`No annotation`);
            }
            // if (name === 'apply') {
            //     console.log(
            //         member.key.name,
            //         member.typeAnnotation.typeAnnotation,
            //     );
            // }
            const newName = `node$${member.key.name}`;
            const individual = makeIndividualTransformer(
                `node.${member.key.name}`,
                newName,
                member.typeAnnotation.typeAnnotation,
                member.optional,
            );
            if (individual) {
                transformers.push(individual);
                sliders.push(`${member.key.name}: ${newName}`);
            }
        });
        if (!transformers.length) {
            return `case '${name}': break;`;
        }
        return `case '${name}': {
                let changed = false;
                ${transformers.join(';\n\n                ')}
                node = changed ? {...node, ${sliders.join(', ')}} : node;
                break;
            }`;
    });
    return `const transform${name} = <Ctx>(node: ${name}, visitor: Visitor<Ctx>, ctx: Ctx): ${name} => {
        if (!node) {
            throw new Error('No ${name} provided');
        }
        const transformed = visitor.${name} ? visitor.${name}(node, ctx) : null;
        if (transformed === false) {
            return node;
        }
        if (transformed != null) {
            if (Array.isArray(transformed)) {
                ctx = transformed[1];
                if (transformed[0] != null) {
                    node = transformed[0];
                }
            } else {
                node = transformed;
            }
        }
        switch (node.type) {
            ${individualCases.join('\n\n            ')}
        }
        // TODO: HERE do the post-traversal
        if (visitor.${name}Post) {
            const transformed = visitor.${name}Post(node, ctx);
            if (transformed != null) {
                node = transformed;
            }
        }
        return node;
    }`;
};

const prelude = `import {${visitorTypes.join(', ')}} from './types';

export type Visitor<Ctx> = {
    ${visitorTypes
        .map(
            (name) =>
                `${name}?: (node: ${name}, ctx: Ctx) => null | false | ${name} | [${name}, Ctx]
                ${name}Post?: (node: ${name}, ctx: Ctx) => null | ${name}`,
        )
        .join(',\n    ')}
}
`;
fs.writeFileSync(
    outFile,
    prelude + visitorTypes.map(makeTransformer).join('\n\n'),
);
