// ==UserScript==
// @name         GEOFS Location Uplink
// @namespace    http://tampermonkey.net/
// @version      2024-04-02
// @description  Serves as an uplink to remote python interface
// @author       Aiden Israel
// @match        https://www.geo-fs.com/geofs.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('afterDeferredload', () => {
        var interval = setInterval(() => {
            fetch('http://localhost:5000/data', {
                method: 'POST',
                body: JSON.stringify({
                    "lat": geofs.aircraft.instance.llaLocation[0],
                    "lon": geofs.aircraft.instance.llaLocation[1]
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'no-cors'
            }, 100)
            clearInterval()
        })
        

    })
})();