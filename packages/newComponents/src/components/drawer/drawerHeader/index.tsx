import { X } from "lucide-react";

import { HTMLAttributes } from "react";
import { useDrawer } from "../drawerContext";
import "./styles.css";

type DrawerHeaderProps = HTMLAttributes<HTMLElement> & {
  showCloseButton?: boolean;
};

/**
 * DrawerHeader component - header section for drawer with optional close button
 *
 * @param props - DrawerHeader component properties
 * @param props.showCloseButton - Shows close button in header. Default: true
 *
 * **...Other valid HTML properties for header element**
 *
 * @returns DrawerHeader JSX element
 *
 * @example
 * ```tsx
 * // Basic drawer header with close button
 * <DrawerHeader>
 *   <h2>Menu</h2>
 * </DrawerHeader>
 *
 * // Header without close button
 * <DrawerHeader showCloseButton={false}>
 *   <h2>Settings</h2>
 * </DrawerHeader>
 *
 * // Complete drawer example
 * <DrawerContainer isVisible={isOpen} makeInvisible={() => setIsOpen(false)}>
 *   <DrawerHeader>
 *     <h2>Navigation</h2>
 *     <p>Welcome to our app</p>
 *   </DrawerHeader>
 *
 *   <div className="drawer-content">
 *     <nav>
 *       <a href="/home">Home</a>
 *       <a href="/about">About</a>
 *       <a href="/contact">Contact</a>
 *     </nav>
 *   </div>
 * </DrawerContainer>
 *
 * // Custom styled header
 * <DrawerHeader className="custom-header">
 *   <div className="header-content">
 *     <img src="/logo.png" alt="Logo" />
 *     <h1>My App</h1>
 *   </div>
 * </DrawerHeader>
 * ```
 */

function DrawerHeader(props: DrawerHeaderProps) {
  const {
    showCloseButton = true,
    className: baseClassName,
    children,
    ...rest
  } = props;

  const { makeInvisible } = useDrawer();
  const className = `arkynDrawerHeader ${baseClassName}`;

  return (
    <header className={className.trim()} {...rest}>
      {children}

      {showCloseButton && (
        <button
          className="arkynDrawerHeaderCloseButton"
          type="button"
          onClick={makeInvisible}
          aria-label="Close drawer"
        >
          <X size={24} />
        </button>
      )}
    </header>
  );
}

export { DrawerHeader };
