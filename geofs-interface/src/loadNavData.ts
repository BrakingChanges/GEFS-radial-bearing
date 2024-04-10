import L, { Geodesic } from 'leaflet'
import { icon } from './icons'
import { Navlog } from './types/SimbriefData'

export const loadNavData = (data: Navlog[], lines: Geodesic[], markers: L.Marker[], map: L.Map) => {
    // Loop through data to create markers and LineStrings
    lines.forEach(line => {
      line.remove()
      lines.splice(lines.indexOf(line), 1)
    })
    markers.forEach(marker => {
      marker.remove()
      markers.splice(markers.indexOf(marker), 1)
    })

    for (let i = 0; i < data?.length - 1; i++) {
      let startPoint: [number, number, number]  = [Number(data[i].pos_lat), Number(data[i].pos_long), 0];
      let endPoint: [number, number, number] = [Number(data[i + 1].pos_lat), Number(data[i + 1].pos_long), 0];

      // Create marker for each waypoint

      let marker = L.marker(startPoint, {
        icon: icon
      }).addTo(map);
      markers.push()

      let pop = L.popup({
          content: `<p class="waypoint-font">${data[i].name} - ${data[i].ident}<p>`
      });
      marker.bindPopup(pop)

      if(i !== data.length - 2) {
        let line =  L.geodesic([L.latLng(startPoint), L.latLng(endPoint)]).addTo(map)
        lines.push(line)
      }



    }
    const event = new Event('loadCompleted')
    window.dispatchEvent(event)
}
