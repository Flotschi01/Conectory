import React, { useState } from "react";
import axios from "axios";
import { useRefresh } from "./useRefresh";
import { useEffect } from "react";

const ProjSelecter = ({t_name}) => {
const { getApiUrl } = useRefresh();
const { refresh, setColumns } = useRefresh();

const [SQLColumns, SQLsetColumns] = useState(["id"]);
// 
const ItemRefs = {
  };
const getColumns = async () => {
    try {
        const response = await axios.get(getApiUrl() + "getColumns", {
            params: {
                table_name: t_name,
            },
        });
        console.log("Columns:", response.data);
        SQLsetColumns(response.data);
    } catch (error) {
        console.error("Error fetching SQL:", error);
    }
    refresh(); // Call the refresh function to trigger a re-render
}
const handleSet = () => {
    try{    let help = {};
    SQLColumns.forEach(col => {
        help[col] = ItemRefs[col].current;
        console.log("col:" + col + " checked:" + help[col]);
    });}
    catch (error) {
        console.error("Error fetching SQL:", error);
    }

}
  useEffect(() => {
    getColumns();
    console.log("address:" + getApiUrl());
  }, []); // Empty dependency array ensures this runs only once

return (
    <div>
        <h5>select columns</h5>
    <ul>
        {SQLColumns.map((column) => (
            ItemRefs[column] = React.createRef(),
            <Item className={"projSelecterListElement"} key={column} name={column} handleSet={handleSet} ref={ItemRefs[column]}/>
        ))}
    </ul>
    </div>

);
};
const Item = ({ name, handleSet, checked }) => {
    return (
        <li><span>{name}</span><input type="checkbox" defaultChecked onClick={handleSet} checked={checked}></input></li>
    )
}

export default ProjSelecter;