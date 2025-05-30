// Importing necessary modules from React and axios for state management, side effects, and HTTP requests
import React, { useEffect, useState } from "react";
import axios from "axios";
import DeleteBtn from "./DeleteBtn"; // Importing the DeleteBtn component for deleting contacts
import { useRefresh } from "./Wrapper";
import UpdateButton from "./UpdateButton";
import RelationsButton from "./RelationsButton";

// Defining the ContactList functional component
const TableList = ({table_name}) => {
  const { getApiUrl, refreshCounter, sqlCols, selection, types } = useRefresh();
  // State to store the list of contacts, initialized as an empty array
  const [rows, setRows] = useState([{
    "error": "No data available"
  },]);


  const fetchSql = React.useCallback(async () => {
    try {
      const response = await axios.get(getApiUrl() + table_name, {
        params: {
          proj: sqlCols.join(";"),
          sel: selection.join(";")
        },
      });
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching SQL:", error);
    }
  }, [getApiUrl, table_name, sqlCols, selection]);
  // Function to fetch contacts from the backend API
  useEffect(() => {
    // Fetch data or do whatever refresh action you need here
    fetchSql(); // Call the function to fetch data when refreshCounter changes
  }, [refreshCounter, fetchSql]); // Adding refreshCounter and fetchSql as dependencies

  // useEffect hook to fetch contacts when the component is mounted
  useEffect(() => {
    fetchSql(); // Calling the fetchContacts function
  }, [fetchSql]); // Adding fetchSql as a dependency
  // Rendering the component's UI
  return (
    <div style={{ maxHeight: "65vh", overflowY: "auto", border: "1px solid #ccc"}}>
  <table>
    <thead>
      <tr>
        <th key={"id"} className="sticky-header">ID</th>
        {Object.keys(rows[0]).map((key) => (key !== "id" ?
          <th key={table_name + key} className="sticky-header">{key}</th> : null
        ))}
        <th className="sticky-header">Actions</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((contact) => (
        <tr key={table_name + contact.id + "-row"}>
          <td key={table_name + contact.id + "-id"}>{contact["id"]}</td>
          {Object.keys(contact).map((key) => (key !== "id" ?
            <td key={table_name + contact.id + "-" + key}>{types[key] === "date" ? convertTime(contact[key]): contact[key]}</td>:null
          ))}
          <td>
            <DeleteBtn contId={contact.id} table_name={table_name} />
            <UpdateButton contId={contact.id}/>
            {table_name === "contacts" && <RelationsButton contId={contact.id}/>}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};
function convertTime(param){
  if(!param)
    return "";
  const date = new Date(param);
  let help = `${date.getFullYear()}-${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  return help;
}
// Exporting the ContactList component as the default export
export default TableList;