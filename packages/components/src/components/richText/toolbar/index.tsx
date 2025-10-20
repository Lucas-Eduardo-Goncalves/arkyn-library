import { ReactNode } from "react";
import "./styles.css";

type ToolbarProps = {
  children: ReactNode;
};

function Toolbar({ children }: ToolbarProps) {
  return <div className="arkynRichTextToolbar">{children}</div>;
}

export { Toolbar };
