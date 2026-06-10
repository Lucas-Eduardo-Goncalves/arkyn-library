import { ReactNode } from "react";

import { FieldError } from "../components/fieldError";
import { FieldLabel } from "../components/fieldLabel";
import { FieldWrapper } from "../components/fieldWrapper";

type FormRendererProps = {
  name?: string;
  label?: string;
  className?: string;
  showAsterisk?: boolean;
  unShowFieldTemplate?: boolean;
  errorMessage?: string;
  orientation?: "horizontal" | "vertical" | "horizontalReverse";
  children: ReactNode;
};

function FieldTemplate(props: FormRendererProps) {
  const {
    name,
    label,
    showAsterisk,
    className,
    unShowFieldTemplate,
    errorMessage,
    children,
    orientation,
  } = props;

  if (unShowFieldTemplate) return children;

  return (
    <FieldWrapper id={name} className={className} orientation={orientation}>
      {label && <FieldLabel showAsterisk={showAsterisk}>{label}</FieldLabel>}
      {children}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </FieldWrapper>
  );
}

export { FieldTemplate };
