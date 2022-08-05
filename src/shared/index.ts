export const extend = Object.assign;
export const EMPTY_OBJ = {};

export const isObject = (value) => {
  return value !== null && typeof value === "object";
};
export const hasChanged = (val, newValue) => {
  return !Object.is(newValue, val);
};
export const hasOwn = (val, key) =>
  Object.prototype.hasOwnProperty.call(val, key);
// add -> Add
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
// add-foo -> addFoo
export const cameLize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : "";
  });
};
// add-foo ->AddFoo
export const toHanlderKey = (str: string) => {
  return str ? "on" + capitalize(str) : "";
};
