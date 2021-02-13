
/*

uh should I just go with literally babel?
like, use their parse tree already?
erm I'm pretty sure yeah there are some
type signature things that definitely wouldn't work.

ok nvm, no go. would be cool though.

*/

File = _ s:(Toplevel _)+ {return s.map(s => s[0])}

Toplevel = Const / Effect

Const = "const" __ id:Identifier __ "=" __ expr:Expression {return {type: 'define', id, expr}}

Effect = "effect" __ id:Identifier __ "{" _ constrs:(EfConstr _ "," _)+ "}"

EfConstr = id:Identifier _ ":" _ LambdaType

Expression = first:Binsub rest:(_ binop _ Binsub)* {
    if (rest.length) {
        return {type: 'ops', first, rest: rest.map(r => ({op: r[1], right: r[3]}))}
    } else {
        return first
    }
}
Binsub = Literal / Lambda / Handle / Raise / Apply / Block

Block = "{" one:Toplevel rest:(_ ";" _ Toplevel)* ";"? "}" {
    return {type: 'block', items: [one, ...rest.map(r => r[3])]}
}

Raise = "raise!" _ "(" name:Identifier "." constr:Identifier _ "(" args:CommaExpr? ")" _ ")" {return {type: 'raise', name, constr, args}}

Handle = "handle!" _ target:Expression _ "{" _ cases:Case+ _ "}" {return {type: 'handle', target, cases}}

Case = name:Identifier "." constr:Identifier _ "(" _ "(" _ args:CommaPat? _ ")" _ "=>" _ k:Identifier _ ")" _ "=>" _ body:Expression _ "," {
	return {type: 'case', name, constr, args, k, body}
}
Pat = Identifier
CommaPat = first:Pat rest:(_ "," _ Pat)* {return [first, ...rest.map(r => r[3])]}

CommaExpr = first:Expression rest:(_ "," _ Expression)* {return [first, ...rest.map(r => r[3])]}

Lambda = "(" _ args:Args? _ ")" _ "=>" _ Expression
Args = Arg (_ "," _ Arg)*
Arg = id:Identifier _ t:(":" _ Type)?

binop = "+" / "-" / "*" / "/" / "^" / "|"

Literal = Int / Identifier / Text

Binop = Expression


Type = LambdaType / Identifier
CommaType = first:Type rest:(_ "," _ Type)* {return [first, ...rest.map(r => r[3])]}
LambdaType = "(" _ args:CommaType? _ ")" _ "=>" _ res:Type { return {type: 'lambda', args, res} }
Int "int"
	= _ [0-9]+ { return {type: 'int', value: parseInt(text(), 10), location: location()}; }
Text = "\"" ( "\\" . / [^"\\])+ "\"" {return {type: 'text', text: JSON.parse(text().replace('\n', '\\n')), location: location()}}
Identifier = [0-9a-zA-Z_]+ {return {type: "id", text: text(), location: location()}}
Apply = "(" terms:(Expression _)+ ")" {
	return {type: 'apply', terms: terms.map(m => m[0]), location: location()}}


_ "whitespace"
  = [ \t\n\r]*
__ "whitespace"
  = [ \t\n\r]+
