import { effect } from "../effect";
import { ref } from "../ref";

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
});
