import { render, screen } from "@testing-library/react";
import { Check, X } from "lucide-react";
import { describe, expect, it } from "vitest";
import { Badge } from "../badge";

describe("Badge", () => {
	it("should render without errors", () => {
		render(<Badge>New</Badge>);

		expect(screen.getByText("New")).toBeInTheDocument();
	});

	it("should render string children", () => {
		render(<Badge>Simple text</Badge>);

		expect(screen.getByText("Simple text")).toBeInTheDocument();
	});

	it("should render JSX children", () => {
		render(
			<Badge>
				<span>JSX child</span>
			</Badge>,
		);

		expect(screen.getByText("JSX child")).toBeInTheDocument();
	});

	it("should render without children", () => {
		const { container } = render(<Badge />);

		expect(container.querySelector(".arkynBadge")).toBeInTheDocument();
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(<Badge />);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("arkynBadge");
		expect(element).toHaveClass("ghost");
		expect(element).toHaveClass("primary");
		expect(element).toHaveClass("lg");
	});

	it("should render correctly with all properties filled", () => {
		const { container } = render(
			<Badge
				size="md"
				variant="solid"
				scheme="danger"
				leftIcon={Check}
				rightIcon={X}
				className="custom-class"
			>
				Full badge
			</Badge>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass(
			"arkynBadge",
			"solid",
			"danger",
			"md",
			"custom-class",
		);
		expect(screen.getByText("Full badge")).toBeInTheDocument();
	});

	it("should render as a div element", () => {
		const { container } = render(<Badge>New</Badge>);

		const element = container.firstChild as HTMLElement;
		expect(element.tagName).toBe("DIV");
	});

	it("should render text content inside a paragraph", () => {
		render(<Badge>Label text</Badge>);

		const paragraph = screen.getByText("Label text");
		expect(paragraph.tagName).toBe("P");
	});

	describe("size prop", () => {
		it("should apply the default 'lg' size class when omitted", () => {
			const { container } = render(<Badge>New</Badge>);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("lg");
			expect(element).not.toHaveClass("md");
		});

		it("should apply the 'md' size class when specified", () => {
			const { container } = render(<Badge size="md">New</Badge>);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("md");
			expect(element).not.toHaveClass("lg");
		});

		it("should apply the 'lg' size class when specified explicitly", () => {
			const { container } = render(<Badge size="lg">New</Badge>);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("lg");
		});

		it("should use a smaller icon size for 'md'", () => {
			const { container } = render(<Badge size="md" leftIcon={Check} />);

			const icon = container.querySelector("svg");
			expect(icon).toHaveAttribute("width", "12");
			expect(icon).toHaveAttribute("height", "12");
		});

		it("should use a larger icon size for 'lg'", () => {
			const { container } = render(<Badge size="lg" leftIcon={Check} />);

			const icon = container.querySelector("svg");
			expect(icon).toHaveAttribute("width", "14");
			expect(icon).toHaveAttribute("height", "14");
		});

		it("should default to the 'lg' icon size when size is omitted", () => {
			const { container } = render(<Badge leftIcon={Check} />);

			const icon = container.querySelector("svg");
			expect(icon).toHaveAttribute("width", "14");
			expect(icon).toHaveAttribute("height", "14");
		});
	});

	describe("variant prop", () => {
		it("should apply the default 'ghost' variant class when omitted", () => {
			const { container } = render(<Badge>New</Badge>);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("ghost");
		});

		it.each([
			"solid",
			"outline",
			"ghost",
		] as const)("should apply the '%s' variant class", (variant) => {
			const { container } = render(<Badge variant={variant}>New</Badge>);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass(variant);
		});

		it("should not apply classes from other variants", () => {
			const { container } = render(<Badge variant="solid">New</Badge>);

			const element = container.firstChild as HTMLElement;
			expect(element).not.toHaveClass("outline");
			expect(element).not.toHaveClass("ghost");
		});

		it("should replace the variant class when changed", () => {
			const { container, rerender } = render(
				<Badge variant="solid">New</Badge>,
			);

			let element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("solid");

			rerender(<Badge variant="outline">New</Badge>);
			element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("outline");
			expect(element).not.toHaveClass("solid");
		});
	});

	describe("scheme prop", () => {
		it("should apply the default 'primary' scheme class when omitted", () => {
			const { container } = render(<Badge>New</Badge>);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("primary");
		});

		it.each([
			"primary",
			"secondary",
			"success",
			"warning",
			"danger",
			"info",
		] as const)("should apply the '%s' scheme class", (scheme) => {
			const { container } = render(<Badge scheme={scheme}>New</Badge>);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass(scheme);
		});

		it("should not apply classes from other schemes", () => {
			const { container } = render(<Badge scheme="success">New</Badge>);

			const element = container.firstChild as HTMLElement;
			expect(element).not.toHaveClass("primary");
			expect(element).not.toHaveClass("secondary");
			expect(element).not.toHaveClass("warning");
			expect(element).not.toHaveClass("danger");
			expect(element).not.toHaveClass("info");
		});
	});

	describe("leftIcon prop", () => {
		it("should not render an icon when leftIcon is omitted", () => {
			const { container } = render(<Badge>New</Badge>);

			expect(container.querySelector("svg")).not.toBeInTheDocument();
		});

		it("should render the leftIcon when provided", () => {
			const { container } = render(<Badge leftIcon={Check}>New</Badge>);

			expect(container.querySelector("svg")).toBeInTheDocument();
		});

		it("should render leftIcon before the text content", () => {
			const { container } = render(<Badge leftIcon={Check}>New</Badge>);

			const element = container.firstChild as HTMLElement;
			const icon = element.querySelector("svg");
			const paragraph = element.querySelector("p");
			expect(icon?.nextElementSibling).toBe(paragraph);
		});
	});

	describe("rightIcon prop", () => {
		it("should not render an icon when rightIcon is omitted", () => {
			const { container } = render(<Badge>New</Badge>);

			expect(container.querySelectorAll("svg")).toHaveLength(0);
		});

		it("should render the rightIcon when provided", () => {
			const { container } = render(<Badge rightIcon={X}>New</Badge>);

			expect(container.querySelector("svg")).toBeInTheDocument();
		});

		it("should render rightIcon after the text content", () => {
			const { container } = render(<Badge rightIcon={X}>New</Badge>);

			const element = container.firstChild as HTMLElement;
			const icon = element.querySelector("svg");
			const paragraph = element.querySelector("p");
			expect(icon?.previousElementSibling).toBe(paragraph);
		});
	});

	describe("leftIcon and rightIcon together", () => {
		it("should render both icons at once", () => {
			const { container } = render(
				<Badge leftIcon={Check} rightIcon={X}>
					New
				</Badge>,
			);

			expect(container.querySelectorAll("svg")).toHaveLength(2);
		});

		it("should render leftIcon, then text, then rightIcon in order", () => {
			const { container } = render(
				<Badge leftIcon={Check} rightIcon={X}>
					New
				</Badge>,
			);

			const element = container.firstChild as HTMLElement;
			const children = Array.from(element.children);
			expect(children[0].tagName).toBe("svg");
			expect(children[1].tagName).toBe("P");
			expect(children[2].tagName).toBe("svg");
		});
	});

	describe("className merge", () => {
		it("should preserve the base className", () => {
			const { container } = render(<Badge>New</Badge>);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynBadge");
		});

		it("should merge an external className with the base className", () => {
			const { container } = render(<Badge className="custom-class">New</Badge>);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynBadge");
			expect(element).toHaveClass("custom-class");
		});

		it("should still render base classes when className is omitted", () => {
			const { container } = render(<Badge>New</Badge>);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynBadge");
			expect(element).toHaveClass("ghost");
			expect(element).toHaveClass("primary");
			expect(element).toHaveClass("lg");
		});

		it("should combine className with variant, scheme and size classes", () => {
			const { container } = render(
				<Badge
					variant="outline"
					scheme="info"
					size="md"
					className="custom-class"
				>
					New
				</Badge>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass(
				"arkynBadge",
				"outline",
				"info",
				"md",
				"custom-class",
			);
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the root element", () => {
			render(
				<Badge data-testid="badge-root" aria-label="Status badge">
					New
				</Badge>,
			);

			const element = screen.getByTestId("badge-root");
			expect(element).toHaveAttribute("aria-label", "Status badge");
		});

		it("should forward id attribute", () => {
			render(<Badge id="badge-id">New</Badge>);

			expect(document.getElementById("badge-id")).toBeInTheDocument();
		});

		it("should forward inline style", () => {
			const { container } = render(
				<Badge style={{ marginTop: "10px" }}>New</Badge>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveStyle({ marginTop: "10px" });
		});
	});

	describe("edge cases", () => {
		it("should handle null children without throwing", () => {
			const { container } = render(<Badge>{null}</Badge>);

			expect(container.querySelector(".arkynBadge")).toBeInTheDocument();
		});

		it("should handle undefined children without throwing", () => {
			const { container } = render(<Badge>{undefined}</Badge>);

			expect(container.querySelector(".arkynBadge")).toBeInTheDocument();
		});

		it("should handle empty string children", () => {
			const { container } = render(<Badge>{""}</Badge>);

			const paragraph = container.querySelector("p");
			expect(paragraph).toBeInTheDocument();
			expect(paragraph).toHaveTextContent("");
		});

		it("should handle an empty className string", () => {
			const { container } = render(<Badge className="">New</Badge>);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynBadge");
			expect(element.className.trim()).toBe(element.className);
		});

		it("should not render an icon element when leftIcon and rightIcon are both undefined", () => {
			const { container } = render(<Badge>New</Badge>);

			expect(container.querySelectorAll("svg")).toHaveLength(0);
		});
	});
});
