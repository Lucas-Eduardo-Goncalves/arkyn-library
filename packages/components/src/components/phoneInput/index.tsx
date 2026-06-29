import {
	findCountryMask,
	formatToPhone,
	removeNonNumeric,
} from "@arkyn/shared";
import { countries } from "@arkyn/templates";
import { useId, useRef, useState } from "react";

import { useForm } from "../../hooks/useForm";
import { FieldTemplate } from "../../services/fieldTemplate";

import { PhoneInputContainer } from "./phoneInputContainer";
import { PhoneInputCountriesOverlay } from "./phoneInputCountriesOverlay";
import { PhoneInputCountryOption } from "./phoneInputCountryOption";
import { PhoneInputCountryOptionsContainer } from "./phoneInputCountryOptionsContainer";
import { PhoneInputCountrySelector } from "./phoneInputCountrySelector";
import { PhoneInputMask } from "./phoneInputMask";

type CountryType = {
	name: string;
	code: string;
	iso: string;
	flag: string;
	mask: string | string[];
};

type PhoneInputProps = {
	/** Optional HTML id for the visible phone text input. */
	id?: string;
	/** Disables all interactions. @default false */
	disabled?: boolean;
	/** Prevents value changes while keeping the current value visible. @default false */
	readOnly?: boolean;
	/** Validation error message (overrides the `useForm` context error for this field). */
	errorMessage?: string;
	/** Optional label text displayed above the input. */
	label?: string;
	/** Displays an asterisk on the label to signal a required field. */
	showAsterisk?: boolean;
	/** Shows a loading state and disables interactions. @default false */
	isLoading?: boolean;
	/**
	 * Input size.
	 * @default "md"
	 */
	size?: "md" | "lg";
	/**
	 * Visual style variant.
	 * - `solid`: filled background.
	 * - `outline`: bordered, transparent background.
	 * @default "solid"
	 */
	variant?: "solid" | "outline";
	/** Additional CSS class applied to the field wrapper. */
	className?: string;
	/** Uncontrolled default phone value (numeric string with or without country code). @default "" */
	defaultValue?: string;
	/** Text displayed when no country matches the search query. @default "Nenhum país encontrado" */
	notFoundCountryText?: string;
	/** Field name for form submission (stored as numeric string with country code). Required. */
	name: string;
	/** Placeholder for the country search input. @default "Pesquisar país" */
	searchCountryPlaceholder?: string;
	/** ISO 3166-1 alpha-2 code of the initially selected country. @default "BR" */
	defaultCountryIso?: (typeof countries)[number]["iso"];
	/** Callback fired on value change. Receives a numeric string prefixed with the country dial code. */
	onChange?: (e: string) => void;
	/** Controlled phone value (without country code). */
	value?: string;
	/** When true, skips `FieldTemplate` wrapper (label and error text). @default false */
	unShowFieldTemplate?: boolean;
	/**
	 * Layout direction forwarded to `FieldTemplate`.
	 * @default "vertical"
	 */
	orientation?: "horizontal" | "vertical" | "horizontalReverse";
};

/**
 * PhoneInput — phone number field with an integrated country selector and automatic mask formatting.
 *
 * The visible input is masked according to the selected country's phone format.
 * The hidden `<input>` stores a numeric string prefixed with the country dial code for form submission.
 * Integrates with `useForm` to display validation errors by field name.
 *
 * @param props.name - Field name for form submission. Required.
 * @param props.label - Label text displayed above the input.
 * @param props.showAsterisk - Appends `*` to the label.
 * @param props.errorMessage - Validation error message.
 * @param props.size - Input size (`md` | `lg`). Default: "md"
 * @param props.variant - Visual style variant. Default: "solid"
 * @param props.disabled - Disables all interactions. Default: false
 * @param props.readOnly - Prevents editing. Default: false
 * @param props.isLoading - Shows loading state and disables interactions. Default: false
 * @param props.defaultValue - Uncontrolled default phone value.
 * @param props.value - Controlled phone value (without country code).
 * @param props.onChange - Callback fired on change — receives numeric string with country code.
 * @param props.defaultCountryIso - ISO code of the initially selected country. Default: "BR"
 * @param props.searchCountryPlaceholder - Placeholder for country search. Default: "Pesquisar país"
 * @param props.notFoundCountryText - Text shown when no country matches. Default: "Nenhum país encontrado"
 * @param props.orientation - Layout direction. Default: "vertical"
 * @param props.unShowFieldTemplate - Skips wrapper, label, and error rendering. Default: false
 *
 * @returns PhoneInput JSX element wrapped in `FieldTemplate`.
 *
 * @example
 * ```tsx
 * // Basic
 * <PhoneInput name="phone" label="Phone" />
 *
 * // Controlled with outline variant
 * <PhoneInput
 *   name="contactPhone"
 *   label="Contact Phone"
 *   value={phone}
 *   onChange={(v) => setPhone(v)}
 *   variant="outline"
 *   size="lg"
 * />
 *
 * // Pre-selected country (US)
 * <PhoneInput
 *   name="phone"
 *   label="Phone"
 *   defaultCountryIso="US"
 *   showAsterisk
 * />
 * ```
 */
function PhoneInput(props: PhoneInputProps) {
	const {
		defaultCountryIso,
		value: rawValue,
		label,
		className: wrapperClassName = "",
		disabled = false,
		errorMessage: baseErrorMessage,
		isLoading = false,
		readOnly = false,
		size = "md",
		defaultValue = "",
		variant = "solid",
		showAsterisk,
		name,
		onChange,
		searchCountryPlaceholder = "Pesquisar país",
		notFoundCountryText = "Nenhum país encontrado",
		id,
		unShowFieldTemplate = false,
		orientation = "vertical",
	} = props;

	const brasilCountry = countries.find((country) => country.iso === "BR")!;

	const defaultData = defaultValue ? formatToPhone(defaultValue) : "";
	const defaultCountry: CountryType = defaultValue
		? findCountryMask(defaultValue)[1]
		: brasilCountry;

	const [isFocused, setIsFocused] = useState(false);
	const [search, setSearch] = useState("");
	const [showCountryOptions, setShowCountryOptions] = useState(false);
	const [internalValue, setValue] = useState(defaultData);
	const value = rawValue !== undefined ? rawValue : internalValue;

	const [currentCountry, setCurrentCountry] = useState(defaultCountry);

	const { fieldErrors } = useForm();

	const phoneInputRef = useRef<HTMLInputElement>(null);
	const phoneInputId = id || useId();

	const errorMessage = baseErrorMessage || fieldErrors?.[name];
	const isError = !!errorMessage;
	const isDisabled = disabled || isLoading;

	const inputPhoneMaskRef = useRef<HTMLInputElement>(null);

	function handleContainerFocus() {
		if (isDisabled) return;
		if (isFocused || showCountryOptions) return;

		setIsFocused(true);
		if (inputPhoneMaskRef.current) inputPhoneMaskRef.current.focus();
	}

	function handleOpenCountryOptions() {
		setShowCountryOptions(true);
		setIsFocused(true);
	}

	function handleCloseCountryOptions() {
		setShowCountryOptions(false);
		setIsFocused(false);
	}

	function handleInputFocus() {
		setIsFocused(true);
	}

	function handleInputBlur() {
		setIsFocused(false);
	}

	function filterCountryFunction(country: CountryType) {
		return country.name.toLowerCase().includes(search.toLowerCase());
	}

	function inputValue(props?: string) {
		let returnValue = currentCountry.code;
		returnValue += removeNonNumeric(props || value);
		return returnValue;
	}

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
			<PhoneInputContainer
				disabled={isDisabled}
				isError={isError}
				isLoading={isLoading}
				isFocused={isFocused}
				readOnly={readOnly}
				size={size}
				variant={variant}
				onFocus={handleContainerFocus}
			>
				<PhoneInputCountrySelector
					currentCountry={currentCountry}
					onClick={handleOpenCountryOptions}
					size={size}
				/>

				<PhoneInputCountryOptionsContainer
					isOpen={isDisabled ? false : readOnly ? false : showCountryOptions}
					search={search}
					placeholder={searchCountryPlaceholder}
					onSearch={setSearch}
				>
					{countries
						.filter((country) => filterCountryFunction(country))
						.map((country) => (
							<PhoneInputCountryOption
								key={country.iso}
								country={country}
								handleChangeValue={() => {
									setCurrentCountry(country);
									setShowCountryOptions(false);
									setValue("");
								}}
								isActive={country.iso === currentCountry.iso}
								size={size}
							/>
						))}

					{countries.filter((country) => filterCountryFunction(country))
						.length === 0 && <p>{notFoundCountryText}</p>}
				</PhoneInputCountryOptionsContainer>

				<PhoneInputCountriesOverlay
					isOpen={isDisabled ? false : readOnly ? false : showCountryOptions}
					onClick={handleCloseCountryOptions}
				/>

				<PhoneInputMask
					id={phoneInputId}
					ref={inputPhoneMaskRef}
					readonly={readOnly}
					currentCountry={currentCountry}
					value={value}
					disabled={isDisabled}
					onBlur={handleInputBlur}
					onFocus={handleInputFocus}
					size={size}
					onChange={(e) => {
						setValue(e);
						onChange?.(inputValue(e));
					}}
				/>

				<input
					ref={phoneInputRef}
					type="hidden"
					name={name}
					value={inputValue()}
				/>
			</PhoneInputContainer>
		</FieldTemplate>
	);
}

export { PhoneInput };
