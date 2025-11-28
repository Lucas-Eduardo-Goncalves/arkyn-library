import type { StandaloneSearchBoxProps } from "@react-google-maps/api";
import { StandaloneSearchBox } from "@react-google-maps/api";
import { useState } from "react";
import { Input, InputProps } from "./input";

/**
 * Represents the structure of address components returned by Google Places API.
 * @internal
 */
type AddressComponentsType = {
  long_name: string;
  short_name: string;
  types: string[];
}[];

/**
 * Props for the SearchPlaces component.
 * @typedef {Object} SearchPlacesProps
 * @property {StandaloneSearchBoxProps["options"]} [options] - Google Maps StandaloneSearchBox configuration options
 * @property {(value: string) => void} [onChange] - Callback fired when the input value changes
 * @property {(place: PlaceData) => void} [onPlaceChanged] - Callback fired when a place is selected from the autocomplete suggestions
 */
type SearchPlacesProps = {
  options?: StandaloneSearchBoxProps["options"];
  onChange?: (e: string) => void;
  onPlaceChanged?: (e: {
    street: string;
    city: string;
    state: string;
    district: string;
    cep: string;
    stateShortName: string;
    streetNumber: string;
    coordinates: { lat: number; lng: number };
  }) => void;
} & Omit<InputProps, "onLoad" | "onChange" | "type">;

/**
 * SearchPlaces component - A Google Places autocomplete input field.
 *
 * This component integrates with Google Maps API to provide address autocomplete functionality.
 * When a user selects a place from the suggestions, it extracts and returns structured address data
 * including street, city, state, district, postal code, and geographic coordinates.
 *
 * @component
 * @example
 * ```tsx
 * <SearchPlaces
 *   placeholder="Digite o endereço"
 *   onChange={(value) => console.log('Input:', value)}
 *   onPlaceChanged={(place) => {
 *     console.log('Selected place:', place);
 *     // place = {
 *     //   street: "Rua exemplo",
 *     //   city: "São Paulo",
 *     //   state: "São Paulo",
 *     //   district: "Centro",
 *     //   cep: "01310-100",
 *     //   stateShortName: "SP",
 *     //   streetNumber: "123",
 *     //   coordinates: { lat: -23.5505, lng: -46.6333 }
 *     // }
 *   }}
 *   options={{
 *     componentRestrictions: { country: "br" }
 *   }}
 * />
 * ```
 *
 * @param {SearchPlacesProps} props - Component props
 * @param {StandaloneSearchBoxProps["options"]} [props.options] - Google Maps API options for filtering/customizing search results
 * @param {(value: string) => void} [props.onChange] - Handler called when the input text changes
 * @param {(place: PlaceData) => void} [props.onPlaceChanged] - Handler called when a place is selected, receives structured address data
 * @returns {JSX.Element} An input field with Google Places autocomplete functionality
 *
 * @requires Google Maps JavaScript API with Places library loaded
 * @requires @react-google-maps/api package
 */

function SearchPlaces(props: SearchPlacesProps) {
  const { onChange, onPlaceChanged, options, ...rest } = props;

  const [searchBox, setSearchBox] = useState<any>(null);
  const handleLoad = (ref: any) => setSearchBox(ref);

  const handlePlacesChanged = () => {
    const places = searchBox.getPlaces();
    const place = places[0];

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

    if (place) {
      const street = findData("route");
      const streetNumber = findData("street_number");
      const district = findData("sublocality_level_1");
      const city = findData("administrative_area_level_2");
      const state = findData("administrative_area_level_1");
      const stateShortName = findDataShort("administrative_area_level_1");
      const cep = findData("postal_code");

      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();

      const sendPlace = {
        street,
        city,
        state,
        district,
        cep,
        streetNumber,
        stateShortName,
        coordinates: { lat, lng },
      };

      onPlaceChanged && onPlaceChanged(sendPlace);
    }
  };

  return (
    <StandaloneSearchBox
      onLoad={handleLoad}
      onPlacesChanged={handlePlacesChanged}
      options={options}
    >
      <Input type="text" onChange={(e) => onChange(e.target.value)} {...rest} />
    </StandaloneSearchBox>
  );
}

export { SearchPlaces };
