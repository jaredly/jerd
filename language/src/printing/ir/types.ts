// types for the IR

import {
    // Type,
    Symbol,
    Id,
    Reference,
    // LambdaType,
    UserReference,
    idsEqual,
    Env,
    GlobalEnv,
    LocalEnv,
    TypeVblDecl,
    refsEqual,
    symbolsEqual,
    typeVblDeclsEqual,
    EffectReference,
    EffectRef,
    Location,
} from '../../typing/types';

export type Loc = Location;

export type EffectHandlers = {
    [key: string]: Expr;
};

export type CPS = {
    done: Expr;
    handlers: EffectHandlers;
};

export type OutputOptions = {
    readonly limitExecutionTime?: boolean;
    readonly explicitHandlerFns?: boolean;
};

// export type IREnv = {
//     global: GlobalEnv,
//     local: LocalEnv,
//     depth: number,
//     effectHandlers: {[hey: string]: Expr}
// }

// hrm where do I put comments in life

//             -
//             o
// Ok, so the ]=[
//             o
//             -

// Ok, so the IR doesn't have effects, right?
// That's one of the main ideas.
// Does the IR have type variables?
// Yes?
// because js can, and monomoriphising is probably too large
// And then another level, where we remove the type variables, right?
// And then would I have these things be parameterized by the `Type`?
// rggggggggggggg yeah I mean I guess so?

export type TypeReference = {
    type: 'ref';
    ref: Reference;
    loc: Loc;
    typeVbls: Array<Type>;
};
export type Type =
    | {
          type: 'var';
          sym: Symbol;
          loc: Loc;
      }
    | TypeReference
    | LambdaType
    | CPSLambdaType
    | DoneLambdaType
    | EffectHandler
    | MaybeEffLambda;
export type EffectHandler = {
    type: 'effect-handler';
    ref: Reference;
    loc: Loc;
};
export type MaybeEffLambda = {
    type: 'effectful-or-direct';
    effectful: CPSLambdaType;
    direct: LambdaType;
    loc: Loc;
};

export type LambdaType = {
    type: 'lambda';
    loc: Location;
    typeVbls: Array<TypeVblDecl>; // hmm how about subtypes. Do we keep those?
    args: Array<Type>;
    rest: Type | null;
    res: Type;
    note?: string;
};

export type CPSLambdaType = {
    type: 'cps-lambda';
    loc: Location;
    typeVbls: Array<TypeVblDecl>; // hmm how about subtypes. Do we keep those?
    args: Array<Type>;
    // TODO: effectVbls?
    effectVbls: Array<number>;
    effects: Array<EffectRef>;
    returnValue: Type; // NOTE: This is the `done`'s returnValue type
    note?: string;
};

export type DoneLambdaType = {
    type: 'done-lambda';
    loc: Location;
    // Umm do we need this?
    // typeVbls: Array<TypeVblDecl>; // hmm how about subtypes. Do we keep those?
    // args: Array<Type>;
    effects: Array<EffectReference>;
    returnValue: Type;
};

export type Toplevel =
    | { type: 'Define'; id: Id; body: Expr; is: Type; loc: Loc }
    | { type: 'Expression'; body: Expr; loc: Loc }
    | { type: 'Enum'; id: Id } // does this even need a reified representation?
    | {
          type: 'Record';
          id: Id;
          items: Array<{ id: Id; idx: number; is: Type }>;
          loc: Loc;
      }
    | {
          type: 'Effect';
          id: Id;
          items: Array<{ args: Array<Type>; res: Type }>;
          loc: Loc;
      };

export type Define = {
    type: 'Define';
    sym: Symbol;
    value: Expr | null;
    is: Type;
    loc: Loc;
    fakeInit?: boolean;
};
export type Assign = {
    type: 'Assign';
    sym: Symbol;
    value: Expr;
    is: Type;
    loc: Loc;
};
export type ReturnStmt = { type: 'Return'; value: Expr; loc: Loc };

export type LoopBounds = {
    end: Expr;
    op: '<=' | '<' | '>' | '>=';
    step: Apply;
    sym: Symbol;
};

