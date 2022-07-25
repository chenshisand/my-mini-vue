import { hasOwn } from "../shared/index";

const pubicPropertiesMap = {
  $el: (i) => i.vnode.el,
  $slots: (i) => i.slots,
};
export const PulicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setUpState, props } = instance;
    if (key in setUpState) {
      return setUpState[key];
    }
    if (hasOwn(setUpState, key)) {
      return setUpState[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    }
    const publicGetter = pubicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
  },
};
