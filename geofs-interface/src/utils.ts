import { GeodesicCircle, Map, Marker } from "leaflet";
import { GeodesicLine } from "leaflet.geodesic";
import { CircleListEl } from "./types";

export const reRenderLine = (line: GeodesicLine | undefined, map: Map) => {
    line?.remove()
    line?.addTo(map)
}

export const  reRenderCircle = (circle: GeodesicCircle | undefined, map: Map) => {
    circle?.remove()
    circle?.addTo(map)
}

export const reRenderMarker = (marker: Marker |  undefined, map: Map) => {
    marker?.remove()
    marker?.addTo(map)
}


export const  deepCloneCircleEl = (circle: CircleListEl): CircleListEl => circle

