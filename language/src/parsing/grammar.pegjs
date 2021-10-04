{
    let allComments: Array<[IFileRange, string]> = [];
    let idx = 0;
    function myLocation(): Location {
        return {...location(), idx: idx++}
    }
}

File = _ tops:Toplevels? _ finalLineComment? {
    return tops || []
}

// TODO: Toplevels should end with a semicolon! Or at least be separated by them.
// That would be much more consistent and sensical.
Toplevels = first:DecoratedToplevel rest:(_nonnewline ';'? _nonnewline newline _ DecoratedToplevel)* _ ";"? {
    return [first].concat(rest.map((r: any) => r[5]))
}

DecoratedToplevel = decorators:(Decorator _)* top:Toplevel {
    return decorators.length > 0 ? {
        type: 'Decorated',
        decorators: decorators.map((d: any) => d[0]),
        wrapped: top,
        location: myLocation()
    } : top
}

Toplevel = StructDef / EnumDef / Effect / DecoratorDef / Define / ToplevelExpression

ToplevelExpression = expr:Expression { return {type: 'Expression', expr }}

Statement = Define / Expression



// Decorators! For doing macro-y things probably?
// Also for some builtin magics

Decorator = "@" id:Identifier typeVbls:TypeVblsApply?  args:("(" _ CommaDecoratorArg? _ ")")? {
    return {type: 'Decorator', id, typeVbls: typeVbls || [], args: args ? (args[2] || []) : [], location: myLocation()}
}
DecoratorArg = DecType / DecPat / DecExpr
LabeledDecoratorArg = (IdentifierWithoutHash ":" __)? arg:DecoratorArg { return arg }
CommaDecoratorArg = first:LabeledDecoratorArg rest:(_ "," _ LabeledDecoratorArg)* _ ","? {
    return [first].concat(rest.map((r: any) => r[3]))
}

DecType = ":" __ type:Type {return {type: 'Type', contents: type, location: myLocation()}}
DecPat = "?" __ pattern:Pattern {return {type: 'Pattern', pattern, location: myLocation()}}
DecExpr = expr:Expression {return {type: 'Expr', expr, location: myLocation()}}






// Toplevels

Define = "const" __ rec:("rec" __)? id:Identifier ann:(_ ":" _ Type)? _ "=" _ expr:Expression {return {
    type: 'define', rec: !!rec, id, expr, ann: ann ? ann[3] : null, location: myLocation()}}

Effect = "effect" __ id:Identifier _ "{" _ constrs:(EfConstr _ "," _)+ "}" {return {
    type: 'effect',
    location: myLocation(),
    id, constrs: constrs.map((c: any) => c[0])}}

EfConstr = id:Identifier _ ":" _ type:LambdaType {return {id, type}}

// == Type Defs ==
EnumDef = "enum" __ id:Identifier _ typeVbls:TypeVbls? _ "{" _ items:EnumItems _ "}" {
    return {
        type: 'EnumDef',
        id,
        typeVbls: typeVbls || [],
        items,
        location: myLocation(),
    }
}
EnumItems = first:EnumItem rest:(_ "," _ EnumItem)* ","? {
    return [first, ...rest.map((r: any) => r[3])]
}
EnumItem = EnumSpread / EnumInternal / EnumExternal
EnumExternal = ref:TypeRef {
    return {type: 'External', ref}
}
EnumSpread = "..." ref:TypeRef {
    return {type: 'Spread', ref, location: myLocation()}
}
// TODO: maybe allow type variable here? Not sure
EnumInternal = id:Identifier decl:RecordDecl {
    return {type: 'Internal', id, decl, location: myLocation()}
}

StructDef = "type" __ id:Identifier typeVbls:TypeVbls? __ "=" __ decl:RecordDecl {
    return {type: 'StructDef', id, decl, typeVbls: typeVbls || [], location: myLocation()}}

