"use strict";
(() => {
  // src/index.ts
  window.addEventListener("afterDeferredload", () => {
    var interval = setInterval(() => {
      fetch("http://localhost:5000/data", {
        method: "POST",
        body: JSON.stringify({
          "lat": window.geofs.aircraft.instance.llaLocation[0],
          "lon": geofs.aircraft.instance.llaLocation[1],
          "heading": geofs.aircraft.instance.htr[0],
          "altitude": geofs.aircraft.instance.llaLocation[2]
        }),
        headers: {
          "Content-Type": "application/json"
        },
        mode: "no-cors"
      });
    }, 4e3);
  });
})();
