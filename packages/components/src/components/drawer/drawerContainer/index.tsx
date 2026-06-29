import { AnimatePresence, motion } from "framer-motion";
import type { HTMLAttributes } from "react";

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

	useScrollLock(isVisible);

	const translateX = orientation === "left" ? "-100%" : "100%";

	const visibleClass = isVisible ? "visibleTrue" : "visibleFalse";
	const className = `arkynDrawerContainer ${orientation} ${visibleClass} ${baseClassName}`;

	return (
		<DrawerProvider makeInvisible={makeInvisible}>
			<AnimatePresence>
				{isVisible && (
					<aside className={className.trim()} {...rest}>
						<motion.div
							className="arkynDrawerContainerOverlay"
							transition={{ duration: 0.15, ease: "easeOut" }}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={makeInvisible}
						/>

						<motion.div
							className="arkynDrawerContainerContent"
							transition={{ ease: "easeOut", duration: 0.15 }}
							initial={{ transform: `translateX(${translateX})` }}
							animate={{ transform: "translateX(0px)" }}
							exit={{ transform: `translateX(${translateX})` }}
						>
							{children}
						</motion.div>
					</aside>
				)}
			</AnimatePresence>
		</DrawerProvider>
	);
}

export { DrawerContainer };
