import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ClientOnly } from "../clientOnly";

describe("ClientOnly", () => {
	it("should render without errors", () => {
		render(<ClientOnly>{() => <p>hydrated content</p>}</ClientOnly>);

		expect(screen.getByText("hydrated content")).toBeInTheDocument();
	});

	it("should render the result of the children render-prop after hydration", () => {
		render(<ClientOnly>{() => <span>client rendered</span>}</ClientOnly>);

		expect(screen.getByText("client rendered")).toBeInTheDocument();
	});

	it("should call the children function to obtain the rendered content", () => {
		const childrenFn = vi.fn(() => <p>called</p>);

		render(<ClientOnly>{childrenFn}</ClientOnly>);

		expect(childrenFn).toHaveBeenCalled();
		expect(screen.getByText("called")).toBeInTheDocument();
	});

	it("should call the children function exactly once per render", () => {
		const childrenFn = vi.fn(() => <p>once</p>);

		render(<ClientOnly>{childrenFn}</ClientOnly>);

		expect(childrenFn).toHaveBeenCalledTimes(1);
	});

	it("should render a string returned by children", () => {
		render(<ClientOnly>{() => "plain string content"}</ClientOnly>);

		expect(screen.getByText("plain string content")).toBeInTheDocument();
	});

	it("should render JSX returned by children", () => {
		render(
			<ClientOnly>
				{() => (
					<div>
						<p>jsx content</p>
					</div>
				)}
			</ClientOnly>,
		);

		expect(screen.getByText("jsx content")).toBeInTheDocument();
	});

	it("should render multiple elements returned by children", () => {
		render(
			<ClientOnly>
				{() => (
					<>
						<p>first element</p>
						<p>second element</p>
					</>
				)}
			</ClientOnly>,
		);

		expect(screen.getByText("first element")).toBeInTheDocument();
		expect(screen.getByText("second element")).toBeInTheDocument();
	});

	it("should render a child component returned by children", () => {
		function InnerComponent() {
			return <p>inner component</p>;
		}

		render(<ClientOnly>{() => <InnerComponent />}</ClientOnly>);

		expect(screen.getByText("inner component")).toBeInTheDocument();
	});

	it("should not render the fallback once hydrated even when fallback is provided", () => {
		render(
			<ClientOnly fallback={<p>loading fallback</p>}>
				{() => <p>hydrated view</p>}
			</ClientOnly>,
		);

		expect(screen.getByText("hydrated view")).toBeInTheDocument();
		expect(screen.queryByText("loading fallback")).not.toBeInTheDocument();
	});

	it("should default the fallback to null when omitted and still render children once hydrated", () => {
		const { container } = render(
			<ClientOnly>{() => <p>no fallback provided</p>}</ClientOnly>,
		);

		expect(screen.getByText("no fallback provided")).toBeInTheDocument();
		expect(container.querySelectorAll("p")).toHaveLength(1);
	});

	it("should accept a JSX fallback prop without affecting hydrated rendering", () => {
		render(
			<ClientOnly fallback={<span data-testid="skeleton" />}>
				{() => <p>real content</p>}
			</ClientOnly>,
		);

		expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
		expect(screen.getByText("real content")).toBeInTheDocument();
	});

	it("should accept a string fallback prop without affecting hydrated rendering", () => {
		render(<ClientOnly fallback="Loading...">{() => <p>done</p>}</ClientOnly>);

		expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
		expect(screen.getByText("done")).toBeInTheDocument();
	});

	it("should render nothing visible when children returns null", () => {
		const { container } = render(<ClientOnly>{() => null}</ClientOnly>);

		expect(container).toBeEmptyDOMElement();
	});

	it("should render nothing visible when children returns undefined", () => {
		const { container } = render(<ClientOnly>{() => undefined}</ClientOnly>);

		expect(container).toBeEmptyDOMElement();
	});

	it("should render an empty string returned by children without throwing", () => {
		const { container } = render(<ClientOnly>{() => ""}</ClientOnly>);

		expect(container).toBeEmptyDOMElement();
	});

	it("should render falsy numeric zero returned by children", () => {
		render(<ClientOnly>{() => 0}</ClientOnly>);

		expect(screen.getByText("0")).toBeInTheDocument();
	});

	it("should re-invoke children on re-render and reflect updated output", () => {
		const { rerender } = render(
			<ClientOnly>{() => <p>first render</p>}</ClientOnly>,
		);

		expect(screen.getByText("first render")).toBeInTheDocument();

		rerender(<ClientOnly>{() => <p>second render</p>}</ClientOnly>);

		expect(screen.getByText("second render")).toBeInTheDocument();
		expect(screen.queryByText("first render")).not.toBeInTheDocument();
	});

	it("should update rendered output when fallback prop changes while hydrated", () => {
		const { rerender } = render(
			<ClientOnly fallback={<p>fallback A</p>}>
				{() => <p>content</p>}
			</ClientOnly>,
		);

		expect(screen.getByText("content")).toBeInTheDocument();

		rerender(
			<ClientOnly fallback={<p>fallback B</p>}>
				{() => <p>content</p>}
			</ClientOnly>,
		);

		expect(screen.getByText("content")).toBeInTheDocument();
		expect(screen.queryByText("fallback A")).not.toBeInTheDocument();
		expect(screen.queryByText("fallback B")).not.toBeInTheDocument();
	});
});
