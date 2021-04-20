// types for the IR

import {
    Type,
    Symbol,
    Id,
    Reference,
    LambdaType,
    UserReference,
    idsEqual,
    Env,
    EffectReference,
    EffectRef,
} from '../../typing/types';
import { Location } from '../../parsing/parser';
import {
    bool,
    builtinType,
    float,
    int,
    string,
    void_,
} from '../../typing/preset';
import { idName, refName } from '../../typing/env';
import { arrayType, tupleType } from '../../typing/typeExpr';

export type Loc = Location | null;
export const handlerSym = { name: 'handlers', unique: 0 };
export const handlersType = builtinType('handlers');

export type OutputOptions = {
    readonly limitExecutionTime?: boolean;
};

// hrm where do I put comments in life

export type Toplevel =
    | {
          type: 'Define';
          id: Id;
          body: Expr;
          is: Type;
          loc: Loc;
      }
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

export type ReturnStmt = { type: 'Return'; value: Expr; loc: Loc };
export type Stmt =
    | { type: 'Expression'; expr: Expr; loc: Loc }
    | {
          type: 'Define';
          sym: Symbol;
          value: Expr | null;
          comment?: string;
          is?: Type;
          loc: Loc;
          fakeInitialization?: boolean;
      }
    | { type: 'Assign'; sym: Symbol; value: Expr; is: Type; loc: Loc }
    | { type: 'if'; cond: Expr; yes: Block; no: Block | null; loc: Loc }
    | { type: 'MatchFail'; loc: Loc }
    | ReturnStmt
    // Do I also want a "for-in" or a "for-range" stmt type?
    // or do I just want to optimize a recursive function w/ switch +
    // array destructuring?
    // or I could just have Array.forEach
    | { type: 'Loop'; body: Block; loc: Loc }
    | { type: 'Continue'; loc: Loc }
    | Block;
export type Block = { type: 'Block'; items: Array<Stmt>; loc: Loc };

export const isTerm = (expr: Expr, id: Id) =>
    expr.type === 'term' && idsEqual(id, expr.id);

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
    target,
    args,
    loc,
    is: res,
});
export const stringLiteral = (value: string, loc: Loc): Expr => ({
    type: 'string',
    value,
    loc,
    is: string,
});

// export const typeForExpr = (env: Env, expr: Expr): Type => {
//     switch (expr.type) {
//         case 'string':
//             return string;
//         case 'int':
//             return int;
//         case 'boolean':
//             return bool;
//         case 'float':
//             return float;
//         case 'eqLiteral':
//             return bool;
//         case 'term':
//             return env.global.terms[idName(expr.id)].is;
//         case 'var':
//             return void_; // STOPSHIP
//         case 'slice':
//             return typeForExpr(env, expr.value);
//         case 'tuple':
//             // TODO tuple type
//             return tupleType(expr.itemTypes);
//         // return expr.itemTypes;
//         case 'arrayIndex': {
//             const t = typeForExpr(env, expr.value);
//             if (
//                 t.type !== 'ref' ||
//                 t.ref.type !== 'builtin' ||
//                 t.ref.name !== 'Array' ||
//                 t.typeVbls.length !== 1
//             ) {
//                 throw new Error(`Arg`);
//             }
//             return t.typeVbls[0];
//         }
//         case 'arrayLen':
//             return int;
//         case 'builtin':
//             return env.global.builtins[expr.name];
//         case 'IsRecord':
//             return bool;
//         case 'effectfulOrDirect':
//             // ermmmm what do I do folks
//             return typeForExpr(env, expr.target);
//         case 'raise': {
//             // const t = env.global.effects[idName(expr.effect)][expr.idx]
//             // return t.ret
//             // raise will always pass to continuation, right?
//             return void_;
//         }
//         case 'handle':
//             return expr.done != null
//                 ? void_
//                 : typeForLambdaExpression(env, expr.pure.body);
//         case 'array':
//             return arrayType(expr.elType);
//         case 'record':
//             return expr.is;
//         case 'attribute': {
//             const t = env.global.types[refName(expr.ref)];
//             if (!t || t.type !== 'Record') {
//                 throw new Error(`Not a record ${refName(expr.ref)}`);
//             }
//             return t.items[expr.idx];
//         }
//         case 'tupleAccess': {
//             const is = typeForExpr(env, expr.target);
//             if (
//                 is.type !== 'ref' ||
//                 is.ref.type !== 'builtin' ||
//                 !is.ref.name.startsWith('Tuple')
//             ) {
//                 throw new Error(`Not a tuple`);
//             }
//             return is.typeVbls[expr.idx];
//         }
//         case 'apply':
//             return expr.is;
//         case 'effectfulOrDirectLambda':
//             // TODO: what should this be? maybe pretend it's a builtin type?
//             return builtinType('effectfulOrDirect', []);
//         case 'lambda':
//             // hrmmmm yes
//             return void_; // STOPSHIP
//         // return expr.args; // hrmmmmmm yes I think we want the full ref type?
//         // hm ok
//         default:
//             let _x: never = expr;
//             throw new Error(`Unexpected stmt ${(expr as any).type}`);
//     }
// };

