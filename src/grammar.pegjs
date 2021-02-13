
/*

uh should I just go with literally babel?
like, use their parse tree already?
erm I'm pretty sure yeah there are some
type signature things that definitely wouldn't work.

ok nvm, no go. would be cool though.

*/

File = _ s:(Toplevel _)+ {return s.map(s => s[0])}

Toplevel = Define / Effect / Expression

Define = "const" __ id:Identifier __ "=" __ expr:Expression {return {type: 'define', id, expr}}

Effect = "effect" __ id:Identifier __ "{" _ constrs:(EfConstr _ "," _)+ "}" {return {type: 'effect', id, constrs: constrs.map(c => c[0])}}

EfConstr = id:Identifier _ ":" _ type:LambdaType {return {id, type}}

Expression = first:Binsub rest:(_ binop _ Binsub)* {
    if (rest.length) {
        return {type: 'ops', first, rest: rest.map(r => ({op: r[1], right: r[3]}))}
    } else {
        return first
    }
}
Binsub = sub:Apsub args:("(" _ CommaExpr? _ ")")* {
	if (args.length) {
    	return {type: 'apply', target: sub, args: args.map(a => a[2])}
    } else {
    	return sub
    }
}
Apsub = Block / Lambda / Handle / Raise / Literal

// TODO: Allow 'const' declarations n stuff in a block
Block = "{" _ one:Expression rest:(_ ";" _ Expression)* ";"? _ "}" {
    return {type: 'block', items: [one, ...rest.map(r => r[3])]}
}

Raise = "raise!" _ "(" name:Identifier "." constr:Identifier _ "(" args:CommaExpr? ")" _ ")" {return {type: 'raise', name, constr, args}}

Handle = "handle!" _ target:Expression _ "{" _
cases:(Case _)+ _
"pure" _ "(" _ pureId:Identifier _ ")" _ "=>" _ pureBody:Expression _
"}" {return {
    type: 'handle',
    target,
    cases: cases.map(c => c[0]),
    pure: {arg: pureId, body: pureBody},
    }}

Case = name:Identifier "." constr:Identifier _ "(" _ "(" _ args:CommaPat? _ ")" _ "=>" _ k:Identifier _ ")" _ "=>" _ body:Expression _ "," {
	return {type: 'case', name, constr, args, k, body}
}
Pat = Identifier
CommaPat = first:Pat rest:(_ "," _ Pat)* {return [first, ...rest.map(r => r[3])]}

CommaExpr = first:Expression rest:(_ "," _ Expression)* {return [first, ...rest.map(r => r[3])]}

Lambda = "(" _ args:Args? _ ")" _ "=>" _ body:Expression {return {type: 'lambda', args, body}}
Args = first:Arg rest:(_ "," _ Arg)* {return [first, ...rest.map(r => r[3])]}
Arg = id:Identifier _ type:(":" _ Type)? {return {id, type: type ? type[2] : null}}

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

_ "whitespace"
  = [ \t\n\r]*
__ "whitespace"
  = [ \t\n\r]+
