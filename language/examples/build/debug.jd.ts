import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";
type handle22024b72 = [(arg_0: (arg_0: handle22024b72, arg_1: string) => void) => void];

/**
```
type Eq#553b4b8e<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool,
}
```
*/
type t_553b4b8e<T_0> = {
  type: "553b4b8e";
  h553b4b8e_0: (arg_0: T_0, arg_1: T_0) => boolean;
};

/**
```
const getString#64605d94 = (): string ={Read#22024b72}> raise!(Read#22024b72.read())
```
*/
export const hash_64605d94:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void = (handlers: Handlers, done: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers, "22024b72", 0, null, (handlers, value) => done(handlers, value));
};

/**
```
const rec provideString#0247dd82 = (v#:0: string, fn#:1: () ={Read#22024b72}> string): string ={}> handle! fn#:1 {
    Read.read#0(() => k#:3) => 0247dd82#self(
            v#:0,
            (): string ={Read#22024b72}> k#:3(v#:0 + "got") + "back",
        ) 
        + "provided",
    pure(v#:2) => v#:2 + "pure",
}
```
*/
export const hash_0247dd82: (arg_0: string, arg_1:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => string = (v: string, fn:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => {
  let result: string = (null as any);
  handleSimpleShallow2<any, any, any>("22024b72", fn, [(handlers, _, k$3:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void) => {
    result = (() => hash_0247dd82(v, (handlers: Handlers, done$6: (arg_0: Handlers, arg_1: string) => void) => {
      k$3(v + "got", handlers, (handlers: Handlers, returnValue: string) => ((handlers: Handlers, arg_lift_0: string) => ((handlers: Handlers) => {
        done$6(handlers, arg_lift_0 + "back");
      })(handlers))(handlers, returnValue));
    }) + "provided")();
  }], (handlers: Handlers, v$2: string) => {
    result = (() => v$2 + "pure")();
  });
  return result;
};

/**
```
const StringEq#606c7034 = Eq#553b4b8e<string>{"=="#553b4b8e#0: stringEq}
```
*/
export const hash_606c7034: t_553b4b8e<string> = ({
  type: "553b4b8e",
  h553b4b8e_0: stringEq
} as t_553b4b8e<string>);

/*
provideString#0247dd82("Yes", getString#64605d94) ==#606c7034#553b4b8e#0 "Yesgotbackpureprovided"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_0247dd82("Yes", hash_64605d94), "Yesgotbackpureprovided");