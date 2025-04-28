import React, { useState } from "react";
import ContactList from "./ContactList";

const Search = ({ contId, onDelete, Component}) => {
  const [showComponent, setShowComponent] = useState(false);
  const [sql, setsql] = useState("");

  const handleClick = () => {
    setShowComponent(!showComponent);
  };
  const handleSubmit = (e)  => {
    e.preventDefault();
    setsql(e.target.elements.sqlInput.value);
    setShowComponent(true);
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