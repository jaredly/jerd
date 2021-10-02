import {Term, Location, Loc, Type, TypeVblDecl, Id, Decorators, Decorator, DecoratorArg, Pattern, Symbol, TypeReference, Reference, UserReference, RecordPatternItem, Literal, Boolean, EffectRef, TypeRef, TypeVar, SwitchCase, LambdaType, AmbiguousType, Case, LiteralWithTemplateString, Let, ToplevelT, EffectDef, DecoratorDef, DecoratorDefArg, EnumDef, UserTypeReference, ToplevelRecord, RecordDef} from './types';

export type Visitor<Ctx> = {
    Term?: (node: Term, ctx: Ctx) => null | false | Term | [Term, Ctx]
                TermPost?: (node: Term, ctx: Ctx) => null | Term,
    Pattern?: (node: Pattern, ctx: Ctx) => null | false | Pattern | [Pattern, Ctx]
                PatternPost?: (node: Pattern, ctx: Ctx) => null | Pattern,
    Let?: (node: Let, ctx: Ctx) => null | false | Let | [Let, Ctx]
                LetPost?: (node: Let, ctx: Ctx) => null | Let,
    ToplevelT?: (node: ToplevelT, ctx: Ctx) => null | false | ToplevelT | [ToplevelT, Ctx]
                ToplevelTPost?: (node: ToplevelT, ctx: Ctx) => null | ToplevelT,
    Type?: (node: Type, ctx: Ctx) => null | false | Type | [Type, Ctx]
                TypePost?: (node: Type, ctx: Ctx) => null | Type,
    Location?: (node: Location, ctx: Ctx) => null | false | Location | [Location, Ctx]
                LocationPost?: (node: Location, ctx: Ctx) => null | Location
}
// not a type Loc

const transformLocation = <Ctx>(node: Location, visitor: Visitor<Ctx>, ctx: Ctx): Location => {
        if (!node) {
            throw new Error('No Location provided');
        }
        
        const transformed = visitor.Location ? visitor.Location(node, ctx) : null;
        if (transformed === false) {
            return node;
        }
        if (transformed != null) {
            if (Array.isArray(transformed)) {
                ctx = transformed[1];
                if (transformed[0] != null) {
                    node = transformed[0];
                }
            } else {
                node = transformed;
            }
        }
        
        let changed0 = false;
        const updatedNode = node;
        
        node = updatedNode;
        if (visitor.LocationPost) {
            const transformed = visitor.LocationPost(node, ctx);
            if (transformed != null) {
                node = transformed;
            }
        }
        return node;
        
    }

// no transformer for Id

// no transformer for Symbol

// no transformer for UserReference

// no transformer for Reference

