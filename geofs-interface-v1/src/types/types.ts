import { Aircraft } from "@geps/geofs-types/typings/geofs/aircraft"
import { Geodesic, GeodesicCircle, Marker } from "leaflet"


export type DataClass = {
    "lat": Aircraft["llaLocation"][0],
    "lon": Aircraft["llaLocation"][1],
    "heading": Aircraft["htr"][0],
    "altitude": Aircraft["llaLocation"][2]
}

export type CircleListEl = {
    name: string | undefined,
    circle: GeodesicCircle | undefined,
    marker: Marker | undefined,
    connectingLine: Geodesic | undefined
}



export type Coordinate = [number, number]