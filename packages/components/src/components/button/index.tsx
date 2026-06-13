import { Loader2, LucideIcon } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

import { IconRenderer } from "../../services/iconRenderer";
import "./styles.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Shows a spinner and disables the button during async operations. @default false */
  isLoading?: boolean;
  /** Text displayed beside the spinner when `isLoading` is true. */
  loadingText?: string;
  /**
   * Button size.
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg";
  /**
   * Visual style variant.
   * - `solid`: filled background.
   * - `outline`: bordered, transparent background.
   * - `ghost`: no border, subtle hover.
   * - `invisible`: no visual styling.
   * @default "solid"
   */
  variant?: "solid" | "outline" | "ghost" | "invisible";
  /**
   * Color scheme applied to the button.
   * @default "primary"
   */
  scheme?: "primary" | "success" | "warning" | "danger" | "info";
  /** Lucide icon rendered to the left of the label. */
  leftIcon?: LucideIcon;
  /** Lucide icon rendered to the right of the label. */
  rightIcon?: LucideIcon;
};

/**
 * Button — used for user interactions and form submissions.
 *
 * @param props.isLoading - Shows a spinner and disables the button. Default: false
 * @param props.loadingText - Text displayed beside the spinner when loading.
 * @param props.size - Button size (`xs` | `sm` | `md` | `lg`). Default: "md"
 * @param props.variant - Visual style variant. Default: "solid"
 * @param props.scheme - Color scheme. Default: "primary"
 * @param props.leftIcon - Lucide icon rendered to the left of the label.
 * @param props.rightIcon - Lucide icon rendered to the right of the label.
 *
 * **...Other valid HTML properties for `<button>`**
 *
 * @returns Button JSX element.
 *
 * @example
 * ```tsx
 * // Basic button
 * <Button>Click me</Button>
 *
 * // With color scheme
 * <Button scheme="success">Save</Button>
 *
 * // With loading state
 * <Button isLoading loadingText="Saving...">Save</Button>
 *
 * // With icons
 * <Button leftIcon={SaveIcon} scheme="success">Save</Button>
 *
 * // Custom size, variant and scheme
 * <Button size="lg" variant="outline" scheme="danger" rightIcon={TrashIcon}>
 *   Delete
 * </Button>
 * ```
 */

function Button(props: ButtonProps) {
  const {
    isLoading = false,
    scheme = "primary",
    variant = "solid",
    loadingText,
    size = "md",
    leftIcon,
    rightIcon,
    disabled,
    className: baseClassName = "",
    children,
    ...rest
  } = props;

  const iconSizes = { xs: 12, sm: 16, md: 20, lg: 24 };
  const iconSize = iconSizes[size];

  const loadingClass = isLoading ? "loadingTrue" : "loadingFalse";
  const loadingTextClass = !!loadingText
    ? "loadingTextTrue"
    : "loadingTextFalse";

  const className = `arkynButton ${loadingClass} ${variant} ${scheme} ${size} ${loadingTextClass} ${baseClassName}`;

  return (
    <button className={className} disabled={disabled || isLoading} {...rest}>
      <div className="arkynButtonSpinner">
        <Loader2 size={iconSize} strokeWidth={2.5} />
        {loadingText && loadingText}
      </div>

      <div className="arkynButtonContent">
        <IconRenderer iconSize={iconSize} icon={leftIcon} />
        {children}
        <IconRenderer iconSize={iconSize} icon={rightIcon} />
      </div>
    </button>
  );
}

export { Button };
