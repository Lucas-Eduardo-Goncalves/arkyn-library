import type { ReactNode } from "react";
import "./styles.css";

type PhoneInputContainerProps = {
	children: ReactNode;
	onFocus: () => void;
	isError: boolean;
	disabled: boolean;
	readOnly: boolean;
	isLoading: boolean;
	isFocused: boolean;
	className?: string;
	variant: "solid" | "outline";
	size: "md" | "lg";
};

function PhoneInputContainer(props: PhoneInputContainerProps) {
	const {
		children,
		onFocus,
		disabled,
		isError,
		isLoading,
		isFocused,
		className: baseClassName = "",
		readOnly,
		variant,
		size,
	} = props;

	const errored = isError ? "errored" : "";
	const opacity = disabled || readOnly || isLoading ? "opacity" : "";
	const focused = isFocused ? "focused" : "";

	const className = `arkynPhoneInputContainer ${variant} ${size} ${opacity} ${errored} ${focused} ${baseClassName}`;

	return (
		<section className={className.trim()} onClick={onFocus}>
			{children}
		</section>
	);
}

export { PhoneInputContainer };