export type Stmt =
    | { type: 'Expression'; expr: Expr; loc: Loc }
    | Define
    | Assign
    | { type: 'if'; cond: Expr; yes: Block; no: Block | null; loc: Loc }
    | { type: 'MatchFail'; loc: Loc }
    | ReturnStmt
    // Do I also want a "for-in" or a "for-range" stmt type?
    // or do I just want to optimize a recursive function w/ switch +
    // array destructuring?
    // or I could just have Array.forEach
    // Ok but also: optional :somethingsomething: "Bounds"?
    //
    | {
          type: 'Loop';
          body: Block;
          loc: Loc;
          bounds?: LoopBounds;
      }
    | { type: 'Continue'; loc: Loc }
    | { type: 'Break'; loc: Loc }
    | Block;
export type Block = { type: 'Block'; items: Array<Stmt>; loc: Loc };

export const isTerm = (expr: Expr, id: Id) =>
    expr.type === 'term' && idsEqual(id, expr.id);

export const typeForLambdaExpression = (body: Block): Type | null => {
    return returnTypeForStmt(body);
};

export const returnTypeForStmt = (stmt: Stmt): Type | null => {
    switch (stmt.type) {
        case 'Assign':
        case 'Continue':
        case 'MatchFail':
        case 'Expression':
        case 'Define':
        case 'Break':
            return null;
        case 'Return':
            return stmt.value.is;
        case 'Block':
            const types = stmt.items
                .map((s) => returnTypeForStmt(s))
                .filter((t) => t != null) as Array<Type>;
            if (types.length > 1) {
                for (let i = 1; i < types.length; i++) {
                    if (!typesEqual(types[i], types[0])) {
                        throw new Error(
                            `Return types don't agree. This is a compiler error.`,
                        );
                    }
                }
            }
            // TODO ensure the types line up? Do I need to do that here?
            return types.length === 0 ? null : types[0];
        case 'Loop':
            return returnTypeForStmt(stmt.body);
        case 'if':
            return (
                returnTypeForStmt(stmt.yes) ||
                (stmt.no ? returnTypeForStmt(stmt.no) : null)
            );
        default:
            let _x: never = stmt;
            throw new Error(`Unexpected stmt ${(stmt as any).type}`);
    }
};

// const _ = (e: Expr) => {
//     // Assert that all Exprs have `is` type definitions
//     const t: Type = e.is;
// };

// Record creation ... I'll want a second pass to bring that up to a statement level I think
// so that I can support go or python...
// also I don't support effects in record creation just yet.
// oh wait, I think go and python can create records just fine
export type Literal =
    | { type: 'string'; value: string; loc: Loc; is: Type }
    | { type: 'int'; value: number; loc: Loc; is: Type }
    | { type: 'boolean'; value: boolean; loc: Loc; is: Type }
    | { type: 'float'; value: number; loc: Loc; is: Type };
export type Var = { type: 'var'; sym: Symbol; loc: Loc; is: Type };

export type Enum = { type: 'Enum'; is: TypeReference; inner: Expr; loc: Loc };

export type SpecializeEnum = {
    type: 'SpecializeEnum';
    inner: Expr;
    // Could either be a smaller enum, or a record
    is: TypeReference;
    loc: Location;
};

export type Expr =
    | Literal
    | Enum
    | SpecializeEnum
    | { type: 'unary'; inner: Expr; is: Type; loc: Loc; op: string }
    | { type: 'eqLiteral'; value: Expr; literal: Literal; loc: Loc; is: Type }
    | { type: 'term'; id: Id; loc: Loc; is: Type }
    | { type: 'genTerm'; loc: Loc; is: Type; id: string }
    | Var
    | {
          type: 'slice';
          value: Expr;
          start: Expr;
          end: Expr | null;
          loc: Loc;
          is: Type;
      }
    | { type: 'arrayIndex'; value: Expr; idx: Expr; loc: Loc; is: Type }
    | { type: 'arrayLen'; value: Expr; loc: Loc; is: Type } // TODO this could just be represented with a buitin, right? yeah
    | { type: 'builtin'; name: string; loc: Loc; is: Type }
    // used in switches
    | { type: 'IsRecord'; value: Expr; ref: UserReference; loc: Loc; is: Type }
    | {
          type: 'effectfulOrDirect';
          effectful: boolean;
          target: Expr;
          loc: Loc;
          is: Type;
      }
    // TODO: these will go away, right
    | {
          type: 'raise';
          effect: Id;
          idx: number;
          args: Array<Expr>;
          done: Expr;
          loc: Loc;
          is: Type;
      }
    | {
          type: 'handle';
          target: Expr;
          effect: Id;
          loc: Loc;
          pure: { arg: Symbol; body: Block; argType: Type };
          cases: Array<{
              constr: number;
              args: Array<{ sym: Symbol; type: Type }>;
              k: { sym: Symbol; type: Type };
              body: Block;
          }>;
          done: Expr | null;
          is: Type;
      }
    | Tuple
    | {
          type: 'array';
          items: Array<Expr | { type: 'Spread'; value: Expr }>;
          elType: Type;
          loc: Loc;
          is: Type;
      }
    | Record
    | { type: 'tupleAccess'; target: Expr; idx: number; loc: Loc; is: Type }
    | { type: 'Trace'; args: Array<Expr>; is: Type; idx: number; loc: Loc }
    | {
          type: 'attribute';
          target: Expr;
          ref: Reference;
          idx: number;
          loc: Loc;
          is: Type;
      }
    // effects have been taken care of at this point
    // do we need to know the types of things? perhaps for conversions?
    | Apply
    | {
          type: 'effectfulOrDirectLambda';
          effectful: LambdaExpr;
          direct: LambdaExpr;
          loc: Loc;
          is: Type;
      }
    | LambdaExpr;

