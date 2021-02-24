
/*

uh should I just go with literally babel?
like, use their parse tree already?
erm I'm pretty sure yeah there are some
type signature things that definitely wouldn't work.

ok nvm, no go. would be cool though.

*/

File = _ s:(Toplevel _)+ {return s.map(s => s[0])}

Toplevel = Effect / Statement

Statement = Define / Expression

Define = "const" __ id:Identifier ann:(_ ":" _ Type)? __ "=" __ expr:Expression {return {
    type: 'define', id, expr, ann: ann ? ann[3] : null}}

Effect = "effect" __ id:Identifier __ "{" _ constrs:(EfConstr _ "," _)+ "}" {return {type: 'effect', id, constrs: constrs.map(c => c[0])}}

EfConstr = id:Identifier _ ":" _ type:LambdaType {return {id, type}}

Expression = first:Binsub rest:(__ binop __ Binsub)* {
    if (rest.length) {
        return {type: 'ops', first, rest: rest.map(r => ({op: r[1], right: r[3]}))}
    } else {
        return first
    }
}
Binsub = sub:Apsub args:(TypeVblsApply?  "(" _ CommaExpr? _ ")")* {
	if (args.length) {
        return {type: 'apply', target: sub,
        args: args.map(a => ({
            typevbls: a[0] || [],
            args: a[3] || [],
        })),
        location: location()}
    } else {
    	return sub
    }
}
Apsub = Block / Lambda / Handle / Raise / If / Literal

Block = "{" _ one:Statement rest:(_ ";" _ Statement)* ";"? _ "}" {
    return {type: 'block', items: [one, ...rest.map(r => r[3])]}
}

If = "if" __ cond:Expression _ yes:Block no:(_ "else" _ Block)? {
    return {type: 'If', cond, yes, no: no ? no[3] : null}
}

Raise = "raise!" _ "(" name:Identifier "." constr:Identifier _ "(" args:CommaExpr? ")" _ ")" {return {type: 'raise', name, constr, args: args || []}}

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
	return {type: 'case', name, constr, args: args || [], k, body}
}
Pat = Identifier
CommaPat = first:Pat rest:(_ "," _ Pat)* {return [first, ...rest.map(r => r[3])]}

CommaExpr = first:Expression rest:(_ "," _ Expression)* {return [first, ...rest.map(r => r[3])]}

Lambda = typevbls:TypeVbls? effvbls:EffectVbls? "(" _ args:Args? _ ")" _ rettype:(":" _ Type _)?
    "=" effects:("{" _ CommaEffects? _ "}")? ">" _ body:Expression {return {
    type: 'lambda',
    typevbls: typevbls || [],
    effects: effects ? effects[2] || [] : null,
    effvbls: effvbls || [],
    args: args || [],
    rettype: rettype ? rettype[2] : null,
    body,
}}
Args = first:Arg rest:(_ "," _ Arg)* {return [first, ...rest.map(r => r[3])]}
Arg = id:Identifier _ type:(":" _ Type)? {return {id, type: type ? type[2] : null}}

TypeVbls = "<" _ first:Identifier rest:(_ "," _ Identifier)* _ ","? _ ">" {
    return [first, ...rest.map(r => r[3])]
}
EffectVbls = "{" _  inner:EffectVbls_? _ "}" { return inner || [] }
EffectVbls_ = first:Identifier rest:(_ "," _ Identifier)* _ ","? {
    return [first, ...rest.map(r => r[3])]
}

binop = "++" / "+" / "-" / "*" / "/" / "^" / "|" / "<" / ">" / "<=" / ">=" / "=="

Binop = Expression

// ==== Types ====

Type = LambdaType / Identifier
CommaType = first:Type rest:(_ "," _ Type)* {return [first, ...rest.map(r => r[3])]}
TypeVblsApply = "<" _ inner:CommaType _ ">" {return inner}

LambdaType = typevbls:TypeVbls? effvbls:EffectVbls? "(" _ args:CommaType? _ ")" _ "="
    effects:("{" _ CommaEffects? _ "}")?
">" _ res:Type { return {
    type: 'lambda',
    args: args || [],
    typevbls: typevbls || [],
    effvbls: effvbls || [],
    effects: effects ? effects[2] || [] : [] , res} }
CommaEffects =
    first:Identifier rest:(_ "," _ Identifier)* {return [first, ...rest.map(r => r[3])]}




// ==== Literals ====

Literal = Int / Identifier / String

// IdentifierWithType = id:Identifier vbls:TypeVblsApply? {
//     return vbls ? {type: 'IdentifierWithType', id, vbls: vbls} : id
// }

Int "int"
	= _ [0-9]+ { return {type: 'int', value: parseInt(text(), 10), location: location()}; }
String = "\"" ( "\\" . / [^"\\])+ "\"" {return {type: 'string', text: JSON.parse(text().replace('\n', '\\n')), location: location()}}
Identifier = [0-9a-zA-Z_]+ {return {type: "id", text: text(), location: location()}}

_ "whitespace"
  = [ \t\n\r]* (comment _)*
__ "whitespace"
  = [ \t\n\r]+ (comment _)*
comment = multiLineComment / lineComment
multiLineComment = "/*" (!"*/" .)* "*/"
lineComment = "//" (!"\n" .)* "\n"