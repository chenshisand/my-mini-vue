import { proxyRefs } from "../reactivity";
import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PulicInstanceProxyHandlers } from "./componentPulicInstance";
import { initSlots } from "./componentSlots";

export function createComponentInstance(vnode, parent) {
  console.log(parent);

  const component = {
    vnode,
    type: vnode.type,
    setUpState: {},
    props: {},
    slots: {},
    provides: parent ? parent.provides : {},
    Mounted: false,
    parent,
    proxy: null,
    subTree: {},
    emit: () => {},
  };
  component.emit = emit.bind(null, component) as any;
  return component;
}
export function setupComponent(instance) {
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);

  setupStatefulComponent(instance);
}
function setupStatefulComponent(instance: any) {
  const Component = instance.type;

  //ctx
  instance.proxy = new Proxy({ _: instance }, PulicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    setCurrentInstance(instance);
    const setUpResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    // const setUpResult = setup(instance.props);
    setCurrentInstance(null);
    handleSetupResult(instance, setUpResult);
  }
}
function handleSetupResult(instance, setUpResult: any) {
  if (typeof setUpResult === "object") {
    instance.setUpState = proxyRefs(setUpResult);
  }
  finishComponentSetup(instance);
}
function finishComponentSetup(instance: any) {
  const Component = instance.type;
  instance.render = Component.render;
}
let currentInstance = null;
export function getCurrentInstance() {
  return currentInstance;
}
export function setCurrentInstance(instance) {
  currentInstance = instance;
}
