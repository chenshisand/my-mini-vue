import { shapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { Fragment, Text } from "./vnode";
export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
  } = options;
  function render(vnode, container) {
    // path
    path(vnode, container);
  }
  function path(vnode, container) {
    const { type, shapeFlag } = vnode;
    switch (type) {
      case Fragment:
        processFragment(vnode, container);
        break;
      case Text:
        processText(vnode, container);
        break;
      default:
        if (shapeFlag & shapeFlags.ELEMENT) {
          processElement(vnode, container);
        } else if (shapeFlag & shapeFlags.STATEFUL_COMPONENT) {
          processComponent(vnode, container);
        }
        break;
    }
  }
  function processElement(vnode: any, container: any) {
    mountElement(vnode, container);
  }
  function mountElement(vnode: any, container: any) {
    const el = (vnode.el = hostCreateElement(vnode.type));
    const { children, shapeFlag } = vnode;

    if (shapeFlag & shapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & shapeFlags.ARRY_CHILDREN) {
      mountChildren(vnode, el);
    }
    const { props } = vnode;
    for (const key in props) {
      const val = props[key];
      // const isOn = (key: string) => /^on[A-Z]/.test(key);
      // if (isOn(key)) {
      //   const event = key.slice(2).toLocaleLowerCase();
      //   el.addEventListener(event, val);
      // } else {
      //   el.setAttribute(key, val);
      // }
      hostPatchProp(el, key, val);
    }
    // container.append(el);
    hostInsert(el, container);
  }
  function mountChildren(vnode: any, container: any) {
    vnode.children.forEach((v) => {
      path(v, container);
    });
  }
  function processComponent(vnode: any, container: any) {
    mountComponent(vnode, container);
  }
  function mountComponent(initialVnode: any, container) {
    const instance = createComponentInstance(initialVnode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVnode, container);
  }
  function setupRenderEffect(instance, initialVnode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    path(subTree, container);
    initialVnode.el = subTree.el;
  }

  function processFragment(vnode: any, container: any) {
    mountChildren(vnode, container);
  }
  function processText(vnode: any, container: any) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
  }
  return {
    createApp: createAppApi(render),
  };
}
