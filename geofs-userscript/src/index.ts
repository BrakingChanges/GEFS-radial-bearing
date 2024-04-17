/// <reference types="jquery" />
/// <reference types="@geps/geofs-types" />


import { WebSocketServer } from 'ws'


window.addEventListener('afterDeferredload', () => {
    const wss = new WebSocketServer({
        port: 8080
    })

    wss.on('connection', ws => {
        ws.on('error', console.error)

        ws.on('message', data => {
            if(typeof data === 'string' && data == 'getPlane') {
                ws.send(JSON.stringify({
                    "lat": geofs.aircraft.instance.llaLocation[0],
                    "lon": geofs.aircraft.instance.llaLocation[1],
                    "heading": geofs.aircraft.instance.htr[0],
                    "altitude": geofs.aircraft.instance.llaLocation[2]
                }))
            }
        })


    })



})
