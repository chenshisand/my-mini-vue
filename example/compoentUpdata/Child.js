import { h, ref } from "../../lib/guide-mini-vue.esm.js";
export default {
  name: "child",
  setup(props, { emit }) {},
  render(proxy) {
    return h("div", {}, [h("div", {}, "child-pros-msg" + this.$props.msg)]);
  },
};
