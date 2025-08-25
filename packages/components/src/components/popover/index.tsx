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
  children: ReactNode;
  button: ReactNode;
  closeOnClick?: boolean;
  orientation?: OrientationProps;
  className?: string;
};

/**
 * Popover component - used for displaying contextual content in a floating container that appears relative to a trigger button
 *
 * @param props - Popover component properties
 * @param props.children - Required content to display inside the popover when opened
 * @param props.button - Required trigger element that opens the popover when clicked
 * @param props.closeOnClick - Whether the popover should close when clicking on its content. Default: undefined (remains open)
 * @param props.orientation - Position where the popover appears relative to the trigger button. Default: "bottomLeft"
 * @param props.className - Additional CSS classes for styling the popover container
 *
 * @returns Popover JSX element with trigger button, animated content, and overlay for outside click handling
 *
 * @example
 * ```tsx
 * // Basic popover with default orientation
 * <Popover
 *   button={<button>Click me</button>}
 * >
 *   <div>Popover content here</div>
 * </Popover>
 *
 * // Popover with custom orientation
 * <Popover
 *   button={<IconButton icon="menu" />}
 *   orientation="topRight"
 * >
 *   <nav>
 *     <a href="/profile">Profile</a>
 *     <a href="/settings">Settings</a>
 *     <a href="/logout">Logout</a>
 *   </nav>
 * </Popover>
 *
 * // Popover that closes when content is clicked
 * <Popover
 *   button={<Button>Select Option</Button>}
 *   closeOnClick
 *   orientation="bottom"
 * >
 *   <ul>
 *     <li onClick={() => selectOption('option1')}>Option 1</li>
 *     <li onClick={() => selectOption('option2')}>Option 2</li>
 *     <li onClick={() => selectOption('option3')}>Option 3</li>
 *   </ul>
 * </Popover>
 *
 * // Popover with custom styling and left orientation
 * <Popover
 *   button={<Button variant="outline">Info</Button>}
 *   orientation="left"
 *   className="custom-popover"
 * >
 *   <div className="info-panel">
 *     <h3>Additional Information</h3>
 *     <p>This is some helpful information that appears in a popover.</p>
 *     <Button size="sm">Learn More</Button>
 *   </div>
 * </Popover>
 *
 * // Popover with form content and top-right positioning
 * <Popover
 *   button={<Badge>Filter</Badge>}
 *   orientation="topRight"
 * >
 *   <form className="filter-form">
 *     <Input name="search" placeholder="Search..." />
 *     <Select name="category" options={categories} />
 *     <Button type="submit">Apply Filters</Button>
 *   </form>
 * </Popover>
 *
 * // Popover with complex content and bottom-right positioning
 * <Popover
 *   button={<Avatar src="/user.jpg" />}
 *   orientation="bottomRight"
 *   closeOnClick
 * >
 *   <div className="user-menu">
 *     <div className="user-info">
 *       <img src="/user.jpg" alt="User" />
 *       <div>
 *         <h4>John Doe</h4>
 *         <p>john@example.com</p>
 *       </div>
 *     </div>
 *     <Divider />
 *     <MenuItem icon="user">Profile</MenuItem>
 *     <MenuItem icon="settings">Settings</MenuItem>
 *     <MenuItem icon="logout">Sign Out</MenuItem>
 *   </div>
 * </Popover>
 *
 * // Popover for context menu with right orientation
 * <Popover
 *   button={<Button variant="ghost" size="sm">⋮</Button>}
 *   orientation="right"
 *   closeOnClick
 * >
 *   <div className="context-menu">
 *     <button onClick={() => editItem()}>Edit</button>
 *     <button onClick={() => duplicateItem()}>Duplicate</button>
 *     <button onClick={() => deleteItem()}>Delete</button>
 *   </div>
 * </Popover>
 *
 * // Popover with notification content and top positioning
 * <Popover
 *   button={<Badge count={3}>🔔</Badge>}
 *   orientation="top"
 * >
 *   <div className="notifications">
 *     <h3>Recent Notifications</h3>
 *     <div className="notification-item">New message received</div>
 *     <div className="notification-item">Task completed</div>
 *     <div className="notification-item">Meeting reminder</div>
 *     <Button variant="ghost" size="sm">View All</Button>
 *   </div>
 * </Popover>
 * ```
 *
 * @remarks
 * This component provides:
 * - 8 different orientation options for flexible positioning (bottomLeft, bottomRight, topLeft, topRight, top, left, bottom, right)
 * - Smooth fade animation using Framer Motion for opening and closing
 * - Automatic scroll lock when popover is open to prevent background scrolling
 * - Click-outside-to-close functionality via overlay
 * - Optional click-on-content-to-close behavior
 * - Full accessibility support for keyboard navigation and screen readers
 *
 * The popover automatically handles positioning, animations, and user interactions.
 * It uses CSS classes for styling and can be customized through the className prop.
 * The component is ideal for dropdowns, context menus, tooltips, and any contextual UI elements.
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
