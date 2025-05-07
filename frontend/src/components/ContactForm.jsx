import React, { useState, useRef, useEffect } from "react"; // Import React and the useState hook for managing component state
import axios from "axios"; // Import axios for making HTTP requests
import { useRefresh } from "./useRefresh";

// Define the ContactForm functional component
const ContactForm = () => {
  const { refresh, getApiUrl, sqlCols } = useRefresh();
  const { updateID, setUpdateID } = useRefresh();
  const inputRef = useRef([]);

  const [formData, setFormData] = useState(
    sqlCols.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior (page reload)
    // Send a POST request to the server with the form data
    await axios.post(getApiUrl() + "contacts", {
      ...formData // Spread the formData object to include its individual fields in the request body
    });

    // Clear the form inputs after submission
    setFormData(sqlCols.reduce((acc, field) => ({ ...acc, [field]: "" }), {}));
    refresh();
    if (inputRef.current[0]) inputRef.current[0].focus();
  };
  const handleKeyDown = (event) => {
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
  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior (page reload)
    // Send a POST request to the server with the form data
    await axios.post(getApiUrl() + "contacts/update/" + updateID, {
      ...formData // Spread the formData object to include its individual fields in the request body
    });
    setUpdateID(-1); // Reset the update ID to -1 after updating
    // Clear the form inputs after submission
    setFormData(sqlCols.reduce((acc, field) => ({ ...acc, [field]: "" }), {}));
    refresh();
  }
  const getSingleContact = async (id) => {
    try {
      setFormData(sqlCols.reduce((acc, field) => ({ ...acc, [field]: "" }), {}));
      console.log("Hello: " + id)
      const response = await axios.get(getApiUrl() + "contacts", {
        params: {
          proj: sqlCols.join(";"),
          sel: "id = " + id
        },
      });
      setFormData(response.data[0]); // Set the form data with the fetched contact data
      console.log("data: " + response.data[0])

    } catch (error) {
      console.error("Error fetching contact:", error);
    }
  }
  useEffect(() => {
    if (updateID != -1) {
      getSingleContact(updateID); // Fetch the contact data based on the updateID
    }
  }, [updateID]); 
  // Render the form UI
  return (
    <form onSubmit={handleSubmit} display="flex" justify-content="space-between">
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
              <td key={field}><input
                key={field}
                name={field}
                placeholder={field}
                value={formData[field]}
                onChange={handleChange}
                onKeyDown={index === sqlCols.length - 1 ? handleKeyDown : undefined}
                ref={inputRef[index]}
                required = {(field === "first_name" || field === "last_name") ? 'required' : undefined }
              />
              </td>
            ))}
            <td><button type="submit">Add</button><button onClick={handleUpdate}>Update</button></td>
        </tr>
      </tbody>
      </table>

    </form>
  );
};



export default ContactForm;