RecordDecl = "{" _ items:RecordItemCommas? _ "}" {return {type: 'Record', items: items || [], location: myLocation()}}
// TODO: spreads much come first, then rows
RecordItemCommas = first:RecordLine rest:(_ "," _ RecordLine)* ","? {return [first, ...rest.map((r: any) => r[3])]}
RecordLine = RecordSpread / RecordItem
RecordSpread = "..." constr:Identifier defaults:(
    _ "{" _ SpreadDefaults? _ "}"
)? {return {type: 'Spread', constr, defaults: defaults ? defaults[3] : null}}
SpreadDefaults = first:SpreadDefault rest:(_ "," _ SpreadDefault)* _ ","? {
    return [first].concat(rest.map((r: any) => r[3]))
}
// TODO: allow string
SpreadDefault = id:MaybeQuotedIdentifier _ ":" _ value:Expression {return {id, value}}
RecordItem = id:IdTextOrString _ ":" _ type:Type value:(_ "=" _ Expression)? {return {
    type: 'Row', id: id.type === 'string' ? id.text : id, rtype: type, value: value ? value[3] : null,
}}


DecoratorDef = "decorator " id:Identifier
    typeVbls:TypeVbls?
    args:("(" _
    DecDefArgs? _
")")? targetType:(__ Type)? {
    return {
        type: 'DecoratorDef',
        id,
        typeVbls,
        args: args ? args[2] || [] : null,
        targetType: targetType ? targetType[1] : null,
        location: myLocation(),
    }
}

DecDefArgs = first:DecDefArg rest:(_ "," _ DecDefArg)* _ ","? {
    return [first].concat(rest.map((r: any) => r[3]))
}

DecDefArg = id:IdentifierWithoutHash _ ":" _ type:Type {
    return {id, type, location: myLocation()}
}


// ===== Expressions ======

// Binop
Expression = BinOp
BinOp = first:WithUnary rest_drop:BinOpRight* {
    if (rest_drop.length) {
        return {type: 'BinOp', first, rest: rest_drop, location: myLocation()}
    } else {
        return first
    }
}
BinOpRight = __ op:binopWithHash __ right:WithUnary {
    return {op, right, location: myLocation()}
}
WithUnary = op_drop:UnaryOp? inner:Decorated {
    if (op_drop != null) {
        return {type: 'Unary', op: op_drop, inner, location: myLocation()}
    }
    return inner
}
UnaryOp = "-" / "!"
// Apply / Attribute access
Decorated = decorators_drop:(Decorator __)* wrapped:WithSuffix {
    if (decorators_drop.length) {
        return {type: 'Decorated', wrapped, decorators: decorators_drop.map((d: any) => d[0])}
    } else {
        return wrapped
    }
}
WithSuffix = target:Apsub suffixes_drop:Suffix* {
    if (suffixes_drop.length) {
        return {type: 'WithSuffix', target, suffixes, location: myLocation()}
    }
    return sub
}

Suffix = ApplySuffix / AttributeSuffix / IndexSuffix / AsSuffix

AsSuffix = __ "as" hash:IdHash? __ t:TypeRef {return {type: 'As', t, location: myLocation(), hash}}
IndexSuffix = "[" slices:Slices "]" {
    return {
        type: 'Index',
        slices,
        location: myLocation()
    }
}
Slices = first:Slice rest:(_ "," _ Slice)* {
    return [first, ...rest.map((r: any) => r[3])]
}
Slice = FullSlice / Expression
FullSlice = left:(Expression __)? ":" right:(__ Expression)? {
    return {type: 'Slice', left: left ? left[0] : null, right: right ? right[1] : null, location: myLocation()}
}

LabeledCommaExpr = label:(IdText ":" __)? first:Expression rest:(_ "," _ (IdText ":" __)? Expression)* _ ","? {
    return [{label, value: first}, ...rest.map((r: any) => ({label: r[3] ? r[3][0] : null, value: r[4]}))]
}

