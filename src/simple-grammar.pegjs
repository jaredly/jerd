// A very simple one
File = s:(Define _)+ {return s.map(s => s[0])}
Statement = Define / Expression
Define = "(" _ "define" __ id:Identifier __ exp:Expression _ ")" {
	return {type: 'define', id, exp, location: location()}}
Expression = Type / Literal / Apply
Literal = Int / Identifier
Type = ":" __ t:Expression {return {type: 'type', contents: t}}
Int "int"
	= _ [0-9]+ { return {type: 'int', value: parseInt(text(), 10), location: location()}; }
Identifier = [+/*0-9a-zA-Z_$&:?-]+ {return {type: "id", text: text(), location: location()}}
Apply = "(" terms:(Expression _)+ ")" {
	return {type: 'apply', terms: terms.map(m => m[0]), location: location()}}

_ "whitespace"
  = [ \t\n\r]*
__ "whitespace"
  = [ \t\n\r]+

