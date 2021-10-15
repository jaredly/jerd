import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";
type handle22024b72 = [(arg_0: (arg_0: handle22024b72, arg_1: string) => void) => void];

/**
```
@unique(0.5383562320075749) type Eq#51ea2a36<T#:0> = {
    "==": (T#:0, T#:0) ={}> bool#builtin,
}
```
*/
type t_51ea2a36<T_0> = {
  type: "51ea2a36";
  h51ea2a36_0: (arg_0: T_0, arg_1: T_0) => boolean;
};

/**
```
@unique(0.7650832933732973) type Person#9983dd9e = {
    name: string#builtin,
    age: int#builtin,
}
```
*/
type t_9983dd9e = {
  type: "9983dd9e";
  h9983dd9e_0: string;
  h9983dd9e_1: number;
};

/**
```
@unique(2) type As#As<T#:10000, Y#:10001> = {
    as: (T#:10000) ={}> Y#:10001,
}
```
*/
type t_As<T_10000, T_10001> = {
  type: "As";
  hAs_0: (arg_0: T_10000) => T_10001;
};

/**
```
const IntAsString#1175499e = As#As<int#builtin, string#builtin>{as#As#0: intToString#builtin}
As#😉{TODO SPREADs}{hAs_0: intToString}
```
*/
export const hash_1175499e: t_As<number, string> = ({
  type: "As",
  hAs_0: intToString
} as t_As<number, string>);

