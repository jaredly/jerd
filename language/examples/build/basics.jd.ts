import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";
type handle22024b72 = [(arg_0: (arg_0: handle22024b72, arg_1: string) => void) => void];

/**
```
type Eq#553b4b8e<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_553b4b8e<T_0> = {
  type: "553b4b8e";
  h553b4b8e_0: (arg_0: T_0, arg_1: T_0) => boolean;
};

/**
```
const rec provideString#1d302ade = (responseValue#:0: string#builtin): (
    () ={GetString#22024b72}> string#builtin,
) ={}> string#builtin ={}> (fn#:1: () ={GetString#22024b72}> string#builtin): string#builtin ={}> {
    handle! fn#:1 {
        GetString.get#0(() => k#:3) => 1d302ade#self(responseValue#:0 ++#builtin ".")(
            (): string#builtin ={GetString#22024b72}> k#:3(responseValue#:0),
        ),
        pure(a#:2) => a#:2,
    };
}
```
*/
export const hash_1d302ade: (arg_0: string) => (arg_0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => string = (responseValue: string) => (fn:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => {
  let result: string = (null as any);
  handleSimpleShallow2<any, any, any>("22024b72", fn, [(handlers$15000, _, k$3:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void) => {
    result = hash_1d302ade(responseValue + ".")((handlers: Handlers, done: (arg_0: Handlers, arg_1: string) => void) => {
      k$3(responseValue, handlers, (handlers: Handlers, returnValue: string) => done(handlers, returnValue));
    });
  }], (handlers: Handlers, a$2: string) => {
    result = a$2;
  });
  return result;
};

/**
```
const freturn#38ab4eac = (): string#builtin ={}> "yes"
```
*/
export const hash_38ab4eac: () => string = () => "yes";

/**
```
const provideStringWithArg#8366c3ec = (responseValue#:0: string#builtin): (
    string#builtin,
    (string#builtin) ={GetString#22024b72}> string#builtin,
) ={}> string#builtin ={}> (
    passIn#:1: string#builtin,
    fn#:2: (string#builtin) ={GetString#22024b72}> string#builtin,
): string#builtin ={}> {
    handle! (): string#builtin ={GetString#22024b72}> fn#:2(passIn#:1) {
        GetString.get#0(() => k#:4) => provideString#1d302ade(
            responseValue: responseValue#:0 ++#builtin ".",
        )((): string#builtin ={GetString#22024b72}> k#:4(responseValue#:0)),
        pure(a#:3) => a#:3,
    };
}
```
*/
export const hash_8366c3ec: (arg_0: string) => (arg_0: string, arg_1:
/*from cps lambda*/
(arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void) => string = (responseValue: string) => (passIn: string, fn$2:
/*from cps lambda*/
(arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void) => {
  let result$5: string = (null as any);
  handleSimpleShallow2<any, any, any>("22024b72", (handlers: Handlers, done$6: (arg_0: Handlers, arg_1: string) => void) => {
    fn$2(passIn, handlers, (handlers: Handlers, returnValue$8: string) => done$6(handlers, returnValue$8));
  }, [(handlers, _, k$4:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void) => {
    result$5 = hash_1d302ade(responseValue + ".")((handlers: Handlers, done$9: (arg_0: Handlers, arg_1: string) => void) => {
      k$4(responseValue, handlers, (handlers: Handlers, returnValue$11: string) => done$9(handlers, returnValue$11));
    });
  }], (handlers: Handlers, a$3: string) => {
    result$5 = a$3;
  });
  return result$5;
};

/**
```
const pure#33e34a3a = (): string#builtin ={}> "AA"
```
*/
export const hash_33e34a3a: () => string = () => "AA";

/**
```
const impure#74eaa230 = (): string#builtin ={GetString#22024b72}> "A"
```
*/
export const hash_74eaa230:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void = (handlers: Handlers, done$1: (arg_0: Handlers, arg_1: string) => void) => {
  done$1(handlers, "A");
};

/**
```
const FloatEq#c41f7386 = Eq#553b4b8e<float#builtin>{"=="#553b4b8e#0: floatEq#builtin}
```
*/
export const hash_c41f7386: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: floatEq
} as t_553b4b8e<number>);

/**
```
const IntEq#9275f914 = Eq#553b4b8e<int#builtin>{"=="#553b4b8e#0: intEq#builtin}
```
*/
export const hash_9275f914: t_553b4b8e<number> = ({
  type: "553b4b8e",
  h553b4b8e_0: intEq
} as t_553b4b8e<number>);

/**
```
const identity#d762885a = <T#:0>(x#:0: T#:0): T#:0 ={}> x#:0
```
*/
export const hash_d762885a: <T_0>(arg_0: T_0) => T_0 = <T_0>(x: T_0) => x;

/**
```
const arg#7578690a = (arg#:0: string#builtin): string#builtin ={}> arg#:0 ++#builtin "1"
```
*/
export const hash_7578690a: (arg_0: string) => string = (arg: string) => arg + "1";

/**
```
const call#5e9cab43 = (): string#builtin ={}> freturn#38ab4eac() +#builtin "a"
```
*/
export const hash_5e9cab43: () => string = () => hash_38ab4eac() + "a";

/**
```
const StringEq#606c7034 = Eq#553b4b8e<string#builtin>{"=="#553b4b8e#0: stringEq#builtin}
```
*/
export const hash_606c7034: t_553b4b8e<string> = ({
  type: "553b4b8e",
  h553b4b8e_0: stringEq
} as t_553b4b8e<string>);

/*
true
*/
assert(true);

/*
"hi" ==#606c7034#553b4b8e#0 "hi"
*/
assertCall(hash_606c7034.h553b4b8e_0, "hi", "hi");

/*
freturn#38ab4eac() ==#606c7034#553b4b8e#0 "yes"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_38ab4eac(), "yes");

/*
call#5e9cab43() ==#606c7034#553b4b8e#0 "yesa"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_5e9cab43(), "yesa");

/*
arg#7578690a(arg: "2") ==#606c7034#553b4b8e#0 "21"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_7578690a("2"), "21");

/*
identity#d762885a<string#builtin>(x: "5") ++#builtin "4" ==#606c7034#553b4b8e#0 "54"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_d762885a("5") + "4", "54");

/*
2 ==#9275f914#553b4b8e#0 1 +#builtin 1
*/
assertCall(hash_9275f914.h553b4b8e_0, 2, 1 + 1);

/*
2 +#builtin 3 *#builtin 4 ==#9275f914#553b4b8e#0 16 -#builtin 2
*/
assertCall(hash_9275f914.h553b4b8e_0, 2 + 3 * 4, 16 - 2);

/*
2.2 *#builtin 2.0 ==#c41f7386#553b4b8e#0 4.4
*/
assertCall(hash_c41f7386.h553b4b8e_0, 2.2 * 2, 4.4);

/*
2 ^#builtin 3 ==#9275f914#553b4b8e#0 8
*/
assertCall(hash_9275f914.h553b4b8e_0, pow(2, 3), 8);

/*
sqrt#builtin(2.0 *#builtin 2.0) ==#c41f7386#553b4b8e#0 2.0
*/
assertCall(hash_c41f7386.h553b4b8e_0, sqrt(2 * 2), 2);

/*
provideString#1d302ade(responseValue: "hi")((): string#builtin ={GetString#22024b72}> "m") 
    ==#606c7034#553b4b8e#0 "m"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_1d302ade("hi")((handlers: Handlers, done$1: (arg_0: Handlers, arg_1: string) => void) => {
  done$1(handlers, "m");
}), "m");

/*
provideString#1d302ade(responseValue: "hi")(impure#74eaa230) ==#606c7034#553b4b8e#0 "A"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_1d302ade("hi")(hash_74eaa230), "A");

/*
provideString#1d302ade(responseValue: "hi")(
        (): string#builtin ={GetString#22024b72}> pure#33e34a3a(),
    ) 
    ==#606c7034#553b4b8e#0 "AA"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_1d302ade("hi")((handlers: Handlers, done$2: (arg_0: Handlers, arg_1: string) => void) => {
  done$2(handlers, hash_33e34a3a());
}), "AA");

/*
provideString#1d302ade(responseValue: "hi")((): string#builtin ={GetString#22024b72}> "m") 
    ==#606c7034#553b4b8e#0 "m"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_1d302ade("hi")((handlers: Handlers, done$3: (arg_0: Handlers, arg_1: string) => void) => {
  done$3(handlers, "m");
}), "m");

/*
provideStringWithArg#8366c3ec(responseValue: "hi")(
        "Passed in",
        (arg#:0: string#builtin): string#builtin ={GetString#22024b72}> arg#:0 ++#builtin "-m",
    ) 
    ==#606c7034#553b4b8e#0 "Passed in-m"
*/
assertCall(hash_606c7034.h553b4b8e_0, hash_8366c3ec("hi")("Passed in", (arg: string, handlers: Handlers, done$4: (arg_0: Handlers, arg_1: string) => void) => {
  done$4(handlers, arg + "-m");
}), "Passed in-m");