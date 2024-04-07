import { Geodesic } from "leaflet"
import { loadNavData } from "./loadNavData"
import L from "leaflet"
import { icon } from "./icons"

export const checkData  =  (e: MessageEvent, data: any, lines: Geodesic[], preData: any, map: L.Map, genRoute: HTMLParagraphElement, geoData: string, flightStat: HTMLHeadingElement, markers: L.Marker[]) => {
    if(data != e.data[1]) {
        data = e.data[1]
        preData = e.data[0]

        L.marker([Number(preData.origin.pos_lat), Number(preData.origin.pos_long)], {icon: icon}).addTo(map)
        L.marker([Number(preData.destination.pos_lat), Number(preData.destination.pos_long)], {icon: icon}).addTo(map)


        localStorage.setItem('data', JSON.stringify(e.data))
        lines.forEach((line) => line.remove())
        loadNavData(data, lines, markers, map)
        let geofsTailoredRoutes = data.map((wp: any) => [wp.ident, Number(wp.pos_lat), Number(wp.pos_long), Number(wp.altitude_feet), false, null])

        let geo = preData.length != 0 ? [preData.origin.icao_code, preData.destination.icao_code, preData.general?.flight_number].concat([geofsTailoredRoutes.slice(1,-1)]) : undefined

        genRoute.innerText = geo == undefined ? '' : JSON.stringify(geo)
        geoData = geo == undefined ? '' : JSON.stringify(geo)


      }
      flightStat.innerText = `FLIGHT STATS: ${preData.general?.icao_airline} ${preData.general?.flight_number}`

}