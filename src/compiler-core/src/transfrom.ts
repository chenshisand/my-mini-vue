import { NodeTypes } from "./ast";
import { TO_DISPLAY_STRING } from "./runtimeHelpers";

export function transfrom(root, options = {}) {
  const context = createTransfromContext(root, options);
  traverseNode(root, context);

  createRootCodegen(root);
  root.helpers = [...context.helpers.keys()];
}
function traverseNode(node, context) {
  const nodeTransforms = context.nodeTransforms;
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transformOptions = nodeTransforms[i];
    transformOptions(node);
  }
  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING);
      break;
    case NodeTypes.ROOT:
      traverseChildren(node, context);
      break;
    case NodeTypes.ELEMENT:
      traverseChildren(node, context);
      break;
    default:
      break;
  }
}
function traverseChildren(node, context) {
  const children = node.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const N = children[i];
      traverseNode(N, context);
    }
  }
}
function createTransfromContext(root: any, options: any) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
    helpers: new Map(),
    helper(key) {
      context.helpers.set(key, 1);
    },
  };
  return context;
}
function createRootCodegen(root: any) {
  root.codegenNode = root.children[0];
}
