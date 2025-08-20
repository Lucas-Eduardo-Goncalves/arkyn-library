import { HTMLAttributes } from "react";
import "./styles.css";

type AlertDescriptionProps = HTMLAttributes<HTMLDivElement>;

/**
 * AlertDescription component - used to display additional descriptive text in alerts
 *
 * @param props - AlertDescription component properties
 *
 * **...Other valid HTML properties for div**
 *
 * @returns AlertDescription JSX element
 *
 * @example
 * ```tsx
 * // Basic alert with description
 * <AlertContainer schema="info">
 *   <AlertContent>
 *     <AlertTitle>Information</AlertTitle>
 *     <AlertDescription>
 *       This is additional information to help you understand the context.
 *     </AlertDescription>
 *   </AlertContent>
 * </AlertContainer>
 *
 * // Success alert with description
 * <AlertContainer schema="success">
 *   <AlertContent>
 *     <AlertTitle>Upload Complete</AlertTitle>
 *     <AlertDescription>
 *       Your file has been successfully uploaded and processed.
 *     </AlertDescription>
 *   </AlertContent>
 * </AlertContainer>
 *
 * // Warning with detailed description
 * <AlertContainer schema="warning">
 *   <AlertContent>
 *     <AlertTitle>Storage Limit</AlertTitle>
 *     <AlertDescription>
 *       You have used 90% of your storage quota. Consider upgrading your plan
 *       or removing unused files.
 *     </AlertDescription>
 *   </AlertContent>
 * </AlertContainer>
 * ```
 */

function AlertDescription(props: AlertDescriptionProps) {
  const { className: baseClassName, ...rest } = props;
  const className = `arkynAlertDescription ${baseClassName}`;

  return <div className={className.trim()} {...rest} />;
}

export { AlertDescription };
