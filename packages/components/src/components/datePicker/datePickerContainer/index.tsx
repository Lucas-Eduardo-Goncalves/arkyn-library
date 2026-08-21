import type { KeyboardEvent, ReactNode, RefObject } from "react";
import "./styles.css";

type DatePickerContainerProps = {
	children: ReactNode;
	handleContainerFocus: () => void;
	prefixExists: boolean;
	isError: boolean;
	disabled: boolean;
	readOnly: boolean;
	isLoading: boolean;
	isFocused: boolean;
	className?: string;
	id: string;
	variant: "solid" | "outline" | "underline";
	size: "md" | "lg";
	containerRef?: RefObject<HTMLDivElement | null>;
	onContainerKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
	tabIndex?: number;
	ariaControls?: string;
};

function DatePickerContainer(props: DatePickerContainerProps) {
	const {
		children,
		handleContainerFocus,
		disabled,
		isError,
		isLoading,
		isFocused,
		className,
		readOnly,
		variant,
		size,
		id,
		prefixExists,
		containerRef,
		onContainerKeyDown,
		tabIndex,
		ariaControls,
	} = props;

	const hasPrefix = prefixExists ? "hasPrefix" : "";
	const errored = isError ? "errored" : "";
	const opacity = disabled || readOnly || isLoading ? "opacity" : "";
	const focused = isFocused ? "focused" : "";

	return (
		<div
			ref={containerRef}
			id={id}
			tabIndex={tabIndex}
			role="combobox"
			aria-haspopup="dialog"
			aria-expanded={isFocused}
			aria-controls={ariaControls}
			className={`arkynDatePickerContainer ${hasPrefix} ${variant} ${size} ${opacity} ${errored} ${focused} ${className}`}
			onClick={handleContainerFocus}
			onKeyDown={onContainerKeyDown}
		>
			{children}
		</div>
	);
}

export { DatePickerContainer };
