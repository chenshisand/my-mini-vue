import { h } from "../../dist/guide-mini-vue.esm.js";
export const Foo = {
  render() {
    return h("div", {}, "foo:" + this.count);
  },
  setup(props) {
    console.log(props);
    props.count++;
    console.log(props);
  },
};