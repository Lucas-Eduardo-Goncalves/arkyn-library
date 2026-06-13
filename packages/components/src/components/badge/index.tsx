import { LucideIcon } from "lucide-react";
import { HTMLAttributes } from "react";

import { IconRenderer } from "../../services/iconRenderer";
import "./styles.css";

type BadgeProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Badge size.
   * @default "lg"
   */
  size?: "md" | "lg";
  /**
   * Visual style variant.
   * - `solid`: filled background.
   * - `outline`: bordered, transparent background.
   * - `ghost`: no border, subtle background on hover.
   * @default "ghost"
   */
  variant?: "solid" | "outline" | "ghost";
  /**
   * Color scheme applied to the badge.
   * @default "primary"
   */
  scheme?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  /** Lucide icon rendered to the left of the label. */
  leftIcon?: LucideIcon;
  /** Lucide icon rendered to the right of the label. */
  rightIcon?: LucideIcon;
};

/**
 * Badge — displays labels, statuses, and categorization tags.
 *
 * @param props.size - Badge size (`md` | `lg`). Default: "lg"
 * @param props.variant - Visual style variant. Default: "ghost"
 * @param props.scheme - Color scheme. Default: "primary"
 * @param props.leftIcon - Lucide icon rendered to the left of the label.
 * @param props.rightIcon - Lucide icon rendered to the right of the label.
 *
 * **...Other valid HTML properties for `<div>`**
 *
 * @returns Badge JSX element.
 *
 * @example
 * ```tsx
 * // Basic badge
 * <Badge>New</Badge>
 *
 * // With color scheme
 * <Badge scheme="success">Approved</Badge>
 *
 * // With icon
 * <Badge leftIcon={CheckIcon} scheme="success">Completed</Badge>
 *
 * // Custom size, variant and scheme
 * <Badge size="lg" variant="solid" scheme="warning" rightIcon={AlertIcon}>
 *   Warning
 * </Badge>
 * ```
 */

function Badge(props: BadgeProps) {
  const {
    variant = "ghost",
    scheme = "primary",
    size = "lg",
    leftIcon,
    rightIcon,
    className: baseClassName = "",
    children,
    ...rest
  } = props;

  const iconSizes = { md: 12, lg: 14 };
  const iconSize = iconSizes[size];

  const className = `arkynBadge ${variant} ${scheme} ${size} ${baseClassName}`;

  return (
    <div className={className.trim()} {...rest}>
      <IconRenderer iconSize={iconSize} icon={leftIcon} />
      <p>{children}</p>
      <IconRenderer iconSize={iconSize} icon={rightIcon} />
    </div>
  );
}

export { Badge };
