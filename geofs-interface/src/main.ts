/// <reference types="jquery" />
/// <reference types="@geps/geofs-types" />

import './style.css'
import 'leaflet/dist/leaflet'
import 'leaflet.geodesic/dist/leaflet.geodesic'
import 'leaflet-rotatedmarker/leaflet.rotatedMarker'
import  L, { Marker } from 'leaflet'
import { CircleListEl, DataClass } from './types'
import { GeodesicLine } from 'leaflet.geodesic/dist/leaflet.geodesic'
import { reRenderCircle, reRenderLine } from './utils'
import {computeDestinationPoint} from 'geolib'

const map = L.map('map').setView([0, 0], 2);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

let planeMarker: Marker;
const planePath = L.geodesic([], {weight: 2, opacity: 0.5, color: 'blue'}).addTo(map)

let dataR = localStorage.getItem('data')

let data: any[]  = dataR !== null ? JSON.parse(dataR) : []

const newWorker = new Worker("./src/worker.ts")

newWorker.postMessage('fetch')

const flightStat = <HTMLHeadingElement>document.getElementById('flight-stat-title')

flightStat.innerText = `FLIGHT STATS: ######`

newWorker.onmessage = e => {
  if(data != e.data[1]) {
    data = e.data[1]
  }
  flightStat.innerText = `FLIGHT STATS: ${e.data[0].general.flight_number}`
}




const lines: GeodesicLine[] = [];

// Loop through data to create markers and LineStrings
for (let i = 0; i < data?.length - 1; i++) {
    let startPoint: [number, number, number]  = [Number(data[i].pos_lat), Number(data[i].pos_long), 0];
    let endPoint: [number, number, number] = [Number(data[i + 1].pos_lat), Number(data[i + 1].pos_long), 0];



    let line = L.geodesic([L.latLng(startPoint), L.latLng(endPoint)]).addTo(map)
    lines.push(line)
    // Create marker for each waypoint
    let icon = L.icon({
      iconUrl: '/waypoint.png',
      shadowUrl: '/waypoint shadow.png',
      iconSize: [32,32],
      shadowSize: [32,32],
      shadowAnchor: [16,16],
      iconAnchor: [16,16]
    })
    
    let marker = L.marker(startPoint, {
      icon: icon
    }).addTo(map);

    let pop = L.popup({
        content: `<p class="waypoint-font">${data[i].name} - ${data[i].ident}<p>`
    });
    marker.bindPopup(pop).openPopup();
}

lines[0].options.color = 'red'
reRenderLine(lines[0],map)


const updatePlaneMarker = async () => {
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


setInterval(updatePlaneMarker, 4 * 1000)

const waypointInput = <HTMLInputElement>document.getElementById('waypoint-input');
const distInput = <HTMLInputElement>document.getElementById('dist-input');
const wpColor =  <HTMLInputElement>document.getElementById('wp-color')
const wpCrs = <HTMLInputElement>document.getElementById('wp-crs')
const wpSlider = <HTMLInputElement>document.getElementById('wp-slider')

const circles: CircleListEl[] = []
let circle: CircleListEl = {
  marker: undefined,
  circle: undefined,
  name: undefined,
  connectingLine: undefined
}




const processInput = () => {
  const wpTrimmed = waypointInput.value.trim();
  const distTrimmed = distInput.value.trim();
  const crsTrimmed = wpCrs.value.trim()

  wpSlider.value = crsTrimmed


  if(circle.circle != undefined) circle.circle.remove()
  if(circle.marker != undefined) circle.marker.remove()
  if(circle.connectingLine != undefined) circle.connectingLine.remove()
  // Ensure distTrimmed is a valid number
  if (isNaN(Number(distTrimmed))) return;
  if(distTrimmed === '') return;

  const noCrs = isNaN(Number(crsTrimmed)) || crsTrimmed === ''

  // Ensure wpTrimmed is not empty
  if (wpTrimmed === '') return;  
  console.log(wpTrimmed)

 
  for (let wp of data) {
    if (wp.ident != wpTrimmed && wp.name != wpTrimmed) continue;
    L.GeodesicCircle.prototype.options.color = wpColor.value
    L.GeodesicCircle.prototype.options.fillOpacity = 0
    console.log(wp.pos_lat, wp.pos_long)
    const destination = noCrs ? {latitude: 0, longitude: 0} : computeDestinationPoint([wp.pos_long,wp.pos_lat],Number(distTrimmed)*1852,Number(crsTrimmed))
    console.log(destination)
    circle = {
      name: wp.ident,
      circle: L.geodesiccircle(L.latLng(wp.pos_lat, wp.pos_long), {
        radius: Number(distTrimmed) * 1852,
    }).addTo(map),
      marker: noCrs ? undefined : L.marker([destination.latitude, destination.longitude]).addTo(map),
      connectingLine: L.geodesic([L.latLng([destination.latitude, destination.longitude]), L.latLng([wp.pos_lat, wp.pos_long])]).addTo(map)
    };
    reRenderCircle(circle?.circle, map)
  }
}

waypointInput.addEventListener('input', processInput);  
distInput.addEventListener('input', processInput);
wpColor.addEventListener('input', processInput);
wpCrs.addEventListener('input', processInput);
wpSlider.addEventListener('input', (e) => {
  e.preventDefault()
  wpCrs.value = wpSlider.value
  processInput()
});



const circlesList = <HTMLDivElement>document.getElementById('circles-list');
const wpForm = <HTMLFormElement>document.getElementById('wp-form')

wpForm.addEventListener('submit', (ev) => {
  ev.preventDefault()
  circles.push(circle)
  updateCircles()

})

const updateCircles = () => {
  circlesList.innerHTML = ''; // Clear previous HTML
  circles.forEach((circle, index) => {
    const radius = circle.circle?.radius;
    let circleHTML = `
      <div>
        <p class="waypoint-font">
          ${circle.name}/${radius}
        </p>
        <div style="width:100px;height:100px;background-color:${circle.circle?.options.color};"></div>
        <button id="circle-${index}-button" class="waypoint-font">Remove</button>
      </div>
    `;

    circlesList.innerHTML += circleHTML;

    const button: HTMLButtonElement = <HTMLButtonElement>document.getElementById(`circle-${index}-button`);

    button.addEventListener('click', (ev) => {
      ev.preventDefault();
      circle.circle?.remove();
      circles.splice(index, 1);
      updateCircles(); // Update the circles list after removing the circle
    });
  });
}






export {}