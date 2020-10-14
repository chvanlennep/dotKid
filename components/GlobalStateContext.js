import React, { useState } from "react";

const GlobalStateContext = React.createContext([{}, () => {}]);

const GlobalStateProvider = ({ children }) => {
  const [globalStats, setGlobalStats] = useState({
    child: {
      dob: null,
      tob: null,
      gestationInDays: 280,
      hc: "",
      height: "",
      sex: "",
      weight: "",
    },
    neonate: {
      dob: null,
      tob: null,
      gestationInDays: 0,
      hc: "",
      length: "",
      sex: "",
      weight: "",
    },
  });
  return (
    <GlobalStateContext.Provider value={[globalStats, setGlobalStats]}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export { GlobalStateContext, GlobalStateProvider };
