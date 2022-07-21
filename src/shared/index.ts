export const extend = Object.assign;

export const isObject = (value) => {
  return value !== null && typeof value === "object";
};
export const hasChanged = (val, newValue) => {
  return !Object.is(newValue, val);
};
export const hasOwn = (val, key) =>
  Object.prototype.hasOwnProperty.call(val, key);
