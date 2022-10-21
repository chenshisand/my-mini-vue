import { generate } from "./codegen";
import { baseParse } from "./parse";
import { transformElement } from "./transforms/transformElement";
import { transformExpression } from "./transforms/transformExpression";
import { transformText } from "./transforms/transformText";
import { transfrom } from "./transfrom";

export function baseCompile(template) {
  const ast = baseParse(template);
  transfrom(ast, {
    nodeTransforms: [transformExpression, transformElement, transformText],
  });
  return generate(ast);
}
