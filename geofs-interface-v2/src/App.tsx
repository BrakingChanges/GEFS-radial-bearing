import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "./App.css";
import "leaflet/dist/leaflet.css";
import { DepartureArrivalForm } from "./components/DepartureArrival";

import { useEffect, useState } from "react";
import { SimbriefData } from "./types/SimbriefData";
import { LineRenderer } from "./components/LineRenderer";
import { icon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

function App() {
  const [simbriefData, setSimbriefData] = useState<SimbriefData | undefined>(
    undefined
  );
  const [userId, setUserId] = useState("519024");
  const waypointIcon = icon({
    iconUrl: "/waypoint.png",
    shadowUrl: "/waypoint shadow.png",
    iconSize: [32, 32],
    shadowSize: [32, 32],
    shadowAnchor: [16, 16],
    iconAnchor: [16, 16],
  });

  useEffect(() => {
    fetch(
      `https://www.simbrief.com/api/xml.fetcher.php?userid=${userId}&json=v2`
    )
      .then((res) => res.json())
      .then((res: SimbriefData) => {
        setSimbriefData(res);
      });
  }, [userId]);

  return (
    <main className="dark:text-white text-black">
      {!simbriefData ||
      isNaN(Number(simbriefData?.origin.pos_lat)) ||
      isNaN(Number(simbriefData?.origin.pos_long)) ? (
        <h1>Loading...</h1>
      ) : (
        <MapContainer
          center={[
            Number(simbriefData?.origin.pos_lat),
            Number(simbriefData?.origin.pos_long),
          ]}
          zoom={13}
        >
          <LineRenderer simbriefData={simbriefData}></LineRenderer>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[
              Number(simbriefData.origin.pos_lat),
              Number(simbriefData.origin.pos_long),
            ]}
            icon={waypointIcon}
          ></Marker>
          <MarkerClusterGroup chunkedLoading>
            {simbriefData?.navlog.map((wp) => (
              <Marker
                position={[Number(wp.pos_lat), Number(wp.pos_long)]}
                key={wp.ident}
                icon={waypointIcon}
              >
                <Popup>
                  <h3>{wp.name} - {wp.ident}</h3>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>

          <Marker
            position={[
              Number(simbriefData.destination.pos_lat),
              Number(simbriefData.destination.pos_long),
            ]}
            icon={waypointIcon}
          ></Marker>
          <DepartureArrivalForm simbriefData={simbriefData} />
        </MapContainer>
      )}
    </main>
  );
}

export default App;
