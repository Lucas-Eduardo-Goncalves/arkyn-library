import {
  AlertTriangle,
  CheckCircle2,
  Info,
  LucideProps,
  XCircle,
} from "lucide-react";

import { useAlertContainer } from "../alertContainer";
import "./styles.css";

type AlertIconProps = LucideProps;

/**
 * AlertIcon component - automatically displays the appropriate icon based on the alert schema
 *
 * @param props - AlertIcon component properties
 *
 * **...Other valid Lucide icon properties**
 *
 * @returns AlertIcon JSX element with schema-specific icon
 *
 * @description
 * This component automatically selects and renders the appropriate icon based on the
 * AlertContainer's schema context:
 * - success: CheckCircle2 icon
 * - danger: XCircle icon
 * - warning: AlertTriangle icon
 * - info: Info icon
 *
 * @example
 * ```tsx
 * // Basic usage - icon automatically matches container schema
 * <AlertContainer schema="success">
 *   <AlertIcon />
 *   <AlertContent>
 *     <AlertTitle>Success</AlertTitle>
 *     <AlertDescription>Operation completed successfully.</AlertDescription>
 *   </AlertContent>
 * </AlertContainer>
 *
 * // Warning alert with icon
 * <AlertContainer schema="warning">
 *   <AlertIcon />
 *   <AlertContent>
 *     Please review your input before proceeding.
 *   </AlertContent>
 * </AlertContainer>
 *
 * // Custom icon size
 * <AlertContainer schema="danger">
 *   <AlertIcon size={24} />
 *   <AlertContent>
 *     <AlertTitle>Error</AlertTitle>
 *     <AlertDescription>Something went wrong.</AlertDescription>
 *   </AlertContent>
 * </AlertContainer>
 * ```
 */

function AlertIcon(props: AlertIconProps) {
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
