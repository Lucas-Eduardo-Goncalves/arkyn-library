import mapBoxGl, { Map } from "mapbox-gl";
import { createRoot } from "react-dom/client";
import "./mapbox.css";
import {
  useEffect,
  useRef,
  type HtmlHTMLAttributes,
  type ReactNode,
} from "react";

type Coordinate = {
  lat: number;
  lng: number;
  data?: any;
  popUp?: ReactNode;
};

type ClientMapViewProps = {
  center?: Coordinate;
  coordinates: Coordinate[];
  onMarkerClick?: (coordinate: Coordinate) => void;
  accessToken: string;
} & HtmlHTMLAttributes<HTMLDivElement>;

function ClientMapView({
  center: rawCenter,
  coordinates,
  onMarkerClick,
  accessToken,
  ...rest
}: ClientMapViewProps) {
  const mapRef = useRef<Map>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const center = rawCenter ? rawCenter : coordinates[0];

  useEffect(() => {
    mapBoxGl.accessToken = accessToken;

    mapRef.current = new mapBoxGl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/light-v11",
      center: [center.lng, center.lat],
      zoom: 13,
      language: "pt-BR",
    });

    coordinates.forEach((props) => {
      const { lat, lng, popUp } = props;
      const el = document.createElement("img");

      el.className = "arkynMarker";
      el.src = "https://i.postimg.cc/mgKggjk7/Pin.png";

      const marker = new mapBoxGl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(mapRef.current!);

      if (popUp) {
        const popupNode = document.createElement("div");
        const root = createRoot(popupNode);
        root.render(popUp);

        const popup = new mapBoxGl.Popup({
          offset: 25,
          closeButton: false,
          className: "arkynMapViewPopup",
        }).setDOMContent(popupNode);

        marker.setPopup(popup);
      }

      el.addEventListener("click", () => {
        if (onMarkerClick) onMarkerClick(props);
        mapRef.current!.flyTo({ center: [lng, lat], zoom: 15, duration: 1200 });
        marker.togglePopup();
      });
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <div
      id="map-container"
      ref={mapContainerRef}
      style={{ height: "100%", width: "100%", borderRadius: "8px" }}
      {...rest}
    />
  );
}

export { ClientMapView };
