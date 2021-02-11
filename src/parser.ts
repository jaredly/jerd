import { parse } from './simple-grammar';

export type Loc = { offset: number; line: number; column: number };
export type Location = { start: Loc; end: Loc };
export type Statement = Define | Expression;
export type Define = {
    type: 'define';
    id: Identifier;
    exp: Expression;
    location: Location;
};
export type Expression = Literal | Apply | Lambda;
export type Lambda = {
    type: 'lambda';
    args: Array<{ id: Identifier; type: Type }>;
    sts: Array<Expression>;
};
export type Type = Identifier | LambdaType;
export type LambdaType = {
    type: 'lambda';
    args: Array<Type>;
    res: Type;
};
// {
//     type: 'type';
//     contents: Expression;
// };
export type Literal = Int | Identifier | Text;
export type Identifier = { type: 'id'; text: string; location: Location };
export type Int = { type: 'int'; value: number; location: Location };
export type Text = { type: 'text'; text: string; location: Location };
export type Apply = { type: 'apply'; terms: Array<Expression> };

export default (raw: string): Array<Define> => parse(raw);
