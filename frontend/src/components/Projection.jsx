import React, { useState } from "react";
import axios from "axios";
import { useRefresh } from "./Wrapper";
import { useEffect } from "react";

const ProjSelecter = ({table_name}) => {
const { getApiUrl } = useRefresh();
const { refresh, sqlCols, setSqlCols} = useRefresh();

const [allSqlCols, SetAllSqlCols] = useState(["id"]);
// 
 
const toggle = (col) => {
    setSqlCols((prev) =>
        prev.includes(col)
          ? prev.filter((f) => f !== col)
          : [...prev, col]
      );
        refresh();
  };


  useEffect(() => {
    if(allSqlCols.length > 1) return; // Prevents infinite loop
    SetAllSqlCols(sqlCols);
  }, [sqlCols]); // Empty dependency array ensures this runs only once

return (
    <div>
        <h5>select columns</h5>
    <ul>
        {allSqlCols.map((column) => (
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