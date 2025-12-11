import { useLoadScript } from "@react-google-maps/api";
import { ReactNode } from "react";

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
 * PlacesProvider component that loads Google Maps API with Places, Marker, and Maps libraries.
 *
 * @component
 * @example
 * ```tsx
 * <PlacesProvider apiKey="YOUR_API_KEY">
 *   {(isLoaded) => isLoaded ? <MapComponent /> : <LoadingSpinner />)}
 * </PlacesProvider>
 * ```
 *
 * @param {PlacesProviderProps} props - The component props
 * @param {string} props.apiKey - Maps API key for authentication
 * @param {(isLoaded: boolean) => ReactNode} props.children - Render function that receives the loading state
 * @param {boolean} [props.preventFontsLoading=true] - Whether to prevent Fonts from loading
 *
 * @returns {ReactNode} The rendered children with the loading state
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
