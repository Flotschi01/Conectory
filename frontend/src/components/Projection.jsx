import React, { useState } from "react";
import axios from "axios";
import { useRefresh } from "./useRefresh";
import { useEffect } from "react";

const ProjSelecter = ({t_name}) => {
const { getApiUrl } = useRefresh();
const { refresh } = useRefresh();

const [Columns, setColumns] = useState(["id"]);
// 
const getColumns = async () => {
    try {
        const response = await axios.get(getApiUrl() + "getColumns", {
            params: {
                table_name: t_name,
            },
        });
        console.log("Columns:", response.data);
        setColumns(response.data);
    } catch (error) {
        console.error("Error fetching SQL:", error);
    }
    refresh(); // Call the refresh function to trigger a re-render
}
  useEffect(() => {
    getColumns();
    console.log("address:" + getApiUrl());
  }, []); // Empty dependency array ensures this runs only once

return (
    <div>
        <h5>select columns</h5>
    <ul>
        {Columns.map((column) => (
            <Item key={column} name={column} />
        ))}
    </ul>
    </div>

);
};
const Item = ({ name }) => {
    return (
        <li><span>{name}</span><input type="checkbox" defaultChecked></input></li>
    )
}

export default ProjSelecter;