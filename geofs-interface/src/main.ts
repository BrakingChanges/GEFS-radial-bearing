/// <reference types="jquery" />
/// <reference types="@geps/geofs-types" />

import './style.css'
import 'leaflet/dist/leaflet'
import 'leaflet.geodesic/dist/leaflet.geodesic'
import 'leaflet-rotatedmarker/leaflet.rotatedMarker'
import  L, { Marker } from 'leaflet'
import { Aircraft } from '@geps/geofs-types/typings/geofs/aircraft'

const map = L.map('map').setView([0, 0], 2);

type DataClass = {
  "lat": Aircraft["llaLocation"][0],
  "lon": Aircraft["llaLocation"][1],
  "heading": Aircraft["htr"][0],
  "altitude": Aircraft["llaLocation"][2]
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let planeMarker: Marker;
const planePath = L.geodesic([], {weight: 2, opacity: 0.5, color: 'blue'}).addTo(map)

const res = await fetch('http://192.168.100.20:5000/route-data')

const data = await res.json()

const lines = []
for(let k of data) {
  let mark = L.marker([k.pos_lat, k.pos_long]).addTo(map)
  
  let pop = L.popup({
    content: `<p class="waypoint-font">${k.name} - ${k.ident}<p>`
  })
  mark.bindPopup(pop).openPopup()
  lines.push(L.latLng(k.pos_lat, k.pos_long))
}


L.geodesic(lines, {color: 'magenta', weight: 4, opacity: 0.5}).addTo(map)

const updatePlaneMarker = async () => {
  const res = await fetch('http://192.168.100.20:5000/data-get')
  
  if(!res) return

  /**
   * 
   */
  const data: DataClass = await res.json()
  
  if(!data) return

  if(planeMarker) map.removeLayer(planeMarker)



  const emojiIcon = L.icon({
    iconUrl: './public/plane.png',
    shadowUrl: './public/plane shadow.png',
    iconSize: [512/16,512/16],
    shadowSize: [240/16,260/16],
    iconAnchor: [256/16,256/16],
    shadowAnchor: [120/16,130/16],

  })





  let planePop = L.popup({
    content: `<p class="waypoint-font">${data.altitude * 3.28084} ft</p>`
  })
  planeMarker = L.marker([data.lat, data.lon], {rotationAngle: data.heading, icon: emojiIcon}).addTo(map)
  
  planeMarker.bindPopup(planePop)
  planePath.addLatLng([data.lat, data.lon])
}


setInterval(updatePlaneMarker, 4 * 1000)



export {}