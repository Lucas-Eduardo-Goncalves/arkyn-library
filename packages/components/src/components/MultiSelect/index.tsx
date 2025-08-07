import { MultiSelectProps } from "@arkyn/types";
import { useRef, useState } from "react";

import { morpheme } from "../../services";
import { useFormController } from "../Form/FormController";

import { MultiSelectChevron } from "./components/MultiSelectChevron";
import { MultiSelectContainer } from "./components/MultiSelectContainer";
import { MultiSelectContent } from "./components/MultiSelectContent";
import { MultiSelectMark } from "./components/MultiSelectMark";
import { MultiSelectOption } from "./components/MultiSelectOption";
import { MultiSelectOptionsContainer } from "./components/MultiSelectOptionsContainer";
import { MultiSelectOverlay } from "./components/MultiSelectOverlay";
import { MultiSelectSpinner } from "./components/MultiSelectSpinner";

function MultiSelect(props: MultiSelectProps) {
  const {
    name,
    options,
    className = "",
    placeholder = "Selecione...",
    closeOnSelect = false,
    defaultValue = [],
    isError: baseIsError,
    isLoading = false,
    readOnly = false,
    isSearchable = false,
    leftIcon: LeftIcon,
    onSearch,
    onSelect,
    onBlur,
    notFoundText = "Sem opções disponíveis",
    onFocus,
    disabled = false,
    prefix: basePrefix,
    size = "md",
    value,
    variant = "solid",
  } = props;

  const formController = useFormController();
  const baseRef = useRef<HTMLInputElement>(null);

  const multiSelectRef = formController.inputRef || baseRef;
  const multiSelectId = formController.id;

  const isError = baseIsError || !!formController.error;

  const iconSizes = { md: 20, lg: 20 };
  const iconSize = iconSizes[size];
  const prefix = morpheme(basePrefix, iconSize, "prefix");

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
      if (onSelect) onSelect(selectedOptions.filter((v) => v !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
      if (onSelect) onSelect([...selectedOptions, value]);
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
      prefixExists={!!basePrefix}
      id={multiSelectId}
    >
      <input
        ref={multiSelectRef}
        name={name}
        value={JSON.stringify(forceSelectedOptions)}
        type="hidden"
      />

      {prefix}
      {LeftIcon && <LeftIcon size={iconSize} strokeWidth={2.5} />}

      <MultiSelectContent size={size}>
        {forceSelectedOptions.map((value) => (
          <MultiSelectMark
            key={value}
            label={getOptionLabel(value)}
            value={value}
            handleChangeValue={handleChangeValue}
          />
        ))}

        {forceSelectedOptions.length <= 0 && <p>{placeholder}</p>}
      </MultiSelectContent>

      <MultiSelectOptionsContainer
        isFocused={isFocused}
        isSearchable={isSearchable}
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
  );
}

export { MultiSelect };
