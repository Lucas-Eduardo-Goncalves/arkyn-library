import { countries } from "@arkyn/templates";
import { useId, useRef, useState } from "react";
import {
  findCountryMask,
  formatToPhone,
  removeNonNumeric,
} from "@arkyn/shared";

import { useForm } from "../../hooks/useForm";

import { FieldError } from "../fieldError";
import { FieldLabel } from "../fieldLabel";
import { FieldWrapper } from "../fieldWrapper";

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
};

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
    <FieldWrapper className={wrapperClassName}>
      {label && (
        <FieldLabel htmlFor={phoneInputId} showAsterisk={showAsterisk}>
          {label}
        </FieldLabel>
      )}

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

      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </FieldWrapper>
  );
}

export { PhoneInput };
