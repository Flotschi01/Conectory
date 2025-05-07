// useRefresh.js
import React, { createContext, useCallback, useContext, useState } from "react";
import ContactForm from "./ContactForm";
import TableList from "./ContactList";
import Search from "./Search";
// Create the context
const RefreshContext = createContext(null);

// Create the provider
export const Wrapper = ({  table_name }) => {
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [sqlCols, setSqlCols] = useState([]);
  const [selection, setSelection] = useState([]);

  const [updateID, setUpdateID] = useState(-1);

  const refresh = useCallback(() => {
    setRefreshCounter((prev) => prev + 1);
  }, []);

  const getApiUrl = useCallback(() => {
    const hostname = window.location.hostname; // Dynamically gets IP/domain
    return `http://${hostname}:5000/`;
  }, []);

  return (
    <RefreshContext.Provider value={{ refreshCounter, refresh, getApiUrl, sqlCols, setSqlCols, selection, setSelection, updateID, setUpdateID }}>
      <section>
        <h1>{table_name.charAt(0).toUpperCase() + table_name.slice(1)} List</h1>   
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <Search table_name={table_name}/>       
          </div>
        </section>
        <section>
          <h2>
            Table:
          </h2>
          <ContactForm table_name={table_name}/>
          <TableList table_name={table_name}/>
        </section>
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