ApplySuffix = typevbls:TypeVblsApply? effectVbls:EffectVblsApply? "(" _ args:LabeledCommaExpr? _ ")" {
    return {
        type: 'Apply',
        typevbls: typevbls || [],
        effectVbls,
        args: args || [],
        location: myLocation(),
    }
}
AttributeSuffix = "." id:MaybeQuotedIdentifier {return {type: 'Attribute', id, location: myLocation()}}

Apsub = LiteralWithTemplateString / Lambda / Block / Handle / Raise / Trace / If / Switch / EnumLiteral / RecordLiteral / ArrayLiteral / TupleLiteral / Identifier

// TODO
// / TraitCall
// TraitCall = "." id:Identifier apply:ApplySuffix {
//     return {type: 'TraitCall', id, apply, location: myLocation()}
// }

EnumLiteral = id:Identifier typeVbls:TypeVblsApply? ":" expr:Expression {
    return {
        type: 'Enum',
        id,
        typeVbls: typeVbls || [],
        expr,
        location: myLocation(),
    }
}

RecordLiteral = id:Identifier typeVbls:TypeVblsApply? effectVbls:EffectVblsApply? "{" _ rows:RecordLiteralRows? _ "}" {
    return {type: 'Record', id, rows: rows || [], location: myLocation(), typeVbls: typeVbls || [], effectVbls}
}
RecordLiteralRows = first:RecordLiteralRow rest:("," _ RecordLiteralRow _)* ","? {return [first, ...rest.map((r: any) => r[2])]}
RecordLiteralSpread = "..." value:Expression {return {type: 'Spread', value}}
RecordLiteralRow = RecordLiteralItem / RecordLiteralSpread
RecordLiteralItem = id:MaybeQuotedIdentifier _ ":" _ value:Expression {return {type: 'Row', id, value}}

ArrayLiteral = ann:("<" _ Type _ ","? ">")? "[" _ items:ArrayItems? _ "]" {return {type: 'Array', items: items || [], location: myLocation(), ann: ann ? ann[2] : null}}
ArrayItems = first:ArrayItem rest:(_ "," _ ArrayItem)* ","? {
    return [first, ...rest.map((r: any) => r[3])]
}
ArrayItem = ArraySpread / Expression
ArraySpread = "..." value:Expression {return {type: 'ArraySpread', value, location: myLocation() }}

TupleLiteral = "(" _ items:TupleItems _ ")" {
    if (items.length === 1) {
        return items[0]
    }
    return {type: 'Tuple', location: myLocation(), items}
}
TupleItems = first:Expression rest:(_ "," _ Expression)* _ ","? {
    return [first, ...rest.map((r: any) => r[3])]
}



// == Control structures ==

Statements = one:Statement rest:(_ ";" _ Statement)* ";"? {
    return [one, ...rest.map((r: any) => r[3])]
}
Block = "{" _ items:Statements? _ "}" {
    return {type: 'block', items: items || [], location: myLocation()}
}

If = "if" __ cond:Expression _ yes:Block no:(_ "else" _ (Block / IfElse))? {
    return {type: 'If', cond, yes, no: no ? no[3] : null, location: myLocation()}
}

IfElse = v:If {
    return {type: 'block', items: [v], location: myLocation()}
}


Switch = "switch" __ expr:Expression __ "{" _
    cases:SwitchCases
_ "}" {
    return {type: 'Switch', expr, cases, location: myLocation()}
}

SwitchCases = first:SwitchCase rest:(_ "," _ SwitchCase)* ","? {
    return [first, ...rest.map((r: any) => r[3])]
}
SwitchCase = pattern:Pattern __ "=>" __ body:Expression {
    return {pattern, body, location: myLocation()}
}

