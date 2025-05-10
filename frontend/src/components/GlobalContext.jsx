// useRefresh.js
import React, { createContext, useContext, useState } from "react";

// Create the context
const GlobalContext = createContext(null);

// Create the provider
export const Global = ({children}) => {
    const [personIDs, setPersonIDs] = useState([]);

    const setPersID = (id) => {
        if(id === -1){
            setPersonIDs([]);
            return;
        }
        if(personIDs[0]){
            setPersonIDs([personIDs[0], id])
        }else if(personIDs[1]){
            return; //both are set
        }else{
            setPersonIDs([id])
        }
    }

  return (
    <GlobalContext.Provider value={{ personIDs, setPersID}}>
      {children}
    </GlobalContext.Provider>
  );
};


// Custom Hook
export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used inside a RefreshProvider");
  }
  return context;
};
