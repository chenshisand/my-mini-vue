import { shapeFlags } from "../shared/shapeFlags";
export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");

export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    component: null,
    key: props && props.key,
    el: null,
    shapeFlag: getShapeflag(type),
  };
  if (typeof children === "string") {
    vnode.shapeFlag |= shapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= shapeFlags.ARRY_CHILDREN;
  }
  // slots
  if (vnode.shapeFlag & shapeFlags.STATEFUL_COMPONENT) {
    if (typeof children === "object") {
      vnode.shapeFlag |= shapeFlags.SLOT_CHILDREN;
    }
  }
  return vnode;
}
function getShapeflag(type) {
  return typeof type === "string"
    ? shapeFlags.ELEMENT
    : shapeFlags.STATEFUL_COMPONENT;
}
export function createTextVnode(text: string) {
  return createVNode(Text, {}, text);
}
