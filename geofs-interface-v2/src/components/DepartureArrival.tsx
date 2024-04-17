 import L from "leaflet";
import { useEffect, useState, JSX, useContext } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { SimbriefDataContext } from "../contexts/SimbriefDataContext";
import { GeodesicLine } from "leaflet.geodesic";

export const DepartureArrivalForm = () => {
  const [depRwyLat, setDepRwyLat] = useState<number | string>('');
  const [depRwyLon, setDepRwyLon] = useState<number | string>('');

  const [arrRwyLat, setArrRwyLat] = useState<number | string>('');
  const [arrRwyLon, setArrRwyLon] = useState<number | string>('');
  const [tempDepMarker, setTempDepMarker] = useState<JSX.Element>(<></>)
  const [tempArrMarker, setTempArrMarker] = useState<JSX.Element>(<></>)
  const simbriefData = useContext(SimbriefDataContext)

  const map: L.Map  = useMap()
  let depConnectingLine: GeodesicLine;
  let arrConnectingLine: GeodesicLine;

  useEffect(() => {
    
    setTempDepMarker(<></>)
    if(simbriefData == undefined) return
    if(depConnectingLine !== undefined) depConnectingLine.remove()
    if(arrConnectingLine !== undefined) arrConnectingLine.remove()
    if(typeof depRwyLat !== 'number' || typeof depRwyLon !== 'number' || typeof arrRwyLat !== 'number' || typeof arrRwyLon !=='number') return
    if(isNaN(depRwyLat) || isNaN(depRwyLon) || isNaN(arrRwyLat) || isNaN(arrRwyLon)) return
    
    const depRwyCoords: [number, number] = [depRwyLat, depRwyLon]
    const depWaypointCoords: [number, number] = [Number(simbriefData.navlog[0].pos_lat),Number(simbriefData.navlog[0].pos_long)]
    depConnectingLine = L.geodesic([depRwyCoords, depWaypointCoords]).addTo(map)

    const arrRwyCoords: [number, number] = [arrRwyLat, arrRwyLon]
    const arrWaypointCoords: [number, number] = [Number(simbriefData.navlog[simbriefData.navlog.length - 1].pos_lat), Number(simbriefData.navlog[simbriefData.navlog.length - 1].pos_long)]
    arrConnectingLine = L.geodesic([arrWaypointCoords, arrRwyCoords])

    setTempDepMarker(
      <Marker position={depRwyCoords}>
        <Popup>
          <h3>{simbriefData.origin.icao_code} - {simbriefData.origin.plan_rwy}</h3>
        </Popup>
      </Marker>
    )

    setTempArrMarker(
      <Marker position={arrRwyCoords}>
        <Popup>
          <h3>{simbriefData.destination.icao_code} - {simbriefData.destination.plan_rwy}</h3>
        </Popup>
      </Marker>
    )


    return () => {
      setTempDepMarker(<></>)
      depConnectingLine.remove()
    }

  }, [depRwyLat, depRwyLon, arrRwyLat, arrRwyLon, simbriefData])

  return (
    <>
      <form>
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
        <p>
          Note: The Coordinates you are entering correspond to your takeoff and
          landing runway thresholds
        </p>
      </form>
      {tempDepMarker}
      {tempArrMarker}
    </>
  );
};
