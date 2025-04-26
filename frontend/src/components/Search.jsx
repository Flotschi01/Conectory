import React, { useState } from "react";
import axios from "axios";

const Search = ({ contId, onDelete, Component}) => {
  const [showComponent, setShowComponent] = useState(false);

  const handleClick = () => {
    setShowComponent(!showComponent);
  };
  const selection = (sql) => {};
return (
    <div>
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const sql = e.target.elements.sqlInput.value;
                selection(sql);
            }}
        >
            <input type="text" name="sqlInput" placeholder="Enter SQL query" />
            <button type="submit">Submit</button>
        </form>
    </div>
);
};

export default Search;