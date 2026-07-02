import { useLoadScript } from "@react-google-maps/api";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PlacesProvider } from "../placesProvider";

vi.mock("@react-google-maps/api");

const mockedUseLoadScript = vi.mocked(useLoadScript);

describe("PlacesProvider", () => {
	beforeEach(() => {
		mockedUseLoadScript.mockReset();
	});

	it("should render without errors", () => {
		mockedUseLoadScript.mockReturnValue({ isLoaded: false } as ReturnType<
			typeof useLoadScript
		>);

		render(
			<PlacesProvider apiKey="test-key">
				{(isLoaded) => <div>{isLoaded ? "loaded" : "loading"}</div>}
			</PlacesProvider>,
		);

		expect(screen.getByText("loading")).toBeInTheDocument();
	});

	it("should call children as a render-prop with isLoaded=false when the script has not loaded", () => {
		mockedUseLoadScript.mockReturnValue({ isLoaded: false } as ReturnType<
			typeof useLoadScript
		>);
		const children = vi.fn().mockReturnValue(<div>content</div>);

		render(<PlacesProvider apiKey="test-key">{children}</PlacesProvider>);

		expect(children).toHaveBeenCalledTimes(1);
		expect(children).toHaveBeenCalledWith(false);
	});

	it("should call children as a render-prop with isLoaded=true when the script has loaded", () => {
		mockedUseLoadScript.mockReturnValue({ isLoaded: true } as ReturnType<
			typeof useLoadScript
		>);
		const children = vi.fn().mockReturnValue(<div>content</div>);

		render(<PlacesProvider apiKey="test-key">{children}</PlacesProvider>);

		expect(children).toHaveBeenCalledTimes(1);
		expect(children).toHaveBeenCalledWith(true);
	});

	it("should render the ReactNode returned by children", () => {
		mockedUseLoadScript.mockReturnValue({ isLoaded: true } as ReturnType<
			typeof useLoadScript
		>);

		render(
			<PlacesProvider apiKey="test-key">
				{(isLoaded) => <div>{isLoaded ? "ready" : "not ready"}</div>}
			</PlacesProvider>,
		);

		expect(screen.getByText("ready")).toBeInTheDocument();
		expect(screen.queryByText("not ready")).not.toBeInTheDocument();
	});

	it("should call useLoadScript with the given apiKey as googleMapsApiKey", () => {
		mockedUseLoadScript.mockReturnValue({ isLoaded: false } as ReturnType<
			typeof useLoadScript
		>);

		render(
			<PlacesProvider apiKey="my-api-key">{() => <div />}</PlacesProvider>,
		);

		expect(mockedUseLoadScript).toHaveBeenCalledWith(
			expect.objectContaining({ googleMapsApiKey: "my-api-key" }),
		);
	});

	it("should call useLoadScript with the places, marker, and maps libraries", () => {
		mockedUseLoadScript.mockReturnValue({ isLoaded: false } as ReturnType<
			typeof useLoadScript
		>);

		render(<PlacesProvider apiKey="test-key">{() => <div />}</PlacesProvider>);

		expect(mockedUseLoadScript).toHaveBeenCalledWith(
			expect.objectContaining({ libraries: ["places", "marker", "maps"] }),
		);
	});

	it("should default preventFontsLoading to true when omitted", () => {
		mockedUseLoadScript.mockReturnValue({ isLoaded: false } as ReturnType<
			typeof useLoadScript
		>);

		render(<PlacesProvider apiKey="test-key">{() => <div />}</PlacesProvider>);

		expect(mockedUseLoadScript).toHaveBeenCalledWith(
			expect.objectContaining({ preventGoogleFontsLoading: true }),
		);
	});

	it("should pass preventGoogleFontsLoading as true when preventFontsLoading is explicitly true", () => {
		mockedUseLoadScript.mockReturnValue({ isLoaded: false } as ReturnType<
			typeof useLoadScript
		>);

		render(
			<PlacesProvider apiKey="test-key" preventFontsLoading={true}>
				{() => <div />}
			</PlacesProvider>,
		);

		expect(mockedUseLoadScript).toHaveBeenCalledWith(
			expect.objectContaining({ preventGoogleFontsLoading: true }),
		);
	});

	it("should pass preventGoogleFontsLoading as false when preventFontsLoading is explicitly false", () => {
		mockedUseLoadScript.mockReturnValue({ isLoaded: false } as ReturnType<
			typeof useLoadScript
		>);

		render(
			<PlacesProvider apiKey="test-key" preventFontsLoading={false}>
				{() => <div />}
			</PlacesProvider>,
		);

		expect(mockedUseLoadScript).toHaveBeenCalledWith(
			expect.objectContaining({ preventGoogleFontsLoading: false }),
		);
	});

	it("should call useLoadScript exactly once per render", () => {
		mockedUseLoadScript.mockReturnValue({ isLoaded: false } as ReturnType<
			typeof useLoadScript
		>);

		render(<PlacesProvider apiKey="test-key">{() => <div />}</PlacesProvider>);

		expect(mockedUseLoadScript).toHaveBeenCalledTimes(1);
	});

	it("should render multiple elements returned from children", () => {
		mockedUseLoadScript.mockReturnValue({ isLoaded: true } as ReturnType<
			typeof useLoadScript
		>);

		render(
			<PlacesProvider apiKey="test-key">
				{() => (
					<>
						<span>first</span>
						<span>second</span>
					</>
				)}
			</PlacesProvider>,
		);

		expect(screen.getByText("first")).toBeInTheDocument();
		expect(screen.getByText("second")).toBeInTheDocument();
	});

	it("should render null when children returns null", () => {
		mockedUseLoadScript.mockReturnValue({ isLoaded: false } as ReturnType<
			typeof useLoadScript
		>);

		const { container } = render(
			<PlacesProvider apiKey="test-key">{() => null}</PlacesProvider>,
		);

		expect(container).toBeEmptyDOMElement();
	});

	it("should accept an empty string apiKey and still call useLoadScript", () => {
		mockedUseLoadScript.mockReturnValue({ isLoaded: false } as ReturnType<
			typeof useLoadScript
		>);

		render(<PlacesProvider apiKey="">{() => <div />}</PlacesProvider>);

		expect(mockedUseLoadScript).toHaveBeenCalledWith(
			expect.objectContaining({ googleMapsApiKey: "" }),
		);
	});
});
