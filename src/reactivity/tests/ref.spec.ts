import { effect } from "../effect";
import { reactive } from "../reactive";
import { isRef, proxyRefs, ref, unRef } from "../ref";

describe("ref", () => {
  it("happy path", () => {
    const a = ref(1);
    expect(a.value).toBe(1);
  });
  it("should be reactive", () => {
    const a = ref(1);
    let dumy;
    let calls = 0;
    effect(() => {
      calls++;
      dumy = a.value;
    });
    expect(calls).toBe(1);
    expect(dumy).toBe(1);
    a.value = 2;
    expect(calls).toBe(2);
    expect(dumy).toBe(2);
    a.value = 2;
    expect(calls).toBe(2);
    expect(dumy).toBe(2);
  });
  it("should make nested properties reactive", () => {
    const a = ref({
      count: 1,
    });
    let dumy;
    effect(() => {
      dumy = a.value.count;
    });
    expect(dumy).toBe(1);
    a.value.count = 2;
    expect(dumy).toBe(2);
  });
  it("isRef", () => {
    const a = ref(1);
    const user = reactive({ foo: 1 });
    expect(isRef(a)).toBe(true);
    expect(isRef(1)).toBe(false);
    expect(isRef(user)).toBe(false);
  });
  it("unRef", () => {
    const a = ref(2);
    expect(unRef(a)).toBe(2);
    expect(unRef(1)).toBe(1);
  });
  it("proxyRefs", () => {
    const user = {
      age: ref(10),
      name: "haha",
    };
    const proxyUser = proxyRefs(user);
    expect(user.age.value).toBe(10);
    expect(proxyUser.age).toBe(10);
    expect(proxyUser.name).toBe("haha");

    proxyUser.age = 20;
    expect(proxyUser.age).toBe(20);
    expect(user.age.value).toBe(20);

    proxyUser.age = ref(15);
    expect(proxyUser.age).toBe(15);
    expect(user.age.value).toBe(15);
  });
});
