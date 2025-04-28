import React, { useState } from "react";
import ContactList from "./ContactList";
import { useRefresh } from "./useRefresh";

const Search = ({ contId, onDelete, Component}) => {
  const [showComponent, setShowComponent] = useState(false);
  const [sql, setsql] = useState("");
  const { refresh } = useRefresh();

  const handleSubmit = (e)  => {
    e.preventDefault();
    setsql(e.target.elements.sqlInput.value);
    setShowComponent(true);
    console.log("SQL query submitted:", e.target.elements.sqlInput.value);
    refresh(); // Call the refresh function to trigger a re-render
}
return (
    <div>
        <form
            onSubmit={handleSubmit}
        >
            <input type="text" name="sqlInput" placeholder="Enter SQL query" />
            <button type="submit">Submit</button>
        </form> 
        {showComponent && <ContactList query={sql} /> }
    </div>
);
};

export default Search;