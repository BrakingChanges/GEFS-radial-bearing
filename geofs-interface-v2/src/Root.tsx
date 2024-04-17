import { useState } from "react";
import { SimbriefDataContext } from "./contexts/SimbriefDataContext";
import { useSimbriefData } from "./hooks/useSimbriefData";
import { Outlet } from "react-router-dom";

export const Root = () => {
  const [userId, setUserId] = useState("");

  return (
    <>
      <form className="absolute top-4 right-4 dark:bg-black/75 bg-white/75 shadow-md rounded-md p-4">
        <h4>User ID</h4>
        <input
          placeholder="User Id"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="dark:bg-zinc-900 bg-white"
        />
      </form>
      <SimbriefDataContext.Provider value={useSimbriefData(userId)}>
        <Outlet></Outlet>
      </SimbriefDataContext.Provider>
    </>
  );
};