Pattern = inner:PatternInner as_:(__ "as" __ Identifier)? {
    if (as_ != null) {
        return {type: 'Alias', name: as_[3], inner, location: myLocation()}
    }
    return inner
}
PatternInner = ArrayPattern / RecordPattern / TuplePattern / LiteralWithString / Identifier
ArrayPattern = "[" _ items:ArrayPatternItems? _ "]" {return {type: 'Array', location: myLocation(), items: items || []}}

ArrayPatternItems = first:ArrayPatternItem rest:(_ "," _ ArrayPatternItem)* ","? {
    return [first, ...rest.map((r: any) => r[3])]
}
ArrayPatternItem = ArrayPatternSpread / Pattern
ArrayPatternSpread = "..." pattern:Pattern? {return {type: 'Spread', inner: pattern, location: myLocation()}}

RecordPattern = id:Identifier _ "{" _ items:RecordPatternCommas _ "}" {
    return {type: 'Record', id, items, location: myLocation()}
}
RecordPatternCommas = first:RecordPatternItem rest:(_ "," _ RecordPatternItem)* ","? {return [first, ...rest.map((r: any) => r[3])]}
RecordPatternItem = id:Identifier pattern:(_ ":" _ Pattern)? {
    return {id, pattern: pattern ? pattern[3] : null, location: myLocation()}}

TuplePattern = "(" _ items:TuplePatternItems _ ")" {
    return {type: 'Tuple', location: myLocation(), items}
}
TuplePatternItems = first:Pattern rest:(_ "," _ Pattern)+ (_ ",")? {
    return [first, ...rest.map((r: any) => r[3])]
}

// How do patterns look?

Trace = "trace!(" _ args:CommaExpr _ ")" {return {type: 'Trace', args, location: myLocation()}}

// == Effects ==

Raise = "raise!" _ "(" _ name:Identifier "." constr:Identifier _ "(" _ args:CommaExpr? _ ")" _ ","? _ ")" {return {type: 'raise', name, constr, args: args || [], location: myLocation()}}

Handle = "handle!" _ target:Expression _ "{" _
    cases:(Case _)+ _
    "pure" _ "(" _ pureId:Identifier _ ")" _ "=>" _ pureBody:Expression _ ","? _
"}" {return {
    type: 'handle',
    target,
    cases: cases.map((c: any) => c[0]),
    pure: {arg: pureId, body: pureBody},
    location: myLocation(),
    }}

Case = name:Identifier "." constr:Identifier _ "(" _ "(" _ args:CommaPat? _ ")" _ "=>" _ k:Identifier _ ")" _ "=>" _ body:Expression _ "," {
	return {type: 'case', name, constr, args: args || [], k, body, location: myLocation()}
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
    location: myLocation(),
}}
Args = first:Arg rest:(_ "," _ Arg)* _ ","? {return [first, ...rest.map((r: any) => r[3])]}
Arg = id:Identifier _ type:(":" _ Type)? {return {id, type: type ? type[2] : null, location: myLocation()}}

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
    return {text: op, hash, location: myLocation()}
}
binop = $(!"//" [+*^/<>=|&-]+)
// binop = "++" / "+" / "-" / "*" / "/" / "^" / "|" / "<=" / ">=" / "=="  / "<" / ">" 

Binop = Expression











// ==== Types ====

Type = LambdaType / TypeRef / TupleType
TypeRef = id:Identifier effectVbls:EffectVblsApply? typeVbls:TypeVblsApply? {
    return {type: 'TypeRef', id, effectVbls, typeVbls, location: myLocation()}
}
CommaType = first:Type rest:(_ "," _ Type)* ","? {return [first, ...rest.map((r: any) => r[3])]}
TypeVblsApply = "<" _ inner:CommaType _ ">" {return inner}
EffectVblsApply = "{" _ inner:CommaEffects? _ "}" {return inner || []}

