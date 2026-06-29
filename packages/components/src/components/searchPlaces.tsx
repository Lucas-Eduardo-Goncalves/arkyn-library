import type { StandaloneSearchBoxProps } from "@react-google-maps/api";
import { StandaloneSearchBox } from "@react-google-maps/api";
import { type JSX, useState } from "react";
import { Input, type InputProps } from "./input";

type AddressComponentsType = {
	long_name: string;
	short_name: string;
	types: string[];
}[];

/** Structured address data extracted from a Google Places result. */
type PlaceData = {
	/** Street name (e.g. `"Rua Exemplo"`). */
	street: string;
	/** City name (e.g. `"São Paulo"`). */
	city: string;
	/** Full state name (e.g. `"São Paulo"`). */
	state: string;
	/** Neighborhood / district name. */
	neighborhood: string;
	/** Postal / ZIP code. */
	postalCode: string;
	/** State abbreviation (e.g. `"SP"`). */
	stateShortName: string;
	/** Street number (e.g. `"123"`). */
	streetNumber: string;
	/** Geographic coordinates of the place. */
	coordinates: { lat: number; lng: number };
};

type SearchPlacesProps = {
	/** Google Maps `StandaloneSearchBox` options (e.g. `componentRestrictions`, `bounds`). */
	options?: StandaloneSearchBoxProps["options"];
	/** Callback fired every time the input text changes. Receives the current string value. */
	onChange?: (e: string) => void;
	/**
	 * Callback fired when the user selects a place from the autocomplete suggestions.
	 * Receives a structured {@link PlaceData} object.
	 */
	onPlaceChanged?: (e: PlaceData) => void;
} & Omit<InputProps, "onLoad" | "onChange" | "type">;

/**
 * SearchPlaces — text input with Google Places autocomplete that returns structured address data.
 *
 * Requires the Google Maps JavaScript API with the Places library to be loaded.
 * Built on `@react-google-maps/api`'s `StandaloneSearchBox`.
 *
 * @param props.options - Google Maps search box options (e.g. restrict by country).
 * @param props.onChange - Fires on every keystroke — receives the current text value.
 * @param props.onPlaceChanged - Fires when the user selects a suggestion — receives structured address data.
 *
 * **...Other valid `Input` properties (except `onLoad`, `onChange`, `type`)**
 *
 * @returns SearchPlaces JSX element (an `Input` wrapped in `StandaloneSearchBox`).
 *
 * @example
 * ```tsx
 * <SearchPlaces
 *   name="address"
 *   label="Address"
 *   placeholder="Start typing an address…"
 *   options={{ componentRestrictions: { country: "br" } }}
 *   onChange={(v) => setRawAddress(v)}
 *   onPlaceChanged={(place) => {
 *     setAddress({
 *       street: place.street,
 *       city: place.city,
 *       state: place.state,
 *       postalCode: place.postalCode,
 *       coordinates: place.coordinates,
 *     });
 *   }}
 * />
 * ```
 */

function SearchPlaces(props: SearchPlacesProps): JSX.Element {
	const { onChange, onPlaceChanged, options, ...rest } = props;

	const [searchBox, setSearchBox] = useState<any>(null);
	const handleLoad = (ref: any) => setSearchBox(ref);

	const handlePlacesChanged = () => {
		const places = searchBox?.getPlaces();
		const place = places ? places[0] : null;

		const address_components =
			place?.address_components as AddressComponentsType;

		function findData(key: string) {
			const data = address_components.find((item) => item.types[0] === key);
			if (data) return data.long_name;
			return "";
		}

		function findDataShort(key: string) {
			const data = address_components.find((item) => item.types[0] === key);
			if (data) return data.short_name;
			return "";
		}

		function findDataByMultipleTypes(keys: string[]) {
			for (const key of keys) {
				const data = address_components.find((item) =>
					item.types.includes(key),
				);
				if (data) return data.long_name;
			}
			return "";
		}

		if (place) {
			const street = findData("route");
			const streetNumber = findData("street_number");
			const neighborhood = findDataByMultipleTypes([
				"sublocality_level_1",
				"sublocality",
				"neighborhood",
			]);
			const city = findData("administrative_area_level_2");
			const state = findData("administrative_area_level_1");
			const stateShortName = findDataShort("administrative_area_level_1");
			const postalCode = findDataByMultipleTypes([
				"postal_code",
				"postal_code_prefix",
			]);

			const lat = place.geometry?.location?.lat();
			const lng = place.geometry?.location?.lng();

			const sendPlace = {
				street,
				city,
				state,
				neighborhood,
				postalCode,
				streetNumber,
				stateShortName,
				coordinates: { lat, lng },
			};

			onPlaceChanged?.(sendPlace);
		}
	};

	return (
		<StandaloneSearchBox
			onLoad={handleLoad}
			onPlacesChanged={handlePlacesChanged}
			options={options}
		>
			<Input
				type="text"
				autoComplete="off"
				onChange={(e) => onChange?.(e.target.value)}
				{...rest}
			/>
		</StandaloneSearchBox>
	);
}

export { SearchPlaces };
