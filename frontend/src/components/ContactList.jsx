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
      
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>crated_at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Iterating over the contacts array to display each contact */}
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td>{contact.first_name}</td>
              <td>{contact.last_name}</td>
              <td>{contact.created_at}</td>
              <td>
                <DeleteBtn contId={contact.id} onDelete={fetchContacts} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Exporting the ContactList component as the default export
export default ContactList;