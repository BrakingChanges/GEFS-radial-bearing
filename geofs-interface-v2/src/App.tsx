import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "./App.css";
import "leaflet/dist/leaflet.css";

import { LineRenderer } from "./components/LineRenderer";
import { LatLngExpression, icon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { FlightStats } from "./components/FlightStats";
import { useContext, useEffect, useMemo, useState } from "react";
import { SimbriefDataContext } from "./contexts/SimbriefDataContext";

function App() {

  const simbriefData = useContext(SimbriefDataContext)
  const waypointIcon = icon({
    iconUrl: "/waypoint.png",
    shadowUrl: "/waypoint shadow.png",
    iconSize: [32, 32],
    shadowSize: [32, 32],
    shadowAnchor: [16, 16],
    iconAnchor: [16, 16],
  });

  const [planeMarker, setPlaneMarker] = useState<JSX.Element>()
  const ws = new WebSocket('wss://localhost:8080')

  const depAptPosition: LatLngExpression = {
    lat: simbriefData ? Number(simbriefData.origin.pos_lat) : 0,
    lng: simbriefData ? Number(simbriefData.origin.pos_long): 0,
  }

  ws.onmessage = (ev) => {
    const data: GefsAircraft = JSON.parse(ev.data)
    
    setPlaneMarker(
      <Marker position={[data.lat, data.lon]}>
        <Popup>
          <p>{data.altitude}ft</p>
          <p>{data.heading}</p>
        </Popup>
      </Marker>
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if(ws.readyState !== WebSocket.OPEN) return
      ws.send('getPlane')
    }, 4000)

    return () => clearInterval(interval)
  }, [ws])



  return (
    <main className="dark:text-white text-black dark:bg-black bg-white flex justify-center items-center w-screen h-screen">
      {!simbriefData ||
      isNaN(Number(simbriefData?.origin.pos_lat)) ||
      isNaN(Number(simbriefData?.origin.pos_long)) ? (
        <h1>Loading...</h1>
      ) : (
        <MapContainer
          center={depAptPosition}
          zoom={13}
        >
          <LineRenderer simbriefData={simbriefData}></LineRenderer>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={depAptPosition}
            icon={waypointIcon}
          ></Marker>
          <Marker position={depAptPosition} draggable>

          </Marker>
          <MarkerClusterGroup chunkedLoading>
            {simbriefData?.navlog.map((wp) => (
              <Marker
                position={[Number(wp.pos_lat), Number(wp.pos_long)]}
                key={wp.ident}
                icon={waypointIcon}
              >
                <Popup>
                  <h3 className="text-purple-600">
                    <strong>{wp.via_airway}</strong>
                  </h3>
                  <h3>
                    {wp.name} - {wp.ident}
                  </h3>
                  <h3>
                    {wp.altitude_feet}ft - {wp.ind_airspeed}KIAS - M{wp.mach.replace('.','')}
                  </h3>
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
          <FlightStats
            simbriefData={simbriefData}
          />
          {planeMarker}
          <footer>
            <menu>
              <li></li>
            </menu>
          </footer>
        </MapContainer>
      )}
    </main>
  );
}

export default App;
