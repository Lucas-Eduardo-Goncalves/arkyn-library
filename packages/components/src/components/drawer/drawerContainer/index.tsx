import {
	type AnimationEvent,
	type HTMLAttributes,
	useEffect,
	useState,
} from "react";

import { useScrollLock } from "../../../hooks/useScrollLock";
import { DrawerProvider } from "../drawerContext";
import "./styles.css";

type DrawerContainerProps = HTMLAttributes<HTMLElement> & {
	/** Controls whether the drawer is visible. */
	isVisible: boolean;
	/** Callback invoked when the overlay is clicked to close the drawer. */
	makeInvisible: () => void;
	/** Side from which the drawer slides in. @default "left" */
	orientation?: "left" | "right";
};

/**
 * DrawerContainer — animated slide-in panel rendered over an overlay backdrop.
 *
 * Locks body scroll while open. Closes when the overlay is clicked.
 * Provides context consumed by `DrawerHeader` (close button).
 *
 * @param props.isVisible - Whether the drawer is open. Required.
 * @param props.makeInvisible - Called when the overlay or close button is clicked. Required.
 * @param props.orientation - Slide direction. Default: `"left"`
 *
 * **...Other valid HTML `<aside>` properties**
 *
 * @returns DrawerContainer JSX element.
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <DrawerContainer isVisible={isOpen} makeInvisible={() => setIsOpen(false)} orientation="right">
 *   <DrawerHeader><h2>Navigation</h2></DrawerHeader>
 *   <nav>...</nav>
 * </DrawerContainer>
 * ```
 */

function DrawerContainer(props: DrawerContainerProps) {
	const {
		isVisible,
		makeInvisible,
		orientation = "left",
		children,
		className: baseClassName,
		...rest
	} = props;

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
		"arkynDrawerContainer",
		orientation,
		isExiting ? "exiting" : "",
		baseClassName,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<DrawerProvider makeInvisible={() => setIsExiting(true)}>
			<aside className={className} {...rest}>
				<div
					className="arkynDrawerContainerOverlay"
					onClick={() => setIsExiting(true)}
					onAnimationEnd={handleOverlayAnimationEnd}
				/>
				<div className="arkynDrawerContainerContent">{children}</div>
			</aside>
		</DrawerProvider>
	);
}

export { DrawerContainer };
