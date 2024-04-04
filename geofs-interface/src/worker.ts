const fetchOperation = async () => {
    const res = await fetch('https://www.simbrief.com/api/xml.fetcher.php?userid=519024&json=1')

    const preData = await res.json()
  
    const originData = preData.origin
    const mainData = preData.navlog.fix
    const destinationData = preData.destination
  
  
  
    let proposedData: any[] = []
    proposedData.push(originData)
    proposedData = proposedData.concat(mainData)
    proposedData.push(destinationData)

    postMessage(proposedData)
}

onmessage = async e => {
    if(e.data == 'fetch') {
        await fetchOperation()
    }

}