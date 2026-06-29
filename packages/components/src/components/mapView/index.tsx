import { MapPinned } from "lucide-react";
import type { HtmlHTMLAttributes, ReactNode } from "react";

import { ClientMapView } from "./mapView.client";
import "./styles.css";
import { ClientOnly } from "../clientOnly";

/** Data for a single map marker. */
type Coordinate = {
	/** Latitude of the marker position. */
	lat: number;
	/** Longitude of the marker position. */
	lng: number;
	/** Arbitrary data attached to the marker — available in `onMarkerClick`. */
	data?: any;
	/** Custom React node rendered inside the marker popup on click. */
	popUp?: ReactNode;
};

type MapViewProps = {
	/** Mapbox GL public access token from your Mapbox account. Required. */
	accessToken: string;
	/** Initial zoom level. @default 18 */
	zoom?: number;
	/** Single coordinate or array of coordinates to display as markers. */
	coordinates?: Coordinate | Coordinate[];
	/** Callback fired when the user clicks a marker. Receives the coordinate's data. */
	onMarkerClick?: (coordinate: Coordinate) => void;
} & HtmlHTMLAttributes<HTMLDivElement>;

type EmptyMapProps = {
	className?: string;
};

function EmptyMap({ className }: EmptyMapProps) {
	return (
		<div className={`arkynMapViewPinnedEmpty ${className}`}>
			<MapPinned />
		</div>
	);
}

/**
 * MapView — interactive Mapbox map with optional click-able markers.
 *
 * Renders client-side only (via `ClientOnly`). Displays a placeholder icon
 * when `coordinates` is absent or empty, or before the component hydrates.
 *
 * @param props.accessToken - Mapbox GL public access token. Required.
 * @param props.zoom - Initial zoom level. Default: 18
 * @param props.coordinates - Marker(s) to display on the map.
 * @param props.onMarkerClick - Callback fired when a marker is clicked.
 *
 * **...Other valid HTML properties for `<div>`**
 *
 * @returns MapView JSX element, or a placeholder icon when no coordinates are provided.
 *
 * @example
 * ```tsx
 * // Single marker
 * <MapView
 *   accessToken="pk.your-mapbox-token"
 *   coordinates={{ lat: -23.5505, lng: -46.6333 }}
 * />
 *
 * // Multiple markers with popup and click handler
 * <MapView
 *   accessToken="pk.your-mapbox-token"
 *   zoom={12}
 *   coordinates={[
 *     { lat: -23.55, lng: -46.63, data: { id: 1 }, popUp: <p>Store A</p> },
 *     { lat: -23.56, lng: -46.64, data: { id: 2 }, popUp: <p>Store B</p> },
 *   ]}
 *   onMarkerClick={(coord) => selectStore(coord.data.id)}
 * />
 * ```
 */
function MapView(props: MapViewProps) {
	const {
		coordinates,
		zoom = 18,
		accessToken,
		className,
		onMarkerClick,
		...rest
	} = props;

	if (!coordinates) return <EmptyMap className={className} />;

	const coordArray = Array.isArray(coordinates) ? coordinates : [coordinates];
	if (coordArray.length === 0) return <EmptyMap className={className} />;

	return (
		<ClientOnly fallback={<EmptyMap className={className} />}>
			{() => (
				<ClientMapView
					accessToken={accessToken}
					coordinates={coordArray}
					center={coordArray[0]}
					onMarkerClick={onMarkerClick}
					{...rest}
				/>
			)}
		</ClientOnly>
	);
}

export { MapView };
