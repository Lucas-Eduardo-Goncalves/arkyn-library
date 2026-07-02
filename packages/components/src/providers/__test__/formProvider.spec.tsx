import { render, within } from "@testing-library/react";
import { useContext } from "react";
import { describe, expect, it, vi } from "vitest";
import { useForm } from "../../hooks/useForm";
import { FormProvider, formContext } from "../formProvider";

function FieldErrorsConsumer({ name }: { name: string }) {
	const { fieldErrors } = useForm();
	return (
		<span data-testid="consumer">{fieldErrors?.[name] ?? "no-error"}</span>
	);
}

describe("FormProvider", () => {
	it("should render without errors", () => {
		const { container } = render(
			<FormProvider>
				<span>content</span>
			</FormProvider>,
		);

		expect(within(container).getByText("content")).toBeInTheDocument();
	});

	it("should render string children directly", () => {
		const { container } = render(<FormProvider>plain text</FormProvider>);

		expect(within(container).getByText("plain text")).toBeInTheDocument();
	});

	it("should render JSX children", () => {
		const { container } = render(
			<FormProvider>
				<button type="button">Click me</button>
			</FormProvider>,
		);

		expect(
			within(container).getByRole("button", { name: "Click me" }),
		).toBeInTheDocument();
	});

	it("should render multiple children elements", () => {
		const { container } = render(
			<FormProvider>
				<input aria-label="first" />
				<input aria-label="second" />
			</FormProvider>,
		);

		expect(within(container).getByLabelText("first")).toBeInTheDocument();
		expect(within(container).getByLabelText("second")).toBeInTheDocument();
	});

	it("should not wrap children in any extra element when form prop is omitted", () => {
		const { container } = render(
			<FormProvider>
				<span data-testid="only-child">value</span>
			</FormProvider>,
		);

		expect(container.childElementCount).toBe(1);
		expect(container.firstElementChild).toBe(
			within(container).getByTestId("only-child"),
		);
	});

	it("should expose fieldErrors to descendants via useForm", () => {
		const { container } = render(
			<FormProvider fieldErrors={{ email: "Invalid email" }}>
				<FieldErrorsConsumer name="email" />
			</FormProvider>,
		);

		expect(within(container).getByTestId("consumer")).toHaveTextContent(
			"Invalid email",
		);
	});

	it("should expose undefined fieldErrors by default when omitted", () => {
		const { container } = render(
			<FormProvider>
				<FieldErrorsConsumer name="email" />
			</FormProvider>,
		);

		expect(within(container).getByTestId("consumer")).toHaveTextContent(
			"no-error",
		);
	});

	it("should expose an empty fieldErrors object correctly", () => {
		const { container } = render(
			<FormProvider fieldErrors={{}}>
				<FieldErrorsConsumer name="email" />
			</FormProvider>,
		);

		expect(within(container).getByTestId("consumer")).toHaveTextContent(
			"no-error",
		);
	});

	it("should update the exposed fieldErrors when the prop changes", () => {
		const { container, rerender } = render(
			<FormProvider fieldErrors={{ email: "Required" }}>
				<FieldErrorsConsumer name="email" />
			</FormProvider>,
		);

		expect(within(container).getByTestId("consumer")).toHaveTextContent(
			"Required",
		);

		rerender(
			<FormProvider fieldErrors={{ email: "Invalid format" }}>
				<FieldErrorsConsumer name="email" />
			</FormProvider>,
		);

		expect(within(container).getByTestId("consumer")).toHaveTextContent(
			"Invalid format",
		);
	});

	it("should wrap children in the given form element when form prop is provided", () => {
		const { container } = render(
			<FormProvider form={<form data-testid="my-form" />}>
				<input aria-label="username" />
			</FormProvider>,
		);

		const formElement = within(container).getByTestId("my-form");
		expect(formElement.tagName).toBe("FORM");
		const input = within(container).getByLabelText("username");
		expect(input).toBeInTheDocument();
		expect(formElement).toContainElement(input);
	});

	it("should preserve the form element's own props when cloning it", () => {
		const { container } = render(
			<FormProvider
				form={<form data-testid="my-form" className="custom-form" />}
			>
				<span>field</span>
			</FormProvider>,
		);

		const formElement = within(container).getByTestId("my-form");
		expect(formElement).toHaveClass("custom-form");
	});

	it("should call the form element's onSubmit handler when submitted", () => {
		const handleSubmit = vi.fn((event: React.FormEvent) => {
			event.preventDefault();
		});

		const { container } = render(
			<FormProvider
				form={<form data-testid="my-form" onSubmit={handleSubmit} />}
			>
				<button type="submit">Submit</button>
			</FormProvider>,
		);

		within(container).getByRole("button", { name: "Submit" }).click();

		expect(handleSubmit).toHaveBeenCalledTimes(1);
	});

	it("should render the form element even without children", () => {
		const { container } = render(
			<FormProvider form={<form data-testid="my-form" />}>{null}</FormProvider>,
		);

		expect(within(container).getByTestId("my-form")).toBeInTheDocument();
	});

	it("should not render a form element when form prop is not provided", () => {
		const { container } = render(
			<FormProvider>
				<span>content</span>
			</FormProvider>,
		);

		expect(container.querySelector("form")).not.toBeInTheDocument();
	});

	it("should expose formContext for direct consumption", () => {
		function DirectConsumer() {
			const context = useContext(formContext);
			return <span data-testid="direct">{context.fieldErrors?.name}</span>;
		}

		const { container } = render(
			<FormProvider fieldErrors={{ name: "Required" }}>
				<DirectConsumer />
			</FormProvider>,
		);

		expect(within(container).getByTestId("direct")).toHaveTextContent(
			"Required",
		);
	});
});
