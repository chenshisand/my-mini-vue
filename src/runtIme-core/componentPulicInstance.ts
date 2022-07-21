const pubicPropertiesMap = {
  $el: (i) => i.vnode.el,
};
export const PulicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setUpState } = instance;
    if (key in setUpState) {
      return setUpState[key];
    }
    const publicGetter = pubicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
  },
};
