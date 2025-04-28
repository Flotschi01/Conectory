// useRefresh.js
import React, { createContext, useContext, useState, useCallback } from "react";

// Create the context
const RefreshContext = createContext(null);

// Create the provider
export const RefreshProvider = ({ children }) => {
  const [refreshCounter, setRefreshCounter] = useState(0);

  const refresh = useCallback(() => {
    setRefreshCounter((prev) => prev + 1);
  }, []);

  return (
    <RefreshContext.Provider value={{ refreshCounter, refresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

// Custom Hook
export const useRefresh = () => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error("useRefresh must be used inside a RefreshProvider");
  }
  return context;
};
