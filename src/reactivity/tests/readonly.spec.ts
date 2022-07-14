import {
  isProxy,
  isReactive,
  isReadonly,
  reactive,
  readonly,
} from "../reactive";

describe("readonly", () => {
  it("happy path", () => {
    const original = {
      foo: 1,
      bar: {
        baz: 2,
      },
    };
    const observed = reactive(original);
    const wrapped = readonly(original);
    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(observed.bar)).toBe(true);

    expect(isReactive(original)).toBe(false);
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(wrapped.bar)).toBe(true);

    expect(isReadonly(original)).toBe(false);

    expect(isReadonly(observed)).toBe(false);
    expect(isProxy(wrapped)).toBe(true);
  });
  it("warn then call set", () => {
    console.warn = jest.fn();
    const user = readonly({
      age: 10,
    });

    user.age = 11;
    expect(console.warn).toBeCalled();
  });
});
