import { motion } from "framer-motion";
import { ReactNode, useState } from "react";

import { useScrollLock } from "../../hooks/useScrollLock";
import "./styles.css";

type OrientationProps =
  | "bottomLeft"
  | "bottomRight"
  | "topLeft"
  | "topRight"
  | "top"
  | "left"
  | "bottom"
  | "right";

type PopoverProps = {
  /** Content rendered inside the floating panel. Required. */
  children: ReactNode;
  /** Trigger element — clicking it opens the popover. Required. */
  button: ReactNode;
  /** When true, clicking the popover content also closes it. @default false */
  closeOnClick?: boolean;
  /**
   * Position of the floating panel relative to the trigger.
   * Options: `"bottomLeft"` | `"bottomRight"` | `"topLeft"` | `"topRight"` | `"top"` | `"bottom"` | `"left"` | `"right"`.
   * @default "bottomLeft"
   */
  orientation?: OrientationProps;
  /** Additional CSS class applied to the popover root element. */
  className?: string;
};

/**
 * Popover — floating panel that appears relative to a trigger element.
 *
 * Clicking outside the popover (or clicking the content when `closeOnClick` is set)
 * dismisses it. Locks body scroll while open.
 *
 * @param props.children - Content to display inside the panel. Required.
 * @param props.button - Trigger element that opens the popover. Required.
 * @param props.closeOnClick - Clicking the content also closes the popover. Default: false
 * @param props.orientation - Panel position relative to the trigger. Default: "bottomLeft"
 * @param props.className - Additional CSS class for the root element.
 *
 * @returns Popover JSX element with trigger, animated panel, and outside-click overlay.
 *
 * @example
 * ```tsx
 * // Basic dropdown menu
 * <Popover button={<Button>Options</Button>} closeOnClick>
 *   <ul>
 *     <li onClick={handleEdit}>Edit</li>
 *     <li onClick={handleDelete}>Delete</li>
 *   </ul>
 * </Popover>
 *
 * // User profile menu (bottom-right)
 * <Popover
 *   button={<IconButton icon={User} aria-label="Account" />}
 *   orientation="bottomRight"
 *   closeOnClick
 * >
 *   <nav>
 *     <a href="/profile">Profile</a>
 *     <a href="/settings">Settings</a>
 *     <a href="/logout">Sign out</a>
 *   </nav>
 * </Popover>
 *
 * // Filter panel (top-left)
 * <Popover button={<Badge>Filters</Badge>} orientation="topLeft">
 *   <Input name="search" placeholder="Search..." />
 *   <Select name="status" options={statusOptions} />
 * </Popover>
 * ```
 */

function Popover(props: PopoverProps) {
  const {
    children,
    button,
    closeOnClick,
    className: baseClassName = "",
    orientation = "bottomLeft",
  } = props;
  const [isOpen, setIsOpen] = useState(false);

  const visible = isOpen ? "visibleTrue" : "visibleFalse";
  const className = `arkynPopover ${orientation} ${visible} ${baseClassName}`;

  function handleOpenPopover() {
    if (!isOpen) setIsOpen(true);
  }

  useScrollLock(isOpen);

  return (
    <div className={className} onClick={handleOpenPopover}>
      {button}

      <motion.div
        style={{ visibility: isOpen ? "visible" : "hidden" }}
        transition={{ ease: "easeOut", duration: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        exit={{ opacity: 0 }}
        onClick={() => closeOnClick && setIsOpen(false)}
        className="arkynPopoverContent"
      >
        {children}
      </motion.div>

      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="arkynPopoverOverlay" />
      )}
    </div>
  );
}

export { Popover };
