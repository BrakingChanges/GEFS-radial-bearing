import { useEffect, useState } from "react";
import { SimbriefData } from "../types/SimbriefData";

export const useSimbriefData = (userId: string) => {
    const [simbriefData, setSimbriefData] = useState<SimbriefData | undefined>(undefined);
    
    useEffect(() => {
        if (isNaN(Number(userId)) || userId.length !== 6) return;
        fetch(
          `https://www.simbrief.com/api/xml.fetcher.php?userid=${userId}&json=v2`
        )
          .then((res) => res.json())
          .then((res: SimbriefData) => {
            setSimbriefData(res);
          });
        }, [userId]);
    
    return simbriefData;
}