import { GeodesicCircle, Map } from "leaflet";
import { GeodesicLine } from "leaflet.geodesic";

export function reRenderLine(line: GeodesicLine, map: Map) {
    line.remove()
    line.addTo(map)
}

export function reRenderCircle(circle: GeodesicCircle | undefined, map: Map) {
    circle?.remove()
    circle?.addTo(map)
}