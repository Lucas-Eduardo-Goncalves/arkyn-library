import { useEffect, useRef } from "react";

/**
 * useEscapeKey, invokes a callback when the `Escape` key is pressed while active.
 *
 * Listens on `document`, so it fires regardless of which descendant currently
 * has focus. The callback is always the latest one passed in, without
 * re-attaching the listener on every render.
 *
 * Used internally by `ModalContainer`, `DrawerContainer`, and `Popover` to
 * close the overlay on Escape.
 *
 * @param isActive - When `true`, the Escape key listener is attached.
 * @param onEscape - Called when Escape is pressed while `isActive` is `true`.
 *
 * @example
 * ```tsx
 * function CustomOverlay({ isOpen, onClose }) {
 *   useEscapeKey(isOpen, onClose);
 *   return isOpen ? <div role="dialog">...</div> : null;
 * }
 * ```
 */

function useEscapeKey(isActive: boolean, onEscape: () => void): void {
	const onEscapeRef = useRef(onEscape);
	onEscapeRef.current = onEscape;

	useEffect(() => {
		if (!isActive) return;

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") onEscapeRef.current();
		}

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isActive]);
}

export { useEscapeKey };
