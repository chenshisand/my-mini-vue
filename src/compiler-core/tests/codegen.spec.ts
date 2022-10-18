import { generate } from "../src/codegen";
import { baseParse } from "../src/parse";
import { transfrom } from "../src/transfrom";
import { transformExpression } from "../src/transforms/transformExpression";
import { transformElement } from "../src/transforms/transformElement";
import { transformText } from "../src/transforms/transformText";
describe("codegen", () => {
  it("string", () => {
    const ast = baseParse("hi");
    transfrom(ast);
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });

  it("interpolation", () => {
    const ast = baseParse("{{message}}");
    transfrom(ast, {
      nodeTransforms: [transformExpression],
    });
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });
  it("element", () => {
    const ast = baseParse("<div>hi,{{message}}</div>");
    transfrom(ast, {
      nodeTransforms: [transformExpression, transformElement, transformText],
    });
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });
});
