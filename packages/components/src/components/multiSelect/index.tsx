import type { LucideIcon } from "lucide-react";
import { type FocusEvent, useId, useRef, useState } from "react";

import { useForm } from "../../hooks/useForm";
import { FieldTemplate } from "../../services/fieldTemplate";
import { IconRenderer } from "../../services/iconRenderer";

import { MultiSelectChevron } from "./multiSelectChevron";
import { MultiSelectContainer } from "./multiSelectContainer";
import { MultiSelectContent } from "./multiSelectContent";
import { MultiSelectMark } from "./multiSelectMark";
import { MultiSelectOption } from "./multiSelectOption";
import { MultiSelectOptionsContainer } from "./multiSelectOptionsContainer";
import { MultiSelectOverlay } from "./multiSelectOverlay";
import { MultiSelectSpinner } from "./multiSelectSpinner";

type MultiSelectProps = {
	/** Field name for form submission. Required. */
	name: string;
	/** Array of selectable options. Required. */
	options: { label: string; value: string }[];
	/** Optional HTML id for the underlying hidden input. */
	id?: string;
	/** Controlled array of selected values. */
	value?: string[];
	/** Uncontrolled default array of selected values. @default [] */
	defaultValue?: string[];
	/** Displays an asterisk on the label to signal a required field. */
	showAsterisk?: boolean;
	/** Optional label text displayed above the multiselect. */
	label?: string;
	/** Validation error message displayed below the multiselect. */
	errorMessage?: string;
	/** Placeholder text shown when no options are selected. @default "Selecione..." */
	placeholder?: string;
	/** Text shown when no options match the search query. @default "Sem opções disponíveis" */
	notFoundText?: string;
	/** Additional CSS class applied to the wrapper element. */
	className?: string;
	/** Disables all interactions. @default false */
	disabled?: boolean;
	/** Prevents value changes while keeping the current selection visible. @default false */
	readOnly?: boolean;
	/** Shows a loading spinner and disables interactions. @default false */
	isLoading?: boolean;
	/** Enables search/filter within the dropdown. @default false */
	isSearchable?: boolean;
	/** Closes the dropdown after an option is selected or deselected. @default false */
	closeOnSelect?: boolean;
	/** Callback fired when the search query changes. Use for async option loading. */
	onSearch?: (value: string) => void;
	/** Callback fired when the selected values array changes. */
	onChange?: (value: string[]) => void;
	/** Callback fired when the multiselect gains focus. */
	onFocus?: () => void;
	/** Callback fired when the multiselect loses focus. */
	onBlur?: (e: FocusEvent<HTMLDivElement>) => void;
	/**
	 * MultiSelect size.
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
 * MultiSelect — multi-option dropdown with optional search, label, validation, and form integration.
 *
 * Selected values are stored as a JSON array in a hidden `<input>` for form submission.
 * Integrates with `useForm` to display validation errors by field name.
 *
 * @param props.name - Field name for form submission. Required.
 * @param props.options - Array of selectable options (`{ label, value }`). Required.
 * @param props.value - Controlled array of selected values.
 * @param props.defaultValue - Uncontrolled default selection. Default: []
 * @param props.label - Label text displayed above the multiselect.
 * @param props.placeholder - Placeholder shown when nothing is selected. Default: "Selecione..."
 * @param props.errorMessage - Validation error message.
 * @param props.isSearchable - Enables search/filter within the dropdown. Default: false
 * @param props.isLoading - Shows a loading spinner and disables interactions. Default: false
 * @param props.closeOnSelect - Closes the dropdown after toggling an option. Default: false
 * @param props.onChange - Callback fired when the selection changes.
 * @param props.onSearch - Callback fired when the search query changes.
 * @param props.size - MultiSelect size (`md` | `lg`). Default: "md"
 * @param props.variant - Visual style variant. Default: "solid"
 * @param props.orientation - Layout direction. Default: "horizontal"
 * @param props.unShowFieldTemplate - Skips wrapper, label, and error rendering. Default: false
 *
 * @returns MultiSelect JSX element wrapped in `FieldTemplate`.
 *
 * @example
 * ```tsx
 * // Basic
 * <MultiSelect
 *   name="categories"
 *   options={[
 *     { label: "Technology", value: "tech" },
 *     { label: "Design", value: "design" },
 *   ]}
 * />
 *
 * // With label, validation, and searchable
 * <MultiSelect
 *   name="skills"
 *   label="Skills"
 *   showAsterisk
 *   isSearchable
 *   options={skillOptions}
 *   errorMessage={errors.skills}
 * />
 *
 * // Controlled with async search
 * <MultiSelect
 *   name="tags"
 *   label="Tags"
 *   value={selectedTags}
 *   onChange={setSelectedTags}
 *   onSearch={fetchTagOptions}
 *   isLoading={isLoadingTags}
 *   options={tagOptions}
 * />
 * ```
 */

function MultiSelect(props: MultiSelectProps) {
	const {
		name,
		options,
		className: wrapperClassName = "",
		placeholder = "Selecione...",
		closeOnSelect = false,
		defaultValue = [],
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
		unShowFieldTemplate = false,
		orientation = "vertical",
	} = props;

	const { fieldErrors } = useForm();

	const multiSelectRef = useRef<HTMLInputElement>(null);
	const generatedId = useId();
	const multiSelectId = id || generatedId;

	const errorMessage = baseErrorMessage || fieldErrors?.[name];
	const isError = !!errorMessage;
	const disabled = baseDisabled || isLoading || readOnly;

	const iconSizes = { md: 20, lg: 20 };
	const iconSize = iconSizes[size];

	const [search, setSearch] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState(defaultValue);

	const forceSelectedOptions = value || selectedOptions;

	function optionHasSelected(value: string) {
		return forceSelectedOptions.includes(value);
	}

	function getOptionLabel(value: string) {
		const option = options.find((option) => option.value === value);
		return option?.label || "";
	}

	function handleContainerFocus() {
		if (disabled || !multiSelectRef?.current || isFocused) return;
		setIsFocused(true);
		multiSelectRef.current.focus();
		onFocus?.();
	}

	function handleBlur() {
		setIsFocused(false);
		if (onBlur && multiSelectRef.current) multiSelectRef.current.blur();
	}

	function handleSearch(value: string) {
		setSearch(value);
		if (onSearch) onSearch(value);
	}

	function handleChangeValue(value: string) {
		if (optionHasSelected(value)) {
			setSelectedOptions(selectedOptions.filter((v) => v !== value));
			if (onChange) onChange(selectedOptions.filter((v) => v !== value));
		} else {
			setSelectedOptions([...selectedOptions, value]);
			if (onChange) onChange([...selectedOptions, value]);
		}

		if (closeOnSelect) handleBlur();
	}

	const mappedOptions = options.filter((option) => {
		if (props.onSearch) return true;
		if (!props.isSearchable) return true;
		if (option.label.toLowerCase().includes(search.toLowerCase())) return true;
		return false;
	});

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
			<MultiSelectContainer
				handleContainerFocus={handleContainerFocus}
				disabled={disabled}
				isError={isError}
				isFocused={isFocused}
				isLoading={isLoading}
				readOnly={readOnly}
				size={size}
				variant={variant}
				prefixExists={!!prefix}
				id={multiSelectId}
			>
				<input
					ref={multiSelectRef}
					name={name}
					value={JSON.stringify(forceSelectedOptions)}
					type="hidden"
				/>

				<IconRenderer iconSize={iconSize} icon={prefix} className="prefix" />

				{LeftIcon && <LeftIcon size={iconSize} strokeWidth={2.5} />}

				<MultiSelectContent size={size}>
					{forceSelectedOptions.map((value) => (
						<MultiSelectMark
							key={value}
							label={getOptionLabel(value)}
							value={value}
							handleChangeValue={handleChangeValue}
							disabled={disabled}
						/>
					))}

					{forceSelectedOptions.length <= 0 && <p>{placeholder}</p>}
				</MultiSelectContent>

				<MultiSelectOptionsContainer
					isFocused={isFocused}
					isSearchable={isSearchable}
					search={search}
					onSearch={handleSearch}
				>
					{mappedOptions.map(({ label, value }) => (
						<MultiSelectOption
							key={value}
							label={label}
							value={value}
							size={size}
							handleChangeValue={handleChangeValue}
							optionHasSelected={optionHasSelected}
						/>
					))}

					{mappedOptions.length <= 0 && <p>{notFoundText}</p>}
				</MultiSelectOptionsContainer>

				<MultiSelectChevron
					disabled={disabled}
					isFocused={isFocused}
					readOnly={readOnly}
					iconSize={iconSize}
					isLoading={isLoading}
				/>

				<MultiSelectSpinner iconSize={iconSize} isLoading={isLoading} />
				<MultiSelectOverlay handleBlur={handleBlur} isFocused={isFocused} />
			</MultiSelectContainer>
		</FieldTemplate>
	);
}

export { MultiSelect };
