import React, { useState } from "react"; // Import React and the useState hook for managing component state
import axios from "axios"; // Import axios for making HTTP requests
import { useRefresh } from "./useRefresh";
// Define the ContactForm functional component
const ContactForm = () => {
  // Declare state variables for the form inputs: 'first_name' and 'last_name'
  const [first_name, setfirst_name] = useState(""); // 'first_name' holds the input value for the first_name field
  const [last_name, setlast_name] = useState(""); // 'last_name' holds the input value for the last_name field
  const { refresh } = useRefresh();

  const handleSubmit = async (e) => {
    

    e.preventDefault(); // Prevent the default form submission behavior (page reload)

    // Send a POST request to the server with the form data
    await axios.post("http://localhost:5000/contacts", {
      first_name, // Send the 'first_name' state as part of the request body
      last_name, // Send the 'last_name' state as part of the request body
    });

    // Clear the form inputs after submission
    setfirst_name(""); // Reset the 'first_name' state to an empty string
    setlast_name(""); // Reset the 'last_name' state to an empty string
    refresh(); // Call the refresh function to trigger a re-render or fetch updated data
  };

  // Render the form UI
  return (
    <form onSubmit={handleSubmit}> {/* Attach the handleSubmit function to the form's onSubmit event */}
      <input
        placeholder="first_name" // Placeholder text for the first_name input
        value={first_name} // Bind the input value to the 'first_name' state
        onChange={(e) => setfirst_name(e.target.value)} // Update the 'first_name' state when the input changes
        required // Make the input field required
      />
      <input
        placeholder="last_name" // Placeholder text for the last_name input
        value={last_name} // Bind the input value to the 'last_name' state
        onChange={(e) => setlast_name(e.target.value)} // Update the 'last_name' state when the input changes
        required // Make the input field required
      />
      <button type="submit">Ok</button> {/* Submit button to trigger form submission */}
    </form>
  );
};

export default ContactForm;
