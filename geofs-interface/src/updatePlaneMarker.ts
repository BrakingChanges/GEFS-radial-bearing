import 'leaflet-rotatedmarker'
import L from 'leaflet'
import { DataClass } from './types'







export const updatePlaneMarker = async (planeMarker: L.Marker<any> | undefined, map: L.Map, planePath: L.Geodesic) => {
    const res = await fetch('http://localhost:5000/data-get')

    if(!res) return


    const data: DataClass = await res.json()

    if(!data) return

    if(planeMarker) map.removeLayer(planeMarker)

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
    planeMarker = L.marker([data.lat, data.lon], {rotationAngle: data.heading, icon: emojiIcon}).addTo(map)

    planeMarker.bindPopup(planePop)
    planePath.addLatLng([data.lat, data.lon])
  }
