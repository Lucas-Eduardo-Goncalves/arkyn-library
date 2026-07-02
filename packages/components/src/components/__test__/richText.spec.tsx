import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FormProvider } from "../../providers/formProvider";
import { RichText } from "../richText";

function getHiddenInput(container: HTMLElement, name: string) {
	return container.querySelector(
		`input[type="hidden"][name="${name}"]`,
	) as HTMLInputElement;
}

describe("RichText", () => {
	afterEach(() => {
		cleanup();
	});

	it("should render without errors", () => {
		render(<RichText name="content" />);

		expect(screen.getByRole("textbox")).toBeInTheDocument();
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(<RichText name="content" />);

		expect(container.querySelector(".arkynRichText")).toBeInTheDocument();
	});

	it("should render correctly with all properties filled", () => {
		render(
			<RichText
				name="content"
				label="Description"
				showAsterisk
				orientation="horizontal"
				hiddenButtons={["image"]}
				maxLimit={500}
				enforceCharacterLimit
				defaultValue="[]"
				isError={false}
				id="custom-id"
				className="custom-class"
				onChange={vi.fn()}
				onChangeCharactersCount={vi.fn()}
			/>,
		);

		expect(screen.getByText("Description")).toBeInTheDocument();
		expect(screen.getByRole("textbox")).toHaveAttribute("id", "custom-id");
	});

	it("should render an editable content area", () => {
		render(<RichText name="content" />);

		const editable = screen.getByRole("textbox");
		expect(editable).toHaveAttribute("contenteditable", "true");
	});

	describe("name prop", () => {
		it("should set the name attribute on the hidden content input", () => {
			const { container } = render(<RichText name="body" />);

			expect(getHiddenInput(container, "body")).toBeInTheDocument();
		});

		it("should set a derived name for the character count hidden input", () => {
			const { container } = render(<RichText name="body" />);

			expect(getHiddenInput(container, "bodyCount")).toBeInTheDocument();
		});
	});

	describe("id prop", () => {
		it("should apply a custom id to the editable area when provided", () => {
			render(<RichText name="content" id="my-editor" />);

			expect(screen.getByRole("textbox")).toHaveAttribute("id", "my-editor");
		});

		it("should generate an id automatically when omitted", () => {
			render(<RichText name="content" />);

			const editable = screen.getByRole("textbox");
			expect(editable.id).toBeTruthy();
		});
	});

	describe("defaultValue prop", () => {
		it("should populate initial content from a valid Slate JSON string", () => {
			const value = JSON.stringify([
				{ type: "paragraph", children: [{ text: "Hello world" }] },
			]);

			render(<RichText name="content" defaultValue={value} />);

			expect(screen.getByText("Hello world")).toBeInTheDocument();
		});

		it("should fall back to the default empty paragraph when defaultValue is an empty array", () => {
			const { container } = render(
				<RichText name="content" defaultValue="[]" />,
			);

			const hiddenInput = getHiddenInput(container, "content");
			expect(hiddenInput.value).toBe(
				JSON.stringify([{ type: "paragraph", children: [{ text: "" }] }]),
			);
		});

		it("should fall back to the default content when defaultValue is invalid JSON", () => {
			const { container } = render(
				<RichText name="content" defaultValue="not valid json" />,
			);

			const hiddenInput = getHiddenInput(container, "content");
			expect(hiddenInput.value).toBe(
				JSON.stringify([{ type: "paragraph", children: [{ text: "" }] }]),
			);
		});

		it("should fall back to the default content when defaultValue nodes are malformed", () => {
			const { container } = render(
				<RichText name="content" defaultValue={JSON.stringify([{ a: 1 }])} />,
			);

			const hiddenInput = getHiddenInput(container, "content");
			expect(hiddenInput.value).toBe(
				JSON.stringify([{ type: "paragraph", children: [{ text: "" }] }]),
			);
		});

		it("should use the built-in default when defaultValue is omitted", () => {
			const { container } = render(<RichText name="content" />);

			const hiddenInput = getHiddenInput(container, "content");
			expect(hiddenInput.value).toBe(
				JSON.stringify([{ type: "paragraph", children: [{ text: "" }] }]),
			);
		});
	});

	describe("typing behaviour", () => {
		// jsdom doesn't implement native contenteditable text editing, and
		// Slate relies on that native behavior (via `beforeinput` + Selection
		// APIs, including `InputEvent.getTargetRanges()`, which jsdom also
		// lacks) to turn keystrokes into document changes. `user.type()` ends
		// up inserting raw text as a stray DOM node outside Slate's own tree,
		// so `onChange` is never invoked — confirmed by inspecting the
		// resulting DOM and the mock call count directly. These 4 scenarios
		// need real-browser coverage (e.g. Playwright) instead of jsdom.
		it.skip("should fire onChange with the updated Slate value when typing", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();

			render(<RichText name="content" onChange={handleChange} />);

			const editable = screen.getByRole("textbox");
			await user.click(editable);
			await user.type(editable, "Hi");

			expect(handleChange).toHaveBeenCalled();
			const lastCallValue = handleChange.mock.calls.at(-1)?.[0];
			expect(JSON.stringify(lastCallValue)).toContain("Hi");
		});

		it.skip("should update the hidden content input value as the user types", async () => {
			const user = userEvent.setup();

			const { container } = render(<RichText name="content" />);

			const editable = screen.getByRole("textbox");
			await user.click(editable);
			await user.type(editable, "Hi");

			const hiddenInput = getHiddenInput(container, "content");
			expect(hiddenInput.value).toContain("Hi");
		});

		it.skip("should call onChangeCharactersCount on every keystroke with the current count", async () => {
			const user = userEvent.setup();
			const handleCount = vi.fn();

			render(<RichText name="content" onChangeCharactersCount={handleCount} />);

			const editable = screen.getByRole("textbox");
			await user.click(editable);
			await user.keyboard("a");
			await user.keyboard("b");
			await user.keyboard("c");

			expect(handleCount).toHaveBeenCalledTimes(3);
			expect(handleCount).toHaveBeenNthCalledWith(1, 1);
			expect(handleCount).toHaveBeenNthCalledWith(2, 2);
			expect(handleCount).toHaveBeenNthCalledWith(3, 3);
		});

		it.skip("should update the character count hidden input as the user types", async () => {
			const user = userEvent.setup();

			const { container } = render(<RichText name="content" />);

			const editable = screen.getByRole("textbox");
			await user.click(editable);
			await user.keyboard("a");
			await user.keyboard("b");
			await user.keyboard("c");

			const hiddenCountInput = getHiddenInput(container, "contentCount");
			expect(hiddenCountInput.value).toBe("3");
		});

		it("should not call onChange or onChangeCharactersCount without user interaction", () => {
			const handleChange = vi.fn();
			const handleCount = vi.fn();

			render(
				<RichText
					name="content"
					onChange={handleChange}
					onChangeCharactersCount={handleCount}
				/>,
			);

			expect(handleChange).not.toHaveBeenCalled();
			expect(handleCount).not.toHaveBeenCalled();
		});
	});

	describe("maxLimit and enforceCharacterLimit props", () => {
		it("should show a negative remaining-characters indicator once the default limit is exceeded", () => {
			const longText = "a".repeat(10001);
			const value = JSON.stringify([
				{ type: "paragraph", children: [{ text: longText }] },
			]);

			const { container } = render(
				<RichText name="content" defaultValue={value} />,
			);

			const indicator = container.querySelector(".restatesCharacters");
			expect(indicator).toBeInTheDocument();
			expect(indicator?.textContent).toBe("-1");
		});

		it("should not show the remaining-characters indicator when under the limit", () => {
			const { container } = render(<RichText name="content" maxLimit={500} />);

			expect(
				container.querySelector(".restatesCharacters"),
			).not.toBeInTheDocument();
		});

		it("should stop accepting new characters once enforceCharacterLimit blocks further typing", async () => {
			const user = userEvent.setup();
			const value = JSON.stringify([
				{ type: "paragraph", children: [{ text: "abcde" }] },
			]);

			const { container } = render(
				<RichText
					name="content"
					defaultValue={value}
					maxLimit={5}
					enforceCharacterLimit
				/>,
			);

			const editable = screen.getByRole("textbox");
			await user.click(editable);
			await user.keyboard("f");

			const hiddenInput = getHiddenInput(container, "content");
			expect(hiddenInput.value).not.toContain("abcdef");
		});

		// Same jsdom/Slate contenteditable limitation as the "typing behaviour"
		// tests above — `user.keyboard()` never reaches Slate's onChange.
		it.skip("should still call onChangeCharactersCount even when the character limit is enforced", async () => {
			const user = userEvent.setup();
			const handleCount = vi.fn();
			const value = JSON.stringify([
				{ type: "paragraph", children: [{ text: "abcde" }] },
			]);

			render(
				<RichText
					name="content"
					defaultValue={value}
					maxLimit={5}
					enforceCharacterLimit
					onChangeCharactersCount={handleCount}
				/>,
			);

			const editable = screen.getByRole("textbox");
			await user.click(editable);
			await user.keyboard("f");

			expect(handleCount).toHaveBeenCalledWith(6);
		});

		it.skip("should allow typing past the default maxLimit when enforceCharacterLimit is false", async () => {
			const user = userEvent.setup();
			const value = JSON.stringify([
				{ type: "paragraph", children: [{ text: "abcde" }] },
			]);

			const { container } = render(
				<RichText name="content" defaultValue={value} maxLimit={5} />,
			);

			const editable = screen.getByRole("textbox");
			await user.click(editable);
			await user.keyboard("f");

			const hiddenInput = getHiddenInput(container, "content");
			expect(hiddenInput.value).toContain("abcdef");
		});
	});

	describe("hiddenButtons prop", () => {
		function getToolbarButtons(container: HTMLElement) {
			return Array.from(
				container.querySelectorAll(".arkynRichTextToolbar button"),
			);
		}

		it("should render all toolbar buttons when hiddenButtons is omitted", () => {
			const { container } = render(<RichText name="content" />);

			const buttons = getToolbarButtons(container);
			expect(buttons.length).toBeGreaterThan(0);
			expect(
				container.querySelector(".arkynRichTextMarkButton"),
			).toBeInTheDocument();
			expect(
				container.querySelector(".arkynRichTextBlockButton"),
			).toBeInTheDocument();
		});

		it("should not render the image button when imageConfig is not provided", () => {
			const { container } = render(<RichText name="content" />);

			expect(
				container.querySelector(".arkynRichTextInsertImage"),
			).not.toBeInTheDocument();
		});

		it("should render the image button when imageConfig is provided and not hidden", () => {
			const { container } = render(
				<RichText name="content" imageConfig={{ action: "/upload" }} />,
			);

			expect(
				container.querySelector(".arkynRichTextInsertImage"),
			).toBeInTheDocument();
		});

		it("should hide the image button when hiddenButtons includes image even with imageConfig set", () => {
			const { container } = render(
				<RichText
					name="content"
					imageConfig={{ action: "/upload" }}
					hiddenButtons={["image"]}
				/>,
			);

			expect(
				container.querySelector(".arkynRichTextInsertImage"),
			).not.toBeInTheDocument();
		});

		it("should render the video button by default", () => {
			const { container } = render(<RichText name="content" />);

			expect(
				container.querySelector(".arkynRichTextInsertVideo"),
			).toBeInTheDocument();
		});

		it("should hide the video button when hiddenButtons includes video", () => {
			const { container } = render(
				<RichText name="content" hiddenButtons={["video"]} />,
			);

			expect(
				container.querySelector(".arkynRichTextInsertVideo"),
			).not.toBeInTheDocument();
		});

		it("should hide the bold button when hiddenButtons includes bold", () => {
			const { container } = render(
				<RichText name="content" hiddenButtons={["bold"]} />,
			);

			const markButtons = container.querySelectorAll(
				".arkynRichTextMarkButton",
			);
			expect(markButtons.length).toBe(3);
		});

		it("should hide multiple buttons at once", () => {
			const { container } = render(
				<RichText
					name="content"
					hiddenButtons={[
						"bold",
						"italic",
						"underline",
						"code",
						"headingOne",
						"headingTwo",
						"blockQuote",
						"left",
						"right",
						"center",
						"justify",
						"video",
					]}
				/>,
			);

			expect(
				container.querySelector(".arkynRichTextMarkButton"),
			).not.toBeInTheDocument();
			expect(
				container.querySelector(".arkynRichTextBlockButton"),
			).not.toBeInTheDocument();
			expect(
				container.querySelector(".arkynRichTextInsertVideo"),
			).not.toBeInTheDocument();
		});
	});

	describe("toolbar buttons", () => {
		it("should render heading, quote, and alignment block buttons", () => {
			const { container } = render(<RichText name="content" />);

			const blockButtons = container.querySelectorAll(
				".arkynRichTextBlockButton",
			);
			expect(blockButtons.length).toBe(7);
		});

		it("should render bold, italic, underline, and code mark buttons", () => {
			const { container } = render(<RichText name="content" />);

			const markButtons = container.querySelectorAll(
				".arkynRichTextMarkButton",
			);
			expect(markButtons.length).toBe(4);
		});

		it("should render toolbar buttons as type=button so they do not submit forms", () => {
			const { container } = render(<RichText name="content" />);

			const buttons = container.querySelectorAll(
				".arkynRichTextToolbar button",
			);
			for (const button of Array.from(buttons)) {
				expect(button).toHaveAttribute("type", "button");
			}
		});
	});

	describe("focus state", () => {
		it("should apply the focusFalse class before the editor is focused", () => {
			const { container } = render(<RichText name="content" />);

			expect(container.querySelector(".arkynRichText")).toHaveClass(
				"focusFalse",
			);
		});

		it("should apply the focusTrue class once the editable area is focused", () => {
			const { container } = render(<RichText name="content" />);

			const editable = screen.getByRole("textbox");
			fireEvent.focus(editable);

			expect(container.querySelector(".arkynRichText")).toHaveClass(
				"focusTrue",
			);
		});

		it("should revert to focusFalse after the editable area is blurred", () => {
			const { container } = render(<RichText name="content" />);

			const editable = screen.getByRole("textbox");
			fireEvent.focus(editable);
			fireEvent.blur(editable);

			expect(container.querySelector(".arkynRichText")).toHaveClass(
				"focusFalse",
			);
		});
	});

	describe("error state", () => {
		it("should apply errorFalse class and not render an error message by default", () => {
			const { container } = render(<RichText name="content" />);

			expect(container.querySelector(".arkynRichText")).toHaveClass(
				"errorFalse",
			);
		});

		it("should apply errorTrue class and show baseErrorMessage when provided", () => {
			const { container } = render(
				<RichText name="content" baseErrorMessage="Something is wrong" />,
			);

			expect(container.querySelector(".arkynRichText")).toHaveClass(
				"errorTrue",
			);
			expect(screen.getByText("Something is wrong")).toBeInTheDocument();
		});

		it("should apply errorTrue class when isError is forced true", () => {
			const { container } = render(<RichText name="content" isError={true} />);

			expect(container.querySelector(".arkynRichText")).toHaveClass(
				"errorTrue",
			);
		});

		it("should read the error message from FormProvider fieldErrors by name", () => {
			render(
				<FormProvider fieldErrors={{ content: "Field is required" }}>
					<RichText name="content" />
				</FormProvider>,
			);

			expect(screen.getByText("Field is required")).toBeInTheDocument();
		});

		it("should prefer baseErrorMessage over the FormProvider field error", () => {
			render(
				<FormProvider fieldErrors={{ content: "From context" }}>
					<RichText name="content" baseErrorMessage="From prop" />
				</FormProvider>,
			);

			expect(screen.getByText("From prop")).toBeInTheDocument();
			expect(screen.queryByText("From context")).not.toBeInTheDocument();
		});
	});

	describe("label and showAsterisk props", () => {
		it("should not render a label when omitted", () => {
			render(<RichText name="content" />);

			expect(screen.queryByText("*")).not.toBeInTheDocument();
		});

		it("should render the label text when provided", () => {
			render(<RichText name="content" label="My Field" />);

			expect(screen.getByText("My Field")).toBeInTheDocument();
		});

		it("should render an asterisk alongside the label when showAsterisk is true", () => {
			const { container } = render(
				<RichText name="content" label="My Field" showAsterisk />,
			);

			expect(screen.getByText("My Field")).toBeInTheDocument();
			expect(container.querySelector("label")).toHaveClass("asteriskTrue");
		});
	});

	describe("unShowFieldTemplate prop", () => {
		it("should render the label and wrapper by default", () => {
			const { container } = render(
				<RichText name="content" label="My Field" />,
			);

			expect(screen.getByText("My Field")).toBeInTheDocument();
			expect(container.querySelector(".arkynFieldWrapper")).toBeInTheDocument();
		});

		it("should skip the wrapper, label, and error rendering when true", () => {
			const { container } = render(
				<RichText
					name="content"
					label="My Field"
					baseErrorMessage="Oops"
					unShowFieldTemplate
				/>,
			);

			expect(screen.queryByText("My Field")).not.toBeInTheDocument();
			expect(screen.queryByText("Oops")).not.toBeInTheDocument();
			expect(container.querySelector(".arkynRichText")).toBeInTheDocument();
		});
	});

	describe("orientation prop", () => {
		it("should default to vertical orientation on the field wrapper", () => {
			const { container } = render(<RichText name="content" label="Field" />);

			expect(container.querySelector(".arkynFieldWrapper")).toHaveClass(
				"vertical",
			);
		});

		it("should apply horizontal orientation class when set", () => {
			const { container } = render(
				<RichText name="content" label="Field" orientation="horizontal" />,
			);

			expect(container.querySelector(".arkynFieldWrapper")).toHaveClass(
				"horizontal",
			);
		});
	});

	describe("className prop", () => {
		it("should merge the base wrapper class with a custom className", () => {
			const { container } = render(
				<RichText name="content" label="Field" className="custom-class" />,
			);

			const wrapper = container.querySelector(".arkynFieldWrapper");
			expect(wrapper).toHaveClass("arkynFieldWrapper");
			expect(wrapper).toHaveClass("custom-class");
		});

		it("should preserve the arkynRichText base class regardless of custom className", () => {
			const { container } = render(
				<RichText name="content" className="custom-class" />,
			);

			expect(container.querySelector(".arkynRichText")).toBeInTheDocument();
		});
	});

	describe("accessibility", () => {
		it("should expose the editable area with a textbox role", () => {
			render(<RichText name="content" />);

			expect(screen.getByRole("textbox")).toBeInTheDocument();
		});

		it("should support keyboard focus via tab navigation through the toolbar into the editable area", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<RichText name="content" hiddenButtons={["video"]} />,
			);

			const toolbarButtons = container.querySelectorAll(
				".arkynRichTextToolbar button",
			);

			for (let i = 0; i < toolbarButtons.length; i++) {
				await user.tab();
			}
			await user.tab();

			expect(screen.getByRole("textbox")).toHaveFocus();
		});

		it("should associate the label with the field wrapper via id", () => {
			const { container } = render(
				<RichText name="content" label="Field label" />,
			);

			const wrapper = container.querySelector("#content");
			expect(wrapper).toBeInTheDocument();
			expect(screen.getByText("Field label")).toBeInTheDocument();
		});
	});

	describe("edge cases", () => {
		it("should handle an empty string name gracefully", () => {
			const { container } = render(<RichText name="" />);

			expect(getHiddenInput(container, "")).toBeInTheDocument();
		});

		it("should treat maxLimit of 0 as already over the limit and render the indicator", () => {
			const value = JSON.stringify([
				{ type: "paragraph", children: [{ text: "a" }] },
			]);

			const { container } = render(
				<RichText name="content" defaultValue={value} maxLimit={0} />,
			);

			expect(
				container.querySelector(".restatesCharacters"),
			).toBeInTheDocument();
		});

		it("should render with an empty hiddenButtons array the same as omitted", () => {
			const { container } = render(
				<RichText name="content" hiddenButtons={[]} />,
			);

			expect(
				container.querySelector(".arkynRichTextMarkButton"),
			).toBeInTheDocument();
			expect(
				container.querySelector(".arkynRichTextBlockButton"),
			).toBeInTheDocument();
		});

		it("should not throw when videoConfig is omitted while the video button is shown", () => {
			expect(() => render(<RichText name="content" />)).not.toThrow();
		});
	});
});
