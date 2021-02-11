// um what now

// we want to parse things I guess?

import hash from 'hash-sum';
import {parse} from './simple-grammar'

// ok gonna do some pegjs I think for parsin

// type File = 
type Loc = {offset: number, line: number, column: number}
type Location = {start: Loc, end: Loc}
type Statement = Define | Expression
type Define = {type: 'define', id: Identifier, exp: XPathExpression, location: Location}
type Expression = Type | Literal | Apply
type Type = {
    type: 'type',
    contents: Expression
}
type Literal