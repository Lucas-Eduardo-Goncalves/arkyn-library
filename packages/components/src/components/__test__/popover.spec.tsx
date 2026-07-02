import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { Popover } from "../popover";

describe("Popover", () => {
	afterEach(() => {
		cleanup();
	});

	it("should render without errors", () => {
		render(
			<Popover button={<button type="button">Open</button>}>Content</Popover>,
		);

		expect(screen.getByText("Open")).toBeInTheDocument();
	});

	it("should render the trigger button", () => {
		render(
			<Popover button={<button type="button">Trigger</button>}>
				Content
			</Popover>,
		);

		expect(screen.getByRole("button", { name: "Trigger" })).toBeInTheDocument();
	});

	it("should render string children", () => {
		render(
			<Popover button={<button type="button">Open</button>}>
				Plain text content
			</Popover>,
		);

		expect(screen.getByText("Plain text content")).toBeInTheDocument();
	});

	it("should render JSX children", () => {
		render(
			<Popover button={<button type="button">Open</button>}>
				<p>JSX content</p>
			</Popover>,
		);

		expect(screen.getByText("JSX content")).toBeInTheDocument();
	});

	it("should render multiple children elements", () => {
		render(
			<Popover button={<button type="button">Open</button>}>
				<h2>Title</h2>
				<p>Description</p>
			</Popover>,
		);

		expect(screen.getByText("Title")).toBeInTheDocument();
		expect(screen.getByText("Description")).toBeInTheDocument();
	});

	it("should render when all optional props are omitted", () => {
		const { container } = render(
			<Popover button={<button type="button">Open</button>}>Content</Popover>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("arkynPopover");
		expect(element).toHaveClass("bottomLeft");
		expect(element).toHaveClass("visibleFalse");
	});

	it("should render with all props filled", () => {
		const { container } = render(
			<Popover
				button={<button type="button">Open</button>}
				closeOnClick
				orientation="topRight"
				className="custom-class"
			>
				Content
			</Popover>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("arkynPopover");
		expect(element).toHaveClass("topRight");
		expect(element).toHaveClass("custom-class");
	});

	describe("open/close behavior", () => {
		it("should start closed by default", () => {
			const { container } = render(
				<Popover button={<button type="button">Open</button>}>Content</Popover>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("visibleFalse");
			expect(
				container.querySelector(".arkynPopoverOverlay"),
			).not.toBeInTheDocument();
		});

		it("should open the panel and render its children when the trigger is clicked", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Popover button={<button type="button">Open</button>}>
					<p>Panel content</p>
				</Popover>,
			);

			await user.click(screen.getByRole("button", { name: "Open" }));

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("visibleTrue");
			expect(screen.getByText("Panel content")).toBeInTheDocument();
			const content = container.querySelector(
				".arkynPopoverContent",
			) as HTMLElement;
			expect(content).toContainElement(screen.getByText("Panel content"));
		});

		it("should render an overlay only while open", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Popover button={<button type="button">Open</button>}>Content</Popover>,
			);

			expect(
				container.querySelector(".arkynPopoverOverlay"),
			).not.toBeInTheDocument();

			await user.click(screen.getByRole("button", { name: "Open" }));

			expect(
				container.querySelector(".arkynPopoverOverlay"),
			).toBeInTheDocument();
		});

		it("should remain open when the trigger is clicked again", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Popover button={<button type="button">Open</button>}>Content</Popover>,
			);

			await user.click(screen.getByRole("button", { name: "Open" }));
			await user.click(screen.getByRole("button", { name: "Open" }));

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("visibleTrue");
		});

		it("should close when clicking outside via the overlay", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Popover button={<button type="button">Open</button>}>Content</Popover>,
			);

			await user.click(screen.getByRole("button", { name: "Open" }));
			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("visibleTrue");

			const overlay = container.querySelector(
				".arkynPopoverOverlay",
			) as HTMLElement;
			await user.click(overlay);

			expect(element).toHaveClass("visibleFalse");
			expect(
				container.querySelector(".arkynPopoverOverlay"),
			).not.toBeInTheDocument();
		});

		it("should set the panel visibility style to hidden when closed and visible when open", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Popover button={<button type="button">Open</button>}>Content</Popover>,
			);

			const content = container.querySelector(
				".arkynPopoverContent",
			) as HTMLElement;
			expect(content).toHaveStyle({ visibility: "hidden" });

			await user.click(screen.getByRole("button", { name: "Open" }));

			expect(content).toHaveStyle({ visibility: "visible" });
		});
	});

	describe("closeOnClick prop", () => {
		it("should not close on content click by default (closeOnClick omitted)", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Popover button={<button type="button">Open</button>}>
					<p>Panel content</p>
				</Popover>,
			);

			await user.click(screen.getByRole("button", { name: "Open" }));
			await user.click(screen.getByText("Panel content"));

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("visibleTrue");
		});

		it("should not close on content click when closeOnClick is false", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Popover
					button={<button type="button">Open</button>}
					closeOnClick={false}
				>
					<p>Panel content</p>
				</Popover>,
			);

			await user.click(screen.getByRole("button", { name: "Open" }));
			await user.click(screen.getByText("Panel content"));

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("visibleTrue");
		});

		it("should close on content click when closeOnClick is true", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Popover button={<button type="button">Open</button>} closeOnClick>
					<p>Panel content</p>
				</Popover>,
			);

			await user.click(screen.getByRole("button", { name: "Open" }));
			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("visibleTrue");

			await user.click(screen.getByText("Panel content"));

			expect(element).toHaveClass("visibleFalse");
		});
	});

	describe("orientation prop", () => {
		it("should default to bottomLeft when omitted", () => {
			const { container } = render(
				<Popover button={<button type="button">Open</button>}>Content</Popover>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("bottomLeft");
		});

		it.each([
			"bottomLeft",
			"bottomRight",
			"topLeft",
			"topRight",
			"top",
			"left",
			"bottom",
			"right",
		] as const)("should reflect orientation %s in the className", (orientation) => {
			const { container } = render(
				<Popover
					button={<button type="button">Open</button>}
					orientation={orientation}
				>
					Content
				</Popover>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass(orientation);
		});

		it("should not keep the old orientation class after switching orientation", () => {
			const { container, rerender } = render(
				<Popover
					button={<button type="button">Open</button>}
					orientation="topLeft"
				>
					Content
				</Popover>,
			);

			let element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("topLeft");

			rerender(
				<Popover
					button={<button type="button">Open</button>}
					orientation="bottomRight"
				>
					Content
				</Popover>,
			);

			element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("bottomRight");
			expect(element).not.toHaveClass("topLeft");
		});
	});

	describe("className", () => {
		it("should preserve the base className", () => {
			const { container } = render(
				<Popover button={<button type="button">Open</button>}>Content</Popover>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynPopover");
		});

		it("should merge an external className with the base className", () => {
			const { container } = render(
				<Popover
					button={<button type="button">Open</button>}
					className="custom-class"
				>
					Content
				</Popover>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynPopover");
			expect(element).toHaveClass("custom-class");
		});

		it("should still render the base class when className is omitted", () => {
			const { container } = render(
				<Popover button={<button type="button">Open</button>}>Content</Popover>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynPopover");
		});

		it("should handle an empty className string without duplicating whitespace unexpectedly", () => {
			const { container } = render(
				<Popover button={<button type="button">Open</button>} className="">
					Content
				</Popover>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynPopover");
		});
	});

	describe("useScrollLock side effect", () => {
		it("should not lock body scroll while closed", () => {
			render(
				<Popover button={<button type="button">Open</button>}>Content</Popover>,
			);

			expect(document.body.style.overflow).not.toBe("hidden");
		});

		it("should lock body scroll while open", async () => {
			const user = userEvent.setup();
			render(
				<Popover button={<button type="button">Open</button>}>Content</Popover>,
			);

			await user.click(screen.getByRole("button", { name: "Open" }));

			expect(document.body.style.overflow).toBe("hidden");
		});

		it("should restore body scroll after closing", async () => {
			const user = userEvent.setup();
			const originalOverflow = document.body.style.overflow;
			const { container } = render(
				<Popover button={<button type="button">Open</button>}>Content</Popover>,
			);

			await user.click(screen.getByRole("button", { name: "Open" }));
			expect(document.body.style.overflow).toBe("hidden");

			const overlay = container.querySelector(
				".arkynPopoverOverlay",
			) as HTMLElement;
			await user.click(overlay);

			expect(document.body.style.overflow).toBe(originalOverflow);
		});
	});

	describe("edge cases", () => {
		it("should handle null children without throwing", () => {
			const { container } = render(
				<Popover button={<button type="button">Open</button>}>{null}</Popover>,
			);

			expect(container.querySelector(".arkynPopover")).toBeInTheDocument();
		});

		it("should handle empty string children without throwing", () => {
			const { container } = render(
				<Popover button={<button type="button">Open</button>}>{""}</Popover>,
			);

			expect(container.querySelector(".arkynPopover")).toBeInTheDocument();
		});

		it("should render a complex button node as the trigger", () => {
			render(
				<Popover
					button={
						<button type="button">
							<span>Icon</span>
							<span>Label</span>
						</button>
					}
				>
					Content
				</Popover>,
			);

			expect(screen.getByText("Icon")).toBeInTheDocument();
			expect(screen.getByText("Label")).toBeInTheDocument();
		});
	});
});
