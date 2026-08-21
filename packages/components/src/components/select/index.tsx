import type { LucideIcon } from "lucide-react";
import {
	type FocusEvent,
	type KeyboardEvent,
	useId,
	useRef,
	useState,
} from "react";

import { useForm } from "../../hooks/useForm";
import { FieldTemplate } from "../../services/fieldTemplate";
import { IconRenderer } from "../../services/iconRenderer";

import { SelectChevron } from "./selectChevron";
import { SelectContainer } from "./selectContainer";
import { SelectContent } from "./selectContent";
import { SelectOption } from "./selectOption";
import { SelectOptionsContainer } from "./selectOptionsContainer";
import { SelectOverlay } from "./selectOverlay";
import { SelectSpinner } from "./selectSpinner";

type SelectProps = {
	/** Field name for form submission. Required. */
	name: string;
	/** Array of selectable options. Required. */
	options: { label: string; value: string }[];
	/** Optional HTML id for the underlying hidden input. */
	id?: string;
	/** Controlled selected value. */
	value?: string;
	/** Uncontrolled default selected value. @default "" */
	defaultValue?: string;
	/** Displays an asterisk on the label to signal a required field. */
	showAsterisk?: boolean;
	/** Optional label text displayed above the select. */
	label?: string;
	/** Validation error message displayed below the select. */
	errorMessage?: string;
	/** Placeholder text shown when no option is selected. @default "Selecione..." */
	placeholder?: string;
	/** Text shown when no options match the search query. @default "Sem opções disponíveis" */
	notFoundText?: string;
	/** Additional CSS class applied to the wrapper element. */
	className?: string;
	/** Disables all interactions. @default false */
	disabled?: boolean;
	/** Prevents value changes while keeping the current value visible. @default false */
	readOnly?: boolean;
	/** Shows a loading spinner and disables interactions. @default false */
	isLoading?: boolean;
	/** Enables search/filter within the dropdown. @default false */
	isSearchable?: boolean;
	/** Closes the dropdown after an option is selected. @default true */
	closeOnSelect?: boolean;
	/** Callback fired when the search query changes. Use for async option loading. */
	onSearch?: (value: string) => void;
	/** Callback fired when the selected value changes. */
	onChange?: (value: string) => void;
	/** Callback fired when the select gains focus. */
	onFocus?: () => void;
	/** Callback fired when the select loses focus. */
	onBlur?: (e: FocusEvent<HTMLDivElement>) => void;
	/**
	 * Select size.
	 * @default "md"
	 */
	size?: "md" | "lg";
	/**
	 * Visual style variant.
	 * - `solid`: filled background.
	 * - `outline`: bordered, transparent background.
	 * - `underline`: bottom border only.
	 * @default "solid"
	 */
	variant?: "solid" | "outline" | "underline";
	/** Text or icon rendered at the far left, outside the select area. */
	prefix?: string | LucideIcon;
	/** Lucide icon rendered inside the select on the left. */
	leftIcon?: LucideIcon;
	/** Maximum height (in px) of the options dropdown. */
	optionMaxHeight?: number;
	/** When true, skips `FieldTemplate` wrapper (label and error text). @default false */
	unShowFieldTemplate?: boolean;
	/**
	 * Layout direction forwarded to `FieldTemplate`.
	 * @default "horizontal"
	 */
	orientation?: "horizontal" | "vertical" | "horizontalReverse";
};

