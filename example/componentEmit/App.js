import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";
window.self = null;
export const App = {
  render() {
    window.self = this;
    return h(
      "div",
      {
        id: "root",
        class: ["red", "blue"],
      },
      [
        h("div", {}, "hi," + this.msg),
        h(Foo, {
          count: 1,
          onAdd(a, b) {
            console.log("onAdd", a, b);
          },
          onAddFoo(a, b) {
            console.log("onAddFoo", a, b);
          },
        }),
      ]
    );
  },
  setup() {
    return {
      msg: "mini-vue-emit",
    };
  },
};
