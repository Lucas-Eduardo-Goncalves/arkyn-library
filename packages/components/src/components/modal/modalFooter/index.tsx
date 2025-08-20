import { HTMLAttributes } from "react";
import "./styles.css";

type ModalFooterProps = HTMLAttributes<HTMLElement> & {
  alignment?: "left" | "center" | "right" | "between" | "around";
};

/**
 * ModalFooter component - footer section for modals with flexible alignment options
 *
 * @param props - ModalFooter component properties
 * @param props.alignment - Content alignment within the footer. Default: "right"
 *
 * **...Other valid HTML properties for footer element**
 *
 * @returns ModalFooter JSX element
 *
 * @example
 * ```tsx
 * // Basic footer with right alignment (default)
 * <ModalFooter>
 *   <button>Cancel</button>
 *   <button>Save</button>
 * </ModalFooter>
 *
 * // Left aligned footer
 * <ModalFooter alignment="left">
 *   <button>Delete</button>
 * </ModalFooter>
 *
 * // Center aligned footer
 * <ModalFooter alignment="center">
 *   <button>OK</button>
 * </ModalFooter>
 *
 * // Space between buttons
 * <ModalFooter alignment="between">
 *   <button>Cancel</button>
 *   <button>Confirm</button>
 * </ModalFooter>
 *
 * // Space around buttons
 * <ModalFooter alignment="around">
 *   <button>Previous</button>
 *   <button>Next</button>
 *   <button>Finish</button>
 * </ModalFooter>
 *
 * // Complete modal example
 * <ModalContainer isVisible={isOpen} makeInvisible={() => setIsOpen(false)}>
 *   <div className="modal-content">
 *     <header>
 *       <h2>Confirm Action</h2>
 *     </header>
 *
 *     <main>
 *       <p>Are you sure you want to delete this item?</p>
 *     </main>
 *
 *     <ModalFooter alignment="right">
 *       <button onClick={() => setIsOpen(false)}>
 *         Cancel
 *       </button>
 *       <button onClick={handleDelete}>
 *         Delete
 *       </button>
 *     </ModalFooter>
 *   </div>
 * </ModalContainer>
 * ```
 */

function ModalFooter(args: ModalFooterProps) {
  const { alignment = "right", className: baseClassName, ...rest } = args;
  const className = `arkynModalFooter ${alignment} ${baseClassName}`;

  return <footer className={className.trim()} {...rest} />;
}

export { ModalFooter };
