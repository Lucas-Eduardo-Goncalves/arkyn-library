import { HTMLAttributes } from "react";
import "./styles.css";

type DividerProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
};

/**
 * Divider component - used to visually separate content sections
 *
 * @param args - Divider component properties
 * @param args.orientation - Divider orientation. Default: "horizontal"
 * ...Other valid HTML properties for div
 *
 * @returns Divider JSX element
 *
 * @example
 * ```tsx
 * // Basic horizontal divider
 * <Divider />
 *
 * // Explicit horizontal divider
 * <Divider orientation="horizontal" />
 *
 * // Vertical divider
 * <Divider orientation="vertical" />
 *
 * // Custom styled divider
 * <Divider
 *   orientation="horizontal"
 *   className="my-custom-divider"
 * />
 *
 * // Usage in layout
 * <div>
 *   <h2>Section 1</h2>
 *   <p>Content for section 1</p>
 *   <Divider />
 *   <h2>Section 2</h2>
 *   <p>Content for section 2</p>
 * </div>
 * ```
 */

function Divider(props: DividerProps) {
  const {
    className: baseClassName,
    orientation = "horizontal",
    ...rest
  } = props;

  const className = `arkynDivider ${orientation} ${baseClassName}`;

  return <div className={className.trim()} {...rest} />;
}

export { Divider };
