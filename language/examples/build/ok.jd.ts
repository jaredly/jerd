import { handleSimpleShallow2Multi3, handleSimpleShallow2Multi2, handleSimpleShallow2Multi, raise, handleSimpleShallow2, assertCall, assert, assertEqual, pureCPS, log, isSquare, texture, intToString, intToFloat, floatToString, floatToInt, pow, round, TAU, PI, sqrt, abs, max, min, floor, ceil, mod, modInt, sin, ln, cos, tan, asin, acos, atan, atan2, concat, len, intEq, floatEq, stringEq, $trace } from "./prelude.mjs";
import { Handlers } from "./prelude.mjs";
type handle22024b72 = [(arg_0: (arg_0: handle22024b72, arg_1: string) => void) => void];
type handle35f4b478 = [(arg_0: string, arg_1: (arg_0: handle35f4b478) => void) => void];

/**
```
@unique(0.8935410428147438) type Person#191447ce = {
    name: string#builtin,
    age: int#builtin,
}
```
*/
type t_191447ce = {
  type: "191447ce";
  h191447ce_0: string;
  h191447ce_1: number;
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
const rec arrayEq#0b9c95cc = <T#:0>(
    one#:0: Array#builtin<T#:0>,
    two#:1: Array#builtin<T#:0>,
    eq#:2: Eq#51ea2a36<T#:0>,
): bool#builtin ={}> {
    switch (one#:0, two#:1) {
        ([], []) => true,
        ([one#:3, ...rone#:4], [two#:5, ...rtwo#:6]) => if one#:3 ==#:2#51ea2a36#0 two#:5 {
            0b9c95cc#self<T#:0>(rone#:4, rtwo#:6, eq#:2);
        } else {
            false;
        },
        _ => false,
    };
}
<T>(one#:0: Array<[var]T#:0>, two#:1: Array<[var]T#:0>, eq#:2: Eq#🦩🥜👩‍💻😃<[var]T#:0>): bool => {
    const one_i#:11: int = 0;
    const two_i#:12: int = 0;
    loop(unbounded) {
        if len(two#:1) - two_i#:12 == 0 && len(one#:0) - one_i#:11 == 0 {
            return true;
        };
        if len(two#:1) - two_i#:12 >= 1 && len(one#:0) - one_i#:11 >= 1 {
            if eq#:2.#Eq#🦩🥜👩‍💻😃#0(one#:0[0 + one_i#:11], two#:1[0 + two_i#:12]) {
                one_i#:11 = one_i#:11 + 1;
                two_i#:12 = two_i#:12 + 1;
                continue;
            } else {
                return false;
            };
        };
        return false;
    };
}
```
*/
export const hash_0b9c95cc: <T_0>(arg_0: Array<T_0>, arg_1: Array<T_0>, arg_2: t_51ea2a36<T_0>) => boolean = <T_0>(one: Array<T_0>, two: Array<T_0>, eq: t_51ea2a36<T_0>) => {
  let one_i: number = 0;
  let two_i: number = 0;

  while (true) {
    if (two.length - two_i == 0 && one.length - one_i == 0) {
      return true;
    }

    if (two.length - two_i >= 1 && one.length - one_i >= 1) {
      if (eq.h51ea2a36_0(one[0 + one_i], two[0 + two_i])) {
        one_i = one_i + 1;
        two_i = two_i + 1;
        continue;
      } else {
        return false;
      }
    }

    return false;
  }
};

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
const getString#64605d94 = (): string#builtin ={Read#22024b72}> raise!(Read#22024b72.read())
(handlers#:15000: nope type: effect-handler, done#:1: (nope type: effect-handler, string) => void): void => {
    TODO raise;
}
```
*/
export const hash_64605d94:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void = (handlers: Handlers, done: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers, "22024b72", 0, null, (handlers, value) => done(handlers, value));
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
const StringEq#da00b310 = Eq#51ea2a36<string#builtin>{"=="#51ea2a36#0: stringEq#builtin}
Eq#🦩🥜👩‍💻😃{TODO SPREADs}{h51ea2a36_0: stringEq}
```
*/
export const hash_da00b310: t_51ea2a36<string> = ({
  type: "51ea2a36",
  h51ea2a36_0: stringEq
} as t_51ea2a36<string>);

/**
```
const ArrayEq#1a50aec3 = <T#:0>(eq#:0: Eq#51ea2a36<T#:0>): Eq#51ea2a36<Array#builtin<T#:0>> ={}> Eq#51ea2a36<
    Array#builtin<T#:0>,
