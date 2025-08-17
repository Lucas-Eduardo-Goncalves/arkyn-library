import { Loader2, LucideIcon } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

import "./styles.css";

type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "aria-label"
> & {
  icon: LucideIcon;
  "aria-label": string;

  isLoading?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "ghost" | "invisible";
  scheme?: "primary" | "success" | "warning" | "danger" | "info";
};

/**
 * IconButton component - compact button that renders only an icon
 *
 * @param props - IconButton component properties
 * @param props.icon - Icon to render inside the button (LucideIcon). Required
 * @param props.aria-label - Accessible label for screen readers. Required
 * @param props.isLoading - Controls loading state with spinner. Default: false
 * @param props.size - Button size. Default: "md"
 * @param props.variant - Visual variant of the button. Default: "solid"
 * @param props.scheme - Button color scheme. Default: "primary"
 *
 * **...Other valid HTML properties for button element (children not supported)**
 *
 * @returns IconButton JSX element
 *
 * @example
 * ```tsx
 * // Basic icon button
 * <IconButton icon={Plus} aria-label="Add" />
 *
 * // Different color scheme and variant
 * <IconButton icon={Trash2} aria-label="Delete" scheme="danger" variant="outline" />
 *
 * // Loading state
 * <IconButton icon={Save} aria-label="Saving" isLoading />
 *
 * // Sizes
 * <IconButton icon={MoreVertical} aria-label="More options" size="sm" />
 * ```
 */

function IconButton(props: IconButtonProps) {
  const {
    isLoading = false,
    scheme = "primary",
    variant = "solid",
    size = "md",
    icon: Icon,
    disabled,
    className: baseClassName = "",
    ...rest
  } = props;

  const iconSize = { xs: 12, sm: 16, md: 20, lg: 24 };
  const loading = isLoading ? "loadingTrue" : "loadingFalse";
  const className = `arkynIconButton ${variant} ${scheme} ${size} ${loading} ${baseClassName}`;

  return (
    <button
      disabled={disabled || isLoading}
      className={className.trim()}
      {...rest}
    >
      <div className="arkynIconButtonSpinner">
        <Loader2 size={iconSize[size]} strokeWidth={2.5} />
      </div>

      <div className="arkynIconButtonContent">
        <Icon size={iconSize[size]} strokeWidth={2.5} />
      </div>
    </button>
  );
}

export { IconButton };
