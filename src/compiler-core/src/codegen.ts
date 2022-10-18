import { NodeTypes } from "./ast";
import { helperNameMap, TO_DISPLAY_STRING } from "./runtimeHelpers";

export function generate(ast) {
  const context = createCodegenContext();
  const { push } = context;

  genFunctionPreamble(ast, context);

  const functionName = "render";
  const args = ["_ctx", "_cache"];
  const signature = args.join(",");
  console.log(ast);
  push(` function ${functionName} (${signature}) {`);
  push("return ");
  genNode(ast.codegenNode, context);
  push("}");
  return {
    code: context.code,
  };
}
function genNode(node: any, context: any) {
  switch (node.type) {
    case NodeTypes.TEXT:
      genText(context, node);
      break;
    case NodeTypes.INTERPOLATION:
      geninterpolation(context, node);
      break;
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(context, node);
      break;
    default:
      break;
  }
}
function genText(context: any, node: any) {
  const { push } = context;
  push(`'${node.content}'`);
}
function genFunctionPreamble(ast: any, context: any) {
  const { push } = context;
  const VueBinging = `Vue`;
  const aliasHelper = (s) => {
    return `${helperNameMap[s]}:_${helperNameMap[s]}`;
  };
  if (ast.helpers.length > 0) {
    push(
      `const { ${ast.helpers.map(aliasHelper).join(", ")} } = ${VueBinging}`
    );
  }
  push(`\n`);
  push("return ");
}
function createCodegenContext() {
  const context = {
    code: "",
    push(source) {
      context.code += source;
    },
    helper(key) {
      return `_${helperNameMap[key]}`;
    },
  };
  return context;
}
function geninterpolation(context: any, node: any) {
  const { push, helper } = context;
  push(`${helper(TO_DISPLAY_STRING)}(`);
  genNode(context, node.content);
  push(`)`);
}
function genExpression(context: any, node: any) {
  const { push } = context;
  push(`${node.content}`);
}
