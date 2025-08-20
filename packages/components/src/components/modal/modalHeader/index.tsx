import { X } from "lucide-react";
import { HTMLAttributes } from "react";

import { useModal } from "../modalContext";
import "./styles.css";

type ModalHeaderProps = HTMLAttributes<HTMLElement> & {
  showCloseButton?: boolean;
};

/**
 * ModalHeader component - header section for modals with optional close button
 *
 * @param props - ModalHeader component properties
 * @param props.showCloseButton - Shows close button in header. Default: true
 *
 * **...Other valid HTML properties for header element**
 *
 * @returns ModalHeader JSX element
 *
 * @example
 * ```tsx
 * // Basic modal header with close button
 * <ModalHeader>
 *   <h2>Modal Title</h2>
 * </ModalHeader>
 *
 * // Header without close button
 * <ModalHeader showCloseButton={false}>
 *   <h2>Important Notice</h2>
 * </ModalHeader>
 *
 * // Header with subtitle
 * <ModalHeader>
 *   <div>
 *     <h2>Settings</h2>
 *     <p>Manage your preferences</p>
 *   </div>
 * </ModalHeader>
 *
 * // Complete modal example
 * <ModalContainer isVisible={isOpen} makeInvisible={() => setIsOpen(false)}>
 *   <div className="modal-content">
 *     <ModalHeader>
 *       <h2>Confirm Delete</h2>
 *       <p>This action cannot be undone</p>
 *     </ModalHeader>
 *
 *     <main>
 *       <p>Are you sure you want to delete this item?</p>
 *     </main>
 *
 *     <ModalFooter>
 *       <button onClick={() => setIsOpen(false)}>Cancel</button>
 *       <button onClick={handleDelete}>Delete</button>
 *     </ModalFooter>
 *   </div>
 * </ModalContainer>
 *
 * // Custom styled header
 * <ModalHeader className="custom-header">
 *   <div className="header-content">
 *     <img src="/icon.png" alt="Icon" />
 *     <h1>Welcome</h1>
 *   </div>
 * </ModalHeader>
 * ```
 */

function ModalHeader(args: ModalHeaderProps) {
  const {
    showCloseButton = true,
    className: baseClassName,
    children,
    ...rest
  } = args;

  const { makeInvisible } = useModal();
  const className = `arkynModalHeader ${baseClassName}`;

  return (
    <header className={className.trim()} {...rest}>
      {children}

      {showCloseButton && (
        <button
          type="button"
          onClick={makeInvisible}
          aria-label="Close modal button"
          className="arkynModalHeaderCloseButton"
        >
          <X size={24} />
        </button>
      )}
    </header>
  );
}

export { ModalHeader };
