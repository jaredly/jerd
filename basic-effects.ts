const log = console.log
// () => string
const hash_02605aa8 = () => {
  return "hello world";
};
// () => void
const hash_4af30a40 = () => {
  return log(hash_02605aa8());
};

const handleSimpleShallow2 = <Get, R>(
    fn: (handler: ShallowHandler<Get>, cb: (fnReturnValue: R) => void) => void,
    handleEffect: (
        cb: (
            gotten: Get,
            newHandler: ShallowHandler<Get>,
            returnIntoHandler: (fnReturnValue: R) => void,
        ) => void,
    ) => void,
    handlePure: (fnReturnValue: R) => void,
) => {
    let fnsReturnPointer = handlePure;
    fn(
        (returnIntoFn) => {
            handleEffect(
                (handlersValueToSend, newHandler, returnIntoHandler) => {
                    fnsReturnPointer = returnIntoHandler;
                    returnIntoFn(newHandler, handlersValueToSend);
                },
            );
        },
        (fnsReturnValue) => fnsReturnPointer(fnsReturnValue),
    );
};

// (string) => (() =(a690a6f2)> void) => void
const hash_d52c41da = responseValue_0 => fn_1 => {
  handleSimpleShallow2(fn_1, (cb) => {
    hash_d52c41da(responseValue_0)((handler, done) => {
      cb(responseValue_0, handler, done)
    })
  }, () => {});
};
const raise = (handlers, _, __, done) => {
  handlers(done)

}

// (string) =(a690a6f2)> string
const hash_804ca090 = (name_0, handlers, done) => (_ignored => {
  raise(handlers, "a690a6f2", null, (handlers, value) => done(value));
})(log("farther " + name_0));
// (string) =(a690a6f2, a690a6f2, a690a6f2, a690a6f2)> void
const hash_5f69d9fc = (name_0, handlers, done) => hash_804ca090("Farther", handlers, arg_0 => (_ignored => {
  (_ignored => {
    (_ignored => {
      raise(handlers, "a690a6f2", null, (handlers, value) => (arg_0 => (arg_0 => raise(handlers, "a690a6f2", null, (handlers, value) => (arg_1 => (arg_0 => (_ignored => {
        raise(handlers, "a690a6f2", null, (handlers, value) => (arg_1 => (arg_0 => (_ignored => {
          done(log("Dones"));
        })(log(arg_0)))("And then " + arg_1))(value));
      })(log(arg_0)))(arg_0 + arg_1))(value)))(arg_0 + " and "))(value));
    })(log(name_0));
  })(log("getting"));
})(log(arg_0)));
// () => void
const hash_cf26df7a = () => {
  return hash_d52c41da("hello")((handlers, done) => hash_5f69d9fc("Yes", handlers, done));
};
// void
hash_4af30a40()
hash_cf26df7a();