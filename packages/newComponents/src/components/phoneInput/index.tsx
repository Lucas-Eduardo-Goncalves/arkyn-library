import { countries } from "@arkyn/templates";
import { CountryType } from "@arkyn/types";
import { useId, useRef, useState } from "react";

import { useForm } from "../../hooks/useForm";
import { getDefaultFormatPhoneNumber } from "../../utils/phoneInputUtilities";

import { FieldError } from "../fieldError";
import { FieldLabel } from "../fieldLabel";
import { FieldWrapper } from "../fieldWrapper";

import { PhoneInputContainer } from "./phoneInputContainer";
import { PhoneInputCountriesOverlay } from "./phoneInputCountriesOverlay";
import { PhoneInputCountryOption } from "./phoneInputCountryOption";
import { PhoneInputCountryOptionsContainer } from "./phoneInputCountryOptionsContainer";
import { PhoneInputCountrySelector } from "./phoneInputCountrySelector";
import { PhoneInputMask } from "./phoneInputMask";

type PhoneInputProps = {
  id?: string;
  disabled?: boolean;
  readOnly?: boolean;
  errorMessage?: string;
  label?: string;
  showAsterisk?: boolean;
  isLoading?: boolean;
  size?: "md" | "lg";
  variant?: "solid" | "outline";
  className?: string;
  defaultValue?: string;
  notFoundCountryText?: string;
  name: string;
  searchCountryPlaceholder?: string;
  defaultCountry?: (typeof countries)[number]["iso"];
  onChange?: (e: string) => void;
};

/**
 * PhoneInput component - used for international phone number input with country selection and automatic formatting
 *
 * @param props - PhoneInput component properties
 * @param props.name - Required field name for form handling and phone input identification
 * @param props.label - Optional label text to display above the phone input
 * @param props.showAsterisk - Whether to show asterisk on label for required fields
 * @param props.errorMessage - Error message to display below the phone input
 * @param props.size - Size variant of the phone input. Default: "md"
 * @param props.variant - Visual variant of the phone input. Default: "solid"
 * @param props.defaultValue - Default phone number value for the input
 * @param props.defaultCountry - Default country ISO code to be selected. Uses country index 30 if not provided
 * @param props.disabled - Whether the phone input is disabled. Default: false
 * @param props.readOnly - Whether the phone input is read-only. Default: false
 * @param props.isLoading - Whether the phone input is in loading state. Default: false
 * @param props.className - Additional CSS classes for styling
 * @param props.id - Optional unique identifier for the input
 * @param props.searchCountryPlaceholder - Placeholder text for country search field. Default: "Pesquisar país"
 * @param props.notFoundCountryText - Text displayed when no countries match the search. Default: "Nenhum país encontrado"
 * @param props.onChange - Callback function called when phone number changes, receives the formatted value with country code
 *
 * @returns PhoneInput JSX element wrapped in FieldWrapper with country selector, masked input, and validation
 *
 * @example
 * ```tsx
 * // Basic phone input
 * <PhoneInput name="phone" />
 *
 * // Phone input with label and default country
 * <PhoneInput
 *   name="contactPhone"
 *   label="Contact Phone"
 *   defaultCountry="US"
 *   showAsterisk
 * />
 *
 * // Phone input with validation and custom text
 * <PhoneInput
 *   name="businessPhone"
 *   label="Business Phone"
 *   errorMessage="Please enter a valid phone number"
 *   searchCountryPlaceholder="Search country..."
 *   notFoundCountryText="Country not found"
 * />
 *
 * // Large phone input with default value
 * <PhoneInput
 *   name="emergencyContact"
 *   label="Emergency Contact"
 *   size="lg"
 *   variant="outline"
 *   defaultValue="+1 (555) 123-4567"
 *   defaultCountry="US"
 * />
 *
 * // Controlled phone input with callback
 * <PhoneInput
 *   name="userPhone"
 *   label="Your Phone Number"
 *   onChange={(formattedPhone) => {
 *     console.log('Phone number:', formattedPhone);
 *     setPhoneNumber(formattedPhone);
 *   }}
 *   defaultCountry="BR"
 *   showAsterisk
 * />
 *
 * // Read-only phone input for display
 * <PhoneInput
 *   name="displayPhone"
 *   label="Registered Phone"
 *   defaultValue="+55 11 99999-9999"
 *   readOnly
 *   variant="outline"
 * />
 *
 * // Disabled phone input
 * <PhoneInput
 *   name="lockedPhone"
 *   label="Phone (Locked)"
 *   defaultValue="+1 (555) 987-6543"
 *   disabled
 *   className="locked-field"
 * />
 *
 * // Phone input with loading state
 * <PhoneInput
 *   name="loadingPhone"
 *   label="Phone Number"
 *   isLoading
 *   defaultCountry="CA"
 * />
 * ```
 *
 * @remarks
 * This component provides:
 * - Automatic phone number formatting based on selected country
 * - Searchable country dropdown with flags and country codes
 * - Support for international phone number formats
 * - Integration with form validation systems
 * - Accessibility features with proper labeling
 *
 * The component uses country data from @arkyn/templates and automatically formats
 * phone numbers according to each country's specific format and mask patterns.
 */

function PhoneInput(props: PhoneInputProps) {
  const {
    defaultCountry,
    label,
    className = "",
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
  } = props;

  const defaultData = getDefaultFormatPhoneNumber(defaultValue);

  const [isFocused, setIsFocused] = useState(false);
  const [search, setSearch] = useState("");
  const [showCountryOptions, setShowCountryOptions] = useState(false);
  const [value, setValue] = useState(defaultData.formattedNumber || "");

  const [currentCountry, setCurrentCountry] = useState<CountryType>(() => {
    if (defaultData.country) return defaultData.country;

    const country = countries.find((country) => country.iso === defaultCountry);
    if (country) return country;

    return countries[30];
  });

  const { fieldErrors } = useForm();

  const phoneInputRef = useRef<HTMLInputElement>(null);
  const phoneInputId = id || useId();

  const errorMessage = baseErrorMessage || fieldErrors?.[name];
  const isError = !!errorMessage;
  const inputPhoneMaskRef = useRef<HTMLInputElement>(null);

  function handleContainerFocus() {
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

  function removeNumberMasks(number: string) {
    if (currentCountry.prefix) {
      return number
        .replace(currentCountry.prefix, "")
        .replaceAll(" ", "")
        .replaceAll("-", "")
        .replaceAll("(", "")
        .replaceAll(")", "")
        .trim();
    }

    return number
      .replaceAll(" ", "")
      .replaceAll("-", "")
      .replaceAll("(", "")
      .replaceAll(")", "")
      .trim();
  }

  function inputValue(props?: string) {
    let returnValue = currentCountry.code;
    if (currentCountry.prefix) returnValue += `-${currentCountry.prefix}`;
    returnValue += " ";
    returnValue += removeNumberMasks(props || value);
    return returnValue;
  }

  return (
    <FieldWrapper>
      {label && <FieldLabel showAsterisk={showAsterisk}>{label}</FieldLabel>}

      <PhoneInputContainer
        id={phoneInputId}
        disabled={disabled}
        isError={isError}
        isLoading={isLoading}
        isFocused={isFocused}
        readOnly={readOnly}
        size={size}
        variant={variant}
        className={className}
        onFocus={handleContainerFocus}
      >
        <PhoneInputCountrySelector
          currentCountry={currentCountry}
          onClick={handleOpenCountryOptions}
          size={size}
        />

        <PhoneInputCountryOptionsContainer
          isOpen={showCountryOptions}
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
                  setValue(country.mask);
                }}
                isActive={country.iso === currentCountry.iso}
                size={size}
              />
            ))}

          {countries.filter((country) => filterCountryFunction(country))
            .length === 0 && <p>{notFoundCountryText}</p>}
        </PhoneInputCountryOptionsContainer>

        <PhoneInputCountriesOverlay
          isOpen={showCountryOptions}
          onClick={handleCloseCountryOptions}
        />

        <PhoneInputMask
          ref={inputPhoneMaskRef}
          currentCountry={currentCountry}
          value={value}
          onChange={(e) => {
            setValue(e);
            onChange && onChange(inputValue(e));
          }}
          disabled={disabled}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          size={size}
        />

        <input
          ref={phoneInputRef}
          type="hidden"
          name={name}
          value={inputValue()}
        />
      </PhoneInputContainer>

      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </FieldWrapper>
  );
}

export { PhoneInput };