const transformTypeReference = <Ctx>(node: TypeReference, visitor: Visitor<Ctx>, ctx: Ctx): TypeReference => {
        if (!node) {
            throw new Error('No TypeReference provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                const updatedNode$location = transformLocation(node.location, visitor, ctx);
                changed1 = changed1 || updatedNode$location !== node.location;

                
                let updatedNode$typeVbls = node.typeVbls;
                {
                    let changed2 = false;
                    const arr1 = node.typeVbls.map((updatedNode$typeVbls$item1) => {
                        
                const result = transformType(updatedNode$typeVbls$item1, visitor, ctx);
                changed2 = changed2 || result !== updatedNode$typeVbls$item1;
                        return result
                    })
                    if (changed2) {
                        updatedNode$typeVbls = arr1;
                        changed1 = true;
                    }
                }
                

                
        let updatedNode$decorators = undefined;
        const updatedNode$decorators$current = node.decorators;
        if (updatedNode$decorators$current != null) {
            
                const updatedNode$decorators$1$ = transformDecorators(updatedNode$decorators$current, visitor, ctx);
                changed1 = changed1 || updatedNode$decorators$1$ !== updatedNode$decorators$current;
            updatedNode$decorators = updatedNode$decorators$1$;
        }
        
                if (changed1) {
                    updatedNode =  {...updatedNode, location: updatedNode$location, typeVbls: updatedNode$typeVbls, decorators: updatedNode$decorators};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

const transformRecordPatternItem = <Ctx>(node: RecordPatternItem, visitor: Visitor<Ctx>, ctx: Ctx): RecordPatternItem => {
        if (!node) {
            throw new Error('No RecordPatternItem provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                const updatedNode$location = transformLocation(node.location, visitor, ctx);
                changed1 = changed1 || updatedNode$location !== node.location;

                
                const updatedNode$pattern = transformPattern(node.pattern, visitor, ctx);
                changed1 = changed1 || updatedNode$pattern !== node.pattern;

                
                const updatedNode$is = transformType(node.is, visitor, ctx);
                changed1 = changed1 || updatedNode$is !== node.is;

                
        let updatedNode$decorators = undefined;
        const updatedNode$decorators$current = node.decorators;
        if (updatedNode$decorators$current != null) {
            
                const updatedNode$decorators$1$ = transformDecorators(updatedNode$decorators$current, visitor, ctx);
                changed1 = changed1 || updatedNode$decorators$1$ !== updatedNode$decorators$current;
            updatedNode$decorators = updatedNode$decorators$1$;
        }
        
                if (changed1) {
                    updatedNode =  {...updatedNode, location: updatedNode$location, pattern: updatedNode$pattern, is: updatedNode$is, decorators: updatedNode$decorators};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

const transformBoolean = <Ctx>(node: Boolean, visitor: Visitor<Ctx>, ctx: Ctx): Boolean => {
        if (!node) {
            throw new Error('No Boolean provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                const updatedNode$is = transformType(node.is, visitor, ctx);
                changed1 = changed1 || updatedNode$is !== node.is;

                
                const updatedNode$location = transformLocation(node.location, visitor, ctx);
                changed1 = changed1 || updatedNode$location !== node.location;

                
        let updatedNode$decorators = undefined;
        const updatedNode$decorators$current = node.decorators;
        if (updatedNode$decorators$current != null) {
            
                const updatedNode$decorators$1$ = transformDecorators(updatedNode$decorators$current, visitor, ctx);
                changed1 = changed1 || updatedNode$decorators$1$ !== updatedNode$decorators$current;
            updatedNode$decorators = updatedNode$decorators$1$;
        }
        
                if (changed1) {
                    updatedNode =  {...updatedNode, is: updatedNode$is, location: updatedNode$location, decorators: updatedNode$decorators};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

const transformLiteral = <Ctx>(node: Literal, visitor: Visitor<Ctx>, ctx: Ctx): Literal => {
        if (!node) {
            throw new Error('No Literal provided');
        }
        
        let changed0 = false;
        
        let updatedNode = node;
        switch (node.type) {
            case 'string': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, is: updatedNode$0node$is, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'float': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'int': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            default: {
                        let changed1 = false;
                        
                const updatedNode$0node = transformBoolean(node, visitor, ctx);
                changed1 = changed1 || updatedNode$0node !== node;
                        updatedNode = updatedNode$0node;
                    }
        }
        return updatedNode;
    }

const transformPattern = <Ctx>(node: Pattern, visitor: Visitor<Ctx>, ctx: Ctx): Pattern => {
        if (!node) {
            throw new Error('No Pattern provided');
        }
        
        const transformed = visitor.Pattern ? visitor.Pattern(node, ctx) : null;
        if (transformed === false) {
            return node;
        }
        if (transformed != null) {
            if (Array.isArray(transformed)) {
                ctx = transformed[1];
                if (transformed[0] != null) {
                    node = transformed[0];
                }
            } else {
                node = transformed;
            }
        }
        
        let changed0 = false;
        
        let updatedNode = node;
        switch (node.type) {
            case 'Alias': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$inner = transformPattern(updatedNode$0specified.inner, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$inner !== updatedNode$0specified.inner;

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, inner: updatedNode$0node$inner, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Record': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$ref = transformTypeReference(updatedNode$0specified.ref, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$ref !== updatedNode$0specified.ref;

                
                let updatedNode$0node$items = updatedNode$0specified.items;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.items.map((updatedNode$0node$items$item2) => {
                        
                const result = transformRecordPatternItem(updatedNode$0node$items$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$items$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$items = arr2;
                        changed2 = true;
                    }
                }
                

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, ref: updatedNode$0node$ref, items: updatedNode$0node$items, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Tuple': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                let updatedNode$0node$items = updatedNode$0specified.items;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.items.map((updatedNode$0node$items$item2) => {
                        
                const result = transformPattern(updatedNode$0node$items$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$items$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$items = arr2;
                        changed2 = true;
                    }
                }
                

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, items: updatedNode$0node$items, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Array': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                let updatedNode$0node$preItems = updatedNode$0specified.preItems;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.preItems.map((updatedNode$0node$preItems$item2) => {
                        
                const result = transformPattern(updatedNode$0node$preItems$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$preItems$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$preItems = arr2;
                        changed2 = true;
                    }
                }
                

                
        let updatedNode$0node$spread = null;
        const updatedNode$0node$spread$current = updatedNode$0specified.spread;
        if (updatedNode$0node$spread$current != null) {
            
                const updatedNode$0node$spread$2$ = transformPattern(updatedNode$0node$spread$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$spread$2$ !== updatedNode$0node$spread$current;
            updatedNode$0node$spread = updatedNode$0node$spread$2$;
        }
        

                
                let updatedNode$0node$postItems = updatedNode$0specified.postItems;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.postItems.map((updatedNode$0node$postItems$item2) => {
                        
                const result = transformPattern(updatedNode$0node$postItems$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$postItems$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$postItems = arr2;
                        changed2 = true;
                    }
                }
                

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, preItems: updatedNode$0node$preItems, spread: updatedNode$0node$spread, postItems: updatedNode$0node$postItems, location: updatedNode$0node$location, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Enum': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$ref = transformTypeReference(updatedNode$0specified.ref, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$ref !== updatedNode$0specified.ref;

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, ref: updatedNode$0node$ref, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Ignore': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Binding': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            default: {
                        let changed1 = false;
                        
                const updatedNode$0node = transformLiteral(node, visitor, ctx);
                changed1 = changed1 || updatedNode$0node !== node;
                        updatedNode = updatedNode$0node;
                    }
        }
        
        node = updatedNode;
        if (visitor.PatternPost) {
            const transformed = visitor.PatternPost(node, ctx);
            if (transformed != null) {
                node = transformed;
            }
        }
        return node;
        
    }

const transformDecoratorArg = <Ctx>(node: DecoratorArg, visitor: Visitor<Ctx>, ctx: Ctx): DecoratorArg => {
        if (!node) {
            throw new Error('No DecoratorArg provided');
        }
        
        let changed0 = false;
        
        let updatedNode = node;
        switch (node.type) {
            case 'Term': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$term = transformTerm(updatedNode$0specified.term, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$term !== updatedNode$0specified.term;
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, term: updatedNode$0node$term};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Type': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$contents = transformType(updatedNode$0specified.contents, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$contents !== updatedNode$0specified.contents;
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, contents: updatedNode$0node$contents};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Pattern': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$pattern = transformPattern(updatedNode$0specified.pattern, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$pattern !== updatedNode$0specified.pattern;
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, pattern: updatedNode$0node$pattern};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }
        }
        return updatedNode;
    }

const transformDecorator = <Ctx>(node: Decorator, visitor: Visitor<Ctx>, ctx: Ctx): Decorator => {
        if (!node) {
            throw new Error('No Decorator provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
            let updatedNode$name = node.name;
            {
                let changed2 = false;
                
                const updatedNode$name$location = transformLocation(node.name.location, visitor, ctx);
                changed2 = changed2 || updatedNode$name$location !== node.name.location;
                if (changed2) {
                    updatedNode$name =  {...updatedNode$name, location: updatedNode$name$location};
                    changed1 = true;
                }
            }
            

                
                const updatedNode$location = transformLocation(node.location, visitor, ctx);
                changed1 = changed1 || updatedNode$location !== node.location;

                
                let updatedNode$args = node.args;
                {
                    let changed2 = false;
                    const arr1 = node.args.map((updatedNode$args$item1) => {
                        
                const result = transformDecoratorArg(updatedNode$args$item1, visitor, ctx);
                changed2 = changed2 || result !== updatedNode$args$item1;
                        return result
                    })
                    if (changed2) {
                        updatedNode$args = arr1;
                        changed1 = true;
                    }
                }
                
                if (changed1) {
                    updatedNode =  {...updatedNode, name: updatedNode$name, location: updatedNode$location, args: updatedNode$args};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

const transformDecorators = <Ctx>(node: Decorators, visitor: Visitor<Ctx>, ctx: Ctx): Decorators => {
        if (!node) {
            throw new Error('No Decorators provided');
        }
        
        let changed0 = false;
        
                let updatedNode = node;
                {
                    let changed1 = false;
                    const arr0 = node.map((updatedNode$item0) => {
                        
                const result = transformDecorator(updatedNode$item0, visitor, ctx);
                changed1 = changed1 || result !== updatedNode$item0;
                        return result
                    })
                    if (changed1) {
                        updatedNode = arr0;
                        changed0 = true;
                    }
                }
                
        return updatedNode;
    }

const transformTypeVblDecl = <Ctx>(node: TypeVblDecl, visitor: Visitor<Ctx>, ctx: Ctx): TypeVblDecl => {
        if (!node) {
            throw new Error('No TypeVblDecl provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
        let updatedNode$location = undefined;
        const updatedNode$location$current = node.location;
        if (updatedNode$location$current != null) {
            
                const updatedNode$location$1$ = transformLocation(updatedNode$location$current, visitor, ctx);
                changed1 = changed1 || updatedNode$location$1$ !== updatedNode$location$current;
            updatedNode$location = updatedNode$location$1$;
        }
        

                
        let updatedNode$decorators = undefined;
        const updatedNode$decorators$current = node.decorators;
        if (updatedNode$decorators$current != null) {
            
                const updatedNode$decorators$1$ = transformDecorators(updatedNode$decorators$current, visitor, ctx);
                changed1 = changed1 || updatedNode$decorators$1$ !== updatedNode$decorators$current;
            updatedNode$decorators = updatedNode$decorators$1$;
        }
        
                if (changed1) {
                    updatedNode =  {...updatedNode, location: updatedNode$location, decorators: updatedNode$decorators};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

const transformEffectRef = <Ctx>(node: EffectRef, visitor: Visitor<Ctx>, ctx: Ctx): EffectRef => {
        if (!node) {
            throw new Error('No EffectRef provided');
        }
        
        let changed0 = false;
        
        let updatedNode = node;
        switch (node.type) {
            case 'ref': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
        let updatedNode$0node$location = undefined;
        const updatedNode$0node$location$current = updatedNode$0specified.location;
        if (updatedNode$0node$location$current != null) {
            
        let updatedNode$0node$location$2$ = null;
        const updatedNode$0node$location$2$$current = updatedNode$0node$location$current;
        if (updatedNode$0node$location$2$$current != null) {
            
                const updatedNode$0node$location$2$$2$ = transformLocation(updatedNode$0node$location$2$$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location$2$$2$ !== updatedNode$0node$location$2$$current;
            updatedNode$0node$location$2$ = updatedNode$0node$location$2$$2$;
        }
        
            updatedNode$0node$location = updatedNode$0node$location$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'var': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
        let updatedNode$0node$location = undefined;
        const updatedNode$0node$location$current = updatedNode$0specified.location;
        if (updatedNode$0node$location$current != null) {
            
        let updatedNode$0node$location$2$ = null;
        const updatedNode$0node$location$2$$current = updatedNode$0node$location$current;
        if (updatedNode$0node$location$2$$current != null) {
            
                const updatedNode$0node$location$2$$2$ = transformLocation(updatedNode$0node$location$2$$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location$2$$2$ !== updatedNode$0node$location$2$$current;
            updatedNode$0node$location$2$ = updatedNode$0node$location$2$$2$;
        }
        
            updatedNode$0node$location = updatedNode$0node$location$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }
        }
        return updatedNode;
    }

const transformTypeVar = <Ctx>(node: TypeVar, visitor: Visitor<Ctx>, ctx: Ctx): TypeVar => {
        if (!node) {
            throw new Error('No TypeVar provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                const updatedNode$location = transformLocation(node.location, visitor, ctx);
                changed1 = changed1 || updatedNode$location !== node.location;

                
        let updatedNode$decorators = undefined;
        const updatedNode$decorators$current = node.decorators;
        if (updatedNode$decorators$current != null) {
            
                const updatedNode$decorators$1$ = transformDecorators(updatedNode$decorators$current, visitor, ctx);
                changed1 = changed1 || updatedNode$decorators$1$ !== updatedNode$decorators$current;
            updatedNode$decorators = updatedNode$decorators$1$;
        }
        
                if (changed1) {
                    updatedNode =  {...updatedNode, location: updatedNode$location, decorators: updatedNode$decorators};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

const transformTypeRef = <Ctx>(node: TypeRef, visitor: Visitor<Ctx>, ctx: Ctx): TypeRef => {
        if (!node) {
            throw new Error('No TypeRef provided');
        }
        
        let changed0 = false;
        
        let updatedNode = node;
        switch (node.type) {
            case 'ref': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
                let updatedNode$0node$typeVbls = updatedNode$0specified.typeVbls;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.typeVbls.map((updatedNode$0node$typeVbls$item2) => {
                        
                const result = transformType(updatedNode$0node$typeVbls$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$typeVbls$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$typeVbls = arr2;
                        changed2 = true;
                    }
                }
                

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, typeVbls: updatedNode$0node$typeVbls, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            default: {
                        let changed1 = false;
                        
                const updatedNode$0node = transformTypeVar(node, visitor, ctx);
                changed1 = changed1 || updatedNode$0node !== node;
                        updatedNode = updatedNode$0node;
                    }
        }
        return updatedNode;
    }

const transformType = <Ctx>(node: Type, visitor: Visitor<Ctx>, ctx: Ctx): Type => {
        if (!node) {
            throw new Error('No Type provided');
        }
        
        const transformed = visitor.Type ? visitor.Type(node, ctx) : null;
        if (transformed === false) {
            return node;
        }
        if (transformed != null) {
            if (Array.isArray(transformed)) {
                ctx = transformed[1];
                if (transformed[0] != null) {
                    node = transformed[0];
                }
            } else {
                node = transformed;
            }
        }
        
        let changed0 = false;
        
        let updatedNode = node;
        switch (node.type) {
            case 'lambda': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
                let updatedNode$0node$typeVbls = updatedNode$0specified.typeVbls;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.typeVbls.map((updatedNode$0node$typeVbls$item2) => {
                        
                const result = transformTypeVblDecl(updatedNode$0node$typeVbls$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$typeVbls$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$typeVbls = arr2;
                        changed2 = true;
                    }
                }
                

                
        let updatedNode$0node$argNames = undefined;
        const updatedNode$0node$argNames$current = updatedNode$0specified.argNames;
        if (updatedNode$0node$argNames$current != null) {
            
                let updatedNode$0node$argNames$2$ = updatedNode$0node$argNames$current;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0node$argNames$current.map((updatedNode$0node$argNames$2$$item2) => {
                        
        let result = null;
        const result$current = updatedNode$0node$argNames$2$$item2;
        if (result$current != null) {
            
            let result$3$ = result$current;
            {
                let changed4 = false;
                
                const result$3$$location = transformLocation(result$current.location, visitor, ctx);
                changed4 = changed4 || result$3$$location !== result$current.location;
                if (changed4) {
                    result$3$ =  {...result$3$, location: result$3$$location};
                    changed3 = true;
                }
            }
            
            result = result$3$;
        }
        
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$argNames$2$ = arr2;
                        changed2 = true;
                    }
                }
                
            updatedNode$0node$argNames = updatedNode$0node$argNames$2$;
        }
        

                
                let updatedNode$0node$args = updatedNode$0specified.args;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.args.map((updatedNode$0node$args$item2) => {
                        
                const result = transformType(updatedNode$0node$args$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$args$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$args = arr2;
                        changed2 = true;
                    }
                }
                

                
                let updatedNode$0node$effects = updatedNode$0specified.effects;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.effects.map((updatedNode$0node$effects$item2) => {
                        
                const result = transformEffectRef(updatedNode$0node$effects$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$effects$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$effects = arr2;
                        changed2 = true;
                    }
                }
                

                
        let updatedNode$0node$rest = null;
        const updatedNode$0node$rest$current = updatedNode$0specified.rest;
        if (updatedNode$0node$rest$current != null) {
            
                const updatedNode$0node$rest$2$ = transformType(updatedNode$0node$rest$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$rest$2$ !== updatedNode$0node$rest$current;
            updatedNode$0node$rest = updatedNode$0node$rest$2$;
        }
        

                
                const updatedNode$0node$res = transformType(updatedNode$0specified.res, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$res !== updatedNode$0specified.res;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, typeVbls: updatedNode$0node$typeVbls, argNames: updatedNode$0node$argNames, args: updatedNode$0node$args, effects: updatedNode$0node$effects, rest: updatedNode$0node$rest, res: updatedNode$0node$res, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Ambiguous': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            default: {
                        let changed1 = false;
                        
                const updatedNode$0node = transformTypeRef(node, visitor, ctx);
                changed1 = changed1 || updatedNode$0node !== node;
                        updatedNode = updatedNode$0node;
                    }
        }
        
        node = updatedNode;
        if (visitor.TypePost) {
            const transformed = visitor.TypePost(node, ctx);
            if (transformed != null) {
                node = transformed;
            }
        }
        return node;
        
    }

const transformSwitchCase = <Ctx>(node: SwitchCase, visitor: Visitor<Ctx>, ctx: Ctx): SwitchCase => {
        if (!node) {
            throw new Error('No SwitchCase provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                const updatedNode$location = transformLocation(node.location, visitor, ctx);
                changed1 = changed1 || updatedNode$location !== node.location;

                
                const updatedNode$pattern = transformPattern(node.pattern, visitor, ctx);
                changed1 = changed1 || updatedNode$pattern !== node.pattern;

                
                const updatedNode$body = transformTerm(node.body, visitor, ctx);
                changed1 = changed1 || updatedNode$body !== node.body;

                
        let updatedNode$decorators = undefined;
        const updatedNode$decorators$current = node.decorators;
        if (updatedNode$decorators$current != null) {
            
                const updatedNode$decorators$1$ = transformDecorators(updatedNode$decorators$current, visitor, ctx);
                changed1 = changed1 || updatedNode$decorators$1$ !== updatedNode$decorators$current;
            updatedNode$decorators = updatedNode$decorators$1$;
        }
        
                if (changed1) {
                    updatedNode =  {...updatedNode, location: updatedNode$location, pattern: updatedNode$pattern, body: updatedNode$body, decorators: updatedNode$decorators};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

const transformLambdaType = <Ctx>(node: LambdaType, visitor: Visitor<Ctx>, ctx: Ctx): LambdaType => {
        if (!node) {
            throw new Error('No LambdaType provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                const updatedNode$location = transformLocation(node.location, visitor, ctx);
                changed1 = changed1 || updatedNode$location !== node.location;

                
                let updatedNode$typeVbls = node.typeVbls;
                {
                    let changed2 = false;
                    const arr1 = node.typeVbls.map((updatedNode$typeVbls$item1) => {
                        
                const result = transformTypeVblDecl(updatedNode$typeVbls$item1, visitor, ctx);
                changed2 = changed2 || result !== updatedNode$typeVbls$item1;
                        return result
                    })
                    if (changed2) {
                        updatedNode$typeVbls = arr1;
                        changed1 = true;
                    }
                }
                

                
        let updatedNode$argNames = undefined;
        const updatedNode$argNames$current = node.argNames;
        if (updatedNode$argNames$current != null) {
            
                let updatedNode$argNames$1$ = updatedNode$argNames$current;
                {
                    let changed2 = false;
                    const arr1 = updatedNode$argNames$current.map((updatedNode$argNames$1$$item1) => {
                        
        let result = null;
        const result$current = updatedNode$argNames$1$$item1;
        if (result$current != null) {
            
            let result$2$ = result$current;
            {
                let changed3 = false;
                
                const result$2$$location = transformLocation(result$current.location, visitor, ctx);
                changed3 = changed3 || result$2$$location !== result$current.location;
                if (changed3) {
                    result$2$ =  {...result$2$, location: result$2$$location};
                    changed2 = true;
                }
            }
            
            result = result$2$;
        }
        
                        return result
                    })
                    if (changed2) {
                        updatedNode$argNames$1$ = arr1;
                        changed1 = true;
                    }
                }
                
            updatedNode$argNames = updatedNode$argNames$1$;
        }
        

                
                let updatedNode$args = node.args;
                {
                    let changed2 = false;
                    const arr1 = node.args.map((updatedNode$args$item1) => {
                        
                const result = transformType(updatedNode$args$item1, visitor, ctx);
                changed2 = changed2 || result !== updatedNode$args$item1;
                        return result
                    })
                    if (changed2) {
                        updatedNode$args = arr1;
                        changed1 = true;
                    }
                }
                

                
                let updatedNode$effects = node.effects;
                {
                    let changed2 = false;
                    const arr1 = node.effects.map((updatedNode$effects$item1) => {
                        
                const result = transformEffectRef(updatedNode$effects$item1, visitor, ctx);
                changed2 = changed2 || result !== updatedNode$effects$item1;
                        return result
                    })
                    if (changed2) {
                        updatedNode$effects = arr1;
                        changed1 = true;
                    }
                }
                

                
        let updatedNode$rest = null;
        const updatedNode$rest$current = node.rest;
        if (updatedNode$rest$current != null) {
            
                const updatedNode$rest$1$ = transformType(updatedNode$rest$current, visitor, ctx);
                changed1 = changed1 || updatedNode$rest$1$ !== updatedNode$rest$current;
            updatedNode$rest = updatedNode$rest$1$;
        }
        

                
                const updatedNode$res = transformType(node.res, visitor, ctx);
                changed1 = changed1 || updatedNode$res !== node.res;

                
        let updatedNode$decorators = undefined;
        const updatedNode$decorators$current = node.decorators;
        if (updatedNode$decorators$current != null) {
            
                const updatedNode$decorators$1$ = transformDecorators(updatedNode$decorators$current, visitor, ctx);
                changed1 = changed1 || updatedNode$decorators$1$ !== updatedNode$decorators$current;
            updatedNode$decorators = updatedNode$decorators$1$;
        }
        
                if (changed1) {
                    updatedNode =  {...updatedNode, location: updatedNode$location, typeVbls: updatedNode$typeVbls, argNames: updatedNode$argNames, args: updatedNode$args, effects: updatedNode$effects, rest: updatedNode$rest, res: updatedNode$res, decorators: updatedNode$decorators};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

const transformAmbiguousType = <Ctx>(node: AmbiguousType, visitor: Visitor<Ctx>, ctx: Ctx): AmbiguousType => {
        if (!node) {
            throw new Error('No AmbiguousType provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                const updatedNode$location = transformLocation(node.location, visitor, ctx);
                changed1 = changed1 || updatedNode$location !== node.location;

                
        let updatedNode$decorators = undefined;
        const updatedNode$decorators$current = node.decorators;
        if (updatedNode$decorators$current != null) {
            
                const updatedNode$decorators$1$ = transformDecorators(updatedNode$decorators$current, visitor, ctx);
                changed1 = changed1 || updatedNode$decorators$1$ !== updatedNode$decorators$current;
            updatedNode$decorators = updatedNode$decorators$1$;
        }
        
                if (changed1) {
                    updatedNode =  {...updatedNode, location: updatedNode$location, decorators: updatedNode$decorators};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

const transformCase = <Ctx>(node: Case, visitor: Visitor<Ctx>, ctx: Ctx): Case => {
        if (!node) {
            throw new Error('No Case provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                let updatedNode$args = node.args;
                {
                    let changed2 = false;
                    const arr1 = node.args.map((updatedNode$args$item1) => {
                        
            let result = updatedNode$args$item1;
            {
                let changed3 = false;
                
                const result$type = transformType(updatedNode$args$item1.type, visitor, ctx);
                changed3 = changed3 || result$type !== updatedNode$args$item1.type;
                if (changed3) {
                    result =  {...result, type: result$type};
                    changed2 = true;
                }
            }
            
                        return result
                    })
                    if (changed2) {
                        updatedNode$args = arr1;
                        changed1 = true;
                    }
                }
                

                
            let updatedNode$k = node.k;
            {
                let changed2 = false;
                
                const updatedNode$k$type = transformType(node.k.type, visitor, ctx);
                changed2 = changed2 || updatedNode$k$type !== node.k.type;
                if (changed2) {
                    updatedNode$k =  {...updatedNode$k, type: updatedNode$k$type};
                    changed1 = true;
                }
            }
            

                
                const updatedNode$body = transformTerm(node.body, visitor, ctx);
                changed1 = changed1 || updatedNode$body !== node.body;

                
        let updatedNode$decorators = undefined;
        const updatedNode$decorators$current = node.decorators;
        if (updatedNode$decorators$current != null) {
            
                const updatedNode$decorators$1$ = transformDecorators(updatedNode$decorators$current, visitor, ctx);
                changed1 = changed1 || updatedNode$decorators$1$ !== updatedNode$decorators$current;
            updatedNode$decorators = updatedNode$decorators$1$;
        }
        
                if (changed1) {
                    updatedNode =  {...updatedNode, args: updatedNode$args, k: updatedNode$k, body: updatedNode$body, decorators: updatedNode$decorators};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

const transformLiteralWithTemplateString = <Ctx>(node: LiteralWithTemplateString, visitor: Visitor<Ctx>, ctx: Ctx): LiteralWithTemplateString => {
        if (!node) {
            throw new Error('No LiteralWithTemplateString provided');
        }
        
        let changed0 = false;
        
        let updatedNode = node;
        switch (node.type) {
            case 'string': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, is: updatedNode$0node$is, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'TemplateString': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                let updatedNode$0node$pairs = updatedNode$0specified.pairs;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.pairs.map((updatedNode$0node$pairs$item2) => {
                        
            let result = updatedNode$0node$pairs$item2;
            {
                let changed4 = false;
                
                const result$location = transformLocation(updatedNode$0node$pairs$item2.location, visitor, ctx);
                changed4 = changed4 || result$location !== updatedNode$0node$pairs$item2.location;

                
                const result$contents = transformTerm(updatedNode$0node$pairs$item2.contents, visitor, ctx);
                changed4 = changed4 || result$contents !== updatedNode$0node$pairs$item2.contents;
                if (changed4) {
                    result =  {...result, location: result$location, contents: result$contents};
                    changed3 = true;
                }
            }
            
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$pairs = arr2;
                        changed2 = true;
                    }
                }
                

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, pairs: updatedNode$0node$pairs, location: updatedNode$0node$location, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'float': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'int': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            default: {
                        let changed1 = false;
                        
                const updatedNode$0node = transformBoolean(node, visitor, ctx);
                changed1 = changed1 || updatedNode$0node !== node;
                        updatedNode = updatedNode$0node;
                    }
        }
        return updatedNode;
    }

const transformTerm = <Ctx>(node: Term, visitor: Visitor<Ctx>, ctx: Ctx): Term => {
        if (!node) {
            throw new Error('No Term provided');
        }
        
        const transformed = visitor.Term ? visitor.Term(node, ctx) : null;
        if (transformed === false) {
            return node;
        }
        if (transformed != null) {
            if (Array.isArray(transformed)) {
                ctx = transformed[1];
                if (transformed[0] != null) {
                    node = transformed[0];
                }
            } else {
                node = transformed;
            }
        }
        
        let changed0 = false;
        
        let updatedNode = node;
        switch (node.type) {
            case 'unary': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$inner = transformTerm(updatedNode$0specified.inner, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$inner !== updatedNode$0specified.inner;

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, inner: updatedNode$0node$inner, location: updatedNode$0node$location, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'self': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, is: updatedNode$0node$is, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Record': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
            let updatedNode$0node$subTypes = updatedNode$0specified.subTypes;
            {
                let changed3 = false;
                
                const spread: {[key: string]: {
  covered: boolean;
  spread: Term | null;
  rows: Array<Term | null>;
}} = {};
                Object.keys(updatedNode$0specified.subTypes).forEach(key => {
                    
            let updatedNode$0node$subTypes$value = updatedNode$0specified.subTypes[key];
            {
                let changed4 = false;
                
        let updatedNode$0node$subTypes$value$spread = null;
        const updatedNode$0node$subTypes$value$spread$current = updatedNode$0specified.subTypes[key].spread;
        if (updatedNode$0node$subTypes$value$spread$current != null) {
            
                const updatedNode$0node$subTypes$value$spread$4$ = transformTerm(updatedNode$0node$subTypes$value$spread$current, visitor, ctx);
                changed4 = changed4 || updatedNode$0node$subTypes$value$spread$4$ !== updatedNode$0node$subTypes$value$spread$current;
            updatedNode$0node$subTypes$value$spread = updatedNode$0node$subTypes$value$spread$4$;
        }
        

                
                let updatedNode$0node$subTypes$value$rows = updatedNode$0specified.subTypes[key].rows;
                {
                    let changed5 = false;
                    const arr4 = updatedNode$0specified.subTypes[key].rows.map((updatedNode$0node$subTypes$value$rows$item4) => {
                        
        let result = null;
        const result$current = updatedNode$0node$subTypes$value$rows$item4;
        if (result$current != null) {
            
                const result$5$ = transformTerm(result$current, visitor, ctx);
                changed5 = changed5 || result$5$ !== result$current;
            result = result$5$;
        }
        
                        return result
                    })
                    if (changed5) {
                        updatedNode$0node$subTypes$value$rows = arr4;
                        changed4 = true;
                    }
                }
                
                if (changed4) {
                    updatedNode$0node$subTypes$value =  {...updatedNode$0node$subTypes$value, spread: updatedNode$0node$subTypes$value$spread, rows: updatedNode$0node$subTypes$value$rows};
                    changed3 = true;
                }
            }
            
                    spread[key] = updatedNode$0node$subTypes$value
                })
                
                if (changed3) {
                    updatedNode$0node$subTypes =  {...updatedNode$0node$subTypes, ...spread};
                    changed2 = true;
                }
            }
            

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, is: updatedNode$0node$is, subTypes: updatedNode$0node$subTypes, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Switch': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$term = transformTerm(updatedNode$0specified.term, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$term !== updatedNode$0specified.term;

                
                let updatedNode$0node$cases = updatedNode$0specified.cases;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.cases.map((updatedNode$0node$cases$item2) => {
                        
                const result = transformSwitchCase(updatedNode$0node$cases$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$cases$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$cases = arr2;
                        changed2 = true;
                    }
                }
                

                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, term: updatedNode$0node$term, cases: updatedNode$0node$cases, is: updatedNode$0node$is, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Enum': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$inner = transformTerm(updatedNode$0specified.inner, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$inner !== updatedNode$0specified.inner;

                
                const updatedNode$0node$is = transformTypeReference(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, inner: updatedNode$0node$inner, is: updatedNode$0node$is, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Trace': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                let updatedNode$0node$args = updatedNode$0specified.args;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.args.map((updatedNode$0node$args$item2) => {
                        
                const result = transformTerm(updatedNode$0node$args$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$args$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$args = arr2;
                        changed2 = true;
                    }
                }
                

                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, args: updatedNode$0node$args, is: updatedNode$0node$is, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Array': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
                let updatedNode$0node$items = updatedNode$0specified.items;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.items.map((updatedNode$0node$items$item2) => {
                        
        let result = updatedNode$0node$items$item2;
        switch (updatedNode$0node$items$item2.type) {
            case 'ArraySpread': {
                    const result$3specified = updatedNode$0node$items$item2;
                    let changed4 = false;
                    
            let result$3node = result$3specified;
            {
                let changed5 = false;
                
                const result$3node$value = transformTerm(result$3specified.value, visitor, ctx);
                changed5 = changed5 || result$3node$value !== result$3specified.value;

                
                const result$3node$location = transformLocation(result$3specified.location, visitor, ctx);
                changed5 = changed5 || result$3node$location !== result$3specified.location;

                
        let result$3node$decorators = undefined;
        const result$3node$decorators$current = result$3specified.decorators;
        if (result$3node$decorators$current != null) {
            
                const result$3node$decorators$5$ = transformDecorators(result$3node$decorators$current, visitor, ctx);
                changed5 = changed5 || result$3node$decorators$5$ !== result$3node$decorators$current;
            result$3node$decorators = result$3node$decorators$5$;
        }
        
                if (changed5) {
                    result$3node =  {...result$3node, value: result$3node$value, location: result$3node$location, decorators: result$3node$decorators};
                    changed4 = true;
                }
            }
            
                    result = result$3node;
                    break;
                }

            default: {
                        let changed4 = false;
                        
                const result$3node = transformTerm(updatedNode$0node$items$item2, visitor, ctx);
                changed4 = changed4 || result$3node !== updatedNode$0node$items$item2;
                        result = result$3node;
                    }
        }
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$items = arr2;
                        changed2 = true;
                    }
                }
                

                
                const updatedNode$0node$is = transformTypeReference(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, items: updatedNode$0node$items, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Tuple': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$is = transformTypeReference(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
                let updatedNode$0node$items = updatedNode$0specified.items;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.items.map((updatedNode$0node$items$item2) => {
                        
                const result = transformTerm(updatedNode$0node$items$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$items$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$items = arr2;
                        changed2 = true;
                    }
                }
                

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, is: updatedNode$0node$is, items: updatedNode$0node$items, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'TupleAccess': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
                const updatedNode$0node$target = transformTerm(updatedNode$0specified.target, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$target !== updatedNode$0specified.target;

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, is: updatedNode$0node$is, target: updatedNode$0node$target, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Attribute': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$target = transformTerm(updatedNode$0specified.target, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$target !== updatedNode$0specified.target;

                
        let updatedNode$0node$refTypeVbls = undefined;
        const updatedNode$0node$refTypeVbls$current = updatedNode$0specified.refTypeVbls;
        if (updatedNode$0node$refTypeVbls$current != null) {
            
                let updatedNode$0node$refTypeVbls$2$ = updatedNode$0node$refTypeVbls$current;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0node$refTypeVbls$current.map((updatedNode$0node$refTypeVbls$2$$item2) => {
                        
                const result = transformType(updatedNode$0node$refTypeVbls$2$$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$refTypeVbls$2$$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$refTypeVbls$2$ = arr2;
                        changed2 = true;
                    }
                }
                
            updatedNode$0node$refTypeVbls = updatedNode$0node$refTypeVbls$2$;
        }
        

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
                const updatedNode$0node$idLocation = transformLocation(updatedNode$0specified.idLocation, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$idLocation !== updatedNode$0specified.idLocation;

                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, target: updatedNode$0node$target, refTypeVbls: updatedNode$0node$refTypeVbls, location: updatedNode$0node$location, idLocation: updatedNode$0node$idLocation, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'ref': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'var': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'lambda': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
                let updatedNode$0node$idLocations = updatedNode$0specified.idLocations;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.idLocations.map((updatedNode$0node$idLocations$item2) => {
                        
                const result = transformLocation(updatedNode$0node$idLocations$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$idLocations$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$idLocations = arr2;
                        changed2 = true;
                    }
                }
                

                
                const updatedNode$0node$body = transformTerm(updatedNode$0specified.body, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$body !== updatedNode$0specified.body;

                
                const updatedNode$0node$is = transformLambdaType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, idLocations: updatedNode$0node$idLocations, body: updatedNode$0node$body, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Ambiguous': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                let updatedNode$0node$options = updatedNode$0specified.options;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.options.map((updatedNode$0node$options$item2) => {
                        
                const result = transformTerm(updatedNode$0node$options$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$options$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$options = arr2;
                        changed2 = true;
                    }
                }
                

                
                const updatedNode$0node$is = transformAmbiguousType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, options: updatedNode$0node$options, is: updatedNode$0node$is, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'TypeError': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
                const updatedNode$0node$inner = transformTerm(updatedNode$0specified.inner, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$inner !== updatedNode$0specified.inner;

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, is: updatedNode$0node$is, inner: updatedNode$0node$inner, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'NotFound': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, is: updatedNode$0node$is, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Hole': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, is: updatedNode$0node$is, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'raise': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
                let updatedNode$0node$args = updatedNode$0specified.args;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.args.map((updatedNode$0node$args$item2) => {
                        
                const result = transformTerm(updatedNode$0node$args$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$args$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$args = arr2;
                        changed2 = true;
                    }
                }
                

                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, args: updatedNode$0node$args, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'handle': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
                const updatedNode$0node$target = transformTerm(updatedNode$0specified.target, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$target !== updatedNode$0specified.target;

                
                let updatedNode$0node$cases = updatedNode$0specified.cases;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.cases.map((updatedNode$0node$cases$item2) => {
                        
                const result = transformCase(updatedNode$0node$cases$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$cases$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$cases = arr2;
                        changed2 = true;
                    }
                }
                

                
            let updatedNode$0node$pure = updatedNode$0specified.pure;
            {
                let changed3 = false;
                
                const updatedNode$0node$pure$body = transformTerm(updatedNode$0specified.pure.body, visitor, ctx);
                changed3 = changed3 || updatedNode$0node$pure$body !== updatedNode$0specified.pure.body;
                if (changed3) {
                    updatedNode$0node$pure =  {...updatedNode$0node$pure, body: updatedNode$0node$pure$body};
                    changed2 = true;
                }
            }
            

                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, target: updatedNode$0node$target, cases: updatedNode$0node$cases, pure: updatedNode$0node$pure, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'if': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
                const updatedNode$0node$cond = transformTerm(updatedNode$0specified.cond, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$cond !== updatedNode$0specified.cond;

                
                const updatedNode$0node$yes = transformTerm(updatedNode$0specified.yes, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$yes !== updatedNode$0specified.yes;

                
        let updatedNode$0node$no = null;
        const updatedNode$0node$no$current = updatedNode$0specified.no;
        if (updatedNode$0node$no$current != null) {
            
                const updatedNode$0node$no$2$ = transformTerm(updatedNode$0node$no$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$no$2$ !== updatedNode$0node$no$current;
            updatedNode$0node$no = updatedNode$0node$no$2$;
        }
        

                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, cond: updatedNode$0node$cond, yes: updatedNode$0node$yes, no: updatedNode$0node$no, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'sequence': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
                let updatedNode$0node$sts = updatedNode$0specified.sts;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.sts.map((updatedNode$0node$sts$item2) => {
                        
        let result = updatedNode$0node$sts$item2;
        switch (updatedNode$0node$sts$item2.type) {
            case 'Let': {
                    const result$3specified = updatedNode$0node$sts$item2;
                    let changed4 = false;
                    
            let result$3node = result$3specified;
            {
                let changed5 = false;
                
                const result$3node$location = transformLocation(result$3specified.location, visitor, ctx);
                changed5 = changed5 || result$3node$location !== result$3specified.location;

                
                const result$3node$idLocation = transformLocation(result$3specified.idLocation, visitor, ctx);
                changed5 = changed5 || result$3node$idLocation !== result$3specified.idLocation;

                
                const result$3node$value = transformTerm(result$3specified.value, visitor, ctx);
                changed5 = changed5 || result$3node$value !== result$3specified.value;

                
                const result$3node$is = transformType(result$3specified.is, visitor, ctx);
                changed5 = changed5 || result$3node$is !== result$3specified.is;

                
        let result$3node$decorators = undefined;
        const result$3node$decorators$current = result$3specified.decorators;
        if (result$3node$decorators$current != null) {
            
                const result$3node$decorators$5$ = transformDecorators(result$3node$decorators$current, visitor, ctx);
                changed5 = changed5 || result$3node$decorators$5$ !== result$3node$decorators$current;
            result$3node$decorators = result$3node$decorators$5$;
        }
        
                if (changed5) {
                    result$3node =  {...result$3node, location: result$3node$location, idLocation: result$3node$idLocation, value: result$3node$value, is: result$3node$is, decorators: result$3node$decorators};
                    changed4 = true;
                }
            }
            
                    result = result$3node;
                    break;
                }

            default: {
                        let changed4 = false;
                        
                const result$3node = transformTerm(updatedNode$0node$sts$item2, visitor, ctx);
                changed4 = changed4 || result$3node !== updatedNode$0node$sts$item2;
                        result = result$3node;
                    }
        }
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$sts = arr2;
                        changed2 = true;
                    }
                }
                

                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, sts: updatedNode$0node$sts, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'apply': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
                const updatedNode$0node$target = transformTerm(updatedNode$0specified.target, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$target !== updatedNode$0specified.target;

                
                let updatedNode$0node$typeVbls = updatedNode$0specified.typeVbls;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.typeVbls.map((updatedNode$0node$typeVbls$item2) => {
                        
                const result = transformType(updatedNode$0node$typeVbls$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$typeVbls$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$typeVbls = arr2;
                        changed2 = true;
                    }
                }
                

                
        let updatedNode$0node$effectVbls = null;
        const updatedNode$0node$effectVbls$current = updatedNode$0specified.effectVbls;
        if (updatedNode$0node$effectVbls$current != null) {
            
                let updatedNode$0node$effectVbls$2$ = updatedNode$0node$effectVbls$current;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0node$effectVbls$current.map((updatedNode$0node$effectVbls$2$$item2) => {
                        
                const result = transformEffectRef(updatedNode$0node$effectVbls$2$$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$effectVbls$2$$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$effectVbls$2$ = arr2;
                        changed2 = true;
                    }
                }
                
            updatedNode$0node$effectVbls = updatedNode$0node$effectVbls$2$;
        }
        

                
                let updatedNode$0node$args = updatedNode$0specified.args;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.args.map((updatedNode$0node$args$item2) => {
                        
                const result = transformTerm(updatedNode$0node$args$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$args$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$args = arr2;
                        changed2 = true;
                    }
                }
                

                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
        let updatedNode$0node$decorators = undefined;
        const updatedNode$0node$decorators$current = updatedNode$0specified.decorators;
        if (updatedNode$0node$decorators$current != null) {
            
                const updatedNode$0node$decorators$2$ = transformDecorators(updatedNode$0node$decorators$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$decorators$2$ !== updatedNode$0node$decorators$current;
            updatedNode$0node$decorators = updatedNode$0node$decorators$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, target: updatedNode$0node$target, typeVbls: updatedNode$0node$typeVbls, effectVbls: updatedNode$0node$effectVbls, args: updatedNode$0node$args, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            default: {
                        let changed1 = false;
                        
                const updatedNode$0node = transformLiteralWithTemplateString(node, visitor, ctx);
                changed1 = changed1 || updatedNode$0node !== node;
                        updatedNode = updatedNode$0node;
                    }
        }
        
        node = updatedNode;
        if (visitor.TermPost) {
            const transformed = visitor.TermPost(node, ctx);
            if (transformed != null) {
                node = transformed;
            }
        }
        return node;
        
    }

const transformLet = <Ctx>(node: Let, visitor: Visitor<Ctx>, ctx: Ctx): Let => {
        if (!node) {
            throw new Error('No Let provided');
        }
        
        const transformed = visitor.Let ? visitor.Let(node, ctx) : null;
        if (transformed === false) {
            return node;
        }
        if (transformed != null) {
            if (Array.isArray(transformed)) {
                ctx = transformed[1];
                if (transformed[0] != null) {
                    node = transformed[0];
                }
            } else {
                node = transformed;
            }
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                const updatedNode$location = transformLocation(node.location, visitor, ctx);
                changed1 = changed1 || updatedNode$location !== node.location;

                
                const updatedNode$idLocation = transformLocation(node.idLocation, visitor, ctx);
                changed1 = changed1 || updatedNode$idLocation !== node.idLocation;

                
                const updatedNode$value = transformTerm(node.value, visitor, ctx);
                changed1 = changed1 || updatedNode$value !== node.value;

                
                const updatedNode$is = transformType(node.is, visitor, ctx);
                changed1 = changed1 || updatedNode$is !== node.is;

                
        let updatedNode$decorators = undefined;
        const updatedNode$decorators$current = node.decorators;
        if (updatedNode$decorators$current != null) {
            
                const updatedNode$decorators$1$ = transformDecorators(updatedNode$decorators$current, visitor, ctx);
                changed1 = changed1 || updatedNode$decorators$1$ !== updatedNode$decorators$current;
            updatedNode$decorators = updatedNode$decorators$1$;
        }
        
                if (changed1) {
                    updatedNode =  {...updatedNode, location: updatedNode$location, idLocation: updatedNode$idLocation, value: updatedNode$value, is: updatedNode$is, decorators: updatedNode$decorators};
                    changed0 = true;
                }
            }
            
        
        node = updatedNode;
        if (visitor.LetPost) {
            const transformed = visitor.LetPost(node, ctx);
            if (transformed != null) {
                node = transformed;
            }
        }
        return node;
        
    }

const transformEffectDef = <Ctx>(node: EffectDef, visitor: Visitor<Ctx>, ctx: Ctx): EffectDef => {
        if (!node) {
            throw new Error('No EffectDef provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                let updatedNode$constrs = node.constrs;
                {
                    let changed2 = false;
                    const arr1 = node.constrs.map((updatedNode$constrs$item1) => {
                        
            let result = updatedNode$constrs$item1;
            {
                let changed3 = false;
                
                let result$args = updatedNode$constrs$item1.args;
                {
                    let changed4 = false;
                    const arr3 = updatedNode$constrs$item1.args.map((result$args$item3) => {
                        
                const result = transformType(result$args$item3, visitor, ctx);
                changed4 = changed4 || result !== result$args$item3;
                        return result
                    })
                    if (changed4) {
                        result$args = arr3;
                        changed3 = true;
                    }
                }
                

                
                const result$ret = transformType(updatedNode$constrs$item1.ret, visitor, ctx);
                changed3 = changed3 || result$ret !== updatedNode$constrs$item1.ret;
                if (changed3) {
                    result =  {...result, args: result$args, ret: result$ret};
                    changed2 = true;
                }
            }
            
                        return result
                    })
                    if (changed2) {
                        updatedNode$constrs = arr1;
                        changed1 = true;
                    }
                }
                

                
                const updatedNode$location = transformLocation(node.location, visitor, ctx);
                changed1 = changed1 || updatedNode$location !== node.location;

                
        let updatedNode$decorators = undefined;
        const updatedNode$decorators$current = node.decorators;
        if (updatedNode$decorators$current != null) {
            
                const updatedNode$decorators$1$ = transformDecorators(updatedNode$decorators$current, visitor, ctx);
                changed1 = changed1 || updatedNode$decorators$1$ !== updatedNode$decorators$current;
            updatedNode$decorators = updatedNode$decorators$1$;
        }
        
                if (changed1) {
                    updatedNode =  {...updatedNode, constrs: updatedNode$constrs, location: updatedNode$location, decorators: updatedNode$decorators};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

const transformDecoratorDefArg = <Ctx>(node: DecoratorDefArg, visitor: Visitor<Ctx>, ctx: Ctx): DecoratorDefArg => {
        if (!node) {
            throw new Error('No DecoratorDefArg provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                const updatedNode$argLocation = transformLocation(node.argLocation, visitor, ctx);
                changed1 = changed1 || updatedNode$argLocation !== node.argLocation;

                
                const updatedNode$location = transformLocation(node.location, visitor, ctx);
                changed1 = changed1 || updatedNode$location !== node.location;

                
        let updatedNode$type = null;
        const updatedNode$type$current = node.type;
        if (updatedNode$type$current != null) {
            
                const updatedNode$type$1$ = transformType(updatedNode$type$current, visitor, ctx);
                changed1 = changed1 || updatedNode$type$1$ !== updatedNode$type$current;
            updatedNode$type = updatedNode$type$1$;
        }
        
                if (changed1) {
                    updatedNode =  {...updatedNode, argLocation: updatedNode$argLocation, location: updatedNode$location, type: updatedNode$type};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

const transformDecoratorDef = <Ctx>(node: DecoratorDef, visitor: Visitor<Ctx>, ctx: Ctx): DecoratorDef => {
        if (!node) {
            throw new Error('No DecoratorDef provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                let updatedNode$arguments = node.arguments;
                {
                    let changed2 = false;
                    const arr1 = node.arguments.map((updatedNode$arguments$item1) => {
                        
                const result = transformDecoratorDefArg(updatedNode$arguments$item1, visitor, ctx);
                changed2 = changed2 || result !== updatedNode$arguments$item1;
                        return result
                    })
                    if (changed2) {
                        updatedNode$arguments = arr1;
                        changed1 = true;
                    }
                }
                

                
                let updatedNode$typeVbls = node.typeVbls;
                {
                    let changed2 = false;
                    const arr1 = node.typeVbls.map((updatedNode$typeVbls$item1) => {
                        
                const result = transformTypeVblDecl(updatedNode$typeVbls$item1, visitor, ctx);
                changed2 = changed2 || result !== updatedNode$typeVbls$item1;
                        return result
                    })
                    if (changed2) {
                        updatedNode$typeVbls = arr1;
                        changed1 = true;
                    }
                }
                

                
                let updatedNode$typeArgs = node.typeArgs;
                {
                    let changed2 = false;
                    const arr1 = node.typeArgs.map((updatedNode$typeArgs$item1) => {
                        
            let result = updatedNode$typeArgs$item1;
            {
                let changed3 = false;
                
                const result$location = transformLocation(updatedNode$typeArgs$item1.location, visitor, ctx);
                changed3 = changed3 || result$location !== updatedNode$typeArgs$item1.location;
                if (changed3) {
                    result =  {...result, location: result$location};
                    changed2 = true;
                }
            }
            
                        return result
                    })
                    if (changed2) {
                        updatedNode$typeArgs = arr1;
                        changed1 = true;
                    }
                }
                

                
        let updatedNode$restArg = null;
        const updatedNode$restArg$current = node.restArg;
        if (updatedNode$restArg$current != null) {
            
            let updatedNode$restArg$1$ = updatedNode$restArg$current;
            {
                let changed2 = false;
                
                const updatedNode$restArg$1$$argLocation = transformLocation(updatedNode$restArg$current.argLocation, visitor, ctx);
                changed2 = changed2 || updatedNode$restArg$1$$argLocation !== updatedNode$restArg$current.argLocation;

                
                const updatedNode$restArg$1$$location = transformLocation(updatedNode$restArg$current.location, visitor, ctx);
                changed2 = changed2 || updatedNode$restArg$1$$location !== updatedNode$restArg$current.location;

                
        let updatedNode$restArg$1$$type = null;
        const updatedNode$restArg$1$$type$current = updatedNode$restArg$current.type;
        if (updatedNode$restArg$1$$type$current != null) {
            
                const updatedNode$restArg$1$$type$2$ = transformType(updatedNode$restArg$1$$type$current, visitor, ctx);
                changed2 = changed2 || updatedNode$restArg$1$$type$2$ !== updatedNode$restArg$1$$type$current;
            updatedNode$restArg$1$$type = updatedNode$restArg$1$$type$2$;
        }
        
                if (changed2) {
                    updatedNode$restArg$1$ =  {...updatedNode$restArg$1$, argLocation: updatedNode$restArg$1$$argLocation, location: updatedNode$restArg$1$$location, type: updatedNode$restArg$1$$type};
                    changed1 = true;
                }
            }
            
            updatedNode$restArg = updatedNode$restArg$1$;
        }
        

                
        let updatedNode$targetType = null;
        const updatedNode$targetType$current = node.targetType;
        if (updatedNode$targetType$current != null) {
            
                const updatedNode$targetType$1$ = transformType(updatedNode$targetType$current, visitor, ctx);
                changed1 = changed1 || updatedNode$targetType$1$ !== updatedNode$targetType$current;
            updatedNode$targetType = updatedNode$targetType$1$;
        }
        

                
                const updatedNode$location = transformLocation(node.location, visitor, ctx);
                changed1 = changed1 || updatedNode$location !== node.location;
                if (changed1) {
                    updatedNode =  {...updatedNode, arguments: updatedNode$arguments, typeVbls: updatedNode$typeVbls, typeArgs: updatedNode$typeArgs, restArg: updatedNode$restArg, targetType: updatedNode$targetType, location: updatedNode$location};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

const transformUserTypeReference = <Ctx>(node: UserTypeReference, visitor: Visitor<Ctx>, ctx: Ctx): UserTypeReference => {
        if (!node) {
            throw new Error('No UserTypeReference provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                const updatedNode$location = transformLocation(node.location, visitor, ctx);
                changed1 = changed1 || updatedNode$location !== node.location;

                
                let updatedNode$typeVbls = node.typeVbls;
                {
                    let changed2 = false;
                    const arr1 = node.typeVbls.map((updatedNode$typeVbls$item1) => {
                        
                const result = transformType(updatedNode$typeVbls$item1, visitor, ctx);
                changed2 = changed2 || result !== updatedNode$typeVbls$item1;
                        return result
                    })
                    if (changed2) {
                        updatedNode$typeVbls = arr1;
                        changed1 = true;
                    }
                }
                

                
        let updatedNode$decorators = undefined;
        const updatedNode$decorators$current = node.decorators;
        if (updatedNode$decorators$current != null) {
            
                const updatedNode$decorators$1$ = transformDecorators(updatedNode$decorators$current, visitor, ctx);
                changed1 = changed1 || updatedNode$decorators$1$ !== updatedNode$decorators$current;
            updatedNode$decorators = updatedNode$decorators$1$;
        }
        
                if (changed1) {
                    updatedNode =  {...updatedNode, location: updatedNode$location, typeVbls: updatedNode$typeVbls, decorators: updatedNode$decorators};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

const transformEnumDef = <Ctx>(node: EnumDef, visitor: Visitor<Ctx>, ctx: Ctx): EnumDef => {
        if (!node) {
            throw new Error('No EnumDef provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                const updatedNode$location = transformLocation(node.location, visitor, ctx);
                changed1 = changed1 || updatedNode$location !== node.location;

                
                let updatedNode$typeVbls = node.typeVbls;
                {
                    let changed2 = false;
                    const arr1 = node.typeVbls.map((updatedNode$typeVbls$item1) => {
                        
                const result = transformTypeVblDecl(updatedNode$typeVbls$item1, visitor, ctx);
                changed2 = changed2 || result !== updatedNode$typeVbls$item1;
                        return result
                    })
                    if (changed2) {
                        updatedNode$typeVbls = arr1;
                        changed1 = true;
                    }
                }
                

                
                let updatedNode$extends = node.extends;
                {
                    let changed2 = false;
                    const arr1 = node.extends.map((updatedNode$extends$item1) => {
                        
                const result = transformUserTypeReference(updatedNode$extends$item1, visitor, ctx);
                changed2 = changed2 || result !== updatedNode$extends$item1;
                        return result
                    })
                    if (changed2) {
                        updatedNode$extends = arr1;
                        changed1 = true;
                    }
                }
                

                
                let updatedNode$items = node.items;
                {
                    let changed2 = false;
                    const arr1 = node.items.map((updatedNode$items$item1) => {
                        
                const result = transformUserTypeReference(updatedNode$items$item1, visitor, ctx);
                changed2 = changed2 || result !== updatedNode$items$item1;
                        return result
                    })
                    if (changed2) {
                        updatedNode$items = arr1;
                        changed1 = true;
                    }
                }
                

                
        let updatedNode$decorators = undefined;
        const updatedNode$decorators$current = node.decorators;
        if (updatedNode$decorators$current != null) {
            
                const updatedNode$decorators$1$ = transformDecorators(updatedNode$decorators$current, visitor, ctx);
                changed1 = changed1 || updatedNode$decorators$1$ !== updatedNode$decorators$current;
            updatedNode$decorators = updatedNode$decorators$1$;
        }
        
                if (changed1) {
                    updatedNode =  {...updatedNode, location: updatedNode$location, typeVbls: updatedNode$typeVbls, extends: updatedNode$extends, items: updatedNode$items, decorators: updatedNode$decorators};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

const transformRecordDef = <Ctx>(node: RecordDef, visitor: Visitor<Ctx>, ctx: Ctx): RecordDef => {
        if (!node) {
            throw new Error('No RecordDef provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                const updatedNode$location = transformLocation(node.location, visitor, ctx);
                changed1 = changed1 || updatedNode$location !== node.location;

                
                let updatedNode$typeVbls = node.typeVbls;
                {
                    let changed2 = false;
                    const arr1 = node.typeVbls.map((updatedNode$typeVbls$item1) => {
                        
                const result = transformTypeVblDecl(updatedNode$typeVbls$item1, visitor, ctx);
                changed2 = changed2 || result !== updatedNode$typeVbls$item1;
                        return result
                    })
                    if (changed2) {
                        updatedNode$typeVbls = arr1;
                        changed1 = true;
                    }
                }
                

                
                let updatedNode$items = node.items;
                {
                    let changed2 = false;
                    const arr1 = node.items.map((updatedNode$items$item1) => {
                        
                const result = transformType(updatedNode$items$item1, visitor, ctx);
                changed2 = changed2 || result !== updatedNode$items$item1;
                        return result
                    })
                    if (changed2) {
                        updatedNode$items = arr1;
                        changed1 = true;
                    }
                }
                

                
        let updatedNode$decorators = undefined;
        const updatedNode$decorators$current = node.decorators;
        if (updatedNode$decorators$current != null) {
            
                const updatedNode$decorators$1$ = transformDecorators(updatedNode$decorators$current, visitor, ctx);
                changed1 = changed1 || updatedNode$decorators$1$ !== updatedNode$decorators$current;
            updatedNode$decorators = updatedNode$decorators$1$;
        }
        

                
        let updatedNode$defaults = undefined;
        const updatedNode$defaults$current = node.defaults;
        if (updatedNode$defaults$current != null) {
            
            let updatedNode$defaults$1$ = updatedNode$defaults$current;
            {
                let changed2 = false;
                
                const spread: {[key: string]: {
  // Null for the toplevel record
  id: null | Id;
  idx: number;
  value: Term;
}} = {};
                Object.keys(updatedNode$defaults$current).forEach(key => {
                    
            let updatedNode$defaults$1$$value = updatedNode$defaults$current[key];
            {
                let changed3 = false;
                
                const updatedNode$defaults$1$$value$value = transformTerm(updatedNode$defaults$current[key].value, visitor, ctx);
                changed3 = changed3 || updatedNode$defaults$1$$value$value !== updatedNode$defaults$current[key].value;
                if (changed3) {
                    updatedNode$defaults$1$$value =  {...updatedNode$defaults$1$$value, value: updatedNode$defaults$1$$value$value};
                    changed2 = true;
                }
            }
            
                    spread[key] = updatedNode$defaults$1$$value
                })
                
                if (changed2) {
                    updatedNode$defaults$1$ =  {...updatedNode$defaults$1$, ...spread};
                    changed1 = true;
                }
            }
            
            updatedNode$defaults = updatedNode$defaults$1$;
        }
        
                if (changed1) {
                    updatedNode =  {...updatedNode, location: updatedNode$location, typeVbls: updatedNode$typeVbls, items: updatedNode$items, decorators: updatedNode$decorators, defaults: updatedNode$defaults};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

const transformToplevelRecord = <Ctx>(node: ToplevelRecord, visitor: Visitor<Ctx>, ctx: Ctx): ToplevelRecord => {
        if (!node) {
            throw new Error('No ToplevelRecord provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                const updatedNode$def = transformRecordDef(node.def, visitor, ctx);
                changed1 = changed1 || updatedNode$def !== node.def;

                
                const updatedNode$location = transformLocation(node.location, visitor, ctx);
                changed1 = changed1 || updatedNode$location !== node.location;
                if (changed1) {
                    updatedNode =  {...updatedNode, def: updatedNode$def, location: updatedNode$location};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

const transformToplevelT = <Ctx>(node: ToplevelT, visitor: Visitor<Ctx>, ctx: Ctx): ToplevelT => {
        if (!node) {
            throw new Error('No ToplevelT provided');
        }
        
        const transformed = visitor.ToplevelT ? visitor.ToplevelT(node, ctx) : null;
        if (transformed === false) {
            return node;
        }
        if (transformed != null) {
            if (Array.isArray(transformed)) {
                ctx = transformed[1];
                if (transformed[0] != null) {
                    node = transformed[0];
                }
            } else {
                node = transformed;
            }
        }
        
        let changed0 = false;
        
        let updatedNode = node;
        switch (node.type) {
            case 'Effect': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$effect = transformEffectDef(updatedNode$0specified.effect, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$effect !== updatedNode$0specified.effect;

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, effect: updatedNode$0node$effect, location: updatedNode$0node$location};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Decorator': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
                const updatedNode$0node$defn = transformDecoratorDef(updatedNode$0specified.defn, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$defn !== updatedNode$0specified.defn;
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, defn: updatedNode$0node$defn};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Expression': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$term = transformTerm(updatedNode$0specified.term, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$term !== updatedNode$0specified.term;

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, term: updatedNode$0node$term, location: updatedNode$0node$location};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Define': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$term = transformTerm(updatedNode$0specified.term, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$term !== updatedNode$0specified.term;

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, term: updatedNode$0node$term, location: updatedNode$0node$location};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'EnumDef': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$def = transformEnumDef(updatedNode$0specified.def, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$def !== updatedNode$0specified.def;

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
                let updatedNode$0node$inner = updatedNode$0specified.inner;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.inner.map((updatedNode$0node$inner$item2) => {
                        
                const result = transformToplevelRecord(updatedNode$0node$inner$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$inner$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$inner = arr2;
                        changed2 = true;
                    }
                }
                
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, def: updatedNode$0node$def, location: updatedNode$0node$location, inner: updatedNode$0node$inner};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            default: {
                        let changed1 = false;
                        
                const updatedNode$0node = transformToplevelRecord(node, visitor, ctx);
                changed1 = changed1 || updatedNode$0node !== node;
                        updatedNode = updatedNode$0node;
                    }
        }
        
        node = updatedNode;
        if (visitor.ToplevelTPost) {
            const transformed = visitor.ToplevelTPost(node, ctx);
            if (transformed != null) {
                node = transformed;
            }
        }
        return node;
        
    }