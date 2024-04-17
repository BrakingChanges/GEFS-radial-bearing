import { SimbriefData } from "../types/SimbriefData";

export const FlightStats = ({
  simbriefData,
}: {
  simbriefData: SimbriefData;
}) => {
    const geoRoute = [
        simbriefData.origin.icao_code,
        simbriefData.destination.icao_code,
        `${simbriefData.general.icao_airline}${simbriefData.general.flight_number}`,
        simbriefData.navlog.map(wp => [wp.name, Number(wp.pos_lat), Number(wp.pos_long), Number(wp.altitude_feet)])
    ]
  return (
    <section className="absolute top-4 right-4 z-[1000] dark:bg-black/75 bg-white/75 shadow-md rounded-md p-4">
      <h1 className="font-mono text-2xl">
        {simbriefData.general.icao_airline} {simbriefData.general.flight_number}{" "}
        - {simbriefData.aircraft.icao_code}
      </h1>
      
      <details>
        <summary>Route</summary>
        <p onClick={() => navigator.clipboard.writeText(JSON.stringify(geoRoute)).then(() => console.log('Success'))}>
            {JSON.stringify(geoRoute)}
        </p>
      </details>

    </section>
  );
};
