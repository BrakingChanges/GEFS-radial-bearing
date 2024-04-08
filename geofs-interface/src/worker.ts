import { SImbriefData } from "./types/SimbriefData"

const fetchOperation = async () => {

    // Replace with your userId found by going to Simbrief Dispatch(https://dispatch.simbrief.com/account) and copying the value under the "Pilot ID Field"
    const userId = '519024'
    const res = await fetch(`https://www.simbrief.com/api/xml.fetcher.php?userid=${userId}&json=v2`)


    if(!res) return

    const preData: SImbriefData = await res.json()

    const mainData = preData.navlog


    console.log(preData)

    postMessage([preData, mainData])
}

onmessage = async e => {
    if(e.data == 'fetch') {
        await fetchOperation()
    }

}