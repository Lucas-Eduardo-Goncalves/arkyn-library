import { AnimatePresence, motion } from "framer-motion";
import { HTMLAttributes } from "react";

import { useScrollLock } from "../../../hooks/useScrollLock";
import { ModalProvider } from "../modalContext";
import "./styles.css";

type ModalContainerProps = HTMLAttributes<HTMLElement> & {
  isVisible: boolean;
  makeInvisible: () => void;
};

/**
 * ModalContainer component - animated overlay modal for dialogs and content
 *
 * @param props - ModalContainer component properties
 * @param props.isVisible - Controls modal visibility state
 * @param props.makeInvisible - Callback function to hide the modal
 *
 * **...Other valid HTML properties for aside element**
 *
 * @returns ModalContainer JSX element
 *
 * @example
 * ```tsx
 * // Basic modal
 * const [isOpen, setIsOpen] = useState(false);
 * <ModalContainer
 *   isVisible={isOpen}
 *   makeInvisible={() => setIsOpen(false)}
 * >
 *   <p>Modal content</p>
 * </ModalContainer>
 *
 * // Modal with custom styling
 * <ModalContainer
 *   isVisible={isOpen}
 *   makeInvisible={() => setIsOpen(false)}
 *   className="custom-modal"
 * >
 *   <div className="modal-content">
 *     <h2>Confirmation</h2>
 *     <p>Are you sure you want to proceed?</p>
 *   </div>
 * </ModalContainer>
 *
 * // Complete modal example
 * function ModalExample() {
 *   const [isModalOpen, setIsModalOpen] = useState(false);
 *
 *   return (
 *     <>
 *       <button onClick={() => setIsModalOpen(true)}>
 *         Open Modal
 *       </button>
 *
 *       <ModalContainer
 *         isVisible={isModalOpen}
 *         makeInvisible={() => setIsModalOpen(false)}
 *       >
 *         <div className="modal-dialog">
 *           <header>
 *             <h2>Modal Title</h2>
 *           </header>
 *
 *           <main>
 *             <p>This is the modal content.</p>
 *           </main>
 *
 *           <footer>
 *             <button onClick={() => setIsModalOpen(false)}>
 *               Close
 *             </button>
 *           </footer>
 *         </div>
 *       </ModalContainer>
 *     </>
 *   );
 * }
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
