import {
  GoogleMap as Map,
  Marker,
  MarkerProps,
  InfoWindow,
  InfoWindowProps,
} from "@react-google-maps/api";
import { MapPinned } from "lucide-react";
import { HtmlHTMLAttributes, ReactNode } from "react";

import "./styles.css";

type Coordinate = {
  lat: number;
  lng: number;
  data?: any;
  children?: ReactNode;
};

type MapViewProps = {
  zoom?: number;
  draggable?: boolean;
  coordinates?: Coordinate | Coordinate[];
  markerProps?: MarkerProps;
  infoProps?: InfoWindowProps;
  onMarkerClick?: (coordinate: Coordinate) => void;

  infoWindowIndex?: number;
  openInfoWindow?: (index: number) => void;
  closeInfoWindow?: () => void;
} & HtmlHTMLAttributes<HTMLDivElement>;

function MapView(props: MapViewProps) {
  const {
    coordinates,
    zoom = 18,
    draggable = false,
    className,
    onMarkerClick,
    markerProps,
    infoProps,
    infoWindowIndex,
    openInfoWindow,
    closeInfoWindow,
    ...rest
  } = props;

  const coordArray = Array.isArray(coordinates) ? coordinates : [coordinates];

  if (coordArray.length === 0 || !coordinates) {
    return (
      <div className={"arkynMapViewPinnedEmpty " + className} {...rest}>
        <MapPinned />
      </div>
    );
  }

  return (
    <div className={"arkynMapViewPinned " + className} {...rest}>
      <Map
        zoom={zoom}
        center={coordArray[0]}
        mapContainerStyle={{
          borderRadius: "8px",
          width: "100%",
          height: "100%",
        }}
      >
        {coordArray.map((coordinate, index) => (
          <Marker
            {...markerProps}
            key={`marker-${index}`}
            position={coordinate}
            onClick={() => {
              onMarkerClick && onMarkerClick(coordinate);
              openInfoWindow && !!coordinate?.children && openInfoWindow(index);
            }}
          />
        ))}

        {!!infoWindowIndex && coordArray[infoWindowIndex]?.children && (
          <InfoWindow
            position={coordArray[infoWindowIndex]}
            onCloseClick={() => closeInfoWindow && closeInfoWindow()}
          >
            {coordArray[infoWindowIndex].children}
          </InfoWindow>
        )}
      </Map>
    </div>
  );
}

export { MapView };
