import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  // path
  path(vnode, container);
}
function path(vnode, container) {
  processComponent(vnode, container);
}
function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}
function mountComponent(vnode: any, container) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance);
  setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
  const subTree = instance.render();
  path(subTree, container);
}
