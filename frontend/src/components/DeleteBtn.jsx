// Importing necessary modules from React and axios for state management, side effects, and HTTP requests
import React, { useEffect, useState } from "react";
import axios from "axios";

// Defining the ContactList functional component
const DeleteBtn = () => {
  // State to store the list of contacts, initialized as an empty array
  const [contacts, setContacts] = useState([]);

  // Function to fetch contacts from the backend API
  const fetchContacts = async () => {
    // Making a GET request to the API endpoint
    const response = await axios.get("http://localhost:5000/contacts");
    // Updating the state with the fetched data
    setContacts(response.data);
  };

  // useEffect hook to fetch contacts when the component is mounted
  useEffect(() => {
    fetchContacts(); // Calling the fetchContacts function
  }, []); // Empty dependency array ensures this runs only once

  // Rendering the component's UI
  return (
    <button
      onClick={async () => {
        // Making a DELETE request to the API endpoint to delete a contact
        await axios.delete("http://localhost:5000/contacts/1"); // Replace '1' with the actual contact ID to delete
        fetchContacts(); // Refresh the contact list after deletion
      }}>delete</button>
  );
};

// Exporting the ContactList component as the default export
export default ContactList;