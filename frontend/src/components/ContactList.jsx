// Importing necessary modules from React and axios for state management, side effects, and HTTP requests
import React, { useEffect, useState } from "react";
import axios from "axios";
import DeleteBtn from "./DeleteBtn"; // Importing the DeleteBtn component for deleting contacts
import { useRefresh } from "./useRefresh";

// Defining the ContactList functional component
const ContactList = ({query}) => {
  const { refreshCounter } = useRefresh();

  // State to store the list of contacts, initialized as an empty array
  const [contacts, setContacts] = useState([{
    "created_at": "error",
    "first_name": "error",
    "id": 0,
    "last_name": "error"
  },]);
  useEffect(() => {
    console.log("Display refreshed! Counter:", refreshCounter);
    // Fetch data or do whatever refresh action you need here
    fetchSql(); // Call the function to fetch data when refreshCounter changes
  }, [refreshCounter]);


  const fetchSql = async () => {
    try {
      const response = await axios.get("http://localhost:5000/contacts", {
        params: {
          sql: query,
        },
      });
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching SQL:", error);
    }
  };
  // Function to fetch contacts from the backend API

  // useEffect hook to fetch contacts when the component is mounted
  useEffect(() => {
    fetchSql(); // Calling the fetchContacts function
  }, []); // Empty dependency array ensures this runs only once

  // Rendering the component's UI
  return (
    <div>
      {/* Heading for the contact list */}
      <h2>All Contacts</h2>
      
      <table>
        <thead>
          <tr>
            {Object.keys(contacts[0]).map((key) => <th key={key}>{key}</th>)}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Iterating over the contacts array to display each contact */}
          {contacts.map((contact) => (
            <tr key={contact.id}>
              {/* Displaying each contact's details in table cells */}
              {Object.keys(contact).map((key) => (
                <td key={key}>{contact[key]}</td>
              ))}
              <td>
                <DeleteBtn contId={contact.id}  />
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