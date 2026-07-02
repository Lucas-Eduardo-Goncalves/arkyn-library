import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ModalContainer } from "../modal/modalContainer";
import { ModalHeader } from "../modal/modalHeader";

// ModalContainer only calls `makeInvisible` once its exit-animation
// finishes (`animationend` on the overlay). jsdom exposes `WebkitAnimation`
// (but not the unprefixed `animation`) on CSSStyleDeclaration, so React's
// animation-event plugin resolves the onAnimationEnd DOM listener to the
// prefixed `webkitAnimationEnd` name — same workaround as
// modalContainer.spec.tsx's `fireAnimationEnd` helper.
function settleExitAnimation(container: HTMLElement) {
	const overlay = container.querySelector(".arkynModalContainerOverlay");
	if (overlay) {
		fireEvent(overlay, new Event("webkitAnimationEnd", { bubbles: true }));
	}
}

describe("ModalHeader", () => {
	afterEach(() => {
		cleanup();
	});

	it("should render without errors inside a ModalContainer", () => {
		render(
			<ModalContainer isVisible makeInvisible={vi.fn()}>
				<ModalHeader>
					<h2>Confirm deletion</h2>
				</ModalHeader>
			</ModalContainer>,
		);

		expect(screen.getByText("Confirm deletion")).toBeInTheDocument();
	});

	it("should render string children", () => {
		render(
			<ModalContainer isVisible makeInvisible={vi.fn()}>
				<ModalHeader>Simple text</ModalHeader>
			</ModalContainer>,
		);

		expect(screen.getByText("Simple text")).toBeInTheDocument();
	});

	it("should render JSX children", () => {
		render(
			<ModalContainer isVisible makeInvisible={vi.fn()}>
				<ModalHeader>
					<span>JSX child</span>
				</ModalHeader>
			</ModalContainer>,
		);

		expect(screen.getByText("JSX child")).toBeInTheDocument();
	});

	it("should render multiple children elements", () => {
		render(
			<ModalContainer isVisible makeInvisible={vi.fn()}>
				<ModalHeader>
					<h2>Title</h2>
					<p>Subtitle</p>
				</ModalHeader>
			</ModalContainer>,
		);

		expect(screen.getByText("Title")).toBeInTheDocument();
		expect(screen.getByText("Subtitle")).toBeInTheDocument();
	});

	it("should render without children", () => {
		const { container } = render(
			<ModalContainer isVisible makeInvisible={vi.fn()}>
				<ModalHeader />
			</ModalContainer>,
		);

		expect(container.querySelector(".arkynModalHeader")).toBeInTheDocument();
	});

	it("should render as a header element", () => {
		const { container } = render(
			<ModalContainer isVisible makeInvisible={vi.fn()}>
				<ModalHeader>Title</ModalHeader>
			</ModalContainer>,
		);

		const element = container.querySelector(".arkynModalHeader") as HTMLElement;
		expect(element.tagName).toBe("HEADER");
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(
			<ModalContainer isVisible makeInvisible={vi.fn()}>
				<ModalHeader>Title</ModalHeader>
			</ModalContainer>,
		);

		const element = container.querySelector(".arkynModalHeader") as HTMLElement;
		expect(element).toHaveClass("arkynModalHeader");
		expect(
			screen.getByRole("button", { name: "Close modal button" }),
		).toBeInTheDocument();
	});

	it("should render correctly with all properties filled", () => {
		render(
			<ModalContainer isVisible makeInvisible={vi.fn()}>
				<ModalHeader showCloseButton={false} className="custom-class">
					Title
				</ModalHeader>
			</ModalContainer>,
		);

		expect(screen.getByText("Title")).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: "Close modal button" }),
		).not.toBeInTheDocument();
	});

	describe("showCloseButton prop", () => {
		it("should render the close button by default when omitted", () => {
			render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					<ModalHeader>Title</ModalHeader>
				</ModalContainer>,
			);

			expect(
				screen.getByRole("button", { name: "Close modal button" }),
			).toBeInTheDocument();
		});

		it("should render the close button when explicitly true", () => {
			render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					<ModalHeader showCloseButton>Title</ModalHeader>
				</ModalContainer>,
			);

			expect(
				screen.getByRole("button", { name: "Close modal button" }),
			).toBeInTheDocument();
		});

		it("should not render the close button when false", () => {
			render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					<ModalHeader showCloseButton={false}>Title</ModalHeader>
				</ModalContainer>,
			);

			expect(
				screen.queryByRole("button", { name: "Close modal button" }),
			).not.toBeInTheDocument();
		});

		it("should toggle the close button when the prop changes", () => {
			const { rerender } = render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					<ModalHeader showCloseButton>Title</ModalHeader>
				</ModalContainer>,
			);

			expect(
				screen.getByRole("button", { name: "Close modal button" }),
			).toBeInTheDocument();

			rerender(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					<ModalHeader showCloseButton={false}>Title</ModalHeader>
				</ModalContainer>,
			);

			expect(
				screen.queryByRole("button", { name: "Close modal button" }),
			).not.toBeInTheDocument();
		});
	});

	describe("close button click", () => {
		it("should call makeInvisible from context when clicked", async () => {
			const makeInvisible = vi.fn();
			const user = userEvent.setup();
			const { container } = render(
				<ModalContainer isVisible makeInvisible={makeInvisible}>
					<ModalHeader>Title</ModalHeader>
				</ModalContainer>,
			);

			await user.click(
				screen.getByRole("button", { name: "Close modal button" }),
			);
			settleExitAnimation(container);

			expect(makeInvisible).toHaveBeenCalledTimes(1);
		});

		it("should call makeInvisible only once per click", async () => {
			const makeInvisible = vi.fn();
			const user = userEvent.setup();
			const { container } = render(
				<ModalContainer isVisible makeInvisible={makeInvisible}>
					<ModalHeader>Title</ModalHeader>
				</ModalContainer>,
			);

			await user.click(
				screen.getByRole("button", { name: "Close modal button" }),
			);
			settleExitAnimation(container);
			// The mock `makeInvisible` never flips `isVisible` to false, so
			// ModalContainer's effect remounts itself — query again for the
			// fresh close button instance instead of reusing the detached one.
			await user.click(
				screen.getByRole("button", { name: "Close modal button" }),
			);
			settleExitAnimation(container);

			expect(makeInvisible).toHaveBeenCalledTimes(2);
		});

		it("should not call makeInvisible when the close button is not clicked", () => {
			const makeInvisible = vi.fn();
			render(
				<ModalContainer isVisible makeInvisible={makeInvisible}>
					<ModalHeader>Title</ModalHeader>
				</ModalContainer>,
			);

			expect(makeInvisible).not.toHaveBeenCalled();
		});

		it("should trigger the ModalContainer exit transition when clicked", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					<ModalHeader>Title</ModalHeader>
				</ModalContainer>,
			);

			await user.click(
				screen.getByRole("button", { name: "Close modal button" }),
			);

			const element = container.querySelector(
				".arkynModalContainer",
			) as HTMLElement;
			expect(element).toHaveClass("exiting");
		});
	});

	describe("accessibility", () => {
		it("should have an accessible aria-label on the close button", () => {
			render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					<ModalHeader>Title</ModalHeader>
				</ModalContainer>,
			);

			const closeButton = screen.getByRole("button", {
				name: "Close modal button",
			});
			expect(closeButton).toHaveAttribute("aria-label", "Close modal button");
		});

		it("should render the close button with a type of button", () => {
			render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					<ModalHeader>Title</ModalHeader>
				</ModalContainer>,
			);

			const closeButton = screen.getByRole("button", {
				name: "Close modal button",
			});
			expect(closeButton).toHaveAttribute("type", "button");
		});

		it("should be reachable via keyboard and activatable with Enter", async () => {
			const makeInvisible = vi.fn();
			const user = userEvent.setup();
			const { container } = render(
				<ModalContainer isVisible makeInvisible={makeInvisible}>
					<ModalHeader>Title</ModalHeader>
				</ModalContainer>,
			);

			const closeButton = screen.getByRole("button", {
				name: "Close modal button",
			});
			closeButton.focus();
			expect(closeButton).toHaveFocus();

			await user.keyboard("{Enter}");
			settleExitAnimation(container);

			expect(makeInvisible).toHaveBeenCalledTimes(1);
		});

		it("should render an svg icon inside the close button", () => {
			render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					<ModalHeader>Title</ModalHeader>
				</ModalContainer>,
			);

			const closeButton = screen.getByRole("button", {
				name: "Close modal button",
			});
			expect(closeButton.querySelector("svg")).toBeInTheDocument();
		});
	});

	describe("className merge", () => {
		it("should preserve the base className", () => {
			const { container } = render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					<ModalHeader>Title</ModalHeader>
				</ModalContainer>,
			);

			const element = container.querySelector(
				".arkynModalHeader",
			) as HTMLElement;
			expect(element).toHaveClass("arkynModalHeader");
		});

		it("should merge an external className with the base className", () => {
			const { container } = render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					<ModalHeader className="custom-class">Title</ModalHeader>
				</ModalContainer>,
			);

			const element = container.querySelector(
				".arkynModalHeader",
			) as HTMLElement;
			expect(element).toHaveClass("arkynModalHeader");
			expect(element).toHaveClass("custom-class");
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the header element", () => {
			render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					<ModalHeader data-testid="modal-header" aria-label="Header region">
						Title
					</ModalHeader>
				</ModalContainer>,
			);

			const element = screen.getByTestId("modal-header");
			expect(element).toHaveAttribute("aria-label", "Header region");
		});

		it("should forward id attribute", () => {
			render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					<ModalHeader id="header-id">Title</ModalHeader>
				</ModalContainer>,
			);

			expect(document.getElementById("header-id")).toBeInTheDocument();
		});
	});

	describe("edge cases", () => {
		it("should handle null children without throwing", () => {
			const { container } = render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					<ModalHeader>{null}</ModalHeader>
				</ModalContainer>,
			);

			expect(container.querySelector(".arkynModalHeader")).toBeInTheDocument();
		});

		it("should handle undefined children without throwing", () => {
			const { container } = render(
				<ModalContainer isVisible makeInvisible={vi.fn()}>
					<ModalHeader>{undefined}</ModalHeader>
				</ModalContainer>,
			);

			expect(container.querySelector(".arkynModalHeader")).toBeInTheDocument();
		});
	});
});
