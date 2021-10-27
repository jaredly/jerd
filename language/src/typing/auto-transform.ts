import {Term, Location, Loc, Type, TypeVblDecl, Id, Symbol, Decorators, Decorator, DecoratorArg, Pattern, TypeReference, Reference, UserReference, RecordPatternItem, ErrorPattern, InvalidRecordPattern, EffectVblDecl, EffectRef, ErrorType, TypeHole, RecordBaseConcrete, RecordSubType, SwitchCase, LambdaType, Case, ErrorTerm, AmbiguousType, Record, UnusedAttribute, InvalidApplication, Let, ToplevelT, EffectDef, DecoratorDef, DecoratorDefArg, EnumDef, UserTypeReference, ToplevelRecord, RecordDef} from './types';

export type Visitor<Ctx> = {
    Term?: (node: Term, ctx: Ctx) => null | false | Term | [Term | null, Ctx]
                TermPost?: (node: Term, ctx: Ctx) => null | Term,
    Pattern?: (node: Pattern, ctx: Ctx) => null | false | Pattern | [Pattern | null, Ctx]
                PatternPost?: (node: Pattern, ctx: Ctx) => null | Pattern,
    Let?: (node: Let, ctx: Ctx) => null | false | Let | [Let | null, Ctx]
                LetPost?: (node: Let, ctx: Ctx) => null | Let,
    ToplevelT?: (node: ToplevelT, ctx: Ctx) => null | false | ToplevelT | [ToplevelT | null, Ctx]
                ToplevelTPost?: (node: ToplevelT, ctx: Ctx) => null | ToplevelT,
    Type?: (node: Type, ctx: Ctx) => null | false | Type | [Type | null, Ctx]
                TypePost?: (node: Type, ctx: Ctx) => null | Type,
    Location?: (node: Location, ctx: Ctx) => null | false | Location | [Location | null, Ctx]
                LocationPost?: (node: Location, ctx: Ctx) => null | Location,
    Reference?: (node: Reference, ctx: Ctx) => null | false | Reference | [Reference | null, Ctx]
                ReferencePost?: (node: Reference, ctx: Ctx) => null | Reference,
    EffectRef?: (node: EffectRef, ctx: Ctx) => null | false | EffectRef | [EffectRef | null, Ctx]
                EffectRefPost?: (node: EffectRef, ctx: Ctx) => null | EffectRef,
    UserTypeReference?: (node: UserTypeReference, ctx: Ctx) => null | false | UserTypeReference | [UserTypeReference | null, Ctx]
                UserTypeReferencePost?: (node: UserTypeReference, ctx: Ctx) => null | UserTypeReference,
    UserReference?: (node: UserReference, ctx: Ctx) => null | false | UserReference | [UserReference | null, Ctx]
                UserReferencePost?: (node: UserReference, ctx: Ctx) => null | UserReference,
    Decorator?: (node: Decorator, ctx: Ctx) => null | false | Decorator | [Decorator | null, Ctx]
                DecoratorPost?: (node: Decorator, ctx: Ctx) => null | Decorator
}
// not a type Loc

