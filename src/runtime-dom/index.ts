import { createRenderer } from "../runtIme-core";
function createElement(type) {
  return document.createElement(type);
}
function patchProp(el, key, prevval, nextVal) {
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLocaleLowerCase();
    el.addEventListener(event, nextVal);
  } else {
    if (nextVal === undefined || nextVal === null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextVal);
    }
  }
}
function remove(child) {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}
function setElementText(el, text) {
  el.textContent = text;
}
function insert(el, parent) {
  parent.append(el);
}
const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
  remove,
  setElementText,
});
export function createApp(...args) {
  return renderer.createApp(...args);
}
export * from "../runtIme-core";
