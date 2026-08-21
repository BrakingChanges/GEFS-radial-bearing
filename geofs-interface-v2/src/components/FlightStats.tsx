import { useEffect, useState } from "react";
import { SimbriefData } from "../types/SimbriefData";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import 'leaflet-rotatedmarker'

type PosData = {
  lat: number;
  lon: number;
  heading: number[];
};

export const FlightStats = ({
  simbriefData,
  setPlaneMarker,
}: {
  simbriefData: SimbriefData;
  setPlaneMarker: React.Dispatch<React.SetStateAction<JSX.Element | undefined>>;
}) => {
  const geoRoute = [
    simbriefData.origin.icao_code,
    simbriefData.destination.icao_code,
    `${simbriefData.general.icao_airline}${simbriefData.general.flight_number}`,
    simbriefData.navlog.map((wp) => [
      wp.name,
      Number(wp.pos_lat),
      Number(wp.pos_long),
      Number(wp.altitude_feet),
    ]),
  ];

  const [position, setPosition] = useState<PosData | null>(null);

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const res = await fetch("http://localhost:5000/data-get");
        const data = await res.json() as PosData;


        setPosition(data);

        const icon = L.icon({
          iconUrl: "/plane.png",
          shadowUrl: "/plane shadow.png",
          shadowSize: [0, 0],
          shadowAnchor: [16, 16],
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        

        setPlaneMarker(
          <Marker
            key={`${data.lat},${data.lon}`}
            position={[data.lat, data.lon]}
            icon={icon}
            rotationAngle={data.heading[0]}

          >
            <Popup>
              Latitude: {data.lat.toFixed(5)} <br />
              Longitude: {data.lon.toFixed(5)} <br />
              Heading: {data.heading[0] < 0 ? (360 + data.heading[0]).toFixed(0) : data.heading[0].toFixed(0)}°
            </Popup>
          </Marker>
        );
      } catch (err) {
        console.error("Error fetching position:", err);
      }
    };

    const interval = setInterval(fetchPosition, 1000);
    return () => clearInterval(interval);
  }, [setPlaneMarker]);

  return (
    <section className="absolute top-4 right-4 z-1000 dark:bg-black/75 bg-white/75 shadow-md rounded-md p-4">
      <h1 className="font-mono text-2xl">
        {simbriefData.general.icao_airline} {simbriefData.general.flight_number} -{" "}
        {simbriefData.aircraft.icao_code}
      </h1>

      <details>
        <summary>Route</summary>
        <p
          onClick={() =>
            navigator.clipboard
              .writeText(JSON.stringify(geoRoute))
              .then(() => console.log("Route copied"))
          }
        >
          {JSON.stringify(geoRoute)}
        </p>

        <p>
          <strong>Live Tracking:</strong>{" "}
          {position
            ? `${position.lat.toFixed(5)}, ${position.lon.toFixed(5)} (hdg ${position.heading[0] < 0 ? (360 +position.heading[0]).toFixed(0) : position.heading[0].toFixed(0)}°)`
            : "Waiting for data..."}
        </p>
      </details>
    </section>
  );
};
