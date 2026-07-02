import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CardTabButton } from "../cardTab/cardTabButton";
import { CardTabContainer } from "../cardTab/cardTabContainer";

afterEach(() => {
	cleanup();
});

describe("CardTabContainer", () => {
	it("should render without errors", () => {
		render(
			<CardTabContainer>
				<CardTabButton value="one">One</CardTabButton>
			</CardTabContainer>,
		);

		expect(screen.getByText("One")).toBeInTheDocument();
	});

	it("should render string children", () => {
		render(
			<CardTabContainer>
				<CardTabButton value="one">Simple text</CardTabButton>
			</CardTabContainer>,
		);

		expect(screen.getByText("Simple text")).toBeInTheDocument();
	});

	it("should render JSX children", () => {
		render(
			<CardTabContainer>
				<span>JSX child</span>
			</CardTabContainer>,
		);

		expect(screen.getByText("JSX child")).toBeInTheDocument();
	});

	it("should render multiple children", () => {
		render(
			<CardTabContainer>
				<CardTabButton value="one">First</CardTabButton>
				<CardTabButton value="two">Second</CardTabButton>
			</CardTabContainer>,
		);

		expect(screen.getByText("First")).toBeInTheDocument();
		expect(screen.getByText("Second")).toBeInTheDocument();
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(
			<CardTabContainer>
				<CardTabButton value="one">One</CardTabButton>
			</CardTabContainer>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("arkynCardTabContainer");
	});

	it("should render correctly with all properties filled", () => {
		const handleChange = vi.fn();
		const { container } = render(
			<CardTabContainer
				defaultValue="one"
				disabled
				onChange={handleChange}
				className="custom-class"
				data-testid="container-root"
			>
				<CardTabButton value="one">One</CardTabButton>
			</CardTabContainer>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("arkynCardTabContainer", "custom-class");
		expect(element).toHaveAttribute("data-testid", "container-root");
	});

	it("should render as a nav element", () => {
		const { container } = render(
			<CardTabContainer>
				<CardTabButton value="one">One</CardTabButton>
			</CardTabContainer>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element.tagName).toBe("NAV");
	});

	describe("defaultValue prop", () => {
		it("should not mark any tab active when defaultValue is omitted", () => {
			render(
				<CardTabContainer>
					<CardTabButton value="one">One</CardTabButton>
					<CardTabButton value="two">Two</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByText("One")).not.toHaveClass("isActive");
			expect(screen.getByText("Two")).not.toHaveClass("isActive");
		});

		it("should mark the matching tab active when defaultValue is provided", () => {
			render(
				<CardTabContainer defaultValue="two">
					<CardTabButton value="one">One</CardTabButton>
					<CardTabButton value="two">Two</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByText("One")).not.toHaveClass("isActive");
			expect(screen.getByText("Two")).toHaveClass("isActive");
		});

		it("should not mark any tab active when defaultValue matches no tab value", () => {
			render(
				<CardTabContainer defaultValue="unknown">
					<CardTabButton value="one">One</CardTabButton>
					<CardTabButton value="two">Two</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByText("One")).not.toHaveClass("isActive");
			expect(screen.getByText("Two")).not.toHaveClass("isActive");
		});
	});

	describe("onChange callback", () => {
		it("should not be called on initial render", () => {
			const handleChange = vi.fn();
			render(
				<CardTabContainer onChange={handleChange}>
					<CardTabButton value="one">One</CardTabButton>
				</CardTabContainer>,
			);

			expect(handleChange).not.toHaveBeenCalled();
		});

		it("should be called with the new value when a tab is clicked", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(
				<CardTabContainer onChange={handleChange}>
					<CardTabButton value="one">One</CardTabButton>
					<CardTabButton value="two">Two</CardTabButton>
				</CardTabContainer>,
			);

			await user.click(screen.getByText("Two"));

			expect(handleChange).toHaveBeenCalledTimes(1);
			expect(handleChange).toHaveBeenCalledWith("two");
		});

		it("should be called once per click, with the correct value each time", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(
				<CardTabContainer onChange={handleChange}>
					<CardTabButton value="one">One</CardTabButton>
					<CardTabButton value="two">Two</CardTabButton>
				</CardTabContainer>,
			);

			await user.click(screen.getByText("One"));
			await user.click(screen.getByText("Two"));

			expect(handleChange).toHaveBeenCalledTimes(2);
			expect(handleChange).toHaveBeenNthCalledWith(1, "one");
			expect(handleChange).toHaveBeenNthCalledWith(2, "two");
		});

		it("should not throw when onChange is omitted and a tab is clicked", async () => {
			const user = userEvent.setup();
			render(
				<CardTabContainer>
					<CardTabButton value="one">One</CardTabButton>
				</CardTabContainer>,
			);

			await expect(user.click(screen.getByText("One"))).resolves.not.toThrow();
		});
	});

	describe("disabled prop", () => {
		it("should not disable buttons by default", () => {
			render(
				<CardTabContainer>
					<CardTabButton value="one">One</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByText("One")).not.toBeDisabled();
		});

		it("should propagate disabled to all child CardTabButton elements", () => {
			render(
				<CardTabContainer disabled>
					<CardTabButton value="one">One</CardTabButton>
					<CardTabButton value="two">Two</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByText("One")).toBeDisabled();
			expect(screen.getByText("Two")).toBeDisabled();
		});

		it("should apply the isDisabled class to child buttons when disabled", () => {
			render(
				<CardTabContainer disabled>
					<CardTabButton value="one">One</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByText("One")).toHaveClass("isDisabled");
		});

		it("should prevent tab switching via click when disabled", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(
				<CardTabContainer disabled onChange={handleChange}>
					<CardTabButton value="one">One</CardTabButton>
				</CardTabContainer>,
			);

			await user.click(screen.getByText("One"));

			expect(handleChange).not.toHaveBeenCalled();
		});
	});

	describe("className merge", () => {
		it("should preserve the base className", () => {
			const { container } = render(
				<CardTabContainer>
					<CardTabButton value="one">One</CardTabButton>
				</CardTabContainer>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynCardTabContainer");
		});

		it("should merge an external className with the base className", () => {
			const { container } = render(
				<CardTabContainer className="custom-class">
					<CardTabButton value="one">One</CardTabButton>
				</CardTabContainer>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynCardTabContainer");
			expect(element).toHaveClass("custom-class");
		});

		it("should still render base class when className is omitted", () => {
			const { container } = render(
				<CardTabContainer>
					<CardTabButton value="one">One</CardTabButton>
				</CardTabContainer>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element.className.trim()).toBe("arkynCardTabContainer");
		});

		it("should handle an empty className string without extra whitespace", () => {
			const { container } = render(
				<CardTabContainer className="">
					<CardTabButton value="one">One</CardTabButton>
				</CardTabContainer>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynCardTabContainer");
			expect(element.className.trim()).toBe(element.className);
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the root element", () => {
			render(
				<CardTabContainer data-testid="nav-root" aria-label="Tabs">
					<CardTabButton value="one">One</CardTabButton>
				</CardTabContainer>,
			);

			const element = screen.getByTestId("nav-root");
			expect(element).toHaveAttribute("aria-label", "Tabs");
		});

		it("should forward id attribute", () => {
			render(
				<CardTabContainer id="tabs-id">
					<CardTabButton value="one">One</CardTabButton>
				</CardTabContainer>,
			);

			expect(document.getElementById("tabs-id")).toBeInTheDocument();
		});

		it("should forward inline style", () => {
			const { container } = render(
				<CardTabContainer style={{ marginTop: "10px" }}>
					<CardTabButton value="one">One</CardTabButton>
				</CardTabContainer>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveStyle({ marginTop: "10px" });
		});
	});

	describe("edge cases", () => {
		it("should handle null children without throwing", () => {
			const { container } = render(<CardTabContainer>{null}</CardTabContainer>);

			expect(
				container.querySelector(".arkynCardTabContainer"),
			).toBeInTheDocument();
		});

		it("should handle undefined children without throwing", () => {
			const { container } = render(
				<CardTabContainer>{undefined}</CardTabContainer>,
			);

			expect(
				container.querySelector(".arkynCardTabContainer"),
			).toBeInTheDocument();
		});

		it("should handle an empty string defaultValue", () => {
			render(
				<CardTabContainer defaultValue="">
					<CardTabButton value="one">One</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByText("One")).not.toHaveClass("isActive");
		});
	});
});
