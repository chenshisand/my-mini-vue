import { cameLize, toHanlderKey } from "@guide-mini-vue/shared";

export function emit(instance, event, ...args) {
  console.log("@emit", event);
  // instance.props -> evnet

  const { props } = instance;

  const handlerName = toHanlderKey(cameLize(event));
  const handler = props[handlerName];
  handler && handler(...args);
}
