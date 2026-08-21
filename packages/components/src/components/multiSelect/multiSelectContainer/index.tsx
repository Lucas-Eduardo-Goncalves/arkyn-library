import type { KeyboardEvent, ReactNode, RefObject } from "react";
import "./styles.css";

type MultiSelectContainerProps = {
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
	ariaActiveDescendant?: string;
};

function MultiSelectContainer(props: MultiSelectContainerProps) {
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
		ariaActiveDescendant,
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
			aria-haspopup="listbox"
			aria-expanded={isFocused}
			aria-controls={ariaControls}
			aria-activedescendant={ariaActiveDescendant}
			className={`arkynMultiSelectContainer ${hasPrefix} ${variant} ${size} ${opacity} ${errored} ${focused} ${className}`}
			onClick={handleContainerFocus}
			onKeyDown={onContainerKeyDown}
		>
			{children}
		</div>
	);
}

export { MultiSelectContainer };
