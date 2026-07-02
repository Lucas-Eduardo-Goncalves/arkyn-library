import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Tooltip } from "../tooltip";

function mockRect(overrides: Partial<DOMRect>) {
	return {
		x: 0,
		y: 0,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		width: 0,
		height: 0,
		toJSON: () => {},
		...overrides,
	} as DOMRect;
}

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

describe("Tooltip", () => {
	it("should render without errors", () => {
		render(
			<Tooltip text="Save changes">
				<button type="button">Save</button>
			</Tooltip>,
		);

		expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
	});

	it("should render the trigger children", () => {
		render(
			<Tooltip text="Info">
				<span>Trigger</span>
			</Tooltip>,
		);

		expect(screen.getByText("Trigger")).toBeInTheDocument();
	});

	it("should render multiple trigger children", () => {
		render(
			<Tooltip text="Info">
				<span>Icon</span>
				<span>Label</span>
			</Tooltip>,
		);

		expect(screen.getByText("Icon")).toBeInTheDocument();
		expect(screen.getByText("Label")).toBeInTheDocument();
	});

	it("should render the text prop inside the tooltip bubble", () => {
		const { container } = render(
			<Tooltip text="Contextual help text">
				<button type="button">Trigger</button>
			</Tooltip>,
		);

		const bubble = container.querySelector(".arkynTooltipText");
		expect(bubble).toBeInTheDocument();
		expect(bubble).toHaveTextContent("Contextual help text");
	});

	it("should render HTML markup inside the text prop", () => {
		const { container } = render(
			<Tooltip text="<strong>Bold</strong> text">
				<button type="button">Trigger</button>
			</Tooltip>,
		);

		const bubble = container.querySelector(".arkynTooltipText");
		expect(bubble?.querySelector("strong")).toBeInTheDocument();
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(
			<Tooltip text="Info">
				<button type="button">Trigger</button>
			</Tooltip>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("arkynTooltip", "lg", "top");
	});

	it("should render correctly with all properties filled", () => {
		const { container } = render(
			<Tooltip
				text="Delete item"
				orientation="bottom"
				size="md"
				className="custom-class"
			>
				<button type="button">Trigger</button>
			</Tooltip>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("arkynTooltip", "md", "bottom", "custom-class");
	});

	describe("orientation prop", () => {
		it("should default to top when omitted", () => {
			const { container } = render(
				<Tooltip text="Info">
					<button type="button">Trigger</button>
				</Tooltip>,
			);

			expect(container.firstChild).toHaveClass("top");
		});

		it.each([
			"top",
			"right",
			"bottom",
			"left",
		] as const)("should apply the '%s' orientation class", (orientation) => {
			const { container } = render(
				<Tooltip text="Info" orientation={orientation}>
					<button type="button">Trigger</button>
				</Tooltip>,
			);

			expect(container.firstChild).toHaveClass(orientation);
		});
	});

	describe("size prop", () => {
		it("should default to lg when omitted", () => {
			const { container } = render(
				<Tooltip text="Info">
					<button type="button">Trigger</button>
				</Tooltip>,
			);

			expect(container.firstChild).toHaveClass("lg");
		});

		it("should apply the md size class when specified", () => {
			const { container } = render(
				<Tooltip text="Info" size="md">
					<button type="button">Trigger</button>
				</Tooltip>,
			);

			expect(container.firstChild).toHaveClass("md");
			expect(container.firstChild).not.toHaveClass("lg");
		});
	});

	describe("viewport-aware flipping", () => {
		it("should flip from left to right when the tooltip overflows the left edge", async () => {
			vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
				mockRect({ left: -20, right: 10 }),
			);
			const user = userEvent.setup();
			const { container } = render(
				<Tooltip text="Info" orientation="left">
					<button type="button">Trigger</button>
				</Tooltip>,
			);

			const element = container.firstChild as HTMLElement;
			await user.hover(element);

			await waitFor(() => {
				expect(element).toHaveClass("right");
			});
			expect(element).not.toHaveClass("left");
		});

		it("should flip from right to left when the tooltip overflows the right edge", async () => {
			vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
				mockRect({ right: 5000, left: 4900 }),
			);
			const user = userEvent.setup();
			const { container } = render(
				<Tooltip text="Info" orientation="right">
					<button type="button">Trigger</button>
				</Tooltip>,
			);

			const element = container.firstChild as HTMLElement;
			await user.hover(element);

			await waitFor(() => {
				expect(element).toHaveClass("left");
			});
			expect(element).not.toHaveClass("right");
		});

		it("should flip from top to bottom when the tooltip overflows the top edge", async () => {
			vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
				mockRect({ top: -20, bottom: 10 }),
			);
			const user = userEvent.setup();
			const { container } = render(
				<Tooltip text="Info" orientation="top">
					<button type="button">Trigger</button>
				</Tooltip>,
			);

			const element = container.firstChild as HTMLElement;
			await user.hover(element);

			await waitFor(() => {
				expect(element).toHaveClass("bottom");
			});
			expect(element).not.toHaveClass("top");
		});

		it("should flip from bottom to top when the tooltip overflows the bottom edge", async () => {
			vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
				mockRect({ bottom: 5000, top: 4900 }),
			);
			const user = userEvent.setup();
			const { container } = render(
				<Tooltip text="Info" orientation="bottom">
					<button type="button">Trigger</button>
				</Tooltip>,
			);

			const element = container.firstChild as HTMLElement;
			await user.hover(element);

			await waitFor(() => {
				expect(element).toHaveClass("top");
			});
			expect(element).not.toHaveClass("bottom");
		});

		it("should not flip when the tooltip fits within the viewport", async () => {
			vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
				mockRect({ top: 100, bottom: 150, left: 100, right: 200 }),
			);
			const user = userEvent.setup();
			const { container } = render(
				<Tooltip text="Info" orientation="top">
					<button type="button">Trigger</button>
				</Tooltip>,
			);

			const element = container.firstChild as HTMLElement;
			await user.hover(element);

			await waitFor(() => {
				expect(element).toHaveClass("top");
			});
		});

		it("should re-evaluate the orientation on window resize", async () => {
			const getRect = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect");
			getRect.mockReturnValue(mockRect({ top: 100, bottom: 150 }));

			const { container } = render(
				<Tooltip text="Info" orientation="top">
					<button type="button">Trigger</button>
				</Tooltip>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("top");

			getRect.mockReturnValue(mockRect({ top: -20, bottom: 10 }));
			fireEvent(window, new Event("resize"));

			await waitFor(() => {
				expect(element).toHaveClass("bottom");
			});
		});
	});

	describe("className merge", () => {
		it("should preserve the base className", () => {
			const { container } = render(
				<Tooltip text="Info">
					<button type="button">Trigger</button>
				</Tooltip>,
			);

			expect(container.firstChild).toHaveClass("arkynTooltip");
		});

		it("should merge an external className with the base className", () => {
			const { container } = render(
				<Tooltip text="Info" className="custom-class">
					<button type="button">Trigger</button>
				</Tooltip>,
			);

			expect(container.firstChild).toHaveClass("arkynTooltip");
			expect(container.firstChild).toHaveClass("custom-class");
		});

		it("should still render the base class when className is omitted", () => {
			const { container } = render(
				<Tooltip text="Info">
					<button type="button">Trigger</button>
				</Tooltip>,
			);

			expect(container.firstChild).toHaveClass("arkynTooltip");
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the root element", () => {
			render(
				<Tooltip text="Info" data-testid="tooltip-root">
					<button type="button">Trigger</button>
				</Tooltip>,
			);

			expect(screen.getByTestId("tooltip-root")).toBeInTheDocument();
		});

		it("should forward id attribute", () => {
			render(
				<Tooltip text="Info" id="tooltip-id">
					<button type="button">Trigger</button>
				</Tooltip>,
			);

			expect(document.getElementById("tooltip-id")).toBeInTheDocument();
		});

		it("should forward aria-label attribute", () => {
			render(
				<Tooltip text="Info" aria-label="Tooltip wrapper">
					<button type="button">Trigger</button>
				</Tooltip>,
			);

			expect(screen.getByLabelText("Tooltip wrapper")).toBeInTheDocument();
		});
	});

	describe("edge cases", () => {
		it("should handle an empty text string without throwing", () => {
			const { container } = render(
				<Tooltip text="">
					<button type="button">Trigger</button>
				</Tooltip>,
			);

			const bubble = container.querySelector(".arkynTooltipText");
			expect(bubble).toBeInTheDocument();
			expect(bubble).toHaveTextContent("");
		});

		it("should render a complex trigger node", () => {
			render(
				<Tooltip text="Info">
					<button type="button">
						<span>Icon</span>
						<span>Label</span>
					</button>
				</Tooltip>,
			);

			expect(screen.getByText("Icon")).toBeInTheDocument();
			expect(screen.getByText("Label")).toBeInTheDocument();
		});
	});
});
