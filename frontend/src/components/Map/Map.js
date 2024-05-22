import React, { useEffect, useState } from "react";
import classes from "./map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { toast } from "react-toastify";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";

export default function Map({ readOnly, location, onChange }) {
  return (
    <div className={classes.container}>
      {/* map container and tileLayer from leaflet together makes the whole map */}
      <MapContainer
        className={classes.map}
        center={[0, 0]}
        zoom={1}
        dragging={!readOnly}
        touchZoom={!readOnly}
        doubleClickZoom={!readOnly}
        scrollWheelZoom={!readOnly}
        boxZoom={!readOnly}
        keyboard={!readOnly}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FindButtonAndMarker
          readOnly={readOnly}
          location={location}
          onChange={onChange}
        />
      </MapContainer>
    </div>
  );
}

function FindButtonAndMarker({ readOnly, location, onChange }) {
  const [position, setPosition] = useState(location);

  useEffect(() => {
    if (readOnly) {
      map.setView(position, 13);
      return;
    }

    if (position) onChange(position);
  }, [position]);

  const map = useMapEvents({
    click(e) {
      !readOnly && setPosition(e.latlng);
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 13);
    },
    locationerror(e) {
      toast.error(e.message);
    },
  });

  const markerIcon = new L.Icon({
    iconUrl: "/marker-icon-2x.png",
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -41],
  });

  return (
    <>
      {!readOnly && (
        <button
          type="button"
          className={classes.find_location}
          onClick={() => map.locate()}
        >
          Find My Location
        </button>
      )}

      {position && (
        <Marker
          eventHandlers={{
            dragend: (e) => {
              setPosition(e.target.getLatLng());
            },
          }}
          position={position}
          draggable={!readOnly}
          icon={markerIcon}
        >
          <Popup>Shipping Location</Popup>
        </Marker>
      )}
    </>
  );
}
