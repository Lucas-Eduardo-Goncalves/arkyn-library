import { ReactNode } from "react";
import "./styles.css";

type MultiSelectContentProps = {
  children: ReactNode;
  size: "md" | "lg";
};

function MultiSelectContent(props: MultiSelectContentProps) {
  const { children, size } = props;
  const className = `arkynMultiSelectContent ${size}`;
  return <div className={className}>{children}</div>;
}

export { MultiSelectContent };
