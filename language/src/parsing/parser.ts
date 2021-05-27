import { parse } from './grammar';

export type Toplevel =
    | Define
    | Effect
    | Expression
    | StructDef
    | EnumDef
    | Decorated;

export type Decorated = {
    type: 'Decorated';
    location: Location;
    wrapped: Toplevel;
    decorators: Array<Decorator>;
};

export type DecoratedExpression = {
    type: 'Decorated';
    location: Location;
    wrapped: Expression;
    decorators: Array<Decorator>;
};

export type Decorator = {
    type: 'Decorator';
    id: Identifier;
    args: Array<Expression>;
};

export type Effect = {
    type: 'effect';
    // TODO type variables!
    id: Identifier;
    location: Location;
    constrs: Array<{ id: Identifier; type: LambdaType }>;
};

export type StructDef = {
    type: 'StructDef';
    location: Location;
    id: Identifier;
    typeVbls: Array<TypeVbl>;
    decl: TypeDecl;
};

export type EnumDef = {
    type: 'EnumDef';
    id: Identifier;
    location: Location;
    typeVbls: Array<TypeVbl>;
    items: Array<EnumItem>;
};
export type EnumItem = EnumExternal | EnumSpread;
export type EnumExternal = {
    type: 'External';
    ref: TypeRef;
};
export type EnumSpread = {
    type: 'Spread';
    ref: TypeRef;
    location: Location;
};

export type TypeDecl = RecordDecl;

export type RecordDecl = {
    type: 'Record';
    location: Location;
    items: Array<RecordItem>;
};
export type RecordItem = RecordRow | RecordSpread;
export type RecordSpread = { type: 'Spread'; constr: Identifier };
export type RecordRow = {
    type: 'Row';
    // null if this is being treated as a tuple
    id: string;
    rtype: Type;
};

export type Loc = { offset: number; line: number; column: number };
export type Location = { start: Loc; end: Loc };
export const nullLocation = {
    start: { offset: 0, line: 0, column: 0 },
    end: { offset: 0, line: 0, column: 0 },
};
export type Statement = Define | Expression;
export type Define = {
    type: 'define';
    rec: boolean;
    id: Identifier;
    location: Location;
    expr: Expression;
    ann: Type | null;
};
// export type Deffect = {
//     type: 'deffect';
//     id: Identifier;
//     constrs: Array<{ id: Identifier; type: Type }>;
// };
// export type Deftype = Defenum | Defstruct;
// export type Defstruct = {
//     type: 'defstruct';
//     id: Identifier;
//     attrs: Array<{ id: Identifier; type: Type }>;
// };
// export type Defenum = {
//     type: 'defenum';
//     id: Identifier;
//     attrs: Array<{ id: Identifier; args: Array<Type> }>;
// };

export type Unary = {
    type: 'Unary';
    op: string;
    inner: Expression;
    location: Location;
};

export type Expression =
    | Literal
    | WithSuffix
    | Unary
    | DecoratedExpression
    | Lambda
    | Raise
    | Ops
    | If
    | Switch
    | Block
    | Record
    | Enum
    | ArrayLiteral
    | TupleLiteral
    | Handle;

export type TupleLiteral = {
    type: 'Tuple';
    location: Location;
    items: Array<Expression>;
};
export type ArrayLiteral = {
    type: 'Array';
    location: Location;
    ann: Type | null;
    items: Array<Expression | ArraySpread>;
};
export type ArraySpread = {
    type: 'ArraySpread';
    value: Expression;
    location: Location;
};

export type Enum = {
    type: 'Enum';
    id: Identifier;
    typeVbls: Array<Type>;
    expr: Expression;
    location: Location;
};

export type Record = {
    type: 'Record';
    // spreads: Array<Expression>;
    id: Identifier;
    location: Location;
    typeVbls: Array<Type>;
    // hmmmmm
    // So, record labels might be coming
    // from different sources
    // but maybe I don't worry about that just yet?
    rows: Array<
        | { type: 'Row'; id: Identifier; value: Expression }
        | { type: 'Spread'; value: Expression }
    >;
};

export type Ops = {
    type: 'ops';
    first: Expression;
    location: Location;
    rest: Array<{
        op: string;
        id: Identifier | null;
        right: Expression;
        location: Location;
    }>;
};
export type Block = {
    type: 'block';
    items: Array<Statement>;
    location: Location;
};

export type If = {
    type: 'If';
    cond: Expression;
    yes: Block;
    no: Block;
    location: Location;
};

