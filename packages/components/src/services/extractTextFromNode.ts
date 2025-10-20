import { Descendant, Node } from "slate";

function extractTextFromNode(nodes: Descendant[]) {
  return nodes.map((n) => Node.string(n)).join("");
}

export { extractTextFromNode };
