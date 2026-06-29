import { useLoadScript } from "@react-google-maps/api";
import type { ReactNode } from "react";

const libraries: ("places" | "marker" | "maps")[] = [
	"places",
	"marker",
	"maps",
];

type PlacesProviderProps = {
	apiKey: string;
	children: (isLoaded: boolean) => ReactNode;
	preventFontsLoading?: boolean;
};

/**
 * PlacesProvider — loads the Google Maps JS API with `places`, `marker`, and `maps` libraries.
 *
 * Uses a render-prop pattern: `children` receives `isLoaded` so you can defer rendering
 * `SearchPlaces` or `MapView` until the script is ready.
 *
 * @param props.apiKey - Google Maps API key. Required.
 * @param props.children - Render function: `(isLoaded: boolean) => ReactNode`.
 * @param props.preventFontsLoading - Prevents Google Fonts from being injected by the Maps SDK. @default true
 *
 * @returns The result of calling `children(isLoaded)`.
 *
 * @example
 * ```tsx
 * <PlacesProvider apiKey={env.GOOGLE_MAPS_KEY}>
 *   {(isLoaded) => (
 *     isLoaded
 *       ? <SearchPlaces apiKey={env.GOOGLE_MAPS_KEY} onSelect={setAddress} />
 *       : <Skeleton />
 *   )}
 * </PlacesProvider>
 * ```
 */

function PlacesProvider(props: PlacesProviderProps) {
	const { apiKey, children, preventFontsLoading = true } = props;

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: apiKey,
		libraries,
		preventGoogleFontsLoading: preventFontsLoading,
	});

	return <>{children(isLoaded)}</>;
}

export { PlacesProvider };