export const transformLocation = <Ctx>(node: Location, visitor: Visitor<Ctx>, ctx: Ctx): Location => {
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

// not a type Array

// no transformer for Symbol

export const transformUserReference = <Ctx>(node: UserReference, visitor: Visitor<Ctx>, ctx: Ctx): UserReference => {
        if (!node) {
            throw new Error('No UserReference provided');
        }
        
        const transformed = visitor.UserReference ? visitor.UserReference(node, ctx) : null;
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
        if (visitor.UserReferencePost) {
            const transformed = visitor.UserReferencePost(node, ctx);
            if (transformed != null) {
                node = transformed;
            }
        }
        return node;
        
    }

export const transformReference = <Ctx>(node: Reference, visitor: Visitor<Ctx>, ctx: Ctx): Reference => {
        if (!node) {
            throw new Error('No Reference provided');
        }
        
        const transformed = visitor.Reference ? visitor.Reference(node, ctx) : null;
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
        if (visitor.ReferencePost) {
            const transformed = visitor.ReferencePost(node, ctx);
            if (transformed != null) {
                node = transformed;
            }
        }
        return node;
        
    }

export const transformTypeReference = <Ctx>(node: TypeReference, visitor: Visitor<Ctx>, ctx: Ctx): TypeReference => {
        if (!node) {
            throw new Error('No TypeReference provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                const updatedNode$ref = transformReference(node.ref, visitor, ctx);
                changed1 = changed1 || updatedNode$ref !== node.ref;

                
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
                    updatedNode =  {...updatedNode, ref: updatedNode$ref, location: updatedNode$location, typeVbls: updatedNode$typeVbls, decorators: updatedNode$decorators};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

export const transformRecordPatternItem = <Ctx>(node: RecordPatternItem, visitor: Visitor<Ctx>, ctx: Ctx): RecordPatternItem => {
        if (!node) {
            throw new Error('No RecordPatternItem provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                const updatedNode$ref = transformUserReference(node.ref, visitor, ctx);
                changed1 = changed1 || updatedNode$ref !== node.ref;

                
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
                    updatedNode =  {...updatedNode, ref: updatedNode$ref, location: updatedNode$location, pattern: updatedNode$pattern, is: updatedNode$is, decorators: updatedNode$decorators};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

export const transformInvalidRecordPattern = <Ctx>(node: InvalidRecordPattern, visitor: Visitor<Ctx>, ctx: Ctx): InvalidRecordPattern => {
        if (!node) {
            throw new Error('No InvalidRecordPattern provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                const updatedNode$inner = transformPattern(node.inner, visitor, ctx);
                changed1 = changed1 || updatedNode$inner !== node.inner;

                
                let updatedNode$items = node.items;
                {
                    let changed2 = false;
                    const arr1 = node.items.map((updatedNode$items$item1) => {
                        
                const result = transformRecordPatternItem(updatedNode$items$item1, visitor, ctx);
                changed2 = changed2 || result !== updatedNode$items$item1;
                        return result
                    })
                    if (changed2) {
                        updatedNode$items = arr1;
                        changed1 = true;
                    }
                }
                

                
                let updatedNode$extraItems = node.extraItems;
                {
                    let changed2 = false;
                    const arr1 = node.extraItems.map((updatedNode$extraItems$item1) => {
                        
            let result = updatedNode$extraItems$item1;
            {
                let changed3 = false;
                
                const result$pattern = transformPattern(updatedNode$extraItems$item1.pattern, visitor, ctx);
                changed3 = changed3 || result$pattern !== updatedNode$extraItems$item1.pattern;
                if (changed3) {
                    result =  {...result, pattern: result$pattern};
                    changed2 = true;
                }
            }
            
                        return result
                    })
                    if (changed2) {
                        updatedNode$extraItems = arr1;
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
                    updatedNode =  {...updatedNode, inner: updatedNode$inner, items: updatedNode$items, extraItems: updatedNode$extraItems, location: updatedNode$location, decorators: updatedNode$decorators};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

export const transformErrorPattern = <Ctx>(node: ErrorPattern, visitor: Visitor<Ctx>, ctx: Ctx): ErrorPattern => {
        if (!node) {
            throw new Error('No ErrorPattern provided');
        }
        
        let changed0 = false;
        
        let updatedNode = node;
        switch (node.type) {
            case 'PHole': {
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

            case 'PTypeError': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$inner = transformPattern(updatedNode$0specified.inner, visitor, ctx);
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

            case 'PNotFound': {
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

            case 'DuplicateSpread': {
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

            default: {
                        let changed1 = false;
                        
                const updatedNode$0node = transformInvalidRecordPattern(node, visitor, ctx);
                changed1 = changed1 || updatedNode$0node !== node;
                        updatedNode = updatedNode$0node;
                    }
        }
        return updatedNode;
    }

export const transformPattern = <Ctx>(node: Pattern, visitor: Visitor<Ctx>, ctx: Ctx): Pattern => {
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

            case 'boolean': {
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

            default: {
                        let changed1 = false;
                        
                const updatedNode$0node = transformErrorPattern(node, visitor, ctx);
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

export const transformDecoratorArg = <Ctx>(node: DecoratorArg, visitor: Visitor<Ctx>, ctx: Ctx): DecoratorArg => {
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

export const transformDecorator = <Ctx>(node: Decorator, visitor: Visitor<Ctx>, ctx: Ctx): Decorator => {
        if (!node) {
            throw new Error('No Decorator provided');
        }
        
        const transformed = visitor.Decorator ? visitor.Decorator(node, ctx) : null;
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
            
        
        node = updatedNode;
        if (visitor.DecoratorPost) {
            const transformed = visitor.DecoratorPost(node, ctx);
            if (transformed != null) {
                node = transformed;
            }
        }
        return node;
        
    }

export const transformDecorators = <Ctx>(node: Decorators, visitor: Visitor<Ctx>, ctx: Ctx): Decorators => {
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

export const transformTypeVblDecl = <Ctx>(node: TypeVblDecl, visitor: Visitor<Ctx>, ctx: Ctx): TypeVblDecl => {
        if (!node) {
            throw new Error('No TypeVblDecl provided');
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

export const transformEffectVblDecl = <Ctx>(node: EffectVblDecl, visitor: Visitor<Ctx>, ctx: Ctx): EffectVblDecl => {
        if (!node) {
            throw new Error('No EffectVblDecl provided');
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

export const transformEffectRef = <Ctx>(node: EffectRef, visitor: Visitor<Ctx>, ctx: Ctx): EffectRef => {
        if (!node) {
            throw new Error('No EffectRef provided');
        }
        
        const transformed = visitor.EffectRef ? visitor.EffectRef(node, ctx) : null;
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
            case 'ref': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$ref = transformReference(updatedNode$0specified.ref, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$ref !== updatedNode$0specified.ref;

                
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
                    updatedNode$0node =  {...updatedNode$0node, ref: updatedNode$0node$ref, location: updatedNode$0node$location};
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
        
        node = updatedNode;
        if (visitor.EffectRefPost) {
            const transformed = visitor.EffectRefPost(node, ctx);
            if (transformed != null) {
                node = transformed;
            }
        }
        return node;
        
    }

export const transformTypeHole = <Ctx>(node: TypeHole, visitor: Visitor<Ctx>, ctx: Ctx): TypeHole => {
        if (!node) {
            throw new Error('No TypeHole provided');
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

export const transformErrorType = <Ctx>(node: ErrorType, visitor: Visitor<Ctx>, ctx: Ctx): ErrorType => {
        if (!node) {
            throw new Error('No ErrorType provided');
        }
        
        let changed0 = false;
        
        let updatedNode = node;
        switch (node.type) {
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

            case 'TNotFound': {
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

            case 'InvalidTypeApplication': {
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
        

                
                const updatedNode$0node$inner = transformType(updatedNode$0specified.inner, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$inner !== updatedNode$0specified.inner;

                
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
                
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators, inner: updatedNode$0node$inner, typeVbls: updatedNode$0node$typeVbls};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'NotASubType': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$inner = transformType(updatedNode$0specified.inner, visitor, ctx);
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

            default: {
                        let changed1 = false;
                        
                const updatedNode$0node = transformTypeHole(node, visitor, ctx);
                changed1 = changed1 || updatedNode$0node !== node;
                        updatedNode = updatedNode$0node;
                    }
        }
        return updatedNode;
    }

export const transformType = <Ctx>(node: Type, visitor: Visitor<Ctx>, ctx: Ctx): Type => {
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
                

                
                let updatedNode$0node$effectVbls = updatedNode$0specified.effectVbls;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.effectVbls.map((updatedNode$0node$effectVbls$item2) => {
                        
                const result = transformEffectVblDecl(updatedNode$0node$effectVbls$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$effectVbls$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$effectVbls = arr2;
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
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, typeVbls: updatedNode$0node$typeVbls, effectVbls: updatedNode$0node$effectVbls, argNames: updatedNode$0node$argNames, args: updatedNode$0node$args, effects: updatedNode$0node$effects, rest: updatedNode$0node$rest, res: updatedNode$0node$res, decorators: updatedNode$0node$decorators};
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
                
                const updatedNode$0node$ref = transformReference(updatedNode$0specified.ref, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$ref !== updatedNode$0specified.ref;

                
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
                    updatedNode$0node =  {...updatedNode$0node, ref: updatedNode$0node$ref, location: updatedNode$0node$location, typeVbls: updatedNode$0node$typeVbls, decorators: updatedNode$0node$decorators};
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
                        
                const updatedNode$0node = transformErrorType(node, visitor, ctx);
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

export const transformRecordBaseConcrete = <Ctx>(node: RecordBaseConcrete, visitor: Visitor<Ctx>, ctx: Ctx): RecordBaseConcrete => {
        if (!node) {
            throw new Error('No RecordBaseConcrete provided');
        }
        
        let changed0 = false;
        
        let updatedNode = node;
        switch (node.type) {
            case 'Concrete': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$ref = transformUserReference(updatedNode$0specified.ref, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$ref !== updatedNode$0specified.ref;

                
                let updatedNode$0node$rows = updatedNode$0specified.rows;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.rows.map((updatedNode$0node$rows$item2) => {
                        
        let result = null;
        const result$current = updatedNode$0node$rows$item2;
        if (result$current != null) {
            
                const result$3$ = transformTerm(result$current, visitor, ctx);
                changed3 = changed3 || result$3$ !== result$current;
            result = result$3$;
        }
        
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$rows = arr2;
                        changed2 = true;
                    }
                }
                

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;

                
        let updatedNode$0node$spread = null;
        const updatedNode$0node$spread$current = updatedNode$0specified.spread;
        if (updatedNode$0node$spread$current != null) {
            
                const updatedNode$0node$spread$2$ = transformTerm(updatedNode$0node$spread$current, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$spread$2$ !== updatedNode$0node$spread$current;
            updatedNode$0node$spread = updatedNode$0node$spread$2$;
        }
        
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, ref: updatedNode$0node$ref, rows: updatedNode$0node$rows, location: updatedNode$0node$location, spread: updatedNode$0node$spread};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'Variable': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$spread = transformTerm(updatedNode$0specified.spread, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$spread !== updatedNode$0specified.spread;

                
                const updatedNode$0node$location = transformLocation(updatedNode$0specified.location, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$location !== updatedNode$0specified.location;
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, spread: updatedNode$0node$spread, location: updatedNode$0node$location};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }
        }
        return updatedNode;
    }

export const transformRecordSubType = <Ctx>(node: RecordSubType, visitor: Visitor<Ctx>, ctx: Ctx): RecordSubType => {
        if (!node) {
            throw new Error('No RecordSubType provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
        let updatedNode$spread = null;
        const updatedNode$spread$current = node.spread;
        if (updatedNode$spread$current != null) {
            
                const updatedNode$spread$1$ = transformTerm(updatedNode$spread$current, visitor, ctx);
                changed1 = changed1 || updatedNode$spread$1$ !== updatedNode$spread$current;
            updatedNode$spread = updatedNode$spread$1$;
        }
        

                
                let updatedNode$rows = node.rows;
                {
                    let changed2 = false;
                    const arr1 = node.rows.map((updatedNode$rows$item1) => {
                        
        let result = null;
        const result$current = updatedNode$rows$item1;
        if (result$current != null) {
            
                const result$2$ = transformTerm(result$current, visitor, ctx);
                changed2 = changed2 || result$2$ !== result$current;
            result = result$2$;
        }
        
                        return result
                    })
                    if (changed2) {
                        updatedNode$rows = arr1;
                        changed1 = true;
                    }
                }
                
                if (changed1) {
                    updatedNode =  {...updatedNode, spread: updatedNode$spread, rows: updatedNode$rows};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

export const transformSwitchCase = <Ctx>(node: SwitchCase, visitor: Visitor<Ctx>, ctx: Ctx): SwitchCase => {
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

export const transformLambdaType = <Ctx>(node: LambdaType, visitor: Visitor<Ctx>, ctx: Ctx): LambdaType => {
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
                

                
                let updatedNode$effectVbls = node.effectVbls;
                {
                    let changed2 = false;
                    const arr1 = node.effectVbls.map((updatedNode$effectVbls$item1) => {
                        
                const result = transformEffectVblDecl(updatedNode$effectVbls$item1, visitor, ctx);
                changed2 = changed2 || result !== updatedNode$effectVbls$item1;
                        return result
                    })
                    if (changed2) {
                        updatedNode$effectVbls = arr1;
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
                    updatedNode =  {...updatedNode, location: updatedNode$location, typeVbls: updatedNode$typeVbls, effectVbls: updatedNode$effectVbls, argNames: updatedNode$argNames, args: updatedNode$args, effects: updatedNode$effects, rest: updatedNode$rest, res: updatedNode$res, decorators: updatedNode$decorators};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

export const transformCase = <Ctx>(node: Case, visitor: Visitor<Ctx>, ctx: Ctx): Case => {
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

export const transformAmbiguousType = <Ctx>(node: AmbiguousType, visitor: Visitor<Ctx>, ctx: Ctx): AmbiguousType => {
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

export const transformRecord = <Ctx>(node: Record, visitor: Visitor<Ctx>, ctx: Ctx): Record => {
        if (!node) {
            throw new Error('No Record provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                const updatedNode$base = transformRecordBaseConcrete(node.base, visitor, ctx);
                changed1 = changed1 || updatedNode$base !== node.base;

                
                const updatedNode$is = transformType(node.is, visitor, ctx);
                changed1 = changed1 || updatedNode$is !== node.is;

                
            let updatedNode$subTypes = node.subTypes;
            {
                let changed2 = false;
                
                const spread: {[key: string]: RecordSubType} = {};
                Object.keys(node.subTypes).forEach(key => {
                    
                const updatedNode$subTypes$value = transformRecordSubType(node.subTypes[key], visitor, ctx);
                changed2 = changed2 || updatedNode$subTypes$value !== node.subTypes[key];
                    spread[key] = updatedNode$subTypes$value
                })
                
                if (changed2) {
                    updatedNode$subTypes =  {...updatedNode$subTypes, ...spread};
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
                    updatedNode =  {...updatedNode, base: updatedNode$base, is: updatedNode$is, subTypes: updatedNode$subTypes, location: updatedNode$location, decorators: updatedNode$decorators};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

export const transformUnusedAttribute = <Ctx>(node: UnusedAttribute, visitor: Visitor<Ctx>, ctx: Ctx): UnusedAttribute => {
        if (!node) {
            throw new Error('No UnusedAttribute provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                const updatedNode$value = transformTerm(node.value, visitor, ctx);
                changed1 = changed1 || updatedNode$value !== node.value;
                if (changed1) {
                    updatedNode =  {...updatedNode, value: updatedNode$value};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

export const transformInvalidApplication = <Ctx>(node: InvalidApplication, visitor: Visitor<Ctx>, ctx: Ctx): InvalidApplication => {
        if (!node) {
            throw new Error('No InvalidApplication provided');
        }
        
        let changed0 = false;
        
            let updatedNode = node;
            {
                let changed1 = false;
                
                const updatedNode$is = transformType(node.is, visitor, ctx);
                changed1 = changed1 || updatedNode$is !== node.is;

                
                const updatedNode$target = transformTerm(node.target, visitor, ctx);
                changed1 = changed1 || updatedNode$target !== node.target;

                
                let updatedNode$extraArgs = node.extraArgs;
                {
                    let changed2 = false;
                    const arr1 = node.extraArgs.map((updatedNode$extraArgs$item1) => {
                        
                const result = transformTerm(updatedNode$extraArgs$item1, visitor, ctx);
                changed2 = changed2 || result !== updatedNode$extraArgs$item1;
                        return result
                    })
                    if (changed2) {
                        updatedNode$extraArgs = arr1;
                        changed1 = true;
                    }
                }
                

                
                let updatedNode$extraTypeArgs = node.extraTypeArgs;
                {
                    let changed2 = false;
                    const arr1 = node.extraTypeArgs.map((updatedNode$extraTypeArgs$item1) => {
                        
                const result = transformType(updatedNode$extraTypeArgs$item1, visitor, ctx);
                changed2 = changed2 || result !== updatedNode$extraTypeArgs$item1;
                        return result
                    })
                    if (changed2) {
                        updatedNode$extraTypeArgs = arr1;
                        changed1 = true;
                    }
                }
                

                
                let updatedNode$extraEffectArgs = node.extraEffectArgs;
                {
                    let changed2 = false;
                    const arr1 = node.extraEffectArgs.map((updatedNode$extraEffectArgs$item1) => {
                        
                const result = transformEffectRef(updatedNode$extraEffectArgs$item1, visitor, ctx);
                changed2 = changed2 || result !== updatedNode$extraEffectArgs$item1;
                        return result
                    })
                    if (changed2) {
                        updatedNode$extraEffectArgs = arr1;
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
                    updatedNode =  {...updatedNode, is: updatedNode$is, target: updatedNode$target, extraArgs: updatedNode$extraArgs, extraTypeArgs: updatedNode$extraTypeArgs, extraEffectArgs: updatedNode$extraEffectArgs, location: updatedNode$location, decorators: updatedNode$decorators};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

export const transformErrorTerm = <Ctx>(node: ErrorTerm, visitor: Visitor<Ctx>, ctx: Ctx): ErrorTerm => {
        if (!node) {
            throw new Error('No ErrorTerm provided');
        }
        
        let changed0 = false;
        
        let updatedNode = node;
        switch (node.type) {
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

            case 'InvalidRecordAttributes': {
                    const updatedNode$0specified = node;
                    let changed1 = false;
                    
            let updatedNode$0node = updatedNode$0specified;
            {
                let changed2 = false;
                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
                const updatedNode$0node$inner = transformRecord(updatedNode$0specified.inner, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$inner !== updatedNode$0specified.inner;

                
                let updatedNode$0node$extraAttributes = updatedNode$0specified.extraAttributes;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.extraAttributes.map((updatedNode$0node$extraAttributes$item2) => {
                        
                const result = transformUnusedAttribute(updatedNode$0node$extraAttributes$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$extraAttributes$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$extraAttributes = arr2;
                        changed2 = true;
                    }
                }
                

                
                let updatedNode$0node$extraSpreads = updatedNode$0specified.extraSpreads;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.extraSpreads.map((updatedNode$0node$extraSpreads$item2) => {
                        
                const result = transformTerm(updatedNode$0node$extraSpreads$item2, visitor, ctx);
                changed3 = changed3 || result !== updatedNode$0node$extraSpreads$item2;
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$extraSpreads = arr2;
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
                    updatedNode$0node =  {...updatedNode$0node, is: updatedNode$0node$is, inner: updatedNode$0node$inner, extraAttributes: updatedNode$0node$extraAttributes, extraSpreads: updatedNode$0node$extraSpreads, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            case 'InvalidAttribute': {
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
        

                
                const updatedNode$0node$inner = transformTerm(updatedNode$0specified.inner, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$inner !== updatedNode$0specified.inner;
                if (changed2) {
                    updatedNode$0node =  {...updatedNode$0node, is: updatedNode$0node$is, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators, inner: updatedNode$0node$inner};
                    changed1 = true;
                }
            }
            
                    updatedNode = updatedNode$0node;
                    break;
                }

            default: {
                        let changed1 = false;
                        
                const updatedNode$0node = transformInvalidApplication(node, visitor, ctx);
                changed1 = changed1 || updatedNode$0node !== node;
                        updatedNode = updatedNode$0node;
                    }
        }
        return updatedNode;
    }

export const transformTerm = <Ctx>(node: Term, visitor: Visitor<Ctx>, ctx: Ctx): Term => {
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
                
                const updatedNode$0node$base = transformRecordBaseConcrete(updatedNode$0specified.base, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$base !== updatedNode$0specified.base;

                
                const updatedNode$0node$is = transformType(updatedNode$0specified.is, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$is !== updatedNode$0specified.is;

                
            let updatedNode$0node$subTypes = updatedNode$0specified.subTypes;
            {
                let changed3 = false;
                
                const spread: {[key: string]: RecordSubType} = {};
                Object.keys(updatedNode$0specified.subTypes).forEach(key => {
                    
                const updatedNode$0node$subTypes$value = transformRecordSubType(updatedNode$0specified.subTypes[key], visitor, ctx);
                changed3 = changed3 || updatedNode$0node$subTypes$value !== updatedNode$0specified.subTypes[key];
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
                    updatedNode$0node =  {...updatedNode$0node, base: updatedNode$0node$base, is: updatedNode$0node$is, subTypes: updatedNode$0node$subTypes, location: updatedNode$0node$location, decorators: updatedNode$0node$decorators};
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

                
                const updatedNode$0node$ref = transformReference(updatedNode$0specified.ref, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$ref !== updatedNode$0specified.ref;

                
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
                    updatedNode$0node =  {...updatedNode$0node, target: updatedNode$0node$target, ref: updatedNode$0node$ref, refTypeVbls: updatedNode$0node$refTypeVbls, location: updatedNode$0node$location, idLocation: updatedNode$0node$idLocation, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
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

                
                const updatedNode$0node$ref = transformReference(updatedNode$0specified.ref, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$ref !== updatedNode$0specified.ref;

                
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
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, ref: updatedNode$0node$ref, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
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

                
                let updatedNode$0node$args = updatedNode$0specified.args;
                {
                    let changed3 = false;
                    const arr2 = updatedNode$0specified.args.map((updatedNode$0node$args$item2) => {
                        
            let result = updatedNode$0node$args$item2;
            {
                let changed4 = false;
                
                const result$location = transformLocation(updatedNode$0node$args$item2.location, visitor, ctx);
                changed4 = changed4 || result$location !== updatedNode$0node$args$item2.location;
                if (changed4) {
                    result =  {...result, location: result$location};
                    changed3 = true;
                }
            }
            
                        return result
                    })
                    if (changed3) {
                        updatedNode$0node$args = arr2;
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
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, args: updatedNode$0node$args, body: updatedNode$0node$body, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
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

                
                const updatedNode$0node$ref = transformReference(updatedNode$0specified.ref, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$ref !== updatedNode$0specified.ref;

                
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
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, ref: updatedNode$0node$ref, args: updatedNode$0node$args, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
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

                
                const updatedNode$0node$effect = transformReference(updatedNode$0specified.effect, visitor, ctx);
                changed2 = changed2 || updatedNode$0node$effect !== updatedNode$0specified.effect;

                
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
                    updatedNode$0node =  {...updatedNode$0node, location: updatedNode$0node$location, target: updatedNode$0node$target, effect: updatedNode$0node$effect, cases: updatedNode$0node$cases, pure: updatedNode$0node$pure, is: updatedNode$0node$is, decorators: updatedNode$0node$decorators};
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

                
            let result$3node$binding = result$3specified.binding;
            {
                let changed6 = false;
                
                const result$3node$binding$location = transformLocation(result$3specified.binding.location, visitor, ctx);
                changed6 = changed6 || result$3node$binding$location !== result$3specified.binding.location;
                if (changed6) {
                    result$3node$binding =  {...result$3node$binding, location: result$3node$binding$location};
                    changed5 = true;
                }
            }
            

                
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
                    result$3node =  {...result$3node, location: result$3node$location, binding: result$3node$binding, value: result$3node$value, is: result$3node$is, decorators: result$3node$decorators};
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

            case 'boolean': {
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

            default: {
                        let changed1 = false;
                        
                const updatedNode$0node = transformErrorTerm(node, visitor, ctx);
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

export const transformLet = <Ctx>(node: Let, visitor: Visitor<Ctx>, ctx: Ctx): Let => {
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

                
            let updatedNode$binding = node.binding;
            {
                let changed2 = false;
                
                const updatedNode$binding$location = transformLocation(node.binding.location, visitor, ctx);
                changed2 = changed2 || updatedNode$binding$location !== node.binding.location;
                if (changed2) {
                    updatedNode$binding =  {...updatedNode$binding, location: updatedNode$binding$location};
                    changed1 = true;
                }
            }
            

                
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
                    updatedNode =  {...updatedNode, location: updatedNode$location, binding: updatedNode$binding, value: updatedNode$value, is: updatedNode$is, decorators: updatedNode$decorators};
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

export const transformEffectDef = <Ctx>(node: EffectDef, visitor: Visitor<Ctx>, ctx: Ctx): EffectDef => {
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

export const transformDecoratorDefArg = <Ctx>(node: DecoratorDefArg, visitor: Visitor<Ctx>, ctx: Ctx): DecoratorDefArg => {
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

export const transformDecoratorDef = <Ctx>(node: DecoratorDef, visitor: Visitor<Ctx>, ctx: Ctx): DecoratorDef => {
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
            
                const updatedNode$restArg$1$ = transformDecoratorDefArg(updatedNode$restArg$current, visitor, ctx);
                changed1 = changed1 || updatedNode$restArg$1$ !== updatedNode$restArg$current;
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

export const transformUserTypeReference = <Ctx>(node: UserTypeReference, visitor: Visitor<Ctx>, ctx: Ctx): UserTypeReference => {
        if (!node) {
            throw new Error('No UserTypeReference provided');
        }
        
        const transformed = visitor.UserTypeReference ? visitor.UserTypeReference(node, ctx) : null;
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
                
                const updatedNode$ref = transformUserReference(node.ref, visitor, ctx);
                changed1 = changed1 || updatedNode$ref !== node.ref;

                
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
                    updatedNode =  {...updatedNode, ref: updatedNode$ref, location: updatedNode$location, typeVbls: updatedNode$typeVbls, decorators: updatedNode$decorators};
                    changed0 = true;
                }
            }
            
        
        node = updatedNode;
        if (visitor.UserTypeReferencePost) {
            const transformed = visitor.UserTypeReferencePost(node, ctx);
            if (transformed != null) {
                node = transformed;
            }
        }
        return node;
        
    }

export const transformEnumDef = <Ctx>(node: EnumDef, visitor: Visitor<Ctx>, ctx: Ctx): EnumDef => {
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
                

                
                let updatedNode$effectVbls = node.effectVbls;
                {
                    let changed2 = false;
                    const arr1 = node.effectVbls.map((updatedNode$effectVbls$item1) => {
                        
                const result = transformEffectVblDecl(updatedNode$effectVbls$item1, visitor, ctx);
                changed2 = changed2 || result !== updatedNode$effectVbls$item1;
                        return result
                    })
                    if (changed2) {
                        updatedNode$effectVbls = arr1;
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
                    updatedNode =  {...updatedNode, location: updatedNode$location, typeVbls: updatedNode$typeVbls, effectVbls: updatedNode$effectVbls, extends: updatedNode$extends, items: updatedNode$items, decorators: updatedNode$decorators};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

export const transformRecordDef = <Ctx>(node: RecordDef, visitor: Visitor<Ctx>, ctx: Ctx): RecordDef => {
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
                

                
                let updatedNode$effectVbls = node.effectVbls;
                {
                    let changed2 = false;
                    const arr1 = node.effectVbls.map((updatedNode$effectVbls$item1) => {
                        
                const result = transformEffectVblDecl(updatedNode$effectVbls$item1, visitor, ctx);
                changed2 = changed2 || result !== updatedNode$effectVbls$item1;
                        return result
                    })
                    if (changed2) {
                        updatedNode$effectVbls = arr1;
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
        

                
            let updatedNode$defaults = node.defaults;
            {
                let changed2 = false;
                
                const spread: {[key: string]: {
  // Null for the toplevel record
  id: null | Id;
  idx: number;
  value: Term;
}} = {};
                Object.keys(node.defaults).forEach(key => {
                    
            let updatedNode$defaults$value = node.defaults[key];
            {
                let changed3 = false;
                
                const updatedNode$defaults$value$value = transformTerm(node.defaults[key].value, visitor, ctx);
                changed3 = changed3 || updatedNode$defaults$value$value !== node.defaults[key].value;
                if (changed3) {
                    updatedNode$defaults$value =  {...updatedNode$defaults$value, value: updatedNode$defaults$value$value};
                    changed2 = true;
                }
            }
            
                    spread[key] = updatedNode$defaults$value
                })
                
                if (changed2) {
                    updatedNode$defaults =  {...updatedNode$defaults, ...spread};
                    changed1 = true;
                }
            }
            
                if (changed1) {
                    updatedNode =  {...updatedNode, location: updatedNode$location, typeVbls: updatedNode$typeVbls, effectVbls: updatedNode$effectVbls, extends: updatedNode$extends, items: updatedNode$items, decorators: updatedNode$decorators, defaults: updatedNode$defaults};
                    changed0 = true;
                }
            }
            
        return updatedNode;
    }

export const transformToplevelRecord = <Ctx>(node: ToplevelRecord, visitor: Visitor<Ctx>, ctx: Ctx): ToplevelRecord => {
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

export const transformToplevelT = <Ctx>(node: ToplevelT, visitor: Visitor<Ctx>, ctx: Ctx): ToplevelT => {
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
export const isErrorTerm = (value: ErrorTerm | Term): value is ErrorTerm => {
        switch (value.type) {
            case "Ambiguous":
        case "TypeError":
        case "NotFound":
        case "Hole":
        case "InvalidRecordAttributes":
        case "InvalidAttribute":
        case "InvalidApplication":
                return true
            default:
                return false
        }
    }
export const isErrorType = (value: ErrorType | Type): value is ErrorType => {
        switch (value.type) {
            case "Ambiguous":
        case "TNotFound":
        case "InvalidTypeApplication":
        case "NotASubType":
        case "THole":
                return true
            default:
                return false
        }
    }
export const isErrorPattern = (value: ErrorPattern | Pattern): value is ErrorPattern => {
        switch (value.type) {
            case "PHole":
        case "PTypeError":
        case "PNotFound":
        case "DuplicateSpread":
        case "ErrorRecordPattern":
                return true
            default:
                return false
        }
    }