TypeWithOptionalName = id:(IdentifierWithoutHash _ ":" _)? type:Type {
    return {type, id: id ? id[0] : null, location: myLocation()}
}
CommaTypeWithNames = first:TypeWithOptionalName rest:(_ "," _ TypeWithOptionalName)* ","? {
    return [first, ...rest.map((r: any) => r[3])]
}
LambdaType = typevbls:TypeVbls? effvbls:EffectVbls? "(" _ args:CommaTypeWithNames? _ ")" _ "="
    effects:("{" _ CommaEffects? _ "}")?
">" _ res:Type { return {
    type: 'lambda',
    args: args || [],
    typevbls: typevbls || [],
    location: myLocation(),
    effvbls: effvbls || [],
    effects: effects ? effects[2] || [] : [] , res} }
CommaEffects =
    first:Identifier rest:(_ "," _ Identifier)* _ ","? {return [first, ...rest.map((r: any) => r[3])]}

TupleType = "(" first:Type rest:(_ "," _ Type)+ ")" {
    const types = [first].concat(rest.map((r: any) => r[3]));
    return {
        type: 'tuple',
        items: types,
        location: myLocation()
    }
}









// ==== Literals ====

Literal = Boolean / Float / Int
LiteralWithString = Literal / String 
LiteralWithTemplateString = Literal / TemplateString 

Boolean = v:("true" / "false") ![0-9a-zA-Z_] {return {type: 'boolean', location: myLocation(), value: v === "true"}}
Float "float"
    = _ contents:$("-"? [0-9]+ "." [0-9]+) {return {type: 'float', value: parseFloat(text()), location: myLocation()}}
Int "int"
	= _ contents:$("-"? [0-9]+) { return {type: 'int', value: parseInt(text(), 10), location: myLocation()}; }

TemplateString = "\"" contents:StringContents* "\"" {
    const parts: Array<string | any> = [];
    let last = false
    contents.forEach((item: any) => {
        if (typeof item === 'string') {
            if (last) {
                parts[parts.length - 1] += item
                return
            } 
        }
        last = typeof item === 'string'
        parts.push(item)
    })
    if (!parts.length) {
        return {type: 'string', text: '', location: myLocation()}
    }
    if (parts.length === 1 && typeof parts[0] === 'string') {
        return {type: 'string', text: parts[0], location: myLocation()}
    }
    return {type: 'template-string', contents: parts, location: myLocation() }
}

// how do we parse this?
// At each char: try to 
StringContents = TemplatePart / stringChar

TemplatePart = "$" hash:OpHash? "{" _ inner:Expression _ "}" {
    return {hash, inner, location: myLocation()}
}

String = "\"" contents:($(stringChar*)) "\"" {return {type: 'string', text: JSON.parse(text().replace('\n', '\\n')), location: myLocation()}}
stringChar = $( escapedChar / [^"\\])
escapedChar = "\\" .

IdentifierWithoutHash = text:IdText {
    return {type: "id", text, location: myLocation(), }}
Identifier = text:IdText hash:IdHash? {
    return {type: "id", text, location: myLocation(), hash}}
MaybeQuotedIdentifier = text:IdTextOrString hash:IdHash? {
    return {type: "id", text: text.type === 'string' ? text.text : text, location: myLocation(), hash}}
IdText = $(!"enum" [0-9a-zA-Z_]+)
IdTextOrString = IdText / String
IdHash = $SymHash / $OpHash / $BuiltinHash
SymHash = $("#" ":" [0-9]+)
OpHash = $("#" [0-9a-zA-Z]+)+
BuiltinHash = $("#" "builtin")

newline = "\n"
_nonnewline = [ \t\r]* (comment [ \t\r]*)*
_ "whitespace"
  = [ \t\n\r]* (comment _)*
__ "whitespace"
  = [ \t\n\r]+ (comment _)*
comment = multiLineComment / lineComment
multiLineComment = $("/*" (!"*/" .)* "*/")
lineComment = $("//" (!"\n" .)* "\n")
finalLineComment = $("//" (!"\n" .)*)