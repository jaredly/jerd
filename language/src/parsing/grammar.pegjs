
File = _ s:(DecoratedToplevel _)* finalLineComment? {return s.map((s: any) => s[0])}

DecoratedToplevel = decorators:(Decorator _)* top:Toplevel {
    return decorators.length > 0 ? {
        type: 'Decorated',
        decorators: decorators.map((d: any) => d[0]),
        wrapped: top,
        location: location()
    } : top
}

Toplevel = StructDef / EnumDef / Effect / Statement

Statement = Define / Expression



// Decorators! For doing macro-y things probably?
// Also for some builtin magics

Decorator = "@" id:Identifier args:("(" _ CommaExpr _ ")")? {
    return {type: 'Decorator', id, args: args ? args[2] : [], location: location()}
}






// Toplevels

Define = "const" __ rec:("rec" __)? id:Identifier ann:(_ ":" _ Type)? _ "=" _ expr:Expression {return {
    type: 'define', rec: !!rec, id, expr, ann: ann ? ann[3] : null, location: location()}}

Effect = "effect" __ id:Identifier _ "{" _ constrs:(EfConstr _ "," _)+ "}" {return {
    type: 'effect',
    location: location(),
    id, constrs: constrs.map((c: any) => c[0])}}

EfConstr = id:Identifier _ ":" _ type:LambdaType {return {id, type}}

// == Type Defs ==
EnumDef = "enum" __ id:Identifier _ typeVbls:TypeVbls? _ "{" _ items:EnumItems _ "}" {
    return {
        type: 'EnumDef',
        id,
        typeVbls: typeVbls || [],
        items,
        location: location(),
    }
}
EnumItems = first:EnumItem rest:(_ "," _ EnumItem)* ","? {
    return [first, ...rest.map((r: any) => r[3])]
}
EnumItem = EnumSpread / EnumExternal
EnumExternal = ref:TypeRef {
    return {type: 'External', ref}
}
EnumSpread = "..." ref:TypeRef {
    return {type: 'Spread', ref, location: location()}
}
// EnumInternal = id:Identifier decl:RecordDecl? {
//     return {type: 'Internal', id, decl, location: location()}
// }

StructDef = "type" __ id:Identifier typeVbls:TypeVbls? __ "=" __ decl:RecordDecl {
    return {type: 'StructDef', id, decl, typeVbls: typeVbls || [], location: location()}}

RecordDecl = "{" _ items:RecordItemCommas? _ "}" {return {type: 'Record', items: items || [], location: location()}}
// TODO: spreads much come first, then rows
RecordItemCommas = first:RecordLine rest:(_ "," _ RecordLine)* ","? {return [first, ...rest.map((r: any) => r[3])]}
RecordLine = RecordSpread / RecordItem
RecordSpread = "..." constr:Identifier {return {type: 'Spread', constr}}
RecordItem = id:IdTextOrString _ ":" _ type:Type {return {type: 'Row', id: id.type === 'string' ? id.text : id, rtype: type}}





// ===== Expressions ======

// Binop
Expression = first:WithUnary rest:BinOpRight* {
    if (rest.length) {
        return {type: 'ops', first, rest, location: location()}
    } else {
        return first
    }
}
BinOpRight = __ op:binopWithHash __ right:WithUnary {
    return {op, right, location: location()}
}
WithUnary = op:UnaryOp? inner:WithSuffix {
    if (op != null) {
        return {type: 'Unary', op, inner, location: location()}
    }
    return inner
}
UnaryOp = "-" / "!"
// Apply / Attribute access
WithSuffix = decorators:(Decorator _)* sub:Apsub suffixes:Suffix* {
	const main = suffixes.length ? {type: 'WithSuffix', target: sub, suffixes, location: location()} : sub
    if (decorators.length) {
        return {type: 'Decorated', wrapped: main, decorators: decorators.map((d: any) => d[0])}
    } else {
        return main
    }
}

Suffix = ApplySuffix / AttributeSuffix / IndexSuffix / AsSuffix

AsSuffix = __ "as" hash:IdHash? __ t:TypeRef {return {type: 'As', t, location: location(), hash}}
IndexSuffix = "[" slices:Slices "]" {
    return {
        type: 'Index',
        slices,
        location: location()
    }
}
Slices = first:Slice rest:(_ "," _ Slice)* {
    return [first, ...rest.map((r: any) => r[3])]
}
Slice = FullSlice / Expression
FullSlice = left:(Expression __)? ":" right:(__ Expression)? {
    return {type: 'Slice', left: left ? left[0] : null, right: right ? right[1] : null, location: location()}
}

ApplySuffix = typevbls:TypeVblsApply? effectVbls:EffectVblsApply? "(" _ args:CommaExpr? _ ")" {
    return {
        type: 'Apply',
        typevbls: typevbls || [],
        effectVbls,
        args: args || [],
        location: location(),
    }
}
AttributeSuffix = "." id:MaybeQuotedIdentifier {return {type: 'Attribute', id, location: location()}}

Apsub = Literal / Lambda / Block / Handle / Raise / If / Switch / EnumLiteral / RecordLiteral / ArrayLiteral / TupleLiteral / Identifier

// TODO
// / TraitCall
// TraitCall = "." id:Identifier apply:ApplySuffix {
//     return {type: 'TraitCall', id, apply, location: location()}
// }

EnumLiteral = id:Identifier typeVbls:TypeVblsApply? ":" expr:Expression {
    return {
        type: 'Enum',
        id,
        typeVbls: typeVbls || [],
        expr,
        location: location(),
    }
}

RecordLiteral = id:Identifier typeVbls:TypeVblsApply? effectVbls:EffectVblsApply? "{" _ rows:RecordLiteralRows? _ "}" {
    return {type: 'Record', id, rows: rows || [], location: location(), typeVbls: typeVbls || [], effectVbls}
}
RecordLiteralRows = first:RecordLiteralRow rest:("," _ RecordLiteralRow _)* ","? {return [first, ...rest.map((r: any) => r[2])]}
RecordLiteralSpread = "..." value:Expression {return {type: 'Spread', value}}
RecordLiteralRow = RecordLiteralItem / RecordLiteralSpread
RecordLiteralItem = id:MaybeQuotedIdentifier _ ":" _ value:Expression {return {type: 'Row', id, value}}

ArrayLiteral = ann:("<" _ Type _ ","? ">")? "[" _ items:ArrayItems? _ "]" {return {type: 'Array', items: items || [], location: location(), ann: ann ? ann[2] : null}}
ArrayItems = first:ArrayItem rest:(_ "," _ ArrayItem)* ","? {
    return [first, ...rest.map((r: any) => r[3])]
}
ArrayItem = ArraySpread / Expression
ArraySpread = "..." value:Expression {return {type: 'ArraySpread', value, location: location() }}

TupleLiteral = "(" _ items:TupleItems _ ")" {
    if (items.length === 1) {
        return items[0]
    }
    return {type: 'Tuple', location: location(), items}
}
TupleItems = first:Expression rest:(_ "," _ Expression)* _ ","? {
    return [first, ...rest.map((r: any) => r[3])]
}



// == Control structures ==

Statements = one:Statement rest:(_ ";" _ Statement)* ";"? {
    return [one, ...rest.map((r: any) => r[3])]
}
Block = "{" _ items:Statements? _ "}" {
    return {type: 'block', items: items || [], location: location()}
}

If = "if" __ cond:Expression _ yes:Block no:(_ "else" _ (Block / IfElse))? {
    return {type: 'If', cond, yes, no: no ? no[3] : null, location: location()}
}

IfElse = v:If {
    return {type: 'block', items: [v], location: location()}
}


Switch = "switch" __ expr:Expression __ "{" _
    cases:SwitchCases
_ "}" {
    return {type: 'Switch', expr, cases, location: location()}
}

SwitchCases = first:SwitchCase rest:(_ "," _ SwitchCase)* ","? {
    return [first, ...rest.map((r: any) => r[3])]
}
SwitchCase = pattern:Pattern __ "=>" __ body:Expression {
    return {pattern, body, location: location()}
}

Pattern = inner:PatternInner as_:(__ "as" __ Identifier)? {
    if (as_ != null) {
        return {type: 'Alias', name: as_[3], inner, location: location()}
    }
    return inner
}
PatternInner = ArrayPattern / RecordPattern / TuplePattern / Literal / Identifier
ArrayPattern = "[" _ items:ArrayPatternItems? _ "]" {return {type: 'Array', location: location(), items: items || []}}

ArrayPatternItems = first:ArrayPatternItem rest:(_ "," _ ArrayPatternItem)* ","? {
    return [first, ...rest.map((r: any) => r[3])]
}
ArrayPatternItem = ArrayPatternSpread / Pattern
ArrayPatternSpread = "..." pattern:Pattern {return {type: 'Spread', inner: pattern, location: location()}}

RecordPattern = id:Identifier "{" items:RecordPatternCommas "}" {
    return {type: 'Record', id, items, location: location()}
}
RecordPatternCommas = first:RecordPatternItem rest:(_ "," _ RecordPatternItem)* ","? {return [first, ...rest.map((r: any) => r[3])]}
RecordPatternItem = id:Identifier pattern:(_ ":" _ Pattern)? {
    return {id, pattern: pattern ? pattern[3] : null, location: location()}}

TuplePattern = "(" _ items:TuplePatternItems _ ")" {
    return {type: 'Tuple', location: location(), items}
}
TuplePatternItems = first:Pattern rest:(_ "," _ Pattern)+ {
    return [first, ...rest.map((r: any) => r[3])]
}

// How do patterns look?


// == Effects ==

Raise = "raise!" _ "(" _ name:Identifier "." constr:Identifier _ "(" _ args:CommaExpr? _ ")" _ ","? _ ")" {return {type: 'raise', name, constr, args: args || [], location: location()}}

Handle = "handle!" _ target:Expression _ "{" _
    cases:(Case _)+ _
    "pure" _ "(" _ pureId:Identifier _ ")" _ "=>" _ pureBody:Expression _ ","? _
"}" {return {
    type: 'handle',
    target,
    cases: cases.map((c: any) => c[0]),
    pure: {arg: pureId, body: pureBody},
    location: location(),
    }}

Case = name:Identifier "." constr:Identifier _ "(" _ "(" _ args:CommaPat? _ ")" _ "=>" _ k:Identifier _ ")" _ "=>" _ body:Expression _ "," {
	return {type: 'case', name, constr, args: args || [], k, body, location: location()}
}
Pat = Identifier
CommaPat = first:Pat rest:(_ "," _ Pat)* {return [first, ...rest.map((r: any) => r[3])]}

CommaExpr = first:Expression rest:(_ "," _ Expression)* _ ","? {return [first, ...rest.map((r: any) => r[3])]}









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
Args = first:Arg rest:(_ "," _ Arg)* _ ","? {return [first, ...rest.map((r: any) => r[3])]}
Arg = id:Identifier _ type:(":" _ Type)? {return {id, type: type ? type[2] : null}}

TypeVbls = "<" _ first:TypeVbl rest:(_ "," _ TypeVbl)* _ ","? _ ">" {
    return [first, ...rest.map((r: any) => r[3])]
}
TypeVbl = id:Identifier subTypes:SubTypes? {
    return {id, subTypes: subTypes ? subTypes : []}
}
SubTypes = _ ":" _ first:Identifier rest:(__ "+" __ Identifier)* {
    return [first, ...rest.map((r: any) => r[3])]
}
EffectVbls = "{" _  inner:EffectVbls_? _ "}" { return inner || [] }
EffectVbls_ = first:Identifier rest:(_ "," _ Identifier)* _ ","? {
    return [first, ...rest.map((r: any) => r[3])]
}

binopWithHash = op:binop hash:OpHash? {
    return {text: op, hash, location: location()}
}
binop = !"//" [+*^/<>=|&-]+ {return text()}
// binop = "++" / "+" / "-" / "*" / "/" / "^" / "|" / "<=" / ">=" / "=="  / "<" / ">" 

Binop = Expression











// ==== Types ====

Type = LambdaType / TypeRef
TypeRef = id:Identifier effectVbls:EffectVblsApply? typeVbls:TypeVblsApply? {
    return {type: 'TypeRef', id, effectVbls, typeVbls, location: location()}
}
CommaType = first:Type rest:(_ "," _ Type)* ","? {return [first, ...rest.map((r: any) => r[3])]}
TypeVblsApply = "<" _ inner:CommaType _ ">" {return inner}
EffectVblsApply = "{" _ inner:CommaEffects? _ "}" {return inner || []}

CommaTypeIgnoringNames = (Identifier ":" _)? first:Type rest:(_ "," _ (Identifier ":" _)? Type)* ","? {return [first, ...rest.map((r: any) => r[4])]}
LambdaType = typevbls:TypeVbls? effvbls:EffectVbls? "(" _ args:CommaTypeIgnoringNames? _ ")" _ "="
    effects:("{" _ CommaEffects? _ "}")?
">" _ res:Type { return {
    type: 'lambda',
    args: args || [],
    typevbls: typevbls || [],
    location: location(),
    effvbls: effvbls || [],
    effects: effects ? effects[2] || [] : [] , res} }
CommaEffects =
    first:Identifier rest:(_ "," _ Identifier)* _ ","? {return [first, ...rest.map((r: any) => r[3])]}










// ==== Literals ====

Literal = Boolean / Float / Int / String 

Boolean = v:("true" / "false") ![0-9a-zA-Z_] {return {type: 'boolean', location: location(), value: v === "true"}}
Float "float"
    = _ "-"? [0-9]+ "." [0-9]+ {return {type: 'float', value: parseFloat(text()), location: location()}}
Int "int"
	= _ "-"? [0-9]+ { return {type: 'int', value: parseInt(text(), 10), location: location()}; }
String = "\"" ( "\\" . / [^"\\])* "\"" {return {type: 'string', text: JSON.parse(text().replace('\n', '\\n')), location: location()}}
Identifier = text:IdText hash:IdHash? {
    return {type: "id", text, location: location(), hash}}
MaybeQuotedIdentifier = text:IdTextOrString hash:IdHash? {
    return {type: "id", text: text.type === 'string' ? text.text : text, location: location(), hash}}
IdText = !"enum" [0-9a-zA-Z_]+ {return text()}
IdTextOrString = IdText / String
IdHash = SymHash {return text() } / OpHash {return text()}
// IdHash = ("#" ":"? [0-9a-zA-Z]+ ("#" [0-9]+)?) {return text()}
// TermHash = 
SymHash = "#" ":" [0-9]+ {return text()}
OpHash = ("#" [0-9a-zA-Z]+)+ {return text()}

_ "whitespace"
  = [ \t\n\r]* (comment _)*
__ "whitespace"
  = [ \t\n\r]+ (comment _)*
comment = multiLineComment / lineComment
multiLineComment = "/*" (!"*/" .)* "*/"
lineComment = "//" (!"\n" .)* "\n"
finalLineComment = "//" (!"\n" .)*