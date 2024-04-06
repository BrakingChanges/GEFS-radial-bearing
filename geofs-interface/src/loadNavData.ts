import L, { Geodesic } from 'leaflet'

export const loadNavData = (data: any, lines: Geodesic[], markers: L.Marker[], map: L.Map) => {
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
      markers.push()

      let pop = L.popup({
          content: `<p class="waypoint-font">${data[i].name} - ${data[i].icao_code ? data[i].icao_code : data[i].ident}<p>`
      });
      marker.bindPopup(pop).openPopup();

      if(i == 0) continue
      if(i == data.length - 1) continue

      let line = L.geodesic([L.latLng(startPoint), L.latLng(endPoint)]).addTo(map)
      lines.push(line)


    }
}
