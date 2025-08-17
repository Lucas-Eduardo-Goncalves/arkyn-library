import { Loader2, LucideIcon } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

import { IconRenderer } from "../../services/IconRenderer";
import "./styles.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  loadingText?: string;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "ghost" | "invisible";
  scheme?: "primary" | "success" | "warning" | "danger" | "info";
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
};

/**
 * Button component - used for user interactions and form submissions
 *
 * @param args - Button component properties
 * @param args.isLoading - Controls loading state with spinner. Default: false
 * @param args.loadingText - Text to display during loading state
 * @param args.size - Button size. Default: "md"
 * @param args.variant - Visual variant of the button. Default: "solid"
 * @param args.scheme - Button color scheme. Default: "primary"
 * @param args.leftIcon - Optional icon to display on the left
 * @param args.rightIcon - Optional icon to display on the right
 * ...Other valid HTML properties for button
 *
 * @returns Button JSX element
 *
 * @example
 * ```tsx
 * // Basic button
 * <Button>Click me</Button>
 *
 * // Button with color scheme
 * <Button scheme="success">Save</Button>
 *
 * // Button with loading state
 * <Button isLoading loadingText="Saving...">
 *  Save
 * </Button>
 *
 * // Button with icons
 * <Button leftIcon={SaveIcon} scheme="success">
 *  Save
 * </Button>
 *
 * // Custom button
 * <Button
 *  size="lg"
 *  variant="outline"
 *  scheme="danger"
 *  rightIcon={TrashIcon}
 * >
 *  Delete
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
        <IconRenderer iconSize={iconSize} Icon={leftIcon} />
        {children}
        <IconRenderer iconSize={iconSize} Icon={rightIcon} />
      </div>
    </button>
  );
}

export { Button };
