/// <reference types="jquery" />
/// <reference types="@geps/geofs-types" />

import Geofs from '@geps/geofs-types/typings/geofs/index'

declare global {
    interface Window {
        geofs: typeof Geofs
    }
}

export const geoFsIsLoaded = async (delay: number, tries: number) => {
    let nTries = 0;
    
    if (!(window.L &&
        window.geofs && geofs.aircraft &&
        geofs.aircraft.instance &&
        geofs.aircraft.instance.object3d)) {
        if(nTries > tries) return false
        await new Promise(() => setTimeout(() => {}, delay))
        nTries++;
    }

    return true
}