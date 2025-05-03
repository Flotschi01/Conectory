import React, { useState } from "react";
import ContactList from "./ContactList";
import { useRefresh } from "./useRefresh";
import ProjSelecter from "./Projection";

const Search = ({ contId, onDelete, Component}) => {
  const { refresh, setSelection } = useRefresh();

  const handleSubmit = (e)  => {
    e.preventDefault();
    setSelection(e.target.search.value.split(";")); // Set the selection state to the value of the search input field
    refresh(); // Call the refresh function to trigger a re-render
}
return (
        <form onSubmit={handleSubmit} style={{width: "100%"}}>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <ProjSelecter t_name={"contacts"}></ProjSelecter>
                <input type="text" placeholder="SQL statement with spaces" name="search" />
            </div>
        <button type="submit">Show</button>
        </form>
    );
};

export default Search;