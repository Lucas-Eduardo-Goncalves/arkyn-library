import { X } from "lucide-react";
import { HTMLAttributes } from "react";

import { useModal } from "../modalContext";
import "./styles.css";

type ModalHeaderProps = HTMLAttributes<HTMLElement> & {
  /** Whether to render the X close button. @default true */
  showCloseButton?: boolean;
};

/**
 * ModalHeader — header section for a `ModalContainer`, with an optional close button.
 *
 * The close button calls `makeInvisible` from the nearest `ModalContainer` context.
 * Must be rendered inside a `ModalContainer`.
 *
 * @param props.showCloseButton - Renders the X close button. Default: true
 *
 * **...Other valid HTML `<header>` properties**
 *
 * @returns ModalHeader JSX element.
 *
 * @example
 * ```tsx
 * <ModalContainer isVisible={isOpen} makeInvisible={() => setIsOpen(false)}>
 *   <ModalHeader>
 *     <h2>Edit profile</h2>
 *   </ModalHeader>
 *   <main>...</main>
 *   <ModalFooter><Button onClick={onSave}>Save</Button></ModalFooter>
 * </ModalContainer>
 * ```
 */

function ModalHeader(args: ModalHeaderProps) {
  const {
    showCloseButton = true,
    className: baseClassName,
    children,
    ...rest
  } = args;

  const { makeInvisible } = useModal();
  const className = `arkynModalHeader ${baseClassName}`;

  return (
    <header className={className.trim()} {...rest}>
      {children}

      {showCloseButton && (
        <button
          type="button"
          onClick={makeInvisible}
          aria-label="Close modal button"
          className="arkynModalHeaderCloseButton"
        >
          <X size={24} />
        </button>
      )}
    </header>
  );
}

export { ModalHeader };
