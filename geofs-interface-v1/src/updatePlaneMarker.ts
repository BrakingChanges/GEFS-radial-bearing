import 'leaflet-rotatedmarker'
import L from 'leaflet'
import { DataClass } from './types/types'
import { promiseHandler } from './utils'







export const updatePlaneMarker = async (planeMarker: L.Marker<any> | undefined, planePath: L.Geodesic): Promise<any> => {
    const [res, error] =  await promiseHandler(fetch('http://localhost:5000/data-get'))

    if(error) return

    if(!res) return

    const data: DataClass = await res.json()

    if(!data) return

    if(planeMarker) {
        planeMarker.setLatLng([data.lat, data.lon])
        planePath.addLatLng([data.lat, data.lon])
        return planeMarker
    }

    for(let val of Object.values(data)) {
      if(val === null) return
    }


    const emojiIcon = L.icon({
      iconUrl: '/plane.png',
      shadowUrl: '/plane shadow.png',
      iconSize: [512/16,512/16],
      shadowSize: [240/16,260/16],
      iconAnchor: [256/16,256/16],
      shadowAnchor: [120/16,130/16],

    })





    let planePop = L.popup({
      content: `
        <p>${data.altitude * 3.28084} ft</p>
        <p></p>
      `
    })
    planeMarker = L.marker([data.lat, data.lon], {rotationAngle: data.heading, icon: emojiIcon})
    planeMarker.bindPopup(planePop)
    planePath.addLatLng([data.lat, data.lon])
    return planeMarker


  }
