type GefsData  = [string, string, string, [GefsWaypoint[]]]  | []
type GefsWaypoint = [string, number, number, number, boolean, null]
type GefsAircraft = {
    lat: number,
    lon: number,
    heading: number,
    altitude: number
}