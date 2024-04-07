/// <reference types="jquery" />
/// <reference types="@geps/geofs-types" />

import './style.css'
import 'leaflet/dist/leaflet'
import 'leaflet.geodesic/dist/leaflet.geodesic'
import 'leaflet-rotatedmarker/leaflet.rotatedMarker'
import  L, { Marker } from 'leaflet'
import { CircleListEl } from './types/types'
import { GeodesicLine } from 'leaflet.geodesic/dist/leaflet.geodesic'
import { reRenderCircle } from './utils'
import { updatePlaneMarker } from './updatePlaneMarker'
import { loadNavData } from './loadNavData'
import { updateCircles } from './updateCircles'
import { processInput } from './processInput'
import { checkData } from './checkData'
import { Navlog, SImbriefData } from './types/SimbriefData'

const newWorker = new Worker("./src/worker.ts", {
  type: 'module'
})

newWorker.postMessage('fetch')


const map = L.map('map').setView([0, 0], 2);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

let planeMarker: Marker | undefined = undefined;
const planePath = L.geodesic([], {weight: 2, opacity: 0.5, color: 'blue'}).addTo(map)

let dataR = localStorage.getItem('data')

console.log(dataR)
let data: Navlog[] = dataR !== null ? JSON.parse(dataR)[1] : []
let preData: SImbriefData = dataR !== null ? JSON.parse(dataR)[0] : []




const flightStat = <HTMLHeadingElement>document.getElementById('flight-stat-title')


flightStat.innerText = `FLIGHT STATS: ${preData.general?.icao_airline} ${preData.general?.flight_number}`

const genRoute = <HTMLParagraphElement>document.getElementById('gen-route')
console.log(data)
let geofsTailoredRoutes: GefsWaypoint[] = data.map((wp) => [wp.ident.toString(), Number(wp.pos_lat), Number(wp.pos_long), Number(wp.altitude_feet), false,null])

let geo: GefsData = preData.length != 0 ? [preData.origin.icao_code, preData.destination.icao_code, preData.general?.flight_number, [geofsTailoredRoutes]] : []
let geoData = ''
genRoute.innerText = geo == undefined ? '' : JSON.stringify(geo)

newWorker.onmessage = e => {
  checkData(e, data, lines, preData, map, genRoute, geoData, flightStat, markers)
}
let markers: L.Marker[] = []
let lines: GeodesicLine[] = [];

loadNavData(data, lines, markers, map)


planeMarker = await updatePlaneMarker(planeMarker, planePath)
planeMarker?.addTo(map)

setInterval(async () => {
  planeMarker =  await updatePlaneMarker(planeMarker, planePath)
  planeMarker?.addTo(map)
}, 1000/20)

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



const processorWrapper = () => {
  circle.circle?.remove()
  circle.marker?.remove()
  circle.connectingLine?.remove()
  console.log('b')
  let circ2 = processInput(waypointInput, distInput, wpCrs, wpSlider, data, circles, circlesList, map, wpColor)
  console.log(circ2)
  circle = circ2 !== undefined ? circ2 : {
    name: 'N/A',
    circle: undefined,
    marker: undefined,
    connectingLine: undefined
  }
  reRenderCircle(circle?.circle, map)
}


waypointInput.addEventListener('input', processorWrapper);
distInput.addEventListener('input', processorWrapper);
wpColor.addEventListener('input', processorWrapper);
wpCrs.addEventListener('input',processorWrapper);
wpSlider.addEventListener('input', (e) => {
  e.preventDefault()
  wpCrs.value = wpSlider.value
  processorWrapper()
});




const circlesList = <HTMLDivElement>document.getElementById('circles-list');
const wpForm = <HTMLFormElement>document.getElementById('wp-form')

wpForm.addEventListener('submit', (ev) => {
  ev.preventDefault();

  circle?.circle?.remove()
  circle?.marker?.remove()
  circle?.connectingLine?.remove()



  circles.push(circle);
  updateCircles(circles, circlesList, map);
  wpForm.reset()
});

const copyButton = <HTMLButtonElement>document.getElementById('copy-route-button')


copyButton.addEventListener('click', async (e) => {
  try {
    e.preventDefault()

    await navigator.clipboard.writeText(geoData)
    console.log('done!')
  } catch (err) {
    console.log(err);
  }
})


const wpDepArrForm = <HTMLFormElement>document.getElementById('wp-dep-arr-form')
const depRunwayLat = <HTMLInputElement>document.getElementById('dep-runway-lat')
const depRunwayLon = <HTMLInputElement>document.getElementById('dep-runway-lon')
const arrRunwayLat = <HTMLInputElement>document.getElementById('arr-runway-lat')
const arrRunwayLon = <HTMLInputElement>document.getElementById('arr-runway-lon')



wpDepArrForm.addEventListener('submit', e => {
  e.preventDefault()
  const depRunwayLat_ = Number(depRunwayLat.value)
  const depRunwayLon_ = Number(depRunwayLon.value)
  const arrRunwayLat_ = Number(arrRunwayLat.value)
  const arrRunwayLon_ = Number(arrRunwayLon.value)

  if(isNaN(depRunwayLat_)) return
  if(isNaN(depRunwayLon_)) return
  if(isNaN(arrRunwayLat_)) return
  if(isNaN(arrRunwayLon_)) return

  if(
    arrRunwayLat.value === '' ||
    arrRunwayLon.value === '' ||
    depRunwayLat.value === '' ||
    depRunwayLon.value === ''
  ) return

  console.log(depRunwayLat_, depRunwayLon_)
  data.splice(0, 0, {
    name: 'DEP_RWY',
    ident: 'DEP_RWY',
    pos_lat: depRunwayLat.value,
    pos_long: depRunwayLon.value,
    altitude_feet: "0",
    type: '',
    icao_region: '',
    frequency: '',
    stage: '',
    via_airway: '',
    is_sid_star: '',
    distance: '',
    track_true: '',
    track_mag: '',
    heading_true: '',
    heading_mag: '',
    ind_airspeed: '',
    true_airspeed: '',
    mach: '',
    mach_thousandths: '',
    wind_component: '',
    groundspeed: '',
    time_leg: '',
    time_total: '',
    fuel_flow: '',
    fuel_leg: '',
    fuel_totalused: '',
    fuel_min_onboard: '',
    fuel_plan_onboard: '',
    oat: '',
    oat_isa_dev: '',
    wind_dir: '',
    wind_spd: '',
    shear: '',
    tropopause_feet: '',
    ground_height: '',
    mora: '',
    fir: '',
    fir_units: '',
    fir_valid_levels: '',
    wind_data: [],
    fir_crossing: []
  })

  data.splice(data.length - 1 , 0, {
    name: 'ARR_RWY',
    ident: 'ARR_RWY',
    pos_lat: arrRunwayLat.value,
    pos_long: arrRunwayLon.value,
    altitude_feet: "0",
    type: '',
    icao_region: '',
    frequency: '',
    stage: '',
    via_airway: '',
    is_sid_star: '',
    distance: '',
    track_true: '',
    track_mag: '',
    heading_true: '',
    heading_mag: '',
    ind_airspeed: '',
    true_airspeed: '',
    mach: '',
    mach_thousandths: '',
    wind_component: '',
    groundspeed: '',
    time_leg: '',
    time_total: '',
    fuel_flow: '',
    fuel_leg: '',
    fuel_totalused: '',
    fuel_min_onboard: '',
    fuel_plan_onboard: '',
    oat: '',
    oat_isa_dev: '',
    wind_dir: '',
    wind_spd: '',
    shear: '',
    tropopause_feet: '',
    ground_height: '',
    mora: '',
    fir: '',
    fir_units: '',
    fir_valid_levels: '',
    wind_data: [],
    fir_crossing: []
  })

  loadNavData(data, lines, markers, map)
  let geofsTailoredRoutes = data.map((wp: any) => [wp.ident, Number(wp.pos_lat), Number(wp.pos_long), Number(wp.altitude_feet), false, null])

  let geo = preData.length != 0 ? [preData.origin.icao_code, preData.destination.icao_code, preData.general?.flight_number, geofsTailoredRoutes] : undefined

  genRoute.innerText = geo == undefined ? '' : JSON.stringify(geo)
  geoData = geo == undefined ? '' : JSON.stringify(geo)


})

export {}