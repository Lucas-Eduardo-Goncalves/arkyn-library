import { RenderElementProps } from "slate-react";
import "./styles.css";

function Element({ attributes, children, element }: RenderElementProps) {
  const style = { textAlign: element.align };

  switch (element.type) {
    case "blockQuote":
      return (
        <blockquote
          className="arkynElementBlockquote"
          style={style}
          {...attributes}
        >
          {children}
        </blockquote>
      );
    case "bulletedList":
      return (
        <ul className="arkynElementBulletList" style={style} {...attributes}>
          {children}
        </ul>
      );
    case "headingOne":
      return (
        <h1 className="arkynElementHeadingOne" style={style} {...attributes}>
          {children}
        </h1>
      );
    case "headingTwo":
      return (
        <h2 className="arkynElementHeadingTwo" style={style} {...attributes}>
          {children}
        </h2>
      );
    case "listItem":
      return (
        <li className="arkynElementListItem" style={style} {...attributes}>
          {children}
        </li>
      );
    case "numberedList":
      return (
        <ol className="arkynElementNumberedList" style={style} {...attributes}>
          {children}
        </ol>
      );
    case "image":
      return (
        <div style={style} {...attributes}>
          <img
            className="arkynElementImage"
            alt="arkynElementImage"
            src={element?.src || ""}
          />

          {children}
        </div>
      );

    default:
      return (
        <p className="arkynElementParagraph" style={style} {...attributes}>
          {children}
        </p>
      );
  }
}

export { Element };
