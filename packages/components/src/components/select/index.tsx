import { LucideIcon } from "lucide-react";
import { FocusEvent, useId, useRef, useState } from "react";

import { useForm } from "../../hooks/useForm";
import { IconRenderer } from "../../services/iconRenderer";

import { FieldError } from "../fieldError";
import { FieldLabel } from "../fieldLabel";
import { FieldWrapper } from "../fieldWrapper";
import { SelectChevron } from "./selectChevron";
import { SelectContainer } from "./selectContainer";
import { SelectContent } from "./selectContent";
import { SelectOption } from "./selectOption";
import { SelectOptionsContainer } from "./selectOptionsContainer";
import { SelectOverlay } from "./selectOverlay";
import { SelectSpinner } from "./selectSpinner";

type SelectProps = {
  name: string;
  options: { label: string; value: string }[];

  id?: string;
  value?: string;
  defaultValue?: string;
  showAsterisk?: boolean;
  label?: string;
  errorMessage?: string;

  placeholder?: string;
  notFoundText?: string;
  className?: string;

  disabled?: boolean;
  readOnly?: boolean;

  isLoading?: boolean;
  isSearchable?: boolean;

  closeOnSelect?: boolean;

  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;

  onFocus?: () => void;
  onBlur?: (e: FocusEvent<HTMLDivElement>) => void;

  size?: "md" | "lg";
  variant?: "solid" | "outline" | "underline";

  prefix?: string | LucideIcon;
  leftIcon?: LucideIcon;

  optionMaxHeight?: number;
};

/**
 * Select component - used for selecting sle options from a dropdown list with support for search, labels, and validation
 *
 * @param props - Select component properties
 * @param props.name - Required field name for form handling
 * @param props.options - Array of options with label and value properties
 * @param props.id - Optional unique identifier for the component
 * @param props.value - Controlled value of selected option
 * @param props.defaultValue - Default selected value. Default: ""
 * @param props.showAsterisk - Whether to show asterisk on label for required fields
 * @param props.label - Optional label text to display above the select
 * @param props.errorMessage - Error message to display below the select
 * @param props.placeholder - Placeholder text when no options are selected. Default: "Selecione..."
 * @param props.notFoundText - Text to display when no options match search. Default: "Sem opções disponíveis"
 * @param props.className - Additional CSS classes to apply
 * @param props.disabled - Whether the select is disabled. Default: false
 * @param props.readOnly - Whether the select is read-only. Default: false
 * @param props.isLoading - Controls loading state with spinner. Default: false
 * @param props.isSearchable - Whether the select supports search functionality. Default: false
 * @param props.closeOnSelect - Whether to close dropdown after selecting an option. Default: true
 * @param props.onSearch - Callback function called when search value changes
 * @param props.onChange - Callback function called when selected value changes
 * @param props.onFocus - Callback function called when select gains focus
 * @param props.onBlur - Callback function called when select loses focus
 * @param props.size - Select size. Default: "md"
 * @param props.variant - Visual variant of the select. Default: "solid"
 * @param props.prefix - Text or icon to display at the beginning of the select
 * @param props.leftIcon - Optional icon to display on the left side
 * @param props.optionMaxHeight - Maximum height for the options dropdown
 *
 * @returns Select JSX element wrapped in FieldWrapper with optional label and error
 *
 * @example
 * ```tsx
 * // Basic select
 * <Select
 *   name="category:"
 *   options={[
 *     { label: "Technology", value: "tech" },
 *     { label: "Design", value: "design" },
 *     { label: "Marketing", value: "marketing" }
 *   ]}
 * />
 *
 * // Select with label and validation
 * <Select
 *   name="skill"
 *   label="Select your skill:"
 *   showAsterisk
 *   errorMessage="Please select at least one skill"
 *   options={skillOptions}
 *   placeholder="Choose your skills..."
 * />
 *
 * // Searchable select with custom styling
 * <Select
 *   name="country"
 *   label="Country:"
 *   isSearchable
 *   variant="outline"
 *   size="lg"
 *   leftIcon={GlobeIcon}
 *   options={countryOptions}
 *   notFoundText="No countries found"
 * />
 *
 * // Controlled select with callbacks
 * <Select
 *   name="tag"
 *   label="Tag:"
 *   value={selectedTag}
 *   onChange={setSelectedTag}
 *   onSearch={handleSearch}
 *   closeOnSelect={false}
 *   isLoading={isLoadingTags}
 *   options={tagOptions}
 * />
 *
 * // Select with prefix and custom behavior
 * <Select
 *   name="department"
 *   label="Department:"
 *   prefix="Dept:"
 *   closeOnSelect={true}
 *   variant="underline"
 *   defaultValue="hr"
 *   options={departmentOptions}
 * />
 * ```
 */

function Select(props: SelectProps) {
  const {
    name,
    options,
    className = "",
    placeholder = "Selecione...",
    closeOnSelect = true,
    defaultValue = "",
    errorMessage: baseErrorMessage,
    isLoading = false,
    readOnly = false,
    isSearchable = false,
    id,
    label,
    optionMaxHeight,
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
  } = props;

  const { fieldErrors } = useForm();

  const selectRef = useRef<HTMLInputElement>(null);
  const selectId = id || useId();

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
    return forceSelectedOptions === value;
  }

  function getOptionLabel(value: string) {
    const option = options.find((option) => option.value === value);
    return option?.label || "";
  }

  function handleContainerFocus() {
    if (disabled || !selectRef?.current || isFocused) return;
    setIsFocused(true);
    selectRef.current.focus();
    onFocus && onFocus();
  }

  function handleBlur() {
    setIsFocused(false);
    if (onBlur && selectRef.current) selectRef.current.blur();
  }

  function handleSearch(value: string) {
    setSearch(value);
    if (onSearch) onSearch(value);
  }

  function handleChangeValue(value: string) {
    if (optionHasSelected(value)) {
      setSelectedOptions("");
      if (onChange) onChange("");
    } else {
      setSelectedOptions(value);
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

  return (
    <FieldWrapper>
      {label && <FieldLabel showAsterisk={showAsterisk}>{label}</FieldLabel>}

      <SelectContainer
        handleContainerFocus={handleContainerFocus}
        disabled={disabled}
        isError={isError}
        isFocused={isFocused}
        isLoading={isLoading}
        readOnly={readOnly}
        size={size}
        variant={variant}
        className={className}
        prefixExists={!!prefix}
        id={selectId}
      >
        <input
          ref={selectRef}
          name={name}
          value={JSON.stringify(forceSelectedOptions)}
          type="hidden"
        />

        <IconRenderer iconSize={iconSize} icon={prefix} className="prefix" />

        {LeftIcon && <LeftIcon size={iconSize} strokeWidth={2.5} />}

        <SelectContent size={size}>
          {forceSelectedOptions !== "" && (
            <p>{getOptionLabel(forceSelectedOptions)}</p>
          )}
          {forceSelectedOptions === "" && <p>{placeholder}</p>}
        </SelectContent>

        <SelectOptionsContainer
          isFocused={isFocused}
          isSearchable={isSearchable}
          search={search}
          onSearch={handleSearch}
        >
          {mappedOptions.map(({ label, value }) => (
            <SelectOption
              key={value}
              label={label}
              value={value}
              size={size}
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

      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </FieldWrapper>
  );
}

export { Select };
