import React, { useState } from "react";
import axios from "axios";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [occupation, setOccupation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/contacts", {
      name,
      occupation,
    });
    setName("");
    setOccupation("");
    window.location.reload(); // refresh contact list
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Contact</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        placeholder="Occupation"
        value={occupation}
        onChange={(e) => setOccupation(e.target.value)}
        required
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default ContactForm;