>{
    "=="#51ea2a36#0: (one#:1: Array#builtin<T#:0>, two#:2: Array#builtin<T#:0>): bool#builtin ={}> len#builtin<
                T#:0,
            >(one#:1) 
            ==#ec95f154#51ea2a36#0 len#builtin<T#:0>(two#:2) 
        &&#builtin arrayEq#0b9c95cc<T#:0>(one#:1, two#:2, eq#:0),
}
<T>(eq#:0: Eq#🦩🥜👩‍💻😃<[var]T#:0>): Eq#🦩🥜👩‍💻😃<Array<[var]T#:0>> => Eq#🦩🥜👩‍💻😃{TODO SPREADs}{
    h51ea2a36_0: (one#:1: Array<[var]T#:0>, two#:2: Array<[var]T#:0>): bool => IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0(
        len<[var]T#:0>(one#:1),
        len<[var]T#:0>(two#:2),
    ) && arrayEq#👨‍❤️‍👨🚂🦿<[var]T#:0>(one#:1, two#:2, eq#:0),
}
```
*/
export const hash_1a50aec3: <T_0>(arg_0: t_51ea2a36<T_0>) => t_51ea2a36<Array<T_0>> = <T_0>(eq$0: t_51ea2a36<T_0>) => ({
  type: "51ea2a36",
  h51ea2a36_0: (one$1: Array<T_0>, two$2: Array<T_0>) => hash_ec95f154.h51ea2a36_0(len(one$1), len(two$2)) && hash_0b9c95cc(one$1, two$2, eq$0)
} as t_51ea2a36<Array<T_0>>);

/**
```
const getPerson#ebcedce8 = (): Person#191447ce ={Read#22024b72}> Person#191447ce{
    name#191447ce#0: getString#64605d94(),
    age#191447ce#1: 5,
}
(
    handlers#:15000: nope type: effect-handler,
    done#:2: (nope type: effect-handler, Person#🎖️👨‍🔧🧗‍♀️) => void,
): void => {
    getString#⛷️😛🐠😃(
        handlers#:15000,
        (handlers#:15000: nope type: effect-handler, returnValue#:4: string): void => {
            done#:2(
                handlers#:15000,
                Person#🎖️👨‍🔧🧗‍♀️{TODO SPREADs}{h191447ce_0: returnValue#:4, h191447ce_1: 5},
            );
        },
    );
}
```
*/
export const hash_ebcedce8:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: t_191447ce) => void, arg_2: Handlers, arg_3: (arg_0: Handlers, arg_1: t_191447ce) => void) => void = (handlers: Handlers, done$2: (arg_0: Handlers, arg_1: t_191447ce) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue: string) => {
    done$2(handlers, ({
      type: "191447ce",
      h191447ce_0: returnValue,
      h191447ce_1: 5
    } as t_191447ce));
  });
};

/**
```
const getPersonName#3d61c465 = (): string#builtin ={Read#22024b72}> Person#191447ce{
    name#191447ce#0: getString#64605d94(),
    age#191447ce#1: 5,
}.name#191447ce#0
(handlers#:15000: nope type: effect-handler, done#:3: (nope type: effect-handler, string) => void): void => {
    getString#⛷️😛🐠😃(
        handlers#:15000,
        (handlers#:15000: nope type: effect-handler, returnValue#:5: string): void => {
            done#:3(handlers#:15000, returnValue#:5);
        },
    );
}
```
*/
export const hash_3d61c465:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void, arg_2: Handlers, arg_3: (arg_0: Handlers, arg_1: string) => void) => void = (handlers: Handlers, done$3: (arg_0: Handlers, arg_1: string) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue$5: string) => {
    done$3(handlers, returnValue$5);
  });
};

/**
```
const getStringArr#3bfdbd8c = (): Array#builtin<string#builtin> ={Read#22024b72}> <string#builtin>[
    getString#64605d94(),
]
(
    handlers#:15000: nope type: effect-handler,
    done#:2: (nope type: effect-handler, Array<string>) => void,
): void => {
    getString#⛷️😛🐠😃(
        handlers#:15000,
        (handlers#:15000: nope type: effect-handler, returnValue#:4: string): void => {
            done#:2(handlers#:15000, [returnValue#:4]);
        },
    );
}
```
*/
export const hash_3bfdbd8c:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: Array<string>) => void, arg_2: Handlers, arg_3: (arg_0: Handlers, arg_1: Array<string>) => void) => void = (handlers: Handlers, done$2: (arg_0: Handlers, arg_1: Array<string>) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue: string) => {
    done$2(handlers, [returnValue]);
  });
};

/**
```
const rec provideIncrement#24f9c382 = <T#:0>(
    v#:0: string#builtin,
    i#:1: int#builtin,
    fn#:2: () ={Read#22024b72}> T#:0,
): T#:0 ={}> handle! fn#:2 {
    Read.read#0(() => k#:4) => 24f9c382#self<T#:0>(
        v#:0,
        i#:1 +#builtin 1,
        (): T#:0 ={Read#22024b72}> k#:4(v#:0 +#builtin i#:1 as#1175499e string#builtin),
    ),
    pure(v#:3) => v#:3,
}
<T>(v#:0: string, i#:1: int, fn#:2: nope type: cps-lambda): [var]T#:0 => {
    const result#:5: [var]T#:0;
    TODO Handle;
    return result#:5;
}
```
*/
export const hash_24f9c382: <T_0>(arg_0: string, arg_1: number, arg_2:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => T_0 = <T_0>(v: string, i: number, fn:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
  let result: T_0 = (null as any);
  handleSimpleShallow2<any, any, any>("22024b72", fn, [(handlers, _, k$4:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result = hash_24f9c382(v, i + 1, (handlers: Handlers, done$6: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$4(v + hash_1175499e.hAs_0(i), handlers, (handlers: Handlers, returnValue$8: T_0) => done$6(handlers, returnValue$8));
    });
  }], (handlers: Handlers, v$3: T_0) => {
    result = v$3;
  });
  return result;
};

/**
```
const ArrayStringEq#b06fe968 = ArrayEq#1a50aec3<string#builtin>(eq: StringEq#da00b310)
ArrayEq#🍧😔🏋️<string>(StringEq#🕌)
```
*/
export const hash_b06fe968: t_51ea2a36<Array<string>> = hash_1a50aec3(hash_da00b310);

/**
```
const spreadPerson#57d02ec3 = (): Person#191447ce ={Read#22024b72}> Person#191447ce{
    ...getPerson#ebcedce8(),
    age#191447ce#1: 20,
}
(
    handlers#:15000: nope type: effect-handler,
    done#:2: (nope type: effect-handler, Person#🎖️👨‍🔧🧗‍♀️) => void,
): void => {
    getPerson#🙅‍♀️(
        handlers#:15000,
        (handlers#:15000: nope type: effect-handler, returnValue#:4: Person#🎖️👨‍🔧🧗‍♀️): void => {
            done#:2(
                handlers#:15000,
                Person#🎖️👨‍🔧🧗‍♀️{TODO SPREADs}{h191447ce_0: _#:0, h191447ce_1: 20},
            );
        },
    );
}
```
*/
export const hash_57d02ec3:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: t_191447ce) => void, arg_2: Handlers, arg_3: (arg_0: Handlers, arg_1: t_191447ce) => void) => void = (handlers: Handlers, done$2: (arg_0: Handlers, arg_1: t_191447ce) => void) => {
  hash_ebcedce8(handlers, (handlers: Handlers, returnValue: t_191447ce) => {
    done$2(handlers, ({ ...returnValue,
      type: "191447ce",
      h191447ce_1: 20
    } as t_191447ce));
  });
};

/**
```
const callAgain#2d49790b = (): () ={}> string#builtin ={Read#22024b72}> {
    const v#:0 = getString#64605d94();
    (): string#builtin ={}> v#:0;
}
(
    handlers#:15000: nope type: effect-handler,
    done#:1: (nope type: effect-handler, () => string) => void,
): void => {
    getString#⛷️😛🐠😃(
        handlers#:15000,
        (handlers#:15000: nope type: effect-handler, returnValue#:3: string): void => {
            done#:1(handlers#:15000, (): string => returnValue#:3);
        },
    );
}
```
*/
export const hash_2d49790b:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: () => string) => void, arg_2: Handlers, arg_3: (arg_0: Handlers, arg_1: () => string) => void) => void = (handlers: Handlers, done: (arg_0: Handlers, arg_1: () => string) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue$3: string) => {
    done(handlers, () => returnValue$3);
  });
};

/**
```
const ifYes#67b65a8c = (): string#builtin ={Read#22024b72}> {
    if getString#64605d94() ==#da00b310#51ea2a36#0 "Yes" {
        "good";
    } else {
        "nope";
    };
}
(handlers#:15000: nope type: effect-handler, done#:3: (nope type: effect-handler, string) => void): void => {
    getString#⛷️😛🐠😃(
        handlers#:15000,
        (handlers#:15000: nope type: effect-handler, returnValue#:5: string): void => {
            const result#:7: string;
            if StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0(returnValue#:5, "Yes") {
                result#:7 = "good";
            } else {
                result#:7 = "nope";
            };
            if true {
                done#:3(handlers#:15000, result#:7);
            };
        },
    );
}
```
*/
export const hash_67b65a8c:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void, arg_2: Handlers, arg_3: (arg_0: Handlers, arg_1: string) => void) => void = (handlers: Handlers, done$3: (arg_0: Handlers, arg_1: string) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue$5: string) => {
    let result$7: string;

    if (hash_da00b310.h51ea2a36_0(returnValue$5, "Yes")) {
      result$7 = "good";
    } else {
      result$7 = "nope";
    }

    if (true) {
      done$3(handlers, result$7);
    }
  });
};

/**
```
const rec provideStringPlain#aae69bd8 = <T#:0>(
    v#:0: string#builtin,
    fn#:1: () ={Read#22024b72}> T#:0,
): T#:0 ={}> handle! fn#:1 {
    Read.read#0(() => k#:3) => aae69bd8#self<T#:0>(v#:0, (): T#:0 ={Read#22024b72}> k#:3(v#:0)),
    pure(v#:2) => v#:2,
}
<T>(v#:0: string, fn#:1: nope type: cps-lambda): [var]T#:0 => {
    const result#:4: [var]T#:0;
    TODO Handle;
    return result#:4;
}
```
*/
export const hash_aae69bd8: <T_0>(arg_0: string, arg_1:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => T_0 = <T_0>(v: string, fn$1:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
  let result$4: T_0 = (null as any);
  handleSimpleShallow2<any, any, any>("22024b72", fn$1, [(handlers, _, k$3:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: T_0) => void) => void) => {
    result$4 = hash_aae69bd8(v, (handlers: Handlers, done$5: (arg_0: Handlers, arg_1: T_0) => void) => {
      k$3(v, handlers, (handlers: Handlers, returnValue$7: T_0) => done$5(handlers, returnValue$7));
    });
  }], (handlers: Handlers, v$2: T_0) => {
    result$4 = v$2;
  });
  return result$4;
};

/**
```
const rec provideString#706cdc48 = (
    v#:0: string#builtin,
    fn#:1: () ={Read#22024b72}> string#builtin,
): string#builtin ={}> handle! fn#:1 {
    Read.read#0(() => k#:3) => 706cdc48#self(
            v#:0,
            (): string#builtin ={Read#22024b72}> k#:3(v#:0 +#builtin "got") +#builtin "back",
        ) 
        +#builtin "provided",
    pure(v#:2) => v#:2 +#builtin "pure",
}
(v#:0: string, fn#:1: nope type: cps-lambda): string => {
    const result#:5: string;
    TODO Handle;
    return result#:5;
}
```
*/
export const hash_706cdc48: (arg_0: string, arg_1:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => string = (v: string, fn$1:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers, arg_1: string) => void) => void) => {
  let result: string = (null as any);
  handleSimpleShallow2<any, any, any>("22024b72", fn$1, [(handlers, _, k$3:
  /*from cps lambda*/
  (arg_0: string, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void) => {
    result = hash_706cdc48(v, (handlers: Handlers, done$6: (arg_0: Handlers, arg_1: string) => void) => {
      k$3(v + "got", handlers, (handlers: Handlers, returnValue$8: string) => {
        done$6(handlers, returnValue$8 + "back");
      });
    }) + "provided";
  }], (handlers: Handlers, v$2: string) => {
    result = v$2 + "pure";
  });
  return result;
};

/**
```
const both#13f87103 = (): void#builtin ={Read#22024b72, Write#35f4b478}> {
    const value#:0 = raise!(Read#22024b72.read());
    raise!(Write#35f4b478.write(value#:0));
}
(handlers#:15000: nope type: effect-handler, done#:1: (nope type: effect-handler) => void): void => {
    TODO raise;
}
```
*/
export const hash_13f87103:
/*from cps lambda*/
(arg_0: Handlers, arg_1: (arg_0: Handlers) => void, arg_2: Handlers, arg_3: (arg_0: Handlers) => void) => void = (handlers: Handlers, done: (arg_0: Handlers) => void) => {
  raise(handlers, "22024b72", 0, null, (handlers, value) => ((handlers: Handlers, value: string) => {
    raise(handlers, "35f4b478", 0, value, (handlers, value) => done(handlers, value));
  })(handlers, value));
};

/**
```
const sideBar#12752140 = (n#:0: int#builtin): string#builtin ={Read#22024b72}> {
    if n#:0 ==#ec95f154#51ea2a36#0 5 {
        getString#64605d94();
    } else {
        "wot";
    };
}
(
    n#:0: int,
    handlers#:15000: nope type: effect-handler,
    done#:1: (nope type: effect-handler, string) => void,
): void => {
    if IntEq#🦹‍♂️.#Eq#🦩🥜👩‍💻😃#0(n#:0, 5) {
        getString#⛷️😛🐠😃(
            handlers#:15000,
            (handlers#:15000: nope type: effect-handler, returnValue#:3: string): void => done#:1(
                handlers#:15000,
                returnValue#:3,
            ),
        );
    } else {
        done#:1(handlers#:15000, "wot");
    };
}
```
*/
export const hash_12752140:
/*from cps lambda*/
(arg_0: number, arg_1: Handlers, arg_2: (arg_0: Handlers, arg_1: string) => void) => void = (n: number, handlers: Handlers, done: (arg_0: Handlers, arg_1: string) => void) => {
  if (hash_ec95f154.h51ea2a36_0(n, 5)) {
    hash_64605d94(handlers, (handlers: Handlers, returnValue$3: string) => done(handlers, returnValue$3));
  } else {
    done(handlers, "wot");
  }
};

/*
(a#:0: int#builtin, b#:1: string#builtin): string#builtin ={Read#22024b72, Write#35f4b478}> b#:1 
    +#builtin getString#64605d94()
(
    a#:0: int,
    b#:1: string,
    handlers#:15000: nope type: effect-handler,
    done#:3: (nope type: effect-handler, string) => void,
): void => {
    getString#⛷️😛🐠😃(
        handlers#:15000,
        (handlers#:15000: nope type: effect-handler, returnValue#:5: string): void => {
            done#:3(handlers#:15000, b#:1 + returnValue#:5);
        },
    );
}
*/
(a: number, b: string, handlers: Handlers, done$3: (arg_0: Handlers, arg_1: string) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue$5: string) => {
    done$3(handlers, b + returnValue$5);
  });
};

/*
both#13f87103
both#👩‍🎓🐿️👲
*/
hash_13f87103;

/*
provideString#706cdc48(v: "Yes", fn: getString#64605d94) 
    ==#da00b310#51ea2a36#0 "Yesgotbackpureprovided"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    provideString#😦🚓🏪😃("Yes", getString#⛷️😛🐠😃),
    "Yesgotbackpureprovided",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_706cdc48("Yes", hash_64605d94), "Yesgotbackpureprovided");

/*
provideStringPlain#aae69bd8<string#builtin>(v: "Yes", fn: ifYes#67b65a8c) +#builtin ":" 
        +#builtin provideStringPlain#aae69bd8<string#builtin>(v: "Yes?", fn: ifYes#67b65a8c) 
    ==#da00b310#51ea2a36#0 "good:nope"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    provideStringPlain#🏐<string>("Yes", ifYes#🍞🏌️🥝😃) + ":" + provideStringPlain#🏐<string>(
        "Yes?",
        ifYes#🍞🏌️🥝😃,
    ),
    "good:nope",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_aae69bd8("Yes", hash_67b65a8c) + ":" + hash_aae69bd8("Yes?", hash_67b65a8c), "good:nope");

/*
provideStringPlain#aae69bd8<string#builtin>(
                v: "Yes",
                fn: (): string#builtin ={Read#22024b72}> sideBar#12752140(n: 5),
            ) 
            +#builtin ":" 
        +#builtin provideStringPlain#aae69bd8<string#builtin>(
            v: "Yes?",
            fn: (): string#builtin ={Read#22024b72}> sideBar#12752140(n: 4),
        ) 
    ==#da00b310#51ea2a36#0 "Yes:wot"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    provideStringPlain#🏐<string>(
        "Yes",
        (
            handlers#:15000: nope type: effect-handler,
            done#:1: (nope type: effect-handler, string) => void,
        ): void => {
            sideBar#🧕🤱👩‍✈️(
                5,
                handlers#:15000,
                (handlers#:15000: nope type: effect-handler, returnValue#:3: string): void => done#:1(
                    handlers#:15000,
                    returnValue#:3,
                ),
            );
        },
    ) + ":" + provideStringPlain#🏐<string>(
        "Yes?",
        (
            handlers#:15000: nope type: effect-handler,
            done#:4: (nope type: effect-handler, string) => void,
        ): void => {
            sideBar#🧕🤱👩‍✈️(
                4,
                handlers#:15000,
                (handlers#:15000: nope type: effect-handler, returnValue#:6: string): void => done#:4(
                    handlers#:15000,
                    returnValue#:6,
                ),
            );
        },
    ),
    "Yes:wot",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_aae69bd8("Yes", (handlers: Handlers, done: (arg_0: Handlers, arg_1: string) => void) => {
  hash_12752140(5, handlers, (handlers: Handlers, returnValue$3: string) => done(handlers, returnValue$3));
}) + ":" + hash_aae69bd8("Yes?", (handlers: Handlers, done$4: (arg_0: Handlers, arg_1: string) => void) => {
  hash_12752140(4, handlers, (handlers: Handlers, returnValue$6: string) => done$4(handlers, returnValue$6));
}), "Yes:wot");

/*
provideStringPlain#aae69bd8<string#builtin>(
        v: "what",
        fn: (): string#builtin ={Read#22024b72}> callAgain#2d49790b()(),
    ) 
    ==#da00b310#51ea2a36#0 "what"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    provideStringPlain#🏐<string>(
        "what",
        (
            handlers#:15000: nope type: effect-handler,
            done#:2: (nope type: effect-handler, string) => void,
        ): void => {
            callAgain#👨‍🌾🌻🍶(
                handlers#:15000,
                (handlers#:15000: nope type: effect-handler, returnValue#:4: () => string): void => {
                    done#:2(handlers#:15000, returnValue#:4());
                },
            );
        },
    ),
    "what",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_aae69bd8("what", (handlers: Handlers, done$2: (arg_0: Handlers, arg_1: string) => void) => {
  hash_2d49790b(handlers, (handlers: Handlers, returnValue: () => string) => {
    done$2(handlers, returnValue());
  });
}), "what");

/*
provideStringPlain#aae69bd8<Person#191447ce>(v: "Me", fn: getPerson#ebcedce8).name#191447ce#0 
    ==#da00b310#51ea2a36#0 "Me"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    provideStringPlain#🏐<Person#🎖️👨‍🔧🧗‍♀️>("Me", getPerson#🙅‍♀️).#Person#🎖️👨‍🔧🧗‍♀️#0,
    "Me",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_aae69bd8("Me", hash_ebcedce8).h191447ce_0, "Me");

/*
provideStringPlain#aae69bd8<Person#191447ce>(v: "Me", fn: spreadPerson#57d02ec3).name#191447ce#0 
    ==#da00b310#51ea2a36#0 "Me"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    provideStringPlain#🏐<Person#🎖️👨‍🔧🧗‍♀️>("Me", spreadPerson#🍧😊🧑‍🦼😃).#Person#🎖️👨‍🔧🧗‍♀️#0,
    "Me",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_aae69bd8("Me", hash_57d02ec3).h191447ce_0, "Me");

/*
provideIncrement#24f9c382<Array#builtin<string#builtin>>(
        v: "Hi",
        i: 0,
        fn: (): Array#builtin<string#builtin> ={Read#22024b72}> <string#builtin>[
            getString#64605d94(),
            getString#64605d94(),
        ],
    ) 
    ==#b06fe968#51ea2a36#0 <string#builtin>["Hi0", "Hi1"]
assertCall(
    ArrayStringEq#🧟.#Eq#🦩🥜👩‍💻😃#0,
    provideIncrement#🕗🍊🐝<Array<string>>(
        "Hi",
        0,
        (
            handlers#:15000: nope type: effect-handler,
            done#:3: (nope type: effect-handler, Array<string>) => void,
        ): void => {
            getString#⛷️😛🐠😃(
                handlers#:15000,
                (handlers#:15000: nope type: effect-handler, returnValue#:7: string): void => {
                    getString#⛷️😛🐠😃(
                        handlers#:15000,
                        (handlers#:15000: nope type: effect-handler, returnValue#:5: string): void => {
                            done#:3(handlers#:15000, [returnValue#:7, returnValue#:5]);
                        },
                    );
                },
            );
        },
    ),
    ["Hi0", "Hi1"],
)
*/
assertCall(hash_b06fe968.h51ea2a36_0, hash_24f9c382("Hi", 0, (handlers: Handlers, done$3: (arg_0: Handlers, arg_1: Array<string>) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue$7: string) => {
    hash_64605d94(handlers, (handlers: Handlers, returnValue$5: string) => {
      done$3(handlers, [returnValue$7, returnValue$5]);
    });
  });
}), ["Hi0", "Hi1"]);

/*
provideIncrement#24f9c382<Array#builtin<string#builtin>>(
        v: "Hi",
        i: 0,
        fn: (): Array#builtin<string#builtin> ={Read#22024b72}> <string#builtin>[
            ...getStringArr#3bfdbd8c(),
            getString#64605d94(),
        ],
    ) 
    ==#b06fe968#51ea2a36#0 <string#builtin>["Hi0", "Hi1"]
assertCall(
    ArrayStringEq#🧟.#Eq#🦩🥜👩‍💻😃#0,
    provideIncrement#🕗🍊🐝<Array<string>>(
        "Hi",
        0,
        (
            handlers#:15000: nope type: effect-handler,
            done#:3: (nope type: effect-handler, Array<string>) => void,
        ): void => {
            getStringArr#🧖⏱️🎈(
                handlers#:15000,
                (handlers#:15000: nope type: effect-handler, returnValue#:7: Array<string>): void => {
                    getString#⛷️😛🐠😃(
                        handlers#:15000,
                        (handlers#:15000: nope type: effect-handler, returnValue#:5: string): void => {
                            done#:3(handlers#:15000, [...returnValue#:7, returnValue#:5]);
                        },
                    );
                },
            );
        },
    ),
    ["Hi0", "Hi1"],
)
*/
assertCall(hash_b06fe968.h51ea2a36_0, hash_24f9c382("Hi", 0, (handlers: Handlers, done$3: (arg_0: Handlers, arg_1: Array<string>) => void) => {
  hash_3bfdbd8c(handlers, (handlers: Handlers, returnValue$7: Array<string>) => {
    hash_64605d94(handlers, (handlers: Handlers, returnValue$5: string) => {
      done$3(handlers, [...returnValue$7, returnValue$5]);
    });
  });
}), ["Hi0", "Hi1"]);

/*
(): string#builtin ={Read#22024b72, Write#35f4b478}> {
    raise!(Write#35f4b478.write("hello"));
    getString#64605d94();
}
(handlers#:15000: nope type: effect-handler, done#:1: (nope type: effect-handler, string) => void): void => {
    TODO raise;
}
*/
(handlers: Handlers, done: (arg_0: Handlers, arg_1: string) => void) => {
  raise(handlers, "35f4b478", 0, "hello", (handlers, value) => ((handlers: Handlers) => {
    hash_64605d94(handlers, (handlers: Handlers, returnValue$3: string) => done(handlers, returnValue$3));
  })(handlers, value));
};

/*
(): string#builtin ={Read#22024b72}> (getString#64605d94(), 1.0).0
(handlers#:15000: nope type: effect-handler, done#:3: (nope type: effect-handler, string) => void): void => {
    getString#⛷️😛🐠😃(
        handlers#:15000,
        (handlers#:15000: nope type: effect-handler, returnValue#:5: string): void => {
            done#:3(handlers#:15000, returnValue#:5);
        },
    );
}
*/
(handlers: Handlers, done$3: (arg_0: Handlers, arg_1: string) => void) => {
  hash_64605d94(handlers, (handlers: Handlers, returnValue$5: string) => {
    done$3(handlers, returnValue$5);
  });
};

/*
provideStringPlain#aae69bd8<string#builtin>(v: "ok", fn: getPersonName#3d61c465) 
    ==#da00b310#51ea2a36#0 "ok"
assertCall(
    StringEq#🕌.#Eq#🦩🥜👩‍💻😃#0,
    provideStringPlain#🏐<string>("ok", getPersonName#👾🙉🥎),
    "ok",
)
*/
assertCall(hash_da00b310.h51ea2a36_0, hash_aae69bd8("ok", hash_3d61c465), "ok");