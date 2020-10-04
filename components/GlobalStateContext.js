import React, { useState } from "react";

const GlobalStateContext = React.createContext([{}, () => {}]);

const GlobalStateProvider = ({ children }) => {
  const [globalStats, setGlobalStats] = useState({
    child: {
      dob: null,
      dom: new Date(new Date().getTime() + 10 * 60000),
      gestationInDays: 280,
      hc: "",
      height: "",
      sex: "",
      weight: "",
    },
    neonate: {
      dob: null,
      dom: new Date(new Date().getTime() + 10 * 60000),
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
