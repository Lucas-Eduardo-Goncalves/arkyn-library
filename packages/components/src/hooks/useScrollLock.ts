import { useEffect } from "react";

/**
 * useScrollLock hook - manages body scroll blocking for overlays
 *
 * @param isLocked - Whether the body scroll should be locked
 *
 * @example
 * ```tsx
 * // Basic usage
 * const [isModalOpen, setIsModalOpen] = useState(false);
 * useScrollLock(isModalOpen);
 *
 * // In a modal component
 * function Modal({ isVisible }) {
 *   useScrollLock(isVisible);
 *
 *   return isVisible ? (
 *     <div className="modal">
 *       <div className="modal-content">
 *         Modal content
 *       </div>
 *     </div>
 *   ) : null;
 * }
 *
 * // In a drawer component
 * function Drawer({ isOpen }) {
 *   useScrollLock(isOpen);
 *
 *   return (
 *     <aside className={`drawer ${isOpen ? 'open' : 'closed'}`}>
 *       Drawer content
 *     </aside>
 *   );
 * }
 * ```
 */

function useScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (isLocked) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isLocked]);
}

export { useScrollLock };
