 import L from "leaflet";
import { useEffect, useState, JSX } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { SimbriefData } from "../types/SimbriefData";
import { GeodesicLine } from "leaflet.geodesic";

export const DepartureArrivalForm = ({ simbriefData }: {simbriefData: SimbriefData}) => {
  const [depRwyLat, setDepRwyLat] = useState<number>(0);
  const [depRwyLon, setDepRwyLon] = useState<number>(0);

  const [arrRwyLat, setArrRwyLat] = useState<number>(0);
  const [arrRwyLon, setArrRwyLon] = useState<number>(0);
  const [tempDepMarker, setTempDepMarker] = useState<JSX.Element>(<></>)

  const map: L.Map  = useMap()
  let depConnectingLine: GeodesicLine;

  useEffect(() => {
    
    setTempDepMarker(<></>)
    if(depConnectingLine !== undefined) depConnectingLine.remove()
    if(isNaN(depRwyLat) || isNaN(depRwyLon) || isNaN(arrRwyLat) || isNaN(arrRwyLon)) return
    
    const depRwyCoords: [number, number] = [depRwyLat, depRwyLon]
    const depWaypointCoords: [number, number] = [Number(simbriefData.navlog[0].pos_lat),Number(simbriefData.navlog[0].pos_long)]
    depConnectingLine = L.geodesic([depRwyCoords, depWaypointCoords]).addTo(map)

    setTempDepMarker((
      <Marker position={depRwyCoords}>
        <Popup>
          <h3>{simbriefData.origin.icao_code} - {simbriefData.origin.plan_rwy}</h3>
        </Popup>
      </Marker>
    ))


    return () => {
      setTempDepMarker(<></>)
      depConnectingLine.remove()
    }

  }, [depRwyLat, depRwyLon, arrRwyLat, arrRwyLon, simbriefData])

  return (
    <>
      <form className="absolute top-4 right-4 z-[1000] dark:bg-black/75 bg-white/75 shadow-md rounded-md p-4">
        <section className="flex flex-col gap-2">
          <h2>Departure Runway Coordinates</h2>
          <input
            placeholder="latitude"
            required
            value={depRwyLat}
            onChange={e => setDepRwyLat(Number(e.target.value))}
            className="dark:bg-zinc-900 bg-white"
          />
          <input
            placeholder="longitude"
            required
            value={depRwyLon}
            onChange={e => setDepRwyLon(Number(e.target.value))}
            className="dark:bg-zinc-900 bg-white"
          />
        </section>
        <section className="flex flex-col gap-2">
          <h2>Approach Runway Coordinates</h2>
          <input
            placeholder="latitude"
            required
            value={arrRwyLat}
            onChange={e => setArrRwyLat(Number(e.target.value))}
            className="dark:bg-zinc-900 bg-white"
          />
          <input
            placeholder="longitude"

            value={arrRwyLon}
            onChange={e => setArrRwyLon(Number(e.target.value))}
            className="dark:bg-zinc-900 bg-white"
          />
        </section>

        <button type="submit" className="bg-zinc-900">Submit</button>
        <p>
          Note: The Coordinates you are entering correspond to your takeoff and
          landing runway thresholds
        </p>
      </form>
      {tempDepMarker}
    </>
  );
};
