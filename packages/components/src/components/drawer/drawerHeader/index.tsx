import { X } from "lucide-react";
import type { HTMLAttributes } from "react";

import { useDrawer } from "../drawerContext";
import "./styles.css";

type DrawerHeaderProps = HTMLAttributes<HTMLElement> & {
	/** Whether to render the X close button. @default true */
	showCloseButton?: boolean;
};

/**
 * DrawerHeader — header section for a `DrawerContainer`, with an optional close button.
 *
 * The close button calls `makeInvisible` from the nearest `DrawerContainer` context.
 * Must be rendered inside a `DrawerContainer`.
 *
 * @param props.showCloseButton - Renders the X close button. Default: true
 *
 * **...Other valid HTML `<header>` properties**
 *
 * @returns DrawerHeader JSX element.
 *
 * @example
 * ```tsx
 * <DrawerContainer isVisible={isOpen} makeInvisible={() => setIsOpen(false)}>
 *   <DrawerHeader>
 *     <h2>Navigation</h2>
 *   </DrawerHeader>
 *   <nav>...</nav>
 * </DrawerContainer>
 * ```
 */

function DrawerHeader(props: DrawerHeaderProps) {
	const {
		showCloseButton = true,
		className: baseClassName,
		children,
		...rest
	} = props;

	const { makeInvisible } = useDrawer();
	const className = `arkynDrawerHeader ${baseClassName}`;

	return (
		<header className={className.trim()} {...rest}>
			{children}

			{showCloseButton && (
				<button
					className="arkynDrawerHeaderCloseButton"
					type="button"
					onClick={makeInvisible}
					aria-label="Close drawer"
				>
					<X size={24} />
				</button>
			)}
		</header>
	);
}

export { DrawerHeader };
