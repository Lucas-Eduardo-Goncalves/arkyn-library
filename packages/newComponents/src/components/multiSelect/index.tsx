import { LucideIcon } from "lucide-react";
import { FocusEvent, useId, useRef, useState } from "react";

import { useForm } from "../../hooks/useForm";
import { IconRenderer } from "../../services/iconRenderer";

import { FieldError } from "../fieldError";
import { FieldLabel } from "../fieldLabel";
import { FieldWrapper } from "../fieldWrapper";
import { MultiSelectChevron } from "./multiSelectChevron";
import { MultiSelectContainer } from "./multiSelectContainer";
import { MultiSelectContent } from "./multiSelectContent";
import { MultiSelectMark } from "./multiSelectMark";
import { MultiSelectOption } from "./multiSelectOption";
import { MultiSelectOptionsContainer } from "./multiSelectOptionsContainer";
import { MultiSelectOverlay } from "./multiSelectOverlay";
import { MultiSelectSpinner } from "./multiSelectSpinner";

type MultiSelectProps = {
  name: string;
  options: { label: string; value: string }[];

  id?: string;
  value?: string[];
  defaultValue?: string[];
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
  onChange?: (value: string[]) => void;

  onFocus?: () => void;
  onBlur?: (e: FocusEvent<HTMLDivElement>) => void;

  size?: "md" | "lg";
  variant?: "solid" | "outline" | "underline";

  prefix?: string | LucideIcon;
  leftIcon?: LucideIcon;

  optionMaxHeight?: number;
};

/**
 * MultiSelect component - used for selecting multiple options from a dropdown list with support for search, labels, and validation
 *
 * @param props - MultiSelect component properties
 * @param props.name - Required field name for form handling
 * @param props.options - Array of options with label and value properties
 * @param props.id - Optional unique identifier for the component
 * @param props.value - Controlled value array of selected option values
 * @param props.defaultValue - Default selected values. Default: []
 * @param props.showAsterisk - Whether to show asterisk on label for required fields
 * @param props.label - Optional label text to display above the multiselect
 * @param props.errorMessage - Error message to display below the multiselect
 * @param props.placeholder - Placeholder text when no options are selected. Default: "Selecione..."
 * @param props.notFoundText - Text to display when no options match search. Default: "Sem opções disponíveis"
 * @param props.className - Additional CSS classes to apply
 * @param props.disabled - Whether the multiselect is disabled. Default: false
 * @param props.readOnly - Whether the multiselect is read-only. Default: false
 * @param props.isLoading - Controls loading state with spinner. Default: false
 * @param props.isSearchable - Whether the multiselect supports search functionality. Default: false
 * @param props.closeOnSelect - Whether to close dropdown after selecting an option. Default: false
 * @param props.onSearch - Callback function called when search value changes
 * @param props.onChange - Callback function called when selected values change
 * @param props.onFocus - Callback function called when multiselect gains focus
 * @param props.onBlur - Callback function called when multiselect loses focus
 * @param props.size - MultiSelect size. Default: "md"
 * @param props.variant - Visual variant of the multiselect. Default: "solid"
 * @param props.prefix - Text or icon to display at the beginning of the multiselect
 * @param props.leftIcon - Optional icon to display on the left side
 * @param props.optionMaxHeight - Maximum height for the options dropdown
 *
 * @returns MultiSelect JSX element wrapped in FieldWrapper with optional label and error
 *
 * @example
 * ```tsx
 * // Basic multiselect
 * <MultiSelect
 *   name="categories"
 *   options={[
 *     { label: "Technology", value: "tech" },
 *     { label: "Design", value: "design" },
 *     { label: "Marketing", value: "marketing" }
 *   ]}
 * />
 *
 * // MultiSelect with label and validation
 * <MultiSelect
 *   name="skills"
 *   label="Select Skills"
 *   showAsterisk
 *   errorMessage="Please select at least one skill"
 *   options={skillOptions}
 *   placeholder="Choose your skills..."
 * />
 *
 * // Searchable multiselect with custom styling
 * <MultiSelect
 *   name="countries"
 *   label="Countries"
 *   isSearchable
 *   variant="outline"
 *   size="lg"
 *   leftIcon={GlobeIcon}
 *   options={countryOptions}
 *   notFoundText="No countries found"
 * />
 *
 * // Controlled multiselect with callbacks
 * <MultiSelect
 *   name="tags"
 *   label="Tags"
 *   value={selectedTags}
 *   onChange={setSelectedTags}
 *   onSearch={handleSearch}
 *   closeOnSelect={false}
 *   isLoading={isLoadingTags}
 *   options={tagOptions}
 * />
 *
 * // MultiSelect with prefix and custom behavior
 * <MultiSelect
 *   name="departments"
 *   label="Departments"
 *   prefix="Dept:"
 *   closeOnSelect={true}
 *   variant="underline"
 *   defaultValue={["hr", "it"]}
 *   options={departmentOptions}
 * />
 * ```
 */

function MultiSelect(props: MultiSelectProps) {
  const {
    name,
    options,
    className = "",
    placeholder = "Selecione...",
    closeOnSelect = false,
    defaultValue = [],
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

  const multiSelectRef = useRef<HTMLInputElement>(null);
  const multiSelectId = id || useId();

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
    onFocus && onFocus();
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
    <FieldWrapper>
      {label && <FieldLabel showAsterisk={showAsterisk}>{label}</FieldLabel>}

      <MultiSelectContainer
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

      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </FieldWrapper>
  );
}

export { MultiSelect };
