// A very simple one
File = _ s:(Toplevel _)+ {return s.map(s => s[0])}
Toplevel = Define / Deftype / Deffect
Statement = Define / Expression
Define = "(" _ "define" __ id:Identifier __ exp:Expression _ ")" {
	return {type: 'define', id, exp, location: location()}}
Deftype = Defstruct / Defenum
Defstruct = "(" _ "defstruct" __ id:Identifier _
    attrs:( "(" _ tid:Identifier __ t:Type _ ")" _ )+
    _ ")" {
	return {type: 'destruct', id, attrs: attrs.map(a => ({id: a[2], type: a[4]})), location: location()}}
Defenum = "(" _ "defenum" __ id:Identifier _
    attrs:( Enum _ )+
    _ ")" {
	return {type: 'defenum', id, attrs: attrs.map(a => a[0]), location: location()}}
Enum = "(" _ id:Identifier _ args:(Type _)* ")" { return {id, args: args.map(a => a[0])} }
Deffect = "(" _ "deffect" __ id:Identifier _
    constrs:( "(" _ tid:Identifier _ Type ")" _ )+
    _ ")" {
	return {type: 'deffect', id, constrs: constrs.map(a => ({id: a[2], type: a[4]})), location: location()}}

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
Identifier = !"=>" [+/*0-9a-zA-Z_$&:?-]+ {return {type: "id", text: text(), location: location()}}
Apply = "(" terms:(Expression _)+ ")" {
	return {type: 'apply', terms: terms.map(m => m[0]), location: location()}}

_ "whitespace"
  = [ \t\n\r]*
__ "whitespace"
  = [ \t\n\r]+

