import { AnimatePresence, motion } from "framer-motion";
import { HTMLAttributes } from "react";

import { useScrollLock } from "../../../hooks/useScrollLock";
import { ModalProvider } from "../modalContext";
import "./styles.css";

type ModalContainerProps = HTMLAttributes<HTMLElement> & {
  /** Controls whether the modal is visible. */
  isVisible: boolean;
  /** Callback invoked when the backdrop overlay is clicked. */
  makeInvisible: () => void;
};

/**
 * ModalContainer — animated centered modal rendered over a backdrop overlay.
 *
 * Locks body scroll while open. Closes when the overlay is clicked.
 * Provides context consumed by `ModalHeader` (close button).
 *
 * @param props.isVisible - Whether the modal is open. Required.
 * @param props.makeInvisible - Called when the overlay is clicked. Required.
 *
 * **...Other valid HTML `<aside>` properties**
 *
 * @returns ModalContainer JSX element.
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <ModalContainer isVisible={isOpen} makeInvisible={() => setIsOpen(false)}>
 *   <ModalHeader><h2>Confirm deletion</h2></ModalHeader>
 *   <main><p>This action cannot be undone.</p></main>
 *   <ModalFooter>
 *     <Button onClick={() => setIsOpen(false)}>Cancel</Button>
 *     <Button scheme="danger" onClick={handleDelete}>Delete</Button>
 *   </ModalFooter>
 * </ModalContainer>
 * ```
 */

function ModalContainer(args: ModalContainerProps) {
  const {
    isVisible,
    makeInvisible,
    children,
    className: baseClassName = "",
    ...rest
  } = args;

  useScrollLock(isVisible);

  const visibleClass = isVisible ? "visibleTrue" : "visibleFalse";
  const className = `arkynModalContainer ${visibleClass} ${baseClassName}`;

  return (
    <ModalProvider makeInvisible={makeInvisible}>
      <AnimatePresence>
        {isVisible && (
          <aside className={className.trim()} {...rest}>
            <motion.div
              className="arkynModalContainerOverlay"
              transition={{ duration: 0.15, ease: "easeOut" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={makeInvisible}
            />

            <motion.div
              className="arkynModalContainerContent"
              transition={{ duration: 0.15, ease: "easeOut" }}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              {children}
            </motion.div>
          </aside>
        )}
      </AnimatePresence>
    </ModalProvider>
  );
}

export { ModalContainer };
