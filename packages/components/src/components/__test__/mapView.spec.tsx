import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MapView } from "../index";

const clientMapViewMock = vi.fn();

vi.mock("../mapView.client", () => ({
	ClientMapView: (props: Record<string, unknown>) => {
		clientMapViewMock(props);
		return <div data-testid="client-map-view" />;
	},
}));

describe("MapView", () => {
	afterEach(() => {
		cleanup();
		clientMapViewMock.mockClear();
	});

	describe("EmptyMap fallback", () => {
		it("should render the empty map placeholder when coordinates is omitted", () => {
			const { container } = render(<MapView accessToken="pk.token" />);

			const emptyMap = container.querySelector(".arkynMapViewPinnedEmpty");
			expect(emptyMap).toBeInTheDocument();
			expect(clientMapViewMock).not.toHaveBeenCalled();
		});

		it("should render the empty map placeholder when coordinates is an empty array", () => {
			const { container } = render(
				<MapView accessToken="pk.token" coordinates={[]} />,
			);

			const emptyMap = container.querySelector(".arkynMapViewPinnedEmpty");
			expect(emptyMap).toBeInTheDocument();
			expect(clientMapViewMock).not.toHaveBeenCalled();
		});

		it("should render the MapPinned icon inside the placeholder", () => {
			const { container } = render(<MapView accessToken="pk.token" />);

			const svg = container.querySelector(".arkynMapViewPinnedEmpty > svg");
			expect(svg).toBeInTheDocument();
		});

		it("should not render the client map view when coordinates is omitted", () => {
			render(<MapView accessToken="pk.token" />);

			expect(screen.queryByTestId("client-map-view")).not.toBeInTheDocument();
		});

		it("should not render the client map view when coordinates is an empty array", () => {
			render(<MapView accessToken="pk.token" coordinates={[]} />);

			expect(screen.queryByTestId("client-map-view")).not.toBeInTheDocument();
		});

		it("should merge external className into the empty map placeholder", () => {
			const { container } = render(
				<MapView accessToken="pk.token" className="custom-class" />,
			);

			const emptyMap = container.querySelector(".arkynMapViewPinnedEmpty");
			expect(emptyMap).toHaveClass("arkynMapViewPinnedEmpty");
			expect(emptyMap).toHaveClass("custom-class");
		});

		it("should preserve the base class when className is omitted", () => {
			const { container } = render(<MapView accessToken="pk.token" />);

			const emptyMap = container.querySelector(".arkynMapViewPinnedEmpty");
			expect(emptyMap).toHaveClass("arkynMapViewPinnedEmpty");
		});

		it("should render the empty map placeholder for both undefined and empty array coordinates identically", () => {
			const { container: withoutCoordinates, unmount } = render(
				<MapView accessToken="pk.token" />,
			);
			expect(
				withoutCoordinates.querySelector(".arkynMapViewPinnedEmpty"),
			).toBeInTheDocument();
			unmount();

			const { container: withEmptyArray } = render(
				<MapView accessToken="pk.token" coordinates={[]} />,
			);
			expect(
				withEmptyArray.querySelector(".arkynMapViewPinnedEmpty"),
			).toBeInTheDocument();
		});

		it("should not throw when rendered without optional props", () => {
			expect(() => render(<MapView accessToken="pk.token" />)).not.toThrow();
		});
	});

	describe("with coordinates (client map view)", () => {
		it("should render the client map view when a single coordinate object is provided", () => {
			render(
				<MapView
					accessToken="pk.token"
					coordinates={{ lat: -23.55, lng: -46.63 }}
				/>,
			);

			expect(screen.getByTestId("client-map-view")).toBeInTheDocument();
			expect(clientMapViewMock).toHaveBeenCalledTimes(1);
		});

		it("should not render the empty map placeholder when coordinates are provided", () => {
			const { container } = render(
				<MapView
					accessToken="pk.token"
					coordinates={{ lat: -23.55, lng: -46.63 }}
				/>,
			);

			expect(
				container.querySelector(".arkynMapViewPinnedEmpty"),
			).not.toBeInTheDocument();
		});

		it("should normalize a single coordinate object into an array", () => {
			const coordinate = { lat: -23.55, lng: -46.63 };
			render(<MapView accessToken="pk.token" coordinates={coordinate} />);

			expect(clientMapViewMock).toHaveBeenCalledWith(
				expect.objectContaining({ coordinates: [coordinate] }),
			);
		});

		it("should pass through an array of coordinates unchanged", () => {
			const coordinates = [
				{ lat: -23.55, lng: -46.63 },
				{ lat: -23.56, lng: -46.64 },
			];
			render(<MapView accessToken="pk.token" coordinates={coordinates} />);

			expect(clientMapViewMock).toHaveBeenCalledWith(
				expect.objectContaining({ coordinates }),
			);
		});

		it("should pass the accessToken prop through to the client map view", () => {
			render(
				<MapView
					accessToken="pk.my-secret-token"
					coordinates={{ lat: -23.55, lng: -46.63 }}
				/>,
			);

			expect(clientMapViewMock).toHaveBeenCalledWith(
				expect.objectContaining({ accessToken: "pk.my-secret-token" }),
			);
		});

		it("should set center to the single coordinate when only one coordinate is given", () => {
			const coordinate = { lat: -23.55, lng: -46.63 };
			render(<MapView accessToken="pk.token" coordinates={coordinate} />);

			expect(clientMapViewMock).toHaveBeenCalledWith(
				expect.objectContaining({ center: coordinate }),
			);
		});

		it("should set center to the first item of the array when multiple coordinates are given", () => {
			const first = { lat: -23.55, lng: -46.63 };
			const second = { lat: -23.56, lng: -46.64 };
			render(<MapView accessToken="pk.token" coordinates={[first, second]} />);

			expect(clientMapViewMock).toHaveBeenCalledWith(
				expect.objectContaining({ center: first }),
			);
		});

		it("should default zoom to 18 internally and not throw when omitted", () => {
			expect(() =>
				render(
					<MapView
						accessToken="pk.token"
						coordinates={{ lat: -23.55, lng: -46.63 }}
					/>,
				),
			).not.toThrow();

			expect(screen.getByTestId("client-map-view")).toBeInTheDocument();
		});

		it("should accept a custom zoom prop without throwing and without forwarding it to the client map view", () => {
			render(
				<MapView
					accessToken="pk.token"
					zoom={12}
					coordinates={{ lat: -23.55, lng: -46.63 }}
				/>,
			);

			const receivedProps = clientMapViewMock.mock.calls[0][0];
			expect(receivedProps.zoom).toBeUndefined();
		});

		it("should pass the onMarkerClick callback through to the client map view", () => {
			const onMarkerClick = vi.fn();
			render(
				<MapView
					accessToken="pk.token"
					coordinates={{ lat: -23.55, lng: -46.63 }}
					onMarkerClick={onMarkerClick}
				/>,
			);

			expect(clientMapViewMock).toHaveBeenCalledWith(
				expect.objectContaining({ onMarkerClick }),
			);
		});

		it("should default onMarkerClick to undefined when omitted", () => {
			render(
				<MapView
					accessToken="pk.token"
					coordinates={{ lat: -23.55, lng: -46.63 }}
				/>,
			);

			const receivedProps = clientMapViewMock.mock.calls[0][0];
			expect(receivedProps.onMarkerClick).toBeUndefined();
		});

		it("should forward additional HTML attributes to the client map view", () => {
			render(
				<MapView
					accessToken="pk.token"
					coordinates={{ lat: -23.55, lng: -46.63 }}
					id="my-map"
					data-testid-extra="extra"
				/>,
			);

			expect(clientMapViewMock).toHaveBeenCalledWith(
				expect.objectContaining({ id: "my-map" }),
			);
		});

		it("should render the client map view only once per render", () => {
			render(
				<MapView
					accessToken="pk.token"
					coordinates={{ lat: -23.55, lng: -46.63 }}
				/>,
			);

			expect(screen.getAllByTestId("client-map-view")).toHaveLength(1);
		});

		it("should not include coordinates in the rendered props passed to className", () => {
			render(
				<MapView
					accessToken="pk.token"
					coordinates={{ lat: -23.55, lng: -46.63 }}
					className="ignored-for-client"
				/>,
			);

			const receivedProps = clientMapViewMock.mock.calls[0][0];
			expect(receivedProps.className).toBeUndefined();
		});
	});

	describe("prop-interaction cases", () => {
		it("should switch from empty map to client map view when coordinates change from empty to populated", () => {
			const { rerender, container } = render(
				<MapView accessToken="pk.token" coordinates={[]} />,
			);
			expect(
				container.querySelector(".arkynMapViewPinnedEmpty"),
			).toBeInTheDocument();

			rerender(
				<MapView
					accessToken="pk.token"
					coordinates={{ lat: -23.55, lng: -46.63 }}
				/>,
			);

			expect(screen.getByTestId("client-map-view")).toBeInTheDocument();
			expect(
				container.querySelector(".arkynMapViewPinnedEmpty"),
			).not.toBeInTheDocument();
		});

		it("should switch from client map view back to empty map when coordinates are cleared", () => {
			const { rerender, container } = render(
				<MapView
					accessToken="pk.token"
					coordinates={{ lat: -23.55, lng: -46.63 }}
				/>,
			);
			expect(screen.getByTestId("client-map-view")).toBeInTheDocument();

			rerender(<MapView accessToken="pk.token" coordinates={[]} />);

			expect(
				container.querySelector(".arkynMapViewPinnedEmpty"),
			).toBeInTheDocument();
			expect(screen.queryByTestId("client-map-view")).not.toBeInTheDocument();
		});

		it("should combine a custom zoom with an onMarkerClick callback without breaking the callback forwarding", () => {
			const onMarkerClick = vi.fn();
			render(
				<MapView
					accessToken="pk.token"
					zoom={5}
					coordinates={[{ lat: -23.55, lng: -46.63 }]}
					onMarkerClick={onMarkerClick}
				/>,
			);

			expect(clientMapViewMock).toHaveBeenCalledWith(
				expect.objectContaining({ onMarkerClick }),
			);
		});
	});
});
