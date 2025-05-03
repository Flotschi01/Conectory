import React, { useState, useRef } from "react"; // Import React and the useState hook for managing component state
import axios from "axios"; // Import axios for making HTTP requests
import { useRefresh } from "./useRefresh";

// Define the ContactForm functional component
const ContactForm = () => {
  const { refresh, getApiUrl, sqlCols } = useRefresh();
  const inputRef = useRef(null);

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
    if (inputRef.current) inputRef.current.focus();
  };
  const handleKeyDown = (event) => {
    // Check if Enter key is pressed (keyCode 13 or 'Enter')
    if (event.key === 'Enter') {

      // Reset the focus to the input element
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // Render the form UI
  return (
    <form onSubmit={handleSubmit} display="flex" justify-content="space-between" gap="10px">
      {sqlCols.map((field, index) => (field == "id" ? null : // Skip rendering the 'id' field
        <input
          key={field}
          name={field}
          placeholder={field}
          value={formData[field]}
          onChange={handleChange}
          onKeyDown={index === sqlCols.length - 1 ? handleKeyDown : undefined}
          ref={index === 0 ? inputRef : null}
          required = {(field === "first_name" || field === "last_name") ? 'required' : undefined }
        />
      ))}
      <button type="submit">Ok</button>
    </form>
  );
};



export default ContactForm;