/**
 * Select, single-option dropdown with optional search, label, validation, and form integration.
 *
 * Integrates with `useForm` to display validation errors by field name.
 *
 * @param props.name - Field name for form submission. Required.
 * @param props.options - Array of selectable options (`{ label, value }`). Required.
 * @param props.value - Controlled selected value.
 * @param props.defaultValue - Uncontrolled default value. Default: ""
 * @param props.label - Label text displayed above the select.
 * @param props.placeholder - Placeholder shown when nothing is selected. Default: "Selecione..."
 * @param props.errorMessage - Validation error message.
 * @param props.isSearchable - Enables search/filter within the dropdown. Default: false
 * @param props.isLoading - Shows a loading spinner and disables interactions. Default: false
 * @param props.closeOnSelect - Closes the dropdown after selecting. Default: true
 * @param props.onChange - Callback fired when the selected value changes.
 * @param props.onSearch - Callback fired when the search query changes.
 * @param props.size - Select size (`md` | `lg`). Default: "md"
 * @param props.variant - Visual style variant. Default: "solid"
 * @param props.orientation - Layout direction. Default: "vertical"
 * @param props.unShowFieldTemplate - Skips wrapper, label, and error rendering. Default: false
 *
 * @returns Select JSX element wrapped in `FieldTemplate`.
 *
 * @example
 * ```tsx
 * // Basic
 * <Select
 *   name="category"
 *   options={[
 *     { label: "Technology", value: "tech" },
 *     { label: "Design", value: "design" },
 *   ]}
 * />
 *
 * // With label, validation, and searchable
 * <Select
 *   name="country"
 *   label="Country"
 *   showAsterisk
 *   isSearchable
 *   options={countryOptions}
 *   errorMessage={errors.country}
 *   notFoundText="No countries found"
 * />
 *
 * // Controlled with async search
 * <Select
 *   name="tag"
 *   label="Tag"
 *   value={selectedTag}
 *   onChange={setSelectedTag}
 *   onSearch={fetchTagOptions}
 *   isLoading={isLoadingTags}
 *   options={tagOptions}
 * />
 * ```
 */

