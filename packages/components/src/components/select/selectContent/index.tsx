import type { ReactNode } from "react";
import "./styles.css";

type SelectContentProps = {
	children: ReactNode;
	size: "md" | "lg";
};

function SelectContent(props: SelectContentProps) {
	const { children, size } = props;
	const className = `arkynSelectContent ${size}`;
	return <div className={className}>{children}</div>;
}

export { SelectContent };
