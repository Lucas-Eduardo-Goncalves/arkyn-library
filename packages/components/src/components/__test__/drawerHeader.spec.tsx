import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DrawerContainer } from "../drawer/drawerContainer";
import { DrawerHeader } from "../drawer/drawerHeader";

afterEach(() => {
	cleanup();
});

describe("DrawerHeader", () => {
	it("should render without errors", () => {
		render(
			<DrawerContainer isVisible makeInvisible={() => {}}>
				<DrawerHeader>Navigation</DrawerHeader>
			</DrawerContainer>,
		);

		expect(screen.getByText("Navigation")).toBeInTheDocument();
	});

	it("should render string children", () => {
		render(
			<DrawerContainer isVisible makeInvisible={() => {}}>
				<DrawerHeader>Simple text</DrawerHeader>
			</DrawerContainer>,
		);

		expect(screen.getByText("Simple text")).toBeInTheDocument();
	});

	it("should render JSX children", () => {
		render(
			<DrawerContainer isVisible makeInvisible={() => {}}>
				<DrawerHeader>
					<h2>Navigation title</h2>
				</DrawerHeader>
			</DrawerContainer>,
		);

		expect(
			screen.getByRole("heading", { name: "Navigation title" }),
		).toBeInTheDocument();
	});

	it("should render multiple children", () => {
		render(
			<DrawerContainer isVisible makeInvisible={() => {}}>
				<DrawerHeader>
					<span>First</span>
					<span>Second</span>
				</DrawerHeader>
			</DrawerContainer>,
		);

		expect(screen.getByText("First")).toBeInTheDocument();
		expect(screen.getByText("Second")).toBeInTheDocument();
	});

	it("should render without children", () => {
		const { container } = render(
			<DrawerContainer isVisible makeInvisible={() => {}}>
				<DrawerHeader />
			</DrawerContainer>,
		);

		expect(container.querySelector(".arkynDrawerHeader")).toBeInTheDocument();
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(
			<DrawerContainer isVisible makeInvisible={() => {}}>
				<DrawerHeader>Content</DrawerHeader>
			</DrawerContainer>,
		);

		const element = container.querySelector(
			".arkynDrawerHeader",
		) as HTMLElement;
		expect(element).toBeInTheDocument();
		expect(
			container.querySelector(".arkynDrawerHeaderCloseButton"),
		).toBeInTheDocument();
	});

	it("should render correctly with all properties filled", () => {
		const { container } = render(
			<DrawerContainer isVisible makeInvisible={() => {}}>
				<DrawerHeader
					showCloseButton={false}
					className="custom-class"
					id="header-id"
				>
					Content
				</DrawerHeader>
			</DrawerContainer>,
		);

		const element = container.querySelector(
			".arkynDrawerHeader",
		) as HTMLElement;
		expect(element).toHaveClass("arkynDrawerHeader", "custom-class");
		expect(element).toHaveAttribute("id", "header-id");
		expect(
			container.querySelector(".arkynDrawerHeaderCloseButton"),
		).not.toBeInTheDocument();
	});

	it("should render as a header element", () => {
		const { container } = render(
			<DrawerContainer isVisible makeInvisible={() => {}}>
				<DrawerHeader>Content</DrawerHeader>
			</DrawerContainer>,
		);

		const element = container.querySelector(".arkynDrawerHeader");
		expect(element?.tagName).toBe("HEADER");
	});

	describe("showCloseButton prop", () => {
		it("should render the close button by default when omitted", () => {
			render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					<DrawerHeader>Content</DrawerHeader>
				</DrawerContainer>,
			);

			expect(
				screen.getByRole("button", { name: "Close drawer" }),
			).toBeInTheDocument();
		});

		it("should render the close button when explicitly true", () => {
			render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					<DrawerHeader showCloseButton>Content</DrawerHeader>
				</DrawerContainer>,
			);

			expect(
				screen.getByRole("button", { name: "Close drawer" }),
			).toBeInTheDocument();
		});

		it("should not render the close button when false", () => {
			render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					<DrawerHeader showCloseButton={false}>Content</DrawerHeader>
				</DrawerContainer>,
			);

			expect(
				screen.queryByRole("button", { name: "Close drawer" }),
			).not.toBeInTheDocument();
		});

		it("should toggle the close button when the prop changes", () => {
			const { rerender } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					<DrawerHeader showCloseButton>Content</DrawerHeader>
				</DrawerContainer>,
			);

			expect(
				screen.getByRole("button", { name: "Close drawer" }),
			).toBeInTheDocument();

			rerender(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					<DrawerHeader showCloseButton={false}>Content</DrawerHeader>
				</DrawerContainer>,
			);

			expect(
				screen.queryByRole("button", { name: "Close drawer" }),
			).not.toBeInTheDocument();
		});
	});

	describe("close button interaction", () => {
		it("should start the exit sequence when the close button is clicked", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					<DrawerHeader>Content</DrawerHeader>
				</DrawerContainer>,
			);

			const closeButton = screen.getByRole("button", { name: "Close drawer" });
			await user.click(closeButton);

			const aside = container.querySelector("aside") as HTMLElement;
			expect(aside).toHaveClass("exiting");
		});

		it("should call makeInvisible after the close button click completes the exit animation", async () => {
			const makeInvisible = vi.fn();
			const user = userEvent.setup();
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={makeInvisible}>
					<DrawerHeader>Content</DrawerHeader>
				</DrawerContainer>,
			);

			const closeButton = screen.getByRole("button", { name: "Close drawer" });
			await user.click(closeButton);

			expect(makeInvisible).not.toHaveBeenCalled();

			const overlay = container.querySelector(
				".arkynDrawerContainerOverlay",
			) as HTMLElement;
			overlay.dispatchEvent(
				new Event("webkitAnimationEnd", { bubbles: true, cancelable: true }),
			);

			expect(makeInvisible).toHaveBeenCalledTimes(1);
		});

		it("should only call makeInvisible once per click", async () => {
			const makeInvisible = vi.fn();
			const user = userEvent.setup();
			render(
				<DrawerContainer isVisible makeInvisible={makeInvisible}>
					<DrawerHeader>Content</DrawerHeader>
				</DrawerContainer>,
			);

			const closeButton = screen.getByRole("button", { name: "Close drawer" });
			await user.click(closeButton);
			await user.click(closeButton);

			expect(makeInvisible).not.toHaveBeenCalled();
		});
	});

	describe("accessibility", () => {
		it("should have an aria-label of 'Close drawer' on the close button", () => {
			render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					<DrawerHeader>Content</DrawerHeader>
				</DrawerContainer>,
			);

			const closeButton = screen.getByRole("button", { name: "Close drawer" });
			expect(closeButton).toHaveAttribute("aria-label", "Close drawer");
		});

		it("should render the close button with type='button'", () => {
			render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					<DrawerHeader>Content</DrawerHeader>
				</DrawerContainer>,
			);

			const closeButton = screen.getByRole("button", { name: "Close drawer" });
			expect(closeButton).toHaveAttribute("type", "button");
		});

		it("should be reachable and activatable via keyboard", async () => {
			const makeInvisible = vi.fn();
			const user = userEvent.setup();
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={makeInvisible}>
					<DrawerHeader>Content</DrawerHeader>
				</DrawerContainer>,
			);

			await user.tab();
			const closeButton = screen.getByRole("button", { name: "Close drawer" });
			expect(closeButton).toHaveFocus();

			await user.keyboard("{Enter}");

			const aside = container.querySelector("aside") as HTMLElement;
			expect(aside).toHaveClass("exiting");
		});
	});

	describe("className merge", () => {
		it("should preserve the base className", () => {
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					<DrawerHeader>Content</DrawerHeader>
				</DrawerContainer>,
			);

			const element = container.querySelector(".arkynDrawerHeader");
			expect(element).toHaveClass("arkynDrawerHeader");
		});

		it("should merge an external className with the base className", () => {
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					<DrawerHeader className="custom-class">Content</DrawerHeader>
				</DrawerContainer>,
			);

			const element = container.querySelector(".arkynDrawerHeader");
			expect(element).toHaveClass("arkynDrawerHeader");
			expect(element).toHaveClass("custom-class");
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the root element", () => {
			render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					<DrawerHeader data-testid="header-root" aria-label="Drawer header">
						Content
					</DrawerHeader>
				</DrawerContainer>,
			);

			const element = screen.getByTestId("header-root");
			expect(element).toHaveAttribute("aria-label", "Drawer header");
		});

		it("should forward inline style", () => {
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					<DrawerHeader style={{ padding: "8px" }}>Content</DrawerHeader>
				</DrawerContainer>,
			);

			const element = container.querySelector(
				".arkynDrawerHeader",
			) as HTMLElement;
			expect(element).toHaveStyle({ padding: "8px" });
		});
	});

	describe("edge cases", () => {
		it("should handle null children without throwing", () => {
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					<DrawerHeader>{null}</DrawerHeader>
				</DrawerContainer>,
			);

			expect(container.querySelector(".arkynDrawerHeader")).toBeInTheDocument();
		});

		it("should handle undefined children without throwing", () => {
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					<DrawerHeader>{undefined}</DrawerHeader>
				</DrawerContainer>,
			);

			expect(container.querySelector(".arkynDrawerHeader")).toBeInTheDocument();
		});

		it("should handle an empty className string", () => {
			const { container } = render(
				<DrawerContainer isVisible makeInvisible={() => {}}>
					<DrawerHeader className="">Content</DrawerHeader>
				</DrawerContainer>,
			);

			const element = container.querySelector(".arkynDrawerHeader");
			expect(element).toHaveClass("arkynDrawerHeader");
		});
	});
});