function Select(props: SelectProps) {
	const {
		name,
		options,
		className: wrapperClassName = "",
		placeholder = "Selecione...",
		closeOnSelect = true,
		defaultValue = "",
		errorMessage: baseErrorMessage,
		isLoading = false,
		readOnly = false,
		isSearchable = false,
		id,
		label,
		showAsterisk,
		leftIcon: LeftIcon,
		onSearch,
		onChange,
		onBlur,
		notFoundText = "Sem opções disponíveis",
		onFocus,
		disabled: baseDisabled = false,
		prefix,
		size = "md",
		value,
		variant = "solid",
		orientation = "vertical",
		unShowFieldTemplate = false,
	} = props;

	const { fieldErrors } = useForm();

	const selectRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const generatedId = useId();
	const selectId = id || generatedId;
	const listboxId = `${selectId}-listbox`;

	const errorMessage = baseErrorMessage || fieldErrors?.[name];
	const isError = !!errorMessage;
	const disabled = baseDisabled || isLoading || readOnly;

	const iconSizes = { md: 20, lg: 20 };
	const iconSize = iconSizes[size];

	const [search, setSearch] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const [selectedOption, setSelectedOption] = useState(defaultValue);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);

	const forceSelectedOptions = value !== undefined ? value : selectedOption;

	function optionHasSelected(value: string) {
		return forceSelectedOptions === value;
	}

	function getOptionLabel(value: string) {
		const option = options.find((option) => option.value === value);
		return option?.label || "";
	}

	function getOptionId(value: string) {
		return `${listboxId}-option-${value.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
	}

	function handleContainerFocus() {
		if (disabled || !selectRef?.current || isFocused) return;
		setIsFocused(true);
		setHighlightedIndex(-1);
		selectRef.current.focus();
		onFocus?.();
	}

	function handleBlur() {
		setIsFocused(false);
		setHighlightedIndex(-1);
		if (onBlur && selectRef.current) selectRef.current.blur();
	}

	function handleSearch(value: string) {
		setSearch(value);
		// The visible option list is about to change, so drop the current
		// highlight instead of letting it point at a filtered-out option.
		setHighlightedIndex(-1);
		if (onSearch) onSearch(value);
	}

	function handleChangeValue(value: string) {
		if (optionHasSelected(value)) {
			setSelectedOption("");
			if (onChange) onChange("");
		} else {
			setSelectedOption(value);
			if (onChange) onChange(value);
		}

		if (closeOnSelect) handleBlur();
	}

	const mappedOptions = options.filter((option) => {
		if (props.onSearch) return true;
		if (!props.isSearchable) return true;
		if (option.label.toLowerCase().includes(search.toLowerCase())) return true;
		return false;
	});

	function handleContainerKeyDown(e: KeyboardEvent<HTMLDivElement>) {
		if (disabled) return;

		if (!isFocused) {
			if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
				e.preventDefault();
				handleContainerFocus();
				if (e.key === "ArrowDown") setHighlightedIndex(0);
			}
			return;
		}

		const isTypingTarget = (e.target as HTMLElement)?.tagName === "INPUT";
		// When focus has moved onto an option/button directly (e.g. via Tab),
		// let that element handle its own native Enter/Space activation instead
		// of double-handling it here through the highlighted-index shortcut.
		const isButtonTarget = (e.target as HTMLElement)?.tagName === "BUTTON";

		switch (e.key) {
			case "Escape":
				e.preventDefault();
				handleBlur();
				containerRef.current?.focus();
				break;
			case "ArrowDown":
				e.preventDefault();
				setHighlightedIndex((prev) => {
					if (mappedOptions.length === 0) return -1;
					if (prev < 0) return 0;
					return prev + 1 >= mappedOptions.length ? 0 : prev + 1;
				});
				break;
			case "ArrowUp":
				e.preventDefault();
				setHighlightedIndex((prev) => {
					if (mappedOptions.length === 0) return -1;
					if (prev < 0) return mappedOptions.length - 1;
					return prev - 1 < 0 ? mappedOptions.length - 1 : prev - 1;
				});
				break;
			case " ":
				if (isTypingTarget || isButtonTarget) return;
				e.preventDefault();
				if (highlightedIndex >= 0 && highlightedIndex < mappedOptions.length) {
					handleChangeValue(mappedOptions[highlightedIndex].value);
				}
				break;
			case "Enter":
				if (isButtonTarget) return;
				e.preventDefault();
				if (highlightedIndex >= 0 && highlightedIndex < mappedOptions.length) {
					handleChangeValue(mappedOptions[highlightedIndex].value);
				}
				break;
			default:
				break;
		}
	}

	const activeDescendantId =
		highlightedIndex >= 0 && highlightedIndex < mappedOptions.length
			? getOptionId(mappedOptions[highlightedIndex].value)
			: undefined;

	return (
		<FieldTemplate
			name={name}
			label={label}
			showAsterisk={showAsterisk}
			className={wrapperClassName}
			errorMessage={errorMessage}
			unShowFieldTemplate={unShowFieldTemplate}
			orientation={orientation}
		>
			<SelectContainer
				handleContainerFocus={handleContainerFocus}
				disabled={disabled}
				isError={isError}
				isFocused={isFocused}
				isLoading={isLoading}
				readOnly={readOnly}
				size={size}
				variant={variant}
				prefixExists={!!prefix}
				id={selectId}
				containerRef={containerRef}
				onContainerKeyDown={handleContainerKeyDown}
				tabIndex={disabled ? -1 : 0}
				ariaControls={listboxId}
				ariaActiveDescendant={activeDescendantId}
			>
				<input
					ref={selectRef}
					name={name}
					value={forceSelectedOptions}
					type="hidden"
				/>

				<IconRenderer iconSize={iconSize} icon={prefix} className="prefix" />

				{LeftIcon && <LeftIcon size={iconSize} strokeWidth={2.5} />}

				<SelectContent size={size}>
					{forceSelectedOptions !== "" && (
						<p className="hasValue">{getOptionLabel(forceSelectedOptions)}</p>
					)}
					{forceSelectedOptions === "" && <p>{placeholder}</p>}
				</SelectContent>

				<SelectOptionsContainer
					id={listboxId}
					isFocused={isFocused}
					isSearchable={isSearchable}
					search={search}
					onSearch={handleSearch}
				>
					{mappedOptions.map(({ label, value }, index) => (
						<SelectOption
							key={value}
							id={getOptionId(value)}
							label={label}
							value={value}
							size={size}
							isHighlighted={index === highlightedIndex}
							handleChangeValue={handleChangeValue}
							optionHasSelected={optionHasSelected}
						/>
					))}

					{mappedOptions.length <= 0 && <p>{notFoundText}</p>}
				</SelectOptionsContainer>

				<SelectChevron
					disabled={disabled}
					isFocused={isFocused}
					readOnly={readOnly}
					iconSize={iconSize}
					isLoading={isLoading}
				/>

				<SelectSpinner iconSize={iconSize} isLoading={isLoading} />
				<SelectOverlay handleBlur={handleBlur} isFocused={isFocused} />
			</SelectContainer>
		</FieldTemplate>
	);
}

export { Select };
