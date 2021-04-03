// types for the IR

import {
    Type,
    Symbol,
    Id,
    Reference,
    LambdaType,
    UserReference,
} from '../../typing/types';
import { Location } from '../../parsing/parser';
import { builtinType } from '../../typing/preset';

export type Loc = Location | null;
export const handlerSym = { name: 'handlers', unique: 0 };
export const handlersType = builtinType('handlers');

export type OutputOptions = {
    readonly limitExecutionTime?: boolean;
};

// hrm where do I put comments in life

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

export type Stmt =
    | { type: 'Expression'; expr: Expr; loc: Loc }
    | { type: 'Define'; sym: Symbol; value: Expr | null; is: Type; loc: Loc }
    | { type: 'Assign'; sym: Symbol; value: Expr; is: Type; loc: Loc }
    | { type: 'if'; cond: Expr; yes: Block; no: Block | null; loc: Loc }
    | { type: 'MatchFail'; loc: Loc }
    | { type: 'Return'; value: Expr; loc: Loc }
    // Do I also want a "for-in" or a "for-range" stmt type?
    // or do I just want to optimize a recursive function w/ switch +
    // array destructuring?
    // or I could just have Array.forEach
    // | { type: 'Loop'; body: Block; loc: Loc }
    | Block;
export type Block = { type: 'Block'; items: Array<Stmt>; loc: Loc };

export const callExpression = (
    target: Expr,
    targetType: LambdaType,
    res: Type,
    args: Array<Expr>,
    loc: Loc,
    concreteType?: LambdaType,
): Expr => ({
    type: 'apply',
    targetType,
    concreteType: concreteType || targetType,
    res,
    target,
    args,
    loc,
});
export const stringLiteral = (value: string, loc: Loc): Expr => ({
    type: 'string',
    value,
    loc,
});

// Record creation ... I'll want a second pass to bring that up to a statement level I think
// so that I can support go or python...
// also I don't support effects in record creation just yet.
// oh wait, I think go and python can create records just fine
export type Literal =
    | { type: 'string'; value: string; loc: Loc }
    | { type: 'int'; value: number; loc: Loc }
    | { type: 'boolean'; value: boolean; loc: Loc }
    | { type: 'float'; value: number; loc: Loc };

export type Expr =
    | Literal
    | { type: 'eqLiteral'; value: Expr; literal: Literal; loc: Loc }
    | { type: 'term'; id: Id; loc: Loc }
    | { type: 'var'; sym: Symbol; loc: Loc }
    | {
          type: 'slice';
          value: Expr;
          start: Expr;
          end: Expr | null;
          loc: Loc;
      }
    | { type: 'arrayIndex'; value: Expr; idx: Expr; loc: Loc }
    | { type: 'arrayLen'; value: Expr; loc: Loc } // TODO this could just be represented with a buitin, right? yeah
    | { type: 'builtin'; name: string; loc: Loc }
    // used in switches
    | { type: 'IsRecord'; value: Expr; ref: Reference; loc: Loc }
    | { type: 'effectfulOrDirect'; effectful: boolean; target: Expr; loc: Loc }
    | {
          type: 'raise';
          effect: Id;
          idx: number;
          args: Array<Expr>;
          done: Expr;
          loc: Loc;
      }
    | {
          type: 'handle';
          target: Expr;
          effect: Id;
          loc: Loc;
          pure: { arg: Symbol; body: Expr | Block };
          cases: Array<{
              constr: number;
              args: Array<Symbol>;
              k: Symbol;
              body: Expr | Block;
          }>;
          done: Expr | null;
      }
    | {
          type: 'array';
          items: Array<Expr | { type: 'Spread'; value: Expr }>;
          elType: Type;
          loc: Loc;
      }
    | Record
    | {
          type: 'attribute';
          target: Expr;
          ref: Reference;
          idx: number;
          loc: Loc;
      }
    // effects have been taken care of at this point
    // do we need to know the types of things? perhaps for conversions?
    | {
          type: 'apply';
          targetType: LambdaType;
          concreteType: LambdaType;
          res: Type;
          target: Expr;
          args: Array<Expr>;
          loc: Loc;
      }
    | {
          type: 'effectfulOrDirectLambda';
          effectful: LambdaExpr;
          direct: LambdaExpr;
          loc: Loc;
      }
    | LambdaExpr;

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
    // ok
    // so
    // for js, we can spread
    // for go, we need to list things individually I do believe
    // so
    // lets just keep things n such
    // also we gon want to do some heavy iffe lifting for realsies.
};
export type RecordSubType = {
    spread: Expr | null;
    rows: Array<Expr | null>;
};
export type LambdaExpr = {
    type: 'lambda';
    // hrmmm how do I represent the "handlers" and such?
    // do I just have a "handlers" type? Will swift require more of me? no it has an Any
    // I could just say "builtin any"
    // but what about the sym? Do I generate new syms? probably not.
    args: Array<Arg>;
    res: Type;
    body: Expr | Block;
    loc: Loc;
};

export type Arg = { sym: Symbol; type: Type; loc: Loc };
// and that's all folks
