import { useEffect, useState } from "react";
import { SimbriefData } from "../types/SimbriefData";

export const useSimbriefData = (userId: string) => {
    const [simbriefData, setSimbriefData] = useState<SimbriefData | undefined>(undefined);
    
    useEffect(() => {
        fetch(
          `https://www.simbrief.com/api/xml.fetcher.php?username=${userId}&json=v2`
        )
          .then((res) => res.status == 200 ? res.json(): {})
          .then((res: SimbriefData | object) => {
            setSimbriefData(Object.keys(res).length === 0 ? undefined : res as SimbriefData);
          });
        }, [userId]);
    
    return simbriefData;
}