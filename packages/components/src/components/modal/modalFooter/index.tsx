import { HTMLAttributes } from "react";
import "./styles.css";

type ModalFooterProps = HTMLAttributes<HTMLElement> & {
  /**
   * Horizontal alignment of footer content.
   * - `left` / `center` / `right`: flex-start, center, flex-end.
   * - `between`: space-between.
   * - `around`: space-around.
   * @default "right"
   */
  alignment?: "left" | "center" | "right" | "between" | "around";
};

/**
 * ModalFooter — action bar at the bottom of a modal dialog.
 *
 * @param props.alignment - Horizontal alignment of children. Default: `"right"`
 *
 * **...Other valid HTML `<footer>` properties**
 *
 * @returns ModalFooter JSX element.
 *
 * @example
 * ```tsx
 * // Confirm / cancel pattern (right-aligned by default)
 * <ModalFooter>
 *   <Button variant="ghost" onClick={onClose}>Cancel</Button>
 *   <Button scheme="danger" onClick={onConfirm}>Delete</Button>
 * </ModalFooter>
 *
 * // Space-between layout (e.g. back / next in a wizard)
 * <ModalFooter alignment="between">
 *   <Button variant="outline" onClick={onBack}>Back</Button>
 *   <Button onClick={onNext}>Next</Button>
 * </ModalFooter>
 * ```
 */

function ModalFooter(args: ModalFooterProps) {
  const { alignment = "right", className: baseClassName, ...rest } = args;
  const className = `arkynModalFooter ${alignment} ${baseClassName}`;

  return <footer className={className.trim()} {...rest} />;
}

export { ModalFooter };
