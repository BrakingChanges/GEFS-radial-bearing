import { createContext } from "react";
import { SimbriefData } from "../types/SimbriefData";
import { useSimbriefData } from "../hooks/useSimbriefData";

export const SimbriefDataContext = createContext<SimbriefData | undefined>(undefined)

export const SimbriefDataProvider = ({ userId, children }: {
	userId: string,
	children: React.ReactNode
}) => {
	const data = useSimbriefData(userId)

	return (
		<SimbriefDataContext.Provider value={data}>
			{children}
		</SimbriefDataContext.Provider>
	)
}