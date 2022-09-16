export function transfrom(root, options) {
  const context = createTransfromContext(root, options);
  traverseNode(root, context);
}
function traverseNode(node, context) {
  const nodeTransforms = context.nodeTransforms;
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transformOptions = nodeTransforms[i];
    transformOptions(node);
  }
  traverseChildren(node, context);
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
  };
  return context;
}
