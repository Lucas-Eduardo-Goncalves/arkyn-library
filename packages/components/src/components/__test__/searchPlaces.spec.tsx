import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SearchPlaces } from "../searchPlaces";

type OnLoad = (searchBox: { getPlaces: () => unknown[] }) => void;
type OnPlacesChanged = () => void;

let capturedOnLoad: OnLoad | null = null;
let capturedOnPlacesChanged: OnPlacesChanged | null = null;

vi.mock("@react-google-maps/api", () => ({
	StandaloneSearchBox: (props: {
		onLoad?: OnLoad;
		onPlacesChanged?: OnPlacesChanged;
		children?: React.ReactNode;
	}) => {
		capturedOnLoad = props.onLoad ?? null;
		capturedOnPlacesChanged = props.onPlacesChanged ?? null;
		return <div data-testid="standalone-search-box">{props.children}</div>;
	},
}));

function triggerPlaceSelection(places: unknown[]) {
	act(() => {
		capturedOnLoad?.({ getPlaces: () => places });
	});
	capturedOnPlacesChanged?.();
}

describe("SearchPlaces", () => {
	afterEach(() => {
		cleanup();
		capturedOnLoad = null;
		capturedOnPlacesChanged = null;
	});

	it("should render without errors", () => {
		render(<SearchPlaces name="address" />);
		expect(screen.getByTestId("standalone-search-box")).toBeInTheDocument();
	});

	it("should not throw and should still extract available fields when address_components is missing from the place result", () => {
		const onPlaceChanged = vi.fn();
		render(<SearchPlaces name="address" onPlaceChanged={onPlaceChanged} />);

		const place = {
			// address_components intentionally omitted, mirrors a real provider
			// response that lacks this key (BUG-04).
			formatted_address: "Some Place, Somewhere",
			place_id: "abc123",
			geometry: {
				location: {
					lat: () => -23.55,
					lng: () => -46.63,
				},
			},
		};

		expect(() => triggerPlaceSelection([place])).not.toThrow();

		expect(onPlaceChanged).toHaveBeenCalledTimes(1);
		expect(onPlaceChanged).toHaveBeenCalledWith({
			street: "",
			city: "",
			state: "",
			neighborhood: "",
			postalCode: "",
			streetNumber: "",
			stateShortName: "",
			coordinates: { lat: -23.55, lng: -46.63 },
		});
	});

	it("should not throw when address_components is explicitly undefined", () => {
		const onPlaceChanged = vi.fn();
		render(<SearchPlaces name="address" onPlaceChanged={onPlaceChanged} />);

		const place = {
			address_components: undefined,
			geometry: {
				location: {
					lat: () => 1,
					lng: () => 2,
				},
			},
		};

		expect(() => triggerPlaceSelection([place])).not.toThrow();
		expect(onPlaceChanged).toHaveBeenCalledWith(
			expect.objectContaining({ coordinates: { lat: 1, lng: 2 } }),
		);
	});

	it("should still correctly extract fields when address_components is present", () => {
		const onPlaceChanged = vi.fn();
		render(<SearchPlaces name="address" onPlaceChanged={onPlaceChanged} />);

		const place = {
			address_components: [
				{
					long_name: "Example Street",
					short_name: "Example St",
					types: ["route"],
				},
				{ long_name: "123", short_name: "123", types: ["street_number"] },
				{
					long_name: "São Paulo",
					short_name: "São Paulo",
					types: ["administrative_area_level_2"],
				},
				{
					long_name: "São Paulo",
					short_name: "SP",
					types: ["administrative_area_level_1"],
				},
				{
					long_name: "01000-000",
					short_name: "01000-000",
					types: ["postal_code"],
				},
			],
			geometry: {
				location: {
					lat: () => -23.55,
					lng: () => -46.63,
				},
			},
		};

		triggerPlaceSelection([place]);

		expect(onPlaceChanged).toHaveBeenCalledWith({
			street: "Example Street",
			city: "São Paulo",
			state: "São Paulo",
			neighborhood: "",
			postalCode: "01000-000",
			streetNumber: "123",
			stateShortName: "SP",
			coordinates: { lat: -23.55, lng: -46.63 },
		});
	});

	it("should not call onPlaceChanged when there are no places", () => {
		const onPlaceChanged = vi.fn();
		render(<SearchPlaces name="address" onPlaceChanged={onPlaceChanged} />);

		expect(() => triggerPlaceSelection([])).not.toThrow();
		expect(onPlaceChanged).not.toHaveBeenCalled();
	});
});
