// Sipy ok

File = s:(Statement _)+ {return s.map(s => s[0])}

Statement = Define / Expression

Define = "(" _ "define" __ id:Identifier __ exp:Expression _ ")" {return {type: 'define', id, exp, location: location()}}

Lambda = "(" _ "lambda" __ "(" ids:(Identifier _)* ")" _ sts:(Statement _)+ ")" {
	return {type: 'lambda', ids: ids.map(i => i[0]), sts: sts.map(s => s[0])}
}

Expression = Type / Literal / Lambda / Apply / Vector / QQ / Quq



Literal = Text / Float / Int / QualId
Type = ":" __ t:Expression {return {type: 'type', contents: t}}

QQ = "`" inner:Expression {return {type: 'quasi-quote', inner, location: location()}}
Quq = "@" inner:Expression {return {type: 'quasi-unquote', inner, location: location()}}

QualId = top:Identifier rest:("." Identifier)* {return rest.length ? {type: 'qual', parts: [top].concat(rest.map(r => r[1]))} : top}

Int "int"
	= _ [0-9]+ { return {type: 'int', value: parseInt(text(), 10), location: location()}; }
Text = "\"" ( "\\" . / [^"\\])+ "\"" {return {type: 'text', text: JSON.parse(text().replace('\n', '\\n')), location: location()}}
Float "float" = _ [0-9]+ "." [0-9]+
Identifier = [+/*0-9a-zA-Z_$&:?-]+ {return {type: "id", text: text(), location: location()}}

Apply = "(" terms:(Expression _)+ ")" {return {type: 'apply', terms: terms.map(m => m[0]), location: location()}}
Vector = "[" terms:(Expression _)+ "]" {return {type: 'vector', terms: terms.map(m => m[0]), location: location()}}

_ "whitespace"
  = [ \t\n\r]*
__ "whitespace"
  = [ \t\n\r]+
