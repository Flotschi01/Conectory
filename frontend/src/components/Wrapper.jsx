// useRefresh.js
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import ContactForm from "./Form";
import TableList from "./TableList";
import Search from "./Search";
import axios from "axios";
// Create the context
const RefreshContext = createContext(null);

// Create the provider
export const Wrapper = ({  table_name }) => {
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [sqlCols, setSqlCols] = useState([]);
  const [selection, setSelection] = useState([]);
  const [types, setTypes] = useState({});
  const [updateID, setUpdateID] = useState(-1);

  const refresh = useCallback(() => {
    setRefreshCounter((prev) => prev + 1);
  }, []);

  const getApiUrl = useCallback(() => {
    const hostname = window.location.hostname; // Dynamically gets IP/domain
    return `http://${hostname}:5000/`;
  }, []);
  const getColumns = async () => {
    try {
        const response = await axios.get(getApiUrl() + "getColumns", {
            params: {
                table_name: table_name,
            },
        });
        setSqlCols(Object.keys(response.data));
        setTypes(response.data)
    } catch (error) {
        console.error("Error fetching SQL:", error);
    }}
useEffect(() => {
    getColumns();
  }, []); // Initialize sqlCols with "id" when the component mounts
  return (
    <RefreshContext.Provider value={{ refreshCounter, refresh, getApiUrl, 
    sqlCols, setSqlCols, selection, setSelection, updateID, setUpdateID, types }}>
      <div style={table_name == "contacts" ? {backgroundColor: "#F4F0FA"} : 
                                             {backgroundColor: "#E6FAF9"}} id ="wrapper">
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
        </div>
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