// Switches!!
export type Switch = {
    type: 'Switch';
    expr: Expression;
    cases: Array<SwitchCase>;
    location: Location;
};

export type SwitchCase = {
    pattern: Pattern;
    body: Expression;
    location: Location;
};
export type Pattern =
    | AliasPattern
    | Literal
    | RecordPattern
    | ArrayPattern
    | TuplePattern;
export type AliasPattern = {
    type: 'Alias';
    name: Identifier;
    inner: Pattern;
    location: Location;
};
export type RecordPattern = {
    type: 'Record';
    id: Identifier;
    items: Array<RecordPatternItem>;
    location: Location;
};
export type RecordPatternItem = {
    id: Identifier;
    pattern: Pattern | null;
    location: Location;
};

export type TuplePattern = {
    type: 'Tuple';
    items: Array<Pattern>;
    location: Location;
};
export type ArrayPattern = {
    type: 'Array';
    items: Array<ArrayPatternSpread | Pattern>;
    location: Location;
};
export type ArrayPatternSpread = {
    type: 'Spread';
    inner: Pattern;
    location: Location;
};

// Effect things
export type Raise = {
    type: 'raise';
    name: Identifier;
    constr: Identifier;
    args: Array<Expression>;
    location: Location;
};
export type Handle = {
    type: 'handle';
    target: Expression;
    location: Location;
    cases: Array<{
        type: 'case';
        location: Location;
        name: Identifier;
        constr: Identifier;
        args: Array<Identifier> | null;
        k: Identifier;
        body: Expression;
    }>;
    pure: {
        arg: Identifier;
        body: Expression;
    };
};
export type TypeVbl = { id: Identifier; subTypes: Array<Identifier> };
export type Lambda = {
    type: 'lambda';
    location: Location;
    typevbls: Array<TypeVbl>;
    effvbls: Array<Identifier>;
    effects: null | Array<Identifier>;
    args: Array<{ id: Identifier; type: Type }>;
    rettype: Type | null;
    body: Expression;
};
export type Type = TypeRef | LambdaType;
export type TypeRef = {
    type: 'TypeRef';
    id: Identifier;
    typeVbls: Array<Type> | null;
    // effectVbls: Array<Identifier> | null;
    location: Location;
};
export type LambdaType = {
    type: 'lambda';
    args: Array<Type>;
    effects: Array<Identifier>;
    effvbls: Array<Identifier>;
    typevbls: Array<TypeVbl>;
    res: Type;
    location: Location;
};

export type Literal = Float | Int | Identifier | String | Boolean;
// export type IdentifierWithType = {
//     type: 'IdentifierWithType';
//     id: Identifier;
//     vbls: Array<Type>;
// };
export type Identifier = {
    type: 'id';
    text: string;
    location: Location;
    hash: string | null;
};
export type Float = { type: 'float'; value: number; location: Location };
export type Int = { type: 'int'; value: number; location: Location };
export type String = { type: 'string'; text: string; location: Location };
export type Boolean = { type: 'boolean'; value: boolean; location: Location };
export type WithSuffix = {
    type: 'WithSuffix';
    target: Expression;
    suffixes: Array<ApplySuffix | AttributeSuffix | IndexSuffix | AsSuffix>;
    location: { start: Loc; end: Loc };
};
export type ApplySuffix = {
    type: 'Apply';
    args: Array<Expression>;
    typevbls: Array<Type>;
    effectVbls: Array<Identifier>;
};
export type AsSuffix = {
    type: 'As';
    hash: string | null;
    t: TypeRef;
    location: Location;
};
export type AttributeSuffix = {
    type: 'Attribute';
    id: Identifier;
    location: Location;
};
export type IndexSuffix = {
    type: 'Index';
    location: Location;
    slices: Array<Expression | Slice>;
};
export type Slice = {
    type: 'Slice';
    left: Expression | null;
    right: Expression | null;
};

export default (raw: string): Array<Toplevel> => parse(raw);
export const parseType = (raw: string): Type => {
    const parsed: Array<Toplevel> = parse(`const thing: ${raw} = 1`);
    if (parsed.length !== 1) {
        throw new Error(`multiple toplevels`);
    }
    if (parsed[0].type !== 'define') {
        throw new Error(`nor a define`);
    }
    if (!parsed[0].ann) {
        throw new Error(`no type annotation`);
    }
    return parsed[0].ann;
};
