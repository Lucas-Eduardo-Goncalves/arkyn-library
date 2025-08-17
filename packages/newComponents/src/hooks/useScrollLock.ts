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
      // Salva o valor atual do overflow
      const originalOverflow = document.body.style.overflow;

      // Bloqueia o scroll
      document.body.style.overflow = "hidden";

      // Cleanup: restaura o overflow original quando desbloqueado
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isLocked]);
}

export { useScrollLock };