export type Tuple = {
    type: 'tuple';
    items: Array<Expr>;
    loc: Loc;
    is: Type;
};
export type Apply = {
    type: 'apply';
    typeVbls: Array<Type>;
    target: Expr;
    args: Array<Expr>;
    note?: string;
    loc: Loc;
    is: Type;
};
export type Record = {
    type: 'record';
    base:
        | { type: 'Variable'; var: Symbol; spread: Expr }
        | {
              type: 'Concrete';
              ref: UserReference;
              rows: Array<Expr | null>;
              spread: Expr | null;
          }; // here we do clone and setValues and such
    is: Type;
    subTypes: {
        [id: string]: RecordSubType;
    };
    loc: Loc;
};
export type RecordSubType = {
    spread: Expr | null;
    rows: Array<Expr | null>;
};
export type LambdaExpr = {
    type: 'lambda';
    args: Array<Arg>;
    res: Type;
    body: Block;
    loc: Loc;
    is: LambdaType | CPSLambdaType;
    tags?: Array<string>;
    note?: string;
};

export type RecordDef = {
    type: 'Record';
    unique: number;
    location: Location;
    typeVbls: Array<TypeVblDecl>; // TODO: kind, row etc.
    extends: Array<Id>;
    items: Array<Type>;
    ffi: { tag: string; names: Array<string> } | null;
};

export type Arg = { sym: Symbol; type: Type; loc: Loc };
// and that's all folks

export const typesEqual = (one: Type | null, two: Type | null): boolean => {
    if (one == null || two == null) {
        return one == two;
    }
    if (one.type === 'effect-handler' && two.type === 'effect-handler') {
        return refsEqual(one.ref, two.ref);
    }
    if (one.type === 'ref' || two.type === 'ref') {
        // HACK: We should be able to remove the `unknown` types
        if (
            one.type === 'ref' &&
            one.ref.type === 'builtin' &&
            one.ref.name === 'unknown'
        ) {
            return true;
        }
        if (
            two.type === 'ref' &&
            two.ref.type === 'builtin' &&
            two.ref.name === 'unknown'
        ) {
            return true;
        }

        if (one.type === 'ref' && two.type === 'ref') {
            return refsEqual(one.ref, two.ref);
        }
        if (one.type === 'ref' && one.ref.type === 'builtin') {
            return two.type === 'ref' && refsEqual(one.ref, two.ref);
        }
        if (two.type === 'ref' && two.ref.type === 'builtin') {
            return one.type === 'ref' && refsEqual(two.ref, one.ref);
        }
        // STOPSHIP: resolve type references
        // throw new Error(`Need to lookup types sorry`);
        return false;
    }
    if (one.type === 'var') {
        return two.type === 'var' && symbolsEqual(one.sym, two.sym);
    }
    if (one.type === 'lambda') {
        return (
            two.type === 'lambda' &&
            one.typeVbls.length === two.typeVbls.length &&
            one.typeVbls.every((v, i) =>
                typeVblDeclsEqual(v, two.typeVbls[i]),
            ) &&
            one.args.length === two.args.length &&
            one.args.every((arg, i) => typesEqual(arg, two.args[i])) &&
            typesEqual(one.res, two.res) &&
            typesEqual(one.rest, two.rest)
        );
    }
    return false;
};
