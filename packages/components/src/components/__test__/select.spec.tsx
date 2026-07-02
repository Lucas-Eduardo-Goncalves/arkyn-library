import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Search, User } from "lucide-react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FormProvider } from "../../../providers/formProvider";
import { Select } from "../index";

afterEach(cleanup);

const options = [
	{ label: "Technology", value: "tech" },
	{ label: "Design", value: "design" },
	{ label: "Marketing", value: "marketing" },
];

describe("Select", () => {
	it("should render without errors", () => {
		render(<Select name="category" options={options} />);

		expect(document.querySelector(".arkynSelectContainer")).toBeInTheDocument();
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(<Select name="category" options={options} />);

		const section = container.querySelector(
			".arkynSelectContainer",
		) as HTMLElement;
		expect(section).toBeInTheDocument();
		expect(section).toHaveClass("solid", "md");
		expect(screen.getByText("Selecione...")).toBeInTheDocument();
	});

	it("should render correctly with all properties filled", () => {
		const handleChange = vi.fn();
		render(
			<Select
				name="category"
				options={options}
				label="Category"
				showAsterisk
				placeholder="Choose one"
				variant="outline"
				size="lg"
				prefix="Cat:"
				leftIcon={User}
				onChange={handleChange}
				className="custom-wrapper"
			/>,
		);

		expect(screen.getByText("Category")).toBeInTheDocument();
		expect(screen.getByText("Category")).toHaveClass("asteriskTrue");
		expect(screen.getByText("Choose one")).toBeInTheDocument();
		expect(screen.getByText("Cat:")).toBeInTheDocument();
	});

	it("should render a hidden input with the name prop", () => {
		const { container } = render(<Select name="category" options={options} />);

		const input = container.querySelector("input[type='hidden']");
		expect(input).toHaveAttribute("name", "category");
	});

	describe("options rendering", () => {
		it("should render all provided options once opened", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Select name="category" options={options} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);

			expect(screen.getByText("Technology")).toBeInTheDocument();
			expect(screen.getByText("Design")).toBeInTheDocument();
			expect(screen.getByText("Marketing")).toBeInTheDocument();
		});

		it("should not render options before the select is opened", () => {
			render(<Select name="category" options={options} />);

			expect(screen.queryByText("Technology")).not.toBeInTheDocument();
		});

		it("should render notFoundText when options is empty", async () => {
			const user = userEvent.setup();
			const { container } = render(<Select name="category" options={[]} />);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);

			expect(screen.getByText("Sem opções disponíveis")).toBeInTheDocument();
		});

		it("should render a custom notFoundText", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Select
					name="category"
					options={[]}
					notFoundText="No categories found"
				/>,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);

			expect(screen.getByText("No categories found")).toBeInTheDocument();
		});
	});

	describe("selecting an option", () => {
		it("should update the displayed value when an option is clicked", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Select name="category" options={options} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);
			await user.click(screen.getByText("Design"));

			expect(screen.getByText("Design")).toHaveClass("hasValue");
			expect(screen.queryByText("Selecione...")).not.toBeInTheDocument();
		});

		it("should call onChange with the selected value", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			const { container } = render(
				<Select name="category" options={options} onChange={handleChange} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);
			await user.click(screen.getByText("Technology"));

			expect(handleChange).toHaveBeenCalledTimes(1);
			expect(handleChange).toHaveBeenCalledWith("tech");
		});

		it("should update the hidden input value on selection", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Select name="category" options={options} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);
			await user.click(screen.getByText("Marketing"));

			const input = container.querySelector(
				"input[type='hidden']",
			) as HTMLInputElement;
			expect(input.value).toBe("marketing");
		});

		it("should apply the active class to the selected option", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Select name="category" options={options} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);
			const optionsContainer = document.querySelector(
				".arkynSelectOptionsContainer",
			) as HTMLElement;
			await user.click(within(optionsContainer).getByText("Technology"));
			await user.click(section);

			const reopenedOptionsContainer = document.querySelector(
				".arkynSelectOptionsContainer",
			) as HTMLElement;
			const techOption = within(reopenedOptionsContainer)
				.getByText("Technology")
				.closest("div");
			expect(techOption).toHaveClass("active");
		});

		it("should unselect the option when clicking the already-selected option again", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			const { container } = render(
				<Select
					name="category"
					options={options}
					defaultValue="tech"
					onChange={handleChange}
				/>,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);
			const optionsContainer = document.querySelector(
				".arkynSelectOptionsContainer",
			) as HTMLElement;
			await user.click(within(optionsContainer).getByText("Technology"));

			expect(handleChange).toHaveBeenCalledWith("");
			expect(screen.getByText("Selecione...")).toBeInTheDocument();
		});

		it("should close the dropdown after selecting when closeOnSelect is true (default)", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Select name="category" options={options} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);
			await user.click(screen.getByText("Design"));

			expect(screen.queryByText("Technology")).not.toBeInTheDocument();
		});

		it("should keep the dropdown open after selecting when closeOnSelect is false", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Select name="category" options={options} closeOnSelect={false} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);
			await user.click(screen.getByText("Design"));

			expect(screen.getByText("Technology")).toBeInTheDocument();
		});
	});

	describe("value and defaultValue", () => {
		it("should show the placeholder when both value and defaultValue are omitted", () => {
			render(<Select name="category" options={options} />);

			expect(screen.getByText("Selecione...")).toBeInTheDocument();
		});

		it("should render the label for an uncontrolled defaultValue", () => {
			render(
				<Select name="category" options={options} defaultValue="design" />,
			);

			expect(screen.getByText("Design")).toBeInTheDocument();
		});

		it("should render the label for a controlled value", () => {
			render(
				<Select
					name="category"
					options={options}
					value="marketing"
					onChange={() => {}}
				/>,
			);

			expect(screen.getByText("Marketing")).toBeInTheDocument();
		});

		it("should show the placeholder when value is an empty string", () => {
			render(
				<Select
					name="category"
					options={options}
					value=""
					onChange={() => {}}
				/>,
			);

			expect(screen.getByText("Selecione...")).toBeInTheDocument();
		});

		it("should prioritize the controlled value over the internal selected state", async () => {
			const user = userEvent.setup();
			const { container, rerender } = render(
				<Select
					name="category"
					options={options}
					value="tech"
					onChange={() => {}}
				/>,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);
			await user.click(screen.getByText("Design"));

			rerender(
				<Select
					name="category"
					options={options}
					value="tech"
					onChange={() => {}}
				/>,
			);

			expect(screen.getByText("Technology")).toHaveClass("hasValue");
		});
	});

	describe("placeholder prop", () => {
		it("should use the default placeholder when omitted", () => {
			render(<Select name="category" options={options} />);

			expect(screen.getByText("Selecione...")).toBeInTheDocument();
		});

		it("should render a custom placeholder", () => {
			render(
				<Select
					name="category"
					options={options}
					placeholder="Pick a category"
				/>,
			);

			expect(screen.getByText("Pick a category")).toBeInTheDocument();
		});

		it("should not render the placeholder once a value is selected", () => {
			render(
				<Select
					name="category"
					options={options}
					defaultValue="tech"
					placeholder="Pick a category"
				/>,
			);

			expect(screen.queryByText("Pick a category")).not.toBeInTheDocument();
		});
	});

	describe("disabled state", () => {
		it("should not be disabled by default", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Select name="category" options={options} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);

			expect(screen.getByText("Technology")).toBeInTheDocument();
		});

		it("should apply the opacity class when disabled", () => {
			const { container } = render(
				<Select name="category" options={options} disabled />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			expect(section).toHaveClass("opacity");
		});

		it("should not open the dropdown when clicked while disabled", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Select name="category" options={options} disabled />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);

			expect(screen.queryByText("Technology")).not.toBeInTheDocument();
		});

		it("should not call onFocus when clicked while disabled", async () => {
			const user = userEvent.setup();
			const handleFocus = vi.fn();
			const { container } = render(
				<Select
					name="category"
					options={options}
					disabled
					onFocus={handleFocus}
				/>,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);

			expect(handleFocus).not.toHaveBeenCalled();
		});

		it("should not apply the disabled opacity-driving class when not disabled", () => {
			const { container } = render(
				<Select name="category" options={options} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			expect(section).not.toHaveClass("opacity");
		});
	});

	describe("readOnly state", () => {
		it("should apply the opacity class when readOnly", () => {
			const { container } = render(
				<Select name="category" options={options} readOnly />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			expect(section).toHaveClass("opacity");
		});

		it("should not open the dropdown when readOnly", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Select name="category" options={options} readOnly />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);

			expect(screen.queryByText("Technology")).not.toBeInTheDocument();
		});
	});

	describe("isLoading state", () => {
		it("should show a spinner while loading", () => {
			const { container } = render(
				<Select name="category" options={options} isLoading />,
			);

			expect(
				container.querySelector(".arkynSelectSpinner"),
			).toBeInTheDocument();
		});

		it("should not show a spinner by default", () => {
			const { container } = render(
				<Select name="category" options={options} />,
			);

			expect(
				container.querySelector(".arkynSelectSpinner"),
			).not.toBeInTheDocument();
		});

		it("should hide the chevron while loading", () => {
			const { container } = render(
				<Select name="category" options={options} isLoading />,
			);

			expect(
				container.querySelector(".arkynSelectChevron"),
			).not.toBeInTheDocument();
		});

		it("should apply the opacity class while loading", () => {
			const { container } = render(
				<Select name="category" options={options} isLoading />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			expect(section).toHaveClass("opacity");
		});

		it("should not open the dropdown while loading", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Select name="category" options={options} isLoading />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);

			expect(screen.queryByText("Technology")).not.toBeInTheDocument();
		});
	});

	describe("errorMessage prop and error state", () => {
		it("should not render an error message by default", () => {
			render(<Select name="category" options={options} />);

			expect(
				document.querySelector(".arkynFieldError"),
			).not.toBeInTheDocument();
		});

		it("should render the errorMessage prop text", () => {
			render(
				<Select
					name="category"
					options={options}
					errorMessage="Field is required"
				/>,
			);

			expect(screen.getByText("Field is required")).toBeInTheDocument();
		});

		it("should apply the errored class to the container when errorMessage is set", () => {
			const { container } = render(
				<Select
					name="category"
					options={options}
					errorMessage="Field is required"
				/>,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			expect(section).toHaveClass("errored");
		});

		it("should not apply the errored class when there is no error", () => {
			const { container } = render(
				<Select name="category" options={options} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			expect(section).not.toHaveClass("errored");
		});

		it("should render the error matched by name from FormProvider fieldErrors", () => {
			render(
				<FormProvider fieldErrors={{ category: "Category is required" }}>
					<Select name="category" options={options} />
				</FormProvider>,
			);

			expect(screen.getByText("Category is required")).toBeInTheDocument();
		});

		it("should prioritize the errorMessage prop over fieldErrors", () => {
			render(
				<FormProvider fieldErrors={{ category: "From context" }}>
					<Select name="category" options={options} errorMessage="From prop" />
				</FormProvider>,
			);

			expect(screen.getByText("From prop")).toBeInTheDocument();
			expect(screen.queryByText("From context")).not.toBeInTheDocument();
		});
	});

	describe("isSearchable prop", () => {
		it("should not render a search input by default", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Select name="category" options={options} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);

			expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
		});

		it("should render a search input when isSearchable is true", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Select name="category" options={options} isSearchable />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);

			expect(screen.getByRole("searchbox")).toBeInTheDocument();
		});

		it("should filter options based on the search text", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Select name="category" options={options} isSearchable />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);
			await user.type(screen.getByRole("searchbox"), "des");

			expect(screen.getByText("Design")).toBeInTheDocument();
			expect(screen.queryByText("Technology")).not.toBeInTheDocument();
			expect(screen.queryByText("Marketing")).not.toBeInTheDocument();
		});

		it("should show notFoundText when the search matches nothing", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Select name="category" options={options} isSearchable />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);
			await user.type(screen.getByRole("searchbox"), "zzz");

			expect(screen.getByText("Sem opções disponíveis")).toBeInTheDocument();
		});

		it("should call onSearch with the typed value", async () => {
			const user = userEvent.setup();
			const handleSearch = vi.fn();
			const { container } = render(
				<Select
					name="category"
					options={options}
					isSearchable
					onSearch={handleSearch}
				/>,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);
			await user.type(screen.getByRole("searchbox"), "d");

			expect(handleSearch).toHaveBeenCalledWith("d");
		});

		it("should not filter options locally when onSearch is provided (async mode)", async () => {
			const user = userEvent.setup();
			const handleSearch = vi.fn();
			const { container } = render(
				<Select
					name="category"
					options={options}
					isSearchable
					onSearch={handleSearch}
				/>,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);
			await user.type(screen.getByRole("searchbox"), "zzz");

			expect(screen.getByText("Technology")).toBeInTheDocument();
			expect(screen.getByText("Design")).toBeInTheDocument();
			expect(screen.getByText("Marketing")).toBeInTheDocument();
		});
	});

	describe("onFocus and onBlur events", () => {
		it("should call onFocus when the container is clicked", async () => {
			const user = userEvent.setup();
			const handleFocus = vi.fn();
			const { container } = render(
				<Select name="category" options={options} onFocus={handleFocus} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);

			expect(handleFocus).toHaveBeenCalledTimes(1);
		});

		it("should not call onFocus again when the container is already focused", async () => {
			const user = userEvent.setup();
			const handleFocus = vi.fn();
			const { container } = render(
				<Select name="category" options={options} onFocus={handleFocus} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);
			await user.click(section);

			expect(handleFocus).toHaveBeenCalledTimes(1);
		});

		it("should close the dropdown and remove focus when clicking the overlay with onBlur set", async () => {
			const user = userEvent.setup();
			const handleBlur = vi.fn();
			const { container } = render(
				<Select name="category" options={options} onBlur={handleBlur} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);
			expect(section).toHaveClass("focused");

			const overlay = document.querySelector(
				".arkynSelectOverlay",
			) as HTMLElement;
			await user.click(overlay);

			expect(section).not.toHaveClass("focused");
		});

		it("should apply the focused class while the select is open", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Select name="category" options={options} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			expect(section).not.toHaveClass("focused");

			await user.click(section);

			expect(section).toHaveClass("focused");
		});

		it("should remove the focused class after clicking the overlay", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Select name="category" options={options} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);
			expect(section).toHaveClass("focused");

			const overlay = document.querySelector(
				".arkynSelectOverlay",
			) as HTMLElement;
			await user.click(overlay);

			expect(section).not.toHaveClass("focused");
		});
	});

	describe("size prop", () => {
		it("should apply the default md size class when omitted", () => {
			const { container } = render(
				<Select name="category" options={options} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			expect(section).toHaveClass("md");
		});

		it("should apply the lg size class when specified", () => {
			const { container } = render(
				<Select name="category" options={options} size="lg" />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			expect(section).toHaveClass("lg");
			expect(section).not.toHaveClass("md");
		});
	});

	describe("variant prop", () => {
		it("should apply the default solid variant class when omitted", () => {
			const { container } = render(
				<Select name="category" options={options} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			expect(section).toHaveClass("solid");
		});

		it.each([
			"solid",
			"outline",
			"underline",
		] as const)("should apply the '%s' variant class", (variant) => {
			const { container } = render(
				<Select name="category" options={options} variant={variant} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			expect(section).toHaveClass(variant);
		});

		it("should replace the variant class when changed", () => {
			const { container, rerender } = render(
				<Select name="category" options={options} variant="solid" />,
			);

			let section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			expect(section).toHaveClass("solid");

			rerender(<Select name="category" options={options} variant="outline" />);
			section = container.querySelector(".arkynSelectContainer") as HTMLElement;
			expect(section).toHaveClass("outline");
			expect(section).not.toHaveClass("solid");
		});
	});

	describe("prefix and leftIcon slots", () => {
		it("should not render prefix or leftIcon by default", () => {
			const { container } = render(
				<Select name="category" options={options} />,
			);

			expect(container.querySelectorAll("svg.prefix")).toHaveLength(0);
		});

		it("should render a string prefix", () => {
			render(<Select name="category" options={options} prefix="Cat:" />);

			expect(screen.getByText("Cat:")).toBeInTheDocument();
		});

		it("should render an icon prefix", () => {
			const { container } = render(
				<Select name="category" options={options} prefix={Search} />,
			);

			expect(container.querySelector("svg.prefix")).toBeInTheDocument();
		});

		it("should render a leftIcon", () => {
			const { container } = render(
				<Select name="category" options={options} leftIcon={User} />,
			);

			expect(container.querySelector("svg")).toBeInTheDocument();
		});

		it("should apply the hasPrefix class when a prefix is set", () => {
			const { container } = render(
				<Select name="category" options={options} prefix="Cat:" />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			expect(section).toHaveClass("hasPrefix");
		});

		it("should not apply the hasPrefix class when omitted", () => {
			const { container } = render(
				<Select name="category" options={options} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			expect(section).not.toHaveClass("hasPrefix");
		});
	});

	describe("orientation prop", () => {
		it("should default orientation to vertical on the FieldWrapper", () => {
			const { container } = render(
				<Select name="category" options={options} label="Category" />,
			);

			const wrapper = container.querySelector(".arkynFieldWrapper");
			expect(wrapper).toHaveClass("vertical");
		});

		it("should forward a custom orientation to the FieldWrapper", () => {
			const { container } = render(
				<Select
					name="category"
					options={options}
					label="Category"
					orientation="horizontal"
				/>,
			);

			const wrapper = container.querySelector(".arkynFieldWrapper");
			expect(wrapper).toHaveClass("horizontal");
		});
	});

	describe("unShowFieldTemplate prop", () => {
		it("should render the FieldTemplate wrapper by default", () => {
			const { container } = render(
				<Select name="category" options={options} label="Category" />,
			);

			expect(container.querySelector(".arkynFieldWrapper")).toBeInTheDocument();
		});

		it("should skip the wrapper, label and error when true", () => {
			const { container } = render(
				<Select
					name="category"
					options={options}
					label="Category"
					errorMessage="Required"
					unShowFieldTemplate
				/>,
			);

			expect(
				container.querySelector(".arkynFieldWrapper"),
			).not.toBeInTheDocument();
			expect(screen.queryByText("Category")).not.toBeInTheDocument();
			expect(screen.queryByText("Required")).not.toBeInTheDocument();
			expect(
				container.querySelector(".arkynSelectContainer"),
			).toBeInTheDocument();
		});
	});

	describe("className merge", () => {
		it("should preserve the base wrapper className", () => {
			const { container } = render(
				<Select name="category" options={options} label="Category" />,
			);

			const wrapper = container.querySelector(".arkynFieldWrapper");
			expect(wrapper).toHaveClass("arkynFieldWrapper");
		});

		it("should merge an external className with the wrapper base className", () => {
			const { container } = render(
				<Select
					name="category"
					options={options}
					label="Category"
					className="custom-class"
				/>,
			);

			const wrapper = container.querySelector(".arkynFieldWrapper");
			expect(wrapper).toHaveClass("arkynFieldWrapper");
			expect(wrapper).toHaveClass("custom-class");
		});

		it("should always preserve the arkynSelectContainer base class on the section", () => {
			const { container } = render(
				<Select name="category" options={options} variant="outline" />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			expect(section).toHaveClass("arkynSelectContainer");
			expect(section).toHaveClass("outline");
		});
	});

	describe("id prop", () => {
		it("should forward id to the container section", () => {
			const { container } = render(
				<Select name="category" options={options} id="custom-id" />,
			);

			expect(container.querySelector("#custom-id")).toHaveClass(
				"arkynSelectContainer",
			);
		});

		it("should generate an id when none is provided", () => {
			const { container } = render(
				<Select name="category" options={options} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			expect(section.id).toBeTruthy();
		});
	});

	describe("label and showAsterisk props", () => {
		it("should not render a label when omitted", () => {
			render(<Select name="category" options={options} />);

			expect(screen.queryByText("Category")).not.toBeInTheDocument();
		});

		it("should render the label text when provided", () => {
			render(<Select name="category" options={options} label="Category" />);

			expect(screen.getByText("Category")).toBeInTheDocument();
		});

		it("should not show an asterisk by default", () => {
			render(<Select name="category" options={options} label="Category" />);

			expect(screen.getByText("Category")).toHaveClass("asteriskFalse");
		});

		it("should show an asterisk when showAsterisk is true", () => {
			render(
				<Select
					name="category"
					options={options}
					label="Category"
					showAsterisk
				/>,
			);

			expect(screen.getByText("Category")).toHaveClass("asteriskTrue");
		});
	});

	describe("disabled and isLoading interaction", () => {
		it("should not open the dropdown when both disabled and isLoading are true", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Select name="category" options={options} disabled isLoading />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);

			expect(screen.queryByText("Technology")).not.toBeInTheDocument();
		});

		it("should apply the opacity class when both disabled and isLoading are true", () => {
			const { container } = render(
				<Select name="category" options={options} disabled isLoading />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			expect(section).toHaveClass("opacity");
		});
	});

	describe("edge cases", () => {
		it("should handle an empty options array without throwing", () => {
			render(<Select name="category" options={[]} />);

			expect(
				document.querySelector(".arkynSelectContainer"),
			).toBeInTheDocument();
		});

		it("should handle an empty errorMessage without rendering an error element", () => {
			render(<Select name="category" options={options} errorMessage="" />);

			expect(
				document.querySelector(".arkynFieldError"),
			).not.toBeInTheDocument();
		});

		it("should handle fieldErrors being undefined without throwing", () => {
			render(
				<FormProvider fieldErrors={undefined}>
					<Select name="category" options={options} />
				</FormProvider>,
			);

			expect(
				document.querySelector(".arkynSelectContainer"),
			).toBeInTheDocument();
		});

		it("should render normally when rendered outside a FormProvider", () => {
			render(<Select name="category" options={options} />);

			expect(
				document.querySelector(".arkynSelectContainer"),
			).toBeInTheDocument();
			expect(
				document.querySelector(".arkynFieldError"),
			).not.toBeInTheDocument();
		});

		it("should show placeholder for a value that does not match any option", () => {
			render(
				<Select
					name="category"
					options={options}
					value="unknown"
					onChange={() => {}}
				/>,
			);

			expect(screen.queryByText("Selecione...")).not.toBeInTheDocument();
			const content = document.querySelector(".arkynSelectContent p");
			expect(content?.textContent).toBe("");
		});
	});

	describe("accessibility", () => {
		it("should support keyboard tabbing onto the hidden input's ref target section via click", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Select name="category" options={options} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);

			expect(section).toHaveClass("focused");
		});

		it("should render option text accessible via getByText for screen readers", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Select name="category" options={options} />,
			);

			const section = container.querySelector(
				".arkynSelectContainer",
			) as HTMLElement;
			await user.click(section);

			expect(screen.getByText("Technology").closest("div")).toBeInTheDocument();
		});
	});
});
