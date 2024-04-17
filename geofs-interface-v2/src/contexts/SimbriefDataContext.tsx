import { createContext } from "react";
import { SimbriefData } from "../types/SimbriefData";

export const SimbriefDataContext = createContext<SimbriefData | undefined>(undefined)