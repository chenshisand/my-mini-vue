import { effect } from "../reactivity/effect";
import { EMPTY_OBJ } from "../shared";
import { shapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { Fragment, Text } from "./vnode";
export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options;
  function render(vnode, container) {
    // path
    path(null, vnode, container, null);
  }
  // n1 old， n2 new
  function path(n1, n2, container, parentComponent) {
    const { type, shapeFlag } = n2;
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & shapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent);
        } else if (shapeFlag & shapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent);
        }
        break;
    }
  }
  function processElement(n1, n2: any, container: any, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container, parentComponent);
    }
  }
  function patchElement(n1, n2, container, parentComponent) {
    console.log("patchElement");
    console.log(n1);
    console.log(n2);
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    const el = (n2.el = n1.el);
    pathChildren(n1, n2, el, parentComponent);
    patchProps(el, oldProps, newProps);
  }
  function pathChildren(n1, n2, container, parentComponent) {
    const prevShapeFlag = n1.shapeFlag;
    const { shapeFlag } = n2;
    const c1 = n1.children;
    const c2 = n2.children;
    if (shapeFlag & shapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & shapeFlags.ARRY_CHILDREN) {
        unmountChildren(n1.children);
        hostSetElementText(container, c2);
      }
      if (c1 !== c2) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & shapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, "");
        mountChildren(c2, container, parentComponent);
      }
    }
  }
  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el;
      hostRemove(el);
    }
  }
  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key];
        const nextProp = newProps[key];
        if (prevProp !== nextProp) {
          hostPatchProp(el, key, prevProp, nextProp);
        }
      }
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null);
          }
        }
      }
    }
  }
  function mountElement(vnode: any, container: any, parentComponent) {
    const el = (vnode.el = hostCreateElement(vnode.type));
    const { children, shapeFlag } = vnode;

    if (shapeFlag & shapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & shapeFlags.ARRY_CHILDREN) {
      mountChildren(vnode.children, el, parentComponent);
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
      hostPatchProp(el, key, null, val);
    }
    // container.append(el);
    hostInsert(el, container);
  }
  function mountChildren(children: any, container: any, parentComponent) {
    children.forEach((v) => {
      path(null, v, container, parentComponent);
    });
  }
  function processComponent(n1, n2: any, container: any, parentComponent) {
    mountComponent(n2, container, parentComponent);
  }
  function mountComponent(initialVnode: any, container, parentComponent) {
    const instance = createComponentInstance(initialVnode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, initialVnode, container);
  }
  function setupRenderEffect(instance, initialVnode, container) {
    effect(() => {
      if (!instance.isMounted) {
        console.log("init");

        const { proxy } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));
        path(null, subTree, container, instance);
        initialVnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log("update");

        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        instance.subTree = subTree;
        path(prevSubTree, subTree, container, instance);
      }
    });
  }

  function processFragment(n1, n2: any, container: any, parentComponent) {
    mountChildren(n2.children, container, parentComponent);
  }
  function processText(n1, n2: any, container: any) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }
  return {
    createApp: createAppApi(render),
  };
}
