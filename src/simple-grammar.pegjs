// A very simple one
File = s:(Define _)+ {return s.map(s => s[0])}
Statement = Define / Expression
Define = "(" _ "define" __ id:Identifier __ exp:Expression _ ")" {
	return {type: 'define', id, exp, location: location()}}

Expression = Literal / Lambda / Apply
Literal = Int / Identifier / Text

Lambda = "(" _ "lambda" __ "(" args:(Arg _)* ")" _ sts:(Expression _)+ ")" {
	return {type: 'lambda', args: args.map(i => i[0]), sts: sts.map(s => s[0])}
}
Arg = id:Identifier __ ":" __ type:Type {return {id, type}}

Type = LambdaType / Identifier
LambdaType = "(" _ types:(Type _)* _ ")" _ "=>" _ res:Type {
    return {type: 'lambda', args: types.map(t => t[0]), res}
}
Int "int"
	= _ [0-9]+ { return {type: 'int', value: parseInt(text(), 10), location: location()}; }
Text = "\"" ( "\\" . / [^"\\])+ "\"" {return {type: 'text', text: JSON.parse(text().replace('\n', '\\n')), location: location()}}
Identifier = [+/*0-9a-zA-Z_$&:?-]+ {return {type: "id", text: text(), location: location()}}
Apply = "(" terms:(Expression _)+ ")" {
	return {type: 'apply', terms: terms.map(m => m[0]), location: location()}}

_ "whitespace"
  = [ \t\n\r]*
__ "whitespace"
  = [ \t\n\r]+

