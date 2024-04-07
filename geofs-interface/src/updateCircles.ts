import { CircleListEl } from "./types/types";
import L from 'leaflet'

export const updateCircles = (circles: CircleListEl[], circlesList: HTMLDivElement, map: L.Map) => {
    console.log(circles)
    circlesList.innerHTML = ''; // Clear previous HTML



    circles.forEach((circle, index) => {
      circle.circle?.addTo(map)
      circle.marker?.addTo(map)
      circle.connectingLine?.addTo(map)
      const radius = circle.circle?.radius;
      const markerPosition = circle.marker?.getLatLng()
      let circleHTML = `
        <li>
          <p class="waypoint-font">
            ${circle.name}/${radius !== undefined ? radius/1852: radius}
            ${markerPosition?.lat}, ${markerPosition?.lng}
          </p>
          <div style="width:10px;height:10px;background-color:${circle.circle?.options.color};"></div>
          <button id="circle-${index}-button" class="waypoint-font">Remove</button>
        </li>
      `;

      circlesList.innerHTML += circleHTML;

      const button: HTMLButtonElement = <HTMLButtonElement>document.getElementById(`circle-${index}-button`);

      button.addEventListener('click', (ev) => {
        ev.preventDefault();
        circle.circle?.remove();
        circle.marker?.remove()
        circle.connectingLine?.remove()
        circles.splice(index, 1);
        updateCircles(circles, circlesList, map); // Update the circles list after removing the circle
      });
    });
  }

