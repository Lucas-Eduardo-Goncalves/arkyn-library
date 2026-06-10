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
  defaultCountryIso?: (typeof countries)[number]["iso"];
  onChange?: (e: string) => void;
  value?: string;
  unShowFieldTemplate?: boolean;
  orientation?: "horizontal" | "vertical" | "horizontalReverse";
};

/**
 * Phone input with country selector, mask formatting, and hidden form value.
 *
 * The component formats the visible value according to the selected country mask,
 * while the hidden input stores a numeric string prefixed with the country code.
 * It also integrates with `useForm` to display validation errors by field name.
 *
 * @param {PhoneInputProps} props Component properties.
 * @param {string} props.name Hidden input name used in form submission.
 * @param {string} [props.label] Optional field label.
 * @param {boolean} [props.showAsterisk] Displays required marker in the label.
 * @param {string} [props.errorMessage] Custom error message (overrides form context error).
 * @param {"md" | "lg"} [props.size="md"] Visual size.
 * @param {"solid" | "outline"} [props.variant="solid"] Visual variant.
 * @param {boolean} [props.disabled=false] Disables interactions.
 * @param {boolean} [props.readOnly=false] Prevents editing while keeping value visible.
 * @param {boolean} [props.isLoading=false] Applies loading state and disables interactions.
 * @param {string} [props.defaultValue=""] Initial phone value for uncontrolled usage.
 * @param {string} [props.value] Controlled phone value.
 * @param {(value: string) => void} [props.onChange] Callback with numeric value including country code.
 * @param {(typeof countries)[number]["iso"]} [props.defaultCountryIso] Reserved prop for default country ISO.
 * @param {string} [props.searchCountryPlaceholder="Pesquisar país"] Placeholder for country search input.
 * @param {string} [props.notFoundCountryText="Nenhum país encontrado"] Text shown when no country matches search.
 * @param {string} [props.className] Class applied to the field wrapper.
 * @param {string} [props.id] Optional id for the visible phone input.
 * @param {boolean} [props.unShowFieldTemplate=false] When `true`, skips wrapper/label/error rendering from `FieldTemplate`.
 * @param {"horizontal" | "vertical" | "horizontalReverse"} [props.orientation="horizontal"] Layout direction forwarded to `FieldTemplate`/`FieldWrapper`.
 *
 * @returns {JSX.Element} Phone input field with country picker and hidden input for form submission.
 *
 * @example
 * ```tsx
 * <PhoneInput name="phone" label="Telefone" />
 * ```
 *
 * @example
 * ```tsx
 * <PhoneInput
 *   name="contactPhone"
 *   value={phone}
 *   onChange={setPhone}
 *   variant="outline"
 *   size="lg"
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
    orientation = "horizontal",
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
            onChange && onChange(inputValue(e));
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
