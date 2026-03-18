import { ClientOnly } from "@arkyn/components";
import { MapPinned } from "lucide-react";
import type { HtmlHTMLAttributes, ReactNode } from "react";

import { ClientMapView } from "./mapView.client";
import "./styles.css";

type Coordinate = {
  lat: number;
  lng: number;
  data?: any;
  popUp?: ReactNode;
};

type MapViewProps = {
  accessToken: string;
  zoom?: number;
  coordinates?: Coordinate | Coordinate[];
  onMarkerClick?: (coordinate: Coordinate) => void;
} & HtmlHTMLAttributes<HTMLDivElement>;

type EmptyMapProps = {
  className?: string;
};

function EmptyMap({ className }: EmptyMapProps) {
  return (
    <div className={"arkynMapViewPinnedEmpty " + className}>
      <MapPinned />
    </div>
  );
}

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
