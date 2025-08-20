import { ReactNode } from "react";
import "./styles.css";

type MultiSelectContainerProps = {
  children: ReactNode;
  handleContainerFocus: () => void;
  prefixExists: boolean;
  isError: boolean;
  disabled: boolean;
  readOnly: boolean;
  isLoading: boolean;
  isFocused: boolean;
  className?: string;
  id: string;
  variant: "solid" | "outline" | "underline";
  size: "md" | "lg";
};

function MultiSelectContainer(props: MultiSelectContainerProps) {
  const {
    children,
    handleContainerFocus,
    disabled,
    isError,
    isLoading,
    isFocused,
    className,
    readOnly,
    variant,
    size,
    id,
    prefixExists,
  } = props;

  const hasPrefix = prefixExists ? "hasPrefix" : "";
  const errored = isError ? "errored" : "";
  const opacity = disabled || readOnly || isLoading ? "opacity" : "";
  const focused = isFocused ? "focused" : "";

  return (
    <section
      id={id}
      className={`arkynMultiSelectContainer ${hasPrefix} ${variant} ${size} ${opacity} ${errored} ${focused} ${className}`}
      onClick={handleContainerFocus}
    >
      {children}
    </section>
  );
}

export { MultiSelectContainer };
