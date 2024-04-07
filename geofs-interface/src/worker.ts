import { SImbriefData } from "./types/SimbriefData"

const fetchOperation = async () => {
    const res = await fetch('https://www.simbrief.com/api/xml.fetcher.php?userid=519024&json=v2')


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