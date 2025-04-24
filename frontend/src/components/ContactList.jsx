// Importing necessary modules from React and axios for state management, side effects, and HTTP requests
import React, { useEffect, useState } from "react";
import axios from "axios";
import DeleteBtn from "./DeleteBtn"; // Importing the DeleteBtn component for deleting contacts

// Defining the ContactList functional component
const ContactList = () => {
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
    <div>
      {/* Heading for the contact list */}
      <h2>All Contacts</h2>
      <ul>
        {/* Iterating over the contacts array to display each contact */}
        {contacts.map((contact) => (
          <li key={contact.id}>
            {/* Displaying the contact's name in bold and their occupation */}
            <span>{contact.first_name} {contact.last_name}</span>
            <DeleteBtn contId={contact.id} onDelete={fetchContacts}/>
          </li> 
        ))}
      </ul>
    </div>
  );
};

// Exporting the ContactList component as the default export
export default ContactList;