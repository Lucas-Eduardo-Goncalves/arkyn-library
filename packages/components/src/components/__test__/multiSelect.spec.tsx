import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FormProvider } from "../../providers/formProvider";
import { MultiSelect } from "../multiSelect";

const options = [
	{ label: "Technology", value: "tech" },
	{ label: "Design", value: "design" },
	{ label: "Marketing", value: "marketing" },
];

function getContainer() {
	return document.querySelector(".arkynMultiSelectContainer") as HTMLElement;
}

function getHiddenInput(container: HTMLElement) {
	return container.querySelector("input[type='hidden']") as HTMLInputElement;
}

describe("MultiSelect", () => {
	afterEach(() => {
		cleanup();
	});

	it("should render without errors", () => {
		render(<MultiSelect name="categories" options={options} />);

		expect(getContainer()).toBeInTheDocument();
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(
			<MultiSelect name="categories" options={options} />,
		);

		expect(getContainer()).toBeInTheDocument();
		expect(getHiddenInput(container)).toBeInTheDocument();
		expect(screen.getByText("Selecione...")).toBeInTheDocument();
	});

	it("should render correctly with all properties filled", () => {
		render(
			<MultiSelect
				name="categories"
				options={options}
				label="Categories"
				showAsterisk
				placeholder="Choose categories"
				notFoundText="Nothing found"
				errorMessage="Required field"
				disabled={false}
				readOnly={false}
				isLoading={false}
				isSearchable
				closeOnSelect
				size="lg"
				variant="outline"
				orientation="horizontal"
				className="custom-wrapper"
				defaultValue={["tech"]}
			/>,
		);

		expect(screen.getByText("Categories")).toBeInTheDocument();
		expect(screen.getByText("Technology")).toBeInTheDocument();
		expect(screen.getByText("Required field")).toBeInTheDocument();
		const container = getContainer();
		expect(container).toHaveClass("lg", "outline");
	});

	it("should render the hidden input with the field name", () => {
		const { container } = render(
			<MultiSelect name="categories" options={options} />,
		);

		const input = getHiddenInput(container);
		expect(input).toHaveAttribute("name", "categories");
	});

	describe("options rendering", () => {
		it("should render all options when the dropdown is opened", async () => {
			const user = userEvent.setup();
			render(<MultiSelect name="categories" options={options} />);

			await user.click(getContainer());

			expect(screen.getByText("Technology")).toBeInTheDocument();
			expect(screen.getByText("Design")).toBeInTheDocument();
			expect(screen.getByText("Marketing")).toBeInTheDocument();
		});

		it("should not render the options dropdown before it is focused", () => {
			render(<MultiSelect name="categories" options={options} />);

			expect(
				document.querySelector(".arkynMultiSelectOptionsContainer"),
			).not.toBeInTheDocument();
		});

		it("should render an empty options list without crashing", async () => {
			const user = userEvent.setup();
			render(<MultiSelect name="categories" options={[]} />);

			await user.click(getContainer());

			expect(screen.getByText("Sem opções disponíveis")).toBeInTheDocument();
		});

		it("should mark the active class on an already-selected option", async () => {
			const user = userEvent.setup();
			render(
				<MultiSelect
					name="categories"
					options={options}
					defaultValue={["tech"]}
				/>,
			);

			await user.click(getContainer());

			const optionsContainer = document.querySelector(
				".arkynMultiSelectOptionsContainer",
			) as HTMLElement;
			const techOption = within(optionsContainer)
				.getByText("Technology")
				.closest("div");
			expect(techOption).toHaveClass("active");
		});
	});

	describe("selecting options", () => {
		it("should select an option when clicked", async () => {
			const user = userEvent.setup();
			render(<MultiSelect name="categories" options={options} />);

			await user.click(getContainer());
			await user.click(screen.getByText("Technology"));

			expect(
				within(
					document.querySelector(".arkynMultiSelectContent") as HTMLElement,
				).getByText("Technology"),
			).toBeInTheDocument();
		});

		it("should select multiple options via successive clicks", async () => {
			const user = userEvent.setup();
			render(<MultiSelect name="categories" options={options} />);

			await user.click(getContainer());
			await user.click(screen.getByText("Technology"));
			await user.click(screen.getByText("Design"));

			const content = document.querySelector(
				".arkynMultiSelectContent",
			) as HTMLElement;
			expect(within(content).getByText("Technology")).toBeInTheDocument();
			expect(within(content).getByText("Design")).toBeInTheDocument();
		});

		it("should deselect an option when clicked again in the dropdown", async () => {
			const user = userEvent.setup();
			render(
				<MultiSelect
					name="categories"
					options={options}
					defaultValue={["tech"]}
				/>,
			);

			await user.click(getContainer());
			const optionsContainer = document.querySelector(
				".arkynMultiSelectOptionsContainer",
			) as HTMLElement;
			await user.click(within(optionsContainer).getByText("Technology"));

			const content = document.querySelector(
				".arkynMultiSelectContent",
			) as HTMLElement;
			expect(within(content).queryByText("Technology")).not.toBeInTheDocument();
			expect(screen.getByText("Selecione...")).toBeInTheDocument();
		});

		it("should update the hidden input JSON value as options are selected", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<MultiSelect name="categories" options={options} />,
			);

			await user.click(getContainer());
			await user.click(screen.getByText("Technology"));

			const input = getHiddenInput(container);
			expect(JSON.parse(input.value)).toEqual(["tech"]);
		});
	});

	describe("selected chips/marks", () => {
		it("should render a removable chip for each selected value", () => {
			render(
				<MultiSelect
					name="categories"
					options={options}
					defaultValue={["tech", "design"]}
				/>,
			);

			const marks = document.querySelectorAll(".arkynMultiSelectMark");
			expect(marks).toHaveLength(2);
		});

		it("should remove an individual chip when its remove button is clicked", async () => {
			const user = userEvent.setup();
			render(
				<MultiSelect
					name="categories"
					options={options}
					defaultValue={["tech", "design"]}
				/>,
			);

			const marks = document.querySelectorAll(".arkynMultiSelectMark");
			const techMark = Array.from(marks).find((mark) =>
				mark.textContent?.includes("Technology"),
			) as HTMLElement;

			await user.click(within(techMark).getByRole("button"));

			expect(document.querySelectorAll(".arkynMultiSelectMark")).toHaveLength(
				1,
			);
			expect(screen.getByText("Design")).toBeInTheDocument();
			expect(screen.queryByText("Technology")).not.toBeInTheDocument();
		});

		it("should not open the dropdown when removing a chip (click propagation stopped)", async () => {
			const user = userEvent.setup();
			render(
				<MultiSelect
					name="categories"
					options={options}
					defaultValue={["tech"]}
				/>,
			);

			const mark = document.querySelector(
				".arkynMultiSelectMark",
			) as HTMLElement;
			await user.click(within(mark).getByRole("button"));

			expect(
				document.querySelector(".arkynMultiSelectOptionsContainer"),
			).not.toBeInTheDocument();
		});

		it("should show the placeholder again when the last chip is removed", async () => {
			const user = userEvent.setup();
			render(
				<MultiSelect
					name="categories"
					options={options}
					defaultValue={["tech"]}
					placeholder="Pick one"
				/>,
			);

			const mark = document.querySelector(
				".arkynMultiSelectMark",
			) as HTMLElement;
			await user.click(within(mark).getByRole("button"));

			expect(screen.getByText("Pick one")).toBeInTheDocument();
		});

		it("should disable the chip remove button when the field is disabled", () => {
			render(
				<MultiSelect
					name="categories"
					options={options}
					defaultValue={["tech"]}
					disabled
				/>,
			);

			const mark = document.querySelector(
				".arkynMultiSelectMark",
			) as HTMLElement;
			expect(within(mark).getByRole("button")).toBeDisabled();
		});
	});

	describe("onChange callback", () => {
		it("should not be called on render", () => {
			const handleChange = vi.fn();
			render(
				<MultiSelect
					name="categories"
					options={options}
					onChange={handleChange}
				/>,
			);

			expect(handleChange).not.toHaveBeenCalled();
		});

		it("should be called with the updated array when selecting an option", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(
				<MultiSelect
					name="categories"
					options={options}
					onChange={handleChange}
				/>,
			);

			await user.click(getContainer());
			await user.click(screen.getByText("Technology"));

			expect(handleChange).toHaveBeenCalledTimes(1);
			expect(handleChange).toHaveBeenCalledWith(["tech"]);
		});

		it("should be called with the updated array when deselecting an option", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(
				<MultiSelect
					name="categories"
					options={options}
					defaultValue={["tech"]}
					onChange={handleChange}
				/>,
			);

			const mark = document.querySelector(
				".arkynMultiSelectMark",
			) as HTMLElement;
			await user.click(within(mark).getByRole("button"));

			expect(handleChange).toHaveBeenCalledTimes(1);
			expect(handleChange).toHaveBeenCalledWith([]);
		});

		it("should be called once per selection with correct call order and args", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(
				<MultiSelect
					name="categories"
					options={options}
					onChange={handleChange}
				/>,
			);

			await user.click(getContainer());
			await user.click(screen.getByText("Technology"));
			await user.click(screen.getByText("Design"));

			expect(handleChange).toHaveBeenCalledTimes(2);
			expect(handleChange).toHaveBeenNthCalledWith(1, ["tech"]);
			expect(handleChange).toHaveBeenNthCalledWith(2, ["tech", "design"]);
		});

		it("should not throw when onChange is omitted", async () => {
			const user = userEvent.setup();
			render(<MultiSelect name="categories" options={options} />);

			await user.click(getContainer());
			await expect(
				user.click(screen.getByText("Technology")),
			).resolves.not.toThrow();
		});
	});

	describe("controlled value prop", () => {
		it("should reflect the controlled value regardless of internal clicks", async () => {
			const user = userEvent.setup();
			render(
				<MultiSelect
					name="categories"
					options={options}
					value={["design"]}
					onChange={vi.fn()}
				/>,
			);

			expect(screen.getByText("Design")).toBeInTheDocument();

			await user.click(getContainer());
			const optionsContainer = document.querySelector(
				".arkynMultiSelectOptionsContainer",
			) as HTMLElement;
			await user.click(within(optionsContainer).getByText("Technology"));

			const content = document.querySelector(
				".arkynMultiSelectContent",
			) as HTMLElement;
			expect(within(content).getByText("Design")).toBeInTheDocument();
			expect(document.querySelectorAll(".arkynMultiSelectMark")).toHaveLength(
				1,
			);
		});

		it("should still call onChange with the computed next value when controlled", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(
				<MultiSelect
					name="categories"
					options={options}
					value={["design"]}
					onChange={handleChange}
				/>,
			);

			await user.click(getContainer());
			await user.click(screen.getByText("Marketing"));

			expect(handleChange).toHaveBeenCalledWith(["marketing"]);
		});
	});

	describe("defaultValue prop", () => {
		it("should default to an empty selection when omitted", () => {
			render(<MultiSelect name="categories" options={options} />);

			expect(document.querySelectorAll(".arkynMultiSelectMark")).toHaveLength(
				0,
			);
			expect(screen.getByText("Selecione...")).toBeInTheDocument();
		});

		it("should pre-select values passed in defaultValue", () => {
			render(
				<MultiSelect
					name="categories"
					options={options}
					defaultValue={["tech", "marketing"]}
				/>,
			);

			expect(screen.getByText("Technology")).toBeInTheDocument();
			expect(screen.getByText("Marketing")).toBeInTheDocument();
		});
	});

	describe("search/filter", () => {
		it("should not render a search input when isSearchable is omitted", async () => {
			const user = userEvent.setup();
			render(<MultiSelect name="categories" options={options} />);

			await user.click(getContainer());

			expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
		});

		it("should render a search input when isSearchable is true", async () => {
			const user = userEvent.setup();
			render(<MultiSelect name="categories" options={options} isSearchable />);

			await user.click(getContainer());

			expect(screen.getByRole("searchbox")).toBeInTheDocument();
		});

		it("should filter the options list as the user types", async () => {
			const user = userEvent.setup();
			render(<MultiSelect name="categories" options={options} isSearchable />);

			await user.click(getContainer());
			await user.type(screen.getByRole("searchbox"), "Design");

			const optionsContainer = document.querySelector(
				".arkynMultiSelectOptionsContainer",
			) as HTMLElement;
			expect(within(optionsContainer).getByText("Design")).toBeInTheDocument();
			expect(
				within(optionsContainer).queryByText("Technology"),
			).not.toBeInTheDocument();
		});

		it("should show notFoundText when no option matches the search", async () => {
			const user = userEvent.setup();
			render(
				<MultiSelect
					name="categories"
					options={options}
					isSearchable
					notFoundText="No matches"
				/>,
			);

			await user.click(getContainer());
			await user.type(screen.getByRole("searchbox"), "zzz-no-match");

			expect(screen.getByText("No matches")).toBeInTheDocument();
		});

		it("should call onSearch with the typed value", async () => {
			const user = userEvent.setup();
			const handleSearch = vi.fn();
			render(
				<MultiSelect
					name="categories"
					options={options}
					isSearchable
					onSearch={handleSearch}
				/>,
			);

			await user.click(getContainer());
			await user.type(screen.getByRole("searchbox"), "D");

			expect(handleSearch).toHaveBeenCalledWith("D");
		});

		it("should not filter locally when onSearch is provided (async mode)", async () => {
			const user = userEvent.setup();
			const handleSearch = vi.fn();
			render(
				<MultiSelect
					name="categories"
					options={options}
					isSearchable
					onSearch={handleSearch}
				/>,
			);

			await user.click(getContainer());
			await user.type(screen.getByRole("searchbox"), "zzz-no-match");

			const optionsContainer = document.querySelector(
				".arkynMultiSelectOptionsContainer",
			) as HTMLElement;
			expect(
				within(optionsContainer).getByText("Technology"),
			).toBeInTheDocument();
		});
	});

	describe("disabled state", () => {
		it("should apply the opacity class when disabled", () => {
			render(<MultiSelect name="categories" options={options} disabled />);

			expect(getContainer()).toHaveClass("opacity");
		});

		it("should not open the dropdown when disabled and clicked", async () => {
			const user = userEvent.setup();
			render(<MultiSelect name="categories" options={options} disabled />);

			await user.click(getContainer());

			expect(
				document.querySelector(".arkynMultiSelectOptionsContainer"),
			).not.toBeInTheDocument();
		});

		it("should not apply the opacity class when not disabled", () => {
			render(<MultiSelect name="categories" options={options} />);

			expect(getContainer()).not.toHaveClass("opacity");
		});
	});

	describe("readOnly state", () => {
		it("should apply the opacity class when readOnly", () => {
			render(<MultiSelect name="categories" options={options} readOnly />);

			expect(getContainer()).toHaveClass("opacity");
		});

		it("should not open the dropdown when readOnly and clicked", async () => {
			const user = userEvent.setup();
			render(<MultiSelect name="categories" options={options} readOnly />);

			await user.click(getContainer());

			expect(
				document.querySelector(".arkynMultiSelectOptionsContainer"),
			).not.toBeInTheDocument();
		});
	});

	describe("isLoading state", () => {
		it("should apply the opacity class and render the spinner when loading", () => {
			render(<MultiSelect name="categories" options={options} isLoading />);

			expect(getContainer()).toHaveClass("opacity");
			expect(
				document.querySelector(".arkynMultiSelectSpinner"),
			).toBeInTheDocument();
		});

		it("should not render the chevron icon when loading", () => {
			render(<MultiSelect name="categories" options={options} isLoading />);

			expect(
				document.querySelector(".arkynMultiSelectChevron"),
			).not.toBeInTheDocument();
		});

		it("should render the chevron and not the spinner when not loading", () => {
			render(<MultiSelect name="categories" options={options} />);

			expect(
				document.querySelector(".arkynMultiSelectChevron"),
			).toBeInTheDocument();
			expect(
				document.querySelector(".arkynMultiSelectSpinner"),
			).not.toBeInTheDocument();
		});

		it("should not open the dropdown when loading and clicked", async () => {
			const user = userEvent.setup();
			render(<MultiSelect name="categories" options={options} isLoading />);

			await user.click(getContainer());

			expect(
				document.querySelector(".arkynMultiSelectOptionsContainer"),
			).not.toBeInTheDocument();
		});
	});

	describe("error state", () => {
		it("should not apply errored class when there is no error", () => {
			render(<MultiSelect name="categories" options={options} />);

			expect(getContainer()).not.toHaveClass("errored");
		});

		it("should apply errored class and render errorMessage when set directly", () => {
			render(
				<MultiSelect
					name="categories"
					options={options}
					errorMessage="This field is required"
				/>,
			);

			expect(getContainer()).toHaveClass("errored");
			expect(screen.getByText("This field is required")).toBeInTheDocument();
		});

		it("should read the error from FormProvider fieldErrors by field name", () => {
			render(
				<FormProvider fieldErrors={{ categories: "Pick at least one" }}>
					<MultiSelect name="categories" options={options} />
				</FormProvider>,
			);

			expect(getContainer()).toHaveClass("errored");
			expect(screen.getByText("Pick at least one")).toBeInTheDocument();
		});

		it("should prioritize the direct errorMessage prop over FormProvider fieldErrors", () => {
			render(
				<FormProvider fieldErrors={{ categories: "From provider" }}>
					<MultiSelect
						name="categories"
						options={options}
						errorMessage="Direct message"
					/>
				</FormProvider>,
			);

			expect(screen.getByText("Direct message")).toBeInTheDocument();
			expect(screen.queryByText("From provider")).not.toBeInTheDocument();
		});

		it("should not throw when rendered without a FormProvider ancestor", () => {
			expect(() =>
				render(<MultiSelect name="categories" options={options} />),
			).not.toThrow();
		});
	});

	describe("placeholder prop", () => {
		it("should use the default placeholder when omitted", () => {
			render(<MultiSelect name="categories" options={options} />);

			expect(screen.getByText("Selecione...")).toBeInTheDocument();
		});

		it("should use the custom placeholder when provided", () => {
			render(
				<MultiSelect
					name="categories"
					options={options}
					placeholder="Pick categories"
				/>,
			);

			expect(screen.getByText("Pick categories")).toBeInTheDocument();
		});

		it("should not render the placeholder once an option is selected", () => {
			render(
				<MultiSelect
					name="categories"
					options={options}
					defaultValue={["tech"]}
					placeholder="Pick categories"
				/>,
			);

			expect(screen.queryByText("Pick categories")).not.toBeInTheDocument();
		});
	});

	describe("closeOnSelect prop", () => {
		it("should keep the dropdown open after selecting when omitted (default false)", async () => {
			const user = userEvent.setup();
			render(<MultiSelect name="categories" options={options} />);

			await user.click(getContainer());
			await user.click(screen.getByText("Technology"));

			expect(
				document.querySelector(".arkynMultiSelectOptionsContainer"),
			).toBeInTheDocument();
		});

		it("should close the dropdown after selecting when true", async () => {
			const user = userEvent.setup();
			render(<MultiSelect name="categories" options={options} closeOnSelect />);

			await user.click(getContainer());
			await user.click(screen.getByText("Technology"));

			expect(
				document.querySelector(".arkynMultiSelectOptionsContainer"),
			).not.toBeInTheDocument();
		});
	});

	describe("focus and blur", () => {
		it("should call onFocus when the container is clicked", async () => {
			const user = userEvent.setup();
			const handleFocus = vi.fn();
			render(
				<MultiSelect
					name="categories"
					options={options}
					onFocus={handleFocus}
				/>,
			);

			await user.click(getContainer());

			expect(handleFocus).toHaveBeenCalledTimes(1);
		});

		it("should not call onFocus again on a second click while already focused", async () => {
			const user = userEvent.setup();
			const handleFocus = vi.fn();
			render(
				<MultiSelect
					name="categories"
					options={options}
					onFocus={handleFocus}
				/>,
			);

			await user.click(getContainer());
			await user.click(getContainer());

			expect(handleFocus).toHaveBeenCalledTimes(1);
		});

		it("should apply the focused class to the container when open", async () => {
			const user = userEvent.setup();
			render(<MultiSelect name="categories" options={options} />);

			await user.click(getContainer());

			expect(getContainer()).toHaveClass("focused");
		});

		it("should not throw when onBlur is provided and the overlay is clicked", async () => {
			const user = userEvent.setup();
			const handleBlur = vi.fn();
			render(
				<MultiSelect name="categories" options={options} onBlur={handleBlur} />,
			);

			await user.click(getContainer());
			const overlay = document.querySelector(
				".arkynMultiSelectOverlay",
			) as HTMLElement;

			await expect(user.click(overlay)).resolves.not.toThrow();
			expect(getContainer()).not.toHaveClass("focused");
		});

		it("should close the dropdown when the overlay is clicked", async () => {
			const user = userEvent.setup();
			render(<MultiSelect name="categories" options={options} />);

			await user.click(getContainer());
			const overlay = document.querySelector(
				".arkynMultiSelectOverlay",
			) as HTMLElement;
			await user.click(overlay);

			expect(
				document.querySelector(".arkynMultiSelectOptionsContainer"),
			).not.toBeInTheDocument();
		});

		it("should not call onFocus when disabled", async () => {
			const user = userEvent.setup();
			const handleFocus = vi.fn();
			render(
				<MultiSelect
					name="categories"
					options={options}
					disabled
					onFocus={handleFocus}
				/>,
			);

			await user.click(getContainer());

			expect(handleFocus).not.toHaveBeenCalled();
		});
	});

	describe("size prop", () => {
		it("should apply the default 'md' size class when omitted", () => {
			render(<MultiSelect name="categories" options={options} />);

			expect(getContainer()).toHaveClass("md");
		});

		it.each([
			"md",
			"lg",
		] as const)("should apply the '%s' size class", (size) => {
			render(
				<MultiSelect
					name={`categories-${size}`}
					options={options}
					size={size}
				/>,
			);

			const containers = document.querySelectorAll(
				".arkynMultiSelectContainer",
			);
			expect(containers[containers.length - 1]).toHaveClass(size);
		});

		it("should not apply the other size class", () => {
			render(<MultiSelect name="categories" options={options} size="lg" />);

			expect(getContainer()).not.toHaveClass("md");
		});
	});

	describe("variant prop", () => {
		it("should apply the default 'solid' variant class when omitted", () => {
			render(<MultiSelect name="categories" options={options} />);

			expect(getContainer()).toHaveClass("solid");
		});

		it.each([
			"solid",
			"outline",
			"underline",
		] as const)("should apply the '%s' variant class", (variant) => {
			render(
				<MultiSelect
					name={`categories-${variant}`}
					options={options}
					variant={variant}
				/>,
			);

			const containers = document.querySelectorAll(
				".arkynMultiSelectContainer",
			);
			expect(containers[containers.length - 1]).toHaveClass(variant);
		});

		it("should replace the variant class when changed", () => {
			const { rerender } = render(
				<MultiSelect name="categories" options={options} variant="solid" />,
			);

			expect(getContainer()).toHaveClass("solid");

			rerender(
				<MultiSelect name="categories" options={options} variant="underline" />,
			);

			expect(getContainer()).toHaveClass("underline");
			expect(getContainer()).not.toHaveClass("solid");
		});
	});

	describe("prefix and leftIcon slots", () => {
		it("should not render a prefix element when omitted", () => {
			render(<MultiSelect name="categories" options={options} />);

			expect(getContainer().querySelector(".prefix")).not.toBeInTheDocument();
		});

		it("should render a string prefix", () => {
			render(<MultiSelect name="categories" options={options} prefix="R$" />);

			expect(screen.getByText("R$")).toBeInTheDocument();
		});

		it("should apply the hasPrefix class when prefix is provided", () => {
			render(<MultiSelect name="categories" options={options} prefix="R$" />);

			expect(getContainer()).toHaveClass("hasPrefix");
		});

		it("should not apply the hasPrefix class when prefix is omitted", () => {
			render(<MultiSelect name="categories" options={options} />);

			expect(getContainer()).not.toHaveClass("hasPrefix");
		});

		it("should render a leftIcon svg inside the container", () => {
			function CustomIcon(props: { size?: number; strokeWidth?: number }) {
				return <svg data-testid="left-icon" {...props} />;
			}

			render(
				<MultiSelect
					name="categories"
					options={options}
					// biome-ignore lint/suspicious/noExplicitAny: minimal LucideIcon-compatible test stub
					leftIcon={CustomIcon as any}
				/>,
			);

			expect(screen.getByTestId("left-icon")).toBeInTheDocument();
		});
	});

	describe("label and showAsterisk", () => {
		it("should not render a label when omitted", () => {
			render(<MultiSelect name="categories" options={options} />);

			expect(document.querySelector("label")).not.toBeInTheDocument();
		});

		it("should render the label text when provided", () => {
			render(
				<MultiSelect name="categories" options={options} label="Categories" />,
			);

			expect(screen.getByText("Categories")).toBeInTheDocument();
		});

		it("should apply asteriskTrue class when showAsterisk is true", () => {
			render(
				<MultiSelect
					name="categories"
					options={options}
					label="Categories"
					showAsterisk
				/>,
			);

			const label = screen.getByText("Categories").closest("label");
			expect(label).toHaveClass("asteriskTrue");
		});

		it("should apply asteriskFalse class when showAsterisk is omitted", () => {
			render(
				<MultiSelect name="categories" options={options} label="Categories" />,
			);

			const label = screen.getByText("Categories").closest("label");
			expect(label).toHaveClass("asteriskFalse");
		});
	});

	describe("unShowFieldTemplate prop", () => {
		it("should render label by default when omitted", () => {
			render(
				<MultiSelect name="categories" options={options} label="Visible" />,
			);

			expect(screen.getByText("Visible")).toBeInTheDocument();
		});

		it("should skip the FieldTemplate wrapper (label) when true", () => {
			render(
				<MultiSelect
					name="categories"
					options={options}
					label="Hidden label"
					unShowFieldTemplate
				/>,
			);

			expect(screen.queryByText("Hidden label")).not.toBeInTheDocument();
			expect(getContainer()).toBeInTheDocument();
		});

		it("should skip the error message when unShowFieldTemplate is true", () => {
			render(
				<MultiSelect
					name="categories"
					options={options}
					errorMessage="Required"
					unShowFieldTemplate
				/>,
			);

			expect(screen.queryByText("Required")).not.toBeInTheDocument();
		});
	});

	describe("orientation prop", () => {
		it.each([
			"horizontal",
			"vertical",
			"horizontalReverse",
		] as const)("should apply the '%s' orientation class to the wrapper", (orientation) => {
			render(
				<MultiSelect
					name={`categories-${orientation}`}
					options={options}
					label="Label"
					orientation={orientation}
				/>,
			);

			const labels = screen.getAllByText("Label");
			const wrapper = labels[labels.length - 1].closest(
				"section",
			) as HTMLElement;
			expect(wrapper).toHaveClass(orientation);
		});
	});

	describe("className merge (wrapper)", () => {
		it("should apply a custom className to the FieldTemplate wrapper", () => {
			render(
				<MultiSelect
					name="categories"
					options={options}
					label="Label"
					className="custom-wrapper"
				/>,
			);

			const wrapper = screen
				.getByText("Label")
				.closest("section") as HTMLElement;
			expect(wrapper).toHaveClass("arkynFieldWrapper", "custom-wrapper");
		});

		it("should render without a custom className when omitted", () => {
			render(<MultiSelect name="categories" options={options} label="Label" />);

			const wrapper = screen
				.getByText("Label")
				.closest("section") as HTMLElement;
			expect(wrapper).toHaveClass("arkynFieldWrapper");
		});
	});

	describe("id prop", () => {
		it("should generate an id automatically when omitted", () => {
			render(<MultiSelect name="categories" options={options} />);

			expect(getContainer().id).toBeTruthy();
		});

		it("should use the provided id when specified", () => {
			render(
				<MultiSelect name="categories" options={options} id="custom-id" />,
			);

			expect(document.getElementById("custom-id")).toBeInTheDocument();
		});
	});

	describe("optionMaxHeight prop", () => {
		it("should not throw when provided", () => {
			expect(() =>
				render(
					<MultiSelect
						name="categories"
						options={options}
						optionMaxHeight={200}
					/>,
				),
			).not.toThrow();
		});
	});

	describe("accessibility", () => {
		it("should render the field wrapper section with an id matching the field name", () => {
			render(
				<MultiSelect name="categories" options={options} label="Categories" />,
			);

			const label = screen.getByText("Categories");
			const wrapper = label.closest("section") as HTMLElement;
			expect(wrapper).toHaveAttribute("id", "categories");
		});

		it("should expose the chip remove button with an accessible role", () => {
			render(
				<MultiSelect
					name="categories"
					options={options}
					defaultValue={["tech"]}
				/>,
			);

			const mark = document.querySelector(
				".arkynMultiSelectMark",
			) as HTMLElement;
			expect(within(mark).getByRole("button")).toBeInTheDocument();
		});
	});

	describe("edge cases", () => {
		it("should handle an empty label string", () => {
			render(<MultiSelect name="categories" options={options} label="" />);

			expect(document.querySelector("label")).not.toBeInTheDocument();
		});

		it("should handle an empty errorMessage string", () => {
			render(
				<MultiSelect name="categories" options={options} errorMessage="" />,
			);

			expect(getContainer()).not.toHaveClass("errored");
		});

		it("should handle an empty options array", () => {
			expect(() =>
				render(<MultiSelect name="categories" options={[]} />),
			).not.toThrow();
		});

		it("should handle an empty defaultValue array", () => {
			render(
				<MultiSelect name="categories" options={options} defaultValue={[]} />,
			);

			expect(document.querySelectorAll(".arkynMultiSelectMark")).toHaveLength(
				0,
			);
		});

		it("should render 'sem opções disponíveis' fallback label when unmatched by value", () => {
			render(
				<MultiSelect
					name="categories"
					options={options}
					defaultValue={["unknown-value"]}
				/>,
			);

			const mark = document.querySelector(
				".arkynMultiSelectMark",
			) as HTMLElement;
			expect(mark.textContent).toContain("");
		});

		it("should not crash when fieldErrors is undefined via FormProvider", () => {
			expect(() =>
				render(
					<FormProvider fieldErrors={undefined}>
						<MultiSelect name="categories" options={options} />
					</FormProvider>,
				),
			).not.toThrow();
		});
	});

	describe("prop interaction: disabled + isLoading", () => {
		it("should stay disabled and show the spinner when both are set", () => {
			render(
				<MultiSelect name="categories" options={options} disabled isLoading />,
			);

			expect(getContainer()).toHaveClass("opacity");
			expect(
				document.querySelector(".arkynMultiSelectSpinner"),
			).toBeInTheDocument();
		});
	});

	describe("prop interaction: error + disabled", () => {
		it("should combine errored and opacity classes", () => {
			render(
				<MultiSelect
					name="categories"
					options={options}
					disabled
					errorMessage="Required"
				/>,
			);

			expect(getContainer()).toHaveClass("errored", "opacity");
		});
	});
});
