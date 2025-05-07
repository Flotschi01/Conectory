import React, { useState } from "react";
import axios from "axios";
import { useRefresh } from "./useRefresh";
import { useEffect } from "react";

const ProjSelecter = ({t_name}) => {
const { getApiUrl } = useRefresh();
const { refresh, sqlCols, setSqlCols } = useRefresh();

const [SQLColumns, SQLsetColumns] = useState(["id"]);
// 
 
const getColumns = async () => {
    try {
        const response = await axios.get(getApiUrl() + "getColumns", {
            params: {
                table_name: t_name,
            },
        });
        SQLsetColumns(response.data);
        setSqlCols(response.data);
    } catch (error) {
        console.error("Error fetching SQL:", error);
    }
    refresh(); // Call the refresh function to trigger a re-render
}
const toggle = (col) => {
    setSqlCols((prev) =>
        prev.includes(col)
          ? prev.filter((f) => f !== col)
          : [...prev, col]
      );

  };


  useEffect(() => {
    getColumns();
  }, []); // Empty dependency array ensures this runs only once

return (
    <div>
        <h5>select columns</h5>
    <ul>
        {SQLColumns.map((column) => (
            column == "id" ? null :
            <Item key={column} name={column} checked={sqlCols.includes(column)} handleSet={() => toggle(column)}/>
        ))}
    </ul>
    </div>
);
};
const Item = ({ name, handleSet, checked }) => {
    return (
        <li key={name}><span>{name}</span><input type="checkbox" onChange={handleSet} checked={checked}></input></li>
    )
}

export default ProjSelecter;