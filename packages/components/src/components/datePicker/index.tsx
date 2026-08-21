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

import { Calendar } from "../calendar";

import { DatePickerCalendarContainer } from "./datePickerCalendarContainer";
import { DatePickerChevron } from "./datePickerChevron";
import { DatePickerContainer } from "./datePickerContainer";
import { DatePickerContent } from "./datePickerContent";
import { DatePickerOverlay } from "./datePickerOverlay";
import { DatePickerSpinner } from "./datePickerSpinner";

function toInputDateValue(date: Date) {
	const pad = (value: number) => String(value).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toDisplayDateValue(date: Date) {
	return date.toLocaleDateString("pt-BR");
}

type BaseDatePickerProps = {
	/** Field name for form submission. Required. */
	name: string;
	/** Optional HTML id for the underlying hidden input. */
	id?: string;
	/** Displays an asterisk on the label to signal a required field. */
	showAsterisk?: boolean;
	/** Optional label text displayed above the date picker. */
	label?: string;
	/** Validation error message displayed below the date picker. */
	errorMessage?: string;
	/** Placeholder text shown when no date is selected. @default "Selecione uma data..." */
	placeholder?: string;
	/** Additional CSS class applied to the wrapper element. */
	className?: string;
	/** Disables all interactions. @default false */
	disabled?: boolean;
	/** Prevents value changes while keeping the current value visible. @default false */
	readOnly?: boolean;
	/** Shows a loading spinner and disables interactions. @default false */
	isLoading?: boolean;
	/**
	 * Closes the calendar after a date is picked.
	 * @default true for `single`, `false` for `range`.
	 */
	closeOnSelect?: boolean;
	/** Callback fired when the date picker gains focus. */
	onFocus?: () => void;
	/** Callback fired when the date picker loses focus. */
	onBlur?: (e: FocusEvent<HTMLDivElement>) => void;
	/**
	 * DatePicker size.
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
	/** Text or icon rendered at the far left, outside the date picker area. */
	prefix?: string | LucideIcon;
	/** Lucide icon rendered inside the date picker on the left. */
	leftIcon?: LucideIcon;
	/** When true, skips `FieldTemplate` wrapper (label and error text). @default false */
	unShowFieldTemplate?: boolean;
	/**
	 * Layout direction forwarded to `FieldTemplate`.
	 * @default "vertical"
	 */
	orientation?: "horizontal" | "vertical" | "horizontalReverse";
	/**
	 * Visual/behavioral variant forwarded to the internal `Calendar`.
	 * @default "complete"
	 */
	calendarVariant?: "basic" | "complete";
};

/**
 * Props for DatePicker single-date selection mode.
 */
type SingleDatePickerProps = BaseDatePickerProps & {
	/** Sets single-date selection mode. */
	type: "single";
	/** Controlled selected date. */
	value?: Date;
	/** Uncontrolled default selected date. */
	defaultValue?: Date;
	/** Callback fired when the selected date changes. */
	onChange?: (date: Date) => void;
	/** Currently focused calendar view date. */
	viewValue?: Date;
	/** Initial focused calendar view date. */
	defaultViewValue?: Date;
	/** Callback fired when the calendar view (month/year) changes. */
	onChangeView?: (date: Date) => void;
};

/**
 * Props for DatePicker range selection mode.
 */
type RangeDatePickerProps = BaseDatePickerProps & {
	/** Sets range selection mode. */
	type: "range";
	/** Controlled selected range in `[start, end]` format. */
	value?: [Date, Date];
	/** Uncontrolled default range in `[start, end]` format. */
	defaultValue?: [Date, Date];
	/** Callback fired when the selected range changes. */
	onChange?: (date: [Date, Date]) => void;
	/** Currently focused calendar view date. */
	viewValue?: Date;
	/** Initial focused calendar view date. */
	defaultViewValue?: Date;
	/** Callback fired when the calendar view (month/year) changes. */
	onChangeView?: (date: Date) => void;
	/** Text placed between the start and end dates. @default " até " */
	rangeSeparator?: string;
};

/**
 * Discriminated union of DatePicker props.
 */
type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps;

/**
 * DatePicker, date input field with a popover `Calendar`, supporting single-date
 * (`single`) and range (`range`) selection modes.
 *
 * Opens the calendar on click, the same way `Select` opens its options list, flipping
 * upward or downward depending on the available viewport space so it never renders
 * off-screen. Integrates with `useForm` to display validation errors by field name.
 *
 * @param props.name - Field name for form submission. Required.
 * @param props.type - Selection mode (`single` | `range`). Required.
 * @param props.value - Controlled selected date (`single`) or range (`range`).
 * @param props.defaultValue - Uncontrolled default date or range.
 * @param props.label - Label text displayed above the date picker.
 * @param props.placeholder - Placeholder shown when nothing is selected. Default: "Selecione uma data..."
 * @param props.errorMessage - Validation error message.
 * @param props.isLoading - Shows a loading spinner and disables interactions. Default: false
 * @param props.closeOnSelect - Closes the calendar after picking. Default: `true` for `single`, `false` for `range`.
 * @param props.onChange - Callback fired when the selected date/range changes.
 * @param props.calendarVariant - Visual/behavioral variant of the internal `Calendar`. Default: "complete"
 * @param props.size - DatePicker size (`md` | `lg`). Default: "md"
 * @param props.variant - Visual style variant. Default: "solid"
 * @param props.orientation - Layout direction. Default: "vertical"
 * @param props.unShowFieldTemplate - Skips wrapper, label, and error rendering. Default: false
 *
 * @returns DatePicker JSX element wrapped in `FieldTemplate`.
 *
 * @example
 * ```tsx
 * // Single date
 * <DatePicker
 *   type="single"
 *   name="birthDate"
 *   label="Data de nascimento"
 *   onChange={(date) => console.log("Selected date:", date)}
 * />
 *
 * // Range
 * <DatePicker
 *   type="range"
 *   name="stay"
 *   label="Período da estadia"
 *   calendarVariant="basic"
 *   onChange={([start, end]) => console.log("Range:", start, end)}
 * />
 * ```
 */
function DatePicker(props: DatePickerProps) {
	const {
		name,
		className: wrapperClassName = "",
		placeholder = "Selecione uma data...",
		errorMessage: baseErrorMessage,
		isLoading = false,
		readOnly = false,
		id,
		label,
		showAsterisk,
		leftIcon: LeftIcon,
		onFocus,
		onBlur,
		disabled: baseDisabled = false,
		prefix,
		size = "md",
		value,
		variant = "solid",
		orientation = "vertical",
		unShowFieldTemplate = false,
		calendarVariant = "complete",
	} = props;

	const closeOnSelect = props.closeOnSelect ?? props.type === "single";

	const { fieldErrors } = useForm();

	const datePickerRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const generatedId = useId();
	const datePickerId = id || generatedId;
	const calendarId = `${datePickerId}-calendar`;

	const errorMessage = baseErrorMessage || fieldErrors?.[name];
	const isError = !!errorMessage;
	const disabled = baseDisabled || isLoading || readOnly;

	const iconSizes = { md: 20, lg: 20 };
	const iconSize = iconSizes[size];

	const [isFocused, setIsFocused] = useState(false);
	const [internalSingleValue, setInternalSingleValue] = useState<
		Date | undefined
	>(props.type === "single" ? props.defaultValue : undefined);
	const [internalRangeValue, setInternalRangeValue] = useState<
		[Date, Date] | undefined
	>(props.type === "range" ? props.defaultValue : undefined);

	function handleContainerFocus() {
		if (disabled || !datePickerRef?.current || isFocused) return;
		setIsFocused(true);
		datePickerRef.current.focus();
		onFocus?.();
	}

	function handleBlur() {
		setIsFocused(false);
		if (onBlur && datePickerRef.current) datePickerRef.current.blur();
	}

	function handleContainerKeyDown(e: KeyboardEvent<HTMLDivElement>) {
		if (disabled) return;

		if (!isFocused) {
			if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
				e.preventDefault();
				handleContainerFocus();
			}
			return;
		}

		if (e.key === "Escape") {
			e.preventDefault();
			handleBlur();
			containerRef.current?.focus();
		}
	}

	function handleChangeSingleDate(date: Date) {
		if (value === undefined) setInternalSingleValue(date);
		if (props.type === "single") props.onChange?.(date);
		if (closeOnSelect) handleBlur();
	}

	function handleChangeRangeDate(range: [Date, Date]) {
		if (value === undefined) setInternalRangeValue(range);
		if (props.type === "range") props.onChange?.(range);
		if (closeOnSelect) handleBlur();
	}

	if (props.type === "range") {
		const rangeSeparator = props.rangeSeparator ?? " até ";
		const forceValue =
			value !== undefined ? (value as [Date, Date]) : internalRangeValue;

		const hiddenInputValue = forceValue
			? JSON.stringify([
					toInputDateValue(forceValue[0]),
					toInputDateValue(forceValue[1]),
				])
			: "";

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
				<DatePickerContainer
					handleContainerFocus={handleContainerFocus}
					disabled={disabled}
					isError={isError}
					isFocused={isFocused}
					isLoading={isLoading}
					readOnly={readOnly}
					size={size}
					variant={variant}
					prefixExists={!!prefix}
					id={datePickerId}
					containerRef={containerRef}
					onContainerKeyDown={handleContainerKeyDown}
					tabIndex={disabled ? -1 : 0}
					ariaControls={calendarId}
				>
					<input
						ref={datePickerRef}
						name={name}
						value={hiddenInputValue}
						type="hidden"
					/>

					<IconRenderer iconSize={iconSize} icon={prefix} className="prefix" />

					{LeftIcon && <LeftIcon size={iconSize} strokeWidth={2.5} />}

					<DatePickerContent size={size}>
						{forceValue ? (
							<p className="hasValue">
								{toDisplayDateValue(forceValue[0])}
								{rangeSeparator}
								{toDisplayDateValue(forceValue[1])}
							</p>
						) : (
							<p>{placeholder}</p>
						)}
					</DatePickerContent>

					<DatePickerCalendarContainer id={calendarId} isFocused={isFocused}>
						<Calendar
							type="range"
							variant={calendarVariant}
							value={forceValue}
							onChange={handleChangeRangeDate}
							viewValue={props.viewValue}
							defaultViewValue={props.defaultViewValue}
							onChangeView={props.onChangeView}
						/>
					</DatePickerCalendarContainer>

					<DatePickerChevron
						disabled={disabled}
						isFocused={isFocused}
						readOnly={readOnly}
						iconSize={iconSize}
						isLoading={isLoading}
					/>

					<DatePickerSpinner iconSize={iconSize} isLoading={isLoading} />
					<DatePickerOverlay handleBlur={handleBlur} isFocused={isFocused} />
				</DatePickerContainer>
			</FieldTemplate>
		);
	}

	const forceValue =
		value !== undefined ? (value as Date) : internalSingleValue;

	const hiddenInputValue = forceValue ? toInputDateValue(forceValue) : "";

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
			<DatePickerContainer
				handleContainerFocus={handleContainerFocus}
				disabled={disabled}
				isError={isError}
				isFocused={isFocused}
				isLoading={isLoading}
				readOnly={readOnly}
				size={size}
				variant={variant}
				prefixExists={!!prefix}
				id={datePickerId}
				containerRef={containerRef}
				onContainerKeyDown={handleContainerKeyDown}
				tabIndex={disabled ? -1 : 0}
				ariaControls={calendarId}
			>
				<input
					ref={datePickerRef}
					name={name}
					value={hiddenInputValue}
					type="hidden"
				/>

				<IconRenderer iconSize={iconSize} icon={prefix} className="prefix" />

				{LeftIcon && <LeftIcon size={iconSize} strokeWidth={2.5} />}

				<DatePickerContent size={size}>
					{forceValue ? (
						<p className="hasValue">{toDisplayDateValue(forceValue)}</p>
					) : (
						<p>{placeholder}</p>
					)}
				</DatePickerContent>

				<DatePickerCalendarContainer id={calendarId} isFocused={isFocused}>
					<Calendar
						type="single"
						variant={calendarVariant}
						value={forceValue}
						onChange={handleChangeSingleDate}
						viewValue={props.viewValue}
						defaultViewValue={props.defaultViewValue}
						onChangeView={props.onChangeView}
					/>
				</DatePickerCalendarContainer>

				<DatePickerChevron
					disabled={disabled}
					isFocused={isFocused}
					readOnly={readOnly}
					iconSize={iconSize}
					isLoading={isLoading}
				/>

				<DatePickerSpinner iconSize={iconSize} isLoading={isLoading} />
				<DatePickerOverlay handleBlur={handleBlur} isFocused={isFocused} />
			</DatePickerContainer>
		</FieldTemplate>
	);
}

export { DatePicker };
