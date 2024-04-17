import { useMap } from "react-leaflet";
import { SimbriefData } from "../types/SimbriefData";
import { useEffect } from "react";
import L from "leaflet";

export const LineRenderer = ({
  simbriefData,
}: {
  simbriefData: SimbriefData;
}) => {
  const map = useMap();

  useEffect(() => {
    if (simbriefData && simbriefData.navlog && simbriefData.navlog.length > 0) {
      for (let i = 0; i < simbriefData.navlog.length - 1; i++) {
        L.geodesic([
          [
            Number(simbriefData.navlog[i].pos_lat),
            Number(simbriefData.navlog[i].pos_long),
          ],
          [
            Number(simbriefData.navlog[i + 1].pos_lat),
            Number(simbriefData.navlog[i + 1].pos_long),
          ],
        ], {
          color: simbriefData.navlog[i].is_sid_star == '1' ? "green": "magenta"
        }).addTo(map);
      }
    }
  }, [simbriefData]);

  return null; // or render some component if needed
};
