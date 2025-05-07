import React, { useState } from "react";
import TableList from "./ContactList";
import { useRefresh } from "./Wrapper";
import ProjSelecter from "./Projection";

const Search = ({table_name}) => {
  const { refresh, setSelection } = useRefresh();

  const handleSubmit = (e)  => {
    e.preventDefault();
    setSelection(e.target.search.value.split(";")); // Set the selection state to the value of the search input field
    refresh(); // Call the refresh function to trigger a re-render
}
return (
        <form onSubmit={handleSubmit} style={{width: "100%"}}>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <ProjSelecter table_name={table_name}></ProjSelecter>
                <input type="text" placeholder="SQL statement with spaces" name="search" />
            </div>
        <button type="submit">Show</button>
        </form>
    );
};

export default Search;