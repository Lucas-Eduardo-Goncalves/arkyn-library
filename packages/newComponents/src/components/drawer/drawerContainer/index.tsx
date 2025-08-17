import { AnimatePresence, motion } from "framer-motion";

import { HTMLAttributes } from "react";
import { DrawerProvider } from "../drawerContext";
import "./styles.css";

type DrawerContainerProps = HTMLAttributes<HTMLElement> & {
  isVisible: boolean;
  makeInvisible: () => void;
  orientation?: "left" | "right";
};

/**
 * DrawerContainer component - animated slide-out panel for navigation or content
 *
 * @param props - DrawerContainer component properties
 * @param props.isVisible - Controls drawer visibility state
 * @param props.makeInvisible - Callback function to hide the drawer
 * @param props.orientation - Side from which drawer slides (left, right). Default: "left"
 *
 * **...Other valid HTML properties for aside element**
 *
 * @returns DrawerContainer JSX element
 *
 * @example
 * ```tsx
 * // Basic drawer from left
 * const [isOpen, setIsOpen] = useState(false);
 * <DrawerContainer
 *   isVisible={isOpen}
 *   makeInvisible={setIsOpen}
 * >
 *   <p>Drawer content</p>
 * </DrawerContainer>
 *
 * // Right-side drawer
 * <DrawerContainer
 *   isVisible={isOpen}
 *   makeInvisible={setIsOpen}
 *   orientation="right"
 * >
 *   <nav>Navigation items</nav>
 * </DrawerContainer>
 *
 * // Complete drawer example
 * function DrawerExample() {
 *   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
 *
 *   return (
 *     <>
 *       <button onClick={() => setIsDrawerOpen(true)}>
 *         Open Menu
 *       </button>
 *
 *       <DrawerContainer
 *         isVisible={isDrawerOpen}
 *         makeInvisible={setIsDrawerOpen}
 *         orientation="right"
 *       >
 *         <div className="drawer-content">
 *           <h2>Menu</h2>
 *           <ul>
 *             <li>Home</li>
 *             <li>About</li>
 *             <li>Contact</li>
 *           </ul>
 *         </div>
 *       </DrawerContainer>
 *     </>
 *   );
 * }
 * ```
 */

function DrawerContainer(props: DrawerContainerProps) {
  const {
    isVisible,
    makeInvisible,
    orientation = "left",
    children,
    className: baseClassName,
    ...rest
  } = props;

  const translateX = orientation === "left" ? "-100%" : "100%";

  const visibleClass = isVisible ? "visibleTrue" : "visibleFalse";
  const className = `arkynDrawerContainer ${orientation} ${visibleClass} ${baseClassName}`;

  return (
    <DrawerProvider makeInvisible={makeInvisible}>
      <AnimatePresence>
        {isVisible && (
          <aside className={className.trim()} {...rest}>
            <motion.div
              className="arkynDrawerContainerOverlay"
              transition={{ duration: 0.15, ease: "easeOut" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={makeInvisible}
            />

            <motion.div
              className="arkynDrawerContainerContent"
              transition={{ ease: "easeOut", duration: 0.15 }}
              initial={{ transform: `translateX(${translateX})` }}
              animate={{ transform: "translateX(0px)" }}
              exit={{ transform: `translateX(${translateX})` }}
            >
              {children}
            </motion.div>
          </aside>
        )}
      </AnimatePresence>
    </DrawerProvider>
  );
}

export { DrawerContainer };
