import { CircleListEl } from "./types";
import { field } from 'geomag'
import { computeDestinationPoint } from 'geolib'

import L from 'leaflet'
import { updateCircles } from "./updateCircles";

export const processInput = (waypointInput: HTMLInputElement, distInput: HTMLInputElement, wpCrs: HTMLInputElement, wpSlider: HTMLInputElement, data: any, circles: CircleListEl[], circlesList: HTMLDivElement, map: L.Map, wpColor: HTMLInputElement): CircleListEl | undefined => {
    updateCircles(circles, circlesList, map)

    const wpTrimmed = waypointInput.value.trim();
    const distTrimmed = distInput.value.trim();
    const crsTrimmed = wpCrs.value.trim()

    wpSlider.value = crsTrimmed


    // Ensure distTrimmed is a valid number
    if (isNaN(Number(distTrimmed))) return undefined;
    if(distTrimmed === '') return undefined;

    const noCrs = isNaN(Number(crsTrimmed)) || crsTrimmed === ''

    // Ensure wpTrimmed is not empty
    if (wpTrimmed === '') return undefined;
    console.log(wpTrimmed)


    for (let wp of data) {
      if (wp.ident != wpTrimmed && wp.icao_code != wpTrimmed) continue;
      let name = wp.icao_code ? wp.icao_code : wp.ident
      L.GeodesicCircle.prototype.options.color = wpColor.value
      L.GeodesicCircle.prototype.options.fillOpacity = 0
      const adjustedCrs = field(wp.pos_lat, wp.pos_long).declination + Number(crsTrimmed)
      const destination = noCrs ? {latitude: 0, longitude: 0} : computeDestinationPoint([wp.pos_long,wp.pos_lat],Number(distTrimmed)*1852,adjustedCrs)
      console.log(destination)
      return {
        name: name,
        circle: L.geodesiccircle(L.latLng(wp.pos_lat, wp.pos_long), {
          radius: Number(distTrimmed) * 1852,
      }).addTo(map),
        marker: noCrs ? undefined : L.marker([destination.latitude, destination.longitude]).addTo(map),
        connectingLine: noCrs ? undefined: L.geodesic([L.latLng([destination.latitude, destination.longitude]), L.latLng([wp.pos_lat, wp.pos_long])]).addTo(map)
      };
    }


}