// export const typeForLambdaExpression = (env: Env, body: Expr | Block): Type => {
//     if (body.type === 'Block') {
//         return returnTypeForStmt(env, body) || void_;
//     } else {
//         return typeForExpr(env, body);
//     }
// };

export const returnTypeForStmt = (env: Env, stmt: Stmt): Type | null => {
    switch (stmt.type) {
        case 'Assign':
        case 'Continue':
        case 'MatchFail':
        case 'Expression':
        case 'Define':
            return null;
        case 'Return':
            return stmt.value.is;
        case 'Block':
            const types = stmt.items
                .map((s) => returnTypeForStmt(env, s))
                .filter((t) => t != null);
            // TODO ensure the types line up? Do I need to do that here?
            return types.length === 0 ? null : types[0];
        case 'Loop':
            return returnTypeForStmt(env, stmt.body);
        case 'if':
            return (
                returnTypeForStmt(env, stmt.yes) ||
                (stmt.no ? returnTypeForStmt(env, stmt.no) : null)
            );
        default:
            let _x: never = stmt;
            throw new Error(`Unexpected stmt ${(stmt as any).type}`);
    }
};

// Record creation ... I'll want a second pass to bring that up to a statement level I think
// so that I can support go or python...
// also I don't support effects in record creation just yet.
// oh wait, I think go and python can create records just fine
export type Literal =
    | { type: 'string'; value: string; loc: Loc; is: Type }
    | { type: 'int'; value: number; loc: Loc; is: Type }
    | { type: 'boolean'; value: boolean; loc: Loc; is: Type }
    | { type: 'float'; value: number; loc: Loc; is: Type };

export type Expr =
    | Literal
    | { type: 'eqLiteral'; value: Expr; literal: Literal; loc: Loc; is: Type }
    | { type: 'term'; id: Id; loc: Loc; is: Type }
    | { type: 'var'; sym: Symbol; loc: Loc; is: Type }
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
    | { type: 'IsRecord'; value: Expr; ref: Reference; loc: Loc; is: Type }
    | {
          type: 'effectfulOrDirect';
          effectful: boolean;
          target: Expr;
          loc: Loc;
          is: Type;
      }
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
          pure: { arg: Symbol; body: Expr | Block };
          cases: Array<{
              constr: number;
              args: Array<Symbol>;
              k: Symbol;
              body: Expr | Block;
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
    itemTypes: Array<Type>;
    loc: Loc;
    is: Type;
};
export type Apply = {
    type: 'apply';
    note?: string;
    targetType: LambdaType;
    concreteType: LambdaType;
    target: Expr;
    args: Array<Expr>;
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
    note?: string;
    // hrmmm how do I represent the "handlers" and such?
    // do I just have a "handlers" type? Will swift require more of me? no it has an Any
    // I could just say "builtin any"
    // but what about the sym? Do I generate new syms? probably not.
    args: Array<Arg>;
    res: Type;
    body: Expr | Block;
    loc: Loc;
    is: Type;
};

export type Arg = { sym: Symbol; type: Type; loc: Loc };
// and that's all folks