/**
```
const rec provideString#03991bf8 = (responseValue#:0: string#builtin): (
    fn: () ={GetString#22024b72}> string#builtin,
) ={}> string#builtin ={}> (fn#:1: () ={GetString#22024b72}> string#builtin): string#builtin ={}> {
    handle! fn#:1 {
        GetString.get#0(() => k#:3) => 03991bf8#self(responseValue#:0 ++#builtin ".")(
            (): string#builtin ={GetString#22024b72}> k#:3(responseValue#:0),
        ),
        pure(a#:2) => a#:2,
    };
}
(responseValue#:0: string): (nope type: cps-lambda) => string => (fn#:1: nope type: cps-lambda): string => {
    const result#:4: string;
    TODO Handle;
    return result#:4;
}
```
*/
export const hash_03991bf8: (arg_0: string) => (arg_0:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => string = (responseValue: string) => (fn:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => {
  let result: string = (null as any);
  handleSimpleShallow2<any, any, any>("22024b72", fn, [(handlers$15000, _, k$3:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void) => {
    result = hash_03991bf8(responseValue + ".")((handlers: Handlers, done: (arg_0: Handlers, arg_1: string) => void) => {
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
(): string => "yes"
```
*/
export const hash_38ab4eac: () => string = () => "yes";

/**
```
const me#0a1f1488 = Person#9983dd9e{name#9983dd9e#0: "Jerd", age#9983dd9e#1: 13}
Person#🚣‍♀️{TODO SPREADs}{h9983dd9e_0: "Jerd", h9983dd9e_1: 13}
```
*/
export const hash_0a1f1488: t_9983dd9e = ({
  type: "9983dd9e",
  h9983dd9e_0: "Jerd",
  h9983dd9e_1: 13
} as t_9983dd9e);

/**
```
const personAsString#47deb40e = As#As<Person#9983dd9e, string#builtin>{
    as#As#0: (person#:0: Person#9983dd9e): string#builtin ={}> "${person#:0.name#9983dd9e#0} (age $#1175499e{person#:0.age#9983dd9e#1})",
}
As#😉{TODO SPREADs}{
    hAs_0: (person#:0: Person#🚣‍♀️): string => stringConcat(
        stringConcat(
            person#:0.#Person#🚣‍♀️#0,
            stringConcat(" (age ", IntAsString#🚣‍♀️🦸‍♀️👨‍💼.#As#😉#0(person#:0.#Person#🚣‍♀️#1)),
        ),
        ")",
    ),
}
```
*/
export const hash_47deb40e: t_As<t_9983dd9e, string> = ({
  type: "As",
  hAs_0: (person: t_9983dd9e) => person.h9983dd9e_0 + (" (age " + hash_1175499e.hAs_0(person.h9983dd9e_1)) + ")"
} as t_As<t_9983dd9e, string>);

/**
```
const rec tailMe#763eb710 = (num#:0: int#builtin, collect#:1: Array#builtin<int#builtin>): Array#builtin<
    int#builtin,
> ={}> {
    if num#:0 <=#builtin 0 {
        collect#:1;
    } else {
        763eb710#self(num#:0 -#builtin 1, <int#builtin>[...collect#:1, num#:0]);
    };
}
(num#:0: int, collect#:1: Array<int>): Array<int> => {
    const collect#:4: Array<int> = *arrayCopy*(collect#:1);
    for (; num#:0 > 0; num#:0 = num#:0 - 1) {
        collect#:4.*push*(num#:0);
        continue;
    };
    return collect#:4;
}
```
*/
export const hash_763eb710: (arg_0: number, arg_1: Array<number>) => Array<number> = (num: number, collect: Array<number>) => {
  let collect$4: Array<number> = collect.slice();

  for (; num > 0; num = num - 1) {
    collect$4.push(num);
    continue;
  }

  return collect$4;
};

/**
```
const provideStringWithArg#4ddb4efb = (responseValue#:0: string#builtin): (
    passIn: string#builtin,
    fn: (string#builtin) ={GetString#22024b72}> string#builtin,
) ={}> string#builtin ={}> (
    passIn#:1: string#builtin,
    fn#:2: (string#builtin) ={GetString#22024b72}> string#builtin,
): string#builtin ={}> {
    handle! (): string#builtin ={GetString#22024b72}> fn#:2(passIn#:1) {
        GetString.get#0(() => k#:4) => provideString#03991bf8(
            responseValue: responseValue#:0 ++#builtin ".",
        )((): string#builtin ={GetString#22024b72}> k#:4(responseValue#:0)),
        pure(a#:3) => a#:3,
    };
}
(responseValue#:0: string): (string, nope type: cps-lambda) => string => (
    passIn#:1: string,
    fn#:2: nope type: cps-lambda,
): string => {
    const result#:5: string;
    TODO Handle;
    return result#:5;
}
```
*/
export const hash_4ddb4efb: (arg_0: string) => (arg_0: string, arg_1:
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
    result$5 = hash_03991bf8(responseValue + ".")((handlers: Handlers, done$9: (arg_0: Handlers, arg_1: string) => void) => {
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
(): string => "AA"
```
*/
export const hash_33e34a3a: () => string = () => "AA";

/**
```
const impure#74eaa230 = (): string#builtin ={GetString#22024b72}> "A"
(handlers#:15000: nope type: effect-handler, done#:1: (nope type: effect-handler, string) => void): void => {
    done#:1(handlers#:15000, "A");
}
```
*/
export const hash_74eaa230:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void = (handlers: Handlers, done$1: (arg_0: Handlers, arg_1: string) => void) => {
  done$1(handlers, "A");
};

/**
```
const FloatEq#9ca984ce = Eq#51ea2a36<float#builtin>{"=="#51ea2a36#0: floatEq#builtin}
Eq#🦩🥜👩‍💻😃{TODO SPREADs}{h51ea2a36_0: floatEq}
```
*/
export const hash_9ca984ce: t_51ea2a36<number> = ({
  type: "51ea2a36",
  h51ea2a36_0: floatEq
} as t_51ea2a36<number>);

/**
```
const IntEq#ec95f154 = Eq#51ea2a36<int#builtin>{"=="#51ea2a36#0: intEq#builtin}
Eq#🦩🥜👩‍💻😃{TODO SPREADs}{h51ea2a36_0: intEq}
```
*/
export const hash_ec95f154: t_51ea2a36<number> = ({
  type: "51ea2a36",
  h51ea2a36_0: intEq
} as t_51ea2a36<number>);

/**
```
const identity#78e99602 = <T#:0>(x#:0: T#:0): T#:0 ={}> x#:0
<T>(x#:0: [var]T#:0): [var]T#:0 => x#:0
```
*/
export const hash_78e99602: <T_0>(arg_0: T_0) => T_0 = <T_0>(x: T_0) => x;

/**
```
const arg#d574061c = (arg#:0: string#builtin): string#builtin ={}> arg#:0 ++#builtin "1"
(arg#:0: string): string => ++(arg#:0, "1")
```
*/
export const hash_d574061c: (arg_0: string) => string = (arg: string) => arg + "1";

/**
```
const call#5e9cab43 = (): string#builtin ={}> freturn#38ab4eac() +#builtin "a"
(): string => freturn#🍱🍵🌑() + "a"
```
*/
export const hash_5e9cab43: () => string = () => hash_38ab4eac() + "a";

/**
```
const StringEq#da00b310 = Eq#51ea2a36<string#builtin>{"=="#51ea2a36#0: stringEq#builtin}
Eq#🦩🥜👩‍💻😃{TODO SPREADs}{h51ea2a36_0: stringEq}
```
*/
export const hash_da00b310: t_51ea2a36<string> = ({
  type: "51ea2a36",
  h51ea2a36_0: stringEq
} as t_51ea2a36<string>);

/*
true
assert(true)
*/
assert(true);

/*
"hi" ==#da00b310#51ea2a36#0 "hi"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, "hi", "hi")
*/
assertCall(hash_da00b310.h51ea2a36_0, "hi", "hi");

/*
freturn#38ab4eac() ==#da00b310#51ea2a36#0 "yes"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, freturn#🍱🍵🌑(), "yes")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_38ab4eac(), "yes");

/*
call#5e9cab43() ==#da00b310#51ea2a36#0 "yesa"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, call#🛵🚇👤😃(), "yesa")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_5e9cab43(), "yesa");

/*
arg#d574061c(arg: "2") ==#da00b310#51ea2a36#0 "21"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, arg#🐿️("2"), "21")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_d574061c("2"), "21");

/*
identity#78e99602<string#builtin>(x: "5") ++#builtin "4" ==#da00b310#51ea2a36#0 "54"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, ++(identity#🦓🌵🌕😃<string>("5"), "4"), "54")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_78e99602("5") + "4", "54");

/*
2 ==#ec95f154#51ea2a36#0 1 +#builtin 1
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, 2, 1 + 1)
*/
assertCall(hash_ec95f154.h51ea2a36_0, 2, 1 + 1);

/*
2 +#builtin 3 *#builtin 4 ==#ec95f154#51ea2a36#0 16 -#builtin 2
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, 2 + 3 * 4, 16 - 2)
*/
assertCall(hash_ec95f154.h51ea2a36_0, 2 + 3 * 4, 16 - 2);

/*
2.2 *#builtin 2.0 ==#9ca984ce#51ea2a36#0 4.4
assertCall(FloatEq#👨‍🦰.#Eq#🦩🥜👩‍💻😃#0, 2.2 * 2, 4.4)
*/
assertCall(hash_9ca984ce.h51ea2a36_0, 2.2 * 2, 4.4);

/*
2 ^#builtin 3 ==#ec95f154#51ea2a36#0 8
assertCall(IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0, 2 ^ 3, 8)
*/
assertCall(hash_ec95f154.h51ea2a36_0, pow(2, 3), 8);

/*
sqrt#builtin(2.0 *#builtin 2.0) ==#9ca984ce#51ea2a36#0 2.0
assertCall(FloatEq#👨‍🦰.#Eq#🦩🥜👩‍💻😃#0, sqrt(2 * 2), 2)
*/
assertCall(hash_9ca984ce.h51ea2a36_0, sqrt(2 * 2), 2);

/*
provideString#03991bf8(responseValue: "hi")((): string#builtin ={GetString#22024b72}> "m") 
    ==#da00b310#51ea2a36#0 "m"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    provideString#🎲🐠🤯("hi")(
        (
            handlers#:15000: nope type: effect-handler,
            done#:1: (nope type: effect-handler, string) => void,
        ): void => {
            done#:1(handlers#:15000, "m");
        },
    ),
    "m",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_03991bf8("hi")((handlers: Handlers, done$1: (arg_0: Handlers, arg_1: string) => void) => {
  done$1(handlers, "m");
}), "m");

/*
provideString#03991bf8(responseValue: "hi")(impure#74eaa230) ==#da00b310#51ea2a36#0 "A"
assertCall(StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0, provideString#🎲🐠🤯("hi")(impure#🐧🍿⛽😃), "A")
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_03991bf8("hi")(hash_74eaa230), "A");

/*
provideString#03991bf8(responseValue: "hi")(
        (): string#builtin ={GetString#22024b72}> pure#33e34a3a(),
    ) 
    ==#da00b310#51ea2a36#0 "AA"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    provideString#🎲🐠🤯("hi")(
        (
            handlers#:15000: nope type: effect-handler,
            done#:1: (nope type: effect-handler, string) => void,
        ): void => {
            done#:1(handlers#:15000, pure#🐊👩🚚());
        },
    ),
    "AA",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_03991bf8("hi")((handlers: Handlers, done$1: (arg_0: Handlers, arg_1: string) => void) => {
  done$1(handlers, hash_33e34a3a());
}), "AA");

/*
provideString#03991bf8(responseValue: "hi")((): string#builtin ={GetString#22024b72}> "m") 
    ==#da00b310#51ea2a36#0 "m"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    provideString#🎲🐠🤯("hi")(
        (
            handlers#:15000: nope type: effect-handler,
            done#:1: (nope type: effect-handler, string) => void,
        ): void => {
            done#:1(handlers#:15000, "m");
        },
    ),
    "m",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_03991bf8("hi")((handlers: Handlers, done$1: (arg_0: Handlers, arg_1: string) => void) => {
  done$1(handlers, "m");
}), "m");

/*
provideStringWithArg#4ddb4efb(responseValue: "hi")(
        "Passed in",
        (arg#:0: string#builtin): string#builtin ={GetString#22024b72}> arg#:0 ++#builtin "-m",
    ) 
    ==#da00b310#51ea2a36#0 "Passed in-m"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    provideStringWithArg#🏘️🍵🧓😃("hi")(
        "Passed in",
        (
            arg#:0: string,
            handlers#:15000: nope type: effect-handler,
            done#:1: (nope type: effect-handler, string) => void,
        ): void => {
            done#:1(handlers#:15000, ++(arg#:0, "-m"));
        },
    ),
    "Passed in-m",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_4ddb4efb("hi")("Passed in", (arg: string, handlers: Handlers, done$1: (arg_0: Handlers, arg_1: string) => void) => {
  done$1(handlers, arg + "-m");
}), "Passed in-m");

/*
tailMe#763eb710(num: 20, collect: <int#builtin>[])
tailMe#🕌🌂🚟😃(20, [])
*/
hash_763eb710(20, []);

/*
tailMe#763eb710(num: 1, collect: <int#builtin>[])
tailMe#🕌🌂🚟😃(1, [])
*/
hash_763eb710(1, []);

/*
"Hello $#1175499e{10}" ==#da00b310#51ea2a36#0 "Hello 10"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    stringConcat("Hello ", IntAsString#🚣‍♀️🦸‍♀️👨‍💼.#As#😉#0(10)),
    "Hello 10",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, "Hello " + hash_1175499e.hAs_0(10), "Hello 10");

/*
"Hello $#1175499e{10 +#builtin 2} folks" ==#da00b310#51ea2a36#0 "Hello 12 folks"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    stringConcat(stringConcat("Hello ", IntAsString#🚣‍♀️🦸‍♀️👨‍💼.#As#😉#0(10 + 2)), " folks"),
    "Hello 12 folks",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, "Hello " + hash_1175499e.hAs_0(10 + 2) + " folks", "Hello 12 folks");

/*
"Who's there? $#47deb40e{me#0a1f1488}" ==#da00b310#51ea2a36#0 "Who's there? Jerd (age 13)"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    stringConcat("Who's there? ", personAsString#😍🌂❣️😃.#As#😉#0(me#💯🎏🤙)),
    "Who's there? Jerd (age 13)",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, "Who's there? " + hash_47deb40e.hAs_0(hash_0a1f1488), "Who's there? Jerd (age 13)");