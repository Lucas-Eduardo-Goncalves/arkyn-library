import { GoogleMap as Map, Marker } from "@react-google-maps/api";
import { MapPinned } from "lucide-react";
import { HtmlHTMLAttributes } from "react";

import "./styles.css";

type MapViewProps = {
  zoom?: number;
  draggable?: boolean;
  coordinates?: { lat: number; lng: number };
} & HtmlHTMLAttributes<HTMLDivElement>;

function MapView(props: MapViewProps) {
  const {
    coordinates,
    zoom = 18,
    draggable = false,
    className,
    ...rest
  } = props;

  if (!coordinates) {
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
        center={coordinates}
        mapContainerStyle={{
          borderRadius: "var(--rounded-cards)",
          width: "100%",
          height: "100%",
        }}
      >
        <Marker draggable={draggable} position={coordinates} />
      </Map>
    </div>
  );
}

export { MapView };
