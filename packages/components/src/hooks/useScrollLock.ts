import { useEffect } from "react";

/**
 * Calculates the width of the scrollbar
 * @returns The scrollbar width in pixels
 */

function getScrollbarWidth(): number {
  // Check if we're in a browser environment
  if (typeof window === "undefined") return 0;

  // Calculate the difference between window width and document width
  return window.innerWidth - document.documentElement.clientWidth;
}

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
      const originalPaddingRight = document.body.style.paddingRight;

      const scrollbarWidth = getScrollbarWidth();

      if (scrollbarWidth > 0) {
        const computedStyle = window.getComputedStyle(document.body);
        const existingPaddingRight = parseInt(computedStyle.paddingRight) || 0;

        document.body.style.paddingRight = `${
          existingPaddingRight + scrollbarWidth
        }px`;
      }

      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isLocked]);
}

export { useScrollLock };
