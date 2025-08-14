import { LucideIcon } from "lucide-react";
import { HTMLAttributes } from "react";

import { IconRenderer } from "../../services/IconRenderer";
import "./styles.css";

type BadgeProps = HTMLAttributes<HTMLDivElement> & {
  size?: "md" | "lg";
  variant?: "solid" | "outline" | "ghost";
  scheme?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
};

/**
 * Badge component - used to display labels, statuses, and categorizations
 *
 * @param args - Badge component properties
 * @param args.size - Badge size. Default: "md"
 * @param args.variant - Visual variant of the badge. Default: "ghost"
 * @param args.scheme - Badge color scheme. Default: "primary"
 * @param args.leftIcon - Optional icon to display on the left
 * @param args.rightIcon - Optional icon to display on the right
 * ...Other valid HTML properties for div
 *
 * @returns Badge JSX element
 *
 * @example
 * ```tsx
 * // Basic badge
 * <Badge>New</Badge>
 *
 * // Badge with color scheme
 * <Badge scheme="success">Approved</Badge>
 *
 * // Badge with icons
 * <Badge leftIcon={CheckIcon} scheme="success">
 *  Completed
 * </Badge>
 *
 * // Custom badge
 * <Badge
 *  size="lg"
 *  variant="solid"
 *  scheme="warning"
 *  rightIcon={AlertIcon}
 * >
 *  Warning
 * </Badge>
 * ```
 */

function Badge(args: BadgeProps) {
  const {
    variant = "ghost",
    scheme = "primary",
    size = "md",
    leftIcon,
    rightIcon,
    className: baseClassName = "",
    children,
    ...rest
  } = args;

  const iconSizes = { md: 12, lg: 14 };
  const iconSize = iconSizes[size];

  const className = `arkynBadge ${variant} ${scheme} ${size} ${baseClassName}`;

  return (
    <div className={className.trim()} {...rest}>
      <IconRenderer iconSize={iconSize} Icon={leftIcon} />
      <p>{children}</p>
      <IconRenderer iconSize={iconSize} Icon={rightIcon} />
    </div>
  );
}

export { Badge };
