import { parse } from './grammar';

export type Toplevel = Define | Effect | Expression | StructDef;

export type StructDef = {
    type: 'StructDef';
    id: Identifier;
    effects: Array<Identifier>;
    vbls: Array<TypeVbl>;
    decl: TypeDecl;
};

export type TypeDecl = RecordDecl;

export type RecordDecl = {
    type: 'Record';
    items: Array<RecordSpread | RecordItem>;
};
export type RecordSpread = { type: 'Spread'; constr: TypeConstr };
export type RecordItem = { type: 'Row'; id: Identifier; rtype: Type };

export type TypeVbl = {
    id: Identifier;
    kind: Kind | null;
};
export type Kind = Array<{ type: 'star' } | Kind>;

export type Effect = {
    type: 'effect';
    // TODO type variables!
    id: Identifier;
    constrs: Array<{ id: Identifier; type: LambdaType }>;
};

export type Loc = { offset: number; line: number; column: number };
export type Location = { start: Loc; end: Loc };
export type Statement = Define | Expression;
export type Define = {
    type: 'define';
    id: Identifier;
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

export type Expression =
    | Literal
    | Apply
    | Lambda
    | Raise
    | Ops
    | Block
    | Handle;
export type Ops = {
    type: 'ops';
    first: Expression;
    rest: Array<{ op: string; right: Expression }>;
};
export type Block = { type: 'block'; items: Array<Expression> };

export type Raise = {
    type: 'raise';
    name: Identifier;
    constr: Identifier;
    args: Array<Expression>;
};
export type Handle = {
    type: 'handle';
    target: Expression;
    cases: Array<{
        type: 'case';
        name: Identifier;
        constr: Identifier;
        args: Array<Identifier>;
        k: Identifier;
        body: Expression;
    }>;
    pure: {
        arg: Identifier;
        body: Expression;
    };
};
export type Lambda = {
    type: 'lambda';
    args: Array<{ id: Identifier; type: null }>;
    rettype: Type | null;
    body: Expression;
};
export type Type = TypeConstr | LambdaType;

export type TypeConstr = {
    id: Identifier;
    effects: Array<Identifier>;
    args: Array<Type>;
};

export type LambdaType = {
    type: 'lambda';
    args: Array<Type>;
    effects: Array<Identifier>;
    res: Type;
};
// {
//     type: 'type';
//     contents: Expression;
// };
export type Literal = Int | Identifier | String;
export type Identifier = { type: 'id'; text: string; location: Location };
export type Int = { type: 'int'; value: number; location: Location };
export type String = { type: 'string'; text: string; location: Location };
export type Apply = {
    type: 'apply';
    target: Expression;
    args: Array<Array<Expression>>;
    location: { start: Loc; end: Loc };
};

export default (raw: string): Array<Toplevel> => parse(raw);
