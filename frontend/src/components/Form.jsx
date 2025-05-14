import React, { useState, useRef, useEffect } from "react"; // Import React and the useState hook for managing component state
import axios from "axios"; // Import axios for making HTTP requests
import { useRefresh } from "./Wrapper";
import { useGlobal } from "./GlobalContext";
import DropDown from "./DropDown";
import EnumPicker from "./EmumPicker";
// Define the ContactForm functional component
const ContactForm = ({table_name}) => {
  const { refresh, getApiUrl, sqlCols, setSelection } = useRefresh();
  const { updateID, setUpdateID } = useRefresh();
  const { types } = useRefresh();
  const { personIDs, setPersID} = useGlobal();

  const inputRef = useRef([]);

  const [formData, setFormData] = useState(
    sqlCols.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
  );
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior (page reload)
    // Send a POST request to the server with the form data
    await axios.post(getApiUrl() + table_name, {
      ...formData // Spread the formData object to include its individual fields in the request body
    });

    // Clear the form inputs after submission
    clearData();
    refresh();
    if (inputRef.current[0]) inputRef.current[0].focus();
  };
  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior (page reload)
    // Send a POST request to the server with the form data
    await axios.post(getApiUrl() + table_name + "/update/" + updateID, {
      ...formData // Spread the formData object to include its individual fields in the request body
    });
    setUpdateID(-1); // Reset the update ID to -1 after updating
    // Clear the form inputs after submission
    clearData();
    refresh();
  }
  const handleKeyDown = (event) => {//reseting the cursor to the first input field only called on the last input field
    // Check if Enter key is pressed (keyCode 13 or 'Enter')

    if (event.key === 'Enter') {

      // Reset the focus to the input element
      if (inputRef.current[0]) {
        inputRef.current[0].focus();
      } 
    }
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

  };
  
  const handleSearch = () => {
    let help = [];
    sqlCols.forEach(element => {
      if(formData[element]){
        help.push(element + " = " + formData[element]);
      }
    });
    setSelection(help)
    clearData()
    refresh()
  }
  const getSingleContact = async (id) => {
    try {
      setFormData(sqlCols.reduce((acc, field) => ({ ...acc, [field]: "" }), {}));
      const response = await axios.get(getApiUrl() + table_name, {
        params: {
          proj: sqlCols.join(";"),
          sel: "id = " + id
        },
      });
      setFormData(response.data[0]); // Set the form data with the fetched contact data

    } catch (error) {
      console.error("Error fetching contact:", error);
    }
  }
  const clearData = () => {
    setFormData(sqlCols.reduce((acc, field) => ({ ...acc, [field]: "" }), {}));
    setPersID(-1)
  }
  useEffect(() => {
    if (updateID != -1) {
      getSingleContact(updateID); // Fetch the contact data based on the updateID
    }
  }, [updateID]); 
  useEffect(() => {
    const  name  = "person1_id";
    const value = personIDs[0];
    setFormData((prev) => ({ ...prev, [name]: value }));
    const  name1  = "person2_id";
    const value1 = personIDs[1];
    setFormData((prev) => ({ ...prev, [name1]: value1 }));
  }, [personIDs]); 
  // Render the form UI
  return (
    <div style={{ maxWidth: "95vw", overflowX: "auto", overflowY: "visible", border: "1px solid #ccc", position: "relative"}}>
    <form onSubmit={updateID == -1 ? handleSubmit : handleUpdate}>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            {sqlCols.map((key) => (key == "id" ? null :<th key={key}>{key}</th>))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{updateID == -1 ? "/" : updateID}</td>
            {sqlCols.map((field, index) => (field == "id" ? null : // Skip rendering the 'id' field
              field.endsWith("_id") && field.startsWith("person") ? // if its a person selector
              <td key = {field}><p 
              onChange={handleKeyDown}
              >{formData[field] != undefined ? formData[field] : ""}</p></td> :
              field.endsWith("_e") ? 
              <td key={field}><EnumPicker 
              name={field}
              value={formData[field] ? formData[field] : ""}
              onChange={handleKeyDown} 
              options={types[field].match(/'([^']+)'/g).map(s => s.replace(/'/g, ''))}//complex to convert enum('option1','option2') to
               /></td>//array ['option1','option2']
              :
              <td key={field}><input
                style={{width: 100 / (sqlCols.length + (table_name=="contacts" ? 2 : 3)) + "vw"}}
                key={field}
                type={types[field] == "date" ? "date" : "text"}
                name={field}
                placeholder={field}
                value={formData[field] ? types[field] == "date" ? convertTime(formData[field]): formData[field] : ""}
                onChange={handleKeyDown}
                onKeyDown={index === sqlCols.length - 1 ? handleKeyDown : undefined}
                ref={inputRef[index]}
                required = {(field === "first_name" || field === "last_name") ? 'required' : undefined }
              />
              </td>
            ))}
            <td><button type="submit">Add/Update</button>
            <button type = "button" onClick={handleSearch}>Search</button></td>
        </tr>
      </tbody>
      </table>
    </form>
    </div>
  );
};

function convertTime(param){
  if(!param)
    return "";
  const date = new Date(param);
  let help = date.toISOString().split('T')[0];
  //let help = `${date.getFullYear()}-${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  return help;
}

export default ContactForm;