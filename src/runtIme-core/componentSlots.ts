import { shapeFlags } from "../shared/shapeFlags";
export function initSlots(instance, children) {
  const { vnode } = instance;
  if (vnode.shapeFlag & shapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(instance.slots, children);
  }
}
function normalizeObjectSlots(slots, children) {
  for (const key in children) {
    const value = children[key];
    slots[key] = (props) => normalizeSlotValues(value(props));
  }
}
function normalizeSlotValues(value) {
  return Array.isArray(value) ? value : [value];
}
