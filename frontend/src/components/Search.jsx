import React, { useState } from "react";
import ContactList from "./ContactList";
import { useRefresh } from "./useRefresh";
import ProjSelecter from "./Projection";

const Search = ({ contId, onDelete, Component}) => {
  const { refresh } = useRefresh();

  const handleSubmit = (e)  => {
    e.preventDefault();
    refresh(); // Call the refresh function to trigger a re-render
}
return (
    <div>
        <ProjSelecter t_name={"contacts"}></ProjSelecter>
        <button onClick={handleSubmit}>Show</button>
    </div>
);
};

export default Search;