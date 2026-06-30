import {
	type AnimationEvent,
	type HTMLAttributes,
	useEffect,
	useState,
} from "react";

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

	const [mounted, setMounted] = useState(isVisible);
	const [isExiting, setIsExiting] = useState(false);

	useEffect(() => {
		if (isVisible) {
			setMounted(true);
			setIsExiting(false);
		} else if (mounted) {
			setIsExiting(true);
		}
	}, [isVisible, mounted]);

	useScrollLock(isVisible);

	function handleOverlayAnimationEnd(e: AnimationEvent<HTMLDivElement>) {
		if (e.target === e.currentTarget && isExiting) {
			setIsExiting(false);
			setMounted(false);
			makeInvisible();
		}
	}

	if (!mounted) return null;

	const className = [
		"arkynModalContainer",
		isExiting ? "exiting" : "",
		baseClassName,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<ModalProvider makeInvisible={() => setIsExiting(true)}>
			<aside className={className.trim()} {...rest}>
				<div
					className="arkynModalContainerOverlay"
					onClick={() => setIsExiting(true)}
					onAnimationEnd={handleOverlayAnimationEnd}
				/>
				<div className="arkynModalContainerContent">{children}</div>
			</aside>
		</ModalProvider>
	);
}

export { ModalContainer };
