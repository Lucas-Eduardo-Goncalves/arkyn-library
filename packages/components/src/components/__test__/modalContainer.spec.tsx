import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ModalContainer } from "../modal/modalContainer";

/**
 * jsdom exposes `WebkitAnimation` (but not the unprefixed `animation`) on
 * CSSStyleDeclaration, so React's animation-event plugin resolves the
 * onAnimationEnd DOM listener to the prefixed `webkitAnimationEnd` name.
 * `fireEvent.animationEnd` dispatches an unprefixed `animationend`, which
 * never reaches that listener, so we dispatch the prefixed event directly.
 */
function fireAnimationEnd(element: HTMLElement) {
	fireEvent(element, new Event("webkitAnimationEnd", { bubbles: true }));
}

describe("ModalContainer", () => {
	afterEach(() => {
		cleanup();
	});

	it("should render without errors", () => {
		render(
			<ModalContainer isVisible makeInvisible={vi.fn()}>
				Content
			</ModalContainer>,
		);

		expect(screen.getByText("Content")).toBeInTheDocument();
	});

	it("should render children", () => {
		render(
			<ModalContainer isVisible makeInvisible={vi.fn()}>
				<p>Modal body text</p>
			</ModalContainer>,
		);

		expect(screen.getByText("Modal body text")).toBeInTheDocument();
	});

	it("should render multiple children elements", () => {
		render(
			<ModalContainer isVisible makeInvisible={vi.fn()}>
				<h2>Title</h2>
				<p>Description</p>
			</ModalContainer>,
		);

		expect(screen.getByText("Title")).toBeInTheDocument();
		expect(screen.getByText("Description")).toBeInTheDocument();
	});

	it("should render nothing when isVisible is false and it was never mounted", () => {
		const { container } = render(
			<ModalContainer isVisible={false} makeInvisible={vi.fn()}>
				Content
			</ModalContainer>,
		);

		expect(container).toBeEmptyDOMElement();
	});

	it("should render as an aside element", () => {
		const { container } = render(
			<ModalContainer isVisible makeInvisible={vi.fn()}>
				Content
			</ModalContainer>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element.tagName).toBe("ASIDE");
	});

	it("should render an overlay and a content wrapper", () => {
		const { container } = render(
			<ModalContainer isVisible makeInvisible={vi.fn()}>
				Content
			</ModalContainer>,
		);

		expect(
			container.querySelector(".arkynModalContainerOverlay"),
		).toBeInTheDocument();
		expect(
			container.querySelector(".arkynModalContainerContent"),
		).toBeInTheDocument();
	});

	it("should place children inside the content wrapper", () => {
		const { container } = render(
			<ModalContainer isVisible makeInvisible={vi.fn()}>
				<p>Nested content</p>
			</ModalContainer>,
		);

		const contentWrapper = container.querySelector(
			".arkynModalContainerContent",
		) as HTMLElement;
		expect(contentWrapper).toContainElement(screen.getByText("Nested content"));
	});

	describe("isVisible prop lifecycle", () => {
		it("should mount when isVisible starts as true", () => {
			const { container } = render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					Content
				</ModalContainer>,
			);

			expect(
				container.querySelector(".arkynModalContainer"),
			).toBeInTheDocument();
		});

		it("should not render when isVisible starts as false", () => {
			const { container } = render(
				<ModalContainer isVisible={false} makeInvisible={vi.fn()}>
					Content
				</ModalContainer>,
			);

			expect(
				container.querySelector(".arkynModalContainer"),
			).not.toBeInTheDocument();
		});

		it("should mount when isVisible changes from false to true", () => {
			const { container, rerender } = render(
				<ModalContainer isVisible={false} makeInvisible={vi.fn()}>
					Content
				</ModalContainer>,
			);

			expect(
				container.querySelector(".arkynModalContainer"),
			).not.toBeInTheDocument();

			rerender(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					Content
				</ModalContainer>,
			);

			expect(
				container.querySelector(".arkynModalContainer"),
			).toBeInTheDocument();
		});

		it("should add the exiting class immediately when isVisible changes from true to false", () => {
			const { container, rerender } = render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					Content
				</ModalContainer>,
			);

			rerender(
				<ModalContainer isVisible={false} makeInvisible={vi.fn()}>
					Content
				</ModalContainer>,
			);

			const element = container.querySelector(
				".arkynModalContainer",
			) as HTMLElement;
			expect(element).toHaveClass("exiting");
		});

		it("should still be present in the DOM right after isVisible becomes false (before animation ends)", () => {
			const { container, rerender } = render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					Content
				</ModalContainer>,
			);

			rerender(
				<ModalContainer isVisible={false} makeInvisible={vi.fn()}>
					Content
				</ModalContainer>,
			);

			expect(
				container.querySelector(".arkynModalContainer"),
			).toBeInTheDocument();
		});

		it("should unmount and call makeInvisible after the overlay exit animation ends", () => {
			const makeInvisible = vi.fn();
			const { container, rerender } = render(
				<ModalContainer isVisible makeInvisible={makeInvisible}>
					Content
				</ModalContainer>,
			);

			rerender(
				<ModalContainer isVisible={false} makeInvisible={makeInvisible}>
					Content
				</ModalContainer>,
			);

			const overlay = container.querySelector(
				".arkynModalContainerOverlay",
			) as HTMLElement;

			fireAnimationEnd(overlay);

			expect(makeInvisible).toHaveBeenCalledTimes(1);
			expect(
				container.querySelector(".arkynModalContainer"),
			).not.toBeInTheDocument();
		});

		it("should not call makeInvisible from an animationEnd dispatched on a descendant of the overlay", () => {
			const makeInvisible = vi.fn();
			const { container, rerender } = render(
				<ModalContainer isVisible makeInvisible={makeInvisible}>
					<p>Content</p>
				</ModalContainer>,
			);

			rerender(
				<ModalContainer isVisible={false} makeInvisible={makeInvisible}>
					<p>Content</p>
				</ModalContainer>,
			);

			const contentWrapper = container.querySelector(
				".arkynModalContainerContent",
			) as HTMLElement;

			fireAnimationEnd(contentWrapper);

			expect(makeInvisible).not.toHaveBeenCalled();
			expect(
				container.querySelector(".arkynModalContainer"),
			).toBeInTheDocument();
		});

		it("should not unmount when animationEnd fires but isExiting is false", () => {
			const makeInvisible = vi.fn();
			const { container } = render(
				<ModalContainer isVisible makeInvisible={makeInvisible}>
					Content
				</ModalContainer>,
			);

			const overlay = container.querySelector(
				".arkynModalContainerOverlay",
			) as HTMLElement;

			fireAnimationEnd(overlay);

			expect(makeInvisible).not.toHaveBeenCalled();
			expect(
				container.querySelector(".arkynModalContainer"),
			).toBeInTheDocument();
		});

		it("should remount with fresh state when isVisible becomes true again after a full close", () => {
			const makeInvisible = vi.fn();
			const { container, rerender } = render(
				<ModalContainer isVisible makeInvisible={makeInvisible}>
					Content
				</ModalContainer>,
			);

			rerender(
				<ModalContainer isVisible={false} makeInvisible={makeInvisible}>
					Content
				</ModalContainer>,
			);

			const overlay = container.querySelector(
				".arkynModalContainerOverlay",
			) as HTMLElement;
			fireAnimationEnd(overlay);

			expect(
				container.querySelector(".arkynModalContainer"),
			).not.toBeInTheDocument();

			rerender(
				<ModalContainer isVisible makeInvisible={makeInvisible}>
					Content
				</ModalContainer>,
			);

			const element = container.querySelector(
				".arkynModalContainer",
			) as HTMLElement;
			expect(element).toBeInTheDocument();
			expect(element).not.toHaveClass("exiting");
		});
	});

	describe("overlay click", () => {
		it("should start the exit transition when the overlay is clicked", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					Content
				</ModalContainer>,
			);

			const overlay = container.querySelector(
				".arkynModalContainerOverlay",
			) as HTMLElement;

			await user.click(overlay);

			expect(overlay).toHaveClass("arkynModalContainerOverlay");
			const element = container.querySelector(
				".arkynModalContainer",
			) as HTMLElement;
			expect(element).toHaveClass("exiting");
		});

		it("should call makeInvisible only after the animation ends following an overlay click", async () => {
			const makeInvisible = vi.fn();
			const user = userEvent.setup();
			const { container } = render(
				<ModalContainer isVisible makeInvisible={makeInvisible}>
					Content
				</ModalContainer>,
			);

			const overlay = container.querySelector(
				".arkynModalContainerOverlay",
			) as HTMLElement;

			await user.click(overlay);
			expect(makeInvisible).not.toHaveBeenCalled();

			fireAnimationEnd(overlay);
			expect(makeInvisible).toHaveBeenCalledTimes(1);
		});

		it("should not call makeInvisible directly on click (only through animation end)", async () => {
			const makeInvisible = vi.fn();
			const user = userEvent.setup();
			const { container } = render(
				<ModalContainer isVisible makeInvisible={makeInvisible}>
					Content
				</ModalContainer>,
			);

			const overlay = container.querySelector(
				".arkynModalContainerOverlay",
			) as HTMLElement;

			await user.click(overlay);

			expect(makeInvisible).toHaveBeenCalledTimes(0);
		});
	});

	describe("useScrollLock side effect", () => {
		it("should lock body scroll while visible", () => {
			render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					Content
				</ModalContainer>,
			);

			expect(document.body.style.overflow).toBe("hidden");
		});

		it("should restore body overflow after becoming invisible", () => {
			const originalOverflow = document.body.style.overflow;
			const { rerender } = render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					Content
				</ModalContainer>,
			);

			expect(document.body.style.overflow).toBe("hidden");

			rerender(
				<ModalContainer isVisible={false} makeInvisible={vi.fn()}>
					Content
				</ModalContainer>,
			);

			expect(document.body.style.overflow).toBe(originalOverflow);
		});

		it("should not lock body scroll when isVisible is false from the start", () => {
			render(
				<ModalContainer isVisible={false} makeInvisible={vi.fn()}>
					Content
				</ModalContainer>,
			);

			expect(document.body.style.overflow).not.toBe("hidden");
		});
	});

	describe("className", () => {
		it("should preserve the base className", () => {
			const { container } = render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					Content
				</ModalContainer>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynModalContainer");
		});

		it("should merge an external className with the base className", () => {
			const { container } = render(
				<ModalContainer
					isVisible
					makeInvisible={vi.fn()}
					className="custom-class"
				>
					Content
				</ModalContainer>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynModalContainer");
			expect(element).toHaveClass("custom-class");
		});

		it("should still render the base class when className is omitted", () => {
			const { container } = render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					Content
				</ModalContainer>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynModalContainer");
		});

		it("should handle an empty className string without duplicating whitespace", () => {
			const { container } = render(
				<ModalContainer isVisible makeInvisible={vi.fn()} className="">
					Content
				</ModalContainer>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynModalContainer");
			expect(element.className.trim()).toBe(element.className);
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the root element", () => {
			render(
				<ModalContainer
					isVisible
					makeInvisible={vi.fn()}
					data-testid="modal-root"
					aria-label="Confirm dialog"
				>
					Content
				</ModalContainer>,
			);

			const element = screen.getByTestId("modal-root");
			expect(element).toHaveAttribute("aria-label", "Confirm dialog");
		});

		it("should forward id attribute", () => {
			render(
				<ModalContainer isVisible makeInvisible={vi.fn()} id="modal-id">
					Content
				</ModalContainer>,
			);

			expect(document.getElementById("modal-id")).toBeInTheDocument();
		});
	});

	describe("edge cases", () => {
		it("should handle null children without throwing", () => {
			const { container } = render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					{null}
				</ModalContainer>,
			);

			expect(
				container.querySelector(".arkynModalContainer"),
			).toBeInTheDocument();
		});

		it("should handle undefined children without throwing", () => {
			const { container } = render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					{undefined}
				</ModalContainer>,
			);

			expect(
				container.querySelector(".arkynModalContainer"),
			).toBeInTheDocument();
		});
	});

	describe("accessibility", () => {
		it("should render role=dialog and aria-modal on the content wrapper while open", () => {
			const { container } = render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					Content
				</ModalContainer>,
			);

			const content = container.querySelector(
				".arkynModalContainerContent",
			) as HTMLElement;

			expect(content).toHaveAttribute("role", "dialog");
			expect(content).toHaveAttribute("aria-modal", "true");
		});

		it("should move focus into the content wrapper when opened", () => {
			const { container } = render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					<button type="button">Inside</button>
				</ModalContainer>,
			);

			const content = container.querySelector(
				".arkynModalContainerContent",
			) as HTMLElement;

			expect(content).toContainElement(document.activeElement as HTMLElement);
		});

		it("should focus the content wrapper itself when it has no focusable children", () => {
			const { container } = render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					Plain text
				</ModalContainer>,
			);

			const content = container.querySelector(
				".arkynModalContainerContent",
			) as HTMLElement;

			expect(content).toHaveFocus();
		});

		it("should start the exit transition when Escape is pressed", () => {
			const { container } = render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					Content
				</ModalContainer>,
			);

			fireEvent.keyDown(document, { key: "Escape" });

			const element = container.querySelector(
				".arkynModalContainer",
			) as HTMLElement;
			expect(element).toHaveClass("exiting");
		});

		it("should call makeInvisible once the Escape-triggered exit animation ends", () => {
			const makeInvisible = vi.fn();
			const { container } = render(
				<ModalContainer isVisible makeInvisible={makeInvisible}>
					Content
				</ModalContainer>,
			);

			fireEvent.keyDown(document, { key: "Escape" });

			const overlay = container.querySelector(
				".arkynModalContainerOverlay",
			) as HTMLElement;
			fireAnimationEnd(overlay);

			expect(makeInvisible).toHaveBeenCalledTimes(1);
		});

		it("should not react to Escape once the modal is not visible", () => {
			const { container, rerender } = render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					Content
				</ModalContainer>,
			);

			rerender(
				<ModalContainer isVisible={false} makeInvisible={vi.fn()}>
					Content
				</ModalContainer>,
			);

			const element = container.querySelector(
				".arkynModalContainer",
			) as HTMLElement;
			// Pressing Escape after the container already started exiting via the
			// isVisible prop should not throw or double up the "exiting" class.
			fireEvent.keyDown(document, { key: "Escape" });
			expect(element).toHaveClass("exiting");
		});

		it("should trap Tab so it wraps from the last focusable element to the first", async () => {
			const user = userEvent.setup();
			render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					<button type="button">First</button>
					<button type="button">Last</button>
				</ModalContainer>,
			);

			const first = screen.getByRole("button", { name: "First" });
			const last = screen.getByRole("button", { name: "Last" });

			expect(first).toHaveFocus();

			last.focus();
			await user.tab();

			expect(first).toHaveFocus();
		});

		it("should trap Shift+Tab so it wraps from the first focusable element to the last", async () => {
			const user = userEvent.setup();
			render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					<button type="button">First</button>
					<button type="button">Last</button>
				</ModalContainer>,
			);

			const first = screen.getByRole("button", { name: "First" });
			const last = screen.getByRole("button", { name: "Last" });

			expect(first).toHaveFocus();

			await user.tab({ shift: true });

			expect(last).toHaveFocus();
		});

		it("should return focus to the trigger element after the modal fully closes", async () => {
			const user = userEvent.setup();

			function Wrapper() {
				const [isOpen, setIsOpen] = useState(false);

				return (
					<>
						<button type="button" onClick={() => setIsOpen(true)}>
							Open modal
						</button>
						<ModalContainer
							isVisible={isOpen}
							makeInvisible={() => setIsOpen(false)}
						>
							<button type="button">Inside</button>
						</ModalContainer>
					</>
				);
			}

			const { container } = render(<Wrapper />);
			const trigger = screen.getByRole("button", { name: "Open modal" });

			await user.click(trigger);
			// The container mounts one render after `isVisible` flips (an internal
			// `mounted` state toggle), so focus moves into the dialog on the
			// following effect flush rather than synchronously with the click.
			await waitFor(() => expect(trigger).not.toHaveFocus());

			const overlay = container.querySelector(
				".arkynModalContainerOverlay",
			) as HTMLElement;
			await user.click(overlay);
			fireAnimationEnd(overlay);

			expect(trigger).toHaveFocus();
		});
	});
});
