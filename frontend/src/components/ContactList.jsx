import React, { useEffect, useState } from "react";
import axios from "axios";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);

  const fetchContacts = async () => {
    const response = await axios.get("http://localhost:5000/contacts");
    setContacts(response.data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div>
      <h2>All Contacts</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <strong>{contact.name}</strong> – {contact.occupation}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;