import type { ReactNode } from "react";
import "./styles.css";

type DatePickerContentProps = {
	children: ReactNode;
	size: "md" | "lg";
};

function DatePickerContent(props: DatePickerContentProps) {
	const { children, size } = props;
	const className = `arkynDatePickerContent ${size}`;
	return <div className={className}>{children}</div>;
}

export { DatePickerContent };
