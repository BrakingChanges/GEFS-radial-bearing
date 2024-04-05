/// <reference types="jquery" />
/// <reference types="@geps/geofs-types" />

import './style.css'
import 'leaflet/dist/leaflet'
import 'leaflet.geodesic/dist/leaflet.geodesic'
import 'leaflet-rotatedmarker/leaflet.rotatedMarker'
import  L, { Marker } from 'leaflet'
import { CircleListEl } from './types'
import { GeodesicLine } from 'leaflet.geodesic/dist/leaflet.geodesic'
import { deepCloneCircleEl, reRenderCircle, reRenderLine } from './utils'
import {computeDestinationPoint} from 'geolib'
import { field } from 'geomag'
import { updatePlaneMarker } from './updatePlaneMarker'
import { loadNavData } from './loadNavData'

const map = L.map('map').setView([0, 0], 2);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

let planeMarker: Marker | undefined = undefined;
const planePath = L.geodesic([], {weight: 2, opacity: 0.5, color: 'blue'}).addTo(map)

let dataR = localStorage.getItem('data')

let data: any[]  = dataR !== null ? JSON.parse(dataR) : []

const newWorker = new Worker("./src/worker.ts")

newWorker.postMessage('fetch')

const flightStat = <HTMLHeadingElement>document.getElementById('flight-stat-title')


flightStat.innerText = `FLIGHT STATS: ${data[0].general?.flight_number} ${data[0].general?.flight_number}`

newWorker.onmessage = e => {
  if(data != e.data[1]) {
    data = e.data[1]
    localStorage.setItem('data', JSON.stringify(data))
    lines.forEach((line) => line.remove())
    loadNavData(data, lines, map)

  }
  flightStat.innerText = `FLIGHT STATS: ${e.data[0].general.flight_number}`

}

const lines: GeodesicLine[] = [];

loadNavData(data, lines, map)


updatePlaneMarker(planeMarker, map, planePath)





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
  updateCircles()

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
    const adjustedCrs = field(wp.pos_lat, wp.pos_long).declination + Number(crsTrimmed)
    const destination = noCrs ? {latitude: 0, longitude: 0} : computeDestinationPoint([wp.pos_long,wp.pos_lat],Number(distTrimmed)*1852,adjustedCrs)
    console.log(destination)
    circle = {
      name: wp.ident,
      circle: L.geodesiccircle(L.latLng(wp.pos_lat, wp.pos_long), {
        radius: Number(distTrimmed) * 1852,
    }).addTo(map),
      marker: noCrs ? undefined : L.marker([destination.latitude, destination.longitude]).addTo(map),
      connectingLine: noCrs ? undefined: L.geodesic([L.latLng([destination.latitude, destination.longitude]), L.latLng([wp.pos_lat, wp.pos_long])]).addTo(map)
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
  ev.preventDefault();

  circle.circle?.remove()
  circle.marker?.remove()
  circle.connectingLine?.remove()

  const circle_ = deepCloneCircleEl(circle)


  circles.push(circle_);
  updateCircles();
  wpForm.reset()
});


const updateCircles = () => {
  console.log(circles)
  circlesList.innerHTML = ''; // Clear previous HTML

  if (circles.length === 1) {
    circles[0].circle?.removeFrom(map)
    circles[0].marker?.removeFrom(map)
    circles[0].connectingLine?.removeFrom(map)
    circles[0].circle?.addTo(map)
    circles[0].marker?.addTo(map)
    circles[0].connectingLine?.addTo(map)
  }


  circles.forEach((circleEl, index) => {
    circleEl.circle?.removeFrom(map)
    circleEl.marker?.removeFrom(map)
    circleEl.connectingLine?.removeFrom(map)
    circleEl.circle?.addTo(map)
    circleEl.marker?.addTo(map)
    circleEl.connectingLine?.addTo(map)
    const radius = circleEl.circle?.radius;
    const markerPosition = circleEl.marker?.getLatLng()
    let circleHTML = `
      <div>
        <p class="waypoint-font">
          ${circleEl.name}/${radius !== undefined ? radius/1852: radius}
          ${markerPosition?.lat}, ${markerPosition?.lng}
        </p>
        <div style="width:10px;height:10px;background-color:${circleEl.circle?.options.color};"></div>
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