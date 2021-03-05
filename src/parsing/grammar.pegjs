
File = _ s:(Toplevel _)+ finalLineComment? {return s.map(s => s[0])}

Toplevel = TypeDef / Effect / Statement

Statement = Define / Expression









// Toplevels

Define = "const" __ id:Identifier ann:(_ ":" _ Type)? __ "=" __ expr:Expression {return {
    type: 'define', id, expr, ann: ann ? ann[3] : null, location: location()}}

Effect = "effect" __ id:Identifier __ "{" _ constrs:(EfConstr _ "," _)+ "}" {return {
    type: 'effect',
    location: location(),
    id, constrs: constrs.map(c => c[0])}}

EfConstr = id:Identifier _ ":" _ type:LambdaType {return {id, type}}

// == Type Defs ==
TypeDef = "type" __ id:Identifier typeVbls:TypeVbls? __ "=" __ decl:TypeDecl {return {type: 'TypeDef', id, decl, typeVbls: typeVbls || []}}
TypeDecl = RecordDecl

RecordDecl = "{" _ items:RecordItemCommas? _ "}" {return {type: 'Record', items: items || []}}
// TODO: spreads much come first, then rows
RecordItemCommas = first:RecordLine rest:(_ "," _ RecordLine)* ","? {return [first, ...rest.map(r => r[3])]}
RecordLine = RecordSpread / RecordItem
RecordSpread = "..." constr:Identifier {return {type: 'Spread', constr}}
RecordItem = id:Identifier _ ":" _ type:Type {return {type: 'Row', id, rtype: type}}





// ===== Expressions ======

// Binop
Expression = first:WithSuffix rest:(__ binop __ WithSuffix)* {
    if (rest.length) {
        return {type: 'ops', first, rest: rest.map(r => ({op: r[1], right: r[3]})), location: location()}
    } else {
        return first
    }
}
// Apply / Attribute access
WithSuffix = sub:Apsub suffixes:Suffix* {
	return suffixes.length ? {type: 'WithSuffix', target: sub, suffixes} : sub
}

Suffix = ApplySuffix / AttributeSuffix
ApplySuffix = typevbls:TypeVblsApply? effectVbls:EffectVblsApply? "(" _ args:CommaExpr? _ ")" {
    return {
        type: 'Apply',
        typevbls: typevbls || [],
        effectVbls,
        args: args || [],
        location: location(),
    }
}
AttributeSuffix = "." id:Identifier {return {type: 'Attribute', id, location: location()}}

Apsub = Lambda / Block / Handle / Raise / If / RecordLiteral / Literal

Block = "{" _ one:Statement rest:(_ ";" _ Statement)* ";"? _ "}" {
    return {type: 'block', items: [one, ...rest.map(r => r[3])], location: location()}
}

If = "if" __ cond:Expression _ yes:Block no:(_ "else" _ Block)? {
    return {type: 'If', cond, yes, no: no ? no[3] : null, location: location()}
}

RecordLiteral = id:Identifier typeVbls:TypeVblsApply? effectVbls:EffectVblsApply? "{" _ rows: RecordLiteralRows _ "}" {
    return {type: 'Record', id, rows, location: location(), typeVbls: typeVbls || [], effectVbls}
}
RecordLiteralRows = first:RecordLiteralRow rest:("," _ RecordLiteralRow _)* ","? {return [first, ...rest.map(r => r[2])]}
RecordLiteralSpread = "..." value:Expression {return {type: 'Spread', value}}
RecordLiteralRow = RecordLiteralItem / RecordLiteralSpread
RecordLiteralItem = id:Identifier _ ":" _ value:Expression {return {type: 'Row', id, value}}




// == Effects ==

Raise = "raise!" _ "(" name:Identifier "." constr:Identifier _ "(" args:CommaExpr? ")" _ ")" {return {type: 'raise', name, constr, args: args || [], location: location()}}

Handle = "handle!" _ target:Expression _ "{" _
    cases:(Case _)+ _
    "pure" _ "(" _ pureId:Identifier _ ")" _ "=>" _ pureBody:Expression _ ","? _
"}" {return {
    type: 'handle',
    target,
    cases: cases.map(c => c[0]),
    pure: {arg: pureId, body: pureBody},
    location: location(),
    }}

Case = name:Identifier "." constr:Identifier _ "(" _ "(" _ args:CommaPat? _ ")" _ "=>" _ k:Identifier _ ")" _ "=>" _ body:Expression _ "," {
	return {type: 'case', name, constr, args: args || [], k, body, location: location()}
}
Pat = Identifier
CommaPat = first:Pat rest:(_ "," _ Pat)* {return [first, ...rest.map(r => r[3])]}

CommaExpr = first:Expression rest:(_ "," _ Expression)* {return [first, ...rest.map(r => r[3])]}









// == Lambda ==

Lambda = typevbls:TypeVbls? effvbls:EffectVbls? "(" _ args:Args? _ ")" _ rettype:(":" _ Type _)?
    "=" effects:("{" _ CommaEffects? _ "}")? ">" _ body:Expression {return {
    type: 'lambda',
    typevbls: typevbls || [],
    effects: effects ? effects[2] || [] : null,
    effvbls: effvbls || [],
    args: args || [],
    rettype: rettype ? rettype[2] : null,
    body,
    location: location(),
}}
Args = first:Arg rest:(_ "," _ Arg)* {return [first, ...rest.map(r => r[3])]}
Arg = id:Identifier _ type:(":" _ Type)? {return {id, type: type ? type[2] : null}}

TypeVbls = "<" _ first:TypeVbl rest:(_ "," _ TypeVbl)* _ ","? _ ">" {
    return [first, ...rest.map(r => r[3])]
}
TypeVbl = id:Identifier subTypes:SubTypes? {
    return {id, subTypes: subTypes ? subTypes : []}
}
SubTypes = _ ":" _ first:Identifier rest:(__ "+" __ Identifier)* {
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
EffectVblsApply = "{" _ inner:CommaEffects? _ "}" {return inner || []}

LambdaType = typevbls:TypeVbls? effvbls:EffectVbls? "(" _ args:CommaType? _ ")" _ "="
    effects:("{" _ CommaEffects? _ "}")?
">" _ res:Type { return {
    type: 'lambda',
    args: args || [],
    typevbls: typevbls || [],
    location: location(),
    effvbls: effvbls || [],
    effects: effects ? effects[2] || [] : [] , res} }
CommaEffects =
    first:Identifier rest:(_ "," _ Identifier)* {return [first, ...rest.map(r => r[3])]}










// ==== Literals ====

Literal = Int / Identifier / String

Int "int"
	= _ [0-9]+ { return {type: 'int', value: parseInt(text(), 10), location: location()}; }
String = "\"" ( "\\" . / [^"\\])* "\"" {return {type: 'string', text: JSON.parse(text().replace('\n', '\\n')), location: location()}}
Identifier = [0-9a-zA-Z_]+ {return {type: "id", text: text(), location: location()}}

_ "whitespace"
  = [ \t\n\r]* (comment _)*
__ "whitespace"
  = [ \t\n\r]+ (comment _)*
comment = multiLineComment / lineComment
multiLineComment = "/*" (!"*/" .)* "*/"
lineComment = "//" (!"\n" .)* "\n"
finalLineComment = "//" (!"\n" .)*