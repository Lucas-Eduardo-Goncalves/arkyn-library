import {
  AlertTriangle,
  CheckCircle2,
  Info,
  LucideProps,
  XCircle,
} from "lucide-react";

import { JSX } from "react";
import { useAlertContainer } from "../alertContainer";
import "./styles.css";

/**
 * Props for the AlertIcon component.
 * Extends all props from Lucide's icon components.
 *
 * @typedef {LucideProps} AlertIconProps
 */
type AlertIconProps = LucideProps;

/**
 * AlertIcon component that renders different icons based on the alert schema.
 *
 * @component
 * @memberof Alert
 *
 * @description
 * This component automatically selects and renders the appropriate icon based on the
 * alert schema from the AlertContainer context. It supports four schemas:
 * - success: Renders a CheckCircle2 icon
 * - danger: Renders an XCircle icon
 * - warning: Renders an AlertTriangle icon
 * - info: Renders an Info icon
 *
 * @param {AlertIconProps} props - Component props extending LucideProps
 * @param {string} [props.className] - Additional CSS class names to apply to the icon
 *
 * @returns {JSX.Element} The rendered icon component based on the alert schema
 *
 * @requires lucide-react - For icon components (CheckCircle2, XCircle, AlertTriangle, Info)
 * @requires useAlertContainer - Hook to access the alert schema from context
 *
 * @example
 * // This component is used internally within an Alert component
 * // and should not be used standalone as it depends on AlertContainer context
 * <AlertContainer schema="success">
 *   <AlertIcon />
 * </AlertContainer>
 *
 * @example
 * // Complete alert example
 * <AlertContainer schema="success">
 *  <AlertIcon />
 *  <AlertContent>
 *    <AlertTitle>Success!</AlertTitle>
 *    <AlertDescription>
 *      You are premium user now!
 *    </AlertDescription>
 *  </AlertContent>
 * </AlertContainer>
 */
function AlertIcon(props: AlertIconProps): JSX.Element {
  const { className: baseClassName, ...rest } = props;
  const { schema } = useAlertContainer();

  const className = `arkynAlertIcon ${schema} ${baseClassName}`;

  switch (schema) {
    case "success":
      return <CheckCircle2 className={className} {...rest} />;
    case "danger":
      return <XCircle className={className} {...rest} />;
    case "warning":
      return <AlertTriangle className={className} {...rest} />;
    case "info":
      return <Info className={className} {...rest} />;
  }
}

export { AlertIcon };
