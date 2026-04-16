import { Element, Text } from "slate";
import { ParseElement } from "../types/richTextTypes";

function serialize(node: any): string {
  if (Text.isText(node)) {
    let text = node?.text;
    if (node?.bold) {
      text = `<strong>${text}</strong>`;
    }
    if (node?.code) {
      text = `<code>${text}</code>`;
    }
    if (node?.italic) {
      text = `<em>${text}</em>`;
    }
    if (node?.underline) {
      text = `<u>${text}</u>`;
    }
    return text;
  }

  if (Element.isElement(node)) {
    const children = node.children?.map((n: any) => serialize(n)).join("");
    const alignStyle = node.align || "left";

    switch (node.type) {
      case "video":
        return `<iframe src="${node.src}" class="align_${alignStyle}" />`;
      case "image":
        return `<img src="${node.src}" class="align_${alignStyle}" />`;
      case "paragraph":
        return `<p class="align_${alignStyle}">${children}</p>`;
      case "blockQuote":
        return `<blockquote class="align_${alignStyle}">${children}</blockquote>`;
      case "bulletedList":
        return `<ul class="align_${alignStyle}">${children}</ul>`;
      case "headingOne":
        return `<h1 class="align_${alignStyle}">${children}</h1>`;
      case "headingTwo":
        return `<h2 class="align_${alignStyle}">${children}</h2>`;
      case "listItem":
        return `<li class="align_${alignStyle}">${children}</li>`;
      case "numberedList":
        return `<ol class="align_${alignStyle}">${children}</ol>`;
      default:
        return "";
    }
  }

  return "";
}

function deserialize(el: ParseElement): any {
  if (typeof el === "string") {
    return { text: el };
  }

  const children = Array.isArray(el.props.children)
    ? el.props.children.map((child) => deserialize(child))
    : [{ text: el.props.children || "" }];

  const align = el.props.className?.replace("align_", "") as
    | "left"
    | "center"
    | "right"
    | "justify";

  switch (el.type) {
    case "img":
      return {
        type: "image",
        align,
        src: el.props.src,
        children: [{ text: "" }],
      };
    case "p":
      return { type: "paragraph", align, children };
    case "blockquote":
      return { type: "blockQuote", align, children };
    case "ul":
      return { type: "bulletedList", align, children };
    case "ol":
      return { type: "numberedList", align, children };
    case "li":
      return { type: "listItem", align, children };
    case "h1":
      return { type: "headingOne", align, children };
    case "h2":
      return { type: "headingTwo", align, children };
    case "strong":
      return { text: el.props.children, bold: true };
    case "code":
      return { text: el.props.children, code: true };
    case "em":
      return { text: el.props.children, italic: true };
    case "u":
      return { text: el.props.children, underline: true };
    default:
      return { text: el.props.children || "" };
  }
}

export { deserialize, serialize };
