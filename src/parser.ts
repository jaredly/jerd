import { parse } from './grammar';

export type Toplevel = Define | Effect | Expression;

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
    | If
    | Block
    | Handle;
export type Ops = {
    type: 'ops';
    first: Expression;
    rest: Array<{ op: string; right: Expression }>;
};
export type Block = { type: 'block'; items: Array<Statement> };

export type If = { type: 'If'; cond: Expression; yes: Block; no: Block };

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
        args: Array<Identifier> | null;
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
    typevbls: Array<Identifier>;
    effvbls: Array<Identifier>;
    effects: null | Array<Identifier>;
    args: Array<{ id: Identifier; type: Type }>;
    rettype: Type | null;
    body: Expression;
};
export type Type = Identifier | LambdaType;
export type LambdaType = {
    type: 'lambda';
    args: Array<Type>;
    effects: Array<Identifier>;
    effvbls: Array<Identifier>;
    typevbls: Array<Identifier>;
    res: Type;
};

export type Literal = Int | Identifier | String;
// export type IdentifierWithType = {
//     type: 'IdentifierWithType';
//     id: Identifier;
//     vbls: Array<Type>;
// };
export type Identifier = { type: 'id'; text: string; location: Location };
export type Int = { type: 'int'; value: number; location: Location };
export type String = { type: 'string'; text: string; location: Location };
export type Apply = {
    type: 'apply';
    target: Expression;
    args: Array<{ args: Array<Expression>; typevbls: Array<Identifier> }>;
    location: { start: Loc; end: Loc };
};

export default (raw: string): Array<Toplevel> => parse(raw);
