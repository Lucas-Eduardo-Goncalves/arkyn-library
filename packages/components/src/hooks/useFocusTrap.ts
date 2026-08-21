import { type RefObject, useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
	"a[href]",
	"area[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"iframe",
	"[tabindex]:not([tabindex='-1'])",
].join(", ");

function getFocusableElements(container: HTMLElement): HTMLElement[] {
	return Array.from(
		container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
	);
}

/**
 * useFocusTrap, keeps keyboard focus inside a container while `isActive`.
 *
 * On activation, saves the currently focused element and moves focus to the
 * first focusable descendant of `containerRef.current` (or to the container
 * itself when it has none). While active, `Tab`/`Shift+Tab` cycle focus
 * between the first and last focusable descendants instead of leaving the
 * container. On deactivation (or unmount), focus is restored to the element
 * that was focused right before activation.
 *
 * Used internally by `ModalContainer`, `DrawerContainer`, and `Popover`.
 *
 * @param isActive - When `true`, focus is moved into and trapped inside the container.
 * @param containerRef - Ref to the container that should trap focus. Give the element `tabIndex={-1}` so it can still receive focus when it has no focusable children.
 *
 * @example
 * ```tsx
 * function CustomOverlay({ isOpen }) {
 *   const containerRef = useRef<HTMLDivElement>(null);
 *   useFocusTrap(isOpen, containerRef);
 *   return isOpen ? <div ref={containerRef} tabIndex={-1}>...</div> : null;
 * }
 * ```
 */

function useFocusTrap(
	isActive: boolean,
	containerRef: RefObject<HTMLElement | null>,
): void {
	const previouslyFocused = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!isActive) return;

		const container: HTMLElement | null = containerRef.current;
		if (!container) return;
		const dialogNode: HTMLElement = container;

		previouslyFocused.current = document.activeElement as HTMLElement | null;

		const [firstFocusable] = getFocusableElements(dialogNode);
		(firstFocusable ?? dialogNode).focus();

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key !== "Tab") return;

			const focusable = getFocusableElements(dialogNode);

			if (focusable.length === 0) {
				event.preventDefault();
				dialogNode.focus();
				return;
			}

			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			const active = document.activeElement;

			if (event.shiftKey && active === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && active === last) {
				event.preventDefault();
				first.focus();
			}
		}

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			previouslyFocused.current?.focus();
			previouslyFocused.current = null;
		};
	}, [isActive, containerRef]);
}

export { useFocusTrap };
