import { useEffect } from "react";

function getScrollbarWidth(): number {
  if (typeof window === "undefined") return 0;
  return window.innerWidth - document.documentElement.clientWidth;
}

/**
 * useScrollLock — locks `document.body` scroll while an overlay is open.
 *
 * Compensates for the scrollbar width by adding equivalent `paddingRight`,
 * preventing layout shift when the scrollbar disappears.
 * Restores the original `overflow` and `paddingRight` when `isLocked` becomes `false`.
 *
 * Used internally by `Modal` and `Drawer` — you usually don't need this directly
 * unless building a custom overlay.
 *
 * @param isLocked - When `true`, body scroll is disabled.
 *
 * @example
 * ```tsx
 * function CustomOverlay({ isOpen }) {
 *   useScrollLock(isOpen);
 *   return isOpen ? <div className="overlay">...</div> : null